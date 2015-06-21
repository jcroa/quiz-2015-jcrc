var express = require('express');
var router = express.Router();

///
/// require módulos propios
///

// primera pregunta
var quizController = require('../controllers/quiz_controller');

console.log("Router. Iniciando ...");

/* GET home page. */
router.get('/', function(req, res) {
  //  views/index.ejs  más parámetros.
  res.render('index', { title: 'Quiz' });
});

// Autoload para comandos get que incluyan :quizId
router.param("quizId",      quizController.load); // autoload :quizId

// Definición de rutas de /quizes
router.get('/quizes',                       quizController.index);
router.get('/quizes/:quizId(\\d+)',         quizController.show);
router.get('/quizes/:quizId(\\d+)/answer',  quizController.answer);

router.get('/author',   quizController.author);

module.exports = router;

console.log("Router. OK");

