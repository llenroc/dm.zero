var sql = require('./sql');

var appStore = {
    TABLENAME: "[dbo].[dm_Apps]",
    SQL_GET: "select * from [dbo].[dm_Apps] where Id=@Id"
};

/* *
 * 获取appInfo
 * @param appId     应用Id
 * @param callback  回调函数
 * */
appStore.getInfo = function(appId, callback){
    if(!appId){
        var error = new Error("appId is null!");
        callback(error);
    }
    else{
        var params = [];
        params.push(sql.param("Id", appId));
        sql.query(this.SQL_GET, params,function (err, recordSet) {
            if(err){
                callback && callback(err);
            }else{
                callback && callback(null, recordSet);
            }
        });
    }
};

module.exports = appStore;