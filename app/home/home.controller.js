(function () {
    'use strict';
    angular
        .module('weather-app.home')
        .controller('Home', Home);
    
    function Home($scope, userLocation, OpenWeatherAPIService, APPCONFIG) {
        var controller = this;
        controller.userLocation = userLocation;
        controller.showInputDialog = (userLocation == null);
        controller.weatherData = null;
        controller.error = null;
        controller.systemOfUnits = APPCONFIG.DEFAULT_UNIT;
        controller.degreeUnit = (controller.systemOfUnits === 'imperial') ? 'F' : 'C';
        controller.postCodeOrCountry = null;
        controller.modalButtons = getModalButtons();

        $scope.$watch('home.systemOfUnits', function (system) {
            var byGeoLocation = controller.userLocation != null;
            requestWeather(byGeoLocation);
        });

        if (!controller.showInputDialog) {
            requestWeather(true);
        }

        function getModalButtons() {
            return [{
                title: 'What the weather is like?',
                classes: 'btn btn-primary',
                click: function () {
                    if (controller.postCodeOrCountry) {
                        $('#user-location-error').hide();
                        controller.showInputDialog = false;
                        requestWeather(false);
                    } else {
                        $('#user-location-error').show();
                    }
                }
            }];
        }

        function requestWeather(byGeoLocation) {
            if (byGeoLocation) {
                requestWeatherByGeoLocation(userLocation.coords.latitude,userLocation.coords.longitude, controller.systemOfUnits)
                    .then(onRequestSuccess, onRequestFail);
            } else if (controller.postCodeOrCountry) {
                requestWeatherByPostcodeOrCountry(controller.postCodeOrCountry)
                    .then(onRequestSuccess, onRequestFail);
            }
        }

        function requestWeatherByPostcodeOrCountry(postcodeOrCountry) {
            return OpenWeatherAPIService.requestWeatherByPostcodeOrCountry(postcodeOrCountry);
        }

        function requestWeatherByGeoLocation(lat, lon, unit) {
            return OpenWeatherAPIService.requestWeatherByGeoLocation(lat, lon, unit);
        }

        function onRequestSuccess(result) {
            controller.weatherData = result.data;
        }

        function onRequestFail(result) {
            controller.error = result.data;
        }
    }
})();
