var express = require('express');
var session = require('express-session');
var fs = require('fs');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./app_server/routes/');
var users = require('./app_server/routes/users');

var KEY_PATH = 'local/keys/key.pem';
var CERT_PATH = 'local/keys/cert.pem';
var ROOT_PATH = 'local/ldresources/';
var HTTPS_PORT = 5000;

var PRIVATE_KEY = fs.readFileSync(KEY_PATH);
var CERT = fs.readFileSync(CERT_PATH);

var credentials = {
    requestCert: true,
    rejectUnauthorized: false,
    key: PRIVATE_KEY,
    cert: CERT
};

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'bionode',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialize: false
}));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
