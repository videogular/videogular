'use strict';
angular.module('myApp').controller('ImaAdsCtrl',
    function ($sce) {
        this.currentTime = 0;
        this.totalTime = 0;
        this.state = null;
        this.volume = 1;
        this.isCompleted = false;
        this.API = null;

        this.onPlayerReady = function (API) {
            this.API = API;
        };

        this.onCompleteVideo = function () {
            this.isCompleted = true;
        };

        this.onUpdateState = function (state) {
            this.state = state;
        };

        this.onUpdateTime = function (currentTime, totalTime) {
            this.currentTime = currentTime;
            this.totalTime = totalTime;
        };

        this.onUpdateVolume = function (newVol) {
            this.volume = newVol;
        };

        this.videos = [
            {
                sources: [
                    {
                        src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.mp4"),
                        type: "video/mp4"
                    },
                    {
                        src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.webm"),
                        type: "video/webm"
                    },
                    {
                        src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.ogg"),
                        type: "video/ogg"
                    }
                ],
                tracks: [
                    {
                        src: "assets/subs/pale-blue-dot.vtt",
                        kind: "captions",
                        srclang: "en",
                        label: "English",
                        default: "default"
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
            autoHide: false,
            autoHideTime: 3000,
            autoPlay: false,
            sources: this.videos[0].sources,
            tracks: this.videos[0].tracks,
            loop: false,
            preload: "auto",
            transclude: true,
            controls: undefined,
            theme: {
                url: "styles/themes/default/videogular.css"
            },
            plugins: {
                poster: {
                    url: "assets/images/videogular.png"
                },
                ads: {
                    companion: "companionAd",
                    companionSize: [728, 90],
                    network: "6062",
                    unitPath: "iab_vast_samples",
                    adTagUrl: "http://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=vmap&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ar%3Dpremidpost&cmsid=496&vid=short_onecue&correlator=",
                    skipButton: "<div class='skipButton'>skip ad</div>"
                }
            }
        };

        this.changeSource = function () {
            this.config.sources = this.videos[1].sources;
            this.config.tracks = undefined;
            this.config.loop = false;
            this.config.preload = true;
        };

        this.changeAds = function () {
            this.config.plugins.ads.adTagUrl = "http://ad3.liverail.com/?LR_PUBLISHER_ID=1331&LR_CAMPAIGN_ID=229&LR_SCHEMA=vast2";
        };
    }
);
