/**
 * @Author: jifeng.lv
 * @Date:   2016-12-22
 * @Email:  871593867@qq.com
* @Last modified by:   jifeng.lv
* @Last modified time: 25-02-2017
 */


const Model = require('../../../model/SchemaModel.js');
const terminalToken = Model.terminalTokenModel;
const moment = require('moment');
const logger = require('../../../log.js');

var heart = function(req, res, next) {
    var data = req.query;
    logger.infoLog.info(`/HardWareHeartBeat:${JSON.stringify(data)}`);
    var token = data.token;
    var equipno = data.equipno;
    var time = moment().format('YYYY-MM-DD HH:mm');
    terminalToken.findOneAndUpdate({
        terminalnumber: equipno
    }, {
        currenttime: time
    }, (err, doc) => {
        if (err) {
            logger.errlog.error(`/HardWareHeartBeat:${JSON.stringify(err)}`);
        } else {
            if (doc && token === doc.terminal_token) {
                res.json({
                    "StateCode": 0,
                    "StateMsg": null,
                    "Data": {}
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
}

exports.heart = heart;
