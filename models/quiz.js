
// Definición del modelos de datos de Quiz

// Quiz: Tabla de preguntas
module.exports = function(sequelize, DataTypes) {
    return sequelize.define("Quiz",
        {
            pregunta: {
            	type: DataTypes.STRING,
            	validate: { notEmpty: {msg: "-> falta el texto de la pregunta"} }
            },
            respuesta: {
            	type: DataTypes.STRING,
            	validate: { notEmpty: {msg: "-> falta el texto de la respuesta"} }
            },
            preguntas_falsas: {  // opcional como un array en formato json
                type: DataTypes.STRING
            },
            fk_tema: {
            	type: DataTypes.STRING
            }
        });
};        



