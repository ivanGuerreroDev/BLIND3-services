"use strict";

var mongoose = require('mongoose');

var uniqueValidator = require('mongoose-unique-validator');

var crypto = require('crypto');

var jwt = require('jsonwebtoken');

var secret = require('../../config').secret;

var keySchema = new mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    required: [true, "Debe rellenar todos los campos obligatorios"],
    match: [/\S+@\S+\.\S+/, 'is invalid']
  },
  exp: Date,
  type: {
    type: String,
    "enum": ['Creation', 'Recovery'],
    required: true
  },
  tokenReg: String,
  allowed: {
    type: Boolean,
    "default": false
  }
}, {
  timestamps: true
});
keySchema.plugin(uniqueValidator, {
  error: 'is already taken.'
});

keySchema.methods.generateExpDate = function () {
  var today = new Date();
  this.exp = new Date(today) + 1;
};

mongoose.model('Keys', keySchema);