var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
var mongo = require('mongodb').MongoClient;
var url = 'mongodb://blind3:businetBlind3@ds149146.mlab.com:49146/heroku_33n7zg9w';


/* GET users listing. */
router.get('/accountCreation', function(req, res, next) {
  jwt.sign({user: req.body},'secretkey', (err, token) =>{
    res.render('login', { title: 'Account creation', token: token });
  });
});

router.post('/accountCreation', function(req, res, next) { //create && //read
  var dataArray = [];
  var user = req.body;

  mongo.connect(url, function(err,client) {
      const db = client.db("heroku_33n7zg9w");
      db.collection('users').insertOne(user);
      client.close();
    });

  mongo.connect(url, { useNewUrlParser: true } , function(err, client) {
    const db = client.db("heroku_33n7zg9w");
    var cursor = db.collection('users').find();
    cursor.forEach(function(doc, err) {
    dataArray.push(doc);
    //console.log(JSON.stringify(doc, null, 4));
    //console.log(dataArray);
    });
   //console.log("loco");
   //console.log(dataArray);
   client.close();
  });
  //res.redirect('accountCreation');
  //res.render('login', { title: 'Index' });
  //db.createCollection('mycollection', 'hue', ['mycollection']);
  //res.render('index', { title: 'Index' });
  /*jwt.sign({user: req.body},'secretkey', (err, token) =>{
    //res.json(db.mycollection.find)
  });*/

  //res.render('index', { title: dataArray } );
});

module.exports = router;