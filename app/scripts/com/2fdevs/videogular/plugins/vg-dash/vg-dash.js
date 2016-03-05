/**
 * @license videogular v1.4.2 http://videogular.com
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
angular.module("com.2fdevs.videogular.plugins.dash", ["com.2fdevs.videogular"])

    .constant("VG_DASH_IS_SUPPORTED", (function(){
        var dashCapabilitiesUtil = new MediaPlayer.utils.Capabilities();

        return dashCapabilitiesUtil.supportsMediaSource();
    })())

    .directive(
    "vgDash",
    ["VG_DASH_IS_SUPPORTED", function (VG_DASH_IS_SUPPORTED) {
        return {
            restrict: "A",
            require: "^videogular",
            link: function (scope, elem, attr, API) {
                var context;
                var player;

                //Proceed augmenting behavior only if the browser is capable of playing DASH (supports MediaSource Extensions)
                if (VG_DASH_IS_SUPPORTED) {
                    scope.isDASH = function(src, type){
                        var dashTypeRegEx = /^application\/dash\+xml/i;
                        var hasDashType = dashTypeRegEx.test(type);
                        var hasDashExtension = src.indexOf && (src.indexOf(".mpd") > 0);

                        return hasDashType || hasDashExtension; //Returns true if the source has the standard DASH type defined OR an .mpd extension.
                    };

                    scope.loadDashPlayer = function(src, type){
                         if (src && scope.isDASH(src, type)) {
                            player = new MediaPlayer(new Dash.di.DashContext());
                            player.setAutoPlay(API.autoPlay);
                            player.startup();
                            player.attachView(API.mediaElement[0]);
                            player.attachSource(src);
                            return scope.unloadDashPlayer;
                        }

                        return false;
                    };

                    scope.unloadDashPlayer = function() {
                        if (player) {
                            //Dettach Dash.js from the mediaElement
                            try {
                                API.stop();
                                player.reset();
                            } catch(ex){} //chomp
                            player = null;
                        }
                    };

                    API.registerPlaybackPlugin(scope.loadDashPlayer);
                }
            }
        }
    }
    ]);
