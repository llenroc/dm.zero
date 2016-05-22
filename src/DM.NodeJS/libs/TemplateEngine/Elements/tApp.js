var appStore = require('../../../store/appStore');
var tDynamic = require('./tDynamic');


var app = {
    /**
     * t:app 的属性
     */
    attrs: {
        type: 'type',
        appName: 'appname',
        appDir: 'appdir',
        hostName: 'hostname',
        isDynamic: 'isdynamic'
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
    parse = function (elementContent, nodeInfo, appInfo, channelInfo, contentInfo, fileInfo) {
        /**
         * 1. xml解析，获取用户输入的参数
         * 2. 通过参数计算获取结果
         */
        var parsedContent = '';

        this.attrs.forEach(function (attr) {
            this[attr] = nodeInfo[attr];
        }, this);

        if (this[this.attrs.isDynamic]) {
            parsedContent = tDynamic.parse(elementContent, nodeInfo, appInfo, channelInfo, contentInfo, fileInfo);
        }
        else {
            parsedContent = parseImpl(appInfo, channelInfo, contentInfo, fileInfo);
        }

        return parsedContent;
    },

    parseImpl = function (appInfo, channelInfo, contentInfo, fileInfo) {
        var parsedContent = '';
        var appInfo = null;
        if (appName = this[this.attrs.appName]) {
            appInfo = appStore.getInfoByName(appName);
        }
        if (!appInfo && (appDir = this[this.attrs.appDir])) {
            appInfo = appStore.getInfoByDir(appName);
        }
        if (appInfo) {
            if (this[this.attrs.type] === this.type_url) {
                parsedContent = path.join(this[this.attrs.hostName], appInfo.AppUrl);
            }
            else {
                parsedContent = appInfo[this[this.attrs.type]];
            }
        }
        return parsedContent || '';
    }


};

module.exports = app;