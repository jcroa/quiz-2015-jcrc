///
/// Definición de los modelos de datos
///

// Importación de módulos
var path = require("path");
var Sequelize = require("Sequelize"); // modelo ORM

// Usar BBDD SqLite. Guardado en fichero quiz.sqlite
var sequelize = new Sequelize(null, null, null,
        {dialect: "sqlite", storage: "quiz.sqlite"}
    );
    
// Imortar la definición de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname, "quiz"));

exports.Quiz = Quiz;

// Creamos e inicializamos tabla de preguntas en la base de datos
sequelize.sync().success(function() {
    // manejador de evento success de sync(...)
    Quiz.count().success(function(count) {
        // manejador de evento success de count(...)
        if (count===0) {
            // tabla está vacía: Añadimos datos de prueba
            Quiz.create({
                pregunta: "Capital de Italia",
                respuesta: "Roma"
            }).success(function() {
               // manejador de evento success de create(...)
               console.log("Base de datos inicializada con un registro");
            });
        }
    });
});

  
