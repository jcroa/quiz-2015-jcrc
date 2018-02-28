// Quiz Controller

// Importación de los modelos de datos.
var models = require("../models/models.js");

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
    console.log("quiz_controller - load : buscando quizId = " + quizId + " . y comentarios asociados");
    models.Quiz.find(
        {
            where: { id: Number(quizId) },
            include: [{ model: models.Comment }]
        }
    ).then(function(quiz) {
            // Manejo de evento success de find()
            if (quiz) {
                // agregamos al objeto Request:
                req.quiz = quiz;
                console.log("quiz_controller - load : encontrado " + quiz.pregunta + 
                    " comments " + JSON.stringify(quiz));
                
                models.Tema.find(
                    { where: { alias: quiz.fk_tema } }
                ).then(
                    function(row) {
                        if (!row) {
                            tema = {alias:null, nombre: "Otros"};
                        } else {
                            tema = row;
                        }
                        // agregamos a quiz info sobre el tema
                        quiz._tema = row;
                        console.log("quiz_controller - load : tema  " + (quiz._tema && quiz._tema.nombre));
                        next();
                    }
                ).catch(
                   function(err) { 
                       next(err); 
                    }
                );  
            } else {
                console.log("quiz_controller - load : ERROR No existe  "  + quizId);
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
        console.log("quiz_controller - index : preguntas con filtro: " + containing);
    } else {
        console.log("quiz_controller - index : preguntas sin filtro");
    }
    models.Quiz.findAll(filter).then(function(quizes) {
        // Manejo de evento success de findAll()
        console.log("quiz_controller - index : found " + (quizes && quizes.length));
        res.render('quizes/index', { quizes: quizes, filter: text, errors: [] });
    });
};

// GET /quizes/:id
exports.show = function(req, res) {
    // previo load
    console.log("quiz_controller - show - pregunta pedida: " + req.quiz.id);
    console.log("quiz_controller - show - tema pedido: " + (req.quiz._tema && req.quiz._tema.nombre));
    
    res.render('quizes/show', {quiz: req.quiz, errors: [] });
};

// GET /quizes/answer
exports.answer = function(req, res) {
    // previo load
    var resultado;
    console.log("quiz_controller - answer : Comparando entrada [" + req.quiz.respuesta + 
        "] con esperado [" + req.query.respuesta + "]");   
    if (compareTexts(req.query.respuesta, req.quiz.respuesta)) {
        resultado = 'Correcto: ' + req.query.respuesta;
        console.log("quiz_controller - answer : Correcto:.  [" + req.quiz.respuesta + "]");
    } else {
        resultado = 'Incorrecto. No es: ' + req.quiz.respuesta;
        console.log("quiz_controller - answer : Incorrecto:. No es : [" + req.query.respuesta + 
            "]  Era: [" + req.quiz.respuesta + "]");
    }
    res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});
};

// GET /quizes/new muestra formulario de inserción de pregunta/respuesta
exports.new = function(req, res) {
    // creamos fila con datos por defecto
    var quizVacia = models.Quiz.build( // crea objeto Quiz
        {pregunta: "", respuesta: "", fk_tema: "ocio"}
    );
    
    models.Tema.findAll().then(
        // Manejo de evento success de find()
        function(rows) {
            res.render('quizes/new', {quiz: quizVacia, temas: rows, errors: [] });
        }
    );
};

// POST /quizes/create  añade una nueva pregunta a la base de datos
exports.create = function(req, res) {
    console.log("quiz_controller - Validando " + JSON.stringify(req.body.quiz));
    // creamos datos para registrar
    var quizNueva = models.Quiz.build(req.body.quiz);
    
    // primero validamos
    quizNueva.validate()
        .then(_validationHandler)        
        .catch(function(err) {
            console.log("quiz_controller - Error Validando nueva quiz. " + err.message);
        });
  
    function _validationHandler(result) {
        console.log("quiz_controller - Result validar " + JSON.stringify(result));
        // comprobamos resulado de validación
        if (result.errors) {
            // existen datos no válidos.
            models.Tema.findAll().then(
                // Manejo de evento success de find()
                function(rows) {
                    res.render('quizes/new', {quiz: quizNueva, temas: rows, errors: result.errors });
                }
            );
        } else {
            // datos de la pregunta correctos. Procedemos a guardar
            quizNueva.save( 
                // solo estos dos campos
                { fields: [ "pregunta", "respuesta", "fk_tema" ]}
            ).then(function() {
                res.redirect("/quizes"); // redirección a lista de preguntas
            }).catch(function(err) {
                console.log("quiz_controller - Error interno guardando quiz válida. ", quizNueva, err);
            }); 
        }
    }
    
};

// GET /quizes/:id/edit  muestra formulario de edición de pregunta/respuesta
exports.edit = function(req, res) {
    // previo load
    var quiz = req.quiz;
    
    models.Tema.findAll().then(
        // Manejo de evento success de find()
        function(rows) {
            res.render('quizes/edit', {quiz: quiz, temas: rows, errors: [] });
        }
    );
};

// GET /quizes/update  modifica una pregunta a la base de datos
exports.update = function(req, res) {
    console.log("quiz_controller - Validando " + JSON.stringify(req.body.quiz));
    // creamos datos para registrar
    req.quiz.pregunta = req.body.quiz.pregunta;
    req.quiz.respuesta = req.body.quiz.respuesta;
    req.quiz.fk_tema = req.body.quiz.fk_tema;
    
    var editedQuiz = req.quiz;
    
    // primero validamos
    editedQuiz.validate().then(_validationHandler)
        .catch(function(err) {
            console.log("quiz_controller - Error Validando edición de quiz. " + err.message);
        });
    
    function _validationHandler(err) {
        console.log("quiz_controller - result validar " + JSON.stringify(err));
        // comprobamos resulado de validación
        if (err) {
            // existen datos no válidos.
            models.Tema.findAll().then(
                // Manejo de evento success de find()
                function(rows) {
                    res.render('quizes/new', {quiz: editedQuiz, temas: rows, errors: err.errors });
                }
            );
        } else {
            // datos de la pregunta correctos. Procedemos a guardar
            editedQuiz.save( 
                // solo estos dos campos para la actualización
                {fields:["pregunta", "respuesta", "fk_tema"]}
            ).then(
                function() {
                    console.log("quiz_controller - GUARDADO : ", fields);
                    res.redirect("/quizes"); // redirección a lista de preguntas
                }
            ); 
        }
    }
    
};

// delete /quizes/:id  elimina una pregunta de la base de datos
exports.destroy = function(req, res) {
    // previo load
    req.quiz.destroy().then(
        function() {
            console.log("Pregunta borrada: [" + req.quiz.pregunta + "]");
            res.redirect("/quizes");
        }
    ).catch(
        function(error) { next(error); }
    );
 };
    
 function compareTexts(text1, text2) {
    text1 = ("" + text1).toLocaleLowerCase();
    text2 = ("" + text2).toLocaleLowerCase();
    return text1 === text2;
 }   
