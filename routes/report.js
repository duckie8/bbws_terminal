/**
 * @Author: jifeng.lv
 * @Date:   2016-12-01
 * @Email:  871593867@qq.com
* @Last modified by:   jifeng.lv
* @Last modified time: 2016-12-22
 */


const Promise = require('bluebird');
const OSS = require('ali-oss').Wrapper;
const ossConfig = require('../config.js').oss;
var express = require('express');
var router = express.Router();
const mongoose = require('../lib/Mongoose.js');
const card = require('../model/SchemaModel.js').cardModel;
const terminal = require('../model/SchemaModel.js').terminalModel;
const token = require('../model/SchemaModel.js').tokenModel;
const request = require('request');
const report = require('../model/SchemaModel.js').reportModel;
const terminalToken = require('../model/SchemaModel.js').terminalTokenModel;
const moment = require('moment');

const curtime = moment().format('YYYYMMDDHHmmss');
const time = moment().format();

var client = new OSS({
    endpoint: ossConfig.oss_url,
    accessKeyId: ossConfig.oss_id,
    accessKeySecret: ossConfig.oss_secret,
    bucket: ossConfig.oss_bucket,
    cname: true
});


function seacherCard(cardNum) {
    return new Promise((resolve, reject) => {
        card.find({
            cardnumber: cardNum
        }, (err, doc) => {
            if (err) {
                reject(err);
            } else {
                resolve(doc[0]);
            }
        });
    });
}

function searchTerminal(terminalNum) {
    return new Promise((resolve, reject) => {
        terminal.find({
            terminalnumber: terminalNum
        }, (err, doc) => {
            if (err) {
                reject(err);
            } else {
                resolve(doc[0]);
            }
        });
    });
}

function upload(filenName, pic) {
    return new Promise((resolve, reject) => {
        client.put(filenName, pic).then((res) => {
            resolve(res.url);
        });
    });
}

router.post('/', function(req, res) {
    var data = req.body;
    var dataJson = JSON.parse(data.json);
    var terminalNum = dataJson.deviceId;
    var cardnumber = dataJson.cardNo;
    var arrTime = dataJson.attTime
    var brushtime = moment(arrTime, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm');
    var ticket = dataJson.ticket;
    var pic = Buffer.from(dataJson.pics[0].contents, 'base64');
    var filename = dataJson.pics[0].fileName;

    var Hour = parseInt(arrTime.replace(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/, "$4"));
    var inout = function() {
        if (Hour < 12) {
            return "1";
        } else {
            return "2";
        }
    };


    function main() {
        token.findOne((err, doc) => {
            if (err) {
                console.log(err);
            } else {
                Promise.all([seacherCard(cardnumber), searchTerminal(terminalNum), upload(filename, pic)]).then((values) => {
                    var options = {
                        uri: "http://apps.mmc06.com/v2/Terminal/putCok",
                        method: "post",
                        headers: {
                            "Content-Type": "application/json",
                            "Token": doc.oauth_token
                        },
                        body: {
                            "terminalnumber": terminalNum,
                            "cardnumber": cardnumber,
                            "brushtime": brushtime,
                            "inout": inout(),
                            "module": values[1].module,
                            "submodule": values[1].submodule,
                            "memberid": values[0].userid,
                            "membername": values[0].username,
                            "cardholder": values[0].cardholder,
                            "Photo": values[2],
                            "classid": values[0].classid,
                            "classname": values[0].classname,
                            "schoolid": values[0].schoolid,
                            "schoolname": values[0].schoolname,
                            "platformid": "毛毛虫"
                        },
                        json: true
                    }
                    request(options, function(err, res, body) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(body);
                            var reportEntity = {
                                cardnumber: cardnumber,
                                msg: body,
                                creattime: time
                            }
                            report.create(reportEntity, (err, doc) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log(doc);
                                }
                            });
                        }
                    });
                });
            }
        });
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
                main();
                res.json({
                    "error": 1,
                    "data": ""
                });
            }

        }
    });
});
module.exports = router;
