
// Definición del modelos de datos de Quiz

// Quiz: Tabla de temas
//  Comment
//  - texto as STRING
//  - publicado as BOOLEAN
//
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
            },
            fechaHoraUtc: {
                type: DataTypes.STRING,
                defaultValue: '2018/08/08 00:00:00 +00:00'
            }
        });
};        



