/**
 * @license Videogular v0.6.3 http://videogular.com
 * Two Fucking Developers http://twofuckingdevelopers.com
 * License: MIT
 */
/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls:vgControls
 * @restrict E
 * @description
 * This directive acts as a container and you will need other directives to control the media.
 * Inside this directive you can add other directives like vg-play-pause-button and vg-scrubbar.
 *
 * @param {boolean=false} vgAutohide Boolean variable or value to activate autohide.
 * @param {number=2000} vgAutohideTime Number variable or value that represents the time in milliseconds that will wait vgControls until it hides.
 *
 * ```html
 * <videogular vg-theme="config.theme.url">
 *    <vg-video vg-src="sources"></vg-video>
 *
 *    <vg-controls vg-autohide='config.autohide' vg-autohide-time='config.autohideTime'></vg-controls>
 * </videogular>
 * ```
 *
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
			template: '<div id="controls-container" ng-mousemove="onMouseMove()" ng-class="animationClass" ng-transclude></div>',
			scope: {
				autoHide: "=vgAutohide",
				autoHideTime: "=vgAutohideTime"
			},
			link: function (scope, elem, attr, API) {
				var w = 0;
				var h = 0;
				var autoHideTime = 2000;
				var hideInterval;

				scope.onMouseMove = function onMouseMove() {
					if (scope.autoHide) showControls();
				};

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
						}
						else {
							scope.animationClass = "";
							$timeout.cancel(hideInterval);
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
/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls:vgPlayPauseButton
 * @restrict E
 * @description
 * Adds a button inside vg-controls to play and pause media.
 *
 * ```html
 * <videogular vg-theme="config.theme.url">
 *    <vg-video vg-src="sources"></vg-video>
 *
 *    <vg-controls vg-autohide='config.autohide' vg-autohide-time='config.autohideTime'>
 *        <vg-play-pause-button></vg-play-pause-button>
 *    </vg-controls>
 * </videogular>
 * ```
 *
 */
	.directive(
	"vgPlayPauseButton",
	["VG_STATES", function (VG_STATES) {
		return {
			restrict: "E",
			require: "^videogular",
			template: "<button class='iconButton' ng-click='onClickPlayPause()' ng-class='playPauseIcon' aria-label='Play/Pause'></button>",
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

				scope.onClickPlayPause = function onClickPlayPause() {
					API.playPause();
				};

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
			}
		}
	}
	])
