var config = require('../config');
var MongoClient = require('mongodb').MongoClient;
var logger = require('../util/Logger');
const env = process.env.NODE_ENV || 'development';


function selectData(collectionName, conditionObject, callback) {
  logger.debug('Selecting data for' + collectionName + 'and condition' + conditionObject);
  MongoClient.connect(config.db[env].url, {
    useNewUrlParser: true
  }, function (err, client) {
    if (err) {
      callback(err);
    }
    if (client) {
      var collection = client.db(config.db.dbName).collection(collectionName);
      collection.find(conditionObject).toArray(function (error, results) {
        if (error) {
          callback(error);
        }
        logger.debug('The solution is: ' + results);
        client.close();
        callback(null, results);
      });

    } else {
      var err = new Error();
      err.message = 'Cannot connect to DB. Please try again';
      err.httpStatusCode = 503;
      callback(err);
    }

  })
}

//insert
function insertData(collectionName, object, callback) {
  logger.debug('Inserting data for' + collectionName + 'object ' + object);

  MongoClient.connect(config.db[env].url, {
    useNewUrlParser: true
  }, function (err, client) {
    if (err) {
      callback(err);
    }
    if (client) {

      var collection = client.db(config.db.dbName).collection(collectionName);
      collection.insertOne(object, function (error, results) {
        client.close();
        if (!error) {
          logger.debug('Object Inserted');
          callback(null, 'OK');
        } else {
          callback(error);
        }
      });
    } else {
      var err = new Error();
      err.message = 'Cannot connect to DB. Please try again';
      err.httpStatusCode = 503;
      callback(err);
    }

  });
}

//update
function updateData(collectionName, object, conditionObject, callback) {
  logger.debug('Updating data for :' + collectionName + 'and object:' + object);
  logger.debug('Condition to update :' + conditionObject);
  MongoClient.connect(config.db[env].url, {
    useNewUrlParser: true
  }, function (err, client) {
    if (err) {
      callback(err);
    }
    if (client) {
      var collection = client.db(config.db.dbName).collection(collectionName);
      collection.updateOne(conditionObject, {
        $set: object
      }, function (error, results, fields) {
        if (error) {
          callback(error);
        }
        logger.debug('Object Updated');
        client.close();
        callback(null, 'OK');
      });
    } else {
      var err = new Error();
      err.message = 'Cannot connect to DB. Please try again';
      err.httpStatusCode = 503;
      callback(err);
    }
  })
}


module.exports.insertData = insertData;
module.exports.selectData = selectData;
module.exports.updateData = updateData;