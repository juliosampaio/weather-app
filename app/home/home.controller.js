(function () {
    'use strict';
    angular
        .module('weather-app.home')
        .controller('Home', Home);

    Home.$inject = ['userLocation'];
    
    function Home(userLocation) {
        var controller = this;
        controller.userLocation = userLocation;
    }
})();
