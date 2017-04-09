/**
 * @license videogular v1.4.4 http://videogular.com
 * Two Fucking Developers http://twofuckingdevelopers.com
 * License: MIT
 */
/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.overlayplay.directive:vgOverlayPlay
 * @restrict E
 * @description
 * Shows a big play button centered when player is paused or stopped.
 *
 * <pre>
 * <videogular vg-theme="config.theme.url" vg-autoplay="config.autoPlay">
 *    <vg-media vg-src="sources"></vg-media>
 *
 *    <vg-overlay-play></vg-overlay-play>
 * </videogular>
 * </pre>
 *
 */
"use strict";
angular.module("com.2fdevs.videogular.plugins.overlayplay", [])
    .run(
        ["$templateCache", function ($templateCache) {
            $templateCache.put("vg-templates/vg-overlay-play",
                '<div class="overlayPlayContainer" ng-click="onClickOverlayPlay()">\
                  <div class="iconButton" ng-class="overlayPlayIcon"></div>\
                </div>');
        }]
    )
    .directive("vgOverlayPlay", ["VG_STATES",
        function (VG_STATES) {
            return {
                restrict: "E",
                require: "^videogular",
                scope: {},
                templateUrl: function (elem, attrs) {
                    return attrs.vgTemplate || 'vg-templates/vg-overlay-play';
                },
                link: function (scope, elem, attr, API) {
                    scope.onChangeState = function onChangeState(newState) {
                        switch (newState) {
                            case VG_STATES.PLAY:
                                scope.overlayPlayIcon = {};
                                break;

                            case VG_STATES.PAUSE:
                                scope.overlayPlayIcon = {play: true};
                                break;

                            case VG_STATES.STOP:
                                scope.overlayPlayIcon = {play: true};
                                break;
                        }
                    };

                    scope.onClickOverlayPlay = function onClickOverlayPlay(event) {
                        API.playPause();
                    };

                    scope.overlayPlayIcon = {play: true};

                    scope.$watch(
                        function () {
                            return API.currentState;
                        },
                        function (newVal, oldVal) {
                            scope.onChangeState(newVal);
                        }
                    );
                }
            }
        }
    ]);

