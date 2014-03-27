"use strict";
angular.module("com.2fdevs.videogular.plugins.controls", [])
	.directive(
		"vgControls",
		["$timeout", "VG_STATES", "VG_EVENTS", function($timeout, VG_STATES, VG_EVENTS){
			return {
				restrict: "E",
				require: "^videogular",
				transclude: true,
				template: '<div id="controls-container" ng-show="isReady" ng-class="animationClass" ng-transclude></div>',
				scope: {
					autoHide: "=vgAutohide",
					autoHideTime: "=vgAutohideTime"
				},
				link: function(scope, elem, attr, API) {
					var w = 0;
					var h = 0;
					var autoHideTime = 2000;
					var controlBarHeight = elem[0].style.height;
					var hideInterval;
					var isReadyInterval;

					scope.isReady = false;

					function onUpdateSize(target, params) {
						w = params[0];
						h = params[1];

						elem.css("top", (parseInt(h, 10) - parseInt(controlBarHeight, 10)) + "px");
					}

					function onMouseMove() {
						showControls();
						scope.$apply();
					}

					function hideControls() {
						scope.animationClass = "hide-animation";
					}

					function showControls() {
						scope.animationClass = "show-animation";
						$timeout.cancel(hideInterval);
						if (scope.autoHide) hideInterval = $timeout(hideControls, autoHideTime);
					}

					function onPlayerReady() {
						var size = API.getSize();

						elem.css("top", (parseInt(size.height, 10) - parseInt(controlBarHeight, 10)) + "px");
						isReadyInterval = $timeout(showWhenIsReady, 500);
					}

					function showWhenIsReady() {
						$timeout.cancel(isReadyInterval);
						scope.isReady = true;
					}

					// If vg-autohide has been set
					if (scope.autoHide != undefined) {
						scope.$watch("autoHide", function(value) {
							if (value) {
								scope.animationClass = "hide-animation";
								API.videogularElement.bind("mousemove", onMouseMove);
							}
							else {
								scope.animationClass = "";
								$timeout.cancel(hideInterval);
								API.videogularElement.unbind("mousemove", onMouseMove);
								showControls();
							}
						});
					}

					// If vg-autohide-time has been set
					if (scope.autoHideTime != undefined) {
						scope.$watch("autoHideTime", function(value) {
							autoHideTime = value;
						});
					}

					API.$on(VG_EVENTS.ON_UPDATE_SIZE, onUpdateSize);

					if (API.isPlayerReady()) onPlayerReady();
					else API.$on(VG_EVENTS.ON_PLAYER_READY, onPlayerReady);
				}
			}
		}
	])
	.directive(
		"vgPlayPauseButton",
		["VG_STATES", "VG_EVENTS", function(VG_STATES, VG_EVENTS) {
			return {
				restrict: "E",
				require: "^videogular",
				template: "<div class='iconButton' ng-class='playPauseIcon'></div>",
				link: function(scope, elem, attr, API) {
					function onChangeState(target, params) {
						switch (params[0]) {
							case VG_STATES.PLAY:
								scope.playPauseIcon = {pause: true};
								break;

							case VG_STATES.PAUSE:
								scope.playPauseIcon = {play: true};
								break;

							case VG_STATES.STOP:
								scope.playPauseIcon = {play: true};
								break;
						}

						scope.$apply();
					}

					function onClickPlayPause() {
						API.playPause();
					}

					scope.playPauseIcon = {play: true};

					elem.bind("click", onClickPlayPause);
					API.$on(VG_EVENTS.ON_SET_STATE, onChangeState);
				}
			}
		}
	])
	.directive(
		"vgTimedisplay",
		["VG_EVENTS", function(VG_EVENTS){
			return {
				require: "^videogular",
				restrict: "E",
				link: function(scope, elem, attr, API) {
					function parseTime(time) {
						var mm = Math.floor(time / 60);
						var ss = Math.floor(time - (mm * 60));
						var mins = mm < 10 ? "0" + mm : mm;
						var secs = ss < 10 ? "0" + ss : ss;

						return {mins: mins, secs: secs};
					}

					function onUpdateTime(target, params) {
						var time = parseTime(params[0]);

						scope.currentTime = time.mins + ":" + time.secs;
					}

					function onComplete(target, params) {
						scope.currentTime = "00:00";
					}

					function onStartPlaying(target, params) {
						var time = parseTime(params[0]);

						scope.totalTime = time.mins + ":" + time.secs;
					}

					scope.currentTime = "00:00";
					scope.totalTime = "00:00";

					API.$on(VG_EVENTS.ON_START_PLAYING, onStartPlaying);
					API.$on(VG_EVENTS.ON_UPDATE_TIME, onUpdateTime);
					API.$on(VG_EVENTS.ON_COMPLETE, onComplete);
				}
			}
		}
	])
	.directive(
		"vgScrubbar",
		["VG_EVENTS", "VG_STATES", "VG_UTILS", function(VG_EVENTS, VG_STATES, VG_UTILS){
			return {
				restrict: "AE",
				require: "^videogular",
				replace: true,
				link: function(scope, elem, attr, API) {
					var isSeeking = false;
					var isPlaying = false;
					var isPlayingWhenSeeking = false;
					var touchStartX = 0;

					function onScrubBarTouchStart(event) {
						var touches = event.originalEvent.touches;
						var touchX;

						if (VG_UTILS.isiOSDevice()) {
							touchStartX = (touches[0].clientX - event.originalEvent.layerX) * -1;
						}
						else {
							touchStartX = event.originalEvent.layerX;
						}

						touchX = touches[0].clientX + touchStartX - touches[0].target.offsetLeft;

						isSeeking = true;
						if (isPlaying) isPlayingWhenSeeking = true;
						seekTime(touchX * API.videoElement[0].duration / elem[0].scrollWidth);
						API.pause();
					}
					function onScrubBarTouchEnd(event) {
						if (isPlayingWhenSeeking) {
							isPlayingWhenSeeking = false;
							API.play();
						}
						isSeeking = false;
					}
					function onScrubBarTouchMove(event) {
						var touches = event.originalEvent.touches;
						var touchX;

						if (isSeeking) {
							touchX = touches[0].clientX + touchStartX - touches[0].target.offsetLeft;
							seekTime(touchX * API.videoElement[0].duration / elem[0].scrollWidth);
						}
					}
					function onScrubBarTouchLeave(event) {
						isSeeking = false;
					}

					function onScrubBarMouseDown(event) {
						event = VG_UTILS.fixEventOffset(event);

						isSeeking = true;
						if (isPlaying) isPlayingWhenSeeking = true;
						seekTime(event.offsetX * API.videoElement[0].duration / elem[0].scrollWidth);
						API.pause();
					}
					function onScrubBarMouseUp(event) {
						event = VG_UTILS.fixEventOffset(event);

						if (isPlayingWhenSeeking) {
							isPlayingWhenSeeking = false;
							API.play();
						}
						isSeeking = false;
						seekTime(event.offsetX * API.videoElement[0].duration / elem[0].scrollWidth);
					}
					function onScrubBarMouseMove(event) {
						if (isSeeking) {
							event = VG_UTILS.fixEventOffset(event);
							seekTime(event.offsetX * API.videoElement[0].duration / elem[0].scrollWidth);
						}
					}
					function onScrubBarMouseLeave(event) {
						isSeeking = false;
					}
					function seekTime(time) {
						API.seekTime(time);
					}

					function onChangeState(target, params) {
						if (!isSeeking) {
							switch (params[0]) {
								case VG_STATES.PLAY:
									isPlaying = true;
									break;

								case VG_STATES.PAUSE:
									isPlaying = false;
									break;

								case VG_STATES.STOP:
									isPlaying = false;
									break;
							}
						}
					}

					API.$on(VG_EVENTS.ON_SET_STATE, onChangeState);

					// Touch move is really buggy in Chrome for Android, maybe we could use mouse move that works ok
					if (VG_UTILS.isMobileDevice()) {
						elem.bind("touchstart", onScrubBarTouchStart);
						elem.bind("touchend", onScrubBarTouchEnd);
						elem.bind("touchmove", onScrubBarTouchMove);
						elem.bind("touchleave", onScrubBarTouchLeave);
					}
					else {
						elem.bind("mousedown", onScrubBarMouseDown);
						elem.bind("mouseup", onScrubBarMouseUp);
						elem.bind("mousemove", onScrubBarMouseMove);
						elem.bind("mouseleave", onScrubBarMouseLeave);
					}
				}
			}
		}
	])
	.directive(
		"vgScrubbarcurrenttime",
		["VG_EVENTS", function(VG_EVENTS){
			return {
				restrict: "E",
				require: "^videogular",
				link: function(scope, elem, attr, API) {
					var percentTime = 0;

					function onUpdateTime(target, params){
						percentTime = Math.round((params[0] / params[1]) * 100);
						elem.css("width", percentTime + "%");
					}

					function onComplete(target, params){
						percentTime = 0;
						elem.css("width", percentTime + "%");
					}

					API.$on(VG_EVENTS.ON_UPDATE_TIME, onUpdateTime);
					API.$on(VG_EVENTS.ON_COMPLETE, onComplete);
				}
			}
		}
	])
	.directive(
		"vgVolume",
		["VG_UTILS", function(VG_UTILS) {
			return {
				restrict: "E",
				link: function(scope, elem, attr) {
					function onMouseOverVolume() {
						scope.volumeVisibility = "visible";
						scope.$apply();
					}

					function onMouseLeaveVolume() {
						scope.volumeVisibility = "hidden";
						scope.$apply();
					}

					// We hide volume controls on mobile devices
					if (VG_UTILS.isMobileDevice()) {
						elem.css("display", "none");
					}
					else {
						scope.volumeVisibility = "hidden";

						elem.bind("mouseover", onMouseOverVolume);
						elem.bind("mouseleave", onMouseLeaveVolume);
					}
				}
			}
		}
	])
	.directive(
		"vgVolumebar",
		["VG_EVENTS", "VG_UTILS", function(VG_EVENTS, VG_UTILS) {
			return {
				restrict: "E",
				require: "^videogular",
				template:
					"<div class='verticalVolumeBar'>"+
						"<div class='volumeBackground'>"+
							"<div class='volumeValue'></div>"+
							"<div class='volumeClickArea'></div>"+
						"</div>"+
					"</div>",
				link: function(scope, elem, attr, API) {
					var isChangingVolume = false;
					var volumeBackElem = angular.element(elem[0].getElementsByClassName("volumeBackground"));
					var volumeValueElem = angular.element(elem[0].getElementsByClassName("volumeValue"));

					function onClickVolume(event) {
						event = VG_UTILS.fixEventOffset(event);
						var volumeHeight = parseInt(volumeBackElem.prop("offsetHeight"));
						var value = event.offsetY * 100 / volumeHeight;
						var volValue = 1 - (value / 100);
						updateVolumeView(value);

						API.setVolume(volValue);
					}

					function onMouseDownVolume(event) {
						isChangingVolume = true;
					}

					function onMouseUpVolume(event) {
						isChangingVolume = false;
					}

					function onMouseLeaveVolume(event) {
						isChangingVolume = false;
					}

					function onMouseMoveVolume(event) {
						if (isChangingVolume) {
							event = VG_UTILS.fixEventOffset(event);
							var volumeHeight = parseInt(volumeBackElem.prop("offsetHeight"));
							var value = event.offsetY * 100 / volumeHeight;
							var volValue = 1 - (value / 100);
							updateVolumeView(value);

							API.setVolume(volValue);
						}
					}

					function updateVolumeView(value) {
						volumeValueElem.css("height", value + "%");
						volumeValueElem.css("top", (100 - value) + "%");
					}

					function onSetVolume(target, params) {
						updateVolumeView(params[0] * 100);
					}

					function onChangeVisibility(value) {
						elem.css("visibility", value);
					}

					elem.css("visibility", scope.volumeVisibility);

					scope.$watch("volumeVisibility", onChangeVisibility);

					volumeBackElem.bind("click", onClickVolume);
					volumeBackElem.bind("mousedown", onMouseDownVolume);
					volumeBackElem.bind("mouseup", onMouseUpVolume);
					volumeBackElem.bind("mousemove", onMouseMoveVolume);
					volumeBackElem.bind("mouseleave", onMouseLeaveVolume);

					API.$on(VG_EVENTS.ON_SET_VOLUME, onSetVolume);
				}
			}
		}
	])
	.directive(
		"vgMutebutton",
		["VG_EVENTS", function(VG_EVENTS) {
			return {
				restrict: "E",
				require: "^videogular",
				template: "<div class='iconButton' ng-class='muteIcon'></div>",
				link: function(scope, elem, attr, API) {
					var isMuted = false;

					function onClickMute(event) {
						if (isMuted) {
							scope.currentVolume = scope.defaultVolume;
						}
						else {
							scope.currentVolume = 0;
							scope.muteIcon = {mute: true};
						}

						isMuted = !isMuted;

						API.setVolume(scope.currentVolume);
					}

					function onSetVolume(target, params) {
						scope.currentVolume = params[0];

						// TODO: Save volume with LocalStorage
						// if it's not muted we save the default volume
						if (!isMuted) {
							scope.defaultVolume = params[0];
						}
						else {
							// if was muted but the user changed the volume
							if (params[0] > 0) {
								scope.defaultVolume = params[0];
							}
						}

						var percentValue = Math.round(params[0] * 100);
						if (percentValue == 0) {
							scope.muteIcon = {mute: true};
						}
						else if (percentValue > 0 && percentValue < 25) {
							scope.muteIcon = {level0: true};
						}
						else if (percentValue >= 25 && percentValue < 50) {
							scope.muteIcon = {level1: true};
						}
						else if (percentValue >= 50 && percentValue < 75) {
							scope.muteIcon = {level2: true};
						}
						else if (percentValue >= 75) {
							scope.muteIcon = {level3: true};
						}

						scope.$apply();
					}

					scope.defaultVolume = 1;
					scope.currentVolume = scope.defaultVolume;
					scope.muteIcon = {level3: true};

					//TODO: get volume from localStorage
					elem.bind("click", onClickMute);

					API.$on(VG_EVENTS.ON_SET_VOLUME, onSetVolume);
				}
			}
		}
	])
	.directive(
		"vgFullscreenbutton",
		["$window", "VG_EVENTS", function($window, VG_EVENTS){
			return {
				restrict: "AE",
				require: "^videogular",
				scope: {
					vgEnterFullScreenIcon: "=",
					vgExitFullScreenIcon: "="
				},
				template: "<div class='iconButton' ng-class='fullscreenIcon'></div>",
				link: function(scope, elem, attr, API) {
					function onEnterFullScreen() {
						scope.fullscreenIcon = {exit: true};
					}
					function onExitFullScreen() {
						scope.fullscreenIcon = {enter: true};
					}
					function onClickFullScreen(event) {
						API.toggleFullScreen();
					}

					elem.bind("click", onClickFullScreen);
					scope.fullscreenIcon = {enter: true};

					API.$on(VG_EVENTS.ON_ENTER_FULLSCREEN, onEnterFullScreen);
					API.$on(VG_EVENTS.ON_EXIT_FULLSCREEN, onExitFullScreen);
				}
			}
		}
	]);
