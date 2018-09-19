const appRoutes = require('./app_routes');
module.exports = function(app, db) {
	appRoutes(app, db);
	// Other route groups could go here, in the future
};