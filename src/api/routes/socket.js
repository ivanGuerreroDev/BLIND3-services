//var notify = require("./notifications");
var mongoose = require('mongoose');
var User = mongoose.model('Usuarios');
var Messages = mongoose.model('Messages');
var connectedUsers = {};
var resOnlineUsers = {};
var moment = require('moment');
module.exports = function(io) {
  io.on('connection', function(socket){
    onlineUsers[socket.handshake.query.id] = socket.id;
    resOnlineUsers[socket.id] = socket.handshake.query.id;

    socket.on('conectar', async function (data) {
      var mensajes = await Messages.find({timestamp: {$gt:data.timestamp}, user: data.username, to:data.username});
      socket.emit('actualizacion', mensajes)
    })
    socket.on('enviar', async function(data){
      var mensaje = new Messages();
      mensaje.text = data.text;
      mensaje.user = data.user;
      mmensaje.to = data.to;
      mensaje.timestamp = data.timestamp;
      await mensaje.save();
      io.to(onlineUsers[data.to]).emit('mensaje',data)
    });
    socket.on('reconnect', function() {
      connectedUsers[newUser] = socket.id;
      resOnlineUsers[socket.id] = socket.handshake.query.id;
    });

  });
}