/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.direcitve:vgMedia
 * @restrict E
 * @description
 * Directive to add a source of videos or audios. This directive will create a &lt;video&gt; or &lt;audio&gt; tag and usually will be above plugin tags.
 *
 * @param {array} vgNativePlayBlacklist An array of functions that accept a media source object and a user agent string. If the function returns true, native playback will be prevented.
 * @param {array} vgSrc Bindable array with a list of media sources or a simple url string. A media source is an object with two properties `src` and `type`. The `src` property must contains a trustful url resource.
 * @param {string} vgType String with "video" or "audio" values to set a <video> or <audio> tag inside <vg-media>.
 * 
 * <pre>
 * {
 *    src: $sce.trustAsResourceUrl("path/to/video/videogular.mp4"),
 *    type: "video/mp4"
 * }
 * </pre>
 *
 */
"use strict";
angular.module("com.2fdevs.videogular")
    .directive("vgMedia",
    ["$timeout", "$window", "VG_UTILS", "VG_STATES", function ($timeout, $window, VG_UTILS, VG_STATES) {
        return {
            restrict: "E",
            require: "^videogular",
            templateUrl: function (elem, attrs) {
                var vgType = attrs.vgType || "video";
                return attrs.vgTemplate || "vg-templates/vg-media-" + vgType;
            },
            scope: {
                vgNativePlayBlacklist: "=?",
                vgSrc: "=?",
                vgType: "=?"                
            },
            link: function (scope, elem, attrs, API) {
                var sources;

                // what type of media do we want? defaults to 'video'
                if (!attrs.vgType || attrs.vgType === "video") {
                    attrs.vgType = "video";
                }
                else {
                    attrs.vgType = "audio";
                }

                // FUNCTIONS
                scope.onChangeSource = function onChangeSource(newValue, oldValue) {
                    if ((!sources || newValue != oldValue) && newValue) {
                        sources = newValue;

                        if (API.currentState !== VG_STATES.PLAY) {
                            API.currentState = VG_STATES.STOP;
                        }

                        API.sources = sources;
                        scope.changeSource();
                    }
                };

                scope.changeSource = function changeSource() {
                    var canPlay = "";
                    var isSourceApplied = false;
                    var normalizedSources = angular.isArray(sources) ? sources : [sources];
                    var firstSource = normalizedSources.length ? normalizedSources[0] : null;

                    // It's a cool browser
                    if (API.mediaElement[0].canPlayType) {
                        for (var i = 0, l = normalizedSources.length; i < l; i++) {
                            var currentSource = normalizedSources[i];

                            if (!currentSource || isNativePlayBlacklisted(currentSource)) {
                                continue;
                            }

                            //Check to see if the media element can play the current source
                            //Consider that you can play it if type has not been defined
                            canPlay = (typeof(currentSource.type) != "undefined") ? API.mediaElement[0].canPlayType(currentSource.type) : "maybe";

                            //if it's usable, apply the current source
                            if (canPlay == "maybe" || canPlay == "probably") {
                                isSourceApplied = true;

                                applySourceToMediaElement(currentSource);
                                break;
                            }
                        }
                    }
                    // It's a crappy browser and it doesn't deserve any respect
                    else if (firstSource && !isNativePlayBlacklisted(firstSource)) {
                        isSourceApplied = true;

                        // Get H264 or the first one
                        applySourceToMediaElement(firstSource);
                    }

                    if (isSourceApplied) {
                        // Android 2.3 support: https://github.com/2fdevs/videogular/issues/187
                        if (VG_UTILS.isMobileDevice()) API.mediaElement[0].load();

                        //autoplay behavior
                        $timeout(function () {
                            if (API.autoPlay && (VG_UTILS.isCordova() || !VG_UTILS.isMobileDevice())) {
                                API.play();
                            }
                        });
                    } 
                    //no source applied
                    else { 
                        API.onVideoError();
                    }
                };

                // INIT
                API.mediaElement = elem.find(attrs.vgType);
                API.sources = scope.vgSrc;

                API.addListeners();
                API.onVideoReady();

                scope.$watch("vgSrc", scope.onChangeSource);
                scope.$watch(
                    function() {
                        return API.sources;
                    },
                    scope.onChangeSource
                );

                scope.$watch(
                    function() {
                        return API.playsInline;
                    },
                    function (newValue, oldValue) {
                        if (newValue) {
                            API.mediaElement.attr("webkit-playsinline", "");
                            API.mediaElement.attr("playsinline", "");
                        } else {
                            API.mediaElement.removeAttr("webkit-playsinline");
                            API.mediaElement.removeAttr("playsinline");
                        }
                    }
                );

                if (API.isConfig) {
                    scope.$watch(
                        function () {
                            return API.config;
                        },
                        function () {
                            if (API.config) {
                                scope.vgSrc = API.config.sources;
                            }
                        }
                    );
                }

                function applySourceToMediaElement(source) {
                    //Bind it to the correct attribute
                    if (typeof(source.srcObject) != "undefined") {
                        API.mediaElement[0].srcObject = source.srcObject;
                    } else {
                        API.mediaElement.attr({
                            src: source.src,
                            type: source.type
                        });
                    }

                    //Trigger vgChangeSource($source) API callback in vgController
                    API.changeSource(source);
                }

                function isNativePlayBlacklisted(source) {
                    var userAgent = $window.navigator.userAgent;

                    if (!source || !angular.isArray(scope.vgNativePlayBlacklist)) {
                        return false;
                    }

                    return scope.vgNativePlayBlacklist.reduce(function(accumulator, currentNativeBlacklistFunc) {
                        return accumulator || 
                            (angular.isFunction(currentNativeBlacklistFunc) && currentNativeBlacklistFunc(source, userAgent));
                    }, false);
                }
            }
        }
    }
    ]);
