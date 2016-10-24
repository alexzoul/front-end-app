'use strict';

(function () {
  angular.module('frontEndApp')
  .controller('HomeCtrl', ['$scope',
    function (scope) {
      scope.testText = 'Testing';
    },
  ]);
})();
