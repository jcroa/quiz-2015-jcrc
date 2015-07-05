// Session Controller

// Importación de los modelos de datos.
var models = require("../models/models.js");

// GET /login  formulario de login
exports.new = function(req, res) {
    var errors = req.session.errors || [];
    req.session.errors = {};
    console.log("formulario de login");
    res.render('sessions/new', {errors: errors });
};

// POST /login/ create la sesión
exports.create = function(req, res) {

    var login = req.body.login;
    var password = req.body.password;
    
    console.log("-- Iniciando sesión con: " + login);
    var userController = require("./user_controller");
    userController.autenticar(login, password, function(error, user) {
        if (error) {
            req.session.errors = [{message: "Se ha producido un error: " + error}];
            res.redirect("/login");
            return;
        }
        // crear req.session.user y guardar campos id y username
        // La sesión se define por la existencia de: req.sessoin.user
        req.session.user = {id:user.id, username:user.username};
        // redirección a path anterior a login
        res.redirect(req.session.redir.toString()); 
    });
};

// DELETE /logout  destruir sesión
exports.destroy = function(req, res) {
    console.log("sesión finalizada pàra " + req.session.user);
    delete req.session.user;
    res.redirect(req.session.redir.toString());
};
