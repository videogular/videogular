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
				}

				function onUpdateSize(target, params) {
					w = params[0];
					h = params[1];

					controlBarHeight = elem[0].clientHeight;

					TweenLite.killTweensOf(elem);
					isShowing = false;

					elem.css("top", (parseInt(h, 10) - parseInt(controlBarHeight, 10)) + "px");
				}

				function onSetState(target, params) {
					switch (params[0]) {
						case VG_STATES.PLAY:
							break;

						case VG_STATES.PAUSE:
							break;

						case VG_STATES.STOP:
							break;
					}
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
						hideInterval = $timeout(hideControls, 3000);
					}
				}

				function onShowControls() {
					isShowing = false;
				}

				function onPlayerReady() {
					elem.css("display", "table");
				}

				var w = 0;
				var h = 0;
				var isShowing = false;
				var controlBarHeight = elem[0].clientHeight;
				var displayStyle = elem.css("display");
				var autoHide = (attrs.vgAutohide == "true");
				if (autoHide) {
					scope.videogularElement.bind("mousemove", onMouseMove);
					var hideInterval = $timeout(hideControls, 3000);
				}

				elem.css("display", "none");
				scope.$on(VG_EVENTS.ON_ENTER_FULLSCREEN, onEnterFullscreen);
				scope.$on(VG_EVENTS.ON_UPDATE_SIZE, onUpdateSize);
				scope.$on(VG_EVENTS.ON_SET_STATE, onSetState);
				scope.$on(VG_EVENTS.ON_PLAYER_READY, onPlayerReady);
			}
		}
	}
);

controlBarPluginDirectives.directive("vgPlaypausebutton", function(VG_EVENTS, VG_STATES, VG_THEMES){
		return {
			restrict: "E",
			template: "<div class='iconButton' ng-bind-html='playPauseIcon'></div>",
			link: function(scope, elem, attrs) {
				function onClickPlayPause($event) {
					scope.$emit(VG_EVENTS.ON_PLAY);
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

					scope.$apply();
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
					scope.percentTime = Math.round((params[0] / params[1]) * 100);
				}

				function onStartPlaying(target, params) {
					var mm = Math.floor(params[0] / 60);
					var ss = Math.floor(params[0] - (mm * 60));
					var mins = mm < 10 ? "0" + mm : mm;
					var secs = ss < 10 ? "0" + ss : ss;

					scope.totalTime = mins + ":" + secs;
				}

				function onPlayerReady() {
					//TODO: This is ugly... maybe there's a better way to change width through CSS
					var dimensions = VG_UTILS.calculateWordDimensions(elem[0].textContent, ["vgTimeDisplay"]);
					elem.css("width", dimensions.width + 20 + "px");
				}

				scope.currentTime = "00:00";
				scope.totalTime = "00:00";
				scope.percentTime = 0;

				scope.$on(VG_EVENTS.ON_START_PLAYING, onStartPlaying);
				scope.$on(VG_EVENTS.ON_UPDATE_TIME, onUpdateTime);
				scope.$on(VG_EVENTS.ON_PLAYER_READY, onPlayerReady);
			}
		}
	}
);

controlBarPluginDirectives.directive("vgScrubbar", function(VG_EVENTS){
		return {
			restrict: "E",
			replace: true,
			link: function(scope, elem, attrs) {
				function onScrubBarClick($event) {
					scope.isSeeking = false;
					seekTime($event.offsetX * scope.videoElement[0].duration / elem[0].scrollWidth);
				}
				function onScrubBarMouseDown($event) {
					scope.isSeeking = true;
					seekTime($event.offsetX * scope.videoElement[0].duration / elem[0].scrollWidth);
				}
				function onScrubBarMouseUp($event) {
					scope.isSeeking = false;
					seekTime($event.offsetX * scope.videoElement[0].duration / elem[0].scrollWidth);
				}
				function onScrubBarMouseMove($event) {
					if (scope.isSeeking) {
						seekTime($event.offsetX * scope.videoElement[0].duration / elem[0].scrollWidth);
					}
				}
				function onScrubBarMouseLeave($event) {
					scope.isSeeking = false;
				}
				function seekTime(time) {
					scope.$emit(VG_EVENTS.ON_SEEK_TIME, [time]);
				}

				scope.isSeeking = false;

				elem.bind("click", onScrubBarClick);
				elem.bind("mousedown", onScrubBarMouseDown);
				elem.bind("mouseup", onScrubBarMouseUp);
				elem.bind("mousemove", onScrubBarMouseMove);
				elem.bind("mouseleave", onScrubBarMouseLeave);
			}
		}
	}
);

controlBarPluginDirectives.directive("vgScrubbarcurrenttime", function(){
		return {
			restrict: "AE",
			link: function(scope, elem, attrs) {
				function onUpdateTime(newModel){
					elem.css("width", newModel + "%");
				}

				scope.$watch("percentTime", onUpdateTime, true);
			}
		}
	}
);

controlBarPluginDirectives.directive("vgVolume", function() {
		return {
			restrict: "E",
			link: function(scope, elem, attrs) {
				function onMouseOverVolume() {
					volumeBar.css("display", "block");
				}

				function onMouseLeaveVolume() {
					volumeBar.css("display", "none");
				}

				var volumeBar = angular.element(elem).find("vg-volumebar");
				if (volumeBar[0]) {
					elem.bind("mouseover", onMouseOverVolume);
					elem.bind("mouseleave", onMouseLeaveVolume);
					volumeBar.css("display", "none");
				}
			}
		}
	}
);

controlBarPluginDirectives.directive("vgVolumebar", function(VG_EVENTS) {
		return {
			restrict: "E",
			template:
				"<div class='verticalVolumeBar'>" +
					"<div class='volumeBackground'>" +
						"<div class='volumeValue'></div>" +
						"<div class='volumeClickArea'></div>" +
					"</div>" +
				"</div>",
			link: function(scope, elem, attrs) {
				function onClickVolume($event) {
					var volumeHeight = parseInt(volumeBackElem.prop("offsetHeight"));
					var value = $event.offsetY * 100 / volumeHeight;
					var volValue = 1 - (value / 100);
					updateVolumeView(value);

					scope.$emit(VG_EVENTS.ON_SET_VOLUME, [volValue]);
					scope.$apply();
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
						var volumeHeight = parseInt(volumeBackElem.prop("offsetHeight"));
						var value = $event.offsetY * 100 / volumeHeight;
						var volValue = 1 - (value / 100);
						updateVolumeView(value);

						scope.$emit(VG_EVENTS.ON_SET_VOLUME, [volValue]);
						scope.$apply();
					}
				}

				function updateVolumeView(value) {
					volumeValueElem.css("height", value + "%");
					volumeValueElem.css("top", (100 - value) + "%");
				}

				function onSetVolume(target, params) {
					updateVolumeView(params[0] * 100);
				}

				var isChangingVolume = false;
				var volumeBackElem = angular.element(elem[0].getElementsByClassName("volumeBackground"));
				var volumeValueElem = angular.element(elem[0].getElementsByClassName("volumeValue"));

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
			restrict: "E",
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
					scope.$apply();
				}

				function onSetVolume(target, params) {
					scope.currentVolume = params[0];

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
			restrict: "E",
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


				if (!screenfull.enabled) {
					scope.css("display", "none");
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
