'use strict';
describe('Directive: Videogular', function () {
    var element;
    var $sce;
    var $scope;
    var $compile;
    var $window;
    var VG_STATES;

    beforeEach(module('com.2fdevs.videogular'));

    beforeEach(inject(function ($injector) {
        $compile = $injector.get('$compile');
        $window = $injector.get('$window');
        $scope = $injector.get('$rootScope').$new();
        $sce = $injector.get('$sce');
        VG_STATES = $injector.get('VG_STATES');

        $scope.config = {
            preload: "none",
            controls: true,
            loop: true,
            nativePlayBlacklist: null,
            sources: [
                {src: $sce.trustAsResourceUrl("assets/videos/videogular.mp4"), type: "video/mp4"},
                {src: $sce.trustAsResourceUrl("assets/videos/videogular.webm"), type: "video/webm"},
                {src: $sce.trustAsResourceUrl("assets/videos/videogular.ogg"), type: "video/ogg"}
            ],
            tracks: [
                {
                    src: "assets/subs/pale-blue-dot-en.vtt",
                    kind: "captions",
                    srclang: "en",
                    label: "English",
                    default: "default"
                },
                {
                    src: "assets/subs/pale-blue-dot-es.vtt",
                    kind: "subtitles",
                    srclang: "es",
                    label: "Español"
                }
            ],
            theme: {
                url: "styles/themes/default/videogular.css"
            }
        };

        element = angular.element(
            '<videogular vg-theme="config.theme.url" vg-clear-media-on-navigate="\'false\'">' +
            '<vg-media vg-src="config.sources" vg-tracks="config.tracks" vg-native-controls="config.controls" vg-preload="config.preload" vg-loop="config.loop" vg-native-play-blacklist="config.nativePlayBlacklist"></vg-media>' +
            '</videogular>'
        );

        $compile(element)($scope);
        $scope.$digest();
    }));

    describe("Element creation - ", function () {
        it("should have been created a video element", function () {
            var video = element.find("video");

            expect(video[0]).not.toBe(null);

            if ($window.navigator.userAgent.toLowerCase().indexOf("webkit") >= 0) {
                // Chrome + MacOS X "Mavericks" 10.9.5
                expect(video.attr("src")).toBe("assets/videos/videogular.mp4");
            }
            if ($window.navigator.userAgent.toLowerCase().indexOf("firefox") >= 0) {
                // Firefox + MacOS X "Mavericks" 10.9.5
                expect(video.attr("src")).toBe("assets/videos/videogular.mp4");
            }

            expect(video.attr("controls")).not.toBe(null);
            expect(video.attr("preload")).toBe("none");
            expect(video.attr("loop")).toBe("loop");
        });

        it("should have been created two track elements", function () {
            var vgMedia = element.find("vg-media");
            var track;

            vgMedia.scope().updateTracks();

            track = element.find("track");

            expect(track[0]).not.toBe(null);
            expect(track.length).toBe(2);
            expect(track.attr("src")).toBe("assets/subs/pale-blue-dot-en.vtt");
            expect(track.attr("kind")).toBe("captions");
            expect(track.attr("srclang")).toBe("en");
            expect(track.attr("label")).toBe("English");
            expect(track[0].getAttribute("default")).toBe("");
        });

        it("should have been added a css theme on the head", function () {
            var theme = document.querySelector("[href='styles/themes/default/videogular.css']");

            expect(theme[0]).not.toBe(null);
        });
    });

    describe("API - ", function () {
        it("should play mediaElement on call API.play", function () {
            var API = element.isolateScope().API;
            var video = API.mediaElement[0];

            spyOn(video, "play");

            API.play();

            expect(video.play).toHaveBeenCalled();
            expect(API.currentState).toBe(VG_STATES.PLAY);
        });

        it("should pause mediaElement on call API.pause", function () {
            var API = element.isolateScope().API;
            var video = API.mediaElement[0];

            spyOn(video, "pause");

            API.pause();

            expect(video.pause).toHaveBeenCalled();
            expect(API.currentState).toBe(VG_STATES.PAUSE);
        });

        it("should play mediaElement on call API.playPause", function () {
            var API = element.isolateScope().API;
            var video = API.mediaElement[0];

            spyOn(video, "play");

            API.playPause();
            expect(video.play).toHaveBeenCalled();
            expect(API.currentState).toBe(VG_STATES.PLAY);
        });

        // TODO: Firefox throws an error at API.stop() because API.mediaElement[0].currentTime doesn't exists
        xit("should stop mediaElement on call API.stop", function () {
            var API = element.isolateScope().API;
            var video = API.mediaElement[0];

            spyOn(video, "pause");

            API.stop();
            expect(video.pause).toHaveBeenCalled();
            expect(API.currentState).toBe(VG_STATES.STOP);
        });

        it("should change volume on call API.setVolume", function () {
            var API = element.isolateScope().API;
            var video = API.mediaElement[0];

            API.setVolume(0.5);
            expect(video.volume).toBe(0.5);
            expect(API.volume).toBe(0.5);
        });
    });

    describe("Boolean configuration - ", function() {
        it("should have the expected input", function() {
            var scope = element.isolateScope();

            expect(scope.vgClearMediaOnNavigate).toBe('false');
        });

        it("should handle 'false' correctly", function() {
            var API = element.isolateScope().API;

            expect(API.clearMediaOnNavigate).toBe(false);
        });
    });

    describe("vgNativePlayBlacklist - ", function() {
        function updateSources(API) {
            API.sources = angular.copy(API.sources);
            $scope.$apply();
        }

        it("should handle an empty array", function() {
            var API = element.isolateScope().API;
            var video = API.mediaElement;

            spyOn(API, "changeSource");

            $scope.config.nativePlayBlacklist = [];
            updateSources(API);

            
            expect(API.changeSource).toHaveBeenCalledWith(jasmine.objectContaining({type: "video/mp4"}));

            expect(video.attr("src")).toBe("assets/videos/videogular.mp4");
        });

        it("should blacklist mp4", function(){
            var API = element.isolateScope().API;
            var video = API.mediaElement;

            spyOn(API, "changeSource");

            $scope.config.nativePlayBlacklist = [
                function blacklistMp4(source, userAgent) {
                    //expect source and userAgent to be defined
                    return source.type === 'video/mp4';
                }
            ];
            updateSources(API);
            
            expect(API.changeSource).not.toHaveBeenCalledWith(jasmine.objectContaining({type: "video/mp4"}));
            expect(video.attr("src")).not.toBe("assets/videos/videogular.mp4");
        });
    });
});
