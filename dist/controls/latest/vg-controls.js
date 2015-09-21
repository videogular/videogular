/**
 * @license videogular v1.2.7 http://videogular.com
 * Two Fucking Developers http://twofuckingdevelopers.com
 * License: MIT
 */
/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls.directive:vgControls
 * @restrict E
 * @description
 * This directive acts as a container and you will need other directives to control the media.
 * Inside this directive you can add other directives like vg-play-pause-button and vg-scrub-bar.
 *
 * <pre>
 * <videogular vg-theme="config.theme.url">
 *    <vg-media vg-src="sources"></vg-media>
 *
 *    <vg-controls vg-autohide='config.autohide' vg-autohide-time='config.autohideTime'></vg-controls>
 * </videogular>
 * </pre>
 *
 * @param {boolean=false} vgAutohide Boolean variable or value to activate autohide.
 * @param {number=2000} vgAutohideTime Number variable or value that represents the time in milliseconds that will wait vgControls until it hides.
 *
 *
 */
"use strict";
angular.module("com.2fdevs.videogular.plugins.controls", [])
    .run(
    ["$templateCache", function ($templateCache) {
        $templateCache.put("vg-templates/vg-controls",
            '<div class="controls-container" ng-mousemove="onMouseMove()" ng-class="animationClass" ng-transclude></div>');
    }]
)
    .directive("vgControls",
    ["$timeout", "VG_STATES", function ($timeout, VG_STATES) {
        return {
            restrict: "E",
            require: "^videogular",
            transclude: true,
            templateUrl: function (elem, attrs) {
                return attrs.vgTemplate || 'vg-templates/vg-controls';
            },
            scope: {
                vgAutohide: "=?",
                vgAutohideTime: "=?"
            },
            link: function (scope, elem, attr, API) {
                var w = 0;
                var h = 0;
                var autoHideTime = 2000;
                var hideInterval;

                scope.API = API;

                scope.onMouseMove = function onMouseMove() {
                    if (scope.vgAutohide) scope.showControls();
                };

                scope.setAutohide = function setAutohide(value) {
                    if (value && API.currentState == VG_STATES.PLAY) {
                        hideInterval = $timeout(scope.hideControls, autoHideTime);
                    }
                    else {
                        scope.animationClass = "";
                        $timeout.cancel(hideInterval);
                        scope.showControls();
                    }
                };

                scope.setAutohideTime = function setAutohideTime(value) {
                    autoHideTime = value;
                };

                scope.hideControls = function hideControls() {
                    scope.animationClass = "hide-animation";
                };

                scope.showControls = function showControls() {
                    scope.animationClass = "show-animation";
                    $timeout.cancel(hideInterval);
                    if (scope.vgAutohide && API.currentState == VG_STATES.PLAY) hideInterval = $timeout(scope.hideControls, autoHideTime);
                };

                if (API.isConfig) {
                    scope.$watch("API.config",
                        function () {
                            if (scope.API.config) {
                                var ahValue = scope.API.config.plugins.controls.autohide || false;
                                var ahtValue = scope.API.config.plugins.controls.autohideTime || 2000;
                                scope.vgAutohide = ahValue;
                                scope.vgAutohideTime = ahtValue;
                                scope.setAutohideTime(ahtValue);
                                scope.setAutohide(ahValue);
                            }
                        }
                    );
                }
                else {
                    // If vg-autohide has been set
                    if (scope.vgAutohide != undefined) {
                        scope.$watch("vgAutohide", scope.setAutohide);
                    }

                    // If vg-autohide-time has been set
                    if (scope.vgAutohideTime != undefined) {
                        scope.$watch("vgAutohideTime", scope.setAutohideTime);
                    }
                }


            }
        }
    }]
);

