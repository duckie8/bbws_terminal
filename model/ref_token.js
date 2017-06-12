/**
 * @Author: jifeng.lv
 * @Date:   2017-03-24
 * @Email:  871593867@qq.com
 * @Last modified by:   jifeng.lv
 * @Last modified time: 2017-03-24
 */



const mongoose = require('../lib/Mongoose.js');
const Schema = mongoose.Schema;

var refreshToken = new Schema({
    refresh_token: String,
    createtime: {
        type: Date,
        default: Date.now,
        expires: 60 * 15
    }
});
module.exports = ref_token = mongoose.model('ref_token', refreshToken, 'ref_token');
