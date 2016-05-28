/**
 * @license videogular v1.4.4 http://videogular.com
 * Two Fucking Developers http://twofuckingdevelopers.com
 * License: MIT
 */
/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.analytics.directive:vgAnalytics
 * @restrict E
 * @description
 * Adds analytics support for your videos.
 * This plugin requires the awesome angulartics module:
 * http://luisfarzati.github.io/angulartics
 *
 * This plugin is not using any analytics provider, you need to add the analytic provider of your choice to your app, like: "angulartics.google.analytics"
 *
 * Videogular analytics injects Angulartics, so to use your preferred plugin you need to add it on your app.
 *
 * <pre>
 * <videogular vg-theme="config.theme.url" vg-autoplay="config.autoPlay">
 *    <vg-analytics vg-track-info="events"></vg-analytics>
 * </videogular>
 * </pre>
 *
 * This plugin requires an object with the following structure:
 * <pre>
 * {
 *    "category": "Videogular",
 *    "label": "Main",
 *    "events": {
 *      "ready": true,                  // Triggered when player is ready
 *      "play": true|'time'|'percent',  // Triggered each time player has been played. 'time' and 'percent' will attach the progress to the event value
 *      "pause": true|'time'|'percent', // Triggered each time player has been paused. 'time' and 'percent' will attach the progress to the event value
 *      "stop": true|'time'|'percent',  // Triggered each time player has been stopped. 'time' and 'percent' will attach the progress to the event value
 *      "complete": true,               // Triggered each time player has been completed
 *      "progress": 10                  // Triggered each 10% of the progress video
 *    }
 *  }
 * </pre>
 *
 * @param {object} vgTrackInfo Object with the tracking info with the following structure:
 *
 * <pre>
 * {
 *    "category": "Videogular",
 *    "label": "Main",
 *    "events": {
 *      "ready": true,
 *      "play": true|'time'|'percent',
 *      "pause": true|'time'|'percent',
 *      "stop": true|'time'|'percent',
 *      "complete": true,
 *      "progress": 10
 *    }
 *  }
 *  </pre>
 *
 */
"use strict";
angular.module("com.2fdevs.videogular.plugins.analytics", ["angulartics"])
    .directive(
        "vgAnalytics",
        ["$analytics", "VG_STATES", function ($analytics, VG_STATES) {
            return {
                restrict: "E",
                require: "^videogular",
                scope: {
                    vgTrackInfo: "=?"
                },
                link: function (scope, elem, attr, API) {
                    var info = null;
                    var currentState = null;
                    var totalMiliseconds = null;
                    var progressTracks = [];

                    scope.API = API;

                    scope.trackEvent = function trackEvent(eventName) {
                        $analytics.eventTrack(eventName, info);
                    };

                    scope.onPlayerReady = function onPlayerReady(isReady) {
                        if (isReady) {
                            scope.trackEvent("ready");
                        }
                    };

                    scope.onChangeState = function onChangeState(state) {
                        currentState = state;

                        switch (state) {
                            case VG_STATES.PLAY:
                                if (scope.vgTrackInfo.events.play) {
                                    scope.setValue(scope.vgTrackInfo.events.play);
                                    scope.trackEvent("play");
                                }
                                break;

                            case VG_STATES.PAUSE:
                                if (scope.vgTrackInfo.events.pause) {
                                    scope.setValue(scope.vgTrackInfo.events.pause);
                                    scope.trackEvent("pause");
                                }
                                break;

                            case VG_STATES.STOP:
                                if (scope.vgTrackInfo.events.stop) {
                                    scope.setValue(scope.vgTrackInfo.events.stop);
                                    scope.trackEvent("stop");
                                }
                                break;
                        }
                    };

                    scope.onCompleteVideo = function onCompleteVideo(isCompleted) {
                        if (isCompleted) {
                            scope.trackEvent("complete");
                        }
                    };

                    scope.onUpdateTime = function onUpdateTime(newCurrentTime) {
                        if (progressTracks.length > 0 && newCurrentTime >= progressTracks[0].jump) {
                            scope.trackEvent("progress " + progressTracks[0].percent + "%");
                            progressTracks.shift();
                        }
                    };

                    scope.updateTrackInfo = function updateTrackInfo(newVal) {
                        if (scope.vgTrackInfo.category) info.category = scope.vgTrackInfo.category;
                        if (scope.vgTrackInfo.label) info.label = scope.vgTrackInfo.label;
                    };

                    scope.setValue = function setValue(eventType) {
                        if (eventType) {
                            if (eventType === 'percent') {
                                if (API.totalTime > 1000) {
                                    info.value = Math.floor((API.currentTime / API.totalTime) * 100);
                                } else {
                                    info.value = 0;
                                }
                            } else if (eventType === 'time') {
                                info.value = Math.floor(API.currentTime / 1000);
                            }
                        }
                    };

                    scope.addWatchers = function () {
                        if (scope.vgTrackInfo.category || scope.vgTrackInfo.label) {
                            info = {};

                            scope.updateTrackInfo(scope.vgTrackInfo);
                        }

                        scope.$watch('vgTrackInfo', scope.updateTrackInfo, true);

                        // Add ready track event
                        if (scope.vgTrackInfo.events.ready) {
                            scope.$watch(
                                function () {
                                    return API.isReady;
                                },
                                function (newVal, oldVal) {
                                    scope.onPlayerReady(newVal);
                                }
                            );
                        }

                        // Add state track event
                        if (scope.vgTrackInfo.events.play || scope.vgTrackInfo.events.pause || scope.vgTrackInfo.events.stop) {
                            scope.$watch(
                                function () {
                                    return API.currentState;
                                },
                                function (newVal, oldVal) {
                                    if (newVal != oldVal) scope.onChangeState(newVal);
                                }
                            );
                        }

                        // Add complete track event
                        if (scope.vgTrackInfo.events.complete) {
                            scope.$watch(
                                function () {
                                    return API.isCompleted;
                                },
                                function (newVal, oldVal) {
                                    scope.onCompleteVideo(newVal);
                                }
                            );
                        }

                        // Add progress track event
                        if (scope.vgTrackInfo.events.progress) {
                            scope.$watch(
                                function () {
                                    return API.currentTime;
                                },
                                function (newVal, oldVal) {
                                    scope.onUpdateTime(newVal / 1000);
                                }
                            );

                            var totalTimeWatch = scope.$watch(
                                function () {
                                    return API.totalTime;
                                },
                                function (newVal, oldVal) {
                                    totalMiliseconds = newVal / 1000;

                                    if (totalMiliseconds > 0) {
                                        var totalTracks = scope.vgTrackInfo.events.progress - 1;
                                        var progressJump = Math.floor(totalMiliseconds * scope.vgTrackInfo.events.progress / 100);

                                        for (var i = 0; i < totalTracks; i++) {
                                            progressTracks.push({
                                                percent: (i + 1) * scope.vgTrackInfo.events.progress,
                                                jump: (i + 1) * progressJump
                                            });
                                        }

                                        totalTimeWatch();
                                    }
                                }
                            );
                        }
                    };

                    if (API.isConfig) {
                        scope.$watch("API.config",
                            function () {
                                if (scope.API.config) {
                                    scope.vgTrackInfo = scope.API.config.plugins.analytics;
                                    scope.addWatchers();
                                }
                            }
                        );
                    }
                    else {
                        scope.addWatchers();
                    }
                }
            }
        }
        ]);
