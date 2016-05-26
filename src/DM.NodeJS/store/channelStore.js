var sql = require('./sql');

var sync = require('simplesync');

var channelStore = {
    TABLENAME: "[dbo].[dm_Channels]",
    SQL_GET: "select * from [dbo].[dm_Channels] where Id=@Id",
    SQL_GET_BY_NAME: "select * from [dbo].[dm_Channels] where DisplayName=@DisplayName",

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
    },

    /* *
    * 获取channelInfo
    * @param displayName   应用名称
    * @param callback  回调函数
    * */
    getInfoByName: function (displayName, callback) {
        var _scope = this;
        if (!displayName) {
            var error = new Error("displayName is null!");
            callback && callback(error);
        }
        else {
            var params = [];
            params.push(sql.param("DisplayName", displayName));

            sync.block(function () {
                var result = sync.wait(sql.query(_scope.SQL_GET_BY_NAME, params, sync.cb('err', 'recordSet')));
                if (result.err) {
                    callback && callback(result.err);
                } else {
                    if (result.recordSet) {
                        var channelInfo = result.recordSet[0][0];
                        callback && callback(null, channelInfo);
                    }
                }
            });
        }
    },

    /* *
    * 获取栏目对应的内容表
    * @param displayName   应用名称
    * @param callback  回调函数
    * */
    getTableName: function (appInfo, channelInfo, callback) {
        callback && callback(null, 'dm_Contents');
    },

    /* *
    * 获取栏目对应的内容表
    * @param displayName   应用名称
    * @param callback  回调函数
    * */
    getChannelIds: function (channelId, scope, channelGroup, channelGroupNot, callback) {
        callback && callback(null, [channelId]);
    }
};

module.exports = channelStore;