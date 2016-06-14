var express = require('express');
var guid = require('guid');

var templateStore = require('../store/templateStore');
var appStore = require('../store/appStore');
var channelStore = require('../store/channelStore');
var contentStore = require('../store/contentStore');

var cacheManager = require('../libs/utils/cacheManager');
var fsUtil = require('../libs/utils/fsUtil');
var pageUtil = require('../libs/utils/pageUtil');
var asyncUtil = require('../libs/utils/asyncUtil');
var parserManager = require('../libs/templateEngine/parser/parserManager');

var createServer = {};

var req,
    res;

/* *
 * 生成服务
 * @appId        应用ID
 * @channelIds   栏目ID
 * @contentIds   内容ID
 * @fileIds      文件ID
 * */
createServer.create = function (req, res, appId, channelIds, contentIds, fileIds, isCreateContent, callback) {
    req = req;
    res = res;

    if (fileIds && fileIds.length > 0) {
        //生成单页
        createServer.createFile(appId, fileIds, callback);
    }
    else if (contentIds && contentIds.length > 0) {
        //生成选中内容
        createServer.createContent(appId, channelIds, contentIds, callback);
    }
    else if (channelIds && channelIds.length > 0 && isCreateContent) {
        //生成选中栏目的内容
        createServer.createContent(appId, channelIds, null, callback);
    }
    else if (channelIds && channelIds.length > 0 && !isCreateContent) {
        //生成栏目
        createServer.createChannel(appId, channelIds, callback);
    }
    else if (appId) {
        //生成首页
        createServer.createIndex(appId, callback);
    }
    else {
        var error = new Error("There is no parameter.This api must has parameters!");
        error.status = 500;
        callback && callback(error);
    }
}

/* *
 * 生成单页
 * @appId       应用ID
 * @fileIds     文件ID
 * */
createServer.createFileSync = function (appId, fileIds) {
    var GUID = guid.create();

    //设置总数，完成数
    var totalCount = fileIds.length;
    var createCount = 0;
    cacheManager.createServerCache.setCount(GUID, totalCount, createCount);


    appStore.getInfo(appId, function (err, appInfo) {
        fileIds.forEach(function (fileId) {
            templateStore.getInfo(fileId, function (err, templateFileInfo) {
                if (templateFileInfo) {
                    var templatePath = fsUtil.mapPath(pageUtil.getTemplatePath(appInfo, templateFileInfo));
                    var filePath = fsUtil.mapPath(pageUtil.getSigleFilePath(appInfo, templateFileInfo));
                    parserManager.parseSync(templatePath, filePath, appInfo, null, null, templateFileInfo);
                }
                createCount++;
                cacheManager.createServerCache.setCount(GUID, totalCount, createCount);
            });
        }, this);
    });


    var result = {
        totalCountKey: cacheManager.createServerCache.getKey(GUID, cacheManager.createServerCache.type_totalCount),
        createCountKey: cacheManager.createServerCache.getKey(GUID, cacheManager.createServerCache.type_createCount)
    };
    return { success: true, result: result };
}

/* *
 * 生成单页(异步)
 * @appId       应用ID
 * @fileIds     文件ID
 * @callback    回调函数
 * */
createServer.createFile = function (appId, fileIds, callback) {
    asyncUtil.async(createServer.createFileSync, callback, appId, fileIds);
}

/* *
 * 生成首页
 * @appId      应用ID
 * */
createServer.createIndexSync = function (appId) {
    var GUID = guid.create();

    //设置总数，完成数
    var totalCount = 1;
    var createCount = 0;
    cacheManager.createServerCache.setCount(GUID, totalCount, createCount);

    templateStore.getIndexTemplateInfo(appId, function (err, appInfo, templateFileInfo) {

        var templatePath = fsUtil.mapPath(pageUtil.getTemplatePath(appInfo, templateFileInfo));
        var filePath = fsUtil.mapPath(pageUtil.getIndexFilePath(appInfo, templateFileInfo));
        parserManager.parseSync(templatePath, filePath, appInfo, null, null, templateFileInfo);

        createCount = 1;
        cacheManager.createServerCache.setCount(GUID, totalCount, createCount);
    });


    var result = {
        totalCountKey: cacheManager.createServerCache.getKey(GUID, cacheManager.createServerCache.type_totalCount),
        createCountKey: cacheManager.createServerCache.getKey(GUID, cacheManager.createServerCache.type_createCount)
    };
    return { success: true, result: result };
}

/* *
 * 生成首页(异步)
 * @appId       应用ID
 * @callback    回调函数
 * */
createServer.createIndex = function (appId, callback) {
    asyncUtil.async(createServer.createIndexSync, callback, appId);
}

