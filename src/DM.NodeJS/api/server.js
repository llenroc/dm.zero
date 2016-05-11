var express = require('express');
var router = express.Router();

var createServer = require('../api/createServer');

/*web api */
router.get('/',function (req, res, next) {
    res.end('web api');
});

/*createServer web api */
router.get('/createServer',function (req, res, next) {
    var appId = parseInt(req.queryString['appId']||"0");
    var channelId = parseInt(req.queryString['channelId']||"0");
    var contentId = parseInt(req.queryString['contentId']||"0");
    var fileId = parseInt(req.queryString['fileId']||"0");
    res.end(
        createServer.create(
            req,
            res,
            appId,
            channelId,
            contentId,
            fileId)
        );
});

module.exports = router;