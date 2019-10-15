"use strict";

//var notify = require("./notifications");
var mongoose = require('mongoose');

var User = mongoose.model('Usuarios');
var Message = mongoose.model('Messages');
var connectedUsers = {};
var resOnlineUsers = {};

module.exports = function (io) {
  io.on('connection', function (socket) {
    onlineUsers[socket.handshake.query.id] = socket.id;
    resOnlineUsers[socket.id] = socket.handshake.query.id;
    socket.on('update messages', function (data) {});
    socket.on('chat', function (req) {
      console.log(req);
      Message.find({
        $or: [{
          user: {
            username: req.user
          },
          createdAt: {
            $lt: req.date
          }
        }, {
          to: {
            username: req.user
          },
          createdAt: {
            $lt: req.date
          }
        }]
      }, function (err, res) {
        if (err) {
          socket.emit({
            success: false,
            msg: false
          });
        } else {
          console.log(res);
          socket.emit('Pre-load', {
            success: true,
            msg: res
          });
        }
      });
    });
    socket.on('private', function (req) {
      console.log(req);

      if (connectedUsers[req.destiny]) {
        socket.to(connectedUsers[req.destiny]).emit('private', {
          from: req.user,
          msg: req.msg
        });
        /* io.to(connectedUsers[req.destiny]).emit('private', {from:req.user, msg:req.msg}) */
      }

      var newMsg = new Message();
      newMsg.text = req.msg;
      newMsg.user.username = req.user;
      newMsg.to.username = req.destiny;
      newMsg.save();
    });
    socket.on('reconnect', function () {
      connectedUsers[newUser] = socket.id;
      resOnlineUsers[socket.id] = socket.handshake.query.id;
    });
  });
};