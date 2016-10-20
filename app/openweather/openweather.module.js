(function () {
    'use strict';
    angular
        .module('weather-app.openweather', [])
        .config(OpenWeatherConfig);

    function OpenWeatherConfig($provide) {

        $provide.value('OPEN_WEATHER_CONFIG', {
            'BASE_URL': 'http://api.openweathermap.org/data/',
            'VERSION': 2.5,
            'API_KEY': '86233891fdf9169b3a4594d92b375ea1'
        });
    }
})();
