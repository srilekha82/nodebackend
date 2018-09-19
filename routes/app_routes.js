module.exports = function(app, db) {
  var questionService = require('../services/QuestionService');
  var answerService = require('../services/AnswerService');
  var notificationService = require('../services/NotificationService');
  var helperService = require('../services/HelperService');
  var contributionService = require('../services/ContributionService');
  var profileService = require('../services/ProfileService');
  var validator = require('../util/RequestValidator');
  var logger = require('../util/Logger');
  const util = require('util');

  app.all('/*', validator.validate);

  app.post('/question', (req, res, next) => {
    // You'll create your question here.
    const postFunc = util.promisify(questionService.postQuestion);
    logger.debug('Posting Question with data as: ' + req.body);
    postFunc(req.body, validator.getUserId()).then(function(result) {
        logger.info('Question created');
        res.send(result);
      })
      .catch(function(error) {
        // Handle error
        logger.error('Error in posting question: ' + error.message);
        next(error);
      });
  });

  app.post('/answer', (req, res, next) => {
    // You'll create your answer here.
    const postFunc = util.promisify(answerService.postAnswer);
    logger.debug('Posting Answer with data as: ' + req.body);
    postFunc(req.body, validator.getUserId()).then(function(result) {
        logger.info('Answer created');
        res.send(result);
      })
      .catch(function(error) {
        // Handle error
        logger.error('Error in posting answer:' + error.message);
        next(error);
      });

  });

  app.put('/updateQuestionStatus/:id', (req, res, next) => {
    // You'll update question status.
    const putFunc = util.promisify(questionService.updateQuestionStatus);
    logger.debug('Updating Question status for questionid: ' + req.params.id);
    putFunc(req.params.id, req.body).then(function(result) {
        res.send(result);
      })
      .catch(function(error) {
        // Handle error
        logger.error('Error updating question status: ' + error.message);
        next(error);
      });
  });

  app.get('/notification/:id', (req, res, next) => {
    // You'll get notification.//should be userid from requestheader
    const getFunc = util.promisify(notificationService.getNotifications);
    getFunc(req.params.id).then(function(result) {
        res.send(result);
      })
      .catch(function(error) {
        // Handle error
        logger.error('Error in getting user notification: ' + error.message);
        next(error);
      });
  });

  app.get('/categories', (req, res, next) => {
    logger.debug('get Categories');
    res.send(helperService.getCategories());

  });

  app.get('/myContributions/:id', (req, res, next) => {
    // You'll get person's contributions. userid should be got from heder
    const getFunc = util.promisify(contributionService.getMyContributions);
    logger.debug('Get contributions for: ' + req.params.id);
    getFunc(req.params.id, validator.getUserRole()).then(function(result) {
        res.send(result);
      })
      .catch(function(error) {
        // Handle error
        logger.error('Error in getting user contributions: ' + error.message);
        next(error);
      });
  });

  app.get('/getSpecificQuestion/:id', (req, res, next) => {
    logger.debug('Get data for question: ' + req.params.id);
    const getFunc = util.promisify(questionService.getQuestionData);
    getFunc(req.params.id).then(function(result) {
        res.send(result);
      })
      .catch(function(error) {
        logger.error('Error in getting data for specific question: ' + error.message);
        next(error);
      });
  });

  app.get('/getAllQuestions', (req, res, next) => {
    const getFunc = util.promisify(contributionService.getAllQuestions);
    logger.debug('Querying questions for categories and subcategory: ' + req.query);
    getFunc(req.query.categoryId, req.query.subCategoryId).then(function(result) {
        res.send(result);
      })
      .catch(function(error) {
        // Handle error
        logger.error('Error in getting all questions: ' + error.message);
        next(error);
      });
  });

  app.post('/updateprofile/:id', (req, res, next) => {
    const postFunc = util.promisify(profileService.updateProfile);
    logger.debug('Update profile for user: ' + req.body);
    postFunc(req.body, req.params.id).then(function(result) {
        res.send(result);
      })
      .catch(function(error) {
        logger.error('Error in updating profile: ' + error.message);
        next(error);
      });

  });

  app.get('/getProfile/:id', (req, res, next) => {
    logger.debug('get profile for user: ' + req.params.id);
    const getFunc = util.promisify(profileService.getProfile);
    getFunc(req.params.id).then(function(result) {
        res.send(result);
      })
      .catch(function(error) {
        logger.error('Error in get profile: ' + error.message);
        next(error);
      });
  });

};