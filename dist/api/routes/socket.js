"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

//var notify = require("./notifications");
var mongoose = require('mongoose');

var User = mongoose.model('Usuarios');
var Messages = mongoose.model('Messages');
var onlineUsers = {};
var resOnlineUsers = {};

var moment = require('moment');

module.exports = function (io) {
  io.on('connection', function (socket) {
    onlineUsers[socket.handshake.query.id] = socket.id;
    resOnlineUsers[socket.id] = socket.handshake.query.id;
    console.log(onlineUsers);
    socket.on('conectar',
    /*#__PURE__*/
    function () {
      var _ref = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(data) {
        var mensajes;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return Messages.find({
                  timestamp: {
                    $gt: data.timestamp
                  },
                  to: data.username
                });

              case 2:
                mensajes = _context.sent;
                socket.emit('actualizacion', mensajes);

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());
    socket.on('enviar',
    /*#__PURE__*/
    function () {
      var _ref2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee2(data) {
        var mensaje;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                mensaje = new Messages();
                mensaje.text = data.text;
                mensaje.user = data.user;
                mensaje.to = data.to;
                mensaje.timestamp = data.timestamp;
                _context2.next = 7;
                return mensaje.save();

              case 7:
                console.log(onlineUsers);
                console.log(onlineUsers[data.to]);
                io.to(onlineUsers[data.to]).emit('mensaje', data);

              case 10:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    }());
    socket.on('reconnect', function () {
      connectedUsers[newUser] = socket.id;
      resOnlineUsers[socket.id] = socket.handshake.query.id;
    });
  });
};