var express = require('express');
var usersController= require('./controllers/usersController');
var pushNotificationController= require('./controllers/pushNotificationController');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var favicon = require('static-favicon');
var logger = require('morgan');
var path = require('path');
var mysql = require('mysql');
var app = express();
var nodemailer = require('nodemailer');
var fs = require("fs");
var multer  = require('multer');
var mongoose = require('mongoose');
mongoose.set('debug', true);
// connect to mongoDB
// var dbConfig = require('./db');

// mongoose.connect(dbConfig.url); 

//***********************to uplad file*******************
 var urlencodedParser = bodyParser.urlencoded({ extended: false });
  app.use(multer({dest:'./uploads/'}).array('image'));
  app.use( bodyParser.json());       // to support JSON-encoded bodies
  app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
   extended: true
  })); 
 
 
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'src')));

// Configuring Passport
//var passport = require('passport');
var expressSession = require('express-session');
// TODO - Why Do we need this key ?
//app.use(expressSession({secret: 'mySecretKey'}));
 
//for maintain sessions on server
var expressSession = require('express-session');
var MySQLStore = require('express-mysql-session')(expressSession);
var mysql = require('mysql');
var options = {
    host     : 'localhost',
	port     : '3306',  // your host
    user: 'root', // your database user
   password: 'npni_ctwr', // your database password
   database: 'npni_ctwr',
   charset: 'UTF8_GENERAL_CI'
};

var sessionStore = new MySQLStore(options);
 
app.use(expressSession({
    key: 'sessionCookieData',
    secret: 'sessionData',
    store: sessionStore,
    resave: true,
    saveUninitialized: true
}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.options('*', function(req, res) {
    res.send(200);
});

//*******to user login*********************
app.post('/user/login', usersController.user_login);

//*******to user logout*********************
app.get('/user/logout', usersController.user_logout);

//*******to check user loggedIn or not*************
app.get('/user/isLoggedIn', usersController.user_isLoggedIn);

//*******to user register*******************
app.post('/user/register', usersController.user_register);

//*******to store raw data*******************
app.post('/device/rawdata', usersController.store_data);

//*******to edit user profile*****************
app.all('/user/editProfile/:user_id', usersController.user_edit_profile);

//*******to change password******************
app.post('/user/changePassword', usersController.user_change_password);

//*******to forgot password******************
app.post('/user/forgotPassword', usersController.user_forgot_password);

//*******to get bike info******************
app.post('/user/bikeInfo', usersController.user_bike_info);

//*******to get OTP in phone******************
app.post('/user/otp', usersController.send_code);

//*******to get states list******************
//app.get('/states', usersController.get_state);

//*******to get countries list******************
app.get('/countries', usersController.get_country);

//*******to get states list******************
app.get('/states/:country_id', usersController.get_state);

//*******to get cities list******************
app.get('/cities/:state_id', usersController.get_city);

//*******to add bike info******************
app.post('/user/addBike',usersController.user_add_bike); 

//*******to register a device for push notification*****
app.post('/push/device_register',pushNotificationController.device_register); 

//*******to get bike health*****************
app.post('/user/bike_health',usersController.user_bike_health); 


//catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

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

module.exports = app;
app.listen(3006);
console.log('Listening on port 3006...');
