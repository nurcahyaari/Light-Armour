var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('express-flash');
var chance = require('chance');
let setTimeSession = 26280000000;


//router indexing
var store = require('./routes/storeIndex');
var users = require('./routes/storeProfile');
var adminIndex = require('./routes/admin_index');
var login = require('./routes/storeLogin');
var product = require('./routes/storeProducts');
var cart = require('./routes/storeCart');
var register = require('./routes/storeRegisterNewUser');
var show = require('./routes/showAllProduct');
var checkOut = require('./routes/storeCheckOut');
var verifikasiPembayaran = require('./routes/storeVerifikasiPembayaran');

//just test
var test = require('./routes/test');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('trust proxy', 1);
app.use(session({
                  secret: "it's a secret word",
                  resave: false,
                  saveUninitialized: true,
                  cookie: { secure: false, maxAge: setTimeSession}
                }));
app.use(flash());

// router setting up
app.use('/', store);
app.use('/', login);
app.use('/', product);
app.use('/', cart);
app.use('/', users);
app.use('/', register);
app.use('/', checkOut);
app.use('/', verifikasiPembayaran);
app.use('/show', show);
app.use('/admin', adminIndex);

//just test
app.use('/', test);

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
