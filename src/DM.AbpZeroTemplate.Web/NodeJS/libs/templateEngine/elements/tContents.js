var path = require('path');
var async = require('async');
var sync = require('simplesync');

var xmlUtil = require('../../utils/xmlUtil');
var appStore = require('../../../store/appStore');
var channelStore = require('../../../store/channelStore');
var contentStore = require('../../../store/contentStore');
var tDynamic = require('./tDynamic');
var parserManager = require('../parser/parserManager');


var contents = {
    /**
     * t:contents 的属性
     */
    attrs: {
        channelname: { key: 'channelname' },
        scope: { key: 'scope' },
        groupChannel: { key: 'groupChannel' },
        groupChannelNot: { key: 'groupChannelNot' },

        istop: { key: 'istop' },
        isrecommend: { key: 'isrecommend' },
        ishot: { key: 'ishot' },
        iscolor: { key: 'iscolor' },

        totalnum: { key: 'totalnum' },
        startnum: { key: 'startnum' },
        order: { key: 'order' },

        wordnum: { key: 'wordnum' },
        isimage: { key: 'isimage' },
        isvideo: { key: 'isvideo' },
        isfile: { key: 'isfile' },

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

            result = sync.wait(
                contentStore.getInfoForElement(
                appInfo,
                channelInfo,
                _scope.attrs.scope.value,
                _scope.attrs.groupChannel.value,
                _scope.attrs.groupChannelNot.value,
                !!_scope.attrs.isimage.value,
                _scope.attrs.isimage.value,
                !!_scope.attrs.isvideo.value,
                _scope.attrs.isvideo.value,
                !!_scope.attrs.isfile.value,
                _scope.attrs.isfile.value,
                !!_scope.attrs.istop.value,
                _scope.attrs.istop.value,
                !!_scope.attrs.isrecommend.value,
                _scope.attrs.isrecommend.value,
                !!_scope.attrs.ishot.value,
                _scope.attrs.ishot.value,
                !!_scope.attrs.iscolor.value,
                _scope.attrs.iscolor.value,
                _scope.attrs.totalnum.value,
                _scope.attrs.startnum.value,
                _scope.attrs.order.value,
                _scope.attrs.where.value,
                sync.cb('err', 'contentInfos')));

            if (!result.err) {

                async.mapSeries(result.contentInfos, function (contentInfo, ck) {
                    if (nodeInfo.innserXml) {
                        //解析内部xml
                        parserManager.parseContent(nodeInfo.innserXml, appInfo, channelInfo, contentInfo, fileInfo, ck);
                    }
                }, function (err, results) {
                    if (err) callback && callback(err);
                    else {

                        results.forEach(function(result) {
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

module.exports = contents;