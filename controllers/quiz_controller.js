// Qujiz Controller

// GET /quizes/question
exports.question = function(req, res) {
   // public/quizes/question.ejs
   res.render('quizes/question', {
           pregunta: 'Capital de Italia'
       });
};

// GET /quizes/answer
exports.answer = function(req, res) {
   // public/quizes/answer.ejs
   if (req.query.respuesta === 'Roma'){
      res.render('quizes/answer', {respuesta: 'Correcto'});
   } else {
      res.render('quizes/answer', {respuesta: 'Incorrecto'});
   }
};

exports.author = function(req, res) {
   // public/author.ejs
   res.render('author', {});
};