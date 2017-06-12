/**
 * @Author: jifeng.lv
 * @Date:   2016-12-21
 * @Email:  871593867@qq.com
* @Last modified by:   jifeng.lv
* @Last modified time: 2017-03-08
 */



const Model = require('../../../model/SchemaModel.js');
const terminalModel = Model.terminalModel;
const terminalToken = Model.terminalTokenModel;
const random = require('../../../lib/random.js');
const moment = require('moment');
const cardSave = require('../../../lib/CardAcquire.js');
const ossconfig = require('../../../config.js').oss;
const md5 = require('../../../lib/md5.js').md5;
const logger = require('../../../log.js');
const updatTerminal = require('../../../lib/HoldTerminal.js');

var login = function(req, res, next) {
    var data = req.body;
    logger.debuglog.debug(`/HardWareLogin:${JSON.stringify(data)}`);
    logger.infoLog.info(`/HardWareLogin:${JSON.stringify(data)}`);
    //account为机器端输入账号
    var account = data.account;
    var token = data.token;
    var passwd = data.passwd;
    var terminalnum = data.equipno;
    account = data.account;
    var time = moment().format('YYYY-MM-DD HH:mm');
    terminalModel.findOne({
        terminalnumber: account,
        module: "宝贝卫士"
    }, (err, doc) => {
        if (err) {
            logger.errlog.error(`/HardWareLogin:${JSON.stringify(err)}`);
        } else {
            if (doc) {
                var md5_passwd = md5(doc.sn);
                if (doc && md5_passwd === passwd) {
                    //schoolid正则匹配后，删去-S000，返回给机器
                    var pattern = /-S000/ig;
                    var schoolId = doc.schoolid;
                    schoolid = schoolId.replace(pattern, '');

                    var SessionId = random.generateMixed(32);
                    res.json({
                        "StateCode": 0,
                        "StateMsg": null,
                        "Data": {
                            "CardType": 1,
                            "SchoolId": schoolid,
                            "SchoolName": doc.schoolname,
                            "SchoolLogo": "http://www.rb06.com/wp-content/uploads/2016/12/490940270804f71140ea7c71d65747d7.png",
                            "IsMainVoiceBroadcast": true,
                            "IsLuenBorad": false,
                            "LuenBoradTime": "07:00-07:00",
                            "SessionId": SessionId,
                            "IsBind": false,
                            "ClassList": [],
                            "Tunnel": "tcp://121.43.234.162:7747",
                            "OSS": {
                                "Key": "dkLRgClETNPwKAku",
                                "Secret": "WWXscyLRG2jP7YDXCgKAdBttCxPsCx",
                                "Bucket": "zqres"
                            },
                            "RankShowType": 1
                        }
                    });
                    cardSave(doc.schoolid, doc.platformid);

                    var tokeninfo = {
                        terminal_token: SessionId,
                        equipno: terminalnum,
                        account: account,
                        currenttime: time,
                        schoolid: schoolId,
                        schoolname: doc.schoolname,
                        platformid: doc.platformid
                    };
                    terminalToken.create(tokeninfo, (err, doc) => {
                        if (err) {
                            logger.errlog.error(`/HardWareLogin:${JSON.stringify(err)}`);
                        } else {
                            logger.debuglog.debug(`/HardWareLogin:${JSON.stringify(doc)}`);
                        }
                    });
                }
            } else {
                updatTerminal();
                res.json({
                    "StateCode": 1,
                    "StateMsg": null,
                    "Data": null
                });
            }
        }
    });
};

exports.login = login;
