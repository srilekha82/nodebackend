var dbHelper = require('../util/DBHelper');
const util = require('util');
const tableName = 'Question';
const getData = util.promisify(dbHelper.selectData);
var logger = require('../util/Logger');

function getMyContributions(userId, role, callback) {
  logger.info('Getting contributions for user  ' + userId + ' and role:' + role);
  var condition = {};
  if (role === 'Student') {
    condition = {
      'studentId': userId
    };
  } else {
    condition = {
      'professionalIds': userId
    }
  }
  getData(tableName, condition).then(function (result) {
      var response = [];
      var i;
      for (i = 0; i < result.length; i++) {
        response[i] = {};
        response[i].updatedBy = result[i].updatedBy;
        response[i].countofupdates = result[i].countofupdates;
        response[i].textQuestion = result[i].textQuestion;
        response[i].status = result[i].status;
        response[i].updateTime = result[i].updateTime;
      }
      logger.debug('Contributions are: ' + result.length);
      callback(null, response);
    })
    .catch(function (error) {
      // Handle error
      logger.error('Errored out in getting user contributions: ' + error.message);
      callback(error);
    });
}

function getAllQuestions(catId, subcatId, callback) {
  var condition = {
    'categoryId': catId,
    'subCategoryId': subcatId
  };
  getData(tableName, condition).then(function (result) {

      callback(null, result);
    })
    .catch(function (error) {
      // Handle error
      logger.error('Errored out in getting all the questions : ' + error.message);
      callback(error);
    });
}


module.exports.getMyContributions = getMyContributions;
module.exports.getAllQuestions = getAllQuestions;