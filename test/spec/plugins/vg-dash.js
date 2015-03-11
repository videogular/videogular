'use strict';
describe('Directive: DASH', function () {
  var element;
  var $sce;
	var $scope;
	var $compile;
	var VG_STATES;

	beforeEach(module('com.2fdevs.videogular'));
	beforeEach(module('com.2fdevs.videogular.plugins.dash'));

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
        {src: "source.mpd"}
      ],
      theme: {
        url: "styles/themes/default/videogular.css"
      }
    };

		element = angular.element(
      '<videogular vg-theme="config.theme.url">' +
        '<vg-media vg-src="config.sources" vg-dash></vg-media>' +
      '</videogular>'
    );

		$compile(element)($scope);
    $scope.$digest();
	}));

	describe("DASH plugin - ", function() {
		it("should have been detected a DASH video", function() {
			var isDASH = element.scope().isDASH($scope.config.sources[0].src);

      expect(isDASH).toBe(true);
		});

		it("should have been changed a video source", function() {
			spyOn(element.scope(), "onSourceChange");
      $scope.config.sources = [{src: "another_source.mpd"}];
      $scope.$digest();
      expect(element.scope().onSourceChange).toHaveBeenCalledWith("another_source.mpd");
		});
  });
});
