/**
 * @license videogular v1.4.4 http://videogular.com
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

                scope.$watch(
                    function () {
                        return API.currentState;
                    },
                    function (newVal, oldVal) {
                        if (scope.vgAutohide) scope.showControls();
                    }
                );
            }
        }
    }]
);
