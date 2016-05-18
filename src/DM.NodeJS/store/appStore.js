var sql = require('./sql');

var appStore = {
    TABLENAME: "[dbo].[dm_Apps]",
    SQL_GET: "select * from [dbo].[dm_Apps] where Id=@Id",

    /* *
    * 获取appInfo
    * @param appId     应用Id
    * @param callback  回调函数
    * */
    getInfo: function (appId, callback) {
        var _scope = this;
        if (!appId) {
            var error = new Error("appId is null!");
            callback(error);
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
    }
};

module.exports = appStore;