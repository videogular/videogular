'use strict';
describe('Directive: Analytics', function () {
  var element;
  var analytics;
  var API;
  var $sce;
	var $scope;
	var $compile;
	var VG_STATES;

	beforeEach(module('com.2fdevs.videogular'));
	beforeEach(module('com.2fdevs.videogular.plugins.analytics'));
	beforeEach(module('vg-templates'));

	beforeEach(inject(function ($injector) {
    $compile = $injector.get('$compile');
    $scope = $injector.get('$rootScope').$new();
    $sce = $injector.get('$sce');
    VG_STATES = $injector.get('VG_STATES');

    $scope.config = {
      preload: "none",
      controls: true,
      loop: true,
      sources: [
        {src: $sce.trustAsResourceUrl("assets/videos/videogular.mp4"), type: "video/mp4"},
        {src: $sce.trustAsResourceUrl("assets/videos/videogular.webm"), type: "video/webm"},
        {src: $sce.trustAsResourceUrl("assets/videos/videogular.ogg"), type: "video/ogg"}
      ],
      theme: {
        url: "styles/themes/default/videogular.css"
      },
      plugins: {
        analytics: {
          category: "Videogular",
          label: "Main",
          events: {
            ready: true,
            play: true,
            pause: true,
            stop: true,
            complete: true,
            progress: 10
          }
        }
      }
    };

		element = angular.element(
      '<videogular vg-theme="config.theme.url">' +
        '<vg-media vg-template="scripts/com/2fdevs/videogular/directives/views/vg-media.html" vg-src="config.sources"></vg-media>' +
        '<vg-analytics vg-track-info="config.plugins.analytics" vg-template="scripts/com/2fdevs/videogular/plugins/vg-buffering/views/vg-buffering.html"></vg-analytics>' +
      '</videogular>'
    );

    $compile(element)($scope);

    analytics = element.find("vg-analytics");
    API = element.isolateScope().API;
	}));

	describe("Track ready - ", function() {
		it("should track ready event", function() {
      spyOn(analytics.isolateScope(), "trackEvent");
      $scope.$digest();

      expect(analytics.isolateScope().trackEvent).toHaveBeenCalledWith("ready");
		});
  });

  describe("Track State - ", function() {
		it("should track state change event on play", function() {
      $scope.$digest();
      spyOn(analytics.isolateScope(), "trackEvent");
      API.play();
      $scope.$digest();
      expect(analytics.isolateScope().trackEvent).toHaveBeenCalledWith("play");
		});

    it("should track state change event on pause", function() {
      $scope.$digest();
      spyOn(analytics.isolateScope(), "trackEvent");
      API.pause();
      $scope.$digest();
      expect(analytics.isolateScope().trackEvent).toHaveBeenCalledWith("pause");
    });

    // TODO: Firefox throws an error at API.stop() because API.mediaElement[0].currentTime doesn't exists
    xit("should track state change event on stop", function() {
      $scope.$digest();
      API.play();
      $scope.$digest();
      spyOn(analytics.isolateScope(), "trackEvent");
      API.stop();
      $scope.$digest();
      expect(analytics.isolateScope().trackEvent).toHaveBeenCalledWith("stop");
    });
  });

  describe("Track Complete State - ", function() {
		it("should track complete event", function() {
      $scope.$digest();
      spyOn(analytics.isolateScope(), "trackEvent");
      API.isCompleted = true;
      $scope.$digest();
      expect(analytics.isolateScope().trackEvent).toHaveBeenCalledWith("complete");
		});
  });

  describe("Track Update Time - ", function() {
		it("should track update time at 10% event", function() {
      $scope.$digest();

      API.totalTime = new Date(10000);
      $scope.$digest();

      spyOn(analytics.isolateScope(), "trackEvent");
      API.currentTime = new Date(1100);
      $scope.$digest();

      expect(analytics.isolateScope().trackEvent).toHaveBeenCalledWith("progress 10%");
		});
  });
});
