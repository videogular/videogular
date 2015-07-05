/**
 * @license videogular v1.2.4 http://videogular.com
 * Two Fucking Developers http://twofuckingdevelopers.com
 * License: MIT
 */
/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.dash.directive:vgDash
 * @restrict A
 * @description
 * Adds DASH support for vg-media.
 * This plugin requires dash.all.js file available at dash.js project:
 * https://github.com/Dash-Industry-Forum/dash.js
 *
 * <pre>
 * <videogular vg-theme="config.theme.url" vg-autoplay="config.autoPlay">
 *    <vg-media vg-src="sources" vg-dash></vg-media>
 * </videogular>
 * </pre>
 *
 */
"use strict";
angular.module("com.2fdevs.videogular.plugins.dash", [])
    .directive(
    "vgDash",
    [function () {
        return {
            restrict: "A",
            require: "^videogular",
            link: function (scope, elem, attr, API) {
                var context;
                var player;

                scope.isDASH = function isDASH(url) {
                    if (url.indexOf) {
                        return (url.indexOf(".mpd") > 0);
                    }
                };

                scope.onSourceChange = function onSourceChange(url) {
                    // It's DASH, we use Dash.js
                    if (scope.isDASH(url)) {
                        context = new Dash.di.DashContext();
                        player = new MediaPlayer(context);
                        player.setAutoPlay(API.autoPlay);
                        player.startup();
                        player.attachView(API.mediaElement[0]);
                        player.attachSource(url);
                    }
                    else {
                        if (player) {
                            player.reset();
                            player = null;
                        }
                    }
                };

                scope.$watch(
                    function () {
                        return API.sources;
                    },
                    function (newVal, oldVal) {
                        scope.onSourceChange(newVal[0].src);
                    }
                );
            }
        }
    }
    ]);

