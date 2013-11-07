"use strict";
// ControlBar plugin
var controlBarPluginDirectives = angular.module("com.2fdevs.videogular.plugins.controlbar", []);

controlBarPluginDirectives.directive("vgControls", function($timeout, VG_EVENTS, VG_STATES){
		return {
			restrict: "AE",
			link: function(scope, elem, attrs) {
				function onEnterFullscreen(target, params) {
					TweenLite.killTweensOf(elem);
					isShowing = false;
					hideInterval = $timeout(hideControls, autoHideTime);

					if (!isBinding) {
						isBinding = true;
						scope.videogularElement.bind("mousemove", onMouseMove);
					}
				}

				function onExitFullscreen(target, params) {
					TweenLite.killTweensOf(elem);
					isShowing = false;

					if (autoHide) {
						hideInterval = $timeout(hideControls, autoHideTime);
					}
					else {
						$timeout.cancel(hideInterval);
						isBinding = false;
						scope.videogularElement.unbind("mousemove", onMouseMove);
					}
				}

				function onUpdateSize(target, params) {
					w = params[0];
					h = params[1];

					TweenLite.killTweensOf(elem);
					isShowing = false;

					elem.css("top", (parseInt(h, 10) - parseInt(controlBarHeight, 10)) + "px");
				}

				function onMouseMove() {
					showControls();
				}

				function hideControls() {
					TweenLite.to(elem, 0.5, {top: parseInt(h, 10)});
				}

				function showControls() {
					if (!isShowing)
					{
						isShowing = true;
						TweenLite.to(elem, 0.5, {top: (parseInt(h, 10) - parseInt(controlBarHeight, 10)), onComplete: onShowControls});
						$timeout.cancel(hideInterval);
						if (isBinding) hideInterval = $timeout(hideControls, autoHideTime);
					}
				}

				function onShowControls() {
					isShowing = false;
				}

				function onPlayerReady() {
					elem.css("display", "table");
				}

				function updateAutohide(value) {
					autoHide = value;

					if (autoHide) {
						isBinding = true;
						scope.videogularElement.bind("mousemove", onMouseMove);
						hideInterval = $timeout(hideControls, autoHideTime);
					}
					else {
						if (isBinding) {
							isBinding = false;
							scope.videogularElement.unbind("mousemove", onMouseMove);
						}
						$timeout.cancel(hideInterval);
						showControls();
					}
				}

				var w = 0;
				var h = 0;
				var autoHideTime = 5000;
				var isShowing = false;
				var isBinding = false;
				var controlBarHeight = elem[0].clientHeight;
				var autoHide;
				var hideInterval;

				if (attrs.vgAutohide == "true" || attrs.vgAutohide == "false") {
					updateAutohide((attrs.vgAutohide == "true"));
				}
				else {
					scope.$watch(attrs.vgAutohide, function(value) {
						updateAutohide(value);
					});
				}

				elem.css("display", "none");
				scope.$on(VG_EVENTS.ON_ENTER_FULLSCREEN, onEnterFullscreen);
				scope.$on(VG_EVENTS.ON_EXIT_FULLSCREEN, onExitFullscreen);
				scope.$on(VG_EVENTS.ON_UPDATE_SIZE, onUpdateSize);
				scope.$on(VG_EVENTS.ON_PLAYER_READY, onPlayerReady);
			}
		}
	}
);

controlBarPluginDirectives.directive("vgPlaypausebutton", function(VG_EVENTS, VG_STATES, VG_THEMES){
		return {
			restrict: "AE",
			template: "<div class='iconButton' ng-bind-html='playPauseIcon'></div>",
			link: function(scope, elem, attrs) {
				function onClickPlayPause($event) {
					scope.$emit(VG_EVENTS.ON_PLAY_PAUSE);
				}

				function onChangeState(target, params) {
					switch (params[0]) {
						case VG_STATES.PLAY:
							scope.playPauseIcon = VG_THEMES.PAUSE;
							break;

						case VG_STATES.PAUSE:
							scope.playPauseIcon = VG_THEMES.PLAY;
							break;

						case VG_STATES.STOP:
							scope.playPauseIcon = VG_THEMES.PLAY;
							break;
					}
				}

				scope.playPauseIcon = VG_THEMES.PLAY;

				elem.bind("click", onClickPlayPause);

				scope.$on(VG_EVENTS.ON_SET_STATE, onChangeState);
			}
		}
	}
);

