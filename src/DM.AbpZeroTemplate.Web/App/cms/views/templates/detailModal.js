(function () {
    appModule.controller('cms.views.templates.detailModal', [
        '$scope', '$uibModalInstance', 'template',
        function ($scope, $uibModalInstance, template) {
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

            vm.close = function () {
                $uibModalInstance.dismiss();
            };
        }
    ]);
})();