/**
 * @Author: jifeng.lv
 * @Date:   2016-12-22
 * @Email:  871593867@qq.com
 * @Last modified by:   Artisan
 * @Last modified time: 2017-05-08
 */



const Model = require('../../../model/SchemaModel.js');
const terminalToken = Model.terminalTokenModel;
const terminalModel = Model.terminalModel;
const logger = require('../../../log.js');

var school = function(req, res, next) {
    //正则匹配规则
    var pattern = /\d{6}/;

    var data = req.query;
    logger.infoLog.info(`/GetSchoolInfo:${JSON.stringify(data)}`);
    var token = data.token;
    var schoolid = data.schoolid;
    var sixnum = pattern.exec(schoolid);
    schoolid = schoolid.replace(pattern, sixnum[0] + '-S000');

    var timestamp1 = Date.parse(new Date()) / 1000;

    terminalToken.findOne({
        terminal_token: token
    }, (err, doc) => {
        if (err) {
            logger.errlog.error(`/GetSchoolInfo:${JSON.stringify(err)}`);
        } else {
            if (doc) {
                terminalModel.findOne({
                    schoolid: schoolid
                }, (err, doc) => {
                    if (err) {
                        logger.errlog.error(`/GetSchoolInfo:${JSON.stringify(err)}`);
                    } else {
                        if (doc) {
                            res.json({
                                "StateCode": 0,
                                "StateMsg": null,
                                "Data": {
                                    "SchoolName": doc.schoolname,
                                    "SchoolLogo": "http://www.rb06.com/wp-content/uploads/2016/12/490940270804f71140ea7c71d65747d7.png",
                                    "CityId": null,
                                    "CityName": null,
                                    "DuringTime": "60",
                                    "CityCode": null,
                                    "BaiDuApiStoreKey": null,
                                    "CurrentTime": timestamp1,
                                    "PushOverTime": "180"
                                }
                            });
                        } else {
                            res.json({
                                "StateCode": 1,
                                "StateMsg": null,
                                "Data": {}
                            });
                        }
                    }
                });
            } else {
                res.json({
                    "StateCode": 1,
                    "StateMsg": null,
                    "Data": {}
                });
            }
        }
    });
};

exports.school = school;
