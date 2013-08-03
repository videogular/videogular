"use strict";
// ControlBar plugin
var overLayPlayDirectives = angular.module("com.2fdevs.videogular.plugins.overlayplay", []);

overLayPlayDirectives.directive("vgOverlayplay", function($rootScope, VG_EVENTS, VG_STATES, VG_THEMES){
		return {
			restrict: "E",
			template:
				"<div class='overlayPlayContainer'>" +
					"<div class='iconButton' ng-bind-html='overlayPlayIcon'></div>" +
				"</div>",
			link: function(scope, elem, attrs) {
				function onClickOverlayPlay($event) {
					scope.$emit(VG_EVENTS.ON_PLAY);
				}

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

					scope.$apply();
				}

				scope.overlayPlayIcon = VG_THEMES.PLAY;

				elem.bind("click", onClickOverlayPlay);

				$rootScope.$on(VG_EVENTS.ON_SET_STATE, onChangeState);
			}
		}
	}
);
