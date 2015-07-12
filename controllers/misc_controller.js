// Misc Controller

// Importación de los modelos de datos.
var models = require("../models/models.js");


// GET /quizes/:quizId/comments/new 
exports.author = function(req, res) {
    // public/author.ejs
    res.render('author', {});
};

exports.statistics = function(req, res) {
    // public/statistics.ejs
    var data = {};
   
    // primera consulta.
    models.Quiz.findAll({attributes: ['id']})
        .then(quizResult); 
       
    function quizResult(rows) {
        data.quizIds = rows;
        data.quizCount = rows.length;
        // segunda consulta.
        models.Comment.findAll({
                attributes: ['QuizId'],
                where: {publicado: true}
            })
        .then(commentResult);
    }
     
    function commentResult(rows) {
        var ids = [];
        data.commentCount = rows.length;
        for (var i=0; i<rows.length;i++) {
            var id = rows[i].QuizId;
            if (ids.indexOf(id)===-1) {
                ids.push(id);
                console.log(id);
            }
        }
        
        // todso los resultados calculados.
        if (data.quizCount>0) {
            var media = data.commentCount / data.quizCount;
            data.commentsPerQuiz = media.toPrecision(3);
            data.commentedQuizCount = ids.length;
        }
        
        console.log(rows.length);
        res.render('statistics', data);
    }
    

};