// Quiz Controller

// Importación de los modelos de datos.
var models = require("../models./models.js");

// GET /quizes/question
exports.question = function(req, res) {
    models.Quiz.findAll().success(function(rows) {
        // Manejo de evento success de findAll()
        var enunciado = rows[0].pregunta;
        // public/quizes/question.ejs
        res.render('quizes/question', { pregunta: enunciado });
    });
};

// GET /quizes/answer
exports.answer = function(req, res) {
    models.Quiz.findAll().success(function(rows) {
        var resp = rows[0].respuesta;
        // public/quizes/answer.ejs
        if (req.query.respuesta === resp){
           res.render('quizes/answer', {respuesta: 'Correcto'});
        } else {
           res.render('quizes/answer', {respuesta: 'Incorrecto'});
        }
    });
};

exports.author = function(req, res) {
   // public/author.ejs
   res.render('author', {});
};