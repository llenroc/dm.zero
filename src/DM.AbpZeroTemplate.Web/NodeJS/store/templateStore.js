var domain = require('domain');

var sql = require('./sql');
var appStore = require('./appStore');
var channelStore = require('./channelStore');
var contentStore = require('./contentStore');
var pageUtil = require('../libs/utils/pageUtil');
var sync = require('simplesync');

var dm = domain.create();

var templateStore = {
    TABLENAME: "[dbo].[dm_Templates]",
    SQL_GET: "select * from [dbo].[dm_Templates] where Id=@Id",
    SQL_GET_INDEX: "select * from [dbo].[dm_Templates] where AppId=@AppId and Type='IndexTemplate' and IsDefault=1",
    SQL_GET_COLLECTION_BY_APP_ID: "select * from [dbo].[dm_Templates] where AppId=@AppId",

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
                    templateStore.getTemplateInfoOrDefault(appId, channelId, pageUtil.template.channelTemplateType, function (err, templateInfo) {
                        callback && callback(null, appInfo, channelInfo, templateInfo);
                    })
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
                    templateStore.getTemplateInfoOrDefault(appId, channelId, pageUtil.template.contentTemplateType, function (err, templateInfo) {
                        callback && callback(null, appInfo, channelInfo, templateInfo);
                    })
                });
            });
        });
    },

    /* *
    * 获取templateInfo
    * @param appId         应用Id
    * @param channelId     栏目Id
    * @param templateType 栏目类型
    * */
    getTemplateInfoOrDefault: function (appId, channelId, templateType, callback) {
        var templateId = 0;
        var _scope = this;

        sync.block(function () {
            if (templateType.toLowerCase() === pageUtil.template.indexTemplateType) {
                var result = sync.wait(_scope.getDefaultTemplateID(appId, templateType, sync.cb('err', 'templateId')));
                if (result.templateId)
                    templateId = result.templateId;
            }
            else if (templateType.toLowerCase() === pageUtil.template.channelTemplateType) {
                var result = sync.wait(channelStore.getInfo(channelId, sync.cb('err', 'channelInfo')));
                if (result.channelInfo) {
                    if (result.channelInfo.IsIndex) {
                        templateId = _scope.getDefaultTemplateID(appId, pageUtil.template.indexTemplateType);
                    }
                    else {
                        templateId = result.channelInfo.ChannelTemplateId;
                    }
                }
            }
            else if (templateType.toLowerCase() === pageUtil.template.contentTemplateType) {
                var result = sync.wait(channelStore.getInfo(channelId, sync.cb('err', 'channelInfo')));
                if (result.channelInfo) {
                    templateId = result.channelInfo.ContentTemplateId;
                }
            }

            var templateInfo = null;
            if (templateId && templateId != 0) {
                var result = sync.wait(_scope.getInfo(templateId, sync.cb('err', 'templateInfo')));
                if (result.templateInfo) {
                    templateInfo = result.templateInfo;
                }
            }
            if (templateInfo == null) {
                var result = sync.wait(_scope.getDefaultTemplate(appId, templateType, sync.cb('err', 'templateInfo')));
                if (result.templateInfo) {
                    templateInfo = result.templateInfo;
                }
            }
            callback && callback(null, templateInfo);
        });
    },

    /**
     * 获取应用的模板集合
     * @param appId 应用ID
     * @param callback 回掉函数
     */
    getTemplateInfoListByAppId: function (appId, callback) {
        var templates = [];
        var _scope = this;
        sync.block(function () {
            var params = [];
            params.push(sql.param('AppId', appId));
            var result = sync.wait(sql.query(_scope.SQL_GET_COLLECTION_BY_APP_ID, params, sync.cb('err', 'recordSet')));
            if (result.recordSet) {
                templates = result.recordSet[0];
                // if (templates) {
                //     templates = templates.toTable().rows;
                // }
                callback && callback(null, templates);
            }
        });
    },

    /**
     * 获取应用的默认模板ID
     * @param appId 应用ID
     * @param templateType 模板类型
     * @param callback 回掉函数
     */
    getDefaultTemplateID: function (appId, templateType, callback) {
        var _scope = this;
        var id = 0;
        sync.block(function () {
            var result = sync.wait(_scope.getTemplateInfoListByAppId(appId, sync.cb('err', 'templates')));
            if (result.templates) {
                for (var template in result.templates) {
                    if (result.templates[template].Type.toLowerCase() === templateType && result.templates[template].IsDefault) {
                        id = result.templates[template].Id;
                        break;
                    }
                }
                callback && callback(null, id);
            }
        });
    },

    /**
     * 获取应用的默认模板
     * @param appId 应用ID
     * @param templateType 模板类型
     * @param callback 回掉函数
     */
    getDefaultTemplate: function (appId, templateType, callback) {
        var _scope = this;
        var templateInfo = null;
        sync.block(function () {
            var result = sync.wait(_scope.getTemplateInfoListByAppId(appId, sync.cb('err', 'templates')));
            if (result.templates) {
                for (var template in result.templates) {
                    if (result.templates[template].Type.toLowerCase() === templateType && result.templates[template].IsDefault) {
                        templateInfo = result.templates[template];
                        break;
                    }
                }

                callback && callback(null, templateInfo);
            }
        });
    }
};

module.exports = templateStore;