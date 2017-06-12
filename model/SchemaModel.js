/**
 * @Author: jifeng.lv
 * @Date:   2016-11-29
 * @Email:  871593867@qq.com
 * @Last modified by:   Artisan
 * @Last modified time: 2017-05-08
 */


const mongoose = require('../lib/Mongoose.js');
const Schema = mongoose.Schema;

//新建机具的数据库模型骨架
var terminalSchema = new Schema({
  terminalid: Number,
  platformid: String,
  schoolid: String,
  schoolname: String,
  module: String,
  iotype: String,
  submodule: String,
  terminalnumber: String,
  sn: String,
  time: String
});

//暴露由Schame发布生成的模型
module.exports.terminalModel = mongoose.model('terminal', terminalSchema, 'terminal');

//接口认证的token Schema及model
var tokenSchema = new Schema({
  oauth_token: String,
  expires_in: {
    type: Date,
    expires: 60 * 10,
    default: Date.now
  }
});
module.exports.tokenModel = mongoose.model("oauth_token", tokenSchema, "oauth_token");

//机具认证的token
var terminalToken = new Schema({
  terminal_token: String,
  equipno: String,
  account: {
    type: String,
    default: null
  },
  currenttime: {
    type: Date,
    expires: 60 * 60 * 96
  },
  schoolid: String,
  schoolname: String,
  platformid: String
});
module.exports.terminalTokenModel = mongoose.model("terminal_token", terminalToken, "terminal_token");

//卡信息存储的Schem和model
var cardSchema = new Schema({
  id: Number,
  cardid: Number,
  cardnumber: String,
  schoolid: String,
  schoolname: String,
  classid: String,
  classname: String,
  usestatus: String,
  usertype: String,
  userid: String,
  username: String,
  cardholder: String,
  updated: String,
  createtime: {
    type: Date,
    expires: 60 * 60 * 12
  }
});
module.exports.cardModel = mongoose.model("cards", cardSchema, "cards");

var reportSchema = new Schema({
  cardnumber: String,
  schoolid: String,
  schoolname: String,
  userid: String,
  username: String,
  cardholder: String,
  msg: Object,
  creattime: {
    type: Date,
    expires: 60 * 60 * 72
  }
});
module.exports.reportModel = mongoose.model("cok_detail", reportSchema, "cok_detail");

var errcardSchema = new Schema({
  schoolid: String,
  schoolname: String,
  errorInfo: String,
  createtime: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 120
  }
});
module.exports.errcard = mongoose.model("error_cards", errcardSchema, "error_cards");

var classidSchema = new Schema({
  classid: String,
  num: String
});
module.exports.classid = mongoose.model("classid", classidSchema, "classid");

var idsSchema = new Schema({
  name: {
    type: String,
    default: 'user'
  },
  schoolid: String,
  id: {
    type: Number
  }
});
module.exports.ids = mongoose.model("ids", idsSchema, "ids");
