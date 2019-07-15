var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Index' });
});

router.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to the Api'
  });
});

module.exports = router;