controlBarPluginDirectives.directive("vgTimedisplay", function(VG_EVENTS, VG_UTILS){
		return {
			restrict: "AE",
			link: function(scope, elem, attrs) {
				function onUpdateTime(target, params) {
					var mm = Math.floor(params[0] / 60);
					var ss = Math.floor(params[0] - (mm * 60));
					var mins = mm < 10 ? "0" + mm : mm;
					var secs = ss < 10 ? "0" + ss : ss;

					scope.currentTime = mins + ":" + secs;
				}

				function onComplete(target, params) {
					scope.currentTime = "00:00";
				}

				function onStartPlaying(target, params) {
					var mm = Math.floor(params[0] / 60);
					var ss = Math.floor(params[0] - (mm * 60));
					var mins = mm < 10 ? "0" + mm : mm;
					var secs = ss < 10 ? "0" + ss : ss;

					scope.totalTime = mins + ":" + secs;
				}

				scope.currentTime = "00:00";
				scope.totalTime = "00:00";

				scope.$on(VG_EVENTS.ON_START_PLAYING, onStartPlaying);
				scope.$on(VG_EVENTS.ON_UPDATE_TIME, onUpdateTime);
				scope.$on(VG_EVENTS.ON_COMPLETE, onComplete);
			}
		}
	}
);

