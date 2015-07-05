
// Definición del modelos de datos de Quiz

// Quiz: Tabla de temas
module.exports = function(sequelize, DataTypes) {
    return sequelize.define("Comment",
        {
            texto: {
            	type: DataTypes.STRING,
            	validate: { notEmpty: {msg: "-> falta comentario "} }
            },
            publicado: {
            	type: DataTypes.BOOLEAN,
            	defaultValue: false 
            }
        });
};        



