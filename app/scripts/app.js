'use strict';
angular.module('myApp',
    [
      "ngRoute",
      "angulartics.google.analytics",
      "com.2fdevs.videogular",
      "com.2fdevs.videogular.plugins.controls",
      "com.2fdevs.videogular.plugins.overlayplay",
      "com.2fdevs.videogular.plugins.buffering",
      "com.2fdevs.videogular.plugins.poster",
      "com.2fdevs.videogular.plugins.imaads",
      "com.2fdevs.videogular.plugins.dash",
      "com.2fdevs.videogular.plugins.analytics"
    ]
  )
	.config(
    function ($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'views/main.html',
          controller: 'MainCtrl'
        })
        .when('/audio', {
          templateUrl: 'views/audio.html',
          controller: 'AudioCtrl'
        })
        .when('/config', {
          templateUrl: 'views/config.html',
          controller: 'ConfigCtrl'
        })
        .when('/imaads', {
          templateUrl: 'views/imaads.html',
          controller: 'ImaAdsCtrl'
        })
        .when('/dash', {
          templateUrl: 'views/dash.html',
          controller: 'DashCtrl'
        })
        .when('/dash-live', {
          templateUrl: 'views/dash-live.html',
          controller: 'DashLiveCtrl'
        })
        .when('/templating', {
          templateUrl: 'views/templates.html',
          controller: 'TemplatesCtrl'
        })
        .otherwise({
          redirectTo: '/'
        }
      );
    }
  );
