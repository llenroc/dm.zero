var domain = require('domain');
var path = require('path');

var asyncUtil = require('../../utils/asyncUtil');
var parserUtil = require('./parserUtil');
var fsUtil = require('../../utils/fsUtil');
var pageUtil = require('../../utils/pageUtil');

var dm = domain.create();

var parserManager = {};

/* *
 * 同步生成
 * @templatePath        文件路径
 * @appInfo             应用
 * @channelInfo         栏目
 * @contentInfo         内容
 * */
parserManager.parseSync = function (templatePath, filePath, appInfo, channelInfo, contentInfo, fileInfo) {
    var elementList = [];

    dm.on('error', function (err) {
        //错误处理
        console.log(err);
    });

    dm.run(function () {
        fsUtil.readFile(templatePath, function (err, data) {
            elementList = parserUtil.GetElementListSync(data);
            elementList.forEach(function (element) {
                var startIndex = data.indexOf(element.value);
                if (startIndex !== -1) {

                    xmlUtil.parseStrToObj(element.value, function (err, result) {
                        //遍历标签，替换
                        var replaceStr = require(path.normalize(['../elements/', 't' + element.key].join(''))).parse(element.value, nodeInfo, appInfo, channelInfo, contentInfo, fileInfo);
                        data = data.replace(element.value, replaceStr);
                    });


                }
            }, this);

            fsUtil.writeFile(filePath, data);
        });
    });

};

/* *
 * 异步生成
 * @callback      回调函数
 * */
parserManager.parse = function (templatePath, filePath, appInfo, channelInfo, contentInfo, fileInfo, callback) {
    asyncUtil.async(parserManager.createSync, callback, templatePath, filePath, appInfo, channelInfo, contentInfo, fileInfo);
};

module.exports = parserManager;