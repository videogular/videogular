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
				controller: function ($scope){
					$scope.playIcon = $.parseHTML($scope.vgPlayIcon)[0].data;
					$scope.currentIcon = $scope.playIcon;
				},
				templateUrl: "views/videogular/plugins/overlay-play/overlay-play.html",
				link: function(scope, elem, attr, API) {
					function onComplete(target, params) {
						scope.currentIcon = scope.playIcon;
					}

					function onClickOverlayPlay(event) {
						API.playPause();
					}

					function onPlay(target, params) {
						scope.currentIcon = "";
					}

					function onChangeState(target, params) {
						switch (params[0]) {
							case VG_STATES.PLAY:
								scope.currentIcon = "";
								break;

							case VG_STATES.PAUSE:
								scope.currentIcon = scope.playIcon;
								break;

							case VG_STATES.STOP:
								scope.currentIcon = scope.playIcon;
								break;
						}
					}

					elem.bind("click", onClickOverlayPlay);

					API.$on(VG_EVENTS.ON_PLAY, onPlay);
					API.$on(VG_EVENTS.ON_SET_STATE, onChangeState);
					API.$on(VG_EVENTS.ON_COMPLETE, onComplete);
				}
			}
		}
	]);

