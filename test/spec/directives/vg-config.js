'use strict';
describe('Directive: Videogular Config', function () {
  var element;
  var API;
	var $scope;
	var $httpBackend;
	var $compile;
	var VG_STATES;

	beforeEach(module('com.2fdevs.videogular'));
  beforeEach(module('com.2fdevs.videogular.plugins.controls'));
  beforeEach(module('com.2fdevs.videogular.plugins.poster'));
  beforeEach(module('com.2fdevs.videogular.plugins.overlayplay'));
  beforeEach(module('com.2fdevs.videogular.plugins.buffering'));
	beforeEach(module('vg-templates'));

	beforeEach(inject(function ($injector) {
    $compile = $injector.get('$compile');
    $scope = $injector.get('$rootScope').$new();
    $httpBackend = $injector.get('$httpBackend');
    VG_STATES = $injector.get('VG_STATES');

    $httpBackend.when('GET', 'assets/data/config.json').respond(
      {
        "controls": false,
        "loop": false,
        "autoplay": false,
        "preload": "auto",
        "theme": "styles/themes/default/videogular.css",
        "sources": [
          {
            "src": "http://www.videogular.com/assets/videos/videogular.mp4",
            "type": "video/mp4"
          },
          {
            "src": "http://www.videogular.com/assets/videos/videogular.webm",
            "type": "video/webm"
          },
          {
            "src": "http://www.videogular.com/assets/videos/videogular.ogg",
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
        ],
        "plugins": {
          "controls": {
            "autohide": true,
            "autohideTime": 3000
          },
          "poster": {
            "url": "assets/images/videogular.png"
          }
        }
      }
    );

		element = angular.element(
      '<videogular vg-config="assets/data/config.json">' +
        '<vg-media vg-src vg-tracks vg-loop vg-preload vg-native-controls vg-template="scripts/com/2fdevs/videogular/directives/views/vg-media.html"></vg-media>' +

        '<vg-controls vg-template="scripts/com/2fdevs/videogular/plugins/vg-controls/views/vg-controls.html">' +
          '<vg-play-pause-button vg-template="scripts/com/2fdevs/videogular/plugins/vg-controls/vg-play-pause-button/views/vg-play-pause-button.html"></vg-play-pause-button>' +
          '<vg-time-display>{{ currentTime | date:"mm:ss" }}</vg-time-display>' +
          '<vg-scrub-bar vg-template="scripts/com/2fdevs/videogular/plugins/vg-controls/vg-scrub-bar/views/vg-scrub-bar.html">' +
            '<vg-scrub-bar-current-time></vg-scrub-bar-current-time>' +
          '</vg-scrub-bar>' +
          '<vg-time-display>{{ timeLeft | date:"mm:ss" }}</vg-time-display>' +
          '<vg-volume>' +
            '<vg-mute-button vg-template="scripts/com/2fdevs/videogular/plugins/vg-controls/vg-volume/views/vg-mute-button.html"></vg-mute-button>' +
            '<vg-volume-bar vg-template="scripts/com/2fdevs/videogular/plugins/vg-controls/vg-volume/views/vg-volume-bar.html"></vg-volume-bar>' +
          '</vg-volume>' +
          '<vg-fullscreen-button vg-template="scripts/com/2fdevs/videogular/plugins/vg-controls/vg-fullscreen-button/views/vg-fullscreen-button.html"></vg-fullscreen-button>' +
        '</vg-controls>' +

        '<vg-poster vg-url="config.plugins.poster.url" vg-template="scripts/com/2fdevs/videogular/plugins/vg-poster/views/vg-poster.html"></vg-poster>' +
        '<vg-buffering vg-template="scripts/com/2fdevs/videogular/plugins/vg-buffering/views/vg-buffering.html"></vg-buffering>' +
        '<vg-overlay-play vg-template="scripts/com/2fdevs/videogular/plugins/vg-overlay-play/views/vg-overlay-play.html"></vg-overlay-play>' +
      '</videogular>'
    );

		$compile(element)($scope);
    $scope.$digest();

    API = element.isolateScope().API;
	}));

  describe("Config loader - ", function() {
    it("should have been detected a config file", function() {
      expect(API.isConfig).toBe(true);
    });
  });
});
