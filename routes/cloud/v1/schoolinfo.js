/**
 * @Author: jifeng.lv
 * @Date:   2016-12-22
 * @Email:  871593867@qq.com
 * @Last modified by:   Artisan
 * @Last modified time: 2017-05-08
 */



const Model = require('../../../model/SchemaModel.js');
const terminalToken = Model.terminalTokenModel;
const cardModel = Model.cardModel;
const logger = require('../../../log.js');

function completion(cardnum) {
  for (let i = 0; i < (10 - cardnum.toString().length); i = 0) {
    cardnum = "0" + cardnum;
  }
  return cardnum;
}

function remove(array) {
  var strArray = array.map((val) => {
    return JSON.stringify(val);
  });
  var set = new Set(strArray);
  var toArray = Array.from(set);
  var objArray = toArray.map((val) => {
    return JSON.parse(val);
  });
  return objArray;
}

var schoolinfo = function(req, res, next) {

  //正则匹配规则
  var pattern = /\d{6}/;

  var data = req.query;
  logger.infoLog.info(`/SyncHardWareData:${JSON.stringify(data)}`);
  var token = data.token;
  var schoolid = data.schoolid;
  var sixnum = pattern.exec(schoolid);
  schoolid = schoolid.replace(pattern, sixnum[0] + '-S000');

  var timestamp = Date.parse(new Date()) / 1000;

  var classList = [];
  var babyList = [];
  var babyParentList = [];
  var userList = [];
  var imeiList = [];

  terminalToken.findOne({
    terminal_token: token
  }, (err, doc) => {
    if (err) {
      logger.errlog.error(`/SyncHardWareData:${JSON.stringify(err)}`);
    } else {
      if (token) {
        cardModel.find({
          schoolid: schoolid
        }, (err, doc) => {
          if (err) {
            logger.errlog.error(`/SyncHardWareData:${JSON.stringify(err)}`);
          } else {
            if (doc) {
              var classlist = [];
              var babylist = [];
              var babyparentlist = [];
              var userlist = [];
              doc.forEach((info) => {
                classlist.push({
                  "classId": parseInt(info.classid.substr(18, 2) + info.classid.substr(23)) ? parseInt(info.classid.substr(18, 2) + info.classid.substr(23)) : '1',
                  "className": info.classname,
                  "classNick": info.classname,
                  "isDel": 0
                });
                babylist.push({
                  "babyId": info.id,
                  "classId": parseInt(info.classid.substr(18, 2) + info.classid.substr(23)) ? parseInt(info.classid.substr(18, 2) + info.classid.substr(23)) : '1',
                  "babyName": info.username,
                  "babyRead": "",
                  "babyHeadUrl": "http://bpic.588ku.com/element_origin_min_pic/16/12/25/d44b09ac579add178eedbc7c0b99b3dd.jpg",
                  "isDel": 0,
                  "isFullAttend": 0
                });
                babyparentlist.push({
                  "babyId": info.id,
                  "parentUid": info.id,
                  "parentIndex": 1,
                  "parentNick": info.cardholder === null ? "家长" : info.cardholder
                });
                userlist.push({
                  "uid": info.id,
                  "userName": info.username,
                  "headUrl": "http://bpic.588ku.com/element_origin_min_pic/16/08/18/1857b593d08d9d5.jpg",
                  "role": 1,
                  "isLogin": 1
                });
                if (info.usertype === "教师") {
                  imeiList.push({
                    "uid": info.id,
                    "babyId": 0,
                    "imei": completion(info.cardnumber),
                    "role": 2
                  });
                } else {
                  imeiList.push({
                    "uid": 0,
                    "babyId": info.id,
                    "imei": completion(info.cardnumber),
                    "role": 1
                  });
                }
              });
              classList = remove(classlist);
              babyList = remove(babylist);
              babyParentList = remove(babyparentlist);
              userList = remove(userlist);
              res.json({
                "TimeStmp": timestamp,
                "StateCode": 0,
                "StateMsg": null,
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
                "StateCode": 1,
                "StateMsg": null,
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
      } else {
        res.json({
          "TimeStmp": timestamp,
          "StateCode": 1,
          "StateMsg": null,
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
};

exports.schoolinfo = schoolinfo;
