///
/// Definición de los modelos de datos
///

// Importación de módulos
var path = require("path");

console.log("models.js - DATABASE_URL : " + process.env.DATABASE_URL);

// Postgres DATABASE_URL = postgres://rkjqotjtqcmjmn:SnJ09qa_ABejE1i1SjMBiqU24n@ec2-54-83-43-118.compute-1.amazonaws.com:5432/d578grmpsb38gc
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;

var dbOptions = { 
        dialect:  protocol,
        protocol: protocol,
        port:     port,
        host:     host,
        storage:  storage,  // solo SQLite (.env)
        omitNull: true      // solo Postgres
    };

console.log("models.js - DbOptions: \n" + JSON.stringify(dbOptions));

// Carga modelo ORM
var Sequelize = require("sequelize"); // modelo ORM

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd, 
    { 
        dialect:  protocol,
        protocol: protocol,
        port:     port,
        host:     host,
        storage:  storage,  // solo SQLite (.env)
        omitNull: true      // solo Postgres
    }      
);
    
// Importar la definición de la tabla Quiz en quiz.js
var quizPath = path.join(__dirname, "quiz");
var Quiz = sequelize.import(quizPath);

exports.Quiz = Quiz;

// Datos a añadir si la tabla está nicialmente vacía.
var ejemplosIniciales = [
    {
        pregunta: "Capital de Italia",
        respuesta: "Roma"
    },
    {
        pregunta: "Capital de Protugal",
        respuesta: "Lisboa"
    }
];

// Creamos e inicializamos tabla de preguntas en la base de datos
sequelize.sync().success(function() {
    // manejador de evento success de sync(...)
    Quiz.count().success(function(count) {
        // manejador de evento success de count(...)
        if (count===0) {
            // tabla está vacía: Añadimos datos de prueba
            Quiz.bulkCreate(ejemplosIniciales).then(function() {
               // manejador de evento success de create(...)
               console.log("Base de datos inicializada con un registro");
            });
        }
    });
});

console.log("models.js - Init OK ");

  
