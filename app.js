
// Importación de paquetes de terceros con middlewares
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials  = require("express-partials");
var methodOverride = require("method-override");
var session = require("express-session");

// Importación de enrutadores
var routes = require('./routes/index');

// Instanciación de la aplicación principal. Objeto app
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// permite soporte de "vistas parciales"
app.use(partials());

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.png'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('' + new Date()));
app.use(session({
    secret: 'quiz-2018',
    resave: true,
    saveUninitialized: true
}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Manejador 1. session inicia/sigue/termina
app.use(function(req, res, next) {
    // guardar path en session.redir para después de login
    if (!req.path.match(/\/login|\/logout/)) {
        req.session.redir = req.path;
        console.log("app:1 - página normal (no login ni logout)");
    } else {
        console.log("app:1 - login o logout");
    }
    // hacer visible req.session en las vistas
    res.locals.session = req.session;
    next();
});
  
// manejador 2. autologout 
app.use(function(req, res, next) {
    var inactivityTimeout = 120;
    // guardar path en session.redir para después de login
    if (req.session.user) {
        console.log("app:2 -: HAY sesión " + (req.session.user && req.session.user.username));
        var nowSeconds = new Date().getTime() / 1000;
        var lastTimeSeconds = req.session.lastTimeSeconds;
        if (lastTimeSeconds) {
            var lapTime = nowSeconds - lastTimeSeconds;
            console.log("app:2 - lap time: " + lapTime);
            if (lapTime >= inactivityTimeout) {
                delete req.session.lastTimeSeconds;
                req.session.destroy();
                res.redirect("/login");
                console.log("app:2 - sesión ha expirado tras : " + (nowSeconds - lastTimeSeconds) + " segs");
                return;
            }
        }
        req.session.lastTimeSeconds = nowSeconds;
        console.log("app:2 - session : nueva marca temporal: " + req.session.lastTimeSeconds);
    } else {
        console.log("app:2 - session : NO hay sesión");
    }
    next();
});  
    
// Manejador 3: Cualquier ruta será gestionada por routes.js
app.use('/', routes);

// Ruta indefinida. Catch 404 and forward to error handler
app.use(function(req, res, next) {
    console.log("app - not found : " + req.request);
    var err = new Error('Not Found.');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;
