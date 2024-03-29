var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
require('dotenv').config();

var liveRouter = require('./routes/live');
var masterRouter = require('./routes/master');
var statsRouter = require('./routes/stats');
var contactRouter = require('./routes/contact');
var dealsRouter = require('./routes/deals');

var app = express();

// Increase the request size limit for JSON data (e.g., 10MB)
app.use(express.json({ limit: '10mb' }));

// Increase the request size limit for URL-encoded data (e.g., 10MB)
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://toff.brokoly.de',
    'https://toff-musik.de',
  ],
};

app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

app.use('/api/live', liveRouter);
app.use('/api/master', masterRouter);
app.use('/api/stats', statsRouter);
app.use('/api/contact', contactRouter);
app.use('/api/deals', dealsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
