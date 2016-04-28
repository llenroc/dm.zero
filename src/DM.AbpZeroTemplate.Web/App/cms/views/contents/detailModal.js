(function () {
    appModule.controller('cms.views.contents.detailModal', [
        '$scope', '$uibModalInstance', 'content',
        function ($scope, $uibModalInstance, content) {
            var vm = this;

            vm.content = content;

            vm.getExecutionTime = function() {
                return moment(vm.content.executionTime).fromNow() + ' (' + moment(vm.content.executionTime).format('YYYY-MM-DD hh:mm:ss') + ')';
            };

            vm.getDurationAsMs = function() {
                return app.localize('Xms', vm.content.executionDuration);
            };

            vm.getFormattedParameters = function() {
                var json = JSON.parse(vm.content.parameters);
                return JSON.stringify(json, null, 4);
            }

            vm.close = function () {
                $uibModalInstance.dismiss();
            };
        }
    ]);
})();