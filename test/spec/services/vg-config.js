'use strict';
describe('Directive: Videogular Config', function () {
  var vgConfigLoader;
	var $httpBackend;

	beforeEach(module('com.2fdevs.videogular'));

	beforeEach(inject(function ($injector) {
    $httpBackend = $injector.get('$httpBackend');
    vgConfigLoader = $injector.get('vgConfigLoader');

    $httpBackend.whenGET('assets/data/config.json').respond(
      {
        "controls": false,
        "loop": false,
        "autoplay": false,
        "preload": "auto",
        "theme": "styles/themes/default/videogular.css",
        "sources": [
          {
            "src": "http://static.videogular.com/assets/videos/videogular.mp4",
            "type": "video/mp4"
          },
          {
            "src": "http://static.videogular.com/assets/videos/videogular.webm",
            "type": "video/webm"
          },
          {
            "src": "http://static.videogular.com/assets/videos/videogular.ogg",
            "type": "video/ogg"
          }
        ],
        "tracks": [
          {
            "src": "assets/subs/pale-blue-dot.vtt",
            "kind": "subtitles",
            "srclang": "en",
            "label": "English",
            "default": ""
          }
        ]
      }
    );
	}));

  describe("Config loader - ", function() {
    it("should have been parsed the config file", function() {
      vgConfigLoader.loadConfig('assets/data/config.json').then(
        function(data) {
          expect(data.sources[0].src.$$unwrapTrustedValue).toBeTruthy();
        }
      );

      $httpBackend.flush();
    });
  });
});
