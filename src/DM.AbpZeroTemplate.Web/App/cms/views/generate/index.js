(function () {
    appModule.controller('cms.views.generate.webIndex', [
        '$scope', '$uibModal', 'appSession', 'abp.services.nodejs',
            function ($scope, $uibModal, $appSession, nodejsService) {
                var vm = this;
                vm.process = 0;

                var interval;
                //调用nodejs提供的服务，生成首页
                nodejsService.createServer({ appId: $appSession.app.id })
                .success(function (result) {
                    //返回 {totalCountKey，createCountKey}
                    interval = setInterval(getGenerateProgress, 5000, result.totalCountKey, result.createCountKey);
                });

                function getGenerateProgress(totalCountKey, createCountKey) {

                    //调用nodejs提供的服务，获取生成进度
                    nodejsService.getGenerateProgressServer({ totalCountKey: totalCountKey, createCountKey: createCountKey })
                    .success(function (result) {
                        if (
                            !result.totalCount ||
                            !result.createCount ||
                            result.createCount >= result.totalCount) {
                            clearInterval(interval);
                            vm.process = 100;
                        }
                        else {
                            vm.process = result.createCount / result.totalCount;
                        }
                    });
                }
            }
    ]);
})();