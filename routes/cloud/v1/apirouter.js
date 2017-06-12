/**
 * @Author: jifeng.lv
 * @Date:   2016-12-21
 * @Email:  871593867@qq.com
* @Last modified by:   jifeng.lv
* @Last modified time: 2017-01-03
 */



var express = require('express');
var router = express.Router();
const login = require('./login').login;
const heart = require('./heart').heart;
const bind = require('./bind').bind;
const school = require('./school').school;
const schoolinfo = require('./schoolinfo').schoolinfo;
const report = require('./report.js').reportInfo;
const reporterr = require('./reporterr.js').reportErr;
const acquiresingle = require('./acquiresingle.js').acquiresingle;
const message = require('./message.js').message;


router.post('/HardWareLogin', login);

router.get('/HardWareHeartBeat', heart);

router.get('/HardWareSchoolBind', bind);

router.get('/GetSchoolInfo', school);

router.get('/SyncHardWareData', schoolinfo);

router.post('/RfCardCheckIn', report);

router.post('/AddMainHardWareErrorInfo', reporterr);

router.get('/SyncHardWareDataByOneImei', acquiresingle);

router.get('/GetHardWareNotice', message);


module.exports = router;
