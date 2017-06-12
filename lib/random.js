/**
 * @Author: jifeng.lv
 * @Date:   2017-03-24
 * @Email:  871593867@qq.com
 * @Last modified by:   jifeng.lv
 * @Last modified time: 2017-03-24
 */



var jschars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

module.exports.generateMixed = function(n) {   
    var res = "";   
    for (var i = 0; i < n; i++) {       
        var id = Math.ceil(Math.random() * 35);       
        res += jschars[id];   
    }   
    return res;
};
