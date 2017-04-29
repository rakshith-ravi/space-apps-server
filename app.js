var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var authRoutes = require('./routes/auth-routes');
var articlesRoutes = require('./routes/articles-routes');
var users = require('./routes/users');

const secret = "don't tell anyone";

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(err, req, res, next){
  if(req.headers['authorization']) {
    jwt.verify(req.headers['authorization'], secret, function(err, decoded) {      
      if (err) {
        return res.json({ 
          success: false, 
          error: 'tokenautherror',
          message: 'Failed to authenticate token. Try logging out and logging in again' 
        });
      } else {
        if(decoded == req.body.username)
          next();
        else
          res.status(403).send({
            success: false,
            error: 'notoken',
            message: 'Try logging out and logging in again'
          });
      }
    });
  } else {
    res.status(403).send({
      success: false,
      error: 'notoken',
      message: 'Try logging out and logging in again'
    });
  }
});

app.use('/', authRoutes);
app.use('/', articlesRoutes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
