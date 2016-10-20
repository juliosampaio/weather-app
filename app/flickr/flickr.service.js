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
