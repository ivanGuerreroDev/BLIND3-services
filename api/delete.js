var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var User = mongoose.model('Usuarios');

/* GET users listing. */
router.get('/accountDelete', function(req, res, next) {
  res.render('delete', { title: 'Index' });
});

router.post('/accountDelete', function(req, res, next) {//DELETE Y UPDATE

    //console.log(req.body);
    console.log(req.body);
  
    User.deleteOne({username: req.body.username, email: req.body.email, password:req.body.password}, function (err) {
      if (err) console.log(err);
      // deleted at most one tank document
    });

    /*db.collection('users').updateMany(
      { email: "correito@gmail.com" },
      { $set: { email: "PapoPelao@gmail.com" },
        $currentDate: { lastModified: true } })
    .then(function(result) {
      // process result
    })*/ 
    
    //res.redirect('accountCreation');
    //res.render('login', { title: 'Index' });
    
  });

module.exports = router;