/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls.directive:vgFullscreenButton
 * @restrict E
 * @description
 * Directive to switch between fullscreen and normal mode.
 *
 * <pre>
 * <videogular vg-theme="config.theme.url">
 *    <vg-media vg-src="sources"></vg-media>
 *
 *    <vg-controls vg-autohide='config.autohide' vg-autohide-time='config.autohideTime'>
 *        <vg-fullscreen-button></vg-fullscreen-button>
 *    </vg-controls>
 * </videogular>
 * </pre>
 *
 */
angular.module("com.2fdevs.videogular.plugins.controls")
    .run(
    ["$templateCache", function ($templateCache) {
        $templateCache.put("vg-templates/vg-fullscreen-button",
            '<button class="iconButton" ng-click="onClickFullScreen()" ng-class="fullscreenIcon" aria-label="Toggle full screen" type="button"> </button>');
    }]
)
    .directive("vgFullscreenButton",
    [function () {
        return {
            restrict: "E",
            require: "^videogular",
            scope: {},
            templateUrl: function (elem, attrs) {
                return attrs.vgTemplate || 'vg-templates/vg-fullscreen-button';
            },
            link: function (scope, elem, attr, API) {
                scope.onChangeFullScreen = function onChangeFullScreen(isFullScreen) {
                    scope.fullscreenIcon = {enter: !isFullScreen, exit: isFullScreen};
                };

                scope.onClickFullScreen = function onClickFullScreen() {
                    API.toggleFullScreen();
                };

                scope.fullscreenIcon = {enter: true};

                scope.$watch(
                    function () {
                        return API.isFullScreen;
                    },
                    function (newVal, oldVal) {
                        if (newVal != oldVal) {
                            scope.onChangeFullScreen(newVal);
                        }
                    }
                );
            }
        }
    }]
);

/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls.directive:vgPlayPauseButton
 * @restrict E
 * @description
 * Adds a button inside vg-controls to play and pause media.
 *
 * <pre>
 * <videogular vg-theme="config.theme.url">
 *    <vg-media vg-src="sources"></vg-media>
 *
 *    <vg-controls vg-autohide='config.autohide' vg-autohide-time='config.autohideTime'>
 *        <vg-play-pause-button></vg-play-pause-button>
 *    </vg-controls>
 * </videogular>
 * </pre>
 *
 */
angular.module("com.2fdevs.videogular.plugins.controls")
    .run(
    ["$templateCache", function ($templateCache) {
        $templateCache.put("vg-templates/vg-play-pause-button",
            '<button class="iconButton" ng-click="onClickPlayPause()" ng-class="playPauseIcon" aria-label="Play/Pause" type="button"></button>');
    }]
)
    .directive("vgPlayPauseButton",
    ["VG_STATES", function (VG_STATES) {
        return {
            restrict: "E",
            require: "^videogular",
            scope: {},
            templateUrl: function (elem, attrs) {
                return attrs.vgTemplate || 'vg-templates/vg-play-pause-button';
            },
            link: function (scope, elem, attr, API) {
                scope.setState = function setState(newState) {
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
                };

                scope.onClickPlayPause = function onClickPlayPause() {
                    API.playPause();
                };

                scope.playPauseIcon = {play: true};

                scope.$watch(
                    function () {
                        return API.currentState;
                    },
                    function (newVal, oldVal) {
                        scope.setState(newVal);
                    }
                );
            }
        }
    }]
);

/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls.directive:ngPlaybackButton
 * @restrict E
 * @description
 * Directive to display a playback buttom to control the playback rate.
 *
 * <pre>
 * <videogular vg-theme="config.theme.url">
 *    <vg-media vg-src="sources"></vg-media>
 *
 *    <vg-controls vg-autohide='config.autohide' vg-autohide-time='config.autohideTime'>
 *        <vg-playback-button></vg-playback-button>
 *    </vg-controls>
 * </videogular>
 * </pre>
 *
 */
