(function () {

    appModule.controller('cms.views.templates.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.template', 'appSession',
        function ($scope, $uibModal, uiGridConstants, templateService, $appSession) {
            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;

            vm.permissions = {
                manageTemplates: abp.auth.hasPermission('Pages.CMS.Templates'),
                createTemplates: abp.auth.hasPermission('Pages.CMS.Templates.Create'),
                editTemplates: abp.auth.hasPermission('Pages.CMS.Templates.Edit'),
                deleteTemplates: abp.auth.hasPermission('Pages.CMS.Templates.Delete')
            };

            vm.requestParams = {
                id: $appSession.app.id,
                type: '',
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
                        width: 150,
                        headerCellTemplate: '<span></span>',
                        cellTemplate:
                                '<div class=\"ui-grid-cell-contents\">' +
                                '  <div class="btn-group dropdown" uib-dropdown="">' +
                                '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                                '    <ul uib-dropdown-menu>' +
                                '      <li><a ng-if="grid.appScope.permissions.editTemplates" ng-click="grid.appScope.editTemplate(row.entity)">' + app.localize('Edit') + '</a></li>' +
                                '      <li><a ng-if="grid.appScope.permissions.deleteTemplates" ng-click="grid.appScope.remove(row.entity)" >' + app.localize('Delete') + '</a></li>' +
                                '      <li><a ng-click="grid.appScope.showDetails(row.entity)">' + app.localize('Detail') + '</a></li>' +
                                '    </ul>' +
                                '  </div>' +
                                '</div>'
                    }
                    ,
                    {
                        name: app.localize('TemplateTitle'),
                        field: 'title',
                        cellTemplate:
                                '<div class=\"ui-grid-cell-contents\" title="{{row.entity.title}}"> {{COL_FIELD CUSTOM_FILTERS}} &nbsp;</div>',
                        width: 150
                    }
                    ,
                    {
                        name: app.localize('TemplateName'),
                        minwidth: 150,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                              ' {{row.entity.name}}' + '{{row.entity.extension}}' +
                             '</div>'
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

            vm.remove = function (template) {
                abp.message.confirm(
                    app.localize('RemoveTemplateWarningMessage', template.title),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            templateService.deleteTemplate({
                                id: template.id
                            }).success(function () {
                                vm.getTemplates();
                            });
                        }
                    });
            };

            vm.editTemplate = function (template) {
                vm.openCreateOrEditTemplateModal($.extend({ appId: $appSession.app.id }, template), function (newTemplate) {
                    vm.getTemplates();
                })
            };

            vm.addTemplate = function (template) {
                vm.openCreateOrEditTemplateModal($.extend({ appId: $appSession.app.id }, template), function (newTemplate) {
                    vm.gridOptions.totalItems++;
                    vm.gridOptions.data.push(newTemplate);
                })
            };

            vm.openCreateOrEditTemplateModal = function (template, closeCallback) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/cms/views/templates/createOrEditTemplateModal.cshtml',
                    controller: 'cms.views.templates.createOrEditTemplateModal as vm',
                    backdrop: 'static',
                    size: "lg",
                    resolve: {
                        template: function () {
                            return template;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    closeCallback && closeCallback(result);
                });
            };

            vm.getTemplates();
        }
    ]);
})();