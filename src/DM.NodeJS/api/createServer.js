var express = require('express');
var guid = require('guid');

var templateStore = require('../store/templateStore');
var appStore = require('../store/appStore');
var channelStore = require('../store/channelStore');
var contentStore = require('../store/contentStore');

var cacheManager = require('../libs/utils/cacheManager');
var fsUtil = require('../libs/utils/fsUtil');
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
createServer.create = function(req,res,appId,channelId,contentId,fileId,callback){
    req = req;
    res = res;
    
    if(fileId){
        //生成单页
        createServer.createFile(fileId, callback);
    }
    else if(contentId){
        //生成内容
        createServer.createContent(contentId, callback);
    }
    else if(channelId){
        //生成栏目
        createServer.createChannel(channelId, callback);
    }
    else if(appId){
        //生成首页
        createServer.createIndex(appId, callback);
    }
}

/* *
 * 生成单页
 * @fileId      文件ID
 * */
createServer.createFileSync = function (fileId) {
    var GUID = guid.create();
    
    //设置总数，完成数
    var totalCount = 1;
    var createCount = 0;
    cacheManager.createServerCache.setCount(GUID, totalCount, createCount);
    
    var appInfo = {};
    var templateFileInfo = templateStore.getInfo(fileId);
    var templatePath = fsUtil.mapPath(templateFileInfo.path);
    te.parseSync(templatePath, appInfo, null, null, templateFileInfo);
    
    createCount = 1;
    cacheManager.createServerCache.setCount(GUID, totalCount, createCount);
    
    var result =  {
        totalCountKey:cacheManager.createServerCache.getKey(GUID, cacheManager.createServerCache.type_totalCount),
        createCountKey:cacheManager.createServerCache.getKey(GUID, cacheManager.createServerCache.type_createCount)
    };
    return result;
}

/* *
 * 生成单页(异步)
 * @fileId      文件ID
 * @callback    回调函数
 * */
createServer.createFile = function (fileId, callback) {
    asyncUtil.async(createServer.createFileSync,callback,fileId);
}





module.exports = createServer;