/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls.directive:vgScrubBarThumbnails
 * @restrict E
 * @description
 * Layer inside vg-scrub-bar to display thumbnails.
 *
 * Param thumbnails could be a string url pointing to a strip of thumbnails or an array of objects with the same
 * format that you can find in cue points.
 *
 * **Strip of thumbnails**
 * Must be an image with exactly 100 thumbnails. Recommended size per each thumbnail 107x60
 * Example of param value: "assets/images/strip-of-thumbnails.jpg"
 *
 * To create a strip of thumbnails you can use ffmpeg:
 * ffmpeg -loglevel panic -y -i app/assets/videos/videogular.mp4 -frames 1 -q:v 1 -vf
 * "select=not(mod(n\,29)),scale=-1:60,tile=100x1" app/assets/thumbnails/thumbnail.jpg
 *
 * **List of thumbnails**
 * Array with a list of cue points as images. You can specify start or a lapse with start and end.
 * Example of param value:
 *
 * [
 *     {
 *         "timeLapse": {
 *             "start": 5
 *         },
 *         params: {
 *             "thumbnail": "assets/thumbnails/thumbnail-shown-at-second-5.jpg"
 *         }
 *     },
 *     {
 *         "timeLapse": {
 *             "start": 49,
 *             "end": 60
 *         },
 *         "params": {
 *             "thumbnail": "assets/thumbnails/thumbnail-shown-between-seconds-49-and-60.jpg"
 *         }
 *     }
 * ]
 *
 * <pre>
 * <videogular vg-theme="config.theme.url">
 *    <vg-media vg-src="sources"></vg-media>
 *
 *    <vg-controls>
 *        <vg-scrub-bar>
 *            <vg-scrub-bar-thumbnails vg-thumbnails='config.thumbnails'></vg-scrub-bar-thumbnails>
 *        </vg-scrub-bar>
 *    </vg-controls>
 * </videogular>
 * </pre>
 *
 */
