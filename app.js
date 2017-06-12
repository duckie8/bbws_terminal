/**
 * @Author: jifeng.lv
 * @Date:   2016-11-21
 * @Email:  871593867@qq.com
* @Last modified by:   jifeng.lv
* @Last modified time: 2017-03-10
 */



var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const routes = require('./routes/index');
const statu = require('./routes/status');
const update = require('./routes/update');
const report = require('./routes/report');
const updatTerminal = require('./lib/HoldTerminal.js');
const schedule = require('node-schedule');
var cloudapi = require('./routes/cloud/v1/apirouter.js');
const log = require('./log.js');
const memeye = require('memeye');

var app = express();

memeye();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var j = schedule.scheduleJob('0 0 0 * * *', function() {
    updatTerminal();
});
updatTerminal();

// 机具认证路由
app.use('/xinnuo/service/10', routes);
//心跳验证路由
app.use('/xinnuo/service/05', statu);
//卡更新路由
app.use('/xinnuo/service/84', update);
//上报路由
app.use('/xinnuo/service/04', report);

//保贝卫士机具路由
app.use('/api/V1', cloudapi);

app.use('/api/V1', function(req, res, next) {
    res.json({
        "StateCode": 0,
        "StateMsg": null,
        "Data": {}
    });
});

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
