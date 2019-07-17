var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var url = 'mongodb://blind3:businetBlind3@ds149146.mlab.com:49146/heroku_33n7zg9w';


passport.use(new LocalStrategy(
    function(user, done) {
        mongo.connect(url, { useNewUrlParser: true } , function(err, client) {
            const db = client.db("heroku_33n7zg9w");
            var cursor = db.collection('users').findOne(user);
            var tempUser;
            client.close();
            if (cursor) {
                tempUser = tojson(cursor.name);
                //print(tojson(myName));
            }
            if( user.password !== tempUser.password ){
                return done(null, false, {error: 'Usuario o contraseña invalidos'});
            }
          }).catch(done);
    }
));