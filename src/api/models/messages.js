var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var User = mongoose.model('Usuarios');

var messageSchema = new mongoose.Schema({
    createdAt: new Date(),
    text: {type: String, required: true},
    user: {
        username: String,
        avatar: String,
    } 
  }, {timestamps: true});
  
  messageSchema.methods.validUser = function(user) {
    var tempUser = new User();
    tempUser.username = user.username;
    tempUser.findOne(function(err,user){
        if(user){
            return 1;
        }else{
            return 0;
        }
    });
  };

  mongoose.model('Messages', messageSchema);