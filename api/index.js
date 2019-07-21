var express = require('express');
var router = express.Router();
var passport = require('passport')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Index' });
});

router.post('/login', (req, res) => {
  var err = [];
  console.log(req.body);
    /*router.post('/login', function(req, res, next){
      if(!req.body.username){
        return res.status(422).json({error: "Debe rellenar todos los campos"});
      }
      if(!req.body.password){
        return res.status(422).json({error: "Debe rellenar todos los campos"});
      }
      if (req.body.remember) {
        req.session.cookie.maxAge = 1000 * 60 * 3;
      } else {
        req.session.cookie.expires = false;
      }
      passport.authenticate('local', {session: false}, function(err, user, info){
        if(err){ console.log(err); return next(err); }
        if(user){
          req.login(user, function(error) {
            if (error) return next(error);
            return res.status(200).json({redirect: "/home"});
          });
          return res.status(200).json({redirect: "/home"})
        } else {
          return res.status(422).json(info);
        }
      })(req, res, next);
    });*/
  
});



module.exports = router;