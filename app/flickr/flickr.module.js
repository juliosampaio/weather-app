(function () {
    'use strict';
    angular
        .module('weather-app.flickr', [])
        .config(FlickrConfig);

    function FlickrConfig($provide) {

        $provide.value('FLICKR_CONFIG', {
            KEY: '7e1aca26dbc0600a45cd08d90f6884b8',
            SECRET: '044eabce302625fd',
            API_URL_REST: 'https://api.flickr.com/services/rest/?'
        })
    }
})();
