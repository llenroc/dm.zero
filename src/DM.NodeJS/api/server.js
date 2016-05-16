var express = require('express');
var router = express.Router();

var createServer = require('./createServer');

/*web api */
router.get('/',function (req, res, next) {
    res.end('web api');
});

/*createServer web api */
router.get('/createServer',function (req, res, next) {
    var appId = parseInt(req.query['appId']||"0");
    var channelId = parseInt(req.query['channelId']||"0");
    var contentId = parseInt(req.query['contentId']||"0");
    var fileId = parseInt(req.query['fileId']||"0");
    
    createServer.create(
            req,
            res,
            appId,
            channelId,
            contentId,
            fileId,
            function(err, data){
                if(err){
                    console.log(err.message);
                }
                else{
                    //可以获取缓存id，得到执行情况
                    console.log(data.totalCountKey);
                }
                res.end();
            })

});

module.exports = router;