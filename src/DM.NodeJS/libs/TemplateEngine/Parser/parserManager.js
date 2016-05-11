var domain = require('domain');
var asyncUtil = require('../../libs/utils/asyncUtil');
var parserUtil = require('../libs/TemplateEngine/parser/parserUtil');
var fsUtil = require('../../libs/utils/fsUtil');

var domain = domain.create();

var parserManager = {};

/* *
 * 同步生成
 * @templatePath      文件路径
 * @appInfo       应用
 * @channelInfo   栏目
 * @contentInfo   内容
 * */
parserManager.parseSync = function(templatePath, filePath, appInfo, channelInfo, contentInfo, fileInfo){
    var elementList = [];
        
    domain.on('error',function(err){
        //错误处理
    });
    
    domain.run(function(){
        
        var fileContent = fsUtil.readFile(templatePath,function(err,data){
            elementList = parserUtil.GetElementList(fileContent);
            elementList.forEach(function(element) {
                var startIndex = fileContent.indexOf(element.value);
                if(startIndex !== -1){
                    //遍历标签，替换
                    var replaceStr = require(element.key).parse(element.value, appInfo, channelInfo, contentInfo, fileInfo);
                    fileContent.replace(element.value,replaceStr);
                }
            }, this);
            
            fsUtil.writeFile(filePath, fileContent);
        });
    });

};

/* *
 * 异步生成
 * @callback      回调函数
 * */
parserManager.parse = function(filePath, appInfo, channelInfo, contentInfo, fileInfo, callback){
    asyncUtil.async(parserManager.createSync(filePath, appInfo, channelInfo, contentInfo, fileInfo),callback);
};

module.exports = parserManager;