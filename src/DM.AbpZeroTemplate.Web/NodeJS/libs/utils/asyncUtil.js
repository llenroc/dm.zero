var asyncUtil = {};

/* *
 * 异步调用
 * @fn            方法
 * @callback      回调函数
 * */
asyncUtil.async = function(){
    var fn = arguments[0];
    var callback = arguments[1];
    var args = arguments;
    if(typeof(fn) !=='function'){
        return fn;
    }
    else{
        setTimeout(function(){
            try{
                callback(null, fn.apply(this, Array.from(args).slice(2)));
            }
            catch(err){
                callback(err);
            }
        },0);
    }
};

module.exports = asyncUtil;