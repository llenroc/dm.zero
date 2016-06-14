var translateUtil = {

    /**
     * 字符串转换为数组
     * @param str      字符串
     * @param splitStr 分隔符
     */
    convertStringToArray: function (str, splitStr) {
        if (!str) {
            return [];
        }
        if(typeof(str) !=='string'){
            return str;
        }
        if (!splitStr) {
            splitStr = ',';
        }
        return str.split(splitStr)
    },

    /**
    * 对象数组转换为字符串 [1，2，3] => '1,2,3'
    * @param objs      对象数组
    */
    ObjectCollectionToSqlInStringWithoutQuote: function (objs) {
        if (!objs) {
            return '';
        }
        return objs.join(',');
    },

    /**
    * 对象数组转换为字符串 [1，2，3] => '\'1\',\'2\',\'3\''
    * @param objs      对象数组
    */
    ObjectCollectionToSqlInStringWithQuote: function (objs) {
        if (!objs) {
            return '';
        }
        return '\'' + objs.join('\',\'') + '\'';
    },
    
    toBool:function (str) {
        if(!str)return false;
        if(str === 'true') return true;
        else return false;
    }
};

module.exports = translateUtil;