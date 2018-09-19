// server.js
const express = require('express');
const app = express();
var bodyParser = require('body-parser');
var config = require('./config');
var passport = require("passport");
var logger = require('./util/Logger.js');
var question = require('./models/Question');
const port = config.app.port;
var swaggerUi = require('swagger-ui-express'),
	swaggerDocument = require('./swagger.json');
const env = process.env.NODE_ENV || 'development';
app.listen(port, () => {
	logger.info('We are live on ' + port);
});
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

if (env !== 'Production') {
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

}

require('./routes')(app, {});
app.use((err, req, res, next) => {
	// log the error...
	res.status(err.httpStatusCode ? err.httpStatusCode : 500).json(err);
});