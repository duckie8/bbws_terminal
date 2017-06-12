/**
 * @Author: jifeng.lv
 * @Date:   2016-12-26
 * @Email:  871593867@qq.com
 * @Last modified by:   jifeng.lv
 * @Last modified time: 2017-04-05
 */



const Model = require('../../../model/SchemaModel.js');
const cardModel = Model.cardModel;
const terminalToken = Model.terminalTokenModel;
const cardSave = require('../../../lib/CardAcquire.js');
const Promise = require('bluebird');
const logger = require('../../../log.js');


function completion(cardnum) {
    for (let i = 0; i < (10 - cardnum.toString().length); i = 0) {
        cardnum = "0" + cardnum;
    }
    return cardnum;
}

function searchplatformid(token_val) {
    return new Promise((resolve, reject) => {
        terminalToken.findOne({
            terminal_token: token_val
        }, (err, doc) => {
            if (err) {
                logger.errlog.error(`${JSON.stringify(err)}`);
            } else {
                resolve(doc.platformid);
            }
        });
    });
}

var acquiresingle = function(req, res, next) {

    //正则匹配规则
    var pattern = /\d{6}/;

    var data = req.query;
    logger.infoLog.info(`/SyncHardWareDataByOneImei:${JSON.stringify(data)}`);
    var token = data.token;
    var equipno = data.session_Id;
    equipno = equipno.substr(0, 5);
    var schoolid = data.schoolid;
    var sixnum = pattern.exec(schoolid);
    schoolid = schoolid.replace(pattern, sixnum[0] + '-S000');

    var cardnum = data.rfid;
    cardnum = cardnum.replace(/^0{0,10}/, '');
    var timestamp = Date.parse(new Date()) / 1000;

    var classList = [];
    var babyList = [];
    var babyParentList = [];
    var userList = [];
    var imeiList = [];
    var classTeacherList = [];


    searchplatformid(token)
        .then((values) => {
            cardSave(schoolid, values);
        })
        .then(() => {
            cardModel.findOne({
                schoolid: schoolid,
                cardnumber: cardnum
            }, (err, doc) => {
                if (err) {
                    logger.errlog.error(`${JSON.stringify(err)}`);
                } else {
                    if (doc) {
                        classList.push({
                            "classId": parseInt(doc.classid.substr(18, 2) + doc.classid.substr(23)),
                            "className": doc.classname,
                            "classNick": doc.classname,
                            "isDel": 0
                        });
                        babyList.push({
                            "babyId": doc.id,
                            "classId": parseInt(doc.classid.substr(18, 2) + doc.classid.substr(23)),
                            "babyName": doc.username,
                            "babyRead": "",
                            "babyHeadUrl": "http: //bpic.588ku.com/element_origin_min_pic/16/12/25/d44b09ac579add178eedbc7c0b99b3dd.jpg",
                            "isDel": 0,
                            "isFullAttend": 0
                        });
                        babyParentList.push({
                            "babyId": doc.id,
                            "parentUid": doc.id,
                            "parentIndex": 1,
                            "parentNick": doc.cardholder
                        });
                        userList.push({
                            "uid": doc.id,
                            "userName": doc.username,
                            "headUrl": "http://bpic.588ku.com/element_origin_min_pic/16/08/18/1857b593d08d9d5.jpg",
                            "role": 1,
                            "isLogin": 1
                        });
                        if (doc.usertype === "教师") {
                            imeiList.push({
                                "uid": doc.id,
                                "babyId": 0,
                                "imei": completion(doc.cardnumber),
                                "role": 2
                            });
                        } else {
                            imeiList.push({
                                "uid": 0,
                                "babyId": doc.id,
                                "imei": completion(doc.cardnumber),
                                "role": 1
                            });
                        }
                        res.json({
                            "TimeStmp": timestamp,
                            "StateCode": 0,
                            "StateMsg": `${completion(doc.cardnumber)},卡数据获取成功！`,
                            "Data": {
                                "classList": classList,
                                "babyList": babyList,
                                "babyParentList": babyParentList,
                                "userList": userList,
                                "imeiList": imeiList,
                                "hardwareList": [],
                                "classTeacherList": []
                            }
                        });
                    } else {
                        res.json({
                            "TimeStmp": timestamp,
                            "StateCode": 0,
                            "StateMsg": "无该卡数据",
                            "Data": {
                                "classList": [],
                                "babyList": [],
                                "babyParentList": [],
                                "userList": [],
                                "imeiList": [],
                                "hardwareList": [],
                                "classTeacherList": []
                            }
                        });
                    }
                }
            });
        });
};
exports.acquiresingle = acquiresingle;
