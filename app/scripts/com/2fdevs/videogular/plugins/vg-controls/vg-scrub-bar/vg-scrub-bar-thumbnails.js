/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.controls.directive:vgScrubBarThumbnails
 * @restrict E
 * @description
 * Layer inside vg-scrub-bar to display thumbnails.
 *
 * <pre>
 * <videogular vg-theme="config.theme.url">
 *    <vg-media vg-src="sources"></vg-media>
 *
 *    <vg-controls>
 *        <vg-scrub-bar>
 *            <vg-scrub-bar-thumbnails vg-thumbnail-strip='config.thumbnailStrip'></vg-scrub-bar-thumbnails>
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
                    "vgThumbnailStrip": "="
                },
                link: function (scope, elem, attr, API) {
                    var thumbnailsWidth = 0;
                    var thumbWidth = 0;
                    var slider = elem[0].querySelector(".background");

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

                    scope.updateThumbnails = function(percentage) {
                        var bgPos = Math.round(thumbnailsWidth * percentage / 100);
                        var thPos = (slider.scrollWidth * percentage / 100) - (thumbWidth / 2);

                        scope.thumbnailContainer = {
                            "width": thumbWidth + "px",
                            "left": thPos + "px"
                        };

                        scope.thumbnails = {
                            "background-image": 'url("' + scope.vgThumbnailStrip + '")',
                            "background-position": -bgPos + "px 0px"
                        };
                    };

                    scope.onMouseMove = function($event) {
                        var second = Math.round($event.offsetX * API.mediaElement[0].duration / slider.scrollWidth);
                        var percentage = Math.round(second * 100 / (API.totalTime / 1000));

                        scope.updateThumbnails(percentage);

                        scope.$apply();
                    };

                    scope.onTouchMove = function($event) {
                        var touches = $event.touches;
                        var touchX = scope.getOffset(touches[0]);
                        var second = Math.round(touchX * API.mediaElement[0].duration / slider.scrollWidth);
                        var percentage = Math.round(second * 100 / (API.totalTime / 1000));

                        scope.updateThumbnails(percentage);

                        scope.$apply();
                    };

                    scope.onMouseLeave = function(event) {
                        scope.thumbnails = false;

                        scope.$apply();
                    };

                    scope.onTouchLeave = function(event) {
                        scope.thumbnails = false;

                        scope.$apply();
                    };

                    scope.onDestroy = function() {
                        elem.unbind("touchmove", scope.onTouchMove);
                        elem.unbind("touchleave", scope.onTouchLeave);
                        elem.unbind("touchend", scope.onTouchLeave);
                        elem.unbind("mousemove", scope.onMouseMove);
                        elem.unbind("mouseleave", scope.onMouseLeave);
                    };

                    var thLoader = new Image();
                    thLoader.onload = scope.onLoadThumbnails.bind(scope);
                    thLoader.src = scope.vgThumbnailStrip;

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
