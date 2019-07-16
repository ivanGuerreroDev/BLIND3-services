var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
var mongo = require('mongodb').MongoClient;
var url = 'mongodb://blind3:businetBlind3@ds149146.mlab.com:49146/heroku_33n7zg9w';

/* GET users listing. */
router.get('/accountDelete', function(req, res, next) {
  res.render('delete', { title: 'Index' });
});

router.post('/accountDelete', function(req, res, next) {//DELETE Y UPDATE
    //console.log(req.body);
    mongo.connect(url,{ useNewUrlParser: true }, function(err,client) {
      const db = client.db("heroku_33n7zg9w");
      db.collection('users').deleteMany({ 
        email: req.body.email
      })
      .then(function(result) {
        // process result
      })
      client.close();
    });

    db.collection('users').updateMany(
      { email: "correito@gmail.com" },
      { $set: { email: "PapoPelao@gmail.com" },
        $currentDate: { lastModified: true } })
    .then(function(result) {
      // process result
    })          
    //res.redirect('accountCreation');
    //res.render('login', { title: 'Index' });
    jwt.sign({user: req.body},'secretkey', (err, token) =>{
        
    });
  });

module.exports = router;