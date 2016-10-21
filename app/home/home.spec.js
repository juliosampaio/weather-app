describe('Home Module', function () {

    var $controller,
        $state,
        $rootScope,
        $injector,
        $location,
        $q,
        $httpBackend,
        $window,
        $scope,
        LocationService,
        OpenWeatherAPIService;

    var APPCONFIG = {DEFAULT_UNIT: 'imperial'};

    beforeEach(angular.mock.module('ui.router'));
    beforeEach(angular.mock.module('weather-app.location'));
    beforeEach(angular.mock.module('weather-app.home'));
    beforeEach(angular.mock.module('weather-app.openweather'));
    beforeEach(angular.mock.module('weather-app.util'));
    beforeEach(angular.mock.module('weather-app.flickr'));

    beforeEach(inject(function (_$controller_, _$state_, _$rootScope_,  _$injector_, _$q_, _$httpBackend_, _LocationService_, _OpenWeatherAPIService_) {
        $state = _$state_;
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $injector = _$injector_;
        $q = _$q_;
        $scope = $rootScope.$new();
        $httpBackend = _$httpBackend_;
        LocationService = _LocationService_;
        OpenWeatherAPIService = _OpenWeatherAPIService_;
        spyOn(LocationService, "getUserLocation").and.callThrough();
    }));
    
    describe('Home State', function () {

        it('should respond to home URL', function () {
            expect($state.href('home')).toEqual('#/home');
        });

        it('should call the LocationService on home state', function () {
            $httpBackend.whenGET('home/home.template.html').respond('');
            $httpBackend.whenGET('countries/ISO3166.json').respond([]);
            var mockLocation = null;
            $state.go('home');
            $rootScope.$apply();
            $httpBackend.flush();
            expect($state.current.name).toBe('home');
            expect(LocationService.getUserLocation).toHaveBeenCalled();
        });
    });

    describe('Home Controller when user denies to share location', function () {
        var HomeController, userLocation = null;

        beforeEach(function () {
            HomeController = $controller('Home', {
                '$scope': $scope,
                userLocation: userLocation,
                OpenWeatherAPIService: OpenWeatherAPIService,
                APPCONFIG: APPCONFIG,
                countries: []
            });
        });

        it('should be defined', function () {
           expect(HomeController).toBeDefined();
        });

        it('sould show the modal input if user denies to share the location', function () {
            expect(HomeController.userLocation).toEqual(userLocation);
            expect(HomeController.showInputDialog).toEqual(true);
        });

    });

    describe('Home Controller when user allows to share location', function () {

        var HomeController, userLocation = null;
        var FAKE_RESPONSE = {coord: -38.56, lat: -3.79, main: {temp: 299.914}, weather:[{description: 'Fake Description'}]};
        var API_KEY = '86233891fdf9169b3a4594d92b375ea1';

        beforeEach(function () {
            userLocation = {coords: {latitude: -3.8105504, longitude: -38.5947928}};
            spyOn(OpenWeatherAPIService, 'requestWeatherByGeoLocation').and.callThrough();
            HomeController = $controller('Home', {
                '$scope': $scope,
                userLocation: userLocation,
                OpenWeatherAPIService: OpenWeatherAPIService,
                APPCONFIG: APPCONFIG,
                countries: []
            });
        });

        it('should fetch the weather for userLocation', function () {
            var url = 'http://api.openweathermap.org/data/2.5/weather?lat=-3.8105504&lon=-38.5947928&units=imperial&apikey='+API_KEY;
            $httpBackend.whenGET(url).respond(200, FAKE_RESPONSE);
            var url2 = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=7e1aca26dbc0600a45cd08d90f6884b8&tags=,Fake,Description&format=json&nojsoncallback=1';
            $httpBackend.whenGET(url2).respond(200, {photos: {photo:[]}});
            $httpBackend.flush();
            expect(HomeController.userLocation).toEqual(userLocation);
            expect(OpenWeatherAPIService.requestWeatherByGeoLocation)
                .toHaveBeenCalledWith(userLocation.coords.latitude, userLocation.coords.longitude, APPCONFIG.DEFAULT_UNIT);
            expect(HomeController.weatherData).toEqual(FAKE_RESPONSE);
        });
    });

});
