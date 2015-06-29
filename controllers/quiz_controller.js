// Quiz Controller

// Importación de los modelos de datos.
var models = require("../models/models.js");

// Autoload - factoriza el c´çodigo si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
    console.log("load - buscando quizId = " + quizId + " ...");
    models.Quiz.find(quizId).then(
        // Manejo de evento success de find()
        function(quiz) {
            if (quiz) {
                // agregamos al objeto Request:
                req.quiz = quiz;
                console.log("load - encontrado " + quiz.pregunta);
                
                models.Tema.find({ where: { alias: quiz.fk_tema } }).then(
                    function(row) {
                        if (!row) {
                            tema = {alias:null, nombre: "Otros"};
                        } else {
                            tema = row;
                        }
                        // agregamos a quiz info sobre el tema
                        quiz._tema = row;
                        console.log("load - tema  " + quiz._tema.nombre);
                        next();
                    }
                ).catch(
                   function(err) { next(err); }
                );
                
               
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
        res.render('quizes/index', { quizes: quizes, filter: text, errors: [] });
    });
};

// GET /quizes/:id
exports.show = function(req, res) {
    // previo load
    console.log("Controller: pregunta pedida: " + req.quiz.id);
    console.log("Controller: tema pedido: " + req.quiz._tema.nombre);
    
    res.render('quizes/show', {quiz: req.quiz, errors: [] });
};

// GET /quizes/answer
exports.answer = function(req, res) {
    // previo load
    var resultado = 'Incorrecto';
    if (req.query.respuesta === req.quiz.respuesta) {
        resultado = 'Correcto';
        console.log("Correcto:.  [" + req.quiz.respuesta + "]");
    } else {
        console.log("Incorrecto:. No es : [" + req.query.respuesta + 
            "]  Era: [" + req.quiz.respuesta + "]");
    }
    res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});
};

// GET /quizes/new muestra formulario de inserción de pregunta/respuesta
exports.new = function(req, res) {
    // creamos fila con datos por defecto
    var quizVacia = models.Quiz.build( // crea objeto Quiz
        {pregunta: "Pregunta", respuesta: "Respuesta", fk_tema: "ocio"}
    );
    
    models.Tema.findAll().then(
        // Manejo de evento success de find()
        function(rows) {
            res.render('quizes/new', {quiz: quizVacia, temas: rows, errors: [] });
        }
    );
};

// GET /quizes/create  añade una nueva pregunta a la base de datos
exports.create = function(req, res) {
    console.log("------ Validando " + JSON.stringify(req.body.quiz));
    // creamos datos para registrar
    var quizNueva = models.Quiz.build(req.body.quiz);
    
    try {
        // probando versión con then
        quizNueva.validate().then(_validationHandler);
    } catch (err) {
        console.log("-- **  AVISO: no funciona Sequelize con 'then'");
    }
    
    // probamos validación de la forma antigua
    var result = quizNueva.validate();
    if (result) {
        // hay errores
        var errors = [];
        for (var key in result) {
            if (result.hasOwnProperty(key)) {
                var err = {"field": key, message: result[key]};
                errors.push(err);
            }
        }
        _validationHandler({message: "Pregunta no válida", errors: errors});
    } else {
        // no hay errores
        _validationHandler(null);
    }
    
    function _validationHandler(err) {
        console.log("result validar " + JSON.stringify(err));
        // comprobamos resulado de validación
        if (err) {
            // existen datos no válidos.
            res.render("quizes/new", {quiz: quizNueva, errors: err.errors});
        } else {
            // datos de la pregunta correctos. Procedemos a guardar
            quizNueva.save( 
                // solo estos dos campos
                {fields:["pregunta", "respuesta", "fk_tema"]}
            ).then(
                function() {
                    res.redirect("/quizes"); // redirección a lista de preguntas
                }
            ); 
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
    console.log("------ Validando " + JSON.stringify(req.body.quiz));
    // creamos datos para registrar
    req.quiz.pregunta = req.body.quiz.pregunta;
    req.quiz.respuesta = req.body.quiz.respuesta;
    req.quiz.fk_tema = req.body.quiz.fk_tema;
    
    var editedQuiz = req.quiz;
    
    try {
        // probando versión con then
        editedQuiz.validate().then(_validationHandler);
    } catch (err) {
        console.log("-- **  AVISO: no funciona Sequelize con 'then'");
    }
    
    // probamos validación de la forma antigua
    var result = editedQuiz.validate();
    if (result) {
        // hay errores
        var errors = [];
        for (var key in result) {
            if (result.hasOwnProperty(key)) {
                var err = {"field": key, message: result[key]};
                errors.push(err);
            }
        }
        _validationHandler({message: "Pregunta no válida", errors: errors});
    } else {
        // no hay errores
        _validationHandler(null);
    }
    
    function _validationHandler(err) {
        console.log("result validar " + JSON.stringify(err));
        // comprobamos resulado de validación
        if (err) {
            // existen datos no válidos.
            res.render("quizes/new", {quiz: editedQuiz, errors: err.errors});
        } else {
            // datos de la pregunta correctos. Procedemos a guardar
            editedQuiz.save( 
                // solo estos dos campos para la actualización
                {fields:["pregunta", "respuesta", "fk_tema"]}
            ).then(
                function() {
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
    
exports.author = function(req, res) {
   // public/author.ejs
   res.render('author', {});
};
