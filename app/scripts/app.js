'use strict';

(function () {
  angular.module('frontEndApp', ['ngRoute', 'frontEndApp.templates'])
  .config(function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'views/home.tpl.html',
        controller: 'HomeCtrl',
      })
      .otherwise({
        redirectTo: '/',
      });
  });
})();
