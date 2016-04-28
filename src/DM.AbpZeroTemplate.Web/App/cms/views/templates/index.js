(function () {

    appModule.controller('cms.views.templates.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.template', 'appSession',
        function ($scope, $uibModal, uiGridConstants, templateService, $appSession) {
            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;

            vm.requestParams = {
                id: $appSession.app.id,
                templateType: '',
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                sorting: null
            };

            vm.gridOptions = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: app.consts.grid.defaultPageSize,
                useExternalPagination: true,
                useExternalSorting: true,
                appScopeProvider: vm,
                columnDefs: [
                    {
                        name: 'Actions',
                        enableSorting: false,
                        width: 50,
                        headerCellTemplate: '<span></span>',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents text-center\">' +
                                '  <button class="btn btn-default btn-xs" ng-click="grid.appScope.showDetails(row.entity)"><i class="fa fa-search"></i></button>' +
                                '</div>'
                    },
                    {
                        name: app.localize('Title'),
                        field: 'title',
                        cellTemplate:
                                '<div class=\"ui-grid-cell-contents\" title="{{row.entity.title}}"> {{COL_FIELD CUSTOM_FILTERS}} &nbsp;</div>',
                        minWidth: 150
                    }
                    //,
                    //{
                    //    name: app.localize('Name'),
                    //    width: 150,
                    //    cellTemplate:
                    //        '<div class=\"ui-grid-cell-contents\">' +
                    //          ' {{row.entity.name}}' + '{{row.entity.extension}}' +
                    //         '</div>'
                    //}
                ],
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            vm.requestParams.sorting = null;
                        } else {
                            vm.requestParams.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                        }

                        vm.getTemplates();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.requestParams.skipCount = (pageNumber - 1) * pageSize;
                        vm.requestParams.maxResultCount = pageSize;

                        vm.getTemplates();
                    });
                },
                data: []
            };

            vm.getTemplates = function () {
                vm.loading = true;
                templateService.getTemplates($.extend({}, vm.requestParams))
                    .success(function (result) {
                        vm.gridOptions.totalItems = result.totalCount;
                        vm.gridOptions.data = result.items;
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            vm.exportToExcel = function () {
                templateService.getTemplatesToExcel(vm.requestParams)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    });
            };

            vm.showDetails = function (template) {
                $uibModal.open({
                    templateUrl: '~/App/cms/views/templates/detailModal.cshtml',
                    controller: 'cms.views.templates.detailModal as vm',
                    backdrop: 'static',
                    resolve: {
                        template: function () {
                            return template;
                        }
                    }
                });
            };

            vm.getTemplates();
        }
    ]);
})();