var asyncUtil = require('../../utils/asyncUtil');
var xmlUtil = require('../../utils/xmlUtil');
var parserUtil = {};

parserUtil.REGEX_T_ELEMENT = /<t:(\w+?)[^>]*>(<\/t:\1>)|<t:(\w+?)\s+[^>]*>[^\123]*<\/t:\3>|<t:(\w+?)[^>]*\/>/gim;

/* *
 * 获取模板标签列表
 * @fileContent     内容
 * */
parserUtil.GetElementListSync = function (fileContent) {
    var elementList = [];
    if (!fileContent) {
        return elementList;
    }
    else {
        //通过正则表达式，获取标签

        var m = fileContent.match(parserUtil.REGEX_T_ELEMENT);
        if (m) {
            m.forEach(function (el) {
                xmlUtil.parseStrToObj(el, function (err, node) {
                    for (var pro in node) {
                        elementList.push({ key: pro, value: el });
                        break;
                    }
                });
            }, this);
        }
        return elementList;
    }
};


/* *
 * 获取模板标签列表(异步)
 * @fileContent     内容
 * */
parserUtil.GetElementList = function (fileContent, callback) {
    asyncUtil.async(parserUtil.GetElementListSync, callback, fileContent);
};

module.exports = parserUtil;