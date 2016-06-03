(function () {
    appModule.controller('cms.views.channels.index', [
        '$scope', '$uibModal', '$q', 'uiGridConstants', 'abp.services.app.channel', 'abp.services.app.commonLookup', 'lookupModal', 'appSession',
    function ($scope, $uiModal, $q, uiGridConstants, channelService, commonLookupService, lookupModal, $appSession) {
        var vm = this;

        $scope.$on('$viewContentLoaded', function () {
            App.initAjax();
        });

        vm.permissions = {
            manageChannelTree: abp.auth.hasPermission('Pages.CMS.Channels'),
            createChannelTree: abp.auth.hasPermission('Pages.CMS.Channels.Create'),
            editChannelTree: abp.auth.hasPermission('Pages.CMS.Channels.Edit'),
            deleteChannelTree: abp.auth.hasPermission('Pages.CMS.Channels.Delete'),

            manageContents: abp.auth.hasPermission('Pages.CMS.Contents'),
            createContents: abp.auth.hasPermission('Pages.CMS.Contents.Create'),
            editContents: abp.auth.hasPermission('Pages.CMS.Contents.Edit'),
            deleteContents: abp.auth.hasPermission('Pages.CMS.Contents.Delete')
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

            selectedChannel: {
                id: null,
                displayName: null,
                code: null,
                isIndex: null,

                set: function (ouInTree) {
                    if (!ouInTree) {
                        vm.channelTree.selectedChannel.id = null;
                        vm.channelTree.selectedChannel.displayName = null;
                        vm.channelTree.selectedChannel.code = null;
                        vm.channelTree.selectedChannel.isIndex = null;
                    } else {
                        vm.channelTree.selectedChannel.id = ouInTree.id;
                        vm.channelTree.selectedChannel.displayName = ouInTree.displayName;
                        vm.channelTree.selectedChannel.code = ouInTree.code;
                        vm.channelTree.selectedChannel.isIndex = ouInTree.isIndex;
                    }
                    // vm.members.load();
                }
            },

            contextMenu: function (node) {
                var items = {
                    editChannel: {
                        label: app.localize('Edit'),
                        _disabled: !vm.permissions.editChannelTree,
                        action: function (data) {
                            var instance = $.jstree.reference(data.reference);

                            vm.channelTree.openCreateOrEditChannelModal(
                                {
                                    id: node.id,
                                    displayName: node.original.displayName
                                },
                                function (updatedChannel) {
                                    node.original.displayName = updatedChannel.displayName;
                                    instance.rename_node(node, vm.channelTree.generateTextOnTree(updatedChannel));
                                });
                        }
                    }
                    ,
                    addSubChannel: {
                        label: app.localize('Add'),
                        _disabled: !vm.permissions.createChannelTree,
                        action: function () {
                            vm.channelTree.addChannel(node.id);
                        }
                    }
                    ,
                    'delete': {
                        label: app.localize('Delete'),
                        _disabled: !vm.permissions.deleteChannelTree || node.original.isIndex,
                        action: function (data) {
                            var instance = $.jstree.reference(data.reference);

                            abp.message.confirm(
                                app.localize('ChannelDeleteWarningMessage',
                                node.original.displayName),
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

                return items;
            },

            addChannel: function (parentId) {
                var instance = $.jstree.reference(vm.channelTree.$tree);

                vm.channelTree.openCreateOrEditChannelModal({
                    parentId: parentId
                }, function (newChannel) {
                    instance.create_node(
                        parentId ? instance.get_node(parentId) : '#',
                        {
                            id: newChannel.id,
                            parent: newChannel.parentId ? newChannel.parentId : '#',
                            code: newChannel.code,
                            contentCount: newChannel.contentCount,
                            displayName: newChannel.displayName,
                            text: vm.channelTree.generateTextOnTree(newChannel),
                            state: {
                                opened: true
                            }
                        });
                    vm.channelTree.refreshChannelCount();
                });
            },

            openCreateOrEditChannelModal: function (channel, closeCallback) {
                var modalInstance = $uiModal.open({
                    templateUrl: '~/App/cms/views/channels/createOrEditChannelModal.cshtml',
                    controller: 'cms.views.channels.createOrEditChannelModal as vm',
                    backdrop: 'static',
                    size: "lg",
                    resolve: {
                        channel: function () {
                            return channel;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    closeCallback && closeCallback(result);
                });
            },

            generateTextOnTree: function (channel) {
                var itemClass = channel.contentCount > 0 ? ' ou-text-has-members' : ' ou-text-no-members';
                return '<span title="' + channel.code + '" class="ou-text' + itemClass + '" data-ou-id="' + channel.id + '">' + channel.displayName + '(<span class="ou-text-member-count">' + channel.contentCount + '</span>)<i class="fa fa-caret-down text-muted"></i></span>';
            },

            getTreeDataFromServer: function (callback) {
                channelService.getChannels({ id: $appSession.app.id }).success(function (result) {
                    var treeData = _.map(result.items, function (item) {
                        return {
                            id: item.id,
                            parent: item.parentId ? item.parentId : '#',
                            code: item.code,
                            displayName: item.displayName,
                            contentCount: item.contentCount,
                            isIndex: item.isIndex,
                            text: vm.channelTree.generateTextOnTree(item),
                            state: {
                                opened: true
                            }
                        };
                    });

                    callback && callback(treeData);
                });
            },

            init: function () {
                vm.channelTree.getTreeDataFromServer(function (treeData) {
                    vm.channelTree.setChannelCount(treeData.length);
                    vm.channelTree.$tree = $('#ChannelEditTree');

                    var jsTreePlugins = [
                            'types',
                            'contextmenu',
                            'wholerow',
                            'sort'
                    ];

                    if (vm.permissions.manageChannelTree) {
                        jsTreePlugins.push('dnd');
                    }

                    vm.channelTree.$tree
                    .on('changed.jstree', function (e, data) {
                        $scope.safeApply(function () {
                            if (data.selected.length != 1) {
                                vm.channelTree.selectedChannel.set(null);
                            }
                            else {
                                var selectedChannel = data.instance.get_node(data.selected[0]);
                                vm.channelTree.selectedChannel.set(selectedChannel);
                            }
                        })
                    })
                    .on('move_node.jstree', function (e, data) {
                        if (!vm.permissions.manageChannelTree) {
                            vm.channelTree.$tree.jstree('refresh');//刷新
                            return;
                        }
                        var parentChannelName = (!data.parent || data.parent == '#')
                            ? app.localize('Root')
                            : vm.channelTree.$tree.jstree('get_node', data.parent).channel.displayName;

                        abp.message.confirm(app.localize('ChannelMoveConfirmMessage', data.node.original.displayName, parentChannelName),
                            function (isConfirmed) {
                                if (isConfirmed) {
                                    channelService.moveChannel({
                                        id: data.node.id,
                                        newParentId: data.parent
                                    }).success(function () {
                                        abp.notify.success(app.localize('SuccessfullyMoved'));
                                        vm.channelTree.reload();
                                    }).catch(function (err) {
                                        vm.channelTree.$tree.jstree('refresh');
                                        setTimeout(function () { abp.message.error(err.data.message); }, 500);
                                    });
                                }
                                else {
                                    vm.channelTree.$tree.jstree('refresh');
                                }
                            });
                    })
                        .jstree({
                            'core': {
                                data: treeData,
                                multilpe: false,
                                check_callback: function (operation, node, node_parent, node_position, more) {
                                    return true;
                                }
                            },
                            types: {
                                "default": {
                                    "icon": "fa fa-folder tree-item-icon-color icon-lg"
                                },
                                "file": {
                                    "icon": "fa fa-file tree-item-icon-color icon-lg"
                                }
                            },
                            contextmenu: {
                                items: vm.channelTree.contextMenu
                            },
                            sort: function (node1, node2) {
                                if (this.get_node(node2).original.displayName < this.get_node(node1).original.displayName) {
                                    return 1;
                                }
                                return -1;
                            },
                            plugins: jsTreePlugins
                        });

                    vm.channelTree.$tree.on('click', '.ou-text .fa-caret-down', function (e) {
                        e.preventDefault();

                        var channelId = $(this).closest('.ou-text').attr('data-ou-id');
                        setTimeout(function () {
                            vm.channelTree.$tree.jstree('show_contextmenu', channelId);
                        }, 100);
                    });
                });
            },

            reload: function () {
                vm.channelTree.getTreeDataFromServer(function (treeData) {
                    vm.channelTree.setChannelCount(treeData.length);
                    vm.channelTree.$tree.jstree(true).settings.core.data = treeData;
                    vm.channelTree.$tree.jstree('refresh');
                });
            }
        };

        vm.channelTree.init();
    }
    ]);
})();