var sql = require('./sql');
var appStore = require('./appStore');
var pageUtil = require('../libs/utils/pageUtil');

var templateStore = {
    TABLENAME: "[dbo].[dm_Templates]",
    SQL_GET: "select * from [dbo].[dm_Templates] where Id=@Id"
};

/* *
 * 获取templateInfo
 * @param templateId    应用Id
 * @param callback      回调函数
 * */
templateStore.getInfo = function(appId, templateId, callback){
    appStore.getInfo(appId,function(err, appInfo){
        if(!templateId){
            var error = new Error("templateId is null!");
            callback && callback(err);
        }
        else{
            var params = [];
            params.push(sql.param("Id", templateId));
            params.push(sql.param("AppId", appId));
            sql.query(this.SQL_GET, params,function (err, recordSet) {
                if(err){
                    callback && callback(err);
                }else{
                    if(recordSet){
                    recordSet.path = pageUtil.getTemplatePath(appInfo,recordSet);
                    }
                    callback && callback(null, recordSet);
                }
            });
        }
    });
};

module.exports = templateStore;