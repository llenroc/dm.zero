var sql = require('./sql');

var eScopeType = require('../libs/enum/eScopeType');
var translateUtil = require('../libs/utils/translateUtil');

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
        if (channelInfo.ModelType == 'Content') {
            callback && callback(null, 'dm_Contents');
            return;
        }
        else if (channelInfo.ModelType == 'Good') {
            callback && callback(null, 'dm_B2CContents');
            return;
        }
        else {
            callback && callback(null, 'dm_Contents');
            return;
        }
    },

    /* *
    * 获取栏目对应的内容表
    * @param displayName   应用名称
    * @param callback  回调函数
    * */
    getChannelIds: function (channelInfo, scopeType, channelGroup, channelGroupNot, modelType, callback) {

        var channelId = channelInfo.Id;
        var channelCode = channelInfo.Code;

        var arraylist = [];
        var sqlString = '';

        var _scope = this;

        sync.block(function () {

            var result = sync.wait(_scope.getGroupWhereString(channelGroup, channelGroupNot, sync.cb('err', 'sqlStr', 'sqlParams')));
            if (result.err) callback && callback(result.err);
            else {
                var sqlParams = result.sqlParams;

                if (modelType) {
                    result.sqlStr += " AND ModelType = @ModelType ";
                    sqlParams.push(sql.param('ModelType', modelType));
                }

                if (scopeType == eScopeType.all) {
                    sqlString += "SELECT Id ";
                    sqlString += "FROM dm_Channels ";
                    sqlString += "WHERE((Id = @Id) OR";
                    sqlString += "(ParentId = @ParentId) OR";
                    sqlString += "(Code = @Code) OR";
                    sqlString += "(Code LIKE @Code+'.%') OR";
                    sqlString += "(Code LIKE '%.'+@Code+'.%') OR";
                    sqlString += "(Code LIKE '%.'+@Code)) " + result.sqlStr;
                    sqlString += "ORDER BY Id";

                    sqlParams.push(sql.param('Id', channelId));
                    sqlParams.push(sql.param('ParentId', channelId));
                    sqlParams.push(sql.param('Code', channelCode));
                }
                else if (scopeType == eScopeType.self) {
                    arraylist.push(channelId);
                    callback && callback(null, arraylist);
                    return;
                }
                else if (scopeType == eScopeType.children) {
                    sqlString += "SELECT Id ";
                    sqlString += "FROM dm_Channels ";
                    sqlString += "WHERE(ParentId = @ParentId) " + result.sqlStr;
                    sqlString += "ORDER BY Id";

                    sqlParams.push(sql.param('ParentId', channelId));
                }
                else if (scopeType == eScopeType.descendant) {
                    sqlString += "SELECT Id ";
                    sqlString += "FROM dm_Channels ";
                    sqlString += "WHERE((ParentId = @ParentId) OR";
                    sqlString += "(Code = @Code) OR";
                    sqlString += "(Code LIKE @Code+'.%') OR";
                    sqlString += "(Code LIKE '%.'+@Code+'.%') OR";
                    sqlString += "(Code LIKE '%.'+@Code)) " + result.sqlStr;
                    sqlString += "ORDER BY Id";

                    sqlParams.push(sql.param('ParentId', channelId));
                    sqlParams.push(sql.param('Code', channelCode));
                }
                else if (scopeType == eScopeType.SelfAndChildren) {
                    sqlString += "SELECT Id ";
                    sqlString += "FROM dm_Channels ";
                    sqlString += "WHERE((Id = @Id) OR";
                    sqlString += "(ParentId = @ParentId)) " + result.sqlStr;
                    sqlString += "ORDER BY Id";

                    sqlParams.push(sql.param('Id', channelId));
                    sqlParams.push(sql.param('ParentId', channelId));
                }

                result = sync.wait(sql.query(sqlString, sqlParams, sync.cb('err', 'recordSet')));
                if (result.err) callback && callback(err);
                else {
                    var channelIds = result.recordSet[0];
                    if (channelIds) {
                        channelIds = channelIds.toTable().rows;
                    }
                    else {
                        channelIds = [];
                    }
                    callback && callback(null, channelIds);
                    return;
                }
            }
        });
    },

    getGroupWhereString: function (group, groupNot, callback) {

        var whereStringBuilder = '';
        var sqlParams = [];

        if (group) {

            group = group.trim().trim(',');
            var groupArr = group.Split(',');
            if (groupArr != null && groupArr.length > 0) {
                whereStringBuilder += " AND (";
                var i = 0;
                for (var theGroup in groupArr) {
                    theGroup = theGroup.trim();
                    whereStringBuilder += " ([dm.Channels].ChannelGroupNameCollection = @ChannelGroupNameCollection" + i + " OR CHARINDEX(@ChannelGroupNameCollection" + i + "+',',[dm.Channels].ChannelGroupNameCollection) > 0 OR CHARINDEX(','+@ChannelGroupNameCollection" + i + "+',', [dm.Channels].ChannelGroupNameCollection) > 0 OR CHARINDEX(','+@ChannelGroupNameCollection" + i + ", [dm.Channels].ChannelGroupNameCollection) > 0) OR ";
                    sqlParams.push(sql.param('ChannelGroupNameCollection' + i, theGroup));
                }
                if (groupArr.length > 0) {
                    whereStringBuilder.length = whereStringBuilder.length - 3;
                }
                whereStringBuilder += ") ";
            }
        }

        if (groupNot) {
            groupNot = groupNot.trim().trim(',');
            var groupNotArr = groupNot.Split(',');
            if (groupNotArr != null && groupNotArr.length > 0) {
                whereStringBuilder += " AND (";
                for (var theGroupNot in groupNotArr) {
                    theGroupNot = theGroupNot.trim();
                    whereStringBuilder += " ([dm.Channels].ChannelGroupNameCollection <> @ChannelGroupNameCollectionNot" + i + " AND CHARINDEX(@ChannelGroupNameCollectionNot" + i + "+',',[dm.Channels].ChannelGroupNameCollection) = 0 AND CHARINDEX(','+@ChannelGroupNameCollectionNot" + i + "+',', [dm.Channels].ChannelGroupNameCollection) = 0 AND CHARINDEX(','+@ChannelGroupNameCollectionNot" + i + ", [dm.Channels].ChannelGroupNameCollection) = 0) AND ";
                    sqlParams.push(sql.param('ChannelGroupNameCollectionNot' + i, theGroup));
                }
                if (groupNotArr.length > 0) {
                    whereStringBuilder.length = whereStringBuilder.length - 4;
                }
                whereStringBuilder += ") ";
            }
        }
        callback && callback(null, whereStringBuilder, sqlParams);
    },

    /**
     * 获取栏目集合
     * @param appInfo               应用
     * @param channelInfo           栏目
     * @param groupChannel          栏目组
     * @param groupChannelNot       不在栏目组
     * @param totalNum              条数
     * @param startNum              开始位置
     * @param orderStr              排序条件
     * @param channelScope          栏目范围
     * @param isTotal               是否所有
     * @param where                 where条件
     * @param callback              回调函数
     */
    getInfoForElement: function (
        appInfo,
        channelInfo,
        groupChannel,
        groupChannelNot,
        totalNum,
        startNum,
        orderStr,
        channelScope,
        isTotal,
        where,
        callback
    ) {

        if (!where) where = '';
        if (!orderStr) orderStr = '';
        if (!totalNum) totalNum = '';
        if (!startNum) startNum = '';

        if (isTotal) {
            //所有，包括首页栏目
            this.getInfoForElementWithApp(appInfo, startNum, totalNum, where, orderStr, callback);
            return;
        } else {
            //当前栏目
            this.getInfoForElementWithChannel(channelInfo, startNum, totalNum, where, channelScope, orderStr, callback);
            return;
        }
    },

    getWhereString: function (group, groupNot, where, callback) {
        var _scope = this;

        sync.block(function () {
            var result = sync.wait(_scope.getGroupWhereString(group, groupNot, sync.cb('err', 'sqlStr', 'sqlParams')));
            if (result.err) return '';
            else {
                var whereStringBuilder = '';
                var sqlParams = result.sqlParams;

                if (result.sqlStr) {
                    whereStringBuilder += result.sqlStr;
                }

                if (where) {
                    whereStringBuilder += " AND " + where;
                }

                callback && callback(null, whereStringBuilder, sqlParams);
            }

        });

    },

    getInfoForElementWithChannel: function (channelInfo, startNum, totalNum, whereString, scopeType, orderByString, callback) {
        var _scope = this;

        this.getChannelIds(channelInfo, scopeType, '', '', '', function (err, channelIds) {

            if (channelIds == null || channelIds.length == 0) {
                callback && callback(null, []);
                return;
            }

            var sqlWhereString = "WHERE (Id IN (" + translateUtil.ObjectCollectionToSqlInStringWithoutQuote(channelIds) + ") " + whereString + ")";

            sql.getSelectSqlString(_scope.TABLENAME, startNum, totalNum, "*", sqlWhereString, orderByString, function (err, sqlStr) {
                sync.block(function () {
                    var result = sync.wait(sql.query(sqlStr, [], sync.cb('err', 'recordSet')));
                    if (result.err) {
                        callback && callback(result.err);
                    } else {
                        if (result.recordSet) {
                            var channelInfos = result.recordSet[0];
                            callback && callback(null, channelInfos);
                            return;
                        }
                    }
                });
            });
        });

    },

    getInfoForElementWithApp: function (appInfo, startNum, totalNum, whereString, orderByString, callback) {

        var sqlWhereString = "WHERE (AppId = " + appInfo.Id + " " + whereString + ")";

        sql.getSelectSqlString(this.TABLENAME, startNum, totalNum, "*", sqlWhereString, orderByString, function (err, sqlStr) {
            sync.block(function () {
                var result = sync.wait(sql.query(sqlStr, [], sync.cb('err', 'recordSet')));
                if (result.err) {
                    callback && callback(result.err);
                } else {
                    if (result.recordSet) {
                        var channelInfos = result.recordSet[0];
                        callback && callback(null, channelInfos);
                        return;
                    }
                }
            });
        });
    }
};

module.exports = channelStore;