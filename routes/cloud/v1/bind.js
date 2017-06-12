/**
 * @Author: jifeng.lv
 * @Date:   2016-12-22
 * @Email:  871593867@qq.com
* @Last modified by:   jifeng.lv
* @Last modified time: 2017-01-10
 */



var bind = function(req, res, next) {
    var data = req.query;
    res.json({
        "StateCode": 0,
        "StateMsg": "",
        "Data": null
    });
}
exports.bind = bind;
