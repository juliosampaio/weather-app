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
                    }
                }
            });
    }
})();
