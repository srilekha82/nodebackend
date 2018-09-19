var ObjectId = require('mongodb').ObjectID;
var moment = require('moment');
var logger = require('../util/Logger');
//populate the answer and metadata
function populateAnswer(answerText, userId, userName) {
	var answerobj = {};
	answerobj.answerId = new ObjectId();
	answerobj.answerText = answerText;
	answerobj.professorId = userId;
	answerobj.profName = userName;
	return answerobj;
}

function getUpdatedAnswerMetadata(result, req) {
	var returnAnswerMetadata = {};
	var answerObject = [];
	var allAnswers = [];
	result.answers.filter(function (answer) {
		if (answer.answerId == req.answerId) {
			answerObject.push(answer);
		} else {
			allAnswers.push(answer);
		}
	});
	answerObject[0].question = {};
	answerObject[0].question.subQuestionId = req.answerId + '.1';
	answerObject[0].question.subQuestionText = req.subQuestionText;

	allAnswers.push(answerObject[0]);
	returnAnswerMetadata.answers = allAnswers;
	returnAnswerMetadata.professorId = answerObject[0].professorId;
	return returnAnswerMetadata;

}

function updateFollowupAnswer(resp, subQuestionId, answerObj) {
	var questionObject = [];
	var allAnswers = [];

	resp.answers.filter(function (answer) {
		if (answer.question) {
			if (answer.question.subQuestionId == subQuestionId) {
				questionObject.push(answer);
				logger.info('push subquestion');
			} else {
				allAnswers.push(answer); // there should not be two questions on 1 answer. Max one followupquestion is allowed
			}
		} else {
			allAnswers.push(answer);
		}
	});
	if (!questionObject[0].question.subAnswers) {
		questionObject[0].question.subAnswers = [];
		questionObject[0].question.subAnswers.push(answerObj);
	} else {
		questionObject[0].question.subAnswers.push(answerObj);
	}

	allAnswers.push(questionObject[0]);
	return allAnswers;
}
//populate the subquestion added to the answer

module.exports.populateAnswer = populateAnswer;
module.exports.getUpdatedAnswerMetadata = getUpdatedAnswerMetadata;
module.exports.updateFollowupAnswer = updateFollowupAnswer;