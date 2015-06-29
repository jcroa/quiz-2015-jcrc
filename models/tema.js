
// Definición del modelos de datos de Quiz

// Quiz: Tabla de temas
module.exports = function(sequelize, DataTypes) {
    return sequelize.define("Tema",
        {
            alias: {
            	type: DataTypes.STRING,
                primaryKey: true,
            	validate: { notEmpty: {msg: "-> falta el alias del tema "} }
            },
            nombre: {
            	type: DataTypes.STRING,
            	validate: { notEmpty: {msg: "-> falta el nombre del tema de la respuesta"} }
            }
        });
};        



