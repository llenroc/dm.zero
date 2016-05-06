(function () {
    appModule.controller('cms.views.templates.detailModal', [
        '$scope', '$uibModalInstance', 'template', 'abp.services.app.template',
        function ($scope, $uibModalInstance, template, templateService) {
            var vm = this;

            vm.template = template;

            vm.getTypeText = function () {
                switch (vm.template.type) {
                    case "Index":
                        return app.localize("IndexTemplate");
                    case "Channel":
                        return app.localize("ChannelTemplate");
                    case "Content":
                        return app.localize("ContentTemplate");
                    default:
                        return app.localize("FileTemplate");
                }
            }

            //获取模板的内容
            vm.getTemplateContent = function () {
                if (vm.template.id) {
                    templateService.getTemplateContent({ id: template.id })
                    .success(function (result) {
                        vm.template.templateContent = result;
                    });
                }
            }

            vm.close = function () {
                $uibModalInstance.dismiss();
            };

            vm.getTemplateContent();
        }
    ]);
})();