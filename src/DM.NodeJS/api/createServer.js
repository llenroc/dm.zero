var express = require('express');

var templateStore = require('../store/templateStore');
var appStore = require('../store/appStore');
var channelStore = require('../store/channelStore');
var contentStore = require('../store/contentStore');

var cacheManager = require('../libs/utils/cacheManager');
var fsUtil = require('../libs/utils/fsUtil');
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
createServer.create = function(req,res,appId,channelId,contentId,fileId){
    req = req;
    res = res;
    
    if(fileId){
        //生成单页
        createServer.createFile(fileId);
    }
    else if(contentId){
        //生成内容
        createServer.createContent(contentId);
    }
    else if(channelId){
        //生成栏目
        createServer.createChannel(channelId);
    }
    else if(appId){
        //生成首页
        createServer.createIndex(appId);
    }
}

/* *
 * 生成单页
 * @fileId      文件ID
 * */
createServer.createFile = function (fileId) {
    //设置总数，完成数
    var totalCount = 1;
    var createCount = 0;
    cacheManager.createServerCache.setCount(fileId, totalCount, createCount);
    
    var fileInfo = templateStore.getInfo(fileId);
    var filePath = fsUtil.mapPath(fileInfo.path);
    te.parse(filePath, appInfo, null, null, fileInfo, function (err,data) {
        if(err){
            
        }
        else{
            //设置总数，完成数
            var totalCount = 1;
            var createCount = 1;
            cacheManager.createServerCache.setCount(fileId, totalCount, createCount);
        }
    });
    

}



module.exports = createServer;