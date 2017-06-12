/**
 * @Author: jifeng.lv
 * @Date:   2016-12-26
 * @Email:  871593867@qq.com
 * @Last modified by:   Artisan
 * @Last modified time: 2017-05-08
 */



var message = function(req, res, next) {
    var data = req.query;
    res.json({
        "StateCode": 0,
        "StateMsg": null,
        "Data": {
            "noticelist": [{
                "content": "",
                "title": "通知",
                "subtitle": "",
                "starttime": 1466697600,
                "endtime": 1466783999,
                "id": 102854
            }],
            "voicepiclist": [],
            "noticechangetime": 1,
            "voicechangetime": 10
        }
    });
};
exports.message = message;
