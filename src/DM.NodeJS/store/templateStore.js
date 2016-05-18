var sql = require('./sql');
var appStore = require('./appStore');
var pageUtil = require('../libs/utils/pageUtil');

var templateStore = {
    TABLENAME: "[dbo].[dm_Templates]",
    SQL_GET: "select * from [dbo].[dm_Templates] where Id=@Id",
    SQL_GET_INDEX: "select * from [dbo].[dm_Templates] where AppId=@AppId and Type='IndexTemplate' and IsDefault='True'",

    /* *
    * 获取templateInfo
    * @param appId         应用Id
    * @param templateId    模板Id
    * @param callback      回调函数
    * */
    getInfo: function (appId, templateId, callback) {
        var _scope = this;
        appStore.getInfo(appId, function (err, appInfo) {
            if (err) {
                callback && callback(err);
            }
            if (!templateId) {
                var error = new Error("templateId is null!");
                callback && callback(err);
            }
            else {
                var params = [];
                params.push(sql.param("Id", templateId));
                params.push(sql.param("AppId", appId));
                sql.query(_scope.SQL_GET, params, function (err, recordSet) {
                    if (err) {
                        callback && callback(err);
                    } else {
                        if (recordSet) {
                            var templateInfo = recordSet[0][0];
                            if (recordSet) {
                                templateInfo.path = pageUtil.getTemplatePath(appInfo, templateInfo);
                            }
                            callback && callback(null, appInfo, templateInfo);
                        }
                    }
                });
            }
        });
    },

    /* *
    * 获取templateInfo
    * @param appId         应用Id
    * @param callback      回调函数
    * */
    getIndexTemplateInfo: function (appId, callback) {
        var _scope = this;
        appStore.getInfo(appId, function (err, appInfo) {
            if (err) {
                callback && callback(err);
            }
            if (!appId) {
                var error = new Error("appId is null!");
                callback && callback(err);
            }
            else {
                var params = [];
                params.push(sql.param("AppId", appId));
                sql.query(_scope.SQL_GET_INDEX, params, function (err, recordSet) {
                    if (err) {
                        callback && callback(err);
                    } else {
                        if (recordSet) {
                            var templateInfo = recordSet[0][0];
                            if (recordSet) {
                                templateInfo.path = pageUtil.getTemplatePath(appInfo, templateInfo);
                            }
                            callback && callback(null, appInfo, templateInfo);
                        }
                    }
                });
            }
        });
    }
};

module.exports = templateStore;