var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var secret = 'LlaveSecreta';

var UserSchema = new mongoose.Schema({
    username: {type: String, lowercase: true, unique: true, required: [true, "Debe rellenar todos los campos obligatorios"], match: [/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'is invalid'], index: true},
    email: {type: String, lowercase: true, unique: true, required: [true, "Debe rellenar todos los campos obligatorios"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true},
    password: {type: String, required: [true, "Debe rellenar todos los campos obligatorios"], match: [/^[0-9a-zA-Z]{8,}$/, 'is invalid']},
    hash: String,
    salt: String,
    image: {type: String, default: '/assets/images/avatars/smiley-cyrus.jpg'},
}, {timestamps: true});


UserSchema.plugin(uniqueValidator, {error: 'is already taken.'});

UserSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  };

UserSchema.methods.generateJWT = function() {
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);
  
    return jwt.sign({
      id: this._id,
      username: this.username,
      exp: parseInt(exp.getTime() / 1000),
    }, secret);
};
  
UserSchema.methods.toAuthJSON = function(){
    return {
      username: this.username,
      email: this.email,
      token: this.generateJWT(),
      image: this.image
    };
  };

  UserSchema.methods.toProfileJSONFor = function(user){
    return {
      username: this.username,
      image: this.image || 'https://static.productionready.io/images/smiley-cyrus.jpg',
    };
  };

mongoose.model('Usuarios', UserSchema);
