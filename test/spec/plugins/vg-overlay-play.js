'use strict';
describe('Directive: Overlay Play', function () {
  var element;
  var $sce;
	var $scope;
	var $compile;
	var VG_STATES;

	beforeEach(module('com.2fdevs.videogular'));
	beforeEach(module('com.2fdevs.videogular.plugins.overlayplay'));
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
      }
    };

		element = angular.element(
      '<videogular vg-theme="config.theme.url">' +
        '<vg-media vg-template="scripts/com/2fdevs/videogular/directives/views/vg-media.html" vg-src="config.sources"></vg-media>' +
        '<vg-overlay-play vg-template="scripts/com/2fdevs/videogular/plugins/vg-overlay-play/views/vg-overlay-play.html"></vg-overlay-play>' +
      '</videogular>'
    );

		$compile(element)($scope);
    $scope.$digest();
	}));

	describe("Element creation - ", function() {
		it("should have been created an element with a play icon button", function() {
			var div = element.find(".iconButton");

      expect(div.attr("class")).toBe("iconButton play");
		});

		it("should change icon button on play video", function() {
			var op = element.find(".overlayPlayContainer");
      var div = element.find(".iconButton");
      op.click();

      expect(div.attr("class")).toBe("iconButton");
		});
  });
});
