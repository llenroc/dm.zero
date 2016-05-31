var path = require('path');
var sync = require('simplesync');

var xmlUtil = require('../../utils/xmlUtil');
var appStore = require('../../../store/appStore');
var channelStore = require('../../../store/channelStore');
var tDynamic = require('./tDynamic');
var parserManager = require('../parser/parserManager');


var channel = {
    /**
     * t:channel 的属性
     */
    attrs: {
        type: { key: 'type' },
        channelname: { key: 'channelname' },
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

            if (channelname = _scope.attrs.channelname.value) {
                _scope.attrs.channelname.value = null;
                var result = sync.wait(channelStore.getInfoByName(channelname, sync.cb('err', 'channelInfo')));
                if (result.err) callback && callback(result.err);
                else {
                    _scope.parseImpl(nodeInfo, appInfo, result.channelInfo, contentInfo, fileInfo, callback);
                    return;
                }
            }

            if (!channelInfo) {
                callback && callback(null, '<!--channel is not here-->');
                return;
            }

            if (!appInfo || appInfo.Id != channelInfo.AppId) {

                result = sync.wait(appStore.getInfo(channelInfo.AppId, sync.cb('err', 'appInfo')));
                if (result.err) callback && callback(result.err);
                else {
                    _scope.parseImpl(nodeInfo, result.appInfo, channelInfo, contentInfo, fileInfo, callback);
                    return;
                }
            }

            if (nodeInfo.innserXml) {
                //解析内部xml
                parserManager.parseContent(nodeInfo.innserXml, appInfo, channelInfo, contentInfo, fileInfo, callback);
                return;
            }
            else {
                if (_scope.attrs.type.value === _scope.type_url) {
                    parsedContent = pageUtil.getChannelFilePath(appInfo, channelInfo, fileInfo);// path.join(this.attrs.hostName.value ? this.attrs.hostName.value : "", appInfo.AppUrl);
                }
                else {
                    parsedContent = channelInfo[_scope.attrs.type.value];
                }
                callback && callback(null, parsedContent || '');
                return;
            }
        });
    }
};

module.exports = channel;