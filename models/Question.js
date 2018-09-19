var moment = require('moment');
var ObjectId = require('mongodb').ObjectID;
//populate the question and its metadata
function populateQuestion(countofupdates, updatedBy, question) {
	var questionObject = {};
	var timestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
	questionObject.updateTime = timestamp;
	questionObject.countOfUpdates = countofupdates;
	questionObject.updatedBy = updatedBy;
	questionObject.level = question.level;
	if (question.textQuestion)
		questionObject.textQuestion = question.textQuestion;
	if (question.studentId)
		questionObject.studentId = question.studentId;
	if (question.studentName)
		questionObject.studentName = question.studentName;
	if (question.categoryId)
		questionObject.categoryId = question.categoryId;
	if (question.subCategoryId)
		questionObject.subCategoryId = question.subCategoryId;
	if (question.status)
		questionObject.status = question.status;
	if (question.answers)
		questionObject.answers = question.answers;
	if (question.professionalIds)
		questionObject.professionalIds = question.professionalIds;
	return questionObject;
}
//populdate all professionals updating the question
function populateProfessionalIds(resp, userId) {
	var ret = {};
	if (!resp.professionalIds) {
		ret.professionalIds = [];
		ret.professionalIds[0] = userId;
	} else if (!resp.professionalIds.includes(userId)) {
		ret.professionalIds = resp.professionalIds;
		ret.professionalIds.push(userId);
	}
	return ret;

}
//populate answer array in question
function populateAnswerObj(resp, answerobj) {
	var answers = [];
	if (!resp.answers) {
		answers.push(answerobj);
	} else {
		answers = resp.answers;
		answers.push(answerobj);
	}
	return answers;
}

function getConditionObject(questionId) {
	return condition = {
		'_id': new ObjectId(questionId)
	};
}

module.exports.populateQuestion = populateQuestion;
module.exports.populateProfessionalIds = populateProfessionalIds;
module.exports.populateAnswerObj = populateAnswerObj;
module.exports.getConditionObject = getConditionObject;