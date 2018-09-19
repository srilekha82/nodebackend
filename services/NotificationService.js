var dbHelper = require('../util/DBHelper');
const util = require('util');
var config = require('../config');
var logger = require('../util/Logger');

const tableName = 'Notification';
var moment = require('moment');
const getData = util.promisify(dbHelper.selectData);
const createData = util.promisify(dbHelper.insertData);
const updateData = util.promisify(dbHelper.updateData);

function getNotifications(userId, callback) {
  logger.info('Get notification for', userId);
  var condition = {
    'userId': userId
  };
  getData(tableName, condition).then(function (result) {
      var response = [];
      if (result.length > 0) {
        for (var i = 0; i < result.length; i++) {
          response[i] = {};
          response[i].textQuestion = result[i].textQuestion;
          response[i].updatedBy = result[i].updatedBy;
          response[i].updatedOn = result[i].updateTime;
        }
      }
      callback(null, response);
    })
    .catch(function (error) {
      // Handle error
      logger.error('Error in getting the user notifications', error.message);
      callback(error);
    });
}

function createOrUpdateNotif(notif, callback) {
  var condition = {
    'questionId': notif.questionId
  };
  getData(tableName, condition).then(function (result) {
      if (result && result.length > 0) {
        updateData(tableName, notif, condition).then(function (result) {
            callback(null, 'OK');
          })
          .catch(function (error) {
            // Handle error
            logger.error(error);
            callback(error);
          });
      } else {
        createData(tableName, notif).then(function (result) {
            callback(null, 'OK');
          })
          .catch(function (error) {
            // Handle error
            logger.error(error);
            callback(error);
          });
      }
    })
    .catch(function (error) {
      // Handle error
      logger.error('Error in creating notif', error.message);
      callback(error);
    });
}


module.exports.getNotifications = getNotifications;
module.exports.createOrUpdateNotif = createOrUpdateNotif;