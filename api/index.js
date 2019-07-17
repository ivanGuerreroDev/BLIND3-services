var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Index' });
});



router.post('/login', (req, res) => {
  var err = [];

  

  console.log(req.body);
});



module.exports = router;