(function () {
    appModule.controller('cms.views.contents.createOrEditContentModal', ['$scope', '$uibModalInstance', 'abp.services.app.content', 'content', 'FileUploader',
    function ($scope, $uibModalInstance, contentService, content, fileUploader) {
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
            url: abp.appPath + 'content/UploadContentImage?contentId=' + vm.content.id,
            queueLimit: 1,
            autoUpload: true,
            removeAfterUpload: true,
            filters: [{
                name: 'imageFilter',
                fn: function (item, options) {
                    return filter(item, options, '|jpg|jpeg|png|', 5242880);//1M
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
            url: abp.appPath + 'content/UploadContentVideo?contentId=' + vm.content.id,
            queueLimit: 1,
            autoUpload: true,
            removeAfterUpload: true,
            filters: [{
                name: 'videoFilter',
                fn: function (item, options) {
                    return filter(item, options, '|mp4|', 5242880 * 300);//300M
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
            url: abp.appPath + 'content/UploadContentFile?contentId=' + vm.content.id,
            queueLimit: 1,
            autoUpload: true,
            removeAfterUpload: true,
            filters: [{
                name: 'fileFilter',
                fn: function (item, options) {
                    return filter(item, options, '|txt|doc|xls|pdf|jpg|jpeg|png|mp4|', 5242880 * 300);//300M
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
            if (fileTypes.indexOf(type) === -1) {
                abp.message.warn(app.localize('ProfilePicture_Warn_FileType'));
                return false;
            }

            if (fileSize) {
                //File size check
                if (item.size > fileSize) //1MB
                {
                    abp.message.warn(app.localize('ProfilePicture_Warn_SizeLimit'));
                    return false;
                }
            }

            return true;
        }

    }]);
})();