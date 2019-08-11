var connectedUsers = {};
var mongoose = require('mongoose');
var Message = mongoose.model('Messages');
var express = require('express');
var router = express.Router();



router.post('/chat', function(req, res, next){

    io.on('connection', function(socket){

        var newUser = socket.handshake.query.user;
        
        socket.emit('welcome', {msg: "You are now connected"});
        console.log(socket.id);
        connectedUsers[newUser] = socket;
        console.log('the user '+ socket.handshake.query.user +' connected with id: '+socket.id);
        

            socket.on('private', function(req){
                console.log(req);
                connectedUsers[req.destiny].emit('private', {from:req.user, msg:req.msg}); 
                var newMsg = new Message();
                newMsg.text = req.msg;
                newMsg.user.username = req.user;
                newMsg.to.username = req.destiny;
                newMsg.save();
            });
    });

});

module.exports = router;