angular.module("com.2fdevs.videogular.plugins.controls")
    .run(
    ["$templateCache", function ($templateCache) {
        $templateCache.put("vg-templates/vg-playback-button",
            '<button class="playbackValue iconButton" ng-click="onClickPlayback()">{{playback}}x</button>');
    }]
)
    .directive("vgPlaybackButton",
    ["VG_UTILS", function (VG_UTILS) {
        return {
            restrict: "E",
            require: "^videogular",
            templateUrl: function (elem, attrs) {
                return attrs.vgTemplate || 'vg-templates/vg-playback-button';
            },
            link: function (scope, elem, attr, API) {

                scope.playback = '1.0';

                scope.onClickPlayback = function onClickPlayback() {

                    var playbackOptions = ['.5', '1.0', '1.5', '2.0'];

                    var nextPlaybackRate = playbackOptions.indexOf(scope.playback) + 1;

                    if (nextPlaybackRate >= playbackOptions.length) {
                        scope.playback = playbackOptions[0];
                    }
                    else {
                        scope.playback = playbackOptions[nextPlaybackRate];
                    }

                    API.setPlayback(scope.playback);
                };

                scope.$watch(
                    function () {
                        return API.playback;
                    }
                );
            }
        }
    }]
);
/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls.directive:vgScrubBarCuePoints
 * @restrict E
 * @description
 * Layer inside vg-scrub-bar to display a cue point timeline.
 *
 * <pre>
 * <videogular vg-theme="config.theme.url">
 *    <vg-media vg-src="sources"></vg-media>
 *
 *    <vg-controls>
 *        <vg-scrub-bar>
 *            <vg-scrub-bar-cue-points vg-cue-points='config.cuePoints[0]'></vg-scrub-bar-cue-points>
 *        </vg-scrub-bar>
 *    </vg-controls>
 * </videogular>
 * </pre>
 *
 */
angular.module("com.2fdevs.videogular.plugins.controls")
    .run(
    ["$templateCache", function ($templateCache) {
        $templateCache.put("vg-templates/vg-scrub-bar-cue-points",
            '<div class="cue-point-timeline" ng-style="timelineWidth">' +
            '<div ng-repeat="cuePoint in vgCuePoints" class="cue-point" ng-style="cuePoint.$$style"></div>' +
            '</div>');
    }]
)
    .directive("vgScrubBarCuePoints",
    [function () {
        return {
            restrict: "E",
            require: "^videogular",
            templateUrl: function (elem, attrs) {
                return attrs.vgTemplate || 'vg-templates/vg-scrub-bar-cue-points';
            },
            scope: {
                "vgCuePoints": "="
            },
            link: function (scope, elem, attr, API) {
                scope.onPlayerReady = function onPlayerReady() {
                    scope.updateCuePoints(scope.vgCuePoints);
                };

                scope.updateCuePoints = function onUpdateCuePoints(cuePoints) {
                    var totalWidth;

                    if (cuePoints) {
                        totalWidth = parseInt(elem[0].clientWidth);

                        for (var i = 0, l = cuePoints.length; i < l; i++) {
                            var cuePointDuration = (cuePoints[i].timeLapse.end - cuePoints[i].timeLapse.start) * 1000;
                            var position = (cuePoints[i].timeLapse.start * 100 / API.totalTime * 1000) + "%";
                            var percentWidth = 0;

                            if (typeof cuePointDuration === 'number' && API.totalTime) {
                                percentWidth = ((cuePointDuration * 100) / API.totalTime) + "%";
                            }

                            cuePoints[i].$$style = {
                                width: percentWidth,
                                left: position
                            };
                        }
                    }
                };

                scope.$watch("vgCuePoints", scope.updateCuePoints);

                scope.$watch(
                    function () {
                        return API.totalTime;
                    },
                    function (newVal, oldVal) {
                        if (newVal > 0) scope.onPlayerReady();
                    }
                );
            }
        }
    }]
);