/* *
 * 生成栏目页
 * @appId       应用ID
 * @channelIds  栏目ID
 * */
createServer.createChannelSync = function (appId, channelIds) {
    var GUID = guid.create();

    //设置总数，完成数
    var totalCount = 1;
    var createCount = 0;
    cacheManager.createServerCache.setCount(GUID, totalCount, createCount);

    channelIds.forEach(function (channelId) {
        templateStore.getChannelTemplateInfo(appId, channelId, function (err, appInfo, channelInfo, templateFileInfo) {

            var templatePath = fsUtil.mapPath(pageUtil.getTemplatePath(appInfo, templateFileInfo));
            var filePath = fsUtil.mapPath(pageUtil.getChannelFilePath(appInfo, channelInfo, templateFileInfo));
            parserManager.parseSync(templatePath, filePath, appInfo, channelInfo, null, templateFileInfo);

            createCount = 1;
            cacheManager.createServerCache.setCount(GUID, totalCount, createCount);
        });
    }, this);



    var result = {
        totalCountKey: cacheManager.createServerCache.getKey(GUID, cacheManager.createServerCache.type_totalCount),
        createCountKey: cacheManager.createServerCache.getKey(GUID, cacheManager.createServerCache.type_createCount)
    };
    return { success: true, result: result };
}

/* *
 * 生成栏目页(异步)
 * @appId        应用ID
 * @channelIds   栏目ID
 * @callback     回调函数
 * */
createServer.createChannel = function (appId, channelIds, callback) {
    asyncUtil.async(createServer.createChannelSync, callback, appId, channelIds);
}


/* *
 * 生成内容页
 * @appId       应用ID
 * @channelIds  栏目ID
 * @contentId   内容ID
 * */
createServer.createContentSync = function (appId, channelIds, contentIds) {
    var GUID = guid.create();

    if (contentIds) {
        //选中内容直接生成

        //设置总数，完成数
        var totalCount = contentIds.length;
        var createCount = 0;
        cacheManager.createServerCache.setCount(GUID, totalCount, createCount);

        var channelId = channelIds[0];
        contentIds.forEach(function (contentId) {
            templateStore.getContentTemplateInfo(appId, channelId, contentId, function (err, appInfo, channelInfo, templateFileInfo) {

                contentStore.getInfo(contentId, function (err, contentInfo) {
                    var templatePath = fsUtil.mapPath(pageUtil.getTemplatePath(appInfo, templateFileInfo));
                    var filePath = fsUtil.mapPath(pageUtil.getContentFilePath(appInfo, channelInfo, contentInfo, templateFileInfo));
                    parserManager.parseSync(templatePath, filePath, appInfo, channelInfo, contentInfo, templateFileInfo);

                    createCount++;
                    cacheManager.createServerCache.setCount(GUID, totalCount, createCount);
                });
            });
        }, this);

    }
    else if (channelIds) {
        //选中栏目生成内容

        //设置总数，完成数
        var totalCount = channelIds.length;
        var createCount = 0;
        cacheManager.createServerCache.setCount(GUID, totalCount, createCount);

        channelIds.forEach(function (channelId) {
            contentStore.getContentIdsByChannelId(channelId, function (err, contentIds) {

                contentIds.forEach(function (contentId) {

                    templateStore.getContentTemplateInfo(appId, channelId, contentId, function (err, appInfo, channelInfo, templateFileInfo) {

                        contentStore.getInfo(contentId, function (err, contentInfo) {
                            var templatePath = fsUtil.mapPath(pageUtil.getTemplatePath(appInfo, templateFileInfo));
                            var filePath = fsUtil.mapPath(pageUtil.getContentFilePath(appInfo, channelInfo, contentInfo, templateFileInfo));
                            parserManager.parseSync(templatePath, filePath, appInfo, channelInfo, contentInfo, templateFileInfo);

                            createCount++;
                            cacheManager.createServerCache.setCount(GUID, totalCount, createCount);
                        });
                    });

                });
            });


        }, this);
    }

    var result = {
        totalCountKey: cacheManager.createServerCache.getKey(GUID, cacheManager.createServerCache.type_totalCount),
        createCountKey: cacheManager.createServerCache.getKey(GUID, cacheManager.createServerCache.type_createCount)
    };
    return { success: true, result: result };
}

/* *
 * 生成内容页(异步)
 * @appId        应用ID
 * @channelIds   栏目ID
 * @contentIds   内容ID
 * @callback     回调函数
 * */
createServer.createContent = function (appId, channelIds, contentIds, callback) {
    asyncUtil.async(createServer.createContentSync, callback, appId, channelIds, contentIds);
}


module.exports = createServer;