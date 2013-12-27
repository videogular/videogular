"use strict";
angular.module("info.vietnamcode.nampnq.videogular.plugins.youtube", [])
    .run(['$rootScope', '$window',
        function($rootScope, $window) {
            $rootScope.youtubeApiReady = false;
            $window.onYouTubeIframeAPIReady = function() {
                $rootScope.$apply(function() {
                    $rootScope.youtubeApiReady = true;
                });

            };
            console.log("Init youtube api");
            var tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }
    ])
    .directive(
        "vgYoutube", ["VG_EVENTS", "VG_STATES", "$rootScope", "$window",
            function(VG_EVENTS, VG_STATES, $rootScope, $window) {
                return {
                    restrict: "E",
                    require: "^videogular",
                    templateUrl: "views/videogular/plugins/youtube/youtube.html",
                    scope: {},
                    link: function(scope, elem, attr, API) {
                        var result = {
                            method: "",
                            url: ""
                        };
                        scope.vgYoutubePlayerId = Date.now();
                        scope.onYoutubeStateChange = function(event) {
                            var videogularElementScope = API.elementScope.scope().$$childHead;
                            if (event.data == YT.PlayerState.BUFFERING) {
                                videogularElementScope.onStartBuffering({
                                    target: API.videoElement[0]
                                })
                            } else if (event.data == YT.PlayerState.ENDED) {
                                videogularElementScope.onComplete({
                                    target: API.videoElement[0]
                                });
                            } else if (event.data == YT.PlayerState.PLAYING) {
                                videogularElementScope.onStartPlaying({
                                    target: API.videoElement[0]
                                })
                            } else if (event.data == YT.PlayerState.PAUSED) {
                                API.pause();
                            }
                        }
                        scope.onVideoReady = function() {
                            var videogularElementScope = API.elementScope.scope().$$childHead,
                                vgOverPlayElementScope = angular.element('vg-overlay-play>div', API.videogularElement).scope();
                            vgOverPlayElementScope.currentIcon = vgOverPlayElementScope.playIcon;
                            API.videoElement.remove();
                            API.videoElement = angular.element("#youtube_player_" + scope.vgYoutubePlayerId);
                            //Overwrite method onPlayerReady in videogularElementScope
                            videogularElementScope.onPlayerReady = function() {
                                videogularElementScope.doPlayerReady();
                            };

                            //Call method onVideoReady in videogularElementScope
                            videogularElementScope.onVideoReady();
                            //Define some property, method for player
                            API.videoElement[0].__defineGetter__("currentTime", function() {
                                return scope.ytplayer.getCurrentTime();
                            });
                            API.videoElement[0].__defineSetter__("currentTime", function(seconds) {
                                return scope.ytplayer.seekTo(seconds, true);
                            });
                            API.videoElement[0].__defineGetter__("duration", function() {
                                return scope.ytplayer.getDuration();
                            });
                            API.videoElement[0].__defineGetter__("paused", function() {
                                return scope.ytplayer.getPlayerState() != YT.PlayerState.PLAYING;
                            });
                            API.videoElement[0].__defineGetter__("videoWidth", function() {
                                return scope.ytplayer.a.width;
                            });
                            API.videoElement[0].__defineGetter__("videoHeight", function() {
                                return scope.ytplayer.a.height;
                            });
                            API.videoElement[0].__defineGetter__("volume", function() {
                                return scope.ytplayer.getVolume() / 100.0;
                            });
                            API.videoElement[0].__defineSetter__("volume", function(volume) {
                                return scope.ytplayer.setVolume(volume * 100.0);
                            });
                            API.videoElement[0].play = function() {
                                API.videoElement.css('display', 'block');
                                scope.ytplayer.playVideo();
                            }
                            API.videoElement[0].pause = function() {
                                API.videoElement.css('display', 'none');
                                scope.ytplayer.pauseVideo();
                            };
                            scope.ytplayer.setSize(API.getSize().width, API.getSize().height);
                            videogularElementScope.updateSize();
                            setInterval(function() {
                                videogularElementScope.onUpdateTime({
                                    target: API.videoElement[0]
                                })
                            }, 600);


                        }
                        scope.loadYoutube = function() {
                            var videogularElementScope = API.elementScope.scope().$$childHead,
                                vgOverPlayElementScope = angular.element('vg-overlay-play>div', API.videogularElement).scope();
                            vgOverPlayElementScope.currentIcon = "";
                            scope.ytplayer = new YT.Player('youtube_player_' + scope.vgYoutubePlayerId, {
                                height: API.getSize().height,
                                width: API.getSize().width,
                                videoId: scope.videoId,
                                playerVars: {
                                    controls: 0,
                                    showinfo: 0
                                },
                                events: {
                                    'onReady': scope.onVideoReady,
                                    'onStateChange': scope.onYoutubeStateChange
                                }
                            });
                        }
                        scope.parseSrc = function(src) {
                            if (src) {
                                // Regex to parse the video ID
                                var regId = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                                var match = src.match(regId);

                                if (match && match[2].length == 11) {
                                    scope.videoId = match[2];
                                } else {
                                    scope.videoId = null;
                                }

                                // Regex to parse the playlist ID
                                var regPlaylist = /[?&]list=([^#\&\?]+)/;
                                match = src.match(regPlaylist);

                                if (match != null && match.length > 1) {
                                    scope.playlistId = match[1];
                                } else {
                                    // Make sure their is no playlist
                                    if (scope.playlistId) {
                                        delete scope.playlistId;
                                    }
                                }

                                // Parse video quality option
                                var regVideoQuality = /[?&]vq=([^#\&\?]+)/;
                                match = src.match(regVideoQuality);

                                if (match != null && match.length > 1) {
                                    scope.userQuality = match[1];
                                }
                            }
                        };
                        $rootScope.$watch('youtubeApiReady', function(value) {
                            if (value) {
                                console.log("Api loaded..");
                                if (result.method === 'youtube')
                                    scope.loadYoutube();
                            }
                        })
                        scope.removeHtmlMediaElementListener = function(htmlMediaElement) {
                            htmlMediaElement.removeEventListener("waiting");
                            htmlMediaElement.removeEventListener("ended");
                            htmlMediaElement.removeEventListener("playing");
                            htmlMediaElement.removeEventListener("timeupdate");
                        }
                        scope.checkYoutubeSource = function() {
                            var htmlMediaElement = API.videoElement[0];
                            var mediaFiles = [],
                                i,
                                n,
                                type,
                                media,
                                src;
                            for (i = 0; i < htmlMediaElement.childNodes.length; i++) {
                                n = htmlMediaElement.childNodes[i];
                                if (n.nodeType == 1 && n.tagName.toLowerCase() == 'source') {
                                    src = n.getAttribute('src');
                                    type = n.getAttribute('type');
                                    media = n.getAttribute('media');

                                    if (!media || !window.matchMedia || (window.matchMedia && window.matchMedia(media).matches)) {
                                        mediaFiles.push({
                                            type: type,
                                            url: src
                                        });
                                    }
                                }
                            }
                            for (i = 0; i < mediaFiles.length; i++) {
                                // normal check
                                if (htmlMediaElement.canPlayType(mediaFiles[i].type).replace(/no/, '') !== ''
                                    // special case for Mac/Safari 5.0.3 which answers '' to canPlayType('audio/mp3') but 'maybe' to canPlayType('audio/mpeg')
                                    || htmlMediaElement.canPlayType(mediaFiles[i].type.replace(/mp3/, 'mpeg')).replace(/no/, '') !== '') {
                                    result.method = 'native';
                                    result.url = mediaFiles[i].url;
                                    break;
                                }
                            }

                            if (result.method !== 'native') {
                                for (i = 0; i < mediaFiles.length; i++) {
                                    type = mediaFiles[i].type;
                                    if (type == "video/youtube") {
                                        result.method = "youtube";
                                        result.url = mediaFiles[i].url;
                                    }
                                }

                            }
                            if (result.method === 'native') {
                                if (result.url !== null) {
                                    console.log("Please check youtube video in source");
                                }
                            } else if (result.method === 'youtube') {
                                scope.removeHtmlMediaElementListener(htmlMediaElement);
                                scope.parseSrc(result.url);
                            }
                        };
                        scope.checkYoutubeSource();

                    }
                }
            }
        ]);
