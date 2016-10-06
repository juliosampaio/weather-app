(function () {
    'use strict';
    angular
        .module('weather-app.location')
        .factory('LocationService', LocationService);

    LocationService.$inject = ['$q'];

    function LocationService($q) {
        var service = {
            "getUserLocation": getUserLocation
        };

        /**
         *
         * @returns {}
         */
        function getUserLocation() {
            var location = $q.defer();
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    location.resolve(position);
                }, function () {
                    location.resolve(null);
                });
            } else {
                location.resolve(null);
            }
            return location.promise;
        }

        return service;
    }
})();