controlBarPluginDirectives.directive("vgScrubbar", function(VG_EVENTS, VG_STATES, VG_UTILS){
		return {
			restrict: "AE",
			replace: true,
			link: function(scope, elem, attrs) {
				function onScrubBarTouchStart($event) {
					if (VG_UTILS.isiOSDevice()) {
						iOSTouchStartX = ($event.touches[0].clientX - $event.layerX) * -1;
					}
					else {
						iOSTouchStartX = $event.layerX;
					}

					var touchX = $event.touches[0].clientX + iOSTouchStartX - $event.touches[0].target.offsetLeft;

					isSeeking = true;
					if (isPlaying) isPlayingWhenSeeking = true;
					seekTime(touchX * scope.videoElement[0].duration / elem[0].scrollWidth);
					scope.$emit(VG_EVENTS.ON_PAUSE);
				}
				function onScrubBarTouchEnd($event) {
					if (isPlayingWhenSeeking) {
						isPlayingWhenSeeking = false;
						scope.$emit(VG_EVENTS.ON_PLAY);
					}
					isSeeking = false;
				}
				function onScrubBarTouchMove($event) {
					if (isSeeking) {
						var touchX = $event.touches[0].clientX + iOSTouchStartX - $event.touches[0].target.offsetLeft;
						seekTime(touchX * scope.videoElement[0].duration / elem[0].scrollWidth);
					}
				}
				function onScrubBarTouchLeave($event) {
					isSeeking = false;
				}

				function onScrubBarMouseDown($event) {
					$event = VG_UTILS.fixEventOffset($event);

					isSeeking = true;
					if (isPlaying) isPlayingWhenSeeking = true;
					seekTime($event.offsetX * scope.videoElement[0].duration / elem[0].scrollWidth);
					scope.$emit(VG_EVENTS.ON_PAUSE);
				}
				function onScrubBarMouseUp($event) {
					$event = VG_UTILS.fixEventOffset($event);

					if (isPlayingWhenSeeking) {
						isPlayingWhenSeeking = false;
						scope.$emit(VG_EVENTS.ON_PLAY);
					}
					isSeeking = false;
					seekTime($event.offsetX * scope.videoElement[0].duration / elem[0].scrollWidth);
				}
				function onScrubBarMouseMove($event) {
					if (isSeeking) {
						$event = VG_UTILS.fixEventOffset($event);
						seekTime($event.offsetX * scope.videoElement[0].duration / elem[0].scrollWidth);
					}
				}
				function onScrubBarMouseLeave($event) {
					isSeeking = false;
				}
				function seekTime(time) {
					scope.$emit(VG_EVENTS.ON_SEEK_TIME, [time]);
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

				var isSeeking = false;
				var isPlaying = false;
				var isPlayingWhenSeeking = false;
				var iOSTouchStartX = 0;

				scope.$on(VG_EVENTS.ON_SET_STATE, onChangeState);

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
);

controlBarPluginDirectives.directive("vgScrubbarcurrenttime", function(VG_EVENTS){
		return {
			restrict: "AE",
			link: function(scope, elem, attrs) {
				function onUpdateTime(target, params){
					scope.percentTime = Math.round((params[0] / params[1]) * 100);
					elem.css("width", scope.percentTime + "%");
				}

				function onComplete(target, params){
					scope.percentTime = 0;
					elem.css("width", scope.percentTime + "%");
				}

				scope.$on(VG_EVENTS.ON_UPDATE_TIME, onUpdateTime);
				scope.$on(VG_EVENTS.ON_COMPLETE, onComplete);
			}
		}
	}
);

controlBarPluginDirectives.directive("vgVolume", function(VG_UTILS) {
		return {
			restrict: "AE",
			link: function(scope, elem, attrs) {
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
);

controlBarPluginDirectives.directive("vgVolumebar", function(VG_EVENTS, VG_UTILS) {
		return {
			restrict: "AE",
			template:
				"<div class='verticalVolumeBar'>" +
					"<div class='volumeBackground'>" +
						"<div class='volumeValue'></div>" +
						"<div class='volumeClickArea'></div>" +
					"</div>" +
				"</div>",
			link: function(scope, elem, attrs) {
				function onClickVolume($event) {
					$event = VG_UTILS.fixEventOffset($event);
					var volumeHeight = parseInt(volumeBackElem.prop("offsetHeight"));
					var value = $event.offsetY * 100 / volumeHeight;
					var volValue = 1 - (value / 100);
					updateVolumeView(value);

					scope.$emit(VG_EVENTS.ON_SET_VOLUME, [volValue]);
				}

				function onMouseDownVolume($event) {
					isChangingVolume = true;
				}

				function onMouseUpVolume($event) {
					isChangingVolume = false;
				}

				function onMouseLeaveVolume($event) {
					isChangingVolume = false;
				}

				function onMouseMoveVolume($event) {
					if (isChangingVolume) {
						$event = VG_UTILS.fixEventOffset($event);
						var volumeHeight = parseInt(volumeBackElem.prop("offsetHeight"));
						var value = $event.offsetY * 100 / volumeHeight;
						var volValue = 1 - (value / 100);
						updateVolumeView(value);

						scope.$emit(VG_EVENTS.ON_SET_VOLUME, [volValue]);
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
					elem.css("visibility", scope.volumeVisibility);
				}

				var isChangingVolume = false;
				var volumeBackElem = angular.element(elem[0].getElementsByClassName("volumeBackground"));
				var volumeValueElem = angular.element(elem[0].getElementsByClassName("volumeValue"));

				elem.css("visibility", scope.volumeVisibility);

				scope.$watch("volumeVisibility", onChangeVisibility);

				volumeBackElem.bind("click", onClickVolume);
				volumeBackElem.bind("mousedown", onMouseDownVolume);
				volumeBackElem.bind("mouseup", onMouseUpVolume);
				volumeBackElem.bind("mousemove", onMouseMoveVolume);
				volumeBackElem.bind("mouseleave", onMouseLeaveVolume);

				scope.$on(VG_EVENTS.ON_SET_VOLUME, onSetVolume);
			}
		}
	}
);

controlBarPluginDirectives.directive("vgMutebutton", function(VG_EVENTS, VG_THEMES) {
		return {
			restrict: "AE",
			template: "<div class='iconButton' ng-bind-html='muteIcon'></div>",
			link: function(scope, elem, attrs) {
				function onClickMute($event) {
					if (scope.muteIcon == VG_THEMES.VOLUME_MUTE) {
						scope.currentVolume = scope.defaultVolume;
					}
					else {
						scope.currentVolume = 0;
						scope.muteIcon = VG_THEMES.VOLUME_MUTE;
					}

					scope.$emit(VG_EVENTS.ON_SET_VOLUME, [scope.currentVolume]);
				}

				function onSetVolume(target, params) {
					scope.currentVolume = params[0];

					// TODO: Save volume with LocalStorage
					// if it's not muted we save the default volume
					if (scope.muteIcon != VG_THEMES.VOLUME_MUTE) {
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
						scope.muteIcon = VG_THEMES.VOLUME_MUTE;
					}
					else if (percentValue > 0 && percentValue < 25) {
						scope.muteIcon = VG_THEMES.VOLUME_LEVEL_0;
					}
					else if (percentValue >= 25 && percentValue < 50) {
						scope.muteIcon = VG_THEMES.VOLUME_LEVEL_1;
					}
					else if (percentValue >= 50 && percentValue < 75) {
						scope.muteIcon = VG_THEMES.VOLUME_LEVEL_2;
					}
					else if (percentValue >= 75) {
						scope.muteIcon = VG_THEMES.VOLUME_LEVEL_3;
					}

					//TODO: remove this $apply(), plugins shouldn't have them
					scope.$apply();
				}

				scope.defaultVolume = 1;
				scope.currentVolume = scope.defaultVolume;
				scope.muteIcon = VG_THEMES.VOLUME_LEVEL_3;

				//TODO: get volume from localStorage

				elem.bind("click", onClickMute);

				scope.$on(VG_EVENTS.ON_SET_VOLUME, onSetVolume);
			}
		}
	}
);

controlBarPluginDirectives.directive("vgFullscreenbutton", function(VG_EVENTS, VG_THEMES){
		return {
			restrict: "AE",
			template: "<div class='iconButton' ng-bind-html='fullscreenIcon'></div>",
			link: function(scope, elem, attrs) {
				function onEnterFullScreen() {
					scope.fullscreenIcon = VG_THEMES.EXIT_FULLSCREEN;
				}
				function onExitFullScreen() {
					scope.fullscreenIcon = VG_THEMES.ENTER_FULLSCREEN;
				}
				function onClickFullScreen($event) {
					scope.$emit(VG_EVENTS.ON_TOGGLE_FULLSCREEN);
				}


				if (!window.fullScreenAPI) {
					var fullScreenButton = angular.element(elem[0]);
					fullScreenButton.css("display", "none");
				}
				else {
					scope.fullscreenIcon = VG_THEMES.ENTER_FULLSCREEN;

					elem.bind("click", onClickFullScreen);

					scope.$on(VG_EVENTS.ON_ENTER_FULLSCREEN, onEnterFullScreen);
					scope.$on(VG_EVENTS.ON_EXIT_FULLSCREEN, onExitFullScreen);
				}
			}
		}
	}
);
