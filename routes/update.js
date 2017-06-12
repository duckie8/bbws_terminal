/**
 * @Author: jifeng.lv
 * @Date:   2016-12-02
 * @Email:  871593867@qq.com
* @Last modified by:   jifeng.lv
* @Last modified time: 2016-12-02
 */


var express = require('express');
var router = express.Router();
const terminalToken = require('../model/SchemaModel.js').terminalTokenModel;
const mongoose = require('../lib/Mongoose.js');
const moment = require('moment');
const card = require('../model/SchemaModel.js').cardModel;
const terminal = require('../model/SchemaModel.js').terminalModel;

router.post('/', function(req, res) {
    var data = req.body;
    var dataJ = JSON.parse(data.json);
    var ticket = dataJ.ticket;
    var stime = dataJ.startTime;
    var devSn = dataJ.devSn;
    const curtime = moment().format('YYYYMMDDHHmmss');
    var time = moment(stime, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm');
    var resData = {
        "curNums": 0,
        "dataNums": 0,
        "dataSize": 0,
        "error": 1,
        "pageSize": 300,
        "list": []
    }

    terminalToken.findOne({
        terminal_token: ticket
    }, (err, doc) => {
        if (err) {
            console.log(err);
        } else {
            if (!doc) {
                res.json({
                    "error": 0,
                    "data": {
                        "ticket": "",
                        "curTime": curtime
                    }
                });
            } else {
                terminal.find({
                    sn: devSn
                }, {
                    _id: 0,
                    schoolid: 1
                }, (err, doc) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(doc);
                        card.find({
                            schoolid: doc[0].schoolid,
                            updated: {
                                $gt: time
                            }
                        }, (err, doc) => {
                            if (err) {
                                console.log(err);
                            } else {
                                if (JSON.stringify(doc) === "[]") {
                                    var strResData = JSON.stringify(resData);
                                    res.json({
                                        "error": 1,
                                        "data": strResData
                                    });
                                } else {
                                    var arr = doc.map((data) => {
                                        if (data.usertype === "学生") {
                                            return {
                                                "cardNo": data.cardnumber,
                                                "cardType": 0,
                                                "classId": data.classid,
                                                "className": data.classname,
                                                "fingerPrint": "",
                                                "fingerPrint1": "",
                                                "fingerPrint2": "",
                                                "imgUrl": "",
                                                "name": data.username,
                                                "personId": data.userid,
                                                "toneType": 0,
                                                "reserve": ""
                                            };
                                        } else {
                                            return {
                                                "cardNo": data.cardnumber,
                                                "cardType": 1,
                                                "classId": data.classid,
                                                "className": data.classname,
                                                "fingerPrint": "",
                                                "fingerPrint1": "",
                                                "fingerPrint2": "",
                                                "imgUrl": "",
                                                "name": data.username,
                                                "personId": data.userid,
                                                "toneType": 0,
                                                "reserve": ""
                                            };
                                        }
                                    });
                                    var count = arr.length
                                    resData.dataNums = count;
                                    resData.list = arr;
                                    var strResData = JSON.stringify(resData);
                                    res.json({
                                        "error": 1,
                                        "data": strResData
                                    });
                                }
                            }
                        });
                    }
                });
            }
        }
    });
});

module.exports = router;
