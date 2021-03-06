var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// var session = require('express-session')

var db = require('./database/index.js')

var routes = require('./routes/index');
var api = require('./routes/api');

var app = express();

// Database
db.start()

// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Middleware
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico'))); // Favicon
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
/*app.use(session({
  genid: function(req) {
    return genuuid() // use UUIDs for session IDs
  },
  secret: 'some secret somethign or another'
}));*/

// Routes
app.use('/', routes);
app.use('/api', api);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Development error handler
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
    console.error(err);
  });
}

// Production error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
  console.error(err);
});

module.exports = app
