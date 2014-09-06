/**
 * @license Videogular v0.5.1 http://videogular.com
 * Two Fucking Developers http://twofuckingdevelopers.com
 * License: MIT
 */
"use strict";
angular.module("com.2fdevs.videogular.plugins.controls", [])
	.directive(
	"vgControls",
	["$timeout", "VG_STATES", function ($timeout, VG_STATES) {
		return {
			restrict: "E",
			require: "^videogular",
			transclude: true,
			template: '<div id="controls-container" ng-class="animationClass" ng-transclude></div>',
			scope: {
				autoHide: "=vgAutohide",
				autoHideTime: "=vgAutohideTime"
			},
			link: function (scope, elem, attr, API) {
				var w = 0;
				var h = 0;
				var autoHideTime = 2000;
				var hideInterval;

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

				// If vg-autohide has been set
				if (scope.autoHide != undefined) {
					scope.$watch("autoHide", function (value) {
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
					scope.$watch("autoHideTime", function (value) {
						autoHideTime = value;
					});
				}
			}
		}
	}
	])
	.directive(
	"vgPlayPauseButton",
	["VG_STATES", function (VG_STATES) {
		return {
			restrict: "E",
			require: "^videogular",
			template: "<div class='iconButton' ng-class='playPauseIcon'></div>",
			link: function (scope, elem, attr, API) {
				function setState(newState) {
					switch (newState) {
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
				}

				function onClickPlayPause() {
					API.playPause();
					scope.$apply();
				}

				scope.playPauseIcon = {play: true};

				scope.$watch(
					function () {
						return API.currentState;
					},
					function (newVal, oldVal) {
						if (newVal != oldVal) {
							setState(newVal);
						}
					}
				);

				elem.bind("click", onClickPlayPause);
			}
		}
	}
	])
	.directive(
	"vgTimedisplay",
	[function () {
		return {
			require: "^videogular",
			restrict: "E",
			link: function (scope, elem, attr, API) {
				scope.$watch(
					function () {
						return API.currentTime;
					},
					function (newVal, oldVal) {
						if (newVal != oldVal) {
							scope.currentTime = newVal;
						}
					}
				);

				scope.$watch(
					function () {
						return API.timeLeft;
					},
					function (newVal, oldVal) {
						if (newVal != oldVal) {
							scope.timeLeft = newVal;
						}
					}
				);

				scope.$watch(
					function () {
						return API.totalTime;
					},
					function (newVal, oldVal) {
						if (newVal != oldVal) {
							scope.totalTime = newVal;
						}
					}
				);
			}
		}
	}
	])
	.directive(
	"vgScrubbar",
	["VG_STATES", "VG_UTILS", function (VG_STATES, VG_UTILS) {
		return {
			restrict: "AE",
			require: "^videogular",
			replace: true,
			link: function (scope, elem, attr, API) {
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
					API.pause();
					seekTime(touchX * API.videoElement[0].duration / elem[0].scrollWidth);

					scope.$apply();
				}

				function onScrubBarTouchEnd(event) {
					if (isPlayingWhenSeeking) {
						isPlayingWhenSeeking = false;
						API.play();
					}
					isSeeking = false;

					scope.$apply();
				}

				function onScrubBarTouchMove(event) {
					var touches = event.originalEvent.touches;
					var touchX;

					if (isSeeking) {
						touchX = touches[0].clientX + touchStartX - touches[0].target.offsetLeft;
						seekTime(touchX * API.videoElement[0].duration / elem[0].scrollWidth);
					}

					scope.$apply();
				}

				function onScrubBarTouchLeave(event) {
					isSeeking = false;

					scope.$apply();
				}

				function onScrubBarMouseDown(event) {
					event = VG_UTILS.fixEventOffset(event);

					isSeeking = true;
					if (isPlaying) isPlayingWhenSeeking = true;
					API.pause();
					seekTime(event.offsetX * API.videoElement[0].duration / elem[0].scrollWidth);

					scope.$apply();
				}

				function onScrubBarMouseUp(event) {
					event = VG_UTILS.fixEventOffset(event);

					if (isPlayingWhenSeeking) {
						isPlayingWhenSeeking = false;
						API.play();
					}
					isSeeking = false;
					seekTime(event.offsetX * API.videoElement[0].duration / elem[0].scrollWidth);

					scope.$apply();
				}

				function onScrubBarMouseMove(event) {
					if (isSeeking) {
						event = VG_UTILS.fixEventOffset(event);
						seekTime(event.offsetX * API.videoElement[0].duration / elem[0].scrollWidth);
					}

					scope.$apply();
				}

				function onScrubBarMouseLeave(event) {
					isSeeking = false;

					scope.$apply();
				}

				function seekTime(time) {
					API.seekTime(time, false);
				}

				function setState(newState) {
					if (!isSeeking) {
						switch (newState) {
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

				scope.$watch(
					function () {
						return API.currentState;
					},
					function (newVal, oldVal) {
						if (newVal != oldVal) {
							setState(newVal);
						}
					}
				);

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
	[function () {
		return {
			restrict: "E",
			require: "^videogular",
			link: function (scope, elem, attr, API) {
				var percentTime = 0;

				function onUpdateTime(newCurrentTime) {
					if (newCurrentTime && API.totalTime) {
						percentTime = (newCurrentTime.getTime() * -1 / 1000) * 100 / (API.totalTime.getTime() * -1 / 1000);
						elem.css("width", percentTime + "%");
					}
				}

				function onComplete() {
					percentTime = 0;
					elem.css("width", percentTime + "%");
				}

				scope.$watch(
					function () {
						return API.currentTime;
					},
					function (newVal, oldVal) {
						onUpdateTime(newVal);
					}
				);

				scope.$watch(
					function () {
						return API.isCompleted;
					},
					function (newVal, oldVal) {
						onComplete(newVal);
					}
				);
			}
		}
	}
	])
	.directive(
	"vgVolume",
	["VG_UTILS", function (VG_UTILS) {
		return {
			restrict: "E",
			link: function (scope, elem, attr) {
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
	["VG_UTILS", function (VG_UTILS) {
		return {
			restrict: "E",
			require: "^videogular",
			template: "<div class='verticalVolumeBar'>" +
				"<div class='volumeBackground'>" +
				"<div class='volumeValue'></div>" +
				"<div class='volumeClickArea'></div>" +
				"</div>" +
				"</div>",
			link: function (scope, elem, attr, API) {
				var isChangingVolume = false;
				var volumeBackElem = angular.element(elem[0].getElementsByClassName("volumeBackground"));
				var volumeValueElem = angular.element(elem[0].getElementsByClassName("volumeValue"));

				function onClickVolume(event) {
					event = VG_UTILS.fixEventOffset(event);
					var volumeHeight = parseInt(volumeBackElem.prop("offsetHeight"));
					var value = event.offsetY * 100 / volumeHeight;
					var volValue = 1 - (value / 100);
					updateVolumeView(volValue * 100);

					API.setVolume(volValue);

					scope.$apply();
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
						updateVolumeView(volValue * 100);

						API.setVolume(volValue);

						scope.$apply();
					}
				}

				function updateVolumeView(value) {
					volumeValueElem.css("height", value + "%");
					volumeValueElem.css("top", (100 - value) + "%");
				}

				function onSetVolume(newVolume) {
					updateVolumeView(newVolume * 100);
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

				scope.$watch(
					function () {
						return API.volume;
					},
					function (newVal, oldVal) {
						if (newVal != oldVal) {
							onSetVolume(newVal);
						}
					}
				);
			}
		}
	}
	])
	.directive(
	"vgMutebutton",
	[function () {
		return {
			restrict: "E",
			require: "^videogular",
			template: "<div class='iconButton' ng-class='muteIcon'></div>",
			link: function (scope, elem, attr, API) {
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

					scope.$apply();
				}

				function onSetVolume(newVolume) {
					scope.currentVolume = newVolume;

					// TODO: Save volume with LocalStorage
					// if it's not muted we save the default volume
					if (!isMuted) {
						scope.defaultVolume = newVolume;
					}
					else {
						// if was muted but the user changed the volume
						if (newVolume > 0) {
							scope.defaultVolume = newVolume;
						}
					}

					var percentValue = Math.round(newVolume * 100);
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
				}

				scope.defaultVolume = 1;
				scope.currentVolume = scope.defaultVolume;
				scope.muteIcon = {level3: true};

				//TODO: get volume from localStorage
				elem.bind("click", onClickMute);

				scope.$watch(
					function () {
						return API.volume;
					},
					function (newVal, oldVal) {
						if (newVal != oldVal) {
							onSetVolume(newVal);
						}
					}
				);
			}
		}
	}
	])
	.directive(
	"vgFullscreenbutton",
	[function () {
		return {
			restrict: "AE",
			require: "^videogular",
			scope: {
				vgEnterFullScreenIcon: "=",
				vgExitFullScreenIcon: "="
			},
			template: "<div class='iconButton' ng-class='fullscreenIcon'></div>",
			link: function (scope, elem, attr, API) {
				function onChangeFullScreen(isFullScreen) {
					var result;

					if (isFullScreen) {
						result = {exit: isFullScreen};
					}
					else {
						result = {enter: isFullScreen};
					}

					scope.fullscreenIcon = result;
				}

				function onClickFullScreen(event) {
					API.toggleFullScreen();

					scope.$apply();
				}

				elem.bind("click", onClickFullScreen);
				scope.fullscreenIcon = {exit: false};
				scope.fullscreenIcon = {enter: true};

				scope.$watch(
					function () {
						return API.isFullScreen;
					},
					function (newVal, oldVal) {
						if (newVal != oldVal) {
							onChangeFullScreen(newVal);
						}
					}
				);
			}
		}
	}
	]);
