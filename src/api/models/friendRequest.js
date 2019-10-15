var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var FriendRequestSchema = new mongoose.Schema({
    username: {type: String, lowercase: true, unique: true, required: [true, "Debe rellenar todos los campos obligatorios"], match: [/^[a-zA-Z0-9]+$/, 'is invalid'], index: true},
    request:  {type: String, lowercase: true, unique: true, required: [true, "Debe rellenar todos los campos obligatorios"], match: [/^[a-zA-Z0-9]+$/, 'is invalid'], index: true}
}, {timestamps: true});
 
FriendRequestSchema.plugin(uniqueValidator, {error: 'is already taken.'});

mongoose.model('FriendRequest', FriendRequestSchema);
