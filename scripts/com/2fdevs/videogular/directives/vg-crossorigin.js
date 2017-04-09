/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.directive:vgCrossorigin
 * @restrict A
 * @description
 * Optional directive for `vg-media` to add or remove a crossorigin policy to the video object. Possible values are: "anonymous" and "use-credentials".
 * This feature should be enabled if you want to have your subtitles or video files on a different domain than the video player. Additionally you need
 * to add CORS policies to your video and track files to your server to make it work.
 *
 */
"use strict";
angular.module("com.2fdevs.videogular")
    .directive("vgCrossorigin",
    [function () {
        return {
            restrict: "A",
            require: "^videogular",
            link: {
                pre: function (scope, elem, attr, API) {
                    var crossorigin;

                    scope.setCrossorigin = function setCrossorigin(value) {
                        if (value) {
                            API.mediaElement.attr("crossorigin", value);
                        }
                        else {
                            API.mediaElement.removeAttr("crossorigin");
                        }
                    };

                    if (API.isConfig) {
                        scope.$watch(
                            function () {
                                return API.config;
                            },
                            function () {
                                if (API.config) {
                                    scope.setCrossorigin(API.config.crossorigin);
                                }
                            }
                        );
                    }
                    else {
                        scope.$watch(attr.vgCrossorigin, function (newValue, oldValue) {
                            if ((!crossorigin || newValue != oldValue) && newValue) {
                                crossorigin = newValue;
                                scope.setCrossorigin(crossorigin);
                            }
                            else {
                                scope.setCrossorigin();
                            }
                        });
                    }
                }
            }
        }
    }
    ]);
