describe('Home Module', function () {

    var $controller,
        $state,
        $rootScope,
        $injector,
        $location,
        $q,
        $httpBackend,
        $window,
        LocationService,
        OpenWeatherAPIService;

    var APPCONFIG = {UNIT: 'imperial'};

    beforeEach(angular.mock.module('ui.router'));
    beforeEach(angular.mock.module('weather-app.location'));
    beforeEach(angular.mock.module('weather-app.home'));
    beforeEach(angular.mock.module('weather-app.openweather'));

    beforeEach(inject(function (_$controller_, _$state_, _$rootScope_,  _$injector_, _$q_, _$httpBackend_, _LocationService_, _OpenWeatherAPIService_) {
        $controller = _$controller_;
        $state = _$state_;
        $rootScope = _$rootScope_;
        $injector = _$injector_;
        $q = _$q_;
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
            HomeController = $controller('Home', {userLocation: userLocation, APPCONFIG: APPCONFIG});
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
        var FAKE_RESPONSE = {coord: -38.56, lat: -3.79, main: {temp: 299.914}};
        var API_KEY = '86233891fdf9169b3a4594d92b375ea1';

        beforeEach(function () {
            userLocation = {coords: {latitude: -3.8105504, longitude: -38.5947928}};
            spyOn(OpenWeatherAPIService, 'requestWeatherByGeoLocation').and.callThrough();
            HomeController = $controller('Home', {userLocation: userLocation, APPCONFIG: APPCONFIG});
        });

        it('should fetch the weather for userLocation', function () {
            var url = 'http://api.openweathermap.org/data/2.5/weather?lat=-3.8105504&lon=-38.5947928&units=metric&apikey='+API_KEY;
            $httpBackend.whenGET(url).respond(200, FAKE_RESPONSE);
            $httpBackend.flush();
            expect(HomeController.userLocation).toEqual(userLocation);
            expect(OpenWeatherAPIService.requestWeatherByGeoLocation)
                .toHaveBeenCalledWith(userLocation.coords.latitude, userLocation.coords.longitude, APPCONFIG.UNIT);
            expect(HomeController.weatherData).toEqual(FAKE_RESPONSE);
        });
    });

});
