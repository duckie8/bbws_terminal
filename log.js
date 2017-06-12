/**
 * @Author: jifeng.lv
 * @Date:   22-02-2017
 * @Email:  871593867@qq.com
* @Last modified by:   jifeng.lv
* @Last modified time: 22-02-2017
 */



const log4js = require('log4js');
const log4js_config = require('./log4js.json');

// exports.configure = function() {
// }
log4js.configure(log4js_config);


var infoLog = log4js.getLogger('log_info');
exports.infoLog = infoLog;

var warnLog = log4js.getLogger('log_warn');
exports.warnLog = warnLog;

var errlog = log4js.getLogger('log_error');
exports.errlog = errlog;

var debuglog = log4js.getLogger('log_debug');
exports.debuglog = debuglog;

exports.use = function(app) {
    app.use(log4js.connectLogger(infoLog,   {
        level: 'info',
        format: ':method :url'
    }));
};
