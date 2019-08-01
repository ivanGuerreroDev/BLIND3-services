var createError = require('http-errors');
var isProduction = process.env.NODE_ENV === 'production';
import express from'express';
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

var debug = require('debug')('blind3-services:server');
var http = require('http');
/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(process.env.PORT || 3000);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

