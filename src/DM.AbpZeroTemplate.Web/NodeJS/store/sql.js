var sql = require('mssql');

var sync = require('simplesync');

var config = require('../conf/config.json');
var sqlConfg = config && config.mssql;

/* *
 * 执行sql
 * @param sqlStr      sql语句
 * @param params      sql参数
 * @param callback    回调函数
 * */
sql.query = function (sqlStr, params, callback) {
    if (!sqlConfg) {
        var err = new Error("There is no sql config!");
        callback && callback(err);
    }
    else if (!sqlStr) {
        var err = new Error("The Parameter sqlStr is null");
        callback && callback(err);
    }
    else {
        var connection = new sql.Connection(sqlConfg);

        sync.block(function () {
            var result = sync.wait(connection.connect(sync.cb('err')));
            if (result.err) {
                callback && callback(result.err);
            }
            else {
                var request = connection.request();
                request.multiple = true;
                if (params) {
                    params.forEach(function (param) {
                        request.input(param.name, param.value);
                    }, this);
                }

                var queryResult = sync.wait(request.query(sqlStr, sync.cb('err', 'recordSet')));
                if (queryResult.err) {
                    callback && callback(result.err);
                }
                else {
                    callback && callback(null, queryResult.recordSet);
                }
            }
        })
    }

    // var connection = new sql.Connection(sqlConfg, function (err) {
    //     if (err) {
    //         callback && callback(err);
    //     }
    //     else {
    //         var request = connection.request();
    //         request.multiple = true;
    //         if (params) {
    //             params.forEach(function (param) {
    //                 request.input(param.name, param.value);
    //             }, this);
    //         }
    //         request.query(sqlStr, function (err, recordSet) {
    //             if (err) {
    //                 callback && callback(err);
    //             }
    //             else {
    //                 callback && callback(null, recordSet);
    //             }
    //         });
    //     }
    // });
};

/* *
 * (事物)执行sql
 * @param sqlStr      sql语句
 * @param params      sql参数
 * @param callback    回调函数
 * */
sql.queryWithTrans = function (trans, sqlStr, params, callback) {
    if (!sqlConfg) {
        var error = new Error("There is no sql config!");
        callback(error);
    }
    else if (!sqlStr) {
        var error = new Error("The Parameter sqlStr is null");
        callback(error);
    }
    else if (!trans) {
        sql.query(sqlStr, params, callback);
    }
    else {
        trans.begin(function (err) {
            if (err) {
                trans.rollback();
                callback && callback(err);
            }
            else {
                var request = sql.Request(trans);
                request.multiple = true;
                if (params) {
                    params.forEach(function (param) {
                        request.input(param.name, param.value);
                    }, this);
                }
                request.query(sqlStr, function (err, recordSet) {
                    if (err) {
                        trans.rollback();
                        callback && callback(err);
                    }
                    else {
                        trans.commit(function (err, recordSet) {
                            if (err) {
                                trans.rollback();
                                callback && callback(err);
                            }
                            else {
                                callback && callback(null, recordSet);
                            }
                        });
                    }
                });
            }
        });

    }
};

sql.getSelectSqlString = function (tableName, startNum, totalNum, columns, whereStr, orderStr, callback) {

    var _scope = this;

    if (startNum <= 1) {
        return _scope.getSelectSqlStringWithoutStartNum(tableName, totalNum, columns, whereStr, orderStr, callback);
    }

    var countSqlString = "SELECT Count(*) FROM " + tableName + " " + whereStr;

    sync.block(function (params) {

        var countResult = sync.wait(sql.query(countSqlString, null, sync.cb('err', 'count')));
        if (!countResult.err) {

            var count = countResult.count;
            if (totalNum == 0) {
                totalNum = count;
            }

            if (startNum > count) return '';

            var topNum = startNum + totalNum - 1;

            if (count < topNum) {
                totalNum = count - startNum + 1;
                if (totalNum < 1) {
                    return _scope.getSelectSqlStringWithoutStartNum(tableName, totalNum, columns, whereStr, orderStr, callback);
                }
            }

            var orderByStringOpposite = sql.GetOrderByStringOpposite(orderStr);

            var sqlString = '';


            sqlString += " SELECT " + columns;
            sqlString += " FROM(SELECT TOP " + totalNum + " " + columns;
            sqlString += " FROM (SELECT TOP " + topNum + " " + columns;
            sqlString += " FROM " + tableName + " " + whereStr + " " + orderStr + ") tmp ";
            sqlString += orderByStringOpposite + ") tmp ";
            sqlString += orderStr;

            callback && callback(null, sqlString);
        }
    });

};

sql.getSelectSqlStringWithoutStartNum = function (tableName, totalNum, columns, whereStr, orderStr, callback) {

    if (!orderStr) orderStr = '';
    var sqlString = '';

    if (!!whereStr) {
        if (whereStr.trim().toUpperCase().indexOf('AND') == 0) {
            whereStr = whereStr.trim().replace('AND', '');
        }
        if (whereStr.toUpperCase().indexOf('WHERE') != 0) {
            whereStr = 'WHERE ' + whereStr;
        }
    }

    if (totalNum > 0) {
        sqlString = " SELECT TOP " + totalNum + " " + columns + " FROM " + tableName + " " + whereStr + " " + orderStr;
    }
    else {
        sqlString = " SELECT " + columns + " FROM " + tableName + " " + whereStr + " " + orderStr;
    }

    callback && callback(null, sqlString);
};

sql.GetOrderByStringOpposite = function (orderStr) {
    var retval = '';
    if (orderStr) {
        retval = orderStr.replace(" DESC", " DESC_OPPOSITE").Replace(" ASC", " DESC").Replace(" DESC_OPPOSITE", " ASC");
    }
    return retval;
};

/* *
 * 创建sql参数
 * @param name     参数名称
 * @param value    参数值
 * */
sql.param = function (name, value) {
    return {
        name: name,
        value: value
    };
};

module.exports = sql;