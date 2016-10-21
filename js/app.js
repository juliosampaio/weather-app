(function () {
    'use strict';
    angular.module('weather-app', [
        'ui.router',
        'weather-app.home',
        'weather-app.location',
        'weather-app.openweather',
        'weather-app.widgets',
        'weather-app.util',
        'weather-app.flickr'
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

(function () {
    'use strict';
    angular
        .module('weather-app.location', []);
})();

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

(function () {
    'use strict';
    angular
        .module('weather-app.widgets', []);
})();

(function () {
    'use strict';
    angular
        .module('weather-app.widgets')
        .directive('weatherAppModal', Modal);
    
    function Modal($timeout) {

        var directive = {
            restrict: 'E',
            transclude: {
                body: 'modalBody',
            },
            templateUrl: 'widgets/modal/modal.template.html',
            link: link,
            scope: {
                modalId: '@',
                title: '@',
                show: '=',
                showClose: '@',
                buttons: '='
            }
        };
        return directive;
        
        function link(scope,elem,attrs) {

            scope.$watch('show', function (show) {
                setModalState(show ? 'show' : 'hide');
                $.material.init();
            });

            function setModalState(value) {
                $('#'+attrs.modalId).modal({backdrop: 'static', keyboard: false});
                $('#'+attrs.modalId).modal(value);
            }
        }
    }
})();

(function () {
    'use strict';
    angular
        .module('weather-app.util', []);
})();

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

(function () {
    'use strict';
    angular
        .module('weather-app.flickr', [])
        .config(FlickrConfig);

    function FlickrConfig($provide) {

        $provide.value('FLICKR_CONFIG', {
            KEY: '7e1aca26dbc0600a45cd08d90f6884b8',
            SECRET: '044eabce302625fd',
            API_URL_REST: 'https://api.flickr.com/services/rest/?'
        })
    }
})();

(function () {
    'use strict';
    angular
        .module('weather-app.flickr')
        .factory('FlickrAPIService', FlickrAPIService);

    function FlickrAPIService($q, $http, FLICKR_CONFIG) {

        var service = {
            searchRandomPhotoByTags: searchRandomPhotoByTags
        };
        
        function getRandomPhotoURL(flickrPhotos) {

            var url = 'https://farm{farm}.staticflickr.com/{server}/{id}_{secret}_b.jpg';
            var photo = flickrPhotos.photo[Math.floor(Math.random()*flickrPhotos.photo.length)];
            if (!photo) {
                return '';
            }
            return url
                .replace('{farm}',photo.farm)
                .replace('{server}',photo.server)
                .replace('{id}',photo.id)
                .replace('{secret}',photo.secret);
        }

        function searchRandomPhotoByTags(tags) {
            var params = [];
            params.push(['method','flickr.photos.search']);
            params.push(['api_key', FLICKR_CONFIG.KEY]);
            params.push(['tags', tags.join(',')]);
            params.push(['format', 'json']);
            params.push(['nojsoncallback', '1']);
            var requestParams = [];
            for (var i = 0; i < params.length; i++) {
                requestParams.push(encodeURI(params[i].join('=')));
            }
            requestParams = requestParams.join('&');
            var url = FLICKR_CONFIG.API_URL_REST + requestParams;
            return $http
                .get(url).then(
                    function (response) {
                        return getRandomPhotoURL(response.data.photos);
                    },
                    function (response) {
                        return ''
                    }
                );
        }

        return service;
    }
})();
