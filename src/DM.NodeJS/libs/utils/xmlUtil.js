var xml2js = require('xml2js');
var parser = new xml2js.Parser();

var XML_START = '<?xml version="1.0" encoding="utf-8" ?>';

var xmlUtil = {
    
    /**
     * 解析字符串为对象
     * @param str 待解析字符串
     * @param callback 回调函数
     */
    parserStrToObj: function (str, callback) {
        if (str.indexOf(XML_START) < 0) {
            str = XML_START + str;
        }
        parser.parseString(str, function (err, result) {
            if (err) {
                callback && callback(err);
            }
            else {
                callback && callback(null, result);
            }
        });
    }
};

module.exports = xmlUtil;