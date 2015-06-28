'use strict';
angular.module('myApp').controller('MultiPlayersCtrl',
    function ($sce) {
        this.commonConfig = {
            sources: null,
            loop: true,
            theme: "styles/themes/default/videogular.css",
            plugins: {
                controls: {
                    autoHide: false,
                    autoHideTime: 3000
                },
                poster: {
                    url: "assets/images/videogular.png"
                }
            }
        };

        this.sources = [
            {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.mp4"), type: "video/mp4"},
            {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.ogg"), type: "video/ogg"},
            {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.webm"), type: "video/webm"}
        ];

        this.videoConfigs = [];

        for (var i = 0, l = this.sources.length; i < l; i++) {
            var config = angular.copy(this.commonConfig);
            config.sources = [];
            config.sources.push(this.sources[i]);

            this.videoConfigs.push(config);
        }
    }
);
