(function () {
    appModule.controller('cms.views.generate.content', [
        '$scope', '$uibModal', 'appSession', 'abp.services.nodejs', 'abp.services.app.channel',
            function ($scope, $uibModal, $appSession, nodejsService, channelService) {
                var vm = this;
                vm.advancedFiltersAreShown = false;
                vm.start = false;
                vm.process = 0;
                vm.selectedChannelIds = [];
                vm.searchWords = '';
                vm.interval = null;

                vm.channelTree = {
                    $tree: null,
                    treeDatas: [],

                    getTreeDataFromServer: function (callback) {
                        channelService.getChannelsForTree({ id: $appSession.app.id }).success(function (result) {
                            var treeObj = {};
                            _.map(result.items, function (item) {
                                if (item.parentId) {
                                    if (treeObj[item.parentId]) {
                                        treeObj[item.parentId].push(item);
                                    }
                                    else {
                                        treeObj[item.parentId] = [item];
                                    }
                                }
                                else {
                                    if (treeObj['#']) {
                                        treeObj['#'].push(item);
                                    }
                                    else {
                                        treeObj['#'] = [item];
                                    }
                                }
                            });

                            vm.channelTree.getTreeDatas(null, treeObj, '#');

                            callback && callback(vm.channelTree.treeDatas);
                        });
                    },

                    getTreeDatas: function (parent, obj, key) {

                        for (var n in obj[key]) {
                            //遍历每一个节点
                            n = obj[key][n];
                            var tmp = {
                                id: n.id,
                                parentId: n.parentId,
                                text: n.displayName,
                                tags: [n.code],
                                nodes: []
                            };
                            if (parent) {
                                parent.nodes.push(tmp);
                            }
                            else {
                                vm.channelTree.treeDatas.push(tmp);
                            }

                            //判断此节点还有没有子节点
                            if (obj[n.id]) {
                                vm.channelTree.getTreeDatas(tmp, obj, n.id);
                            }
                        }
                    },

                    findSelectableNodes: function () {
                        return vm.channelTree.$tree.treeview('search', [vm.searchWords, { ignoreCase: false, exactMatch: false }]);
                    },

                    selectNodes: function () {
                        vm.channelTree.$tree.treeview('selectNode', [vm.channelTree.findSelectableNodes()]);
                    },

                    unSelectNodes: function () {
                        vm.channelTree.$tree.treeview('unselectNode', [vm.channelTree.findSelectableNodes()]);
                    },

                    toggleNodes: function () {
                        vm.channelTree.$tree.treeview('toggleNodeSelected', [vm.channelTree.findSelectableNodes()]);
                    },

                    init: function () {
                        vm.channelTree.getTreeDataFromServer(function (treeData) {
                            vm.channelTree.$tree = $('#treeview-selectable').treeview({
                                data: treeData,
                                multiSelect: true,
                                onNodeSelected: vm.channelTree.onNodeSelected,
                                onNodeUnselected: vm.channelTree.onNodeUnselected
                            })
                        });
                    },

                    onNodeSelected: function (event, node) {
                        if (vm.selectedChannelIds.indexOf(node.id) < 0) {
                            vm.selectedChannelIds.push(node.id);
                        }
                    },
                    onNodeUnselected: function (event, node) {
                        if (vm.selectedChannelIds.indexOf(node.id) >= 0) {
                            vm.selectedChannelIds.pop(node.id);
                        }
                    }
                };

                vm.generate = function () {
                    vm.start = true;
                    //调用nodejs提供的服务，生成内容页
                    nodejsService.createServer({ appId: $appSession.app.id, channelIds: vm.selectedChannelIds, isCreateContent: true })
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

                vm.channelTree.init();
            }
    ]);
})();