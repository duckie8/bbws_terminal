/**
 * @Author: jifeng.lv
 * @Date:   2016-11-29
 * @Email:  871593867@qq.com
 * @Last modified by:   Artisan
 * @Last modified time: 2017-05-12
 */



const Promise = require('bluebird');
const terminal = require('./TerminalInfoUpdate.js');
const mongoose = require('./Mongoose.js');
const terminalModel = require('../model/SchemaModel.js').terminalModel;
const token = require('./AcquireToken.js');

module.exports = function() {

  var dateTime = new Date().toLocaleDateString();

  token().then(terminal).then((terminalInfo) => {
    if (terminalInfo.rs !== null) {
      var rs = terminalInfo.rs;
      rs.forEach((data) => {
        var tid = data.terminalid;
        //更新数据，若不存在则插入，否则更新
        terminalModel.update({
          terminalid: tid
        }, {
          terminalid: data.terminalid,
          platformid: data.platformid,
          schoolid: data.schoolid,
          schoolname: data.schoolname,
          module: data.module,
          iotype: data.iotype,
          submodule: data.submodule,
          terminalnumber: data.terminalnumber,
          sn: data.sn,
          time: dateTime
        }, {
          upsert: true
        }, function(err, raw) {
          if (err) {
            console.log(err);
          } else {
            console.log(raw);
          }
        });
      });
    }
  }).then(() => {
    //删除过期机具数据
    terminalModel.remove({
      "time": {
        $lt: dateTime
      }
    }, function(err) {
      if (err) {
        console.log(err);
      }
    });
  }).catch((err) => {
    console.log(err);
  });
};
