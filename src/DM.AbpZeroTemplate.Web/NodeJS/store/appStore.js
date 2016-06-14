var sql = require('./sql');

var appStore = {
    TABLENAME: "[dbo].[dm_Apps]",
    SQL_GET: "select * from [dbo].[dm_Apps] where Id=@Id",
    SQL_GET_BY_NAME: "select * from [dbo].[dm_Apps] where AppName=@AppName",
    SQL_GET_BY_DIR: "select * from [dbo].[dm_Apps] where AppDir=@AppDir",

    /* *
    * 获取appInfo
    * @param appId     应用Id
    * @param callback  回调函数
    * */
    getInfo: function (appId, callback) {
        var _scope = this;
        if (!appId) {
            var error = new Error("appId is null!");
            callback && callback(error);
        }
        else {
            var params = [];
            params.push(sql.param("Id", appId));
            sql.query(_scope.SQL_GET, params, function (err, recordSet) {
                if (err) {
                    callback && callback(err);
                } else {
                    if (recordSet) {
                        var appInfo = recordSet[0][0];
                        callback && callback(null, appInfo);
                    }
                }
            });
        }
    },
    
    /* *
    * 获取appInfo
    * @param appName   应用名称
    * @param callback  回调函数
    * */
    getInfoByName: function (appName, callback) {
        var _scope = this;
        if (!appName) {
            var error = new Error("appName is null!");
            callback && callback(error);
        }
        else {
            var params = [];
            params.push(sql.param("AppName", appName));
            sql.query(_scope.SQL_GET_BY_NAME, params, function (err, recordSet) {
                if (err) {
                    callback && callback(err);
                } else {
                    if (recordSet) {
                        var appInfo = recordSet[0][0];
                        callback && callback(null, appInfo);
                    }
                }
            });
        }
    },
    
    /* *
    * 获取appInfo
    * @param appDir    应用文件夹
    * @param callback  回调函数
    * */
    getInfoByDir: function (appDir, callback) {
        var _scope = this;
        if (!appDir) {
            var error = new Error("appDir is null!");
            callback && callback(error);
        }
        else {
            var params = [];
            params.push(sql.param("AppDir", appDir));
            sql.query(_scope.SQL_GET_BY_DIR, params, function (err, recordSet) {
                if (err) {
                    callback && callback(err);
                } else {
                    if (recordSet) {
                        var appInfo = recordSet[0][0];
                        callback && callback(null, appInfo);
                    }
                }
            });
        }
    }
};

module.exports = appStore;