/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls.directive:vgScrubBarCurrentTime
 * @restrict E
 * @description
 * Layer inside vg-scrub-bar to display the current time.
 *
 * <pre>
 * <videogular vg-theme="config.theme.url">
 *    <vg-media vg-src="sources"></vg-media>
 *
 *    <vg-controls vg-autohide='config.autohide' vg-autohide-time='config.autohideTime'>
 *        <vg-scrub-bar>
 *            <vg-scrub-bar-current-time></vg-scrub-bar-current-time>
 *        </vg-scrub-bar>
 *    </vg-controls>
 * </videogular>
 * </pre>
 *
 */
angular.module("com.2fdevs.videogular.plugins.controls")
    .directive("vgScrubBarCurrentTime",
    [function () {
        return {
            restrict: "E",
            require: "^videogular",
            link: function (scope, elem, attr, API) {
                var percentTime = 0;

                scope.onUpdateTime = function onUpdateTime(newCurrentTime) {
                    if (typeof newCurrentTime === 'number' && API.totalTime) {
                        percentTime = 100 * (newCurrentTime / API.totalTime);
                        elem.css("width", percentTime + "%");
                    } else {
                        elem.css("width", 0);
                    }
                };

                scope.$watch(
                    function () {
                        return API.currentTime;
                    },
                    function (newVal, oldVal) {
                        scope.onUpdateTime(newVal);
                    }
                );
            }
        }
    }]
);

/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls.directive:vgScrubBar
 * @restrict E
 * @description
 * Directive to control the time and display other information layers about the progress of the media.
 * This directive acts as a container and you can add more layers to display current time, cuepoints, buffer or whatever you need.
 *
 * <pre>
 * <videogular vg-theme="config.theme.url">
 *    <vg-media vg-src="sources"></vg-media>
 *
 *    <vg-controls vg-autohide='config.autohide' vg-autohide-time='config.autohideTime'>
 *        <vg-scrub-bar></vg-scrub-bar>
 *    </vg-controls>
 * </videogular>
 * </pre>
 *
 */
