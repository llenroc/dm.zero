var sql = require('mssql');

var config = require('../conf/config.json');
var sqlConfg = config && config.mssql;

/* *
 * 执行sql
 * @param sqlStr      sql语句
 * @param params      sql参数
 * @param callback    回调函数
 * */
sql.query = function(sqlStr, params, callback){
    if(!sqlConfg){
        var err = new Error("There is no sql config!");
        callback && callback(err);
    }
    else if(!sqlStr){
        var err = new Error("The Parameter sqlStr is null");
        callback && callback(err);
    }
    else{
       var connection = new  sql.Connection(sqlConfg, function(err){
            if(err){
                callback && callback(err);
            }
            else{
                var request = connection.request();
                request.multiple = true;
                if(params){
                    params.forEach(function(param) {
                        request.input(param.name, param.value);
                    }, this);
                }
                request.query(sqlStr,function(err, recordSet){
                    if(err){
                        callback&&callback(err);
                    }
                    else{
                        callback&&callback(null, recordSet);
                    }
                });
            }
        });
    }
};

/* *
 * (事物)执行sql
 * @param sqlStr      sql语句
 * @param params      sql参数
 * @param callback    回调函数
 * */
sql.queryWithTrans = function(trans, sqlStr, params, callback){
    if(!sqlConfg){
        var error = new Error("There is no sql config!");
        callback(error);
    }
    else if(!sqlStr){
        var error = new Error("The Parameter sqlStr is null");
        callback(error);
    }
    else if(!trans){
        sql.query(sqlStr, params, callback);
    }
    else{
        trans.begin(function(err){
            if(err){
                trans.rollback();
                callback&&callback(err);
            }
            else{
                var request = sql.Request(trans);
                request.multiple = true;
                if(params){
                    params.forEach(function(param) {
                        request.input(param.name, param.value);
                    }, this);
                }
                request.query(sqlStr,function(err, recordSet){
                    if(err){
                        trans.rollback();
                        callback&&callback(err);
                    }
                    else{
                        trans.commit(function(err, recordSet){
                            if(err){
                                trans.rollback();
                                callback&&callback(err);
                            }
                            else{
                                callback&&callback(null, recordSet);
                            }
                        });
                    }
                });
            }
        });
        
    }
};

/* *
 * 创建sql参数
 * @param name     参数名称
 * @param value    参数值
 * */
sql.param = function(name, value){
    return {
        name:name,
        value:value
    };
};

module.exports = sql;