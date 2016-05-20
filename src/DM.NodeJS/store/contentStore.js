var sql = require('./sql');

var contentStore = {
    TABLENAME: "[dbo].[dm_Contents]",
    SQL_GET: "select * from [dbo].[dm_Contents] where Id=@Id",

    /* *
    * 获取contentInfo
    * @param contentId 内容Id
    * @param callback  回调函数
    * */
    getInfo: function (contentId, callback) {
        var _scope = this;
        if (!contentId) {
            var error = new Error("contentId is null!");
            callback && callback(error);
        }
        else {
            var params = [];
            params.push(sql.param("Id", contentId));
            sql.query(_scope.SQL_GET, params, function (err, recordSet) {
                if (err) {
                    callback && callback(err);
                } else {
                    if (recordSet) {
                        var contentInfo = recordSet[0][0];
                        callback && callback(null, contentInfo);
                    }
                }
            });
        }
    }
};

module.exports = contentStore;