var path = require('path');

var pageUtil = {
    //模板
    template:{
        indexTemplateType:"indextemplate",
        channelTemplateType:"channeltemplate",
        contentTemplateType:"contenttemplate",
        fileTemplateType:"filetemplate",
        
        templateFolder:"templates",
        indexTemplateFolder:"templates/index",
        channelTemplateFolder:"templates/channel",
        contentTemplateFolder:"templates/content",
        fileTemplateFolder:"templates/file",
    }
};

/* *
 * 获取模板路径
 * @param templateInfo      模板
 * @param callback                回调函数
 * */
pageUtil.getTemplatePath = function(appInfo, templateInfo, callback){
    if(!appInfo){
        var error = new Error("appInfo is null!");
        callback && callback(error);
    }
    else if(!templateInfo){
        var error = new Error("templateInfo is null!");
        callback && callback(error);
    }
    else{
        if(templateInfo.type.toLowerCase() === this.indexTemplateType)
            callback(path.normalize([appInfo.appDir,this.indexTemplateFolder,templateInfo.name+templateInfo.extension].join('/')));
        else if(templateInfo.type.toLowerCase() === this.channelTemplateType)
            callback(path.normalize([appInfo.appDir,this.channelTemplateFolder,templateInfo.name+templateInfo.extension].join('/')));
        else if(templateInfo.type.toLowerCase() === this.contentTemplateType)
            callback(path.normalize([appInfo.appDir,this.contentTemplateFolder,templateInfo.name+templateInfo.extension].join('/')));
        else
            callback(path.normalize([appInfo.appDir,this.fileTemplateFolder,templateInfo.name+templateInfo.extension].join('/')));
    }
};

module.exports = pageUtil;