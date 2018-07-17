const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const index = require('./routes/index');
const unlockCoinbaseAccount = require('./routes/unlock-coinbase-account');
const createContract = require('./routes/create-contract');
const addVnetDesign = require('./routes/addVnetDesign');
const getVnetDesign = require('./routes/getVnetDesign');
const addOEMVerdict = require('./routes/addOEMVerdict');
const addVerdict = require('./routes/addVerdict');
const getOEMVerdict = require('./routes/getOEMVerdict');
const getVerdict = require('./routes/getVerdict');
const subscribe = require('./routes/subscribe');
//const unsubscribeNewTopo = require('./routes/unsubscribeNewTopo');
const subscribeOEMVerdict = require('./routes/subscribeOEMVerdict');
const subscribeVerdict = require('./routes/subscribeVerdict');
const getBlocks = require('./routes/getBlocks');
const getSelectedBlock = require('./routes/getSelectedBlock');
const getAllEvents = require('./routes/getAllEvents');
const getTimeStampAndDName = require('./routes/getTimeStampAndDName');
const getBuisnessLogs = require('./routes/getBuisnessLogs');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/unlock-coinbase-account', unlockCoinbaseAccount);
app.use(('/create-contract'), createContract);
app.use(('/addVnetDesign'), addVnetDesign);
app.use(('/getVnetDesign'), getVnetDesign);
app.use(('/addOEMVerdict'), addOEMVerdict);
app.use(('/addVerdict'), addVerdict);
app.use(('/getOEMVerdict'), getOEMVerdict);
app.use(('/getVerdict'), getVerdict);
app.use(('/subscribe'), subscribe);
app.use(('/subscribeOEMVerdict'), subscribeOEMVerdict);
app.use(('/subscribeVerdict'), subscribeVerdict);
app.use(('/getBlocks'), getBlocks);
app.use(('/getSelectedBlock'), getSelectedBlock);
app.use(('/getAllEvents'), getAllEvents);
app.use(('/getTimeStampAndDName'),getTimeStampAndDName);
app.use(('/getBuisnessLogs'),getBuisnessLogs);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new Error('Not Found');
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
var server = app.listen(3010, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})
module.exports = app;
