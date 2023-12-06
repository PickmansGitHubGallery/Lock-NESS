var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const multer = require('multer');
const upload = multer(); // Initialize multer

const bodyParser = require('body-parser');



var DataHandler = require('./modules/DataHandler.js');
var indexRouter = require('./routes/index');
var GenerateRouter = require('./routes/Generate');
var TeamRouter = require('./routes/myteam');
var CreateUserRouter = require('./routes/createUser');
var loginRouter = require('./routes/login');
var searchRouter = require('./routes/myTeamSearchBar');
var generateButtonRouter = require('./routes/generateToBox');

const db = require('./database/db.js');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(upload.any());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/Generate', GenerateRouter);
app.use('/', indexRouter);
app.use('/myTeam', TeamRouter);
app.use('/CreateUser', CreateUserRouter);
app.use('/login', loginRouter);
app.use('/', searchRouter);
app.use('/myTeamSearchBar', searchRouter);
app.use('/generateToBox', generateButtonRouter);



app.use(function(req, res, next) {
  next(createError(404, 'Not Found'));
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
