const util = require('util');
var dbHelper = require('../util/DBHelper');
var logger = require('../util/Logger');
const tableName = 'Question';
var answer = require('../models/Answer');
var question = require('../models/Question');
var notif = require('../models/Notification');
var moment = require('moment');
const getData = util.promisify(dbHelper.selectData);
const updateData = util.promisify(dbHelper.updateData);
var notifService = require('./NotificationService');
const createOrUpdateNotif = util.promisify(notifService.createOrUpdateNotif);

function postAnswer(req, userId, callback) {
  var answerobj = answer.populateAnswer(req.answerText, userId, req.userName);
  var condition = question.getConditionObject(req.questionId);
  getData(tableName, condition).then(function (result) {
      var resp = result[0];
      if (!resp) {
        var err = new Error();
        err.message = 'Requested question id is not present';
        err.httpStatusCode = 400;
        callback(error);
      }
      var tempQue = question.populateProfessionalIds(resp, userId);
      if (resp.level == 0) {
        tempQue.level = resp.level + 1;
      } else {
        tempQue.level = resp.level;
      }

      if (!req.subQuestionId) { // answer of top level question
        logger.info('Creating first level answer for: ' + req.questionId);
        tempQue.answers = question.populateAnswerObj(resp, answerobj);
        var updateObj = question.populateQuestion(resp.countOfUpdates + 1, req.userName, tempQue);

        updateData(tableName, updateObj, condition).then(function (updateResult) {
            //notify the person who asked the question.
            var notifObj = notif.populateNotificationData(req.questionId, resp.studentId, req.userName, resp.textQuestion);
            createOrUpdateNotif(notifObj).then(function (notifResult) {
              logger.info('Notif update successful :' + notifResult);
            }).catch(function (error) {
              logger.error('Notif creation failed :' + error);
            });
            callback(null, 'OK');
          })
          .catch(function (error) {
            // Handle error
            logger.error(error.message);
            callback(error);
          });

      } else {
        logger.info('Creating follow-up answer for question' + req.questionId);

        tempQue.answers = answer.updateFollowupAnswer(resp, req.subQuestionId, answerobj);

        var updateObj = question.populateQuestion(resp.countofupdates + 1, req.userName, tempQue);
        updateData(tableName, updateObj, condition).then(function (updatedResult) {
            //notify the person who asked the question.
            var notifObj = notif.populateNotificationData(req.questionId, resp.studentId, req.userName, resp.textQuestion);
            createOrUpdateNotif(notifObj).then(function (notifResult) {
              logger.info('Notif update successful: ' + notifResult);
            }).catch(function (error) {
              logger.error('Notif creation failed: ' + error.message);
            });
            callback(null, 'OK');
          })
          .catch(function (error) {
            // Handle error
            logger.error('Error in creating follow up answer:' + error.message);
            callback(error);
          });
      }
    })
    .catch(function (error) {
      // Handle error
      logger.error('Error while getting data to update while posting answer: ' + error.message);
      callback(error);
    });
}


module.exports.postAnswer = postAnswer;