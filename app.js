var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require("body-parser");

var indexRouter = require('./routes/index');
var queriesRouter = require('./routes/queries');
var sensorsRouter = require('./routes/sensors');
var phenomenaRouter = require('./routes/phenomena');
var devicesRouter = require('./routes/devices');
var domainsRouter = require('./routes/domains');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/*',function(req,res,next){
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  next();
});

app.use('/', indexRouter);
app.use('/queries', queriesRouter);
app.use('/sensors', sensorsRouter);
app.use('/phenomena', phenomenaRouter);
app.use('/devices', devicesRouter);
app.use('/domains', domainsRouter);
app.use(express.static('owl'));


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
