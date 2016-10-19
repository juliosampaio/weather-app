(function () {
    'use strict';
    angular.module('weather-app', [
        'ui.router',
        'weather-app.home',
        'weather-app.location',
        'weather-app.openweather',
        'weather-app.widgets',
        'weather-app.util'
    ])
    .filter('round', function () {
        return function (value) {
            var number = parseFloat(value);
            return isNaN(number) ? value : Math.round(number);
        }
    })
    .config(function($urlRouterProvider, $provide) {
        $urlRouterProvider.otherwise('/home');
        $provide.value('APPCONFIG', {
            DEFAULT_UNIT: 'imperial'
        });
    })
    .run(function ($rootScope) {
        $rootScope.$on('$viewContentLoaded', function (event) {
            $.material.radio();
            $.material.ripples();
        });
    });
})();
