var sql = require('./sql');

var channelStore = {
    TABLENAME: "[dbo].[dm_Channels]",
    SQL_GET: "select * from [dbo].[dm_Channels] where Id=@Id",

    /* *
    * 获取channelInfo
    * @param channelId 栏目Id
    * @param callback  回调函数
    * */
    getInfo: function (channelId, callback) {
        var _scope = this;
        if (!channelId) {
            var error = new Error("channelId is null!");
            callback && callback(error);
        }
        else {
            var params = [];
            params.push(sql.param("Id", channelId));
            sql.query(_scope.SQL_GET, params, function (err, recordSet) {
                if (err) {
                    callback && callback(err);
                } else {
                    if (recordSet) {
                        var channelInfo = recordSet[0][0];
                        callback && callback(null, channelInfo);
                    }
                }
            });
        }
    }
};

module.exports = channelStore;