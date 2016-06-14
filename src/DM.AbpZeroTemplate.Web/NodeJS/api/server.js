var express = require('express');
var router = express.Router();
var domain = require('domain');
var path = require('path');

var translateUtil = require('../libs/utils/translateUtil');

var config = require('../conf/config.json');
var apiConfig = config && config.api;


var createServer = require(['./', apiConfig.createServer].join(''));
var getGenerateProgressServer = require(['./', apiConfig.getGenerateProgressServer].join(''));

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
        var isCreateContent = translateUtil.toBool(req.query['isCreateContent']);

        createServer.create(
            req,
            res,
            appId,
            channelIds,
            contentIds,
            fileIds,
            isCreateContent,
            function (err, data) {
                if (err) {
                    throw err;
                }
                else {
                    //可以获取缓存id，得到执行情况
                    res.status(200);
                    res.write(JSON.stringify(data));
                }
                res.end();
            })
    });

});

router.get(['/', apiConfig.getGenerateProgressServer].join(''), function (req, res, next) {
    var totalCountKey = req.query['totalCountKey'] || "";
    var createCountKey = req.query['createCountKey'] || "";
    var result = getGenerateProgressServer.progress(totalCountKey, createCountKey);
    res.status(200);
    res.write(JSON.stringify(result));
    res.end();
});

module.exports = router;