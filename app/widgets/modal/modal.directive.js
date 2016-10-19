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
