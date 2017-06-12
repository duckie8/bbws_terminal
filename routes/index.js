/**
 * @Author: jifeng.lv
 * @Date:   2016-11-21
 * @Email:  871593867@qq.com
 * @Last modified by:   jifeng.lv
 * @Last modified time: 2017-03-24
 */



var express = require('express');
var router = express.Router();
const random = require('../lib/random.js');
const moment = require('moment');
const mongoose = require('../lib/Mongoose.js');
const terminalModel = require('../model/SchemaModel.js').terminalModel;
const terminalToken = require('../model/SchemaModel.js').terminalTokenModel;
const cardSave = require('../lib/CardAcquire.js');

//机具认证
router.post('/', function(req, res) {

    var time = moment().format();
    const curtime = moment().format('YYYYMMDDHHmmss');
    var data = req.body;
    var jsonReq = JSON.parse(data.json);
    var deviceId = jsonReq.deviceId;
    //查询是否有该机具deviceId
    terminalModel.find({
        terminalnumber: deviceId
    }, {
        _id: 0,
        schoolid: 1
    }, (err, doc) => {
        if (err) {
            console.log(err);
        } else {
            //没有就直接返回
            if (JSON.stringify(doc) === "[]") {
                return res.json({
                    "error": 0,
                    "data": ""
                });
            } else {
                cardSave(doc[0].schoolid);
                //否则生成token，保存并返回
                var ticket = random.generateMixed(32);
                var tokenInfo = {
                    terminal_token: ticket,
                    terminalnumber: deviceId,
                    currenttime: time
                };
                terminalToken.create(tokenInfo, (err, doc) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(doc);
                    }
                });
                var reqData = {
                    "curTime": curtime,
                    "ticket": ticket
                };
                var strReqData = JSON.stringify(reqData);
                res.json({
                    "error": 1,
                    "data": strReqData
                });
            }
        }
    });
});
module.exports = router;