angular.module("com.2fdevs.videogular.plugins.controls")
    .run(
    ["$templateCache", function ($templateCache) {
        $templateCache.put("vg-templates/vg-scrub-bar",
            '<div role="slider" aria-valuemax="{{ariaTime(API.totalTime)}}" aria-valuenow="{{ariaTime(API.currentTime)}}" aria-valuemin="0" aria-label="Time scrub bar" tabindex="0" ng-transclude ng-keydown="onScrubBarKeyDown($event)"></div>');
    }]
)
    .directive("vgScrubBar",
    ["VG_STATES", "VG_UTILS", function (VG_STATES, VG_UTILS) {
        return {
            restrict: "E",
            require: "^videogular",
            transclude: true,
            templateUrl: function (elem, attrs) {
                return attrs.vgTemplate || 'vg-templates/vg-scrub-bar';
            },
            link: function (scope, elem, attr, API) {
                var isSeeking = false;
                var isPlaying = false;
                var isPlayingWhenSeeking = false;
                var touchStartX = 0;
                var LEFT = 37;
                var RIGHT = 39;
                var NUM_PERCENT = 5;

                scope.API = API;
                scope.ariaTime = function (time) {
                    return Math.round(time / 1000);
                };

                scope.onScrubBarTouchStart = function onScrubBarTouchStart($event) {
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
                    API.seekTime(touchX * API.mediaElement[0].duration / elem[0].scrollWidth);

                    scope.$apply();
                };

                scope.onScrubBarTouchEnd = function onScrubBarTouchEnd($event) {
                    var event = $event.originalEvent || $event;
                    if (isPlayingWhenSeeking) {
                        isPlayingWhenSeeking = false;
                        API.play();
                    }
                    isSeeking = false;

                    scope.$apply();
                };

                scope.onScrubBarTouchMove = function onScrubBarTouchMove($event) {
                    var event = $event.originalEvent || $event;
                    var touches = event.touches;
                    var touchX;

                    if (isSeeking) {
                        touchX = touches[0].clientX + touchStartX - touches[0].target.offsetLeft;
                        API.seekTime(touchX * API.mediaElement[0].duration / elem[0].scrollWidth);
                    }

                    scope.$apply();
                };

                scope.onScrubBarTouchLeave = function onScrubBarTouchLeave(event) {
                    isSeeking = false;

                    scope.$apply();
                };

                scope.onScrubBarMouseDown = function onScrubBarMouseDown(event) {
                    event = VG_UTILS.fixEventOffset(event);

                    isSeeking = true;
                    if (isPlaying) isPlayingWhenSeeking = true;
                    API.pause();

                    API.seekTime(event.offsetX * API.mediaElement[0].duration / elem[0].scrollWidth);

                    scope.$apply();
                };

                scope.onScrubBarMouseUp = function onScrubBarMouseUp(event) {
                    //event = VG_UTILS.fixEventOffset(event);

                    if (isPlayingWhenSeeking) {
                        isPlayingWhenSeeking = false;
                        API.play();
                    }
                    isSeeking = false;
                    //API.seekTime(event.offsetX * API.mediaElement[0].duration / elem[0].scrollWidth);

                    scope.$apply();
                };

                scope.onScrubBarMouseMove = function onScrubBarMouseMove(event) {
                    if (isSeeking) {
                        event = VG_UTILS.fixEventOffset(event);
                        API.seekTime(event.offsetX * API.mediaElement[0].duration / elem[0].scrollWidth);
                    }

                    scope.$apply();
                };

                scope.onScrubBarMouseLeave = function onScrubBarMouseLeave(event) {
                    isSeeking = false;

                    scope.$apply();
                };

                scope.onScrubBarKeyDown = function onScrubBarKeyDown(event) {
                    var currentPercent = (API.currentTime / API.totalTime) * 100;

                    if (event.which === LEFT || event.keyCode === LEFT) {
                        API.seekTime(currentPercent - NUM_PERCENT, true);
                        event.preventDefault();
                    }
                    else if (event.which === RIGHT || event.keyCode === RIGHT) {
                        API.seekTime(currentPercent + NUM_PERCENT, true);
                        event.preventDefault();
                    }
                };

                scope.setState = function setState(newState) {
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
                };

                scope.$watch(
                    function () {
                        return API.currentState;
                    },
                    function (newVal, oldVal) {
                        if (newVal != oldVal) {
                            scope.setState(newVal);
                        }
                    }
                );

                // Touch move is really buggy in Chrome for Android, maybe we could use mouse move that works ok
                if (VG_UTILS.isMobileDevice()) {
                    elem.bind("touchstart", scope.onScrubBarTouchStart);
                    elem.bind("touchend", scope.onScrubBarTouchEnd);
                    elem.bind("touchmove", scope.onScrubBarTouchMove);
                    elem.bind("touchleave", scope.onScrubBarTouchLeave);
                }
                else {
                    elem.bind("mousedown", scope.onScrubBarMouseDown);
                    elem.bind("mouseup", scope.onScrubBarMouseUp);
                    elem.bind("mousemove", scope.onScrubBarMouseMove);
                    elem.bind("mouseleave", scope.onScrubBarMouseLeave);
                }
            }
        }
    }]
);

/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls.directive:vgTimeDisplay
 * @restrict E
 * @description
 * Adds a time display inside vg-controls to play and pause media.
 * You have three scope variables to show current time, time left and total time.
 *
 * Those scope variables are in milliseconds, you can add a date filter to show the time as you wish.
 *
 * <pre>
 * <videogular vg-theme="config.theme.url">
 *    <vg-media vg-src="sources"></vg-media>
 *
 *    <vg-controls vg-autohide='config.autohide' vg-autohide-time='config.autohideTime'>
 *        <vg-time-display>{{currentTime | date:'hh:mm'}}</vg-time-display>
 *        <vg-time-display>{{timeLeft | date:'mm:ss'}}</vg-time-display>
 *        <vg-time-display>{{totalTime | date:'hh:mm:ss'}}</vg-time-display>
 *    </vg-controls>
 * </videogular>
 * </pre>
 *
 */
