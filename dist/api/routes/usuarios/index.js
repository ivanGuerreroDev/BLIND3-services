"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var express = require('express');

var router = express.Router();

var jwt = require('jsonwebtoken');

var nodeMailer = require('nodemailer');

var mongoose = require('mongoose');

var User = mongoose.model('Usuarios');
var Key = mongoose.model('Keys');
var Friendlist = mongoose.model('Friendlist');

var passport = require('passport');

var token = require('../../middlewares/token');

router.post('/login', function (req, res, next) {
  passport.authenticate('app', {
    session: false,
    badRequestMessage: 'Debe rellenar todos los campos.'
  }, function (err, user, info) {
    if (!user || err) {
      console.log(err);
      return res.json({
        success: false,
        info: info,
        error: err
      });
    }

    user.token = user.generateJWT();
    return res.json({
      success: true,
      user: user.toAuthJSON()
    });
  })(req, res, next);
});
router.post('/logout', function (req, res, next) {
  passport.authenticate('logoff', {
    session: false,
    badRequestMessage: 'Su sesion ya no existe, inicie sesion de nuevo'
  }, function (err, user, info) {
    if (!user || err) {
      return res.json({
        success: false,
        info: info,
        error: err
      });
    }

    user.token = "";
    req.logout();
    return res.json({
      success: true,
      msg: "Ya ha cerrado sesion, volviendo a la pagina principal"
    });
  })(req, res, next);
});
router.post('/accountCreation', function (req, res, next) {
  //create && //read
  if (!req.body.email && !req.body.username && !req.body.password && !req.body.autorizacion) {
    res.send({
      message: 'Debe rellenar todos los campos',
      valid: false
    });
  } else {
    var email = req.body.email;
    Key.findById(req.body.autorizacion, function (err, key) {
      if (err) {
        res.send({
          message: 'err',
          valid: false
        });
      } else if (key) {
        key.deleteOne();
        var newUser = new User();
        newUser.nombresyapellidos = req.body.nombres;
        newUser.username = req.body.username;
        newUser.email = email;
        var friendlist = new Friendlist();
        friendlist.username = newUser.username;
        friendlist.save();
        newUser.setPassword(req.body.password);
        newUser.save(function (err2) {
          if (err2) {
            res.send({
              message: err2,
              valid: false
            });
          } else {
            res.send({
              message: 'Account Created',
              valid: true
            });
          }
        });
      } else {
        res.send({
          message: 'Email in use',
          valid: false
        });
      }
    });
  }
});
router.post('/recovery', function (req, res, next) {
  var email = req.body.email;
  var autorizacion = req.body.autorizacion;
  var password = req.body.password;
  if (!email && !password && !autorizacion) res.send({
    message: 'Debe rellenar todos los campos',
    valid: false
  });
  Key.findById(autorizacion, function (err, key) {
    if (key) {
      User.findOne({
        email: email
      }, function (err, user) {
        if (user) {
          user.setPassword(password);
          user.save(function (err) {
            if (err) errorhandler(err);
            var transporter = nodeMailer.createTransport({
              host: 'smtp.gmail.com',
              port: 465,
              secure: true,
              auth: {
                user: 'noreplybusient@gmail.com',
                pass: 'BuSiNeT1'
              }
            });
            var mailOptions = {
              from: '"No-Reply Businet" <noreplybusient@gmail.com>',
              // sender address
              to: email,
              // list of receivers
              subject: "Recovery Accepted, Your password has change",
              // Subject line
              text: "Recovery Code",
              // plain text body
              html: 'The Recovery is Ready, Your password has change Your new password is: <b>' + password + '</b>' // html body

            };
            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                return console.log(error);
              }

              console.log('Message %s sent: %s', info.messageId, info.response);
            });
            key.deleteOne();
            res.send({
              message: 'Your password has changed',
              valid: true
            });
          });
        } else {
          res.send({
            message: 'Error en email',
            valid: false
          });
        }
      });
    } else {
      res.send({
        message: 'Error en codigo de autorizacion',
        valid: false
      });
    }
  });
});
router.post('/permission',
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(req, res, next) {
    var email, usuario, msg, valid;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            email = req.body.email;

            if (email) {
              _context.next = 5;
              break;
            }

            return _context.abrupt("return", res.send({
              message: 'correo no recibido',
              valid: false
            }));

          case 5:
            if (req.body.type) {
              _context.next = 8;
              break;
            }

            console.log('no 2');
            return _context.abrupt("return", res.send({
              message: 'Error en el formulario',
              valid: false
            }));

          case 8:
            _context.next = 10;
            return User.findOne({
              email: email
            }, function (err, user) {
              if (err) {
                return res.send({
                  message: err,
                  valid: false
                });
              }
            });

          case 10:
            usuario = _context.sent;

            if (!(req.body.type == 'Creation' && usuario)) {
              _context.next = 17;
              break;
            }

            msg = 'Email ya registrado';
            valid = false;
            return _context.abrupt("return", res.send({
              message: msg,
              status: valid
            }));

          case 17:
            Key.findOne({
              email: email
            }, function (err, user) {
              if (err) return res.send({
                message: err,
                valid: false
              });

              if (user) {
                var now = new Date();

                if (!(now > user.exp)) {
                  var msg = 'Codigo Reenviado!';
                  sendCode(email, user.tokenReg);
                  return res.send({
                    message: msg,
                    valid: false
                  });
                }
              }

              var code = makeid(5);
              var key = new Key();
              key.email = email;
              key.tokenReg = code;
              key.generateExpDate();
              key.type = req.body.type;
              sendCode(email, code);
              key.save(function (err) {
                if (err) console.log(err);
                var msg = 'Codigo enviado!';
                return res.send({
                  message: msg,
                  valid: true
                });
              });
            });

          case 18:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());
router.post('/allowing', function (req, res, next) {
  if (!req.body.code && !req.body.email) res.send({
    message: 'Rellenar todos los campos!',
    valid: false
  });
  var code = req.body.code;
  var email = req.body.email;
  var now = new Date();
  Key.findOne({
    email: email,
    tokenReg: code,
    exp: {
      $lt: now
    }
  }, function (err, key) {
    if (err) {
      res.send({
        message: 'error',
        valid: false
      });
    } else if (!key) {
      res.send({
        message: 'Codigo no encontrado o expirado',
        valid: false
      });
    } else {
      res.send({
        resp: key._id,
        valid: true
      });
    }
  });
});

function makeid(length) {
  console.log('ejecutado makeid');
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var charactersLength = characters.length;

  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

function sendCode(email, code) {
  console.log('ejecutado sendCode');
  var transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'ivan.guerrero@businet-web.com',
      pass: 'rogue195:)'
    }
  });
  var mailOptions = {
    from: '"Businet" <ivan.guerrero@businet-web.com>',
    // sender address
    to: email,
    // list of receivers
    subject: "Verification Code from Businet",
    // Subject line
    text: "Verification Code",
    // plain text body
    html: '<b>The Verification Code is: ' + code + '</b>' // html body

  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) return console.log(error);
    console.log('Message %s sent: %s', info.messageId, info.response);
  });
}

;
module.exports = router;