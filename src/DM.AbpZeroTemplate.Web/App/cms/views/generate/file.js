(function () {
    appModule.controller('cms.views.generate.file', [
        '$scope', '$uibModal', 'appSession', 'abp.services.nodejs', 'abp.services.app.template',
            function ($scope, $uibModal, $appSession, nodejsService, templateService) {
                var vm = this;
                vm.advancedFiltersAreShown = false;
                vm.start = false;
                vm.process = 0;
                vm.selectedFileIds = [];
                vm.searchWords = '';
                vm.interval = null;

                vm.fileTree = {
                    $tree: null,
                    treeDatas: [],

                    getTreeDataFromServer: function (callback) {
                        templateService.getTemplates({ id: $appSession.app.id, type: 'fileTemplate' }).success(function (result) {
                            var treeObj = {};
                            _.map(result.items, function (item) {
                                vm.fileTree.treeDatas.push({
                                    id: item.id,
                                    text: item.title
                                });
                            });

                            callback && callback(vm.fileTree.treeDatas);
                        });
                    },

                    findSelectableNodes: function () {
                        return vm.fileTree.$tree.treeview('search', [vm.searchWords, { ignoreCase: false, exactMatch: false }]);
                    },

                    selectNodes: function () {
                        vm.fileTree.$tree.treeview('selectNode', [vm.fileTree.findSelectableNodes()]);
                    },

                    unSelectNodes: function () {
                        vm.fileTree.$tree.treeview('unselectNode', [vm.fileTree.findSelectableNodes()]);
                    },

                    toggleNodes: function () {
                        vm.fileTree.$tree.treeview('toggleNodeSelected', [vm.fileTree.findSelectableNodes()]);
                    },

                    init: function () {
                        vm.fileTree.getTreeDataFromServer(function (treeData) {
                            vm.fileTree.$tree = $('#treeview-selectable').treeview({
                                data: treeData,
                                multiSelect: true,
                                onNodeSelected: vm.fileTree.onNodeSelected,
                                onNodeUnselected: vm.fileTree.onNodeUnselected
                            })
                        });
                    },

                    onNodeSelected: function (event, node) {
                        if (vm.selectedFileIds.indexOf(node.id) < 0) {
                            vm.selectedFileIds.push(node.id);
                        }
                    },
                    onNodeUnselected: function (event, node) {
                        if (vm.selectedFileIds.indexOf(node.id) >= 0) {
                            vm.selectedFileIds.pop(node.id);
                        }
                    }
                };

                vm.generate = function () {
                    vm.start = true;
                    //调用nodejs提供的服务，生成单页页
                    nodejsService.createServer({ appId: $appSession.app.id, fileIds: vm.selectedFileIds })
                    .success(function (result) {
                        //返回 {totalCountKey，createCountKey}
                        vm.interval = setInterval(vm.getGenerateProgress, 5000, result.totalCountKey, result.createCountKey);
                    });
                }

                vm.getGenerateProgress = function (totalCountKey, createCountKey) {
                    //调用nodejs提供的服务，获取生成进度
                    nodejsService.getGenerateProgressServer({ totalCountKey: totalCountKey, createCountKey: createCountKey })
                    .success(function (result) {
                        if (
                            !result.totalCount ||
                            !result.createCount ||
                            result.createCount >= result.totalCount) {

                            clearInterval(vm.interval);
                            vm.process = 100;

                            setTimeout(function () {
                                vm.start = false;
                            }, 3000);
                        }
                        else {
                            vm.process = result.createCount / result.totalCount;
                        }
                    });
                }

                vm.fileTree.init();
            }
    ]);
})();