var createError = require('http-errors');
var isProduction = process.env.NODE_ENV === 'production';
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport');
var nodeMailer = require('nodemailer');
const session = require('express-session');
var errorhandler = require('errorhandler');
const cors = require('cors');
var mongoose = require('mongoose'), MongoStore = require('connect-mongo')(session);
mongoose.set('useCreateIndex', true);

  mongoose.connect('mongodb://blind3:businetBlind3@ds149146.mlab.com:49146/heroku_33n7zg9w', { useNewUrlParser: true });
  mongoose.set('debug', true);

require('./api/models/usuarios');
require('./api/models/keys');

var port = process.env.PORT || 3000;
var isProduction = false;
var app = express();

// connect to our database
if (!isProduction) {
  app.use(errorhandler());
}

//middleware

// view engine setup


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.options('*', cors());
var indexRouter = require('./api/routes/index');
app.use('/api', indexRouter);




app.use(session({ 
  secret: 'secret',
  saveUninitialized: true,
	resave: true,
	store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport');


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
