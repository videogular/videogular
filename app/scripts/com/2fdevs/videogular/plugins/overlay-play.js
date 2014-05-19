/**
 * @license Videogular v0.4.0 http://videogular.com
 * Two Fucking Developers http://twofuckingdevelopers.com
 * License: MIT
 */
"use strict";
angular.module("com.2fdevs.videogular.plugins.overlayplay", [])
	.directive(
		"vgOverlayPlay",
		["VG_EVENTS", "VG_STATES", function(VG_EVENTS, VG_STATES){
			return {
				restrict: "E",
				require: "^videogular",
				scope: {
					vgPlayIcon: "="
				},
				template:
					"<div class='overlayPlayContainer'>"+
						"<div class='iconButton' ng-class='overlayPlayIcon'></div>"+
					"</div>",
				link: function(scope, elem, attr, API) {
					function onComplete(target, params) {
						scope.overlayPlayIcon = {play: true};
					}

					function onClickOverlayPlay(event) {
						API.playPause();
						scope.$apply();
					}

					function onPlay(target, params) {
						scope.overlayPlayIcon = {};
					}

					function onChangeState(target, params) {
						switch (params[0]) {
							case VG_STATES.PLAY:
								scope.overlayPlayIcon = {};
								break;

							case VG_STATES.PAUSE:
								scope.overlayPlayIcon = {play: true};
								break;

							case VG_STATES.STOP:
								scope.overlayPlayIcon = {play: true};
								break;
						}
					}

					elem.bind("click", onClickOverlayPlay);
					scope.overlayPlayIcon = {play: true};

					API.$on(VG_EVENTS.ON_PLAY, onPlay);
					API.$on(VG_EVENTS.ON_SET_STATE, onChangeState);
					API.$on(VG_EVENTS.ON_COMPLETE, onComplete);
				}
			}
		}
	]);

