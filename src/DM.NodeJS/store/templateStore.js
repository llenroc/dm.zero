var domain = require('domain');

var sql = require('./sql');
var appStore = require('./appStore');
var channelStore = require('./channelStore');
var contentStore = require('./contentStore');
var pageUtil = require('../libs/utils/pageUtil');

var dm = domain.create();

var templateStore = {
    TABLENAME: "[dbo].[dm_Templates]",
    SQL_GET: "select * from [dbo].[dm_Templates] where Id=@Id",
    SQL_GET_INDEX: "select * from [dbo].[dm_Templates] where AppId=@AppId and Type='IndexTemplate' and IsDefault=1",

    /* *
    * 获取templateInfo
    * @param templateId    模板Id
    * @param callback      回调函数
    * */
    getInfo: function (templateId, callback) {
        var _scope = this;

        dm.on('error', function (err) {
            callback && callback(err);
        });

        dm.run(function () {
            if (!templateId) {
                var err = new Error("templateId is null");
                throw err;
            }

            var params = [];
            params.push(sql.param("Id", templateId));
            sql.query(_scope.SQL_GET, params, function (err, recordSet) {

                if (recordSet) {
                    var templateInfo = recordSet[0][0];
                    callback && callback(null, templateInfo);
                }

            })
        });

    },

    /* *
    * 获取templateInfo
    * @param appId         应用Id
    * @param templateId    模板Id
    * @param callback      回调函数
    * */
    // getInfo: function (appId, templateId, callback) {
    //     var _scope = this;
    //     appStore.getInfo(appId, function (err, appInfo) {
    //         if (err) {
    //             callback && callback(err);
    //         }
    //         if (!templateId) {
    //             var error = new Error("templateId is null!");
    //             callback && callback(err);
    //         }
    //         else {
    //             var params = [];
    //             params.push(sql.param("Id", templateId));
    //             params.push(sql.param("AppId", appId));
    //             sql.query(_scope.SQL_GET, params, function (err, recordSet) {
    //                 if (err) {
    //                     callback && callback(err);
    //                 } else {
    //                     if (recordSet) {
    //                         var templateInfo = recordSet[0][0];
    //                         if (recordSet) {
    //                             templateInfo.path = pageUtil.getTemplatePath(appInfo, templateInfo);
    //                         }
    //                         callback && callback(null, appInfo, templateInfo);
    //                     }
    //                 }
    //             });
    //         }
    //     });
    // },

    /* *
    * 获取templateInfo
    * @param appId         应用Id
    * @param callback      回调函数
    * */
    getIndexTemplateInfo: function (appId, callback) {
        var _scope = this;

        dm.on('error', function (err) {
            callback && callback(err);
        });

        dm.run(function () {
            if (!appId) {
                var err = new Error("appId is null");
                throw err;
            }

            appStore.getInfo(appId, function (err, appInfo) {
                var params = [];
                params.push(sql.param("AppId", appId));
                sql.query(_scope.SQL_GET_INDEX, params, function (err, recordSet) {
                    if (recordSet) {
                        var templateInfo = recordSet[0][0];
                        callback && callback(null, appInfo, templateInfo);
                    }
                });
            });
        });

    },

    /* *
    * 获取templateInfo
    * @param appId         应用Id
    * @param channelId     栏目Id
    * @param callback      回调函数
    * */
    getChannelTemplateInfo: function (appId, channelId, callback) {
        var _scope = this;

        dm.on('error', function (err) {
            callback && callback(err);
        });

        dm.run(function () {
            if (!appId) {
                var err = new Error("appId is null");
                throw err;
            }

            if (!channelId) {
                var err = new Error("channelId is null");
                throw err;
            }


            appStore.getInfo(appId, function (err, appInfo) {
                channelStore.getInfo(channelId, function (err, channelInfo) {
                    templateStore.getInfo(channelInfo.ChannelTemplateId, function (err, templateInfo) {
                        callback && callback(null, appInfo, channelInfo, templateInfo);
                    });
                });
            });
        });
    },

    /* *
    * 获取templateInfo
    * @param appId         应用Id
    * @param channelId     栏目Id
    * @param callback      回调函数
    * */
    getContentTemplateInfo: function (appId, channelId, contentId, callback) {
        var _scope = this;

        dm.on('error', function (err) {
            callback && callback(err);
        });

        dm.run(function () {
            if (!appId) {
                var err = new Error("appId is null");
                throw err;
            }

            if (!channelId) {
                var err = new Error("channelId is null");
                throw err;
            }

            if (!contentId) {
                var err = new Error("contentId is null");
                throw err;
            }


            appStore.getInfo(appId, function (err, appInfo) {
                channelStore.getInfo(channelId, function (err, channelInfo) {
                    templateStore.getInfo(channelInfo.ContentTemplateId, function (err, templateInfo) {

                        callback && callback(null, appInfo, channelInfo, templateInfo);

                    });
                });
            });
        });
    }
};

module.exports = templateStore;