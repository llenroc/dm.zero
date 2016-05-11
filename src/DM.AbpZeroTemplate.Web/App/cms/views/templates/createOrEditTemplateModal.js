(function () {
    appModule.controller('cms.views.templates.createOrEditTemplateModal', ['$scope', '$uibModalInstance', 'abp.services.app.template', 'template',
    function ($scope, $uibModalInstance, templateService, template) {
        var vm = this;
        vm.template = template;
        vm.saving = false;

        //获取模板的内容
        if (vm.template.id) {
            templateService.getTemplateContent({ id: template.id })
            .success(function (result) {
                vm.template.templateContent = result;
            });
        }

        vm.save = function () {
            if (vm.template.id) {
                templateService.updateTemplate(vm.template)
                .success(function (result) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close(result);
                });
            }
            else {
                templateService.createTemplate(vm.template)
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