angular.module("com.2fdevs.videogular.plugins.controls")
    .directive("vgTimeDisplay",
    [function () {
        return {
            require: "^videogular",
            restrict: "E",
            link: function (scope, elem, attr, API) {
                scope.currentTime = API.currentTime;
                scope.timeLeft = API.timeLeft;
                scope.totalTime = API.totalTime;
                scope.isLive = API.isLive;

                scope.$watch(
                    function () {
                        return API.currentTime;
                    },
                    function (newVal, oldVal) {
                        scope.currentTime = newVal;
                    }
                );

                scope.$watch(
                    function () {
                        return API.timeLeft;
                    },
                    function (newVal, oldVal) {
                        scope.timeLeft = newVal;
                    }
                );

                scope.$watch(
                    function () {
                        return API.totalTime;
                    },
                    function (newVal, oldVal) {
                        scope.totalTime = newVal;
                    }
                );

                scope.$watch(
                    function () {
                        return API.isLive;
                    },
                    function (newVal, oldVal) {
                        scope.isLive = newVal;
                    }
                );
            }
        }
    }]
);

/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls.directive:vgMuteButton
 * @restrict E
 * @description
 * Directive to display a button to mute volume.
 *
 * <pre>
 * <videogular vg-theme="config.theme.url">
 *    <vg-media vg-src="sources"></vg-media>
 *
 *    <vg-controls vg-autohide='config.autohide' vg-autohide-time='config.autohideTime'>
 *        <vg-volume>
 *            <vg-mute-button><vg-mute-button>
 *        </vg-volume>
 *    </vg-controls>
 * </videogular>
 * </pre>
 *
 */
angular.module("com.2fdevs.videogular.plugins.controls")
    .run(
    ["$templateCache", function ($templateCache) {
        $templateCache.put("vg-templates/vg-mute-button",
            '<button type="button" class="iconButton" ng-class="muteIcon" ng-click="onClickMute()" ng-focus="onMuteButtonFocus()" ng-blur="onMuteButtonLoseFocus()" ng-keydown="onMuteButtonKeyDown($event)" aria-label="Mute"></button>');
    }]
)
    .directive("vgMuteButton",
    [function () {
        return {
            restrict: "E",
            require: "^videogular",
            templateUrl: function (elem, attrs) {
                return attrs.vgTemplate || 'vg-templates/vg-mute-button';
            },
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

                scope.onMuteButtonFocus = function onMuteButtonFocus() {
                    scope.volumeVisibility = "visible";
                };

                scope.onMuteButtonLoseFocus = function onMuteButtonLoseFocus() {
                    scope.volumeVisibility = "hidden";
                };

                scope.onMuteButtonKeyDown = function onMuteButtonKeyDown(event) {
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

                scope.onSetVolume = function onSetVolume(newVolume) {
                    scope.currentVolume = newVolume;

                    isMuted = (scope.currentVolume === 0);

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
                };

                scope.defaultVolume = 1;
                scope.currentVolume = scope.defaultVolume;
                scope.muteIcon = {level3: true};

                //Update the mute button on initialization, then watch for changes
                scope.onSetVolume(API.volume);
                scope.$watch(
                    function () {
                        return API.volume;
                    },
                    function (newVal, oldVal) {
                        if (newVal != oldVal) {
                            scope.onSetVolume(newVal);
                        }
                    }
                );
            }
        }
    }]
);

