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

var multer = require('multer');

var crypto = require('crypto');

var moment = require('moment');

var Storage = multer.diskStorage({
  destination: function destination(req, file, callback) {
    callback(null, './dist/public/images');
  },
  filename: function filename(req, file, callback) {
    var typeImage = file.mimetype.split('/');
    typeImage = typeImage[1];
    callback(null, "".concat(file.fieldname, "_").concat(Date.now(), "_").concat(file.originalname, ".").concat(typeImage));
  }
});
var upload = multer({
  storage: Storage
}).single('file');
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
router.post('/changeAvatar', function (req, res, next) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err);
      return res.status(500).json(err);
    } else if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    User.findOneAndUpdate({
      username: req.body.username
    }, {
      avatar: "/images/".concat(req.file.filename)
    }, {
      "new": true
    }, function (err, result) {
      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }

      if (result) {
        return res.json({
          success: true,
          avatar: req.file.filename
        });
      }
    });
  });
});
router.post('/updateProfile', function (req, res, next) {
  var username = req.body.username;
  var nombresyapellidos = req.body.nombresyapellidos;
  console.log(username, nombresyapellidos);
  User.findOneAndUpdate({
    username: username
  }, {
    nombresyapellidos: nombresyapellidos
  }, {
    "new": true
  }, function (err, result) {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    if (result) {
      return res.json({
        success: true
      });
    }
  });
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
  console.log(email, password, autorizacion);
  if (!email && !password && !autorizacion) return res.send({
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
            return res.send({
              message: 'Your password has changed',
              valid: true
            });
          });
        } else {
          return res.send({
            message: 'Error en email',
            valid: false
          });
        }
      });
    } else {
      return res.send({
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
  _regenerator["default"].mark(function _callee(req, res) {
    var email, usuario, msg, valid, key, now, code;
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
              _context.next = 10;
              break;
            }

            console.log('no 2');
            return _context.abrupt("return", res.send({
              message: 'Error en el formulario',
              valid: false
            }));

          case 10:
            _context.next = 12;
            return User.findOne({
              email: email
            }).exec();

          case 12:
            usuario = _context.sent;

            if (!(req.body.type == 'Creation' && usuario)) {
              _context.next = 19;
              break;
            }

            msg = 'Email ya registrado';
            valid = false;
            return _context.abrupt("return", res.send({
              message: msg,
              valid: valid
            }));

          case 19:
            _context.next = 21;
            return Key.findOne({
              email: email,
              type: 'Recovery'
            });

          case 21:
            key = _context.sent;

            if (!key) {
              _context.next = 31;
              break;
            }

            now = new Date();

            if (moment(now).valueOf() > key.exp) {
              _context.next = 30;
              break;
            }

            msg = 'Codigo Reenviado!';
            sendCode(email, key.tokenReg);
            return _context.abrupt("return", res.send({
              message: msg,
              valid: true
            }));

          case 30:
            key.deleteOne();

          case 31:
            code = makeid(5);
            key = new Key();
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

          case 39:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
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
  now = moment(now).valueOf();
  Key.findOne({
    email: email,
    tokenReg: code,
    exp: {
      $gt: now
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
router.post('/changePassword', function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var salt = crypto.randomBytes(16).toString('hex');
  var hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');
  User.findOneAndUpdate({
    username: username
  }, {
    salt: salt,
    hash: hash
  }, {
    "new": true
  }, function (err, result) {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    if (result) {
      return res.json({
        success: true
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
    host: 'mail.businet-web.com',
    port: 465,
    secure: true,
    auth: {
      user: 'ivan.guerrero@businet-web.com',
      pass: 'rogue195:)'
    }
  });
  var mailOptions = {
    from: '"BLIND3" <ivan.guerrero@businet-web.com>',
    // sender address
    to: email,
    // list of receivers
    subject: "Verification Code from BLIND3",
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