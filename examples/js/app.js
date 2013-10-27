"use strict";
// Declare app level module which depends on filters, and services
var videogularApp = angular.module("videogularApp",
	[
		"controllers",

		"com.2fdevs.videogular",
		"com.2fdevs.videogular.plugins.controlbar",
		"com.2fdevs.videogular.plugins.overlayplay",
		"com.2fdevs.videogular.plugins.buffering",
		"com.2fdevs.videogular.plugins.poster"
	]
);

// Controllers
var controllerModule = angular.module('controllers', []);
controllerModule.controller("MainController", ["$scope", function (scope) {
	scope.data = {
		"width": 640,
		"height": 264,
		"autoHide": false,
		"autoPlay": false,
		"themes": [
			{label: "Default", url: "themes/default/videogular.css"},
			{label: "Solid", url: "themes/solid/solid.css"}
		],
		"stretchModes": [
			{label: "None", value: "none"},
			{label: "Fit", value: "fit"},
			{label: "Fill", value: "fill"}
		],
		"plugins": {
			"poster": {
				"url": "assets/images/oceans-clip.png"
			}
		}
	};

	scope.theme = scope.data.themes[0];
	scope.stretchMode = scope.data.stretchModes[1];
}]);
