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
var te = require('../libs/templateEngine/parser/parserManager');

var createServer = {};

var req,
    res;

/* *
 * 生成服务
 * @appId       应用ID
 * @channelId   栏目ID
 * @contentId   内容ID
 * @fileId      文件ID
 * */
createServer.create = function (req, res, appId, channelId, contentId, fileId, callback) {
    req = req;
    res = res;

    if (fileId) {
        //生成单页
        createServer.createFile(appId, fileId, callback);
    }
    else if (contentId) {
        //生成内容
        createServer.createContent(appId, channelId, contentId, callback);
    }
    else if (channelId) {
        //生成栏目
        createServer.createChannel(appId, channelId, callback);
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
 * @fileId      文件ID
 * */
createServer.createFileSync = function (appId, fileId) {
    var GUID = guid.create();

    //设置总数，完成数
    var totalCount = 1;
    var createCount = 0;
    cacheManager.createServerCache.setCount(GUID, totalCount, createCount);

    appStore.getInfo(appId, function (err, appInfo) {
        templateStore.getInfo(fileId, function (err, templateFileInfo) {
            var templatePath = fsUtil.mapPath(pageUtil.getTemplatePath(appInfo, templateFileInfo));
            var filePath = fsUtil.mapPath(pageUtil.getSigleFilePath(appInfo, templateFileInfo));
            te.parseSync(templatePath, filePath, appInfo, null, null, templateFileInfo);

            createCount = 1;
            cacheManager.createServerCache.setCount(GUID, totalCount, createCount);
        });

    });

    var result = {
        totalCountKey: cacheManager.createServerCache.getKey(GUID, cacheManager.createServerCache.type_totalCount),
        createCountKey: cacheManager.createServerCache.getKey(GUID, cacheManager.createServerCache.type_createCount)
    };
    return result;
}

/* *
 * 生成单页(异步)
 * @appId       应用ID
 * @fileId      文件ID
 * @callback    回调函数
 * */
createServer.createFile = function (appId, fileId, callback) {
    asyncUtil.async(createServer.createFileSync, callback, appId, fileId);
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
        te.parseSync(templatePath, filePath, appInfo, null, null, templateFileInfo);

        createCount = 1;
        cacheManager.createServerCache.setCount(GUID, totalCount, createCount);
    });


    var result = {
        totalCountKey: cacheManager.createServerCache.getKey(GUID, cacheManager.createServerCache.type_totalCount),
        createCountKey: cacheManager.createServerCache.getKey(GUID, cacheManager.createServerCache.type_createCount)
    };
    return result;
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
 * @appId      应用ID
 * @channelId  栏目ID
 * */
createServer.createChannelSync = function (appId, channelId) {
    var GUID = guid.create();

    //设置总数，完成数
    var totalCount = 1;
    var createCount = 0;
    cacheManager.createServerCache.setCount(GUID, totalCount, createCount);

    templateStore.getChannelTemplateInfo(appId, channelId, function (err, appInfo, channelInfo, templateFileInfo) {

        var templatePath = fsUtil.mapPath(pageUtil.getTemplatePath(appInfo, templateFileInfo));
        var filePath = fsUtil.mapPath(pageUtil.getChannelFilePath(appInfo, channelInfo, templateFileInfo));
        te.parseSync(templatePath, filePath, appInfo, channelInfo, null, templateFileInfo);

        createCount = 1;
        cacheManager.createServerCache.setCount(GUID, totalCount, createCount);
    });


    var result = {
        totalCountKey: cacheManager.createServerCache.getKey(GUID, cacheManager.createServerCache.type_totalCount),
        createCountKey: cacheManager.createServerCache.getKey(GUID, cacheManager.createServerCache.type_createCount)
    };
    return result;
}

/* *
 * 生成栏目页(异步)
 * @appId       应用ID
 * @channelId   栏目ID
 * @callback    回调函数
 * */
createServer.createChannel = function (appId, channelId, callback) {
    asyncUtil.async(createServer.createChannelSync, callback, appId, channelId);
}


/* *
 * 生成内容页
 * @appId      应用ID
 * @channelId  栏目ID
 * @contentId  内容ID
 * */
createServer.createContentSync = function (appId, channelId, contentId) {
    var GUID = guid.create();

    //设置总数，完成数
    var totalCount = 1;
    var createCount = 0;
    cacheManager.createServerCache.setCount(GUID, totalCount, createCount);

    templateStore.getContentTemplateInfo(appId, channelId, contentId, function (err, appInfo, channelInfo, templateFileInfo) {

        contentStore.getInfo(contentId, function (err, contentInfo) {
            var templatePath = fsUtil.mapPath(pageUtil.getTemplatePath(appInfo, templateFileInfo));
            var filePath = fsUtil.mapPath(pageUtil.getContentFilePath(appInfo, channelInfo, contentInfo, templateFileInfo));
            te.parseSync(templatePath, filePath, appInfo, channelInfo, contentInfo, templateFileInfo);

            createCount = createCount + 1;
            cacheManager.createServerCache.setCount(GUID, totalCount, createCount);
        });
    });


    var result = {
        totalCountKey: cacheManager.createServerCache.getKey(GUID, cacheManager.createServerCache.type_totalCount),
        createCountKey: cacheManager.createServerCache.getKey(GUID, cacheManager.createServerCache.type_createCount)
    };
    return result;
}

/* *
 * 生成内容页(异步)
 * @appId       应用ID
 * @channelId   栏目ID
 * @contentId   内容ID
 * @callback    回调函数
 * */
createServer.createContent = function (appId, channelId, contentId, callback) {
    asyncUtil.async(createServer.createContentSync, callback, appId, channelId, contentId);
}


module.exports = createServer;