/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls:vgTimedisplay
 * @restrict E
 * @description
 * Adds a time display inside vg-controls to play and pause media.
 * You have three scope variables to show current time, time left and total time.
 *
 * Those scope variables are type Date so you can add a date filter to show the time as you wish.
 *
 * ```html
 * <videogular vg-theme="config.theme.url">
 *    <vg-video vg-src="sources"></vg-video>
 *
 *    <vg-controls vg-autohide='config.autohide' vg-autohide-time='config.autohideTime'>
 *        <vg-timedisplay>{{currentTime | date:'hh:mm'}}</vg-timedisplay>
 *        <vg-timedisplay>{{timeLeft | date:'mm:ss'}}</vg-timedisplay>
 *        <vg-timedisplay>{{totalTime | date:'hh:mm:ss'}}</vg-timedisplay>
 *    </vg-controls>
 * </videogular>
 * ```
 *
 */
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
/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls:vgScrubbar
 * @restrict E
 * @description
 * Directive to control the time and display other information layers about the progress of the media.
 * This directive acts as a container and you can add more layers to display current time, cuepoints, buffer or whatever you need.
 *
 * ```html
 * <videogular vg-theme="config.theme.url">
 *    <vg-video vg-src="sources"></vg-video>
 *
 *    <vg-controls vg-autohide='config.autohide' vg-autohide-time='config.autohideTime'>
 *        <vg-scrubbar></vg-scrubbar>
 *    </vg-controls>
 * </videogular>
 * ```
 *
 */
	.directive(
	"vgScrubbar",
	["VG_STATES", "VG_UTILS", function (VG_STATES, VG_UTILS) {
		return {
			restrict: "AE",
			require: "^videogular",
			transclude: true,
			template: '<div role="slider" aria-valuemax="{{ariaTime(API.totalTime)}}" ' +
					'aria-valuenow="{{ariaTime(API.currentTime)}}" ' +
					'aria-valuemin="0" aria-label="Time scrub bar" tabindex="0" ' +
			        'ng-transclude ng-keydown="onScrubBarKeyDown($event)"></div>',
			link: function (scope, elem, attr, API) {
				var isSeeking = false;
				var isPlaying = false;
				var isPlayingWhenSeeking = false;
				var touchStartX = 0;
				var LEFT = 37;
				var RIGHT = 39;
				var NUM_PERCENT = 1;

				scope.API = API;
				scope.ariaTime = function(time) {
					return (time === 0) ? "0" : Math.round(time.getTime() / 1000);
				};

				function onScrubBarTouchStart($event) {
					var event = $event.originalEvent || $event;
					var touches = event.touches;
					var touchX;

					if (VG_UTILS.isiOSDevice()) {
						touchStartX = (touches[0].clientX - event.layerX) * -1;
					}
					else {
						touchStartX = event.layerX;
					}

					touchX = touches[0].clientX + touchStartX - touches[0].target.offsetLeft;

					isSeeking = true;
					if (isPlaying) isPlayingWhenSeeking = true;
					API.pause();
					seekTime(touchX * API.mediaElement[0].duration / elem[0].scrollWidth);

					scope.$apply();
				}

				function onScrubBarTouchMove($event) {
					var event = $event.originalEvent || $event;
					if (isPlayingWhenSeeking) {
						isPlayingWhenSeeking = false;
						API.play();
					}
					isSeeking = false;

					scope.$apply();
				}

				function onScrubBarTouchMove($event) {
					var event = $event.originalEvent || $event;
					var touches = event.touches;
					var touchX;

					if (isSeeking) {
						touchX = touches[0].clientX + touchStartX - touches[0].target.offsetLeft;
						seekTime(touchX * API.mediaElement[0].duration / elem[0].scrollWidth);
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
					seekTime(event.offsetX * API.mediaElement[0].duration / elem[0].scrollWidth);

					scope.$apply();
				}

				function onScrubBarMouseUp(event) {
					event = VG_UTILS.fixEventOffset(event);

					if (isPlayingWhenSeeking) {
						isPlayingWhenSeeking = false;
						API.play();
					}
					isSeeking = false;
					seekTime(event.offsetX * API.mediaElement[0].duration / elem[0].scrollWidth);

					scope.$apply();
				}

				function onScrubBarMouseMove(event) {
					if (isSeeking) {
						event = VG_UTILS.fixEventOffset(event);
						seekTime(event.offsetX * API.mediaElement[0].duration / elem[0].scrollWidth);
					}

					scope.$apply();
				}

				function onScrubBarMouseLeave(event) {
					isSeeking = false;

					scope.$apply();
				}

				scope.onScrubBarKeyDown = function(event) {
					var currentPercent = API.currentTime.getTime() / API.totalTime.getTime() * 100;

					if (event.which === LEFT || event.keyCode === LEFT) {
						API.seekTime(currentPercent - NUM_PERCENT, true);
						event.preventDefault();
					}
					else if (event.which === RIGHT || event.keyCode === RIGHT) {
						API.seekTime(currentPercent + NUM_PERCENT, true);
						event.preventDefault();
					}
				};

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
/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls:vgScrubbarcurrenttime
 * @restrict E
 * @description
 * Layer inside vg-scrubbar to display the current time.
 *
 * ```html
 * <videogular vg-theme="config.theme.url">
 *    <vg-video vg-src="sources"></vg-video>
 *
 *    <vg-controls vg-autohide='config.autohide' vg-autohide-time='config.autohideTime'>
 *        <vg-scrubbar>
 *            <vg-scrubbarcurrenttime></vg-scrubbarcurrenttime>
 *        </vg-scrubbar>
 *    </vg-controls>
 * </videogular>
 * ```
 *
 */
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
/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls:vgVolume
 * @restrict E
 * @description
 * Directive to control the volume.
 * This directive acts as a container and you will need other directives like vg-mutebutton and vg-volumebar to control the volume.
 * In mobile will be hided since volume API is disabled for mobile devices.
 *
 * ```html
 * <videogular vg-theme="config.theme.url">
 *    <vg-video vg-src="sources"></vg-video>
 *
 *    <vg-controls vg-autohide='config.autohide' vg-autohide-time='config.autohideTime'>
 *        <vg-volume></vg-volume>
 *    </vg-controls>
 * </videogular>
 * ```
 *
 */
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
/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls:vgVolumebar
 * @restrict E
 * @description
 * Directive to display a vertical volume bar to control the volume.
 * This directive must be inside vg-volume directive and requires vg-mutebutton to be displayed.
 *
 * ```html
 * <videogular vg-theme="config.theme.url">
 *    <vg-video vg-src="sources"></vg-video>
 *
 *    <vg-controls vg-autohide='config.autohide' vg-autohide-time='config.autohideTime'>
 *        <vg-volume>
 *            <vg-mutebutton><vg-mutebutton>
 *            <vg-volumebar><vg-volumebar>
 *        </vg-volume>
 *    </vg-controls>
 * </videogular>
 * ```
 *
 */
	.directive(
	"vgVolumebar",
	["VG_UTILS", function (VG_UTILS) {
		return {
			restrict: "E",
			require: "^videogular",
			template: "<div class='verticalVolumeBar'>" +
				"<div class='volumeBackground' ng-click='onClickVolume($event)' ng-mousedown='onMouseDownVolume()' ng-mouseup='onMouseUpVolume()' ng-mousemove='onMouseMoveVolume($event)' ng-mouseleave='onMouseLeaveVolume()'>" +
				"<div class='volumeValue'></div>" +
				"<div class='volumeClickArea'></div>" +
				"</div>" +
				"</div>",
			link: function (scope, elem, attr, API) {
				var isChangingVolume = false;
				var volumeBackElem = angular.element(elem[0].getElementsByClassName("volumeBackground"));
				var volumeValueElem = angular.element(elem[0].getElementsByClassName("volumeValue"));

				scope.onClickVolume = function onClickVolume(event) {
					event = VG_UTILS.fixEventOffset(event);
					var volumeHeight = parseInt(volumeBackElem.prop("offsetHeight"));
					var value = event.offsetY * 100 / volumeHeight;
					var volValue = 1 - (value / 100);

					API.setVolume(volValue);
				};

				scope.onMouseDownVolume = function onMouseDownVolume() {
					isChangingVolume = true;
				};

				scope.onMouseUpVolume = function onMouseUpVolume() {
					isChangingVolume = false;
				};

				scope.onMouseLeaveVolume = function onMouseLeaveVolume() {
					isChangingVolume = false;
				};

				scope.onMouseMoveVolume = function onMouseMoveVolume(event) {
					if (isChangingVolume) {
						event = VG_UTILS.fixEventOffset(event);
						var volumeHeight = parseInt(volumeBackElem.prop("offsetHeight"));
						var value = event.offsetY * 100 / volumeHeight;
						var volValue = 1 - (value / 100);

						API.setVolume(volValue);
					}
				};

				function updateVolumeView(value) {
					value = value * 100;
					volumeValueElem.css("height", value + "%");
					volumeValueElem.css("top", (100 - value) + "%");
				}

				function onChangeVisibility(value) {
					elem.css("visibility", value);
				}

				elem.css("visibility", scope.volumeVisibility);

				scope.$watch("volumeVisibility", onChangeVisibility);

				scope.$watch(
					function () {
						return API.volume;
					},
					function (newVal, oldVal) {
						if (newVal != oldVal) {
							updateVolumeView(newVal);
						}
					}
				);
			}
		}
	}
	])
/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls:vgMutebutton
 * @restrict E
 * @description
 * Directive to display a button to mute volume.
 *
 * ```html
 * <videogular vg-theme="config.theme.url">
 *    <vg-video vg-src="sources"></vg-video>
 *
 *    <vg-controls vg-autohide='config.autohide' vg-autohide-time='config.autohideTime'>
 *        <vg-volume>
 *            <vg-mutebutton><vg-mutebutton>
 *        </vg-volume>
 *    </vg-controls>
 * </videogular>
 * ```
 *
 */
	.directive(
	"vgMutebutton",
	[function () {
		return {
			restrict: "E",
			require: "^videogular",
			template: "<button class='iconButton' ng-class='muteIcon'" +
				" ng-click='onClickMute()' ng-focus='onMuteButtonFocus()' ng-blur='onMuteButtonLoseFocus()' ng-keydown='onMuteButtonKeyDown($event)'" +
				" aria-label='Mute'></button>",
			link: function (scope, elem, attr, API) {
				var isMuted = false;
				var UP = 38;
				var DOWN = 40;
				var CHANGE_PER_PRESS = 0.05;

				scope.onClickMute = function onClickMute() {
					if (isMuted) {
						scope.currentVolume = scope.defaultVolume;
					}
					else {
						scope.currentVolume = 0;
						scope.muteIcon = {mute: true};
					}

					isMuted = !isMuted;

					API.setVolume(scope.currentVolume);
				};

				scope.onMuteButtonFocus = function() {
					scope.volumeVisibility = 'visible';
				};

				scope.onMuteButtonLoseFocus = function() {
					scope.volumeVisibility = 'hidden';
				};

				scope.onMuteButtonKeyDown = function(event) {
					var currentVolume = (API.volume != null) ? API.volume : 1;
          var newVolume;

					if (event.which === UP || event.keyCode === UP) {
            newVolume = currentVolume + CHANGE_PER_PRESS;
            if (newVolume > 1) newVolume = 1;

						API.setVolume(newVolume);
						event.preventDefault();
					}
					else if (event.which === DOWN || event.keyCode === DOWN) {
            newVolume = currentVolume - CHANGE_PER_PRESS;
            if (newVolume < 0) newVolume = 0;

						API.setVolume(newVolume);
						event.preventDefault();
					}
				};

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
/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls:vgFullscreenbutton
 * @restrict E
 * @description
 * Directive to switch between fullscreen and normal mode.
 *
 * ```html
 * <videogular vg-theme="config.theme.url">
 *    <vg-video vg-src="sources"></vg-video>
 *
 *    <vg-controls vg-autohide='config.autohide' vg-autohide-time='config.autohideTime'>
 *        <vg-fullscreenbutton></vg-fullscreenbutton>
 *    </vg-controls>
 * </videogular>
 * ```
 *
 */
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
			template: "<button class='iconButton' ng-click='onClickFullScreen()' ng-class='fullscreenIcon' aria-label='Toggle full screen'></button>",
			link: function (scope, elem, attr, API) {
				function onChangeFullScreen(isFullScreen) {
					scope.fullscreenIcon = {enter: !isFullScreen, exit: isFullScreen};
				}

				scope.onClickFullScreen = function onClickFullScreen() {
					API.toggleFullScreen();
				};

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
