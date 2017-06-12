/**
 * @Author: jifeng.lv
 * @Date:   2016-12-26
 * @Email:  871593867@qq.com
 * @Last modified by:   Artisan
 * @Last modified time: 2017-05-08
 */



const Promise = require('bluebird');
const Model = require('../../../model/SchemaModel.js');
const card = Model.cardModel;
const terminal = Model.terminalModel;
const tokenModel = Model.tokenModel;
const request = require('request');
const report = Model.reportModel;
const terminalToken = Model.terminalTokenModel;
const moment = require('moment');
const logger = require('../../../log.js');
const getToken = require('../../../lib/AcquireToken');

function seacherCard(cardNum, schoolid) {
  return new Promise((resolve, reject) => {
    card.find({
      cardnumber: cardNum,
      schoolid: schoolid
    }, (err, doc) => {
      if (err) {
        reject(err);
      } else {
        resolve(doc[0]);
      }
    });
  });
}

function searchTerminal(equipno, token) {
  return new Promise((resolve, reject) => {
    terminalToken.findOne({
      equipno: equipno,
      terminal_token: token
    }, (err, doc) => {
      if (err) {
        reject(err);
      } else {
        terminal.findOne({
          module: '宝贝卫士',
          terminalnumber: doc.account
        }, (err, ter) => {
          if (err) {
            reject(err);
          } else {
            resolve(ter);
          }
        });
      }
    });
  });
}

var reportInfo = function(req, res, next) {
  var data = req.body;
  logger.infoLog.info(`/RfCardCheckIn:${JSON.stringify(data)}`);
  var token = data.token;
  var autoid = data.autoid;
  var dtime = data.dtime;
  var photoUrl = data.photoUrl;
  var rfid = data.rfid;
  var equipno = data.equipno;
  //正则匹配规则
  var pattern = /\d{6}/;
  var schoolid = data.schoolid;
  var sixnum = pattern.exec(schoolid);
  schoolid = schoolid.replace(pattern, sixnum[0] + '-S000');

  var time = moment().format('YYYY-MM-DD HH:mm');
  var brushtime = moment.unix(dtime).format('YYYYMMDDHHmmss');
  var brushtime1 = moment.unix(dtime).format('YYYY-MM-DD HH:mm:ss');
  var Hour = parseInt(brushtime.replace(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/, "$4"));
  var inout = function() {
    if (Hour < 12) {
      return "1";
    } else {
      return "2";
    }
  };

  function main() {
    getToken()
      .then((oauthtoken) => {
        Promise.all([seacherCard(rfid, schoolid), searchTerminal(equipno, token)]).then((values) => {
          var options = {
            uri: "http://apps.mmc06.com/v2/Terminal/putCok",
            method: "post",
            headers: {
              "Content-Type": "application/json",
              "Token": oauthtoken
            },
            body: {
              "terminalnumber": values[1].terminalnumber,
              "cardnumber": rfid,
              'usertype': values[0].usertype,
              "brushtime": brushtime1,
              "inout": inout(),
              "module": values[1].module,
              "submodule": values[1].submodule,
              "memberid": values[0].userid,
              "membername": values[0].username,
              "cardholder": values[0].cardholder === null ? "家长" : values[0].cardholder,
              "Photo": photoUrl,
              "classid": values[0].classid,
              "classname": values[0].classname,
              "schoolid": values[0].schoolid,
              "schoolname": values[1].schoolname,
              "platformid": values[1].platformid
            },
            json: true
          };
          request(options, function(err, res, body) {
            if (err) {
              logger.errlog.error(`/RfCardCheckIn:request error ${JSON.stringify(err)}`);
            } else {
              var reportEntity = {
                cardnumber: rfid,
                schoolid: values[0].schoolid,
                schoolname: values[0].classname,
                userid: values[0].userid,
                username: values[0].username,
                cardholder: values[0].cardholder === null ? "家长" : values[0].cardholder,
                msg: body,
                creattime: time
              };
              report.create(reportEntity, (err, doc) => {
                if (err) {
                  logger.errlog.error(`/RfCardCheckIn: cok_detail save error ${JSON.stringify(err)}`);
                } else {
                  logger.debuglog.debug(`/RfCardCheckIn:cok_detail save successful ${JSON.stringify(doc)}`);
                }
              });
            }
          });
        }).catch((err) => {
          logger.errlog.error(err);
        });
      }).catch((err) => {
        logger.errlog.error(err);
      });
  }
  terminalToken.findOne({
    terminal_token: token
  }, (err, doc) => {
    if (err) {
      logger.errlog.error(`/RfCardCheckIn:can't find terminal token${JSON.stringify(err)}`);
    } else {
      if (!doc) {
        res.json({
          "StateCode": 1,
          "StateMsg": null,
          "Data": autoid
        });
      } else {
        main();
        res.json({
          "StateCode": 0,
          "StateMsg": null,
          "Data": autoid
        });
      }

    }
  });
};
exports.reportInfo = reportInfo;
