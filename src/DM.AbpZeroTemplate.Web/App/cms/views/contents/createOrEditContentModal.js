(function () {
    appModule.controller('cms.views.contents.createOrEditContentModal', ['$scope', '$uibModalInstance', 'abp.services.app.content', 'content', 'FileUploader', 'appSession',
    function ($scope, $uibModalInstance, contentService, content, fileUploader, $appSession) {
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

        vm.imageUploader = new fileUploader({
            url: abp.appPath + 'content/UploadContentImage?appId=' + $appSession.app.id + '&contentId=' + vm.content.id,
            queueLimit: 1,
            autoUpload: true,
            removeAfterUpload: true,
            filters: [{
                name: 'imageFilter',
                fn: function (item, options) {
                    return filter(item, options, '|jpg|jpeg|png|gif|bmp|tiff|tga|', 5242880);//1M
                }
            }]
        });

        vm.imageUploader.onSuccessItem = function (fileItem, response, status, headers) {
            if (response.success) {
                vm.content.imageUrl = response.result.fileName;
            }
            else {
                abp.message.error(response.error.message);
            }
        }

        vm.videoUploader = new fileUploader({
            url: abp.appPath + 'content/UploadContentVideo?appId=' + $appSession.app.id + '&contentId=' + vm.content.id,
            queueLimit: 1,
            autoUpload: true,
            removeAfterUpload: true,
            filters: [{
                name: 'videoFilter',
                fn: function (item, options) {
                    return filter(item, options, '|avi|rmvb|rm|asf|wmv|mov|3gp|ram|mkv|divx|mpg|mpeg|mpe|', 5242880 * 300);//300M
                }
            }]
        });

        vm.videoUploader.onSuccessItem = function (fileItem, response, status, headers) {
            if (response.success) {
                vm.content.videoUrl = response.result.fileName;
            }
            else {
                abp.message.error(response.error.message);
            }
        }

        vm.fileUploader = new fileUploader({
            url: abp.appPath + 'content/UploadContentFile?appId=' + $appSession.app.id + '&contentId=' + vm.content.id,
            queueLimit: 1,
            autoUpload: true,
            removeAfterUpload: true,
            filters: [{
                name: 'fileFilter',
                fn: function (item, options) {
                    return filter(item, options, '|txt|rtf|doc|log|zip|rar|gzip|iso|pdf|jpg|jpeg|png|gif|bmp|tiff|tga|avi|rmvb|rm|asf|wmv|mov|3gp|ram|mkv|divx|mpg|mpeg|mpe|', 5242880 * 300);//300M
                }
            }]
        });

        vm.fileUploader.onSuccessItem = function (fileItem, response, status, headers) {
            if (response.success) {
                vm.content.fileUrl = response.result.fileName;
            }
            else {
                abp.message.error(response.error.message);
            }
        }

        //'|jpg|jpeg|png|'
        function filter(item, options, fileTypes, fileSize) {

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

        function init() {
            if (vm.content.id) {
                contentService.getContent({ id: vm.content.id })
                .success(function (result) {
                    vm.content = result;
                });
            }
        }

        init();
    }]);
})();