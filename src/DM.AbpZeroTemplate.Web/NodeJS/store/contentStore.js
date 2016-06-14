var sql = require('./sql');
var sync = require('simplesync');
var channelStore = require('./channelStore');
var translateUtil = require('../libs/utils/translateUtil');

var contentStore = {
    SQL_GET: "select * from [dbo].[dm_Contents] where Id=@Id",
    SQL_GET_ID_BY_CHANNEL_ID: "select Id from [dbo].[dm_Contents] where ChannelId=@ChannelId",
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
    },

    /* *
    * 获取contentInfo
    * @param contentId 内容Id
    * @param callback  回调函数
    * */
    getContentIdsByChannelId: function (channelId, callback) {
        var _scope = this;
        if (!channelId) {
            var error = new Error("channelId is null!");
            callback && callback(error);
        }
        else {
            var params = [];
            params.push(sql.param("ChannelId", channelId));
            sql.query(_scope.SQL_GET_ID_BY_CHANNEL_ID, params, function (err, recordSet) {
                if (err) {
                    callback && callback(err);
                } else {
                    if (recordSet) {
                        var contentIds = recordSet[0];
                        if (contentIds) {
                            contentIds = contentIds.toTable().rows;
                        }
                        else {
                            contentIds = [];
                        }
                        callback && callback(null, contentIds);
                    }
                }
            });
        }
    },

    /**
     * 获取内容集合
     * @param appInfo               应用
     * @param channelInfo           栏目
     * @param scope                 范围
     * @param groupChannel          栏目组
     * @param groupChannelNot       不在栏目组
     * @param isImageExists         是否有图片内容条件
     * @param isImage               是否是图片内容
     * @param isVideoExists         是否有视频内容条件
     * @param isVideo               是否是视频内容
     * @param isFileExists          是否有附件内容条件
     * @param isFile                是否是附件内容
     * @param isTopExists           是否有置顶
     * @param isTop                 是否置顶
     * @param isRecommendExists     是否有推荐
     * @param isRecommend           是否推荐
     * @param isHotExists           是否有热点
     * @param isHot                 是否热点
     * @param isColorExists         是否有高亮
     * @param isColor               是否高亮
     * @param totalNum              条数
     * @param startNum              开始位置
     * @param orderStr              排序条件
     * @param where                 where条件
     */
    getInfoForElement: function (
        appInfo,
        channelInfo,
        scope,
        groupChannel,
        groupChannelNot,
        isImageExists,
        isImage,
        isVideoExists,
        isVideo,
        isFileExists,
        isFile,
        isTopExists,
        isTop,
        isRecommendExists,
        isRecommend,
        isHotExists,
        isHot,
        isColorExists,
        isColor,
        totalNum,
        startNum,
        orderStr,
        where,
        callback) {
        var _scope = this;
        channelStore.getTableName(appInfo, channelInfo, function (err, tableName) {
            if (!err) {
                _scope.getInfoSqlStrForElement(appInfo, channelInfo, groupChannel, groupChannelNot, isImageExists, isImage, isVideoExists, isVideo, isFileExists, isFile, isTopExists, isTop, isRecommendExists, isRecommend, isHotExists, isHot, isColorExists, isColor, totalNum, startNum, where, tableName, function (err, whereStr, sqlParams) {
                    if (!err) {
                        channelStore.getChannelIds(channelInfo, scope, groupChannel, groupChannelNot, channelInfo.modelType, function (err, channelIds) {
                            if (err) {
                                return null;
                            }
                            if (!channelIds || channelIds.length == 0) {
                                return null;
                            }
                            var sqlWhereString = '';
                            if (channelIds.length == 1) {
                                sqlWhereString += "WHERE (ChannelId = @ChannelId AND IsChecked = 1 " + whereStr + ")";
                                sqlParams.push(sql.param('ChannelId', channelIds[0]));
                            }
                            else {
                                sqlWhereString += "WHERE (ChannelId IN (" + translateUtil.ObjectCollectionToSqlInStringWithoutQuote(channelIds) + ") AND IsChecked = 1 " + whereStr + ")";
                            }

                            if ((!!startNum && startNum <= 1) || !startNum) {
                                sql.getSelectSqlStringWithoutStartNum(tableName, totalNum, '*', sqlWhereString, orderStr, function (err, sqlStr) {
                                    if (!err) {
                                        _scope.getInfoForElementActionSql(sqlStr, sqlParams, callback);
                                        return;
                                    }
                                });
                            }
                            else {
                                sqlStr = sql.getSelectSqlString(tableName, startNum, totalNum, '*', sqlWhereString, orderStr, function (err, sqlStr) {
                                    if (!err) {
                                        _scope.getInfoForElementActionSql(sqlStr, sqlParams, callback);
                                        return;
                                    }
                                });
                            }
                        });

                    }
                });
            }
        });

    },

    getInfoForElementActionSql: function (sqlStr, sqlParams, callback) {
        sync.block(function () {
            var result = sync.wait(sql.query(sqlStr, sqlParams, sync.cb('err', 'recordSet')));
            if (!result.err) {
                var contentInfos = result.recordSet[0];
                callback && callback(null, contentInfos);
                return;
            }
        });
    },

    getInfoSqlStrForElement: function (appInfo, channelInfo, group, groupNot, isImageExists, isImage, isVideoExists, isVideo, isFileExists, isFile, isTopExists, isTop, isRecommendExists, isRecommend, isHotExists, isHot, isColorExists, isColor, totalNum, startNum, where, tableName, callback, sqlParams) {
        var whereBuilder = '';
        sqlParams = sqlParams || [];

        whereBuilder += " AND AppId = @AppId ";
        sqlParams.push(sql.param('AppId', appInfo.Id));

        if (isImageExists) {
            if (isImage) {
                whereBuilder += " AND ImageUrl <> '' ";
            }
            else {
                whereBuilder += " AND ImageUrl = '' ";
            }
        }

        if (isVideoExists) {
            if (isVideo) {
                whereBuilder += " AND VideoUrl <> '' ";
            }
            else {
                whereBuilder += " AND VideoUrl = '' ";
            }
        }

        if (isFileExists) {
            if (isFile) {
                whereBuilder += " AND FileUrl <> '' ";
            }
            else {
                whereBuilder += " AND FileUrl = '' ";
            }
        }

        if (isTopExists) {
            whereBuilder += " AND IsTop = @IsTop ";
            sqlParams.push(sql.param('IsTop', isTop.toString()));
        }

        if (isRecommendExists) {
            whereBuilder += " AND IsRecommend = @IsRecommend ";
            sqlParams.push(sql.param('IsRecommend', isRecommend.toString()));
        }

        if (isHotExists) {
            whereBuilder += " AND IsHot = @IsHot ";
            sqlParams.push(sql.param('IsHot', isHot.toString()));
        }

        if (isColorExists) {
            whereBuilder += " AND IsColor = @IsColor ";
            sqlParams.push(sql.param('IsColor', isColor.toString()));
        }

        if (group) {
            group = group.trim().trim(',');
            var groupArr = group.Split(',');
            if (groupArr != null && groupArr.length > 0) {
                whereBuilder += " AND (";
                var i = 0;
                groupArr.forEach(function (theGroup) {
                    whereBuilder += " (ContentGroupNameCollection = @ContentGroupNameCollection" + i + " OR CHARINDEX(@ContentGroupNameCollection" + i + "+',',ContentGroupNameCollection) > 0 OR CHARINDEX(','+@ContentGroupNameCollection" + i + "+',',ContentGroupNameCollection) > 0 OR CHARINDEX(','+@ContentGroupNameCollection" + i + ",ContentGroupNameCollection) > 0) OR ";
                    sqlParams.push(sql.param('ContentGroupNameCollection' + i, theGroup));
                    i++;
                }, this);

                if (groupArr.length > 0) {
                    whereBuilder.length = whereBuilder.length - 3;
                }
                whereBuilder += ") ";
            }
        }

        if (groupNot) {
            groupNot = groupNot.trim().trim(',');
            var groupNotArr = groupNot.Split(',');
            if (groupNotArr != null && groupNotArr.length > 0) {
                whereBuilder += " AND (";
                var i = 0;
                groupArr.forEach(function (theGroup) {
                    whereBuilder += " (ContentGroupNameCollection <> @ContentGroupNameCollectionNot" + i + " AND CHARINDEX(@ContentGroupNameCollectionNot" + i + "+',',ContentGroupNameCollection) = 0 AND CHARINDEX(','+@ContentGroupNameCollectionNot" + i + "+',',ContentGroupNameCollection) = 0 AND CHARINDEX(','+@ContentGroupNameCollectionNot" + i + ",ContentGroupNameCollection) = 0) AND ";
                    sqlParams.push(sql.param('ContentGroupNameCollectionNot' + i, theGroup));
                    i++;
                }, this);
                if (groupNotArr.length > 0) {
                    whereBuilder.length = whereBuilder.length - 4;
                }
                whereBuilder += ") ";
            }
        }

        // if (tags) {

        // }

        if (where) {
            whereBuilder += " AND (" + where + ") ";
        }

        callback && callback(null, whereBuilder, sqlParams);
    }
};

module.exports = contentStore;