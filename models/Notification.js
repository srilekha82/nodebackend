var moment = require('moment');

function populateNotificationData(questionId, userId, updateAuthor, textQuestion) {
	var notif = {}
	var timestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
	notif.questionId = questionId;
	notif.userId = userId;
	notif.updateTime = timestamp;
	notif.updateAuthor = updateAuthor;
	notif.textQuestion = textQuestion;
	return notif;
}
module.exports.populateNotificationData = populateNotificationData;