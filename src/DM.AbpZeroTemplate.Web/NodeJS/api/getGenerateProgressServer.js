var cacheManager = require('../libs/utils/cacheManager');

var getGenerateProgressServer = {

    progress: function (totalCountKey, createCountKey) {
        if (totalCountKey.length > 0 && createCountKey.length > 0) {
            var result = {
                totalCount: cacheManager.get(totalCountKey),
                createCount: cacheManager.get(createCountKey)
            };
            return { success: true, result: result };
        }
        return { success: false };
    }
};

module.exports = getGenerateProgressServer;