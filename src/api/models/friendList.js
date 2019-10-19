var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var FriendListSchema = new mongoose.Schema({
    username: {type: String, lowercase: true, unique: true, required: [true, "Debe rellenar todos los campos obligatorios"], match: [/^[a-zA-Z0-9]+$/, 'is invalid'], index: true},
    friends: [
        {
            username: {type: String, lowercase: true, index:true },
            nombresyapellidos: String,
            avatar: String
        }
    ],

}, {timestamps: true});
 
FriendListSchema.plugin(uniqueValidator, {error: 'is already taken.'});

mongoose.model('Friendlist', FriendListSchema);
