/**
 * @Author: jifeng.lv
 * @Date:   2016-12-26
 * @Email:  871593867@qq.com
* @Last modified by:   jifeng.lv
* @Last modified time: 2017-03-08
 */



const Model = require('../../../model/SchemaModel.js');
const errcard = Model.errcard;
const terminalToken = Model.terminalTokenModel;
const logger = require('../../../log.js');

var reportErr = function(req, res, next) {

    //正则匹配规则
    var pattern = /\d{6}/;
    var data = req.body;
    logger.infoLog.info(`/AddMainHardWareErrorInfo:${JSON.stringify(data)}`);
    var errorInfo = data.errorInfo;
    var schoolid = data.schoolid;

    var sixnum = pattern.exec(schoolid);
    schoolid = schoolid.replace(pattern, sixnum[0] + '-S000');
    var token = data.token;

    terminalToken.findOne({
        terminal_token: token
    }, (err, doc) => {
        if (err) {
          logger.infoLog.info(`/AddMainHardWareErrorInfo:${JSON.stringify(err)}`);
        } else {
            if (doc) {
                var errinfo = {
                    schoolid: schoolid,
                    schoolname: doc.schoolname,
                    errorInfo: errorInfo
                };
                errcard.create(errinfo, (err, doc) => {
                    if (err) {
                        logger.infoLog.info(`/AddMainHardWareErrorInfo:${JSON.stringify(err)}`);
                    } else {
                        logger.debuglog.debug(`/AddMainHardWareErrorInfo:${JSON.stringify(doc)}`);
                    }
                });
                res.json({
                    "StateCode": 0,
                    "StateMsg": null,
                    "Data": null
                });
            } else {
                res.json({
                    "StateCode": 1,
                    "StateMsg": null,
                    "Data": null
                });
            }
        }
    });
};
exports.reportErr = reportErr;
