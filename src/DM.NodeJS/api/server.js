var express = require('express');
var router = express.Router();
var domain = require('domain');
var path = require('path');

var translateUtil = require('../libs/utils/translateUtil');

var config = require('../conf/config.json');
var apiConfig = config && config.api;


var createServer = require(['./', apiConfig.createServer].join(''));
var testServer = require('./testServer');

var dm = domain.create();

/*web api */
router.get('/', function (req, res, next) {
    res.end('web api');
});

/*createServer web api */
router.get(['/', apiConfig.createServer].join(''), function (req, res, next) {

    dm.on('error', function (err) {

        //返回错误信息
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });

    dm.run(function () {
        var appId = parseInt(req.query['appId']) || "0";
        var channelIds = translateUtil.convertStringToArray(req.query['channelIds']) || [];
        var contentIds = translateUtil.convertStringToArray(req.query['contentIds']) || [];
        var fileIds = translateUtil.convertStringToArray(req.query['fileIds']) || [];

        createServer.create(
            req,
            res,
            appId,
            channelIds,
            contentIds,
            fileIds,
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

router.get('/test',function(req, res, next){
    var appId = parseInt(req.query['appId']) || "0";
    var channelId = parseInt(req.query['channelId']) || "0";
    testServer.test(appId,channelId);
});

module.exports = router;