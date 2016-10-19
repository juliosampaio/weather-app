(function () {
    'use strict';
    angular
        .module('weather-app.openweather')
        .factory('OpenWeatherAPIService', OpenWeatherAPIService);

    function OpenWeatherAPIService($q, $http, OPEN_WEATHER_CONFIG) {
        var service = {
            requestWeatherByGeoLocation: requestWeatherByGeoLocation,
            requestWeatherByPostcode: requestWeatherByPostcode
        };

        function requestWeatherByPostcode(userLocation, unit) {
            var params = [];
            params.push(['zip', userLocation.postcode+','+userLocation.country['alpha-2']]);
            params.push(['units', unit]);
            return requestWeather(params);
        }

        function requestWeatherByGeoLocation(lat, lon, unit) {
            var params = [];
            params.push(['lat',lat]);
            params.push(['lon',lon]);
            params.push(['units', unit]);
            return requestWeather(params);
        }

        function requestWeather(params) {
            params.push(['apikey', OPEN_WEATHER_CONFIG.API_KEY]);
            var requestParams = [];
            for (var i = 0; i < params.length; i++) {
                requestParams.push(encodeURI(params[i].join('=')));
            }
            requestParams = requestParams.join('&');
            var url = OPEN_WEATHER_CONFIG.BASE_URL + OPEN_WEATHER_CONFIG.VERSION + '/weather?' + requestParams;
            return $http.get(url);
        }

        return service;
    }
})();
