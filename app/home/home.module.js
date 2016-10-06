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
                templateUrl: 'home/home.html',
                controller: 'Home as home'
            });
    }
})();
