'use strict';
describe('Directive: Buffering', function () {
  var element;
  var $sce;
	var $scope;
	var $compile;
	var VG_STATES;

	beforeEach(module('com.2fdevs.videogular'));
	beforeEach(module('com.2fdevs.videogular.plugins.buffering'));
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
        poster: {
          url: "assets/images/videogular.png"
        }
      }
    };

		element = angular.element(
      '<videogular vg-theme="config.theme.url">' +
        '<vg-media vg-template="scripts/com/2fdevs/videogular/directives/views/vg-media.html" vg-src="config.sources"></vg-media>' +
        '<vg-buffering vg-template="scripts/com/2fdevs/videogular/plugins/vg-buffering/views/vg-buffering.html"></vg-buffering>' +
      '</videogular>'
    );

		$compile(element)($scope);
    $scope.$digest();
	}));

	describe("Element creation - ", function() {
		it("should have been created a buffering element", function() {
			var buff = element.find(".loadingSpinner");

      expect(buff[0]).toBeTruthy();
		});

		it("should show the spinner animation when buffering is true", function() {
      var API = element.isolateScope().API;
      var buff = element.find(".loadingSpinner");

      expect(buff.attr("class")).toBe("loadingSpinner");

      API.isBuffering = true;
      $scope.$digest();

      expect(buff.attr("class")).toBe("loadingSpinner stop");
		});

		it("should hide the spinner animation when buffering is false", function() {
      var API = element.isolateScope().API;
      var buff = element.find(".loadingSpinner");

      expect(buff.attr("class")).toBe("loadingSpinner");

      API.isBuffering = false;
      $scope.$digest();

      expect(buff.attr("class")).toBe("loadingSpinner");
		});

		it("should hide the spinner animation when player is stopped", function() {
      var API = element.isolateScope().API;
      var buff = element.find("vg-buffering");

      API.currentState = "stop";
      $scope.$digest();

      expect(buff.attr("style")).toBe("display: none;");
		});
  });
});
