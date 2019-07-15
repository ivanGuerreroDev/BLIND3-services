var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
//var mongojs = require('mongojs');
//var db = mongojs('mongodb://blind3:businetBlind3@ds149146.mlab.com:49146/heroku_33n7zg9w', [collections]);

/* GET users listing. */
router.get('/accountCreation', function(req, res, next) {
  res.render('login', { title: 'Index' });
});

router.post('/accountCreation', function(req, res, next) {
  console.log(req.body);
  //res.redirect('accountCreation');
  //res.render('login', { title: 'Index' });
  jwt.sign({user: req.body},'secretkey', (err, token) =>{
    //res.json(db.mycollection.find)
  });
});

module.exports = router;