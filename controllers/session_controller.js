// Session Controller

// Importación de los modelos de datos.
var models = require("../models/models.js");

// MW de autorización de accesos http restringidos
exports.loginRequired = function(req, res, next) {
    if (req.session.user) {
        console.log("session_controller - Acción restringida autorizada: " + req.url);
        next();
    } else {
        console.log("session_controller - Acción restringida no autorizada sin sesiión: " + req.url);
        res.redirect("/login");
    }
};

// GET /login  formulario de login
exports.new = function(req, res) {
    var errors = req.session.errors || [];
    req.session.errors = {};
    console.log("session_controller - new : formulario de login");
    res.render('sessions/new', {errors: errors });
};

// POST /login/ create la sesión
exports.create = function(req, res) {

    var login = req.body.login;
    var password = req.body.password;
    
    console.log("session_controller - create : Iniciando sesión con: " + login);
    var userController = require("./user_controller");
    userController.autenticar(login, password, function(error, user) {
        if (error) {
            var msg = (error && error.message) || "Error no esperado";
            req.session.errors = [{ message: msg }];
            res.redirect("/login");
            return;
        }
        // crear req.session.user y guardar campos id y username
        // La sesión se define por la existencia de: req.sessoin.user
        req.session.user = {id:user.id, username:user.username};
        // redirección a path anterior a login
        if (req.session.redir) {
            res.redirect(req.session.redir.toString()); 
        } else {
            res.redirect("/"); 
        }
    });
};

// DELETE /logout  destruir sesión
exports.destroy = function(req, res) {
    console.log("session_controller - destroy : sesión finalizada pàra " + req.session.user);
    delete req.session.user;
    res.redirect(req.session.redir.toString());
};

