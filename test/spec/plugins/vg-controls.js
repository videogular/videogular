'use strict';
describe('Directive: Controls', function () {
  var element;
  var API;
  var $sce;
	var $scope;
	var $compile;
	var $timeout;
	var VG_STATES;
	var VG_UTILS;

	beforeEach(module('com.2fdevs.videogular'));
	beforeEach(module('com.2fdevs.videogular.plugins.controls'));

	beforeEach(inject(function ($injector) {
    $compile = $injector.get('$compile');
    $scope = $injector.get('$rootScope').$new();
    $sce = $injector.get('$sce');
    $timeout = $injector.get('$timeout');
    VG_STATES = $injector.get('VG_STATES');
    VG_UTILS = $injector.get('VG_UTILS');

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
        controls: {
          autoHide: true,
          autoHideTime: 3000
        }
      }
    };

		element = angular.element(
      '<videogular vg-theme="config.theme.url">' +
        '<vg-media vg-src="config.sources"></vg-media>' +

        '<vg-controls vg-autohide="config.plugins.controls.autoHide" vg-autohide-time="config.plugins.controls.autoHideTime">' +
          '<vg-play-pause-button></vg-play-pause-button>' +
          '<vg-time-display id="ct">{{ currentTime | date:"mm:ss" }}</vg-time-display>' +
          '<vg-time-display id="tt">{{ totalTime | date:"mm:ss" }}</vg-time-display>' +
          '<vg-time-display id="tl">{{ timeLeft | date:"mm:ss" }}</vg-time-display>' +
          '<vg-scrub-bar>' +
            '<vg-scrub-bar-current-time></vg-scrub-bar-current-time>' +
          '</vg-scrub-bar>' +
          '<vg-volume>' +
            '<vg-mute-button></vg-mute-button>' +
            '<vg-volume-bar></vg-volume-bar>' +
          '</vg-volume>' +
          '<vg-fullscreen-button></vg-fullscreen-button>' +
        '</vg-controls>' +
      '</videogular>'
    );

		$compile(element)($scope);
    $scope.$digest();

    API = element.isolateScope().API;
	}));

  describe("Controls display - ", function() {
    it("should have been created a container element", function() {
      var container = element.find(".controls-container");

      expect(container).not.toBe(null);
    });

    it("should have been set autoHide", function() {
      var controls = element.find("vg-controls");
      var container = element.find("vg-controls div.controls-container");

      container.mousemove();
      $timeout.flush();
      $scope.$digest();

      expect(container.attr("class")).toBe("controls-container hide-animation");
    });

    it("should show controls when autoHide is false", function() {
      var controls = element.find("vg-controls");
      var container = element.find("vg-controls div.controls-container");

      controls.isolateScope().vgAutohide = false;
      $scope.$digest();
      $timeout.flush();

      expect(container.attr("class")).toBe("controls-container show-animation");
    });
  });

	describe("FullScreen button - ", function() {
		it("should have been created a button element", function() {
			var button = element.find("vg-fullscreen-button button");

      expect(button).not.toBe(null);
		});

		it("should call toggleFullScreen on click button", function() {
			var button = element.find("vg-fullscreen-button button");

      spyOn(API, "toggleFullScreen");
      button.click();

      expect(API.toggleFullScreen).toHaveBeenCalled();
		});

		it("should change icon when full screen change", function() {
			var fs = element.find("vg-fullscreen-button").isolateScope();

      expect(fs.fullscreenIcon.enter).toBe(true);

      API.isFullScreen = true;
      $scope.$digest();

      expect(fs.fullscreenIcon.enter).toBe(false);
      expect(fs.fullscreenIcon.exit).toBe(true);
		});
  });

	describe("PlayPause button - ", function() {
		it("should have been created a button element", function() {
			var button = element.find("vg-play-pause-button button");

      expect(button).not.toBe(null);
		});

		it("should call playPause on click button", function() {
			var button = element.find("vg-play-pause-button button");

      spyOn(API, "playPause");
      button.click();

      expect(API.playPause).toHaveBeenCalled();
		});

		it("should change icon on play video", function() {
			var fs = element.find("vg-play-pause-button").isolateScope();

      expect(fs.playPauseIcon.play).toBe(true);

      API.currentState = "play";
      $scope.$digest();

      expect(fs.playPauseIcon.play).toBe(undefined);
      expect(fs.playPauseIcon.pause).toBe(true);
		});
  });

	describe("ScrubBar display - ", function() {
		it("should have been added div inside scrub bar", function() {
			var scrubBar = element.find("vg-scrub-bar div");

      expect(scrubBar[0]).not.toBe(null);
		});

		it("should have been seeked on mouse down scrub bar", function() {
			var scrubBar = element.find("vg-scrub-bar div");

      spyOn(API, "seekTime");
      scrubBar.mousedown();

      // Is NaN because there is no video duration
      expect(API.seekTime).toHaveBeenCalledWith(NaN);
		});

		it("should have not been played video on mouse up if the state was playing", function() {
			var scrubBar = element.find("vg-scrub-bar div");

      spyOn(API, "play");
      spyOn(API, "seekTime");
      scrubBar.mousedown();
      scrubBar.mouseup();

      // Is NaN because there is no video duration
      expect(API.play).not.toHaveBeenCalled();
      expect(API.seekTime).toHaveBeenCalledWith(NaN);
		});

		it("should have been played video on mouse up if the state was playing", function() {
			var scrubBar = element.find("vg-scrub-bar div");

      API.play();
      $scope.$digest();

      spyOn(API, "play");
      spyOn(API, "seekTime");
      scrubBar.mousedown();
      scrubBar.mouseup();

      // Is NaN because there is no video duration
      expect(API.play).toHaveBeenCalled();
      expect(API.seekTime).toHaveBeenCalledWith(NaN);
		});

		it("should have been resized current time scrub bar", function() {
			var scrubBarTime = element.find("vg-scrub-bar-current-time");

      API.currentTime = 50000;
      API.totalTime = 100000;
      $scope.$digest();

      expect(scrubBarTime.css("width")).toBe("50%");
		});

		it("should have been resized current time scrub bar to 0 when video is completed", function() {
			var scrubBarTime = element.find("vg-scrub-bar-current-time");

      API.isCompleted = true;
      $scope.$digest();

      expect(scrubBarTime.css("width")).toBe("0px");
		});
  });

	describe("Time display - ", function() {
		it("should have been added a current time", function() {
			var timeDisplay = element.find("#ct");

      API.currentTime = 100000;
      $scope.$digest();

      expect(timeDisplay.text()).toBe("01:40");
		});

		it("should have been added a total time", function() {
			var timeDisplay = element.find("#tt");

      API.totalTime = 100000;
      $scope.$digest();

      expect(timeDisplay.text()).toBe("01:40");
		});

		it("should have been added a time left", function() {
			var timeDisplay = element.find("#tl");

      API.timeLeft = 100000;
      $scope.$digest();

      expect(timeDisplay.text()).toBe("01:40");
		});
  });

	describe("Volume display - ", function() {
		it("should have been hidden the volume bar by default", function() {
			var volume = element.find("vg-volume");

      expect(volume.scope().volumeVisibility).toBe("hidden");
		});

		it("should have been shown the volume bar on mouse over", function() {
			var volume = element.find("vg-volume");

      volume.mouseover();
      $scope.$digest();

      expect(volume.scope().volumeVisibility).toBe("visible");
		});

		it("should have been hidden the volume bar on mouse leave", function() {
			var volume = element.find("vg-volume");

      volume.mouseover();
      $scope.$digest();
      volume.mouseleave();
      $scope.$digest();

      expect(volume.scope().volumeVisibility).toBe("hidden");
		});

		it("should have been set a volume icon by default", function() {
			var mute = element.find("vg-mute-button button");

      expect(mute.attr("class")).toBe("iconButton level3");
		});

		it("should have been set a volume icon on volume change", function() {
			var mute = element.find("vg-mute-button button");

      API.volume = 0;
      $scope.$digest();

      expect(mute.attr("class")).toBe("iconButton mute");

      API.volume = 0.10;
      $scope.$digest();

      expect(mute.attr("class")).toBe("iconButton level0");

      API.volume = 0.25;
      $scope.$digest();

      expect(mute.attr("class")).toBe("iconButton level1");

      API.volume = 0.50;
      $scope.$digest();

      expect(mute.attr("class")).toBe("iconButton level2");

      API.volume = 0.75;
      $scope.$digest();

      expect(mute.attr("class")).toBe("iconButton level3");
		});

    it("should show volume bar on mouseover mute button", function() {
      var volume = element.find("vg-volume");
      var mute = element.find("vg-mute-button button");

      mute.mouseover();
      $scope.$digest();

      expect(volume.scope().volumeVisibility).toBe("visible");
    });

    it("should hide volume bar on mouseleave mute button", function() {
      var volume = element.find("vg-volume");
      var mute = element.find("vg-mute-button button");

      mute.mouseover();
      $scope.$digest();
      mute.mouseleave();
      $scope.$digest();

      expect(volume.scope().volumeVisibility).toBe("hidden");
    });

    it("should mute volume on click mute button", function() {
      var mute = element.find("vg-mute-button button");

      mute.click();
      $scope.$digest();

      expect(API.volume).toBe(0);
      expect(mute.attr("class")).toBe("iconButton mute");
    });

    it("should set last volume on click twice mute button", function() {
      var mute = element.find("vg-mute-button button");

      mute.click();
      $scope.$digest();

      expect(API.volume).toBe(0);

      mute.click();
      $scope.$digest();

      expect(API.volume).toBe(1);
    });

    it("should update volume bar when volume changes", function() {
      var volumeValueBar = element.find(".volumeValue");

      API.volume = 0.50;
      $scope.$digest();

      expect(volumeValueBar.css("height")).toBe("50%");
      expect(volumeValueBar.css("top")).toBe("50%");
    });

    it("should update volume on click volume bar", function() {
      var volumeBackBar = element.find(".volumeBackground");

      spyOn(API, "setVolume");
      volumeBackBar.click();
      $scope.$digest();

      // Is NaN because there's no height
      expect(API.setVolume).toHaveBeenCalledWith(NaN);
    });
  });
});
