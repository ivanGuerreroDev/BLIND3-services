var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
var nodeMailer = require('nodemailer');
//var mongo = require('mongodb').MongoClient;
//var url = 'mongodb://blind3:businetBlind3@ds149146.mlab.com:49146/heroku_33n7zg9w';
var mongoose = require('mongoose');
var User = mongoose.model('Usuarios');
var Key = mongoose.model('Keys');
var errorhandler = require('errorhandler');


/* GET users listing. */
router.get('/accountCreation', function(req, res, next) {
  jwt.sign({user: req.body},'secretkey', (err, token) =>{
    res.render('createUser', { title: 'Account creation', token: token });
  });
});

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


router.post('/accountCreation', function(req, res, next) { //create && //read

  //console.log(req.body);
  var exist = 0;

  if(req.body.key == 'secret'){
    var email = req.body.email;

    User.findOne({email: email},function(err,user){
      //console.log(user);
      if(user){
        
        if(user.username == req.body.username){

          var valid = 0;
          exist = 1;
          var msg = 'Invalid Request: User Already Exist';
          console.log(msg);
          res.send({msg:msg,valid:valid});
          
        }else{
          
          Key.findOne({email: user.email},function(err,key){
            if(key.type == 'Creation'){
            key.deleteOne();
            user.deleteOne();
            newUser = new User();
            newUser.username = req.body.username;
            newUser.email = email;
            newUser.setPassword(req.body.password);
            

            //User.deleteOne({email: email});
          
              newUser.save(function (err) {
                console.log("actualizado");
                if (err) errorhandler(err);
        
                var valid = 1;
                var msg = 'Account Created'
                res.send({msg:msg,valid:valid});
                // saved!
              })
            }else{
              var valid = 0;
              var msg = 'User Already Exists'
              res.send({msg:msg,valid:valid});
            }
          })
      }
    }else{

      
      if(exist == 0){
      var valid = 0;
      var msg = 'Invalid Request: You did not ask for a code yet or did not send it';
      res.send({msg:msg,valid:valid});
      }

    }

  })
  }else{

    var valid = 0;
    var msg = 'Llave Invalida'
    res.send({msg:msg,valid:valid});

  }

});

router.post('/permission', function(req, res, next){

  if(req.body.key == 'secret'){
  var email = req.body.email;
  var code = makeid(5);
  
  console.log(code);


    var key = new Key();
    console.log("Valid Email");
    key.email = email;
    console.log("Valid Code");
    key.tokenReg = code;
    console.log("Genero Fecha");
    key.generateExpDate();
    console.log(key.key);
    key.type = 'Creation';
  
    console.log("Entro a verificar");

    User.findOne({email: email},function(err,user){
      if(user){

            console.log("Ya existe un usuario con ese email");
            var msg = 'Invalid Request, Email Already Registered';
            var valid = 0;
            res.send({msg:msg,valid:valid});

      }else{
        Key.findOne({email: key.email},function (err, user) {
          if(user){

            console.log("Ya existe el email con un token");
            var msg = 'Invalid Request, Already Have a Code';
            var valid = 0;
            res.send({msg:msg,valid:valid});

          }else{

            key.save(function(err){
              if (err) errorhandler(err);
              console.log("Guardando el nuevo Email");
              var msg = 'Code Sent to you email';
              var valid = 1;
              res.send({msg:msg,valid:valid});
              
              console.log("Envio el correo");

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
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message %s sent: %s', info.messageId, info.response);
                        
                    });

            })
          }
        
        })
      }
    });        
  
  /*var msg = 'valid Request';
  var valid = 1;
  res.send({msg:msg,valid:valid});*/
  }else{

    var valid = 0;
    var msg = 'Invalid Request'
    res.send({msg:msg,valid:valid});

  }
});

router.post('/allowing', function(req, res, next){

  if(req.body.key == 'secret'){

    var code = req.body.code;

    Key.findOne({email: req.body.email,tokenReg: code},function(err,key){
      //console.log(key);
      if(key.type == 'Creation'){
        
        var user = new User();
        user.username = key._id;
        user.email = key.email;
        user.setPassword(key.email+'Busin@t');
        user.save(function (err) {
        if (err) errorhandler(err);

        var valid = 1;
        var msg = 'Valid Request, Proceed to Account Creation'
        res.send({msg:msg,valid:valid});
        // saved!
        });

      }else{

        var valid = 0;
        var msg = 'Key does not exist or Email did not request a code';
        res.send({msg:msg,valid:valid});

      }

    })

  }else{
    var valid = 0;
    var msg = 'Invalid Request';
    res.send({msg:msg,valid:valid});
  }

});

