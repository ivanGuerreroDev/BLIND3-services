var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');

/* GET users listing. */
router.get('/accountDelete', function(req, res, next) {
  res.render('delete', { title: 'Index' });
});

router.post('/accountDelete', function(req, res, next) {
    console.log(req.body);
    //res.redirect('accountCreation');
    //res.render('login', { title: 'Index' });
    jwt.sign({user: req.body},'secretkey', (err, token) =>{
        
    });
  });

module.exports = router;