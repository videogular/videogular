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
    .run(["$templateCache",
        function ($templateCache) {
            $templateCache.put("vg-templates/vg-scrub-bar",
                '<div role="slider" ' +
                      'aria-valuemax="{{ariaTime(API.totalTime)}}" ' +
                      'aria-valuenow="{{ariaTime(API.currentTime)}}" ' +
                      'aria-valuemin="0" ' +
                      'aria-label="Time scrub bar" ' +
                      'tabindex="0" ' +
                      'ng-keydown="onScrubBarKeyDown($event)">' +
                '</div>' +
                '<div class="container" ng-transclude></div>'
            );
        }]
    )
    .directive("vgScrubBar", ["VG_STATES", "VG_UTILS",
        function (VG_STATES, VG_UTILS) {
            return {
                restrict: "E",
                require: "^videogular",
                transclude: true,
                templateUrl: function (elem, attrs) {
                    return attrs.vgTemplate || 'vg-templates/vg-scrub-bar';
                },
                scope: {
                    vgThumbnails: "="
                },
                link: function (scope, elem, attr, API) {
                    var isSeeking = false;
                    var isPlaying = false;
                    var isPlayingWhenSeeking = false;
                    var LEFT = 37;
                    var RIGHT = 39;
                    var NUM_PERCENT = 5;
                    var thumbnailsWidth = 0;
                    var thumbWidth = 0;
                    var slider = elem[0].querySelector("div[role=slider]");

                    scope.thumbnails = false;
                    scope.thumbnailContainer = {};

                    scope.API = API;

                    scope.onLoadThumbnails = function(event) {
                        thumbnailsWidth = event.path[0].naturalWidth;
                        thumbWidth = thumbnailsWidth / 100;
                    };

                    scope.ariaTime = function (time) {
                        return Math.round(time / 1000);
                    };

                    scope.getOffset = function getOffset(event) {
                        var el = event.target,
                        x = 0;

                        while (el && !isNaN(el.offsetLeft)) {
                            x += el.offsetLeft - el.scrollLeft;
                            el = el.offsetParent;
                        }

                        return event.clientX - x;
                    };

                    scope.onScrubBarTouchStart = function onScrubBarTouchStart($event) {
                        var event = $event.originalEvent || $event;
                        var touches = event.touches;
                        var touchX = scope.getOffset(touches[0]);

                        isSeeking = true;
                        if (isPlaying) isPlayingWhenSeeking = true;
                        API.pause();
                        API.seekTime(touchX * API.mediaElement[0].duration / slider.scrollWidth);

                        scope.$digest();
                    };

                    scope.onScrubBarTouchEnd = function onScrubBarTouchEnd($event) {
                        var event = $event.originalEvent || $event;
                        if (isPlayingWhenSeeking) {
                            isPlayingWhenSeeking = false;
                            API.play();
                        }
                        isSeeking = false;

                        scope.$digest();
                    };

                    scope.onScrubBarTouchMove = function onScrubBarTouchMove($event) {
                        var event = $event.originalEvent || $event;
                        var touches = event.touches;
                        var touchX = scope.getOffset(touches[0]);

                        if (scope.vgThumbnails && scope.vgThumbnails.length) {
                            var second = Math.round(touchX * API.mediaElement[0].duration / slider.scrollWidth);
                            var percentage = Math.round(second * 100 / (API.totalTime / 1000));

                            scope.updateThumbnails(percentage);
                        }

                        if (isSeeking) {
                            API.seekTime(touchX * API.mediaElement[0].duration / slider.scrollWidth);
                        }

                        scope.$digest();
                    };

                    scope.onScrubBarTouchLeave = function onScrubBarTouchLeave(event) {
                        isSeeking = false;
                        scope.thumbnails = false;

                        scope.$digest();
                    };

                    scope.onScrubBarMouseDown = function onScrubBarMouseDown(event) {
                        event = VG_UTILS.fixEventOffset(event);

                        isSeeking = true;
                        if (isPlaying) isPlayingWhenSeeking = true;
                        API.pause();

                        API.seekTime(event.offsetX * API.mediaElement[0].duration / slider.scrollWidth);

                        scope.$digest();
                    };

                    scope.onScrubBarMouseUp = function onScrubBarMouseUp(event) {
                        //event = VG_UTILS.fixEventOffset(event);

                        if (isPlayingWhenSeeking) {
                            isPlayingWhenSeeking = false;
                            API.play();
                        }
                        isSeeking = false;
                        //API.seekTime(event.offsetX * API.mediaElement[0].duration / slider.scrollWidth);

                        scope.$digest();
                    };

                    scope.onScrubBarMouseMove = function onScrubBarMouseMove(event) {
                        if (scope.vgThumbnails && scope.vgThumbnails.length) {
                            var second = Math.round(event.offsetX * API.mediaElement[0].duration / slider.scrollWidth);
                            var percentage = Math.round(second * 100 / (API.totalTime / 1000));

                            scope.updateThumbnails(percentage);
                        }

                        if (isSeeking) {
                            event = VG_UTILS.fixEventOffset(event);
                            API.seekTime(event.offsetX * API.mediaElement[0].duration / slider.scrollWidth);
                        }

                        scope.$digest();
                    };

                    scope.onScrubBarMouseLeave = function onScrubBarMouseLeave(event) {
                        isSeeking = false;
                        scope.thumbnails = false;

                        scope.$digest();
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

                    scope.updateThumbnails = function updateThumbnails(percentage) {
                        var bgPos = Math.round(thumbnailsWidth * percentage / 100);
                        var thPos = (slider.scrollWidth * percentage / 100) - (thumbWidth / 2);

                        scope.thumbnailContainer = {
                            "width": thumbWidth + "px",
                            "left": thPos + "px"
                        };

                        scope.thumbnails = {
                            "background-image": 'url("' + scope.vgThumbnails + '")',
                            "background-position": -bgPos + "px 0px"
                        };
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

                    scope.onDestroy = function() {
                        elem.unbind("touchstart", scope.onScrubBarTouchStart);
                        elem.unbind("touchend", scope.onScrubBarTouchEnd);
                        elem.unbind("touchmove", scope.onScrubBarTouchMove);
                        elem.unbind("touchleave", scope.onScrubBarTouchLeave);
                        elem.unbind("mousedown", scope.onScrubBarMouseDown);
                        elem.unbind("mouseup", scope.onScrubBarMouseUp);
                        elem.unbind("mousemove", scope.onScrubBarMouseMove);
                        elem.unbind("mouseleave", scope.onScrubBarMouseLeave);
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

                    if (scope.vgThumbnails) {
                        var thLoader = new Image();
                        thLoader.onload = scope.onLoadThumbnails.bind(scope);
                        thLoader.src = scope.vgThumbnails;
                    }

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

                    scope.$on('destroy', scope.onDestroy.bind(scope));
                }
            }
        }
    ]);
