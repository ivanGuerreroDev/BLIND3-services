var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('Usuarios');


passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({username: username}).then(function(user){
            if(!user || !user.validPassword(password)){
                return done(null, false, {error: 'Usuario o contraseña invalidos'});
            }
            return done(null, user);
        }).catch(done);
    }
));
passport.use('app',new LocalStrategy(
    function(username, password, done) {
        User.findOne({username: username}).then(function(user){
            
            if( !user ){
                return done(null, false, { message: 'Usuario incorrecto.' });
            }
            if( !user.validPassword(password)){
                return done(null, false, {message: 'Contraseña incorrecta'} );
            }
            return done(null, user);
            
        });
    }
  ));
  passport.use('logoff',new LocalStrategy(
    function(username, token, done) {
        User.findOne({username: username}).then(function(user){
            
            if( !user.token ){
                return done(null, false, { message: 'Usuario no logeado.' });
            }
            if( !user ){
                return done(null, false, {message: 'Usuario no logeado.'} );
            }
            return done(null, user);
            
        });
    }
  ));