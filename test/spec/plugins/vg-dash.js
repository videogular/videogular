'use strict';
describe('Directive: DASH', function () {
    var element;
    var $sce;
    var $scope;
    var $compile;
    var VG_STATES;
    var VG_DASH_IS_SUPPORTED;

    beforeEach(module('com.2fdevs.videogular'));
    beforeEach(module('com.2fdevs.videogular.plugins.dash'));

    beforeEach(inject(function ($injector) {
        $compile = $injector.get('$compile');
        $scope = $injector.get('$rootScope').$new();
        $sce = $injector.get('$sce');
        VG_STATES = $injector.get('VG_STATES');
        VG_DASH_IS_SUPPORTED = $injector.get('VG_DASH_IS_SUPPORTED');

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

            if (VG_DASH_IS_SUPPORTED) {
                var vgMedia = angular.element(element.find('[vg-dash]'));
                var vgMediaScope = vgMedia.scope();
                var source = $scope.config.sources[0];
                isDASH = vgMediaScope.isDASH(source.src, source.type);
            }

            expect(isDASH).toBe(VG_DASH_IS_SUPPORTED);
        });

        it("should have been changed a video source", function () {
            var isDASH = false;
            var vgMedia = angular.element(element.find('vg-media'));

            if (VG_DASH_IS_SUPPORTED) {
                spyOn(vgMedia.scope(), "isDASH");
                $scope.config.sources = [{src: "another_source.mpd", type: "application/dash+xml"}];
                $scope.$digest();

                expect(vgMedia.scope().isDASH).toHaveBeenCalledWith("another_source.mpd", "application/dash+xml");
                expect(vgMedia.scope().isDASH).toBeTruthy();
            }
            else {
                expect(vgMedia.scope().isDASH).toBeFalsy();
            }
        });
    });
});