angular.module("com.2fdevs.videogular.plugins.controls")
    .run(["$templateCache",
        function ($templateCache) {
            $templateCache.put("vg-templates/vg-scrub-bar-thumbnails",
                '<div class="vg-thumbnails" ng-show="thumbnails" ng-style="thumbnailContainer">' +
                    '<div class="image-thumbnail" ng-style="thumbnails"></div>' +
                '</div>' +
                '<div class="background"></div>'
            );
        }
    ])
    .directive("vgScrubBarThumbnails", ["VG_UTILS",
        function (VG_UTILS) {
            return {
                restrict: "E",
                require: "^videogular",
                templateUrl: function (elem, attrs) {
                    return attrs.vgTemplate || 'vg-templates/vg-scrub-bar-thumbnails';
                },
                scope: {
                    "vgThumbnails": "="
                },
                link: function (scope, elem, attr, API) {
                    var thumbnailsWidth = 0;
                    var thumbWidth = 0;
                    var slider = elem[0].querySelector(".background");
                    var isStrip = (typeof scope.vgThumbnails === "string");

                    scope.thumbnails = false;
                    scope.thumbnailContainer = {};

                    scope.getOffset = function getOffset(event) {
                        var el = event.target,
                            x = 0;

                        while (el && !isNaN(el.offsetLeft)) {
                            x += el.offsetLeft - el.scrollLeft;
                            el = el.offsetParent;
                        }

                        return event.clientX - x;
                    };

                    scope.onLoadThumbnails = function(event) {
                        thumbnailsWidth = event.currentTarget.naturalWidth;
                        thumbWidth = thumbnailsWidth / 100;
                    };

                    scope.onLoadThumbnail = function(event) {
                        thumbWidth = event.currentTarget.naturalWidth;
                    };

                    scope.updateThumbnails = function(second) {
                        var percentage = Math.round(second * 100 / (API.totalTime / 1000));
                        var thPos = (slider.scrollWidth * percentage / 100) - (thumbWidth / 2);

                        if (isStrip) {
                            var bgPos = Math.round(thumbnailsWidth * percentage / 100);

                            scope.thumbnailContainer = {
                                "width": thumbWidth + "px",
                                "left": thPos + "px"
                            };

                            scope.thumbnails = {
                                "background-image": 'url("' + scope.vgThumbnails + '")',
                                "background-position": -bgPos + "px 0px"
                            };
                        }
                        else {
                            var secondsByPixel = API.totalTime / slider.scrollWidth / 1000;
                            var lapse = {
                                start: Math.floor(second - (secondsByPixel / 2)),
                                end: Math.ceil(second)
                            };

                            if (lapse.start < 0) lapse.start = 0;
                            if (lapse.end > API.totalTime) lapse.end = API.totalTime;

                            scope.thumbnailContainer = {
                                "left": thPos + "px"
                            };

                            scope.thumbnails = {
                                "background-image": 'none'
                            };
                            
                            if (scope.vgThumbnails) {
                                for (var i=0, l=scope.vgThumbnails.length; i<l; i++) {
                                    var th = scope.vgThumbnails[i];

                                    if (th.timeLapse.end >= 0) {
                                        if (lapse.start >= th.timeLapse.start && (lapse.end <= th.timeLapse.end || lapse.end <= th.timeLapse.start)) {
                                            scope.thumbnails = {
                                                "background-image": 'url("' + th.params.thumbnail + '")'
                                            };
                                            break;
                                        }
                                    }
                                    else {
                                        if (th.timeLapse.start >= lapse.start && th.timeLapse.start <= lapse.end) {
                                            scope.thumbnails = {
                                                "background-image": 'url("' + th.params.thumbnail + '")'
                                            };
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    };

                    scope.onMouseMove = function($event) {
                        var second = Math.round($event.offsetX * API.mediaElement[0].duration / slider.scrollWidth);

                        scope.updateThumbnails(second);

                        scope.$digest();
                    };

                    scope.onTouchMove = function($event) {
                        var touches = $event.touches;
                        var touchX = scope.getOffset(touches[0]);
                        var second = Math.round(touchX * API.mediaElement[0].duration / slider.scrollWidth);

                        scope.updateThumbnails(second);

                        scope.$digest();
                    };

                    scope.onMouseLeave = function(event) {
                        scope.thumbnails = false;

                        scope.$digest();
                    };

                    scope.onTouchLeave = function(event) {
                        scope.thumbnails = false;

                        scope.$digest();
                    };

                    scope.onDestroy = function() {
                        elem.unbind("touchmove", scope.onTouchMove);
                        elem.unbind("touchleave", scope.onTouchLeave);
                        elem.unbind("touchend", scope.onTouchLeave);
                        elem.unbind("mousemove", scope.onMouseMove);
                        elem.unbind("mouseleave", scope.onMouseLeave);
                    };

                    var thLoader;
                    if (isStrip) {
                        thLoader = new Image();
                        thLoader.onload = scope.onLoadThumbnails.bind(scope);
                        thLoader.src = scope.vgThumbnails;
                    }
                    else {
                        thLoader = new Image();
                        thLoader.onload = scope.onLoadThumbnail.bind(scope);
                        thLoader.src = scope.vgThumbnails[0].params.thumbnail;
                    }

                    // Touch move is really buggy in Chrome for Android, maybe we could use mouse move that works ok
                    if (VG_UTILS.isMobileDevice()) {
                        elem.bind("touchmove", scope.onTouchMove);
                        elem.bind("touchleave", scope.onTouchLeave);
                        elem.bind("touchend", scope.onTouchLeave);
                    }
                    else {
                        elem.bind("mousemove", scope.onMouseMove);
                        elem.bind("mouseleave", scope.onMouseLeave);
                    }

                    scope.$on('destroy', scope.onDestroy.bind(scope));
                }
            }
        }
    ]);
