// Quiz Controller

// Importación de los modelos de datos.
var models = require("../models/models.js");


// GET /quizes/:quizId/comments/new 
exports.new = function(req, res) {
    console.log("mostrando form para nuevo comentario");
    res.render('comments/new', {quizid: req.params.quizId, errors: [] });
};

// POST /quizes/create  añade una nueva pregunta a la base de datos
exports.create = function(req, res) {
    console.log("------ Validando " + JSON.stringify(req.body.comment.texto)
        + " para pegunta: " + req.params.quizId);
    // creamos datos para registrar
    var comment = models.Comment.build(
        { texto: req.body.comment.texto,
          QuizId: req.params.quizId
        });
    
    try {
        // probando versión con then
        comment.validate().then(_validationHandler);
    } catch (err) {
        console.log("-- **  AVISO comment: no funciona Sequelize con 'then'");
    }
    
    // probamos validación de la forma antigua
    var result = comment.validate();
    if (result) {
        // hay errores
        var errors = [];
        for (var key in result) {
            if (result.hasOwnProperty(key)) {
                var err = {"field": key, message: result[key]};
                errors.push(err);
            }
        }
        _validationHandler({message: "Comentario no debe estar vacío", errors: errors});
    } else {
        // no hay errores
        _validationHandler(null);
    }
    
    function _validationHandler(err) {
        console.log("result validar comentario " + JSON.stringify(err));
        // comprobamos resulado de validación
        if (err) {
            // existen datos no válidos.
            res.render('comments/new', {quizid: req.params.quizId, errors: [] });
        } else {
            // datos de la pregunta correctos. Procedemos a guardar
            comment.save().then(
                function() {
                    res.redirect("/quizes/"+ req.params.quizId); // r
                }
            ); 
        }
    }
    
};

