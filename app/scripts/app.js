'use strict';
angular.module('myApp',
		[
			"ngRoute",
			"com.2fdevs.videogular",
			"com.2fdevs.videogular.plugins.controls",
			"com.2fdevs.videogular.plugins.overlayplay",
			"com.2fdevs.videogular.plugins.buffering",
			"com.2fdevs.videogular.plugins.poster"
		]
	)
	.config(
	function ($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'views/main.html',
				controller: 'MainCtrl'
			})
			.otherwise({
				redirectTo: '/'
			}
		);
	}
);
