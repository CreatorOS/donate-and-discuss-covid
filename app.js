
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var session = require('express-session');
var fileUpload = require('express-fileupload');
var { registerOauth } = require('express-oauth-any');

var dotenv = require('dotenv');
dotenv.config();

var mongoDB = process.env.MONGO_CONNECTION || 'mongodb://127.0.0.1/mydb1';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
app.use(session({ secret: process.env.SESSION_SECRET || "RANDOMSECRET"}))
registerOauth(app, {
  twitter : { key: process.env.TWITTER_API_KEY , secret : process.env.TWITTER_SECRET},
  google: { key: process.env.GOOGLE_API_KEY, secret: process.env.GOOGLE_SECRET}
});
app.use(fileUpload());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: "123123"}));
app.use('/', indexRouter);
app.use('/users', usersRouter);

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