/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls.directive:vgVolumeBar
 * @restrict E
 * @description
 * Directive to display a vertical volume bar to control the volume.
 * This directive must be inside vg-volume directive and requires vg-mute-button to be displayed.
 *
 * <pre>
 * <videogular vg-theme="config.theme.url">
 *    <vg-media vg-src="sources"></vg-media>
 *
 *    <vg-controls vg-autohide='config.autohide' vg-autohide-time='config.autohideTime'>
 *        <vg-volume>
 *            <vg-mute-button><vg-mute-button>
 *            <vg-volume-bar><vg-volume-bar>
 *        </vg-volume>
 *    </vg-controls>
 * </videogular>
 * </pre>
 *
 */
angular.module("com.2fdevs.videogular.plugins.controls")
    .run(
    ["$templateCache", function ($templateCache) {
        $templateCache.put("vg-templates/vg-volume-bar",
            '<div class="verticalVolumeBar">\
              <div class="volumeBackground" ng-click="onClickVolume($event)" ng-mousedown="onMouseDownVolume()" ng-mouseup="onMouseUpVolume()" ng-mousemove="onMouseMoveVolume($event)" ng-mouseleave="onMouseLeaveVolume()">\
                <div class="volumeValue"></div>\
                <div class="volumeClickArea"></div>\
              </div>\
            </div>');
    }]
)
    .directive("vgVolumeBar",
    ["VG_UTILS", function (VG_UTILS) {
        return {
            restrict: "E",
            require: "^videogular",
            templateUrl: function (elem, attrs) {
                return attrs.vgTemplate || 'vg-templates/vg-volume-bar';
            },
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

                scope.updateVolumeView = function updateVolumeView(value) {
                    value = value * 100;
                    volumeValueElem.css("height", value + "%");
                    volumeValueElem.css("top", (100 - value) + "%");
                };

                scope.onChangeVisibility = function onChangeVisibility(value) {
                    elem.css("visibility", value);
                };

                elem.css("visibility", scope.volumeVisibility);

                scope.$watch("volumeVisibility", scope.onChangeVisibility);

                //Update the volume bar on initialization, then watch for changes
                scope.updateVolumeView(API.volume);
                scope.$watch(
                    function () {
                        return API.volume;
                    },
                    function (newVal, oldVal) {
                        if (newVal != oldVal) {
                            scope.updateVolumeView(newVal);
                        }
                    }
                );
            }
        }
    }]
);

/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls.directive:vgVolume
 * @restrict E
 * @description
 * Directive to control the volume.
 * This directive acts as a container and you will need other directives like vg-mutebutton and vg-volumebar to control the volume.
 * In mobile will be hided since volume API is disabled for mobile devices.
 *
 * <pre>
 * <videogular vg-theme="config.theme.url">
 *    <vg-media vg-src="sources"></vg-media>
 *
 *    <vg-controls vg-autohide='config.autohide' vg-autohide-time='config.autohideTime'>
 *        <vg-volume></vg-volume>
 *    </vg-controls>
 * </videogular>
 * </pre>
 *
 */
angular.module("com.2fdevs.videogular.plugins.controls")
    .directive("vgVolume",
    ["VG_UTILS", function (VG_UTILS) {
        return {
            restrict: "E",
            link: function (scope, elem, attr) {
                scope.onMouseOverVolume = function onMouseOverVolume() {
                    scope.$evalAsync(function () {
                        scope.volumeVisibility = "visible";
                    });
                };

                scope.onMouseLeaveVolume = function onMouseLeaveVolume() {
                    scope.$evalAsync(function () {
                        scope.volumeVisibility = "hidden";
                    });
                };

                // We hide volume controls on mobile devices
                if (VG_UTILS.isMobileDevice()) {
                    elem.css("display", "none");
                }
                else {
                    scope.volumeVisibility = "hidden";

                    elem.bind("mouseover", scope.onMouseOverVolume);
                    elem.bind("mouseleave", scope.onMouseLeaveVolume);
                }
            }
        }
    }]
);
