'use strict';
describe('Directive: Poster', function () {
  var element;
  var $sce;
	var $scope;
	var $compile;
	var VG_STATES;

	beforeEach(module('com.2fdevs.videogular'));
	beforeEach(module('com.2fdevs.videogular.plugins.poster'));
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
        '<vg-poster vg-url="config.plugins.poster.url" vg-template="scripts/com/2fdevs/videogular/plugins/vg-poster/views/vg-poster.html"></vg-poster>' +
      '</videogular>'
    );

		$compile(element)($scope);
    $scope.$digest();
	}));

	describe("Element creation - ", function() {
		it("should have been created an image element", function() {
			var img = element.find("img");

      expect(img[0]).not.toBe(null);
      expect(img.attr("src")).toBe("assets/images/videogular.png");
		});
  });
});
