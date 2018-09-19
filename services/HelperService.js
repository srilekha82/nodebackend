const util = require('util');
const path = require('path');
var logger = require('../util/Logger');
const fs = require('fs');
const readFileAsync = util.promisify(fs.readFile);

function getCategories() {
	try {
		const file = fs.readFileSync(path.resolve(__dirname, '../assets/categories.json'));
		return JSON.parse(file);
	} catch (error) {
		logger.error('Error reading file: ' + error.message);
		throw error;
	}

}


module.exports.getCategories = getCategories;