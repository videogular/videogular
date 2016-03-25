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
                {src: "source.mpd", type: "application/dash+xml"}
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
        $scope.$apply();
    }));

    describe("DASH plugin - ", function () {
        it("should have been detected a DASH video", function () {
            var isDASH = false;

            var vgMedia = angular.element(element.find('[vg-dash]'));
            var vgMediaScope = vgMedia.scope();
            isDASH = vgMediaScope.isDASH($scope.config.sources[0]);

            expect(isDASH).toBe(true);
        });

        it("should have been changed a video source", function () {
            var vgMedia = angular.element(element.find('vg-media'));

            spyOn(vgMedia.scope(), "onSourceChange");
            $scope.config.sources = [{src: "another_source.mpd", type: "application/dash+xml"}];
            $scope.$digest();

            expect(vgMedia.scope().onSourceChange).toHaveBeenCalledWith({src: "another_source.mpd", type: "application/dash+xml"});
        });
    });
});