router.post('/recovery', function(req,res,next){
  console.log('paso');
  if(req.body.key == "secret"){

    var email = req.body.email;

    User.findOne({email:email}, function(err,user){
      if(user){
        console.log('user')
        Key.findOne({email:user.email}, function(err,key){
          if(key){
              if(key.type == 'Creation'){

                var valid = 0;
                var msg = 'Your account is not created yet';
                res.send({msg:msg,valid:valid});

              }else{
                
                var valid = 0;
                var msg = 'You already Requested a Recovery Code';
                res.send({msg:msg,valid:valid});
                
          }  

        }else{
          
          var code = makeid(5);
          var key = new Key();
          key.email = email;
          key.tokenReg = code;
          key.generateExpDate();
          key.type = 'Recovery';
          key.allowedToRecover = false;
          key.save(function(err){
            if (err) errorhandler(err);
            
            console.log("Envio el correo");

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
                  subject: "Recovery password Code from Businet", // Subject line
                  text: "Recovery Code", // plain text body
                  html: '<b>The Recovery Code is: '+code+'</b>' // html body
              };

              transporter.sendMail(mailOptions, (error, info) => {
                  if (error) {
                      return console.log(error);
                  }
                  console.log('Message %s sent: %s', info.messageId, info.response);
                      
                  });

          });

          var valid = 1;
          var msg = 'Code sent to your email';
          res.send({msg:msg,valid:valid});
    
        }

      })

      }else{

        var valid = 0;
        var msg = 'Email does not exists';
        res.send({msg:msg,valid:valid});

      }

    })
    

  }else{
    var valid = 0;
    var msg = 'Invalid Request';
    res.send({msg:msg,valid:valid});
  }

});

router.post('/sendRecovery', function(req,res,next){

  if(req.body.key == 'secret'){
    var email = req.body.email;
    var code = req.body.code;

    Key.findOne({email:email, tokenReg:code},function(err,key){
      if(key){
        if(key.type == 'Creation'){
          var valid = 0;
          var msg = 'Invalid Request, your account is not created yet';
          res.send({msg:msg,valid:valid});

        }else{

          var email = key.email;
          key.allowedToRecover = true;
          key.save(function(err){
            if (err) errorhandler(err);
            
            console.log("Envio el correo para notificar el recovery");

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
                  subject: "Recovery Accepted, Proceed to recover your Email", // Subject line
                  text: "Recovery Code", // plain text body
                  html: '<b>The Recovery is Ready, go to the mainpage and recover your password!</b>' // html body
              };

              transporter.sendMail(mailOptions, (error, info) => {
                  if (error) {
                      return console.log(error);
                  }
                  console.log('Message %s sent: %s', info.messageId, info.response);
                      
                  });

          });

          var valid = 1;
          var msg = 'Email sent, Please proceed to put a new password';
          res.send({msg:msg,valid:valid});
        
       }
      }else{

        var valid = 0;
        var msg = 'You did not ask for a code yet';
        res.send({msg:msg,valid:valid});

      }

    })
    
  }else{

    var valid = 0;
    var msg = 'Invalid Request';
    res.send({msg:msg,valid:valid});

  }

});

router.post('/newPass', function(req,res,next){
  
  if(req.body.key == "secret"){
    var email = req.body.email;
    var code = req.body.code;
    var password = req.body.password;
    //console.log(password);
    Key.findOne({email:email, tokenReg:code},function(err,key){
      if(key){
        if(key.type == 'Creation' && key.allowedToRecover == false){
          var valid = 0;
          var msg = 'Invalid Request, your account is not created yet';
          res.send({msg:msg,valid:valid});

        }else{
          //console.log(password);
          User.findOne({email: key.email}, function(err, user){
            //console.log(password);
            user.setPassword(password);
            user.save(function(err){
              if (err) errorhandler(err);
              
              //console.log("Envio el correo para notificar la nueva contraseña");
  
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
  
            });
          })
          
          key.deleteOne();
          var valid = 1;
          var msg = 'Your password has changed';
          res.send({msg:msg,valid:valid});
        
       }
      }else{

        var valid = 0;
        var msg = 'You did not ask for a code yet';
        res.send({msg:msg,valid:valid});

      }

    })

  }else{
    var valid = 0;
    var msg = 'Invalid Request';
    res.send({msg:msg,valid:valid});
  }

})


module.exports = router;