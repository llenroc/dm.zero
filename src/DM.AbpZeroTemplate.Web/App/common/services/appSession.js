(function () {
    appModule.factory('appSession', [
            function () {

                var _session = {
                    user: null,
                    tenant: null,
                    app:null
                };

                abp.services.app.session.getCurrentLoginInformations({ async: false }).done(function (result) {
                    _session.user = result.user;
                    _session.tenant = result.tenant;
                    _session.app = result.app;
                });

                return _session;
            }
        ]);
})();