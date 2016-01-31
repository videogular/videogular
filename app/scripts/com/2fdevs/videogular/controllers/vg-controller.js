"use strict";
/**
 * @ngdoc controller
 * @name com.2fdevs.videogular.controller:vgController
 * @description
 * Videogular controller.
 * This controller offers a public API:
 *
 * Methods
 * - play(): Plays media.
 * - pause(): Pause media.
 * - stop(): Stops media.
 * - playPause(): Toggles play and pause.
 * - seekTime(value, byPercent): Seeks to a specified time position. Param value must be an integer representing the target position in seconds or a percentage. By default seekTime seeks by seconds, if you want to seek by percentage just pass byPercent to true.
 * - setVolume(volume): Sets volume. Param volume must be a float number with a value between 0 and 1.
 * - setPlayback(playback): Sets playback. Param plaback must be a float number with a value between 0 and 2.
 * - setState(state): Sets a new state. Param state mus be an string with 'play', 'pause' or 'stop'. This method only changes the state of the player, but doesn't plays, pauses or stops the media file.
 * - toggleFullScreen(): Toggles between fullscreen and normal mode.
 * - updateTheme(css-url): Removes previous CSS theme and sets a new one.
 * - clearMedia(): Cleans the current media file.
 * - changeSource(array): Updates current media source. Param `array` must be an array of media source objects.
 * A media source is an object with two properties `src` and `type`. The `src` property must contains a trustful url resource.
 * <pre>{src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.mp4"), type: "video/mp4"}</pre>
 *
 * Properties
 * - config: String with a url to JSON config file.
 * - isReady: Boolean value with current player initialization state.
 * - isBuffering: Boolean value to know if player is buffering media.
 * - isCompleted: Boolean value to know if current media file has been completed.
 * - isLive: Boolean value to know if current media file is a Live Streaming.
 * - playsInline: Boolean value to know if Videogular is using inline playing or not.
 * - nativeFullscreen: Boolean value to know if Videogular if fullscreen mode will use native mode or emulated mode.
 * - mediaElement: Reference to video/audio object.
 * - videogularElement: Reference to videogular tag.
 * - sources: Array with current sources.
 * - tracks: Array with current tracks.
 * - cuePoints: Object containing a list of timelines with cue points. Each property in the object represents a timeline, which is an Array of objects with the next definition:
 * <pre>{
 *    timeLapse:{
 *      start: 0,
 *      end: 10
 *    },
 *    onEnter: callback(currentTime, timeLapse, params),
 *    onLeave: callback(currentTime, timeLapse, params),
 *    onUpdate: callback(currentTime, timeLapse, params),
 *    onComplete: callback(currentTime, timeLapse, params),
 *    params: {
 *      // Custom object with desired structure and data
 *    }
 * }</pre>
 *
 *    * **timeLapse:** Object with start and end properties to define in seconds when this timeline is active.\n
 *    * **onEnter:** Callback function that will be called when progress reaches a cue point or being outside a cue point user seeks to a cue point manually.
 *    * **onLeave:** Callback function that will be called when user seeks and the new time doesn't reach to the timeLapse.start property.
 *    * **onUpdate:** Callback function that will be called when the progress is in the middle of timeLapse.start and timeLapse.end.
 *    * **onComplete:** Callback function that will be called when the progress is bigger than timeLapse.end.
 *    * **params:** Custom object with data to pass to the callbacks.
 *
 * - isFullScreen: Boolean value to know if we’re in fullscreen mode.
 * - currentState: String value with “play”, “pause” or “stop”.
 * - currentTime: Number value with current media time progress.
 * - totalTime: Number value with total media time.
 * - timeLeft: Number value with current media time left.
 * - volume: Number value with current volume between 0 and 1.
 * - playback: Number value with current playback between 0 and 2.
 * - bufferEnd: Number value with latest buffer point in milliseconds.
 * - buffered: Array of TimeRanges objects that represents current buffer state.
 *
 */
angular.module("com.2fdevs.videogular")
    .controller("vgController",
    ['$scope', '$window', 'vgConfigLoader', 'vgFullscreen', 'VG_UTILS', 'VG_STATES', 'VG_VOLUME_KEY', function ($scope, $window, vgConfigLoader, vgFullscreen, VG_UTILS, VG_STATES, VG_VOLUME_KEY) {
        var currentTheme = null;
        var isFullScreenPressed = false;
        var isMetaDataLoaded = false;
        var hasStartTimePlayed = false;
        var isVirtualClip = false;

        // PUBLIC $API
        this.videogularElement = null;

        this.clearMedia = function () {
            this.mediaElement[0].src = '';
            this.mediaElement[0].removeEventListener("canplay", this.onCanPlay.bind(this), false);
            this.mediaElement[0].removeEventListener("loadedmetadata", this.onLoadMetaData.bind(this), false);
            this.mediaElement[0].removeEventListener("waiting", this.onStartBuffering.bind(this), false);
            this.mediaElement[0].removeEventListener("ended", this.onComplete.bind(this), false);
            this.mediaElement[0].removeEventListener("playing", this.onStartPlaying.bind(this), false);
            this.mediaElement[0].removeEventListener("play", this.onPlay.bind(this), false);
            this.mediaElement[0].removeEventListener("pause", this.onPause.bind(this), false);
            this.mediaElement[0].removeEventListener("volumechange", this.onVolumeChange.bind(this), false);
            this.mediaElement[0].removeEventListener("playbackchange", this.onPlaybackChange.bind(this), false);
            this.mediaElement[0].removeEventListener("timeupdate", this.onUpdateTime.bind(this), false);
            this.mediaElement[0].removeEventListener("progress", this.onProgress.bind(this), false);
            this.mediaElement[0].removeEventListener("seeking", this.onSeeking.bind(this), false);
            this.mediaElement[0].removeEventListener("seeked", this.onSeeked.bind(this), false);
            this.mediaElement[0].removeEventListener("error", this.onVideoError.bind(this), false);
        };

        this.onRouteChange = function() {
            if (this.clearMediaOnNavigate === undefined || this.clearMediaOnNavigate === true) {
                this.clearMedia();
            }
        };

        this.onCanPlay = function (evt) {
            this.isBuffering = false;
            $scope.$apply($scope.vgCanPlay({$event: evt}));

            if (!hasStartTimePlayed && (this.startTime > 0 || this.startTime === 0)) {
                this.seekTime(this.startTime);
                hasStartTimePlayed = true;
            }
        };

        this.onVideoReady = function () {
            this.isReady = true;
            this.autoPlay = $scope.vgAutoPlay;
            this.playsInline = $scope.vgPlaysInline;
            this.nativeFullscreen = $scope.vgNativeFullscreen || true;
            this.cuePoints = $scope.vgCuePoints;
            this.startTime = $scope.vgStartTime;
            this.virtualClipDuration = $scope.vgVirtualClipDuration;
            this.clearMediaOnNavigate = $scope.vgClearMediaOnNavigate || true;
            this.currentState = VG_STATES.STOP;

            isMetaDataLoaded = true;
            isVirtualClip = this.startTime >= 0 && this.virtualClipDuration > 0;

            //Set media volume from localStorage if available
            if (VG_UTILS.supportsLocalStorage()) {
                //Default to 100% volume if local storage setting does not exist.
                this.setVolume(parseFloat($window.localStorage.getItem(VG_VOLUME_KEY) || '1'));
            }

            if ($scope.vgConfig) {
                vgConfigLoader.loadConfig($scope.vgConfig).then(
                    this.onLoadConfig.bind(this)
                );
            }
            else {
                $scope.vgPlayerReady({$API: this});
            }
        };

        this.onLoadConfig = function (config) {
            this.config = config;

            $scope.vgTheme = this.config.theme;
            $scope.vgAutoPlay = this.config.autoPlay;
            $scope.vgPlaysInline = this.config.playsInline;
            $scope.vgNativeFullscreen = this.config.nativeFullscreen;
            $scope.vgCuePoints = this.config.cuePoints;
            $scope.vgClearMediaOnNavigate = this.config.clearMediaOnNavigate;
            $scope.vgStartTime = this.config.startTime;
            $scope.vgVirtualClipDuration = this.config.virtualClipDuration;
            isVirtualClip = $scope.vgStartTime >= 0 && $scope.vgVirtualClipDuration > 0;

            $scope.vgPlayerReady({$API: this});
        };

        this.onLoadMetaData = function (evt) {
            this.isBuffering = false;
            this.onUpdateTime(evt);
        };

        this.onProgress = function (event) {
            this.updateBuffer(event);

            $scope.$apply();
        };

        this.updateBuffer = function getBuffer(event) {
            if (event.target.buffered.length) {
                this.buffered = event.target.buffered;
                this.bufferEnd = 1000 * event.target.buffered.end(event.target.buffered.length - 1);

                // Avoid bufferEnd overflow by virtual clips
                if (this.bufferEnd > this.totalTime) this.bufferEnd = this.totalTime;
            }
        };

        this.onUpdateTime = function (event) {
            var targetTime = 1000 * event.target.currentTime;

            this.updateBuffer(event);

            if (event.target.duration != Infinity) {
                // Fake the duration and current time for virtual clips
                if (isVirtualClip) {
                    if (hasStartTimePlayed && (event.target.currentTime < this.startTime || event.target.currentTime - this.startTime > this.virtualClipDuration)) {
                        this.onComplete();
                    }
                    else {
                        this.currentTime = Math.max(0, targetTime - (1000 * this.startTime));
                        this.totalTime = 1000 * this.virtualClipDuration;
                        this.timeLeft = (1000 * this.virtualClipDuration) - this.currentTime;
                    }
                }
                else {
                    this.currentTime = targetTime;
                    this.totalTime = 1000 * event.target.duration;
                    this.timeLeft = 1000 * (event.target.duration - event.target.currentTime);
                }

                this.isLive = false;
            }
            else {
                // It's a live streaming without and end
                this.currentTime = targetTime;
                this.isLive = true;
            }

            var targetSeconds = isVirtualClip ? this.currentTime / 1000 : event.target.currentTime;
            var targetDuration = isVirtualClip ? this.totalTime / 1000 : event.target.duration;

            if (this.cuePoints) {
                this.checkCuePoints(targetSeconds);
            }

            $scope.vgUpdateTime({$currentTime: targetSeconds, $duration: targetDuration});

            // Safe apply just in case we're calling from a non-event
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply();
            }
        };

        this.checkCuePoints = function checkCuePoints(currentTime) {
            for (var tl in this.cuePoints) {
                for (var i = 0, l = this.cuePoints[tl].length; i < l; i++) {
                    var cp = this.cuePoints[tl][i];
                    var currentSecond = parseInt(currentTime, 10);
                    var start = parseInt(cp.timeLapse.start, 10);

                    // If timeLapse.end is not defined we set it as 1 second length
                    if (!cp.timeLapse.end) cp.timeLapse.end = cp.timeLapse.start + 1;

                    if (currentTime < cp.timeLapse.end) cp.$$isCompleted = false;

                    // Fire the onEnter event once reach to the cue point
                    if(!cp.$$isDirty && currentSecond === start && (typeof cp.onEnter == 'function')) {
                        cp.onEnter(currentTime, cp.timeLapse, cp.params);
                        cp.$$isDirty = true;
                    }

                    // Check if we've been reached to the cue point
                    if (currentTime > cp.timeLapse.start) {
                        // We're in the timelapse
                        if (currentTime < cp.timeLapse.end) {
                            // Trigger onUpdate each time we enter here
                            if (cp.onUpdate) cp.onUpdate(currentTime, cp.timeLapse, cp.params);

                            // Trigger onEnter if we enter on the cue point by manually seeking
                            if (!cp.$$isDirty && (typeof cp.onEnter === 'function')) {
                                cp.onEnter(currentTime, cp.timeLapse, cp.params);
                            }
                        }

                        // We've been passed the cue point
                        if (currentTime >= cp.timeLapse.end) {
                            if (cp.onComplete && !cp.$$isCompleted) {
                                cp.$$isCompleted = true;
                                cp.onComplete(currentTime, cp.timeLapse, cp.params);
                            }
                        }

                        cp.$$isDirty = true;
                    }
                    else {
                        if (cp.onLeave && cp.$$isDirty) {
                            cp.onLeave(currentTime, cp.timeLapse, cp.params);
                        }

                        cp.$$isDirty = false;
                    }
                }
            }
        };

        this.onPlay = function () {
            this.setState(VG_STATES.PLAY);
            $scope.$apply();
        };

        this.onPause = function () {
            var currentTime = isVirtualClip ? this.currentTime : this.mediaElement[0].currentTime;

            if (currentTime == 0) {
                this.setState(VG_STATES.STOP);
            }
            else {
                this.setState(VG_STATES.PAUSE);
            }

            $scope.$apply();
        };

        this.onVolumeChange = function () {
            this.volume = this.mediaElement[0].volume;
            $scope.$apply();
        };

        this.onPlaybackChange = function () {
            this.playback = this.mediaElement[0].playbackRate;
            $scope.$apply();
        };

        this.onSeeking = function (event) {
            $scope.vgSeeking({$currentTime: event.target.currentTime, $duration: event.target.duration});
        };

        this.onSeeked = function (event) {
            $scope.vgSeeked({$currentTime: event.target.currentTime, $duration: event.target.duration});
        };

        this.seekTime = function (value, byPercent) {
            var second;
            if (byPercent) {
                if (isVirtualClip) {
                    value = Math.max(0, Math.min(value, 100));
                    second = (value * this.virtualClipDuration / 100);
                    this.mediaElement[0].currentTime = this.startTime + second;
                }
                else {
                    second = value * this.mediaElement[0].duration / 100;
                    this.mediaElement[0].currentTime = second;
                }
            }
            else {
                if (isVirtualClip) {
                    var durationPercent = value/this.mediaElement[0].duration;
                    second = !hasStartTimePlayed ? 0 : this.virtualClipDuration * durationPercent;
                    this.mediaElement[0].currentTime = !hasStartTimePlayed ? this.startTime : this.startTime + second;
                }
                else {
                    second = value;
                    this.mediaElement[0].currentTime = second;
                }
            }

            this.currentTime = 1000 * second;
        };

        this.playPause = function () {
            if (this.mediaElement[0].paused) {
                this.play();
            }
            else {
                this.pause();
            }
        };

        this.setState = function (newState) {
            if (newState && newState != this.currentState) {
                $scope.vgUpdateState({$state: newState});

                this.currentState = newState;
            }

            return this.currentState;
        };

        this.play = function () {
            this.mediaElement[0].play();
            this.setState(VG_STATES.PLAY);
        };

        this.pause = function () {
            this.mediaElement[0].pause();
            this.setState(VG_STATES.PAUSE);
        };

        this.stop = function () {
            try {
                this.mediaElement[0].pause();

                var targetTime = isVirtualClip ? this.startTime : 0;
                this.mediaElement[0].currentTime = targetTime;

                this.currentTime = targetTime;
                this.buffered = [];
                this.bufferEnd = 0;
                this.setState(VG_STATES.STOP);
            }
            catch (e) {
                return e;
            }
        };

        this.toggleFullScreen = function () {
            // There is no native full screen support or we want to play inline
            if (!vgFullscreen.isAvailable || !this.nativeFullscreen) {
                if (this.isFullScreen) {
                    this.videogularElement.removeClass("fullscreen");
                    this.videogularElement.css("z-index", "auto");
                }
                else {
                    this.videogularElement.addClass("fullscreen");
                    this.videogularElement.css("z-index", VG_UTILS.getZIndex());
                }

                this.isFullScreen = !this.isFullScreen;
            }
            // Perform native full screen support
            else {
                if (this.isFullScreen) {
                    if (!VG_UTILS.isMobileDevice()) {
                        vgFullscreen.exit();
                    }
                }
                else {
                    // On mobile devices we should make fullscreen only the video object
                    if (VG_UTILS.isMobileDevice()) {
                        // On iOS we should check if user pressed before fullscreen button
                        // and also if metadata is loaded
                        if (VG_UTILS.isiOSDevice()) {
                            if (isMetaDataLoaded) {
                                this.enterElementInFullScreen(this.mediaElement[0]);
                            }
                            else {
                                isFullScreenPressed = true;
                                this.play();
                            }
                        }
                        else {
                            this.enterElementInFullScreen(this.mediaElement[0]);
                        }
                    }
                    else {
                        this.enterElementInFullScreen(this.videogularElement[0]);
                    }
                }
            }
        };

        this.enterElementInFullScreen = function (element) {
            vgFullscreen.request(element);
        };

        this.changeSource = function (newValue) {
            $scope.vgChangeSource({$source: newValue});
        };

        this.setVolume = function (newVolume) {
            newVolume = Math.max(Math.min(newVolume, 1), 0);
            $scope.vgUpdateVolume({$volume: newVolume});

            this.mediaElement[0].volume = newVolume;
            this.volume = newVolume;

            //Push volume updates to localStorage so that future instances resume volume
            if (VG_UTILS.supportsLocalStorage()) {
                //TODO: Improvement: concat key with current page or "video player id" to create separate stored volumes.
                $window.localStorage.setItem(VG_VOLUME_KEY, newVolume.toString());
            }
        };

        this.setPlayback = function (newPlayback) {
            $scope.vgUpdatePlayback({$playBack: newPlayback});

            this.mediaElement[0].playbackRate = newPlayback;
            this.playback = newPlayback;
        };

        this.updateTheme = function (value) {
            var links = document.getElementsByTagName("link");
            var i;
            var l;

            // Remove previous theme
            if (currentTheme) {
                for (i = 0, l = links.length; i < l; i++) {
                    if (links[i].outerHTML.indexOf(currentTheme) >= 0) {

                        links[i].parentNode.removeChild(links[i]);
                        break;
                    }
                }
            }

            if (value) {
                var headElem = angular.element(document).find("head");
                var exists = false;

                // Look if theme already exists
                for (i = 0, l = links.length; i < l; i++) {
                    exists = (links[i].outerHTML.indexOf(value) >= 0);
                    if (exists) break;
                }

                if (!exists) {
                    headElem.append("<link rel='stylesheet' href='" + value + "'>");
                }

                currentTheme = value;
            }
        };

        this.onStartBuffering = function (event) {
            this.isBuffering = true;
            $scope.$apply();
        };

        this.onStartPlaying = function (event) {
            this.isBuffering = false;
            $scope.$apply();
        };

        this.onComplete = function (event) {
            $scope.vgComplete();

            this.setState(VG_STATES.STOP);
            this.isCompleted = true;

            if (isVirtualClip) {
                this.stop()
            }

            $scope.$apply();
        };

        this.onVideoError = function (event) {
            $scope.vgError({$event: event});
        };

        this.addListeners = function () {
            this.mediaElement[0].addEventListener("canplay", this.onCanPlay.bind(this), false);
            this.mediaElement[0].addEventListener("loadedmetadata", this.onLoadMetaData.bind(this), false);
            this.mediaElement[0].addEventListener("waiting", this.onStartBuffering.bind(this), false);
            this.mediaElement[0].addEventListener("ended", this.onComplete.bind(this), false);
            this.mediaElement[0].addEventListener("playing", this.onStartPlaying.bind(this), false);
            this.mediaElement[0].addEventListener("play", this.onPlay.bind(this), false);
            this.mediaElement[0].addEventListener("pause", this.onPause.bind(this), false);
            this.mediaElement[0].addEventListener("volumechange", this.onVolumeChange.bind(this), false);
            this.mediaElement[0].addEventListener("playbackchange", this.onPlaybackChange.bind(this), false);
            this.mediaElement[0].addEventListener("timeupdate", this.onUpdateTime.bind(this), false);
            this.mediaElement[0].addEventListener("progress", this.onProgress.bind(this), false);
            this.mediaElement[0].addEventListener("seeking", this.onSeeking.bind(this), false);
            this.mediaElement[0].addEventListener("seeked", this.onSeeked.bind(this), false);
            this.mediaElement[0].addEventListener("error", this.onVideoError.bind(this), false);
        };

        this.init = function () {
            this.isReady = false;
            this.isCompleted = false;
            this.buffered = [];
            this.bufferEnd = 0;
            this.currentTime = 0;
            this.totalTime = 0;
            this.timeLeft = 0;
            this.isLive = false;
            this.isFullScreen = false;
            this.playback = 1;
            this.isConfig = ($scope.vgConfig != undefined);

            if (vgFullscreen.isAvailable) {
                this.isFullScreen = vgFullscreen.isFullScreen();
            }

            this.updateTheme($scope.vgTheme);
            this.addBindings();

            if (vgFullscreen.isAvailable) {
                document.addEventListener(vgFullscreen.onchange, this.onFullScreenChange.bind(this));
            }
        };

        this.onUpdateTheme = function onUpdateTheme(newValue) {
            this.updateTheme(newValue);
        };

        this.onUpdateAutoPlay = function onUpdateAutoPlay(newValue) {
            if (newValue && !this.autoPlay) {
                this.autoPlay = newValue;
                this.play(this);
            }
        };

        this.onUpdateStartTime = function onUpdateStartTime(newValue) {
            if (newValue && (newValue != this.startTime)) {
                this.mediaElement[0].currentTime = newValue;
                this.startTime = newValue;
                isVirtualClip = this.startTime >= 0 && this.virtualClipDuration > 0;

                var fakeEvent = {
                    target: this.mediaElement[0]
                };
                this.onUpdateTime(fakeEvent, true);
            }
        };

        this.onUpdateVirtualClipDuration = function onUpdateVirtualClipDuration(newValue) {
            if (newValue && (newValue != this.virtualClipDuration)) {
                this.virtualClipDuration = newValue;
                isVirtualClip = this.startTime >= 0 && this.virtualClipDuration > 0;

                var fakeEvent = {
                    target: this.mediaElement[0]
                };
                this.onUpdateTime(fakeEvent, true);
            }
        };

        this.onUpdatePlaysInline = function onUpdatePlaysInline(newValue) {
            this.playsInline = newValue;
        };

        this.onUpdateNativeFullscreen = function onUpdateNativeFullscreen(newValue) {
            if (newValue == undefined) newValue = true;

            this.nativeFullscreen = newValue;
        };

        this.onUpdateCuePoints = function onUpdateCuePoints(newValue) {
            this.cuePoints = newValue;
            this.checkCuePoints(this.currentTime);
        };

        this.onUpdateClearMediaOnNavigate = function onUpdateClearMediaOnNavigate(newValue) {
            this.clearMediaOnNavigate = newValue;
        };

        this.addBindings = function () {
            $scope.$watch("vgTheme", this.onUpdateTheme.bind(this));

            $scope.$watch("vgAutoPlay", this.onUpdateAutoPlay.bind(this));

            $scope.$watch("vgStartTime", this.onUpdateStartTime.bind(this));

            $scope.$watch("vgVirtualClipDuration", this.onUpdateVirtualClipDuration.bind(this));

            $scope.$watch("vgPlaysInline", this.onUpdatePlaysInline.bind(this));

            $scope.$watch("vgNativeFullscreen", this.onUpdateNativeFullscreen.bind(this));

            $scope.$watch("vgCuePoints", this.onUpdateCuePoints.bind(this));

            $scope.$watch("vgClearMediaOnNavigate", this.onUpdateClearMediaOnNavigate.bind(this));
        };

        this.onFullScreenChange = function (event) {
            this.isFullScreen = vgFullscreen.isFullScreen();
            $scope.$apply();
        };

        // Empty mediaElement on destroy to avoid that Chrome downloads video even when it's not present
        $scope.$on('$destroy', this.clearMedia.bind(this));

        // Empty mediaElement when router changes
        $scope.$on('$routeChangeStart', this.onRouteChange.bind(this));

        this.init();
    }]
);
