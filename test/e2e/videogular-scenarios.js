'use strict';

angular.scenario.dsl('onPlayerReady', function() {
	return function() {
		return this.addFutureAction(
			'videogular player should fire onPlayerReady',
			function($window, $document, done) {
				var $rootScope = $window.angular.element("body").scope();

				function onPlayerReady() {
					done(null, true);
				}

				$rootScope.$on("onVgPlayerReady", onPlayerReady);
			}
		)
	}
});

describe('Videogular', function () {

    beforeEach(function () {
	    browser().navigateTo('../../app/');
	    expect(onPlayerReady()).toBe(true);
    });

	describe("Videogular Core", function() {
	    describe('Check bindings', function () {
	        it('should have a theme injected', function () {
		        expect(binding("config.theme.url")).toBe("styles/themes/default/videogular.css");
		        expect(element('link[href="styles/themes/default/videogular.css"]')).not().toBe(null);
	        });

	        it('should have a size of 740x380', function () {
	            expect(element('videogular').css("width")).toBe("740px");
	            expect(element('videogular').css("height")).toBe("380px");
	        });

	        it('should change size to 640x480', function () {
		        input("config.width").enter("640");
		        input("config.height").enter("480");
		        expect(element('videogular').css("width")).toBe("640px");
		        expect(element('videogular').css("height")).toBe("480px");
	        });

	        it('should have stretch selected to "Fit"', function () {
		        expect(binding('config.stretch')).toBe("{\"label\":\"Fit\",\"value\":\"fit\"}");
		        expect(element('videogular video').css("width")).toBe("675px");
		        expect(element('videogular video').css("height")).toBe("380px");
	        });

		    it('should have stretch selected to "Fit" and change it to "Fill"', function () {
			    select("config.stretch").option("Fill");
			    expect(binding('config.stretch')).toBe("{\"label\":\"Fill\",\"value\":\"fill\"}");
			    expect(element('videogular video').css("width")).toBe("740px");
			    expect(element('videogular video').css("height")).toBe("416px");
		    });

		    it('should have stretch selected to "Fit" and change it to "None"', function () {
			    select("config.stretch").option("None");
			    expect(binding('config.stretch')).toBe("{\"label\":\"None\",\"value\":\"none\"}");
			    expect(element('videogular video').css("width")).toBe("1280px");
			    expect(element('videogular video').css("height")).toBe("720px");
		    });

	        it('should have not autoplay and change it to true', function () {
		        expect(binding("config.autoPlay")).toBe("false");
		        input("config.autoPlay").check();
		        expect(binding("config.autoPlay")).toBe("true");
	        });

	        it('should have not autohide and change it to true', function () {
		        expect(binding("config.autoHide")).toBe("false");
		        input("config.autoHide").check();
		        expect(binding("config.autoHide")).toBe("true");
	        });

	        it('should have not be responsive and change it to true', function () {
		        expect(binding("config.responsive")).toBe("false");
		        expect(element('videogular video').css("width")).toBe("675px");
		        expect(element('videogular video').css("height")).toBe("380px");
	        });

	        it('should change responsive mode to true', function () {
		        expect(binding("config.responsive")).toBe("false");
		        input("config.responsive").check();
		        expect(binding("config.responsive")).toBe("true");
		        expect(element('videogular video').css("width")).not().toBe("740px");
		        expect(element('videogular video').css("height")).not().toBe("308px");
	        });
	    });
	});

	describe("Poster plugin", function() {
		it('should have a poster image', function () {
			expect(element("vg-poster-image img").attr("src")).toBe("assets/images/videogular.png");
			expect(input('config.plugins.poster.url').val()).toBe("assets/images/videogular.png");
			input('config.plugins.poster.url').enter("assets/images/pale-blue-dot.jpg");
			expect(element("vg-poster-image img").attr("src")).toBe("assets/images/pale-blue-dot.jpg");
		});

		it('should change image size when stretch changes', function () {
			expect(element("vg-poster-image img").css("width")).toBe("740px");
			expect(element("vg-poster-image img").css("height")).toBe("416px");
			select("config.stretch").option("Fill");
			expect(element("vg-poster-image img").css("width")).toBe("676px");
			expect(element("vg-poster-image img").css("height")).toBe("380px");
			select("config.stretch").option("None");
			expect(element("vg-poster-image img").css("width")).toBe("1280px");
			expect(element("vg-poster-image img").css("height")).toBe("720px");
		});
	});

	describe("Buffering plugin", function() {
		it('should hide buffering on load', function () {
			expect(element("vg-buffering").css("display")).toBe("none");
		});
	});
});
