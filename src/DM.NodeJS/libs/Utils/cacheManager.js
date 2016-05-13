var cache = require('memory-cache');
var cacheManager = {};

cacheManager.set = function(key, value){
    cache.put(key,value);
};

cacheManager.get = function(key){
    cache.get(key);
};

cacheManager.remove = function(key){
    cache.delete(key);
};

cacheManager.clear = function(){
    cache.clear();
};

cacheManager.createServerCache = {
     type_totalCount:'totalCount',
     type_createCount:'createCount',
     keyPre:'nodejs_create_server_',
     setCount:function(guid,totalCount,createCount){
         cacheManager.set(this.getKey(guid,this.type_totalCount),totalCount);
         cacheManager.set(this.getKey(guid,this.type_createCount),createCount);
     },
     getKey:function(guid,countType){
         [this.keyPre,guid,countType].join('');
     }
};

module.exports = cacheManager;