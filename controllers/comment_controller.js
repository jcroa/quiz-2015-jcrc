// Comment Controller

// Importación de los modelos de datos.
var models = require("../models/models.js");

// Autoload - :id de comentarios
exports.load = function(req, res, next, commentId) {
    console.log("load - buscando commentId = " + commentId);
    models.Comment.find(
        {
            where: { id: Number(commentId) }
        }
    ).then(function(comment) {
            // Manejo de evento success de find()
            if (comment) {
                // agregamos al objeto Request la propiedad "comment" con valor el objeto comment encontrado
                req.comment = comment;
                console.log("load - comentario " + JSON.stringify(req.comment));
                next();          
            } else {
                next(new Error("No existe comentarioId=" + commentId));
            }
        }   
    ).catch(
        function(err) {
            // manejo del evento de error de find()
            console.log("load - error interno buscando comentario. " + err.message);
            next(err);
        }
    );
};

// GET /quizes/:quizId/comments/new 
exports.new = function(req, res) {
    console.log("mostrando form para nuevo comentario");
    res.render('comments/new', {quizid: req.params.quizId, errors: [] });
};

// POST /quizes/create  añade una nueva pregunta a la base de datos
exports.create = function(req, res) {
    console.log("------ Validando: " + req.body.comment + " para pegunta: " + req.params.quizId);
    // creamos datos para registrar
    var comment = models.Comment.build(
        { texto: req.body.comment.texto,
          QuizId: req.params.quizId
        });
    
    // primero validamos
    comment.validate().then(_validationHandler)
       .catch(function(err) {
            console.log("----- error interno  Validando comentario " + err.message);
       });

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
                    console.log("-- comentario guardado: " + comment.texto + " en quizID: " + comment.QuizId);
                    res.redirect("/quizes/"+ req.params.quizId); // 
                }
            ); 
        }
    }
    
};

// PUT /quizes/:quizId/comments:commentId/publish permite publicación de comentario
exports.publish = function(req, res) {
    // previo load req.comment
    console.log("------ permitiendo publicación de comentario " + JSON.stringify(req.comment)
        + " para pegunta: " + req.params.quizId);
    req.comment.publicado = true;
    
    req.comment.save({fields: ["publicado"]})
        .then(function() {
                console.log("-- comentario publicado: "); // + req.comment.texto + " en quizID: " + comment.QuizId);
                res.redirect("/quizes/"+ req.params.quizId); // 
            }
        )  
        .catch(function(err) {
             console.log("----- error interno  publicando comentario " + err.message);
             next(err);
        });
};





