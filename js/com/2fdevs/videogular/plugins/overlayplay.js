"use strict";
// ControlBar plugin
var overLayPlayDirectives = angular.module("com.2fdevs.videogular.plugins.overlayplay", []);

overLayPlayDirectives.directive("vgOverlayplay", function($rootScope, VG_EVENTS, VG_STATES, VG_THEMES){
		return {
			restrict: "E",
			template:
				"<div class='overlayPlayContainer' ng-click='onClickOverlayPlay($event)'>" +
					"<div class='iconButton' ng-bind-html='overlayPlayIcon'></div>" +
				"</div>",
			link: function(scope, elem, attrs) {
				console.log("overlayPlay created");
				scope.overlayPlayIcon = VG_THEMES.PLAY;

				scope.onClickOverlayPlay = function ($event) {
					scope.$emit(VG_EVENTS.ON_PLAY);
				};

				function onChangeState(target, params) {
					switch (params[0]) {
						case VG_STATES.PLAY:
							scope.overlayPlayIcon = "";
							break;

						case VG_STATES.PAUSE:
							scope.overlayPlayIcon = VG_THEMES.PLAY;
							break;

						case VG_STATES.STOP:
							scope.overlayPlayIcon = VG_THEMES.PLAY;
							break;
					}
				}

				$rootScope.$on(VG_EVENTS.ON_SET_STATE, onChangeState);
			}
		}
	}
);
