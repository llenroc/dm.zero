var asyncUtil = require('../../utils/asyncUtil');

var parserUtil = {};

var str = "<t:(\w+?)[^>]*>";
    str +="(?>";
    str +="<t:\1[^>]*> (?<LEVEL>)";
    str +="| ";
    str +="</t:\1[^>]*> (?<-LEVEL>)";
    str +="|";
    str +="(?! <t:\1[^>]*> | </t:\1[^>]*> ).";
    str +=")*";
    str +="(?(LEVEL)(?!))";
    str +="</t:\1[^>]*>|<t:(\w+?)[^>]*/>";
parserUtil.REGEX_T_ELEMENT = /<t:(\w+?)[^>]*><\/t:\1[^>]*>|<t:(\w+?)[^>]*\/>/gim;

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
       
       var m = fileContent.match(parserUtil.REGEX_T_ELEMENT);
       m.forEach(function(el) {
          element.key = "app";
          element.value = el;
          elementList.push(element);
       }, this);

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