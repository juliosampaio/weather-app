(function () {
    'use strict';
    angular
        .module('weather-app.home')
        .controller('Home', Home);

    Home.$inject = ['LocationService'];
    
    function Home(LocationService) {
        var controller = this;
        controller.title = "~Home~";
        LocationService.getUserLocation().then(function (loc) {
            console.log(loc);
        });
    }
})();
