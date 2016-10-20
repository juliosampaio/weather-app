(function () {
    'use strict';
    angular
        .module('weather-app.home')
        .controller('Home', Home);
    
    function Home($scope, userLocation, OpenWeatherAPIService, APPCONFIG, countries, FlickrAPIService) {
        var controller = this;
        controller.userLocation = userLocation;
        controller.showInputDialog = (userLocation == null);
        controller.weatherData = null;
        controller.error = null;
        controller.systemOfUnits = APPCONFIG.DEFAULT_UNIT;
        controller.degreeUnit = (controller.systemOfUnits === 'imperial') ? 'F' : 'C';
        controller.postCodeOrCountry = null;
        controller.locationType = "postcode";
        controller.countries = countries;
        controller.userLocationInput = {country: {"name":"United Kingdom of Great Britain and Northern Ireland","alpha-2":"GB","country-code":"826"}, postcode: null};
        controller.modalButtons = getModalButtons();
        controller.photoURL = '';

        $scope.$watch('home.systemOfUnits', function (system, old) {
            if (old === system) {
                return;
            }
            var byGeoLocation = controller.userLocation != null;
            controller.degreeUnit = (system === 'imperial') ? 'F' : 'C';
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
                    if (controller.userLocationInput.postcode) {
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
            } else if (controller.userLocationInput.country && controller.userLocationInput.postcode) {
                requestWeatherByPostcode(controller.userLocationInput, controller.systemOfUnits)
                    .then(onRequestSuccess, onRequestFail);
            }
        }

        function requestWeatherByPostcode(userLocation, systemOfUnits) {
            return OpenWeatherAPIService.requestWeatherByPostcode(userLocation, systemOfUnits);
        }

        function requestWeatherByGeoLocation(lat, lon, unit) {
            return OpenWeatherAPIService.requestWeatherByGeoLocation(lat, lon, unit);
        }

        function onRequestSuccess(result) {
            var tags = [].concat(result.data.name).concat(result.data.weather[0].description.split(' '));
            FlickrAPIService.searchRandomPhotoByTags(tags).then(function(photoURL){
                controller.photoURL = photoURL;
            });
            controller.weatherData = result.data;
        }

        function onRequestFail(result) {
            controller.error = result.data;
        }
    }
})();
