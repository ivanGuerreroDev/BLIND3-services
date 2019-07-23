var createError = require('http-errors');
var isProduction = process.env.NODE_ENV === 'production';
var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
if(isProduction){
  mongoose.connect(process.env.MONGODB_URI,{ useNewUrlParser: true });
} else {
  mongoose.connect('mongodb://blind3:businetBlind3@ds149146.mlab.com:49146/heroku_33n7zg9w', { useNewUrlParser: true });
  mongoose.set('debug', true);
}
require('./api/models/usuarios');
require('./api/models/keys');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport');
var nodeMailer = require('nodemailer');
const session = require('express-session');
var errorhandler = require('errorhandler');
var port = process.env.PORT || 3000;
var isProduction = process.env.NODE_ENV === 'production';
var app = express();

const token = require('./api/middlewares/token') ;
// connect to our database
if (!isProduction) {
  app.use(errorhandler());
}

//middleware

// view engine setup
app.use(passport.initialize());
app.use(passport.session());
app.use(session(
  {
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(
  {
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));
app.use(passport.initialize());
app.use(passport.session());


var indexRouter = require('./api/routes/index');
app.use('/api', token.checkToken, indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
