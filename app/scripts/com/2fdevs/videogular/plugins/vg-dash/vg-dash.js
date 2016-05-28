/**
 * @license videogular v1.4.4 http://videogular.com
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
    ["$window", function ($window) {
        return {
            restrict: "A",
            require: "^videogular",
            link: function (scope, elem, attr, API) {
                var player;
                var dashTypeRegEx = /^application\/dash\+xml/i;

                function supportsMediaSource() {
                    return "MediaSource" in $window;
                }

                //Proceed augmenting behavior only if the browser is capable of playing DASH (supports MediaSource Extensions)
                if (supportsMediaSource()) {

                    //Returns true if the source has the standard DASH type defined OR an .mpd extension.
                    scope.isDASH = function isDASH(source) {
                        var hasDashType = dashTypeRegEx.test(source.type);
                        var hasDashExtension = source.src.indexOf && (source.src.indexOf(".mpd") > 0);

                        return hasDashType || hasDashExtension;
                    };

                    scope.onSourceChange = function onSourceChange(source) {
                        var url = source.src;

                        // It's DASH, we use dash.js
                        if (scope.isDASH(source)) {
                            if (angular.isFunction(dashjs && dashjs.MediaPlayer)) {
                                // dash.js version 2.x
                                player = dashjs.MediaPlayer().create();
                                player.initialize(API.mediaElement[0], url, API.autoPlay);
                            } else {
                                // dash.js version < 2.x
                                player = new MediaPlayer(new Dash.di.DashContext());
                                player.setAutoPlay(API.autoPlay);
                                player.startup();
                                player.attachView(API.mediaElement[0]);
                                player.attachSource(url);
                            }
                        }
                        else if (player) {
                            //not DASH, but the dash.js player is still wired up
                            //Dettach dash.js from the mediaElement
                            player.reset();
                            player = null;

                            //player.reset() wipes out the new url already applied, so have to reapply
                            API.mediaElement.attr('src', url);
                            API.stop();
                        }
                    };

                    scope.$watch(
                        function () {
                            return API.sources;
                        },
                        function (newVal, oldVal) {
                            scope.onSourceChange(newVal[0]);
                        }
                    );
                }
            }
        }
    }
    ]);

