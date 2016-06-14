var path = require('path');

var pageUtil = {
    //模板
    template: {
        indexTemplateType: "indextemplate",
        channelTemplateType: "channeltemplate",
        contentTemplateType: "contenttemplate",
        fileTemplateType: "filetemplate",

        templateFolder: "templates",
        indexTemplateFolder: "templates/index",
        channelTemplateFolder: "templates/channel",
        contentTemplateFolder: "templates/content",
        fileTemplateFolder: "templates/file",

        indexCreateFolder: "",
        channelCreateFolder: "channels",
        contentCreateFolder: "contents",
        fileCreateFolder: "",
    },
    /* *
    * 获取模板路径
    * @param appInfo           应用
    * @param templateInfo      模板
    * */
    getTemplatePath: function (appInfo, templateInfo) {
        if (!appInfo) {
            var error = new Error("appInfo is null!");
            console.log(error);
        }
        else if (!templateInfo) {
            var error = new Error("templateInfo is null!");
            console.log(error);
        }
        else {
            if (templateInfo.Type.toLowerCase() === this.template.indexTemplateType)
                return path.normalize([appInfo.AppDir, this.template.indexTemplateFolder, templateInfo.Name + templateInfo.Extension].join('/'));
            else if (templateInfo.Type.toLowerCase() === this.template.channelTemplateType)
                return path.normalize([appInfo.AppDir, this.template.channelTemplateFolder, templateInfo.Name + templateInfo.Extension].join('/'));
            else if (templateInfo.Type.toLowerCase() === this.template.contentTemplateType)
                return path.normalize([appInfo.AppDir, this.template.contentTemplateFolder, templateInfo.Name + templateInfo.Extension].join('/'));
            else
                return path.normalize([appInfo.AppDir, this.template.fileTemplateFolder, templateInfo.Name + templateInfo.Extension].join('/'));
        }
    },

    /* *
     * 获取单页模板生成路径
     * @param appInfo           应用
     * @param templateInfo      模板
     * */
    getSigleFilePath: function (appInfo, templateInfo) {
        if (!appInfo) {
            var error = new Error("appInfo is null!");
            console.log(error);
            return "";
        }
        else if (!templateInfo) {
            var error = new Error("templateInfo is null!");
            console.log(error);
            return "";
        }
        else if (templateInfo.Type.toLowerCase() !== this.template.fileTemplateType) {
            var error = new Error("templateInfo is not file template type!");
            console.log(error);
            return "";
        }
        else {
            return path.normalize([appInfo.AppDir, this.template.fileCreateFolder, templateInfo.CreatePath, templateInfo.Name + templateInfo.Extension].join('/'));
        }
    },

    /* *
     * 获取内容生成路径
     * @param appInfo           应用
     * @param channelInfo       栏目
     * @param contentInfo       内容
     * @param templateInfo      模板
     * */
    getContentFilePath: function (appInfo, channelInfo, contentInfo, templateInfo) {
        if (!appInfo) {
            var error = new Error("appInfo is null!");
            console.log(error);
            return "";
        }
        else if (!channelInfo) {
            var error = new Error("channelInfo is null!");
            console.log(error);
            return "";
        }
        else if (!contentInfo) {
            var error = new Error("contentInfo is null!");
            console.log(error);
            return "";
        }
        else if (!templateInfo) {
            var error = new Error("templateInfo is null!");
            console.log(error);
            return "";
        }
        else if (templateInfo.Type.toLowerCase() !== this.template.contentTemplateType) {
            var error = new Error("templateInfo is not content template type!");
            console.log(error);
            return "";
        }
        else {
            return path.normalize([appInfo.AppDir, this.template.contentCreateFolder, channelInfo.Id, contentInfo.Id + templateInfo.Extension].join('/'));
        }
    },

    /* *
     * 获取栏目生成路径
     * @param appInfo           应用
     * @param channelInfo       栏目
     * @param templateInfo      模板
     * */
    getChannelFilePath: function (appInfo, channelInfo, templateInfo) {
        if (!appInfo) {
            var error = new Error("appInfo is null!");
            console.log(error);
            return "";
        }
        else if (!channelInfo) {
            var error = new Error("channelInfo is null!");
            console.log(error);
            return "";
        }
        else if (!templateInfo) {
            var error = new Error("templateInfo is null!");
            console.log(error);
            return "";
        }
        else if (templateInfo.Type.toLowerCase() !== this.template.channelTemplateType) {
            var error = new Error("templateInfo is not channel template type!");
            console.log(error);
            return "";
        }
        else {
            return path.normalize([appInfo.AppDir, this.template.channelCreateFolder, channelInfo.Id + templateInfo.Extension].join('/'));
        }
    },

    /* *
     * 获取首页生成路径
     * @param appInfo           应用
     * @param templateInfo      模板
     * */
    getIndexFilePath: function (appInfo, templateInfo) {
        if (!appInfo) {
            var error = new Error("appInfo is null!");
            console.log(error);
            return "";
        }
        else if (!templateInfo) {
            var error = new Error("templateInfo is null!");
            console.log(error);
            return "";
        }
        else if (templateInfo.Type.toLowerCase() !== this.template.indexTemplateType) {
            var error = new Error("templateInfo is not index template type!");
            console.log(error);
            return "";
        }
        else {
            return path.normalize([appInfo.AppDir, this.template.indexCreateFolder, "index" + templateInfo.Extension].join('/'));
        }
    }
};

module.exports = pageUtil;