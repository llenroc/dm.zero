var express = require('express');
var router = express.Router();
var domain = require('domain');

var createServer = require('./createServer');

var dm = domain.create();

/*web api */
router.get('/', function (req, res, next) {
    res.end('web api');
});

/*createServer web api */
router.get('/createServer', function (req, res, next) {

    dm.on('error', function (err) {

        //返回错误信息
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });

    dm.run(function () {
        var appId = parseInt(req.query['appId'] || "0");
        var channelId = parseInt(req.query['channelId'] || "0");
        var contentId = parseInt(req.query['contentId'] || "0");
        var fileId = parseInt(req.query['fileId'] || "0");

        createServer.create(
            req,
            res,
            appId,
            channelId,
            contentId,
            fileId,
            function (err, data) {
                if (err) {
                    throw err;
                }
                else {
                    //可以获取缓存id，得到执行情况
                    console.log(data.totalCountKey);
                }
                res.end();
            })
    });

});

module.exports = router;