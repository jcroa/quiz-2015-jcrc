///
/// Definición de los modelos de datos
///

// Importación de módulos
var path = require("path");

var db = process.env.DATABASE_URL || 'sqlite://:@:/';
if (!process.env.DATABASE_URL) {
    console.info("no env variable DATABASE_URL found");
    process.env.DATABASE_URL = 'sqlite://:@:/'
}

console.log("models.js - DATABASE_URL : " + process.env.DATABASE_URL);

// Postgres DATABASE_URL = postgres://rkjqotjtqcmjmn:SnJ09qa_ABejE1i1SjMBiqU24n@ec2-54-83-43-118.compute-1.amazonaws.com:5432/d578grmpsb38gc
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6] || null);
var user = (url[2] || null);
var pwd = (url[3] || null);
var protocol = (url[1] || null);
var dialect = (url[1] || null);
var port = (url[5] || null);
var host = (url[4] || null);
var storage = process.env.DATABASE_STORAGE;

var dbOptions = {
    dialect: protocol,
    protocol: protocol,
    port: port,
    host: host,
    storage: storage, // solo SQLite (.env)
    omitNull: true // solo Postgres
};

console.log("models.js - DbOptions: \n" + JSON.stringify(dbOptions));

// Carga modelo ORM
var Sequelize = require("sequelize"); // modelo ORM

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd, {
    dialect: protocol,
    protocol: protocol,
    port: port,
    host: host,
    storage: storage, // solo SQLite (.env)
    omitNull: true // solo Postgres
});

// Importar la definición de la tabla Quiz en quiz.js
var quizPath = path.join(__dirname, "quiz");
var Quiz = sequelize.import(quizPath);

var commentPath = path.join(__dirname, "comment");
var Comment = sequelize.import(commentPath);

var temaPath = path.join(__dirname, "tema");
var Tema = sequelize.import(temaPath);

// Relación 1 quiz a muchos comentarios
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

// Relación 1 Tema a muchos quizes. Indicamos explicitamente la fk
Quiz.belongsTo(Tema, { foreignKey: 'fk_tema' }); // 
Tema.hasMany(Quiz);

// exportaciones de referencias a tablas
exports.Tema = Tema;
exports.Quiz = Quiz;
exports.Comment = Comment;

var ejemplosTemas = [
    { alias: "huma", nombre: "Humanidades" },
    { alias: "ccia", nombre: "Ciencia" },
    { alias: "tcno", nombre: "Tecnología" },
    { alias: "ocio", nombre: "Ocio" }
];
// Datos a añadir si la tabla está nicialmente vacía.
var ejemplosPreguntas = [
    { pregunta: "Capital de Italia", respuesta: "Roma", fk_tema: "huma" },
    { pregunta: "Capital de Portugal", respuesta: "Lisboa", fk_tema: "huma" },
    { pregunta: "Símbolo del helio", respuesta: "he", fk_tema: "ccia" },
    { pregunta: "Unidad de información digital de 8 bits", respuesta: "byte", fk_tema: "tcno" },
];

// Creamos e inicializamos tabla de preguntas en la base de datos
sequelize.sync().then(function() {
    // manejador de evento success de sync(...)
    Quiz.count().then(function(count) {
        // manejador de evento success de count(...)
        if (count === 0) {
            // tabla está vacía: Añadimos datos de prueba
            Tema.bulkCreate(ejemplosTemas).then(function() {
                // manejador de evento success de create(...)
                console.log("Base de datos inicializada con temas");
                Quiz.bulkCreate(ejemplosPreguntas).then(function() {
                    // manejador de evento success de create(...)
                    console.log("Base de datos inicializada con un ejemplos iniciales");
                });
            });
        }
    });
});

console.log("models.js - Init OK  ");