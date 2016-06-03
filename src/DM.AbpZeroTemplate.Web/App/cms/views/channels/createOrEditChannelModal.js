(function () {
    appModule.controller('cms.views.channels.createOrEditChannelModal', ['$scope', '$uibModalInstance', 'abp.services.app.channel', 'channel', 'FileUploader', 'appSession',
    function ($scope, $uibModalInstance, channelService, channel, fileUploader, $appSession) {
        var vm = this;
        vm.channel = channel;
        vm.channelTemplates = [];
        vm.contentTemplates = [];
        vm.modelTypes = [];
        vm.linkTypes = [];
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

        vm.imageUploader = new fileUploader({
            url: abp.appPath + 'channel/UploadChannelImage?appId=' + $appSession.app.id + '&channelId=' + vm.channel.id,
            queueLimit: 1,
            autoUpload: true,
            removeAfterUpload: true,
            filters: [{
                name: 'imageFilter',
                fn: function (item, options) {
                    return filter(item, options, '|jpg|jpeg|png|gif|bmp|tiff|tga|', 5242880);
                }
            }]
        });

        vm.imageUploader.onSuccessItem = function (fileItem, response, status, headers) {
            if (response.success) {
                vm.channel.imageUrl = response.result.fileName;
            }
            else {
                abp.message.error(response.error.message);
            }
        }

        //'|jpg|jpeg|png|'
        function filter(item, options, fileTypes, fileSize) {
            fileSize = fileSize || 5242880;

            //File type check
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            if (type.indexOf(type) === -1) {
                abp.message.warn(app.localize('CMS_Warn_FileType', fileTypes));
                return false;
            }

            if (fileSize) {
                //File size check
                if (item.size > fileSize) //1MB
                {
                    abp.message.warn(app.localize('CMS_Warn_SizeLimit', fileSize / 5242880));
                    return false;
                }
            }

            return true;
        }

        //初始化
        function init() {
            if (vm.channel.id) {
                channelService.getChannel({ id: vm.channel.id })
                .success(function (result) {
                    vm.channel = result;

                    if (vm.channel.contentTemplateId == null)
                        vm.channel.contentTemplateId = '';
                    if (vm.channel.channelTemplateId == null)
                        vm.channel.channelTemplateId = '';
                    if (vm.channel.modelType == null)
                        vm.channel.modelType = '';
                    if (vm.channel.linkType == null)
                        vm.channel.linkType = '';
                });
            }
            else {
                vm.channel.contentTemplateId = '';
                vm.channel.channelTemplateId = '';
                vm.channel.modelType = '';
                vm.channel.linkType = '';
            }

            channelService.getChannelForEdit()
            .success(function (result) {
                vm.channelTemplates = result.channelTemplates;
                vm.contentTemplates = result.contentTemplates;
                vm.modelTypes = result.modelTypes;
                vm.linkTypes = result.linkTypes;

                vm.channelTemplates.splice(0, 0, { key: '', value: '<<与父级栏目一致>>' });
                vm.contentTemplates.splice(0, 0, { key: '', value: '<<与父级栏目一致>>' });
                vm.modelTypes.splice(0, 0, { key: '', value: '<<与父级栏目一致>>' });
                vm.linkTypes.splice(0, 0, { key: '', value: '<<与父级栏目一致>>' });

            });
        };

        init();
    }]);
})();