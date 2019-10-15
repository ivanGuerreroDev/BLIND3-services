"use strict";

var mongoose = require('mongoose');

var uniqueValidator = require('mongoose-unique-validator');

var User = mongoose.model('Usuarios');
var messageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  user: {
    username: {
      type: String,
      required: true
    },
    avatar: String
  },
  to: {
    username: {
      type: String,
      required: true
    }
  }
}, {
  timestamps: true
});

messageSchema.methods.validUser = function (user) {
  var tempUser = new User();
  tempUser.username = user.username;
  tempUser.findOne(function (err, user) {
    if (user) {
      return 1;
    } else {
      return 0;
    }
  });
};

mongoose.model('Messages', messageSchema);