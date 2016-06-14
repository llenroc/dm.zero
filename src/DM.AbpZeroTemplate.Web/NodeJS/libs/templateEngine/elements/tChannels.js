var path = require('path');
var async = require('async');
var sync = require('simplesync');

var xmlUtil = require('../../utils/xmlUtil');
var appStore = require('../../../store/appStore');
var channelStore = require('../../../store/channelStore');
var tDynamic = require('./tDynamic');
var parserManager = require('../parser/parserManager');
var eScopeType = require('../../enum/eScopeType');


var channels = {
    /**
     * t:channels 的属性
     */
    attrs: {
        channelname: { key: 'channelname' },
        scope: { key: 'scope' },
        uplevel: { key: 'uplevel' },
        toplevel: { key: 'toplevel' },
        istotal: { key: 'istotal' },
        isallchildren: { key: 'isallchildren' },

        groupChannel: { key: 'groupChannel' },
        groupChannelNot: { key: 'groupChannelNot' },

        totalnum: { key: 'totalnum' },
        startnum: { key: 'startnum' },
        order: { key: 'order' },

        wordnum: { key: 'wordnum' },

        where: { key: 'where' },
        isdynamic: { key: 'isdynamic' }
    },

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
            var result;
            //确定栏目存在
            if (!channelInfo) {
                result = sync.wait(channelStore.getInfoByName(_scope.attrs.channelname.value, sync.cb('err', 'channelInfo')));
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

            //获取数据集
            var channelScope = eScopeType.self;
            if (_scope.attrs.isallchildren.value && _scope.attrs.isallchildren.value.toLowerCase() == 'true') {
                channelScope = eScopeType.descendant;
            }
            result = sync.wait(
                channelStore.getInfoForElement(
                    appInfo,
                    channelInfo,
                    _scope.attrs.groupChannel.value,
                    _scope.attrs.groupChannelNot.value,
                    _scope.attrs.totalnum.value,
                    _scope.attrs.startnum.value,
                    _scope.attrs.order.value,
                    channelScope,
                    _scope.attrs.istotal.value,
                    _scope.attrs.where.value,
                    sync.cb('err', 'channelInfos')));

            if (!result.err) {

                async.mapSeries(result.channelInfos, function (channelInfo, ck) {
                    if (nodeInfo.innserXml) {
                        //解析内部xml
                        parserManager.parseContent(nodeInfo.innserXml, appInfo, channelInfo, contentInfo, fileInfo, ck);
                    }
                }, function (err, results) {
                    if (err) callback && callback(err);
                    else {

                        results.forEach(function (result) {
                            parsedContent += result;
                        }, this);

                        callback && callback(null, parsedContent);
                        return;
                    }
                });
            }
        });
    }


};

module.exports = channels;