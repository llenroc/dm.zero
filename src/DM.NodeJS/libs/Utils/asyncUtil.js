var asyncUtil = {};

/* *
 * 异步调用
 * @fn            方法
 * @callback      回调函数
 * */
asyncUtil.async = function(fn, callback, argv){
    if(typeof(fn) !=='function'){
        return fn;
    }
    else{
        setTimeout(function(fn, callback, argv){
            try{
                callback(null, fn(argv));
            }
            catch(err){
                callback(err);
            }
        },0);
    }
};

module.exports = asyncUtil;