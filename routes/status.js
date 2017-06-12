/**
 * @Author: jifeng.lv
 * @Date:   2016-12-01
 * @Email:  871593867@qq.com
* @Last modified by:   jifeng.lv
* @Last modified time: 2016-12-12
 */



var express = require('express');
var router = express.Router();
const mongoose = require('../lib/Mongoose.js');
const terminalToken = require('../model/SchemaModel.js').terminalTokenModel;
const moment = require('moment');
const card = require('../model/SchemaModel.js').cardModel;
const terminalModel = require('../model/SchemaModel.js').terminalModel;
const cardAcquire = require('../lib/CardAcquire.js');


router.post('/', function(req, res) {
    var data = req.body;
    var dataJ = JSON.parse(data.json);
    var ticket = dataJ.ticket;
    var terminalNum = dataJ.deviceId;
    var stime = dataJ.stime;
    var actionCode = dataJ.actionCode;

    const curtime = moment().format('YYYYMMDDHHmmss');
    var time = moment(stime, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm');
    var dateNow = moment().format();

    var reqData = {
        "actionCode": "",
        "codeVal": "",
        "ticket": ticket,
        "curTime": curtime
    }

    terminalToken.findOneAndUpdate({
        terminal_token: ticket,
        terminalnumber: terminalNum
    }, {
        currenttime: dateNow
    }, (err, doc) => {
        if (err) {
            console.log(err);
        } else {
            if (!doc) {
                return res.json({
                    "error": 0,
                    "data": {
                        "ticket": "",
                        "curTime": curtime
                    }
                });
            } else {
                if (actionCode === '101') {
                    card.findOne((err, doc) => {
                        if (err) {
                            console.log(err);
                        } else {
                            if (!doc) {
                                terminalModel.find({
                                    terminalnumber: terminalNum
                                }, {
                                    _id: 0,
                                    schoolid: 1
                                }, (err, doc) => {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        cardAcquire(doc[0].schoolid);
                                        res.json({
                                            "error": 1,
                                            "data": JSON.stringify(reqData)
                                        });
                                    }
                                });
                            } else {
                                card.find({
                                    "updated": {
                                        $gt: time
                                    }
                                }, (err, doc) => {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        if (JSON.stringify(doc) === "[]") {
                                            var strReqData = JSON.stringify(reqData)
                                            res.json({
                                                "error": 1,
                                                "data": strReqData
                                            });
                                        } else {
                                            reqData.actionCode = "101"
                                            var strReqData = JSON.stringify(reqData)
                                            res.json({
                                                "error": 1,
                                                "data": strReqData
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    })
                } else {
                    res.json({
                        "error": 1,
                        "data": JSON.stringify(reqData)
                    });
                }
            }
        }
    });
});
module.exports = router;
