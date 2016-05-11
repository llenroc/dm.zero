var asyncUtil = require('./libs/utils/asyncUtil');

var parserUtil = {};

/* *
 * 获取模板标签列表
 * @fileContent     内容
 * */
parserUtil.GetElementListSync = function(fileContent){
    var elementList = [];
    if(!fileContent){
        return elementList;
    }
    else{
       //通过正则表达式，获取标签
       var element = {
           key:'',
           value:''
       };
       
       
       elementList.push(element);
       return elementList;
    }
};


/* *
 * 获取模板标签列表(异步)
 * @fileContent     内容
 * */
parserUtil.GetElementList = function(fileContent, callback){
    asyncUtil.async(parserUtil.GetElementListSync,callback,fileContent);
};

module.exports = parserUtil;