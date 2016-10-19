(function () {
    'use strict';
    angular
        .module('weather-app.util')
        .factory('UtilService', UtilService);

    function UtilService($http) {
        var service = {
            getISO3166Countries: getISO3166Countries
        };

        /**
         * Returns an array of countries based on the ISO-3166 standard for Geographic codes
         * @returns {*}
         */
        function getISO3166Countries() {
            return $http.get('countries/ISO3166.json');
        }

        return service;
    }
})();
