/**
 * @Author: jifeng.lv
 * @Date:   2016-12-27
 * @Email:  871593867@qq.com
* @Last modified by:   jifeng.lv
* @Last modified time: 2016-12-27
 */



const crypto = require('crypto');

var md5 = function(meta) {
    const hash = crypto.createHash('md5');
    hash.update(meta);
    return hash.digest('hex')
}

exports.md5 = md5;
