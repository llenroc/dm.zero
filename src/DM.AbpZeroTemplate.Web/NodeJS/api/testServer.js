var appStore = require('../store/appStore');
var channelStore = require('../store/channelStore');
var contentStore = require('../store/contentStore');

var sync = require('simplesync');

var testServer = {

    test: function (appId, channelId) {
       sync.block(function(){
           var result = sync.wait(appStore.getInfo(appId,sync.cb('err','appInfo')));
           if(!result.err){
               var appInfo = result.appInfo;
               result = sync.wait(channelStore.getInfo(channelId,sync.cb('err','channelInfo')));
               if(!result.err){
                   var channelInfo = result.channelInfo;
                   contentStore.getInfoForElement(appInfo,channelInfo,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,function(err,contentInfos){
                       if(!err){
                           console.log(contentInfos.length);
                       }
                   });
               }
           }
       });
    }
};

module.exports = testServer;