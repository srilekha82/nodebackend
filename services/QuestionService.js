var question = require('../models/Question');
var answer = require('../models/Answer');
var notif = require('../models/Notification');
var dbHelper = require('../util/DBHelper');
const util = require('util');
var config = require('../config');
var notifService = require('./NotificationService');
var logger = require('../util/Logger');
const tableName = 'Question';
const getData = util.promisify(dbHelper.selectData);
const createData = util.promisify(dbHelper.insertData);
const updateData = util.promisify(dbHelper.updateData);
const createOrUpdateNotif = util.promisify(notifService.createOrUpdateNotif);


function postQuestion(req, userId, callback) {
  //create question data from front end
  if (!req.questionId) {
    //NO question id. so create a question
    logger.info('Posting a question');

    req.studentId = userId;
    req.studentName = req.userName;
    req.status = 'active';
    req.level = 0;
    var questionObj = question.populateQuestion(1, req.userName, req);
    createData(tableName, questionObj).then(function (result) {
        callback(null, result);
      })
      .catch(function (error) {
        // Handle error
        logger.error('Error posting a question', error.message);
        callback(error);
      });
  } else {
    //second level question. followup question raised for answer
    var condition = question.getConditionObject(req.questionId);
    logger.info('Follow up question');
    //get the question on which there is a followup question
    getData(tableName, condition).then(function (response) {
        var result = response[0];
        if (!validateResult(result)) {
          var err = new Error();
          err.message = 'Bad request data, please check';
          err.httpStatusCode = 400;
          callback(error);
        }
        // get the answer on which followup question is asked and modify it.
        var tempQue = {};
        var updatedAns = answer.getUpdatedAnswerMetadata(result, req);
        tempQue.answers = updatedAns.answers;
        tempQue.level = result.level + 1;
        var questionObj = question.populateQuestion(result.countofupdates + 1, result.studentName, tempQue);

        updateData(tableName, questionObj, condition).then(function (updateResult) {
            // raise notification for the person who answered.
            var notifObj = notif.populateNotificationData(req.questionId, updatedAns.professorId, result.studentName, result.textQuestion);
            createOrUpdateNotif(notifObj).then(function (notifResult) {
              logger.info('Notif update successful', notifResult);
            }).catch(function (error) {
              logger.error('Notif creation failed', error);
            });
            callback(null, updateResult);
          })
          .catch(function (error) {
            // Handle error
            logger.error('Error posting a follow up question', error.message);
            callback(error);
          });
      })
      .catch(function (error) {
        // Handle error
        logger.error('Error in getting data while posting question', error.message);
        callback(error);
      });
  }
}

//when resolving question
function updateQuestionStatus(questionId, req, callback) {
  var updateobj = {};
  updateobj.status = req.status;
  var condition = question.getConditionObject(questionId);
  updateData(tableName, updateobj, condition).then(function (result) {
      callback(null, 'OK');
    })
    .catch(function (error) {
      // Handle error
      logger.error('Error in updating question', error.message);
      callback(error);
    });
}

//get the data for guven question
function getQuestionData(questionId, callback) {
  var condition = question.getConditionObject(questionId);
  getData(tableName, condition).then(function (result) {
      var resp = {};
      if (result.length > 0) {
        resp.question = result[0].textQuestion;
        resp.questionId = questionId;
        resp.answers = result[0].answers;
        resp.level = result[0].level;
        resp.status = result[0].status;
      }
      callback(null, resp);
    })
    .catch(function (error) {
      // Handle error
      logger.error('Error in getting question data', error.message);
      callback(error);
    });
}

//for followup question
function validateResult(result) {
  return (result && result.answers);
}

module.exports.postQuestion = postQuestion;
module.exports.updateQuestionStatus = updateQuestionStatus;
module.exports.getQuestionData = getQuestionData;