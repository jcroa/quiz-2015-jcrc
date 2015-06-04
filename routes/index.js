var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  //  views/index.ejs  más parámetros.
  res.render('index', { title: 'Quiz demo' });
});

module.exports = router;
