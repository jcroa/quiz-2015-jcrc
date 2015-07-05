// User Controller

var users = {
    admin: { id:1, username:"admin", password:"1234"},
    pepe: { id:2, username:"pepe", password:"5678"},
    ana: { id:3, username:"ana", password:"a"},
};


// GET /quizes/:quizId/comments/new 
exports.autenticar = function(login, password, callback) {
    var user = users[login];
    if (user) {
        if (password === user.password) {
            callback(null, user);
        } else {
            console.log("no vale [" + password + "] para usuario " + user.username);
            callback(new Error("Password errónea"));
        }
    } else {
        callback(new Error("No exsite el usuario"));
    }
};

