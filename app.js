//Boilerplate
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var monk =require('monk');

let cors = require('cors');
var corsOptions = {
  origin:'http://localhost:3000',
  credentials:true
};
app.use(cors(corsOptions));

var cookieParser = require('cookie-parser');
app.use(cookieParser());

var db= monk('localhost:27017/assignment2');

var usersRouter = require('./routes/albums');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next){
  req.db = db;
  next();
});

app.use('/', usersRouter);

app.listen(3002, function () {
  console.log("Working!");
});

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {

  res.locals.message = err.message;
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});
