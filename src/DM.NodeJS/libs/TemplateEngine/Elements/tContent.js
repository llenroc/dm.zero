var path = require('path');
var sync = require('simplesync');

var xmlUtil = require('../../utils/xmlUtil');
var appStore = require('../../../store/appStore');
var channelStore = require('../../../store/channelStore');
var contentStore = require('../../../store/contentStore');
var tDynamic = require('./tDynamic');
var parserManager = require('../parser/parserManager');


var content = {
    /**
     * t:content 的属性
     */
    attrs: {
        type: { key: 'type' },
        hostname: { key: 'hostname' },
        isdynamic: { key: 'isdynamic' }
    },

    type_link_url: 'linkurl',
    type_img_url: 'imgurl',
    type_file_url: 'fileurl',
    type_video_url: 'videourl',

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

            if (!contentInfo) {
                callback && callback(null, '<!--contentInfo is not here-->');
                return;
            }

            if (!channelInfo || contentInfo.ChannelId != channelInfo.Id) {
                var result = sync.wait(channelStore.getInfo(contentInfo.ChannelId, sync.cb('err', 'channelInfo')));

                if (result.err) callback && callback(result.err);
                else {
                    _scope.parseImpl(nodeInfo, appInfo, result.channelInfo, contentInfo, fileInfo, callback);
                    return;
                }
            }

            if (!channelInfo) {
                callback && callback(null, '<!--channelInfo is not here-->');
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
                if (_scope.attrs.type.value === _scope.type_link_url) {
                    parsedContent = pageUtil.getContentFilePath(appInfo, channelInfo, contentInfo, fileInfo);
                }
                else if (_scope.attrs.type.value === _scope.type_img_url) {

                }
                else if (_scope.attrs.type.value === _scope.type_file_url) {

                }
                else if (_scope.attrs.type.value === _scope.type_video_url) {

                }
                else {
                    parsedContent = contentInfo[_scope.attrs.type.value];
                }
                callback && callback(null, parsedContent || '');
                return;
            }
        });
    }


};

module.exports = content;