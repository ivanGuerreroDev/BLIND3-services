var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
var nodeMailer = require('nodemailer');
var mongoose = require('mongoose');
var User = mongoose.model('Usuarios');
var Key = mongoose.model('Keys');
var passport = require('passport');
const token = require('../../middlewares/token') ;


router.post('/login', function(req, res, next){
  passport.authenticate('app', {
    session: false,
    badRequestMessage: 'Debe rellenar todos los campos.'
  }, function(err, user, info){
    if(!user || err){ 
      return res.json({success : false, info: info, error: err}); 
    } 
    user.token = user.generateJWT();
    return res.json({success : true, user: user.toAuthJSON()});
  })(req, res, next);
});

router.post('/accountCreation', function(req, res, next) { //create && //read
  if( !req.body.email && !req.body.username && !req.body.password && !req.body.autorizacion ) res.status(402).send({message:'Debe rellenar todos los campos',valid:false});
  var email = req.body.email;
  Key.findById(req.body.autorizacion,function(err,key){
    if(err)res.send({message:'err',valid:false});
    if(key){
      key.deleteOne();
      newUser = new User();
      newUser.nombresyapellidos = req.body.nombres;
      newUser.username = req.body.username;
      newUser.email = email;
      newUser.setPassword(req.body.password);
      newUser.save(function (err2) {
        if (err2) res.send({message:err2,valid:false});
        res.send({message:'Account Created',valid:true});
      })
    }else{
      res.status(402).send({message:'Email in use',valid:false});
    }
  })
});

router.post('/newPass', function(req,res,next){
  var email = req.body.email;
  var autorizacion = req.body.autorizacion;
  var password = req.body.password;
  if(!email && !password && !autorizacion) res.send({message:'Debe rellenar todos los campos',valid:false});
  Key.findById(autorizacion,function(err,key){
    if(key){
      User.findOne({email: email},function(err,user){
        if(user){
          user.setPassword(password);
          user.save(function(err){
            if (err) errorhandler(err);
            let transporter = nodeMailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: 'noreplybusient@gmail.com',
                    pass: 'BuSiNeT1'
                }
            });
            let mailOptions = {
                from: '"No-Reply Businet" <noreplybusient@gmail.com>', // sender address
                to: email, // list of receivers
                subject: "Recovery Accepted, Your password has change", // Subject line
                text: "Recovery Code", // plain text body
                html: 'The Recovery is Ready, Your password has change Your new password is: <b>'+ password +'</b>' // html body
            };
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                return console.log(error);
              }
              console.log('Message %s sent: %s', info.messageId, info.response);   
            });          
            key.deleteOne();
            res.send({message:'Your password has changed',valid:true});      
          })
        }else{
          res.send({message:'Error en email',valid:false});
        }
      })
    }else{
      res.send({message:'Error en codigo de autorizacion',valid:true});
    }
  })
})

router.post('/permission', function(req, res, next){
  if(!req.body.email)res.send({message:'correo no recibido',valid:false})
  if(!req.body.type)res.send({message:'Error en el formulario',valid:false})
  var email = req.body.email;
  User.findOne({email: email},function(err,user){
    if (err) res.send({message:err, valid:false})
    if(user){
      var msg = 'Email ya registrado';
      var valid = false;
      res.send({message:msg,status:valid});
    }
    Key.findOne({email: email},function (err, user) {
      if (err) res.send({message:err, valid:false})
      if(user){
        var now = new Date();
        if( !(now > user.exp) ){
          var msg = 'Codigo Reenviado!';
          var valid = 0;
          sendCode(email, user.tokenReg);
          res.send({message:msg,valid:valid});
        }
      }
      var code = makeid(5);
      var key = new Key();
      key.email = email;
      key.tokenReg = code;
      key.generateExpDate();
      key.type = req.body.type;
      sendCode(email, code);
      key.save(function(err){
        if (err) errorhandler(err);
        var msg = 'Codigo enviado!';
        var valid = 1;
        res.send({message:msg,valid:valid});
      })
      
    })
  }); 
});

router.post('/allowing', function(req, res, next){
  if(!req.body.code && !req.body.email) res.send({message:'Rellenar todos los campos!', valid:false})
  var code = req.body.code;
  var email = req.body.email;
  var now = new Date();
  Key.findOne({email: email, tokenReg: code, exp: {$lt: now}},function(err,key){
    if(err) res.send({message:'error', valid:false})
    if(!key) res.send({message:'Codigo no encontrado o expirado', valid:false})
    res.send({resp:key._id, valid:true})
  })
});




function makeid(length) {
  console.log('ejecutado makeid')
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
function sendCode(email, code){
  console.log('ejecutado sendCode')
  let transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'noreplybusient@gmail.com',
      pass: 'BuSiNeT1'
    }
  });
  let mailOptions = {
    from: '"Businet" <noreplybusient@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Verification Code from Businet", // Subject line
    text: "Verification Code", // plain text body
    html: '<b>The Verification Code is: '+code+'</b>' // html body
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) return console.log(error);
    console.log('Message %s sent: %s', info.messageId, info.response);
  });
}
module.exports = router;

