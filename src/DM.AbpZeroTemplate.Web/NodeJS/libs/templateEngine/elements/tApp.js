var path = require('path');
var sync = require('simplesync');

var xmlUtil = require('../../utils/xmlUtil');
var appStore = require('../../../store/appStore');
var tDynamic = require('./tDynamic');
var parserManager = require('../parser/parserManager');


var app = {
    /**
     * t:app 的属性
     */
    attrs: {
        type: { key: 'type' },
        appname: { key: 'appname' },
        appdir: { key: 'appdir' },
        hostname: { key: 'hostname' },
        isdynamic: { key: 'isdynamic' }
    },

    type_url: 'url',

    /* *
    * 解析
    * @elementContent      标签
    * @nodeInfo      xml对象
    * @appInfo       应用
    * @channelInfo   栏目
    * @contentInfo   内容
    * */
    parse: function (elementContent, nodeInfo, appInfo, channelInfo, contentInfo, fileInfo, callback) {

        /**
         * 1. xml解析，获取用户输入的参数
         * 2. 通过参数计算获取结果
         */
        var parsedContent = '';

        for (var attr in nodeInfo.$) {
            this.attrs[attr.toLowerCase()].value = nodeInfo.$[attr];
        }

        nodeInfo.innserXml = xmlUtil.parseObjToStr(nodeInfo);

        if (this.attrs.isdynamic.value) {
            parsedContent = tDynamic.parse(elementContent, nodeInfo, appInfo, channelInfo, contentInfo, fileInfo);
        }
        else {
            this.parseImpl(nodeInfo, appInfo, channelInfo, contentInfo, fileInfo, callback);
        }
    },

    parseImpl: function (nodeInfo, appInfo, channelInfo, contentInfo, fileInfo, callback) {

        var parsedContent = '';
        var _scope = this;

        sync.block(function () {

            if (appDir = _scope.attrs.appdir.value) {
                _scope.attrs.appdir.value = null;
                var result = sync.wait(appStore.getInfoByDir(appDir, sync.cb('err', 'appInfo')));
                if (result.err) callback && callback(result.err);
                else {
                    _scope.parseImpl(nodeInfo, result.appInfo, channelInfo, contentInfo, fileInfo, callback);
                    return;
                }
            }

            if (appName = _scope.attrs.appname.value) {
                _scope.attrs.appname.value = null;
                var result = sync.wait(appStore.getInfoByName(appName, sync.cb('err', 'appInfo')));
                if (result.err) callback && callback(result.err);
                else {
                    _scope.parseImpl(nodeInfo, result.appInfo, channelInfo, contentInfo, fileInfo, callback);
                    return;
                }
            }

            if (!appInfo) {
                callback && callback(null, '<!--appInfo is not here-->');
                return;
            }

            if (nodeInfo.innserXml) {
                //解析内部xml
                parserManager.parseContent(nodeInfo.innserXml, appInfo, channelInfo, contentInfo, fileInfo, callback);
                return;
            }
            else {
                if (_scope.attrs.type.value === _scope.type_url) {
                    parsedContent = path.join(_scope.attrs.hostname.value ? _scope.attrs.hostname.value : "", appInfo.AppUrl);
                }
                else {
                    parsedContent = appInfo[_scope.attrs.type.value];
                }
                callback && callback(null, parsedContent || '');
                return;
            }
        });
    }


};

module.exports = app;