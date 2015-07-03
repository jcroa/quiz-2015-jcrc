var express = require('express');
var router = express.Router();

///
/// require módulos propios
///

// controladores
var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');

console.log("Router. Iniciando ...");

/* GET home page. */
router.get('/', function(req, res) {
  //  views/index.ejs  más parámetros.
  res.render('index', { title: 'Quiz', errors: [] });
});

router.get('/quizes/searching', function(req, res) {
  //  quizes/searching.ejs  más parámetros.
  res.render('quizes/searching', {});
});

// Autoload para comandos get que incluyan :quizId
router.param("quizId",      quizController.load); // autoload :quizId

// Definición de rutas de /quizes
router.get('/quizes',                       quizController.index);
router.get('/quizes/:quizId(\\d+)',         quizController.show);
router.get('/quizes/:quizId(\\d+)/answer',  quizController.answer);
// creación de preguntas
router.get('/quizes/new',                   quizController.new);
router.post('/quizes/create',               quizController.create);
// modificación de preguntas
router.get('/quizes/:quizId(\\d+)/edit',    quizController.edit);
router.put('/quizes/:quizId(\\d+)',         quizController.update);
// borrado de preguntas
router.delete('/quizes/:quizId(\\d+)',      quizController.destroy);
// creación de comentarios
router.get('/quizes/:quizId(\\d+)/comments/new',   commentController.new);
router.post('/quizes/:quizId(\\d+)/comments',       commentController.create);

router.get('/author',   quizController.author);

module.exports = router;

console.log("Router. OK");

