(function () {
    'use strict';
    angular
        .module('weather-app.home', [])
        .config(HomeConfig);

    HomeConfig.$provider = ['$stateProvider'];
    
    function HomeConfig($stateProvider) {
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'home/home.template.html',
                controller: 'Home as home',
                resolve: {
                    userLocation: function (LocationService, $q) {
                        var location = $q.defer();
                        LocationService.getUserLocation().then(function (loc) {
                            location.resolve(loc);
                        });
                        return location.promise;
                    },
                    countries: function (UtilService, $q) {
                        var countries = $q.defer();
                        UtilService.getISO3166Countries().then(function (list) {
                            countries.resolve(list.data);
                        });
                        return countries.promise;
                    }
                }
            });
    }
})();
