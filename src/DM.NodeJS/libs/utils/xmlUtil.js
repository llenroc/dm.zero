var xml2js = require('xml2js');
var parser = new xml2js.Parser({
    explicitArray: false
});
var builder = new xml2js.Builder({
    headless: true,
    renderOpts: { 'pretty': true, 'indent': ' ', 'newline': '\r\n' }
});

var XML_START = '<?xml version="1.0" encoding="utf-8" ?>';

var xmlUtil = {

    /**
     * 解析字符串为对象
     * @param str 待解析字符串
     * @param callback 回调函数
     */
    parseStrToObj: function (str, callback) {
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
    },

    /**
    * 解析对象串为字符
    * @param obj 待解析对象
    * @returns xml 解析后的xml字符串
    */
    parseObjToStr: function (obj) {
        var xml = '';
        delete obj.$;
        for (var o in obj) {
            obj.$ = null;
            break;
        }
        if (obj) {
            xml = builder.buildObject(obj);
        }
        return xml.replace('<root>', '').replace('</root>', '').replace('<root/>', '');
    }
};

module.exports = xmlUtil;