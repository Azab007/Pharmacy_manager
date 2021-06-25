var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
session = require('express-session');
const {v4:uuidv4}=require("uuid");
const sequelize = require('./models'); 
const drugModel = require('./models/drugs')
const userModel = require('./models/users')
const salesModel = require('./models/sales')











/////////////////////////////////////////////////////////////////////////////

var homeRouter  = require('./routes/home');
var loginRouter  = require('./routes/login');
var newRouter  = require('./routes/new');
var orderRouter  = require('./routes/order');

var app = express();


app.use(session({
  secret:uuidv4(),
  resave:false,
  saveUninitialized : true

}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


///////////////////////////////////////////////////////////////////

app.use('/home', homeRouter)
app.use('/login', loginRouter)
app.use('/new', newRouter)
app.use('/order', orderRouter)



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

sequelize.sync()
 .then(()=>{console.log("connected to db.")})
 .catch((err)=>console.log(err))

module.exports = app;
