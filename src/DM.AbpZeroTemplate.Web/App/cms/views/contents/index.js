(function () {
    appModule.controller('cms.views.contents.index', [
        '$scope', '$uibModal', '$q', 'uiGridConstants', 'abp.services.app.channel', 'abp.services.app.content', 'abp.services.app.commonLookup', 'lookupModal', 'appSession', 'abp.services.app.good',
        function ($scope, $uibModal, $q, uiGridConstants, channelService, contentService, commonLookupService, lookupModal, $appSession, goodService) {
            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.defaultModelType = 'Content';

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

            vm.requestParams = {
                id: 0,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                sorting: null
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
                    modelType: vm.defaultModelType,
                    defaultIndex: 0, //默认加载第一个节点的内容
                    set: function (ouInTree) {
                        if (!ouInTree) {
                            vm.channelTree.selectedChannel.id = null;
                            vm.channelTree.selectedChannel.displayName = null;
                            vm.channelTree.selectedChannel.code = null;
                            vm.channelTree.selectedChannel.isIndex = null;
                            vm.channelTree.selectedChannel.modelType = vm.defaultModelType;
                        } else {
                            vm.channelTree.selectedChannel.id = ouInTree.id;
                            vm.channelTree.selectedChannel.displayName = ouInTree.displayName;
                            vm.channelTree.selectedChannel.code = ouInTree.code;
                            if (ouInTree.original) {
                                vm.channelTree.selectedChannel.isIndex = ouInTree.original.isIndex;
                                vm.channelTree.selectedChannel.modelType = ouInTree.original.modelType;
                            }
                        }
                        vm.contents.load();
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
                         ,
                        addContent: {
                            label: app.localize('AddContent'),
                            _disabled: !vm.permissions.createContents,
                            action: function () {
                                vm.contents.addContent();
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
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/cms/views/channels/createOrEditChannelModal.cshtml',
                        controller: 'cms.views.channels.createOrEditChannelModal as vm',
                        backdrop: 'static',
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
                    var itemClass = channel.contentCount > 0 ? ' ou-text-has-contents' : ' ou-text-no-contents';
                    return '<span title="' + channel.code + '" class="ou-text' + itemClass + '" data-ou-id="' + channel.id + '">' + channel.displayName + '(<span class="ou-text-content-count">' + channel.contentCount + '</span>)<i class="fa fa-caret-down text-muted"></i></span>';
                },

                incrementContentCount: function (channelId, incrementAmount) {
                    var treeNode = vm.channelTree.$tree.jstree('get_node', channelId);
                    treeNode.original.memberCount = treeNode.original.memberCount + incrementAmount;
                    vm.channelTree.$tree.jstree('rename_node', treeNode, vm.channelTree.generateTextOnTree(treeNode.original));
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
                                modelType: item.modelType,
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

                        //设置加载栏目内容
                        vm.channelTree.selectedChannel.set(treeData[vm.channelTree.selectedChannel.defaultIndex]);

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

            vm.contents = {

                gridOptions: {
                    enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                    enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                    paginationPageSizes: app.consts.grid.defaultPageSizes,
                    paginationPageSize: app.consts.grid.defaultPageSize,
                    useExternalPagination: true,
                    useExternalSorting: true,
                    appScopeProvider: vm,
                    columnDefs: [
                        {
                            name: app.localize('Actions'),
                            enableSorting: false,
                            width: 100,
                            cellTemplate:
                                '<div class=\"ui-grid-cell-contents\">' +
                                '  <div class="btn-group dropdown" uib-dropdown="">' +
                                '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                                '    <ul uib-dropdown-menu>' +
                                '      <li><a ng-if="grid.appScope.permissions.editContents" ng-click="grid.appScope.contents.editContent(row.entity)">' + app.localize('Edit') + '</a></li>' +
                                '      <li><a ng-if="grid.appScope.permissions.deleteContents" ng-click="grid.appScope.contents.remove(row.entity)" >' + app.localize('Delete') + '</a></li>' +
                                '      <li><a ng-click="grid.appScope.contents.showDetails(row.entity)">' + app.localize('Detail') + '</a></li>' +
                                '    </ul>' +
                                '  </div>' +
                                '</div>'
                        },
                        {
                            name: app.localize('ContentTitle'),
                            field: 'title',
                            cellTemplate:
                                '<div class=\"ui-grid-cell-contents\" title="{{row.entity.channelName}}"> {{COL_FIELD CUSTOM_FILTERS}} &nbsp;</div>',
                            minWidth: 140
                        },
                        {
                            name: app.localize('CreationTime'),
                            field: 'creationTime',
                            cellFilter: 'momentFormat: \'L\'',
                            minWidth: 100
                        }
                    ],
                    onRegisterApi: function (gridApi) {
                        $scope.gridApi = gridApi;
                        $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                            if (!sortColumns.length || !sortColumns[0].field) {
                                vm.requestParams.sorting = null;
                            } else {
                                vm.requestParams.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                            }

                            vm.contents.load();
                        });
                        gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                            vm.requestParams.skipCount = (pageNumber - 1) * pageSize;
                            vm.requestParams.maxResultCount = pageSize;

                            vm.contents.load();
                        });
                    },
                    data: []
                },

                load: function () {
                    if (!vm.channelTree.selectedChannel.id) {
                        vm.contents.gridOptions.totalItems = 0;
                        vm.contents.gridOptions.data = [];
                        return;
                    }

                    if (vm.channelTree.selectedChannel.modelType === "Content" || vm.channelTree.selectedChannel.modelType === '') {
                        contentService.getContents($.extend(vm.requestParams, { id: vm.channelTree.selectedChannel.id })).success(function (result) {
                            vm.contents.gridOptions.totalItems = result.totalCount;
                            vm.contents.gridOptions.data = result.items;
                        });
                    }
                    else if (vm.channelTree.selectedChannel.modelType === "Good") {
                        goodService.getGoods($.extend(vm.requestParams, { id: vm.channelTree.selectedChannel.id })).success(function (result) {
                            vm.contents.gridOptions.totalItems = result.totalCount;
                            vm.contents.gridOptions.data = result.items;
                        });
                    }
                },

                remove: function (content) {
                    var channelId = vm.channelTree.selectedChannel.id;
                    var treeNode = vm.channelTree.$tree.jstree('get_node', channelId)
                    if (!treeNode) {
                        return;
                    }

                    abp.message.confirm(
                        app.localize('RemoveContentFromChannelWarningMessage', content.title, treeNode.original.displayName),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                if (vm.channelTree.selectedChannel.modelType === "Content" || vm.channelTree.selectedChannel.modelType === '') {
                                    contentService.deleteContent({
                                        id: content.id
                                    }).success(function () {
                                        vm.channelTree.incrementContentCount(channelId, -1);
                                        vm.contents.load();
                                    });
                                }
                                else if (vm.channelTree.selectedChannel.modelType === "Good") {
                                    goodService.deleteGood({
                                        id: content.id
                                    }).success(function () {
                                        vm.channelTree.incrementContentCount(channelId, -1);
                                        vm.contents.load();
                                    });
                                }
                            }
                        }
                    );
                },

                addContent: function (content) {
                    var channelId = vm.channelTree.selectedChannel.id;
                    if (!channelId) {
                        return;
                    }
                    vm.contents.openCreateOrEditContentModal({
                        appId: $appSession.app.id,
                        channelId: channelId
                    }, function (newContent) {
                        vm.channelTree.incrementContentCount(channelId, 1);
                        vm.contents.load();
                    });
                },

                editContent: function (content) {
                    var channelId = vm.channelTree.selectedChannel.id;
                    if (!channelId) {
                        return;
                    }
                    vm.contents.openCreateOrEditContentModal(content, function (newContent) {
                        vm.channelTree.incrementContentCount(channelId, 1);
                        vm.contents.load();
                    });
                },

                openCreateOrEditContentModal: function (content, closeCallback) {
                    var modalInstance = null;

                    if (!vm.channelTree.selectedChannel.modelType) {
                        vm.channelTree.selectedChannel.modelType = vm.defaultModelType;
                    }

                    //根据栏目类型，判断需要打开的编辑页面
                    if (vm.channelTree.selectedChannel.modelType === 'Content' || vm.channelTree.selectedChannel.modelType === '') {
                        modalInstance = $uibModal.open({
                            templateUrl: '~/App/cms/views/contents/createOrEditContentModal.cshtml',
                            controller: 'cms.views.contents.createOrEditContentModal as vm',
                            backdrop: 'static',
                            size: "lg",
                            resolve: {
                                content: function () {
                                    return content;
                                }
                            }
                        });
                    }
                    else if (vm.channelTree.selectedChannel.modelType === 'Good') {
                        modalInstance = $uibModal.open({
                            templateUrl: '~/App/cms/views/contents/createOrEditGoodModal.cshtml',
                            controller: 'cms.views.contents.createOrEditGoodModal as vm',
                            backdrop: 'static',
                            size: "lg",
                            resolve: {
                                good: function () {
                                    return content;
                                }
                            }
                        });
                    }


                    if (modalInstance) {
                        modalInstance.result.then(function (result) {
                            closeCallback && closeCallback(result);
                        });
                    }
                },

                init: function () {
                    if (!vm.permissions.manageContents) {
                        vm.contents.gridOptions.columnDefs.shift();
                    }
                },

                showDetails: function (content) {
                    $uibModal.open({
                        templateUrl: '~/App/cms/views/contents/detailModal.cshtml',
                        controller: 'cms.views.contents.detailModal as vm',
                        backdrop: 'static',
                        resolve: {
                            content: function () {
                                return content;
                            }
                        }
                    });
                }
            }

            vm.contents.init();
            vm.channelTree.init();
        }
    ]);
})();