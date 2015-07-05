var express = require('express');
var router = express.Router();

///
/// require módulos propios
///

// controladores
var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');

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

// Autoload para comandos get que incluyan :quizId y _commentId
router.param("quizId",         quizController.load); // autoload :quizId
router.param("commentId",      commentController.load); // autoload :commentId

// Definición de rutas de sesiones
router.get('/login',       sessionController.new);  // formulario login
router.post('/login',      sessionController.create);  // crear sesión
router.delete('/logout',   sessionController.destroy); // destruir sesión

// Definición de rutas de quizes
router.get('/quizes',                       quizController.index);
router.get('/quizes/:quizId(\\d+)',         quizController.show);
router.get('/quizes/:quizId(\\d+)/answer',  quizController.answer);

// creación, modificación y botrado de preguntas. Requeire de autorización especial
router.get('/quizes/new',                   sessionController.loginRequired,  quizController.new);
router.post('/quizes/create',               sessionController.loginRequired,  quizController.create);
router.get('/quizes/:quizId(\\d+)/edit',    sessionController.loginRequired,  quizController.edit);
router.put('/quizes/:quizId(\\d+)',         sessionController.loginRequired,  quizController.update);
router.delete('/quizes/:quizId(\\d+)',      sessionController.loginRequired,  quizController.destroy);

// Definición de rutas de comentarios
router.get('/quizes/:quizId(\\d+)/comments/new',   commentController.new);
router.post('/quizes/:quizId(\\d+)/comments',       commentController.create);
router.put('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish',  
                                            sessionController.loginRequired, commentController.publish);

router.get('/author',   quizController.author);

module.exports = router;

console.log("Router. OK");

