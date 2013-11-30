'use strict';

describe('Videogular', function () {

    beforeEach(function () {
	    browser().navigateTo('../../app/');
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

	        it('should have stretch selected to "Fit" and change it to "Fill"', function () {
		        expect(binding('config.stretch')).toBe("{\"label\":\"Fit\",\"value\":\"fit\"}");
		        select("config.stretch").option("Fill");
		        expect(binding('config.stretch')).toBe("{\"label\":\"Fill\",\"value\":\"fill\"}");
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
		        input("config.responsive").check();
		        expect(binding("config.responsive")).toBe("true");
	        });
	    });
	});

	describe("Poster plugin", function() {
		it('should have a poster image', function () {
			expect(element("vg-poster-image img").attr("src")).toBe("assets/images/oceans-clip.png");
			expect(input('config.plugins.poster.url').val()).toBe("assets/images/oceans-clip.png");
			input('config.plugins.poster.url').enter("assets/images/poster-dolphins.jpg");
			expect(element("vg-poster-image img").attr("src")).toBe("assets/images/poster-dolphins.jpg");
		});

		it('should change image size when stretch changes', function () {
			expect(element("vg-poster-image img").width()).toBe(740);
			expect(element("vg-poster-image img").height()).toBe(305);
			select("config.stretch").option("Fill");
			expect(element("vg-poster-image img").width()).toBe(921);
			expect(element("vg-poster-image img").height()).toBe(380);
			select("config.stretch").option("None");
			expect(element("vg-poster-image img").width()).toBe(640);
			expect(element("vg-poster-image img").height()).toBe(264);
		});
	});
});
