'use strict';
angular.module('myApp').controller('VirtualClipsCtrl',
    function ($sce) {
        this.onPlayerReady = function (API) {
            this.API = API;
        };

        this.onError = function (event) {
            console.log("VIDEOGULAR ERROR EVENT");
            console.log(event);
        };

        this.media = [
            {
                sources: [
                    {
                        src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.mp4"),
                        type: "video/mp4"
                    },
                    {
                        src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.ogg"),
                        type: "video/ogg"
                    },
                    {
                        src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.webm"),
                        type: "video/webm"
                    }
                ],
                tracks: [
                    {
                        src: "assets/subs/pale-blue-dot.vtt",
                        kind: "captions",
                        srclang: "en",
                        label: "English",
                        default: "default"
                    },
                    {
                        src: "assets/subs/pale-blue-dot-es.vtt",
                        kind: "captions",
                        srclang: "es",
                        label: "Spanish",
                        default: null
                    }
                ]
            },
            {
                sources: [
                    {
                        src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/big_buck_bunny_720p_h264.mov"),
                        type: "video/mp4"
                    },
                    {
                        src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/big_buck_bunny_720p_stereo.ogg"),
                        type: "video/ogg"
                    }
                ]
            }
        ];

        this.config = {
            startTime: 15,
            virtualDuration: 30,
            sources: this.media[0].sources,
            tracks: this.media[0].tracks,
            theme: {
                url: "styles/themes/default/videogular.css"
            }
        };
    }
);
