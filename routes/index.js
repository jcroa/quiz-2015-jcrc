var express = require('express');
var router = express.Router();

///
/// require módulos propios
///

// primera pregunta
var quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res) {
  //  views/index.ejs  más parámetros.
  res.render('index', { title: 'Quiz demo' });
});


// primera pregunta
router.get('/quizes/question', quizController.question);
router.get('/quizes/answer',   quizController.answer);


module.exports = router;
