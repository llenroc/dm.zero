var domain = require('domain');
var path = require('path');
var async = require('async');

var asyncUtil = require('../../utils/asyncUtil');
var parserUtil = require('./parserUtil');
var fsUtil = require('../../utils/fsUtil');
var pageUtil = require('../../utils/pageUtil');
var config = require('../../../conf/config');
var xmlUtil = require('../../utils/xmlUtil');

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

    dm.on('error', function (err) {
        //错误处理
        console.log(err);
    });

    dm.run(function () {
        fsUtil.readFile(templatePath, function (err, data) {
            parserManager.parseContent(data, appInfo, channelInfo, contentInfo, fileInfo, function (err, result) {
                fsUtil.writeFile(filePath, result);
            });
        });
    });

};

/* *
 * 异步生成
 * @callback      回调函数
 * */
parserManager.parse = function (templatePath, filePath, appInfo, channelInfo, contentInfo, fileInfo, callback) {
    asyncUtil.async(parserManager.parseSync, callback, templatePath, filePath, appInfo, channelInfo, contentInfo, fileInfo);
};


/* *
 * 同步解析
 * @content             待解析内容
 * @appInfo             应用
 * @channelInfo         栏目
 * @contentInfo         内容
 * */
parserManager.parseContent = function (content, appInfo, channelInfo, contentInfo, fileInfo, callback) {

    try {
        var elementList = parserUtil.GetElementListSync(content);

        async.mapSeries(elementList, function (element, ck) {
            var startIndex = content.indexOf(element.value);
            if (startIndex !== -1) {
                xmlUtil.parseStrToObj(element.value, function (err, nodeInfo) {
                    //遍历标签，替换
                    var parser = require(path.normalize(['../elements/', element.key.replace(':', '')].join('')));

                    if (parser) {
                        parser.parse(element.value, nodeInfo[element.key], appInfo, channelInfo, contentInfo, fileInfo, function (err, parsedContent) {
                            if (err) ck(err);
                            else ck(null, { oldStr: element.value, newStr: parsedContent });
                        });
                    }

                });
            }
        }, function (err, results) {
            if (err) callback(err);
            else {
                results.forEach(function (result) {
                    content = content.replace(result.oldStr, result.newStr);
                }, this);
                callback(null, content);
            }
        });


        // elementList.forEach(function (element) {
        //     var startIndex = content.indexOf(element.value);
        //     if (startIndex !== -1) {
        //         xmlUtil.parseStrToObj(element.value, function (err, nodeInfo) {
        //             //遍历标签，替换
        //             var parser = require(path.normalize(['../elements/', element.key.replace(':', '')].join('')));
        //             var replaceStr = element.value;
        //             if (parser) {
        //                 replaceStr = parser.parse(element.value, nodeInfo[element.key], appInfo, channelInfo, contentInfo, fileInfo);
        //             }
        //             content = content.replace(element.value, replaceStr);
        //         });
        //     }
        // }, this);

    }
    catch (ex) {
        console.log(JSON.stringify(ex));
    }

};

// /* *
//  * 异步解析
//  * @callback      回调函数
//  * */
// parserManager.parseContent = function (content, appInfo, channelInfo, contentInfo, fileInfo, callback) {
//     asyncUtil.async(parserManager.parseContentSync, callback, content, appInfo, channelInfo, contentInfo, fileInfo);
// };


module.exports = parserManager;