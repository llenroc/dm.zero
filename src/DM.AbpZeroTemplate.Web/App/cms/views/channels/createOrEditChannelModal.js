(function () {
    appModule.controller('cms.views.channels.createOrEditChannelModal', ['$scope', '$uibModalInstance', 'abp.services.app.channel', 'channel',
    function ($scope, $uibModalInstance, channelService, channel) {
        var vm = this;
        vm.channel = channel;
        vm.channelTemplates = [];
        vm.contentTemplates = [];
        vm.saving = false;

        vm.save = function () {
            if (vm.channel.id) {
                channelService.updateChannel(vm.channel)
                .success(function (result) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close(result);
                });
            }
            else {
                channelService.createChannel(vm.channel)
                .success(function (result) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close(result);
                });
            }
        };

        vm.cancel = function () {
            $uibModalInstance.dismiss();
        };

        //初始化
        function init() {
            channelService.getChannel({ id: vm.channel.id })
            .success(function (result) {
                vm.channel = result;
            });
            channelService.getChannelForEdit()
            .success(function (result) {
                vm.channelTemplates = result.channelTemplates;
                vm.contentTemplates = result.contentTemplates;

            });
        };

        init();
    }]);
})();