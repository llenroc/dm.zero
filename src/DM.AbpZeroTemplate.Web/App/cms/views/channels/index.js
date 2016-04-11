(function () {
    appModule.controller('cms.views.channels.index', ['$scope', '$uibModal', '$q', 'uiGridConstants', 'abp.services.app.channel', 'abp.services.app.commonLookup', 'lookupModal',
    function ($scope, $uiModal, $q, uiGridConstants, channelService, commonLookupService, lookupModal) {
        var vm = this;

        $scope.$on('$viewContentLoaded', function () {
            App.initAjax();
        });

        vm.permissions = {
            manageChannelTree: abp.auth.hasPermission('Pages.Administration.Channel.ManageChannelTree')
        };

        vm.channelTree = {
            $tree: null,
            channelCount: 0,

            setChannelCount: function (channelCount) {
                $scope.safeApply(function () {
                    vm.channelTree.channelCount = channelCount;
                });
            },

            refreshChannelCount: function () {
                vm.channelTree.setChannelCount(vm.channelTree.$tree.jstree('get_json').length)
            },

            selectedOu: {
                id: null,
                displayName: null,
                code: null,

                set: function (ouInTree) {
                    if (!ouInTree) {
                        vm.channelTree.selectedOu.id = null;
                        vm.channelTree.selectedOu.displayName = null;
                        vm.channelTree.selectedOu.code = null;
                    } else {
                        vm.channelTree.selectedOu.id = ouInTree.id;
                        vm.channelTree.selectedOu.displayName = ouInTree.displayName;
                        vm.channelTree.selectedOu.code = ouInTree.code;
                    }
                    vm.members.load();
                },

                contextMenu: function (node) {
                    var items = {
                        editChannel: {
                            label: app.localize('Edit'),
                            _disabled: !vm.permissions.manageChannelTree,
                            action: function (data) {
                                var instance = $jstree.reference(data.reference);

                                vm.channelTree.openCreateOrEditChannelModal(
                                    {
                                        id: node.id,
                                        displayName: node.channel.displayName
                                    },
                                    function (updatedOu) {
                                        node.channel.displayName = updatedOu.displayName;
                                        instance.rename_node(node, vm.channelTree.generateTextOnTree(updatedOu));
                                    });
                            }
                        }
                        ,
                        addSubChannel: {
                            lable: app.localize('AddSubChannel'),
                            _disabled: !vm.permissions.manageChannelTree,
                            action: function () {
                                vm.channelTree.addChannel(node.id);
                            }
                        }
                        ,
                        'delete': {
                            lable: app.localize('Delete'),
                            _disabled: !vm.permissions.manageChannelTree,
                            action: function (data) {
                                var instance = $.jstree.reference(data.reference);

                                abp.message.confirm(
                                    app.localize('ChannelDeleteWarningMessage',
                                    node.channel.displayName),
                                    function (isConfirmed) {
                                        if (isConfirmed) {
                                            channelService.deleteChannel({
                                                id: node.id
                                            }).success(function () {
                                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                                                instance.delete_node(node);
                                                vm.channelTree.refreshChannelCount();
                                            });
                                        }
                                    });
                            }
                        }
                    }
                }
            }
        };
    }]);
})();