(function (abp, angular) {

    if (!angular) {
        return;
    }

    var abpModule = angular.module('abp');

    abpModule.factory('abp.services.nodejs', [
        '$http', function ($http) {
            return new function () {
                this.createServer = function (input, httpParams) {
                    return $http(angular.extend({
                        abp: true,
                        url: abp.nodejsPath + 'api/services/nodejs/CreateServer',
                        method: 'GET',
                        params: input
                    }, httpParams));
                };

                this.getGenerateProgressServer = function (input, httpParams) {
                    return $http(angular.extend({
                        abp: true,
                        url: abp.nodejsPath + 'api/services/nodejs/GetGenerateProgressServer',
                        method: 'GET',
                        params: input
                    }, httpParams));
                };

            };
        }
    ]);


})((abp || (abp = {})), (angular || undefined));

(function () {

    var serviceNamespace = abp.utils.createNamespace(abp, 'services.nodejs');

    serviceNamespace.createServer = function (input, ajaxParams) {
        return abp.ajax($.extend({
            url: abp.nodejsPath + 'api/services/nodejs/CreateServer',
            type: 'GET',
            data: input
        }, ajaxParams));
    };

    serviceNamespace.getGenerateProgressServer = function (input, ajaxParams) {
        return abp.ajax($.extend({
            url: abp.nodejsPath + 'api/services/nodejs/GetGenerateProgressServer',
            type: 'GET',
            data: input
        }, ajaxParams));
    };


})();