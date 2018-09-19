const util = require('util');
const acquireToken = util.promisify(acquireTokenForApplication);
const request = require('request');
var config = require('../config');
const AuthenticationContext = require("adal-node").AuthenticationContext;
const env = process.env.NODE_ENV || 'development';
const tenant = config.envValues[env].tenantName + '.onmicrosoft.com';
const authority = 'https://login.microsoftonline.com/' + tenant;
var logger = require('../util/Logger');
const authenticationContext = new AuthenticationContext(authority);
var profile = require('../models/UserProfile');

function getProfile(userId, callback) {
  logger.info('Get profile for user', userId);
  const getFunc = util.promisify(request.get);
  acquireToken(config.envValues.graphClientID, config.envValues.graphClientCreds).then(function (token) {
    getFunc({
        url: 'https://graph.windows.net/' + encodeURIComponent(tenant) + '/users/' + userId + '?api-version=1.6',
        auth: {
          bearer: token
        }
      }).then(function (result) {
        logger.debug('Profile returned', result);
        if (!result) {
          var err = new Error();
          err.Message = 'UserId not found';
          err.httpStatusCode = 404;
          callback(err);
        }
        var resp = JSON.parse(result.body);
        var userProfile = profile.populateUserProfile(resp);

        callback(null, userProfile);
      })
      .catch(function (error) {
        // Handle error
        logger.error(error);
        callback(error);
      })
  }).catch(function (error) {
    // Handle error
    logger.error('Error getting profile', error.message);
    callback(error);
  });

}

function updateProfile(userProfile, userId, callback) {
  logger.info('Update profile for user', userProfile);
  const patchFunc = util.promisify(request.patch);
  acquireToken(config.envValues.graphClientID, config.envValues.graphClientCreds).then(function (token) {
      patchFunc({
          url: 'https://graph.windows.net/' + encodeURIComponent(tenant) + '/users/' + userId + '?api-version=1.6',
          auth: {
            bearer: token
          },
          body: userProfile,
          json: true
        }).then(function (result) {
          callback(null, result.body);
        })
        .catch(function (error) {
          // Handle error
          logger.error('Error updating profile', error.message);
          callback(error);
        })
    })
    .catch(function (error) {
      // Handle error
      logger.error(error);
      callback(error);
    });
}

function acquireTokenForApplication(clientId, clientSecret, callback) {
  authenticationContext.acquireTokenWithClientCredentials("https://graph.windows.net/", clientId, clientSecret, function (err, tokenResponse) {
    if (err) {
      logger.error('Error in getting auth token', error.message);
      callback(err);
    }
    callback(null, tokenResponse.accessToken);
  });
}

module.exports.updateProfile = updateProfile;
module.exports.getProfile = getProfile;