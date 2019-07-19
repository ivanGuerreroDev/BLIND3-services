var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./api/index');
var usersRouter = require('./routes/users');
var mongoose = require('mongoose');
var usersAccountCreate = require('./api/createAccount');
var usersAccountDelete = require('./api/delete');
const passport = require('passport');
const session = require('express-session');


var app = express();
// connect to our database
if (!isProduction) {
  app.use(errorhandler());
}

if(isProduction){
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect('mongodb://blind3:businetBlind3@ds149146.mlab.com:49146/heroku_33n7zg9w');
  mongoose.set('debug', true);
}
require('./models');
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

app.use('/', indexRouter);
app.use('/', usersRouter);
app.use('/', usersAccountCreate);
app.use('/', usersAccountDelete);

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
