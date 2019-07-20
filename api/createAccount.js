var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
//var mongo = require('mongodb').MongoClient;
//var url = 'mongodb://blind3:businetBlind3@ds149146.mlab.com:49146/heroku_33n7zg9w';
var mongoose = require('mongoose');
var User = mongoose.model('Usuarios');
var errorhandler = require('errorhandler');


/* GET users listing. */
router.get('/accountCreation', function(req, res, next) {
  jwt.sign({user: req.body},'secretkey', (err, token) =>{
    res.render('createUser', { title: 'Account creation', token: token });
  });
});

router.post('/accountCreation', function(req, res, next) { //create && //read

  console.log(req.body);

  /*User..connect(url, function(err,client) {
      const db = client.db("heroku_33n7zg9w");
      db.collection('users').insertOne(user);
      client.close();
    });*/

    var user = new User();
    user.username = req.body.username;
    user.email = req.body.email;
    user.setPassword(req.body.password);
    user.password = req.body.password;
    
    user.save(function (err) {
    if (err) errorhandler(err);
    res.redirect('/');
    // saved!
    });
  
    //user.findOne();
    //console.log(user.query);
      //return done(null, user);
  
    
    
   //console.log("loco");
   //console.log(dataArray);
  
  //res.redirect('accountCreation');
  //res.render('login', { title: 'Index' });
  //db.createCollection('mycollection', 'hue', ['mycollection']);
  //res.render('index', { title: 'Index' });
  /*jwt.sign({user: req.body},'secretkey', (err, token) =>{
    //res.json(db.mycollection.find)
  });*/

  //res.render('index', { title: dataArray } );
});

router.get('/api', function(req, res, next){

User.findOne(function (err, user) {
  console.log(user);
});

})


module.exports = router;