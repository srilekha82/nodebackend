var config = require('../config');
var passport = require("passport");
var BearerStrategy = require('passport-azure-ad').BearerStrategy;
var logger = require('../util/Logger');
const env = process.env.NODE_ENV || 'development';
var options = {
  identityMetadata: `https://login.microsoftonline.com/${config.envValues[env].tenantName}.onmicrosoft.com/v2.0/.well-known/openid-configuration`,
  clientID: config.envValues[env].clientID,
  loggingLevel: 'info',
  policyName: config.envValues.policyName,
  isB2C: true,
  validateIssuer: true,
  loggingLevel: 'info',
  passReqToCallback: false
};
var bearerStrategy = new BearerStrategy(options, function (token, done) {
  // Send user info using the second argument
  logger.info('successfully got token');
  done(null, {}, token);
});
var userId, userRole;
passport.use(bearerStrategy);

function validate(req, res, next) {
  var err;
  if (!req.headers.authorization) {
    err = new Error();
    err.message = 'Missing Auth Header';
    err.httpStatusCode = 401;
    return next(err);
  }
  passport.authenticate('oauth-bearer', function (error, user, info) {
    if (error) return next(error);
    // backend azure ad b2c service not available
    if (info.syscall && info.errno) {
      info.httpStatusCode = 503;
      return next(info);
    }
    if (!user) {
      err = new Error();
      err.message = ('Invalid auth token');
      err.httpStatusCode = 401;
      return next(err);
    }
    userId = info.oid;
    userRole = info.extension_Role;
    return next();
  })(req, res, next);
};

function getUserId() {
  return userId;
}

function getUserRole() {
  return userRole;
}
module.exports.validate = validate;
module.exports.getUserId = getUserId;
module.exports.getUserRole = getUserRole;