(function () {
    appModule.controller('cms.views.contents.createOrEditContentModal', ['$scope', '$uibModalInstance', 'abp.services.app.content', 'content',
    function ($scope, $uibModalInstance, contentService, content) {
        var vm = this;
        vm.content = content;
        vm.saving = false;

        vm.save = function () {
            if (vm.content.id) {
                contentService.updateContent(vm.content)
                .success(function (result) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close(result);
                });
            }
            else {
                contentService.createContent(vm.content)
                .success(function (result) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close(result);
                });
            }
        };

        vm.cancel = function () {
            $uibModalInstance.dismiss();
        };
    }]);
})();