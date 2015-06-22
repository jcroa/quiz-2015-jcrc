// Quiz Controller

// Importación de los modelos de datos.
var models = require("../models/models.js");

// Autoload - factoriza el c´çodigo si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
    console.log("load - buscando quiizId = " + quizId + " ...");
    models.Quiz.find(quizId).then(
        // Manejo de evento success de find()
        function(quiz) {
            if (quiz) {
                // agregamos al objeto Request:
                req.quiz = quiz;
                console.log("load - encontrado " + quiz.pregunta);
                next();
            } else {
                next(new Error("No existe quizId=" + quizId));
            }
        }   
    ).catch(
        function(err) {
            // manejo del evento de error de find()
            console.log("load - error interno " + err.message);
            next(err);
        }
    );
};

// GET /quizes/
exports.index = function(req, res) {
    // parámetro search es una opción.
    var text = req.query.search;
    var filter = {}; // sin filtro
    if (text) {
        var containing = text.replace(" ", "%");
        filter = { 
            where: [" pregunta like ?", '%' + containing + '%' ],
            order: "pregunta ASC" };
        console.log("index - preguntas con filtro: " + containing);
    } else {
        console.log("index - preguntas sin filtro");
    }
    models.Quiz.findAll(filter).then(function(quizes) {
        // Manejo de evento success de findAll()
        res.render('quizes/index', { quizes: quizes, filter: text });
    });
};

// GET /quizes/:id
exports.show = function(req, res) {
    // previo load
    console.log("Controller: pregunta pedida: " + req.quiz.id);
    res.render('quizes/show', {quiz: req.quiz});
};

// GET /quizes/answer
exports.answer = function(req, res) {
    // previo load
    var resultado = 'Incorrecto';
    if (req.query.respuesta === req.quiz.respuesta) {
        resultado = 'Correcto';
    } 
    res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
};

exports.author = function(req, res) {
   // public/author.ejs
   res.render('author', {});
};