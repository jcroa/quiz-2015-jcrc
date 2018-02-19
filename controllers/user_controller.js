// User Controller

var userLogins = {
    admin: { id:1, username:"admin", password:"1234"},
    pepe: { id:2, username:"pepe", password:"5678"},
    ana: { id:3, username:"ana", password:"a"},
};


// GET /quizes/:quizId/comments/new 
exports.autenticar = function(login, password, callback) {
    var user = userLogins[login];
    console.log("user_controller - autenticar : " + login + " " + password);
    if (user) {
        if (password === user.password) {
            console.log("user_controller - autenticar : ACEPTADO " + login + " " + password);
            callback(null, user);
        } else {
            console.log("user_controller - autenticar : no vale [" + password + "] para usuario " + login);
            callback(new Error("Usuario o Password errónea"));
        }
    } else {
        console.log("user_controller - autenticar : No existe usuario " + login + " " + password);
        callback(new Error("Usuario o Password errónea"));
    }
};

