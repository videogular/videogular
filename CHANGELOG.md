CHANGELOG
================
## v2.0.1
* Bower is deprecated, all bower-videogular-XXX has been deprecated and now everything will be available in the videogular repo. This also applies for NPM distribution.

## v1.4.2
* Added ability to track progress of video during play, pause, and stop events. https://github.com/videogular/bower-videogular-analytics/pull/6
* Added a mediaElement[0] mock to avoid calls to mediaElement[0].play() when player is not initialized. https://github.com/videogular/videogular/pull/326
* Defensive check for mediaElement in clearMedia method. https://github.com/videogular/videogular/pull/323
* Allow for custom playback speeds. https://github.com/videogular/videogular/pull/319
* Fixed docs, volume and playback expects a float instead of an integer.
* Updated Readme. Point to the maintained version of Cuepoints.

## v1.4.1
* Normalized value for seek by percent so it can't fall out of valid range.
* Added fix for when virtual clip start time is set to 0.

## v1.4.0
* Added new directive vg-scrub-bar-thumbnails to display thumbnails in scrub bar.
* Added new property vg-start-time to autoseek to a certain second.
* Added new property vg-virtual-clip-duration to set a duration. When used with vg-start-time it will create a virtual media fragment in given video.
* Added more precise iOS device detection.
* Added autoplay enabled for mobile devices on cordova. Cordova/phonegap allows autoplay by default. In particular calling play() directly always works.
* Fixed bug with volume bar when mute button was focused. close #289
* Updated demo with virtual clips.
* Updated Readme.
* Updated docs.
* Removed old files.

## v1.3.2
* Added new directive vg-scrub-bar-buffer.
* Added new API properties bufferEnd and buffered.
* Added support for Browserify.
* Published all plugins in NPM.
* Fixed seek on Android.
* Updated readme with more heroes.

## v1.2.8
* Updated build.
* Updated readme with more heroes.
* Fixed bug in iOS trying to detect fullscreen mode when video player was in full screen mode.
* Fixed a bug of onEnter callback.
* Added binding to playback button.
* Published to NPM.
* Updated docs with onEnter cue point callback.
* Fixed gruntfile.

## v1.2.7
* Added onEnter event to cue points.
* Improved onEnter cue point callback.
* Fixed changing between multiple subtitles.
* Fixed controlbar positioning errors between Android 4.0 and 4.3.
* Fixed conflicts on some packages.
* Fixed undefined values when native fullscreen is updated.

## v1.2.6
* Added vgClearMediaOnNavigate to allow continuous playback. close #186
* Added vgSeeking and vgSeeked callbacks. close #257
* Added webkit-playsinline for mobile devices. close #160 #151
* Added vgNativeFullscreen to separate the behaviour from vgPlaysInline.
* Fixed DASH bug when changing from a DASH source to a non-DASH source. close #248
* Fixed volume out of range bug. close #260
* Fixed tests.
* Updated demo.
* Updated docs.

* **BREAKING CHANGES:** vgPlaysInline doesn't deactivate native fullscreen anymore. You need to use vgNativeFullscreen now (default is true).

## v1.2.5
* Improved watch for API.sources.
* Improved controls autohide and overlay play plugin interaction. Fixed with #239
* Removed mouse events to vg-poster.
* Catch error on stop function to avoid problems with single video environments. close #223
* Fixed vg-preload problem on desktop browsers. close #197
* Fixed crossorigin problems with tracks (tested with https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi/reviews). close #123
* Fixed track position in Chrome and Safari.
* Fixed problems showing tracks in Firefox. close #119

## v1.2.4
* Fixed getZIndex to inline styles and css styles. close #230
* Fixed error in Firefox when stop is pressed and media element is not available. close #223
* Added support to change media sources from anywhere (plugins, widgets, etc...)

## v1.2.3
* Fixed bug: autoplay is triggered on mobile devices. #234
* Fixed bug: a muted player can't be unmuted with the mute button. #232
* Fixed package.json files in bower repositories. #176

## v1.2.2
* Fixed problem updating cue points. closes #221
* Added watcher for analytics track info. closes #213
* Updated currentTime on stop media. closes #220
* Updated demo.

## v1.2.1
* Added optional timeLapse.end parameter. Now you can define cue points setting only timeLapse.start to define a 1 second cue point.
* Added support for responsive cue points.
* Added isolate scope to overlay-play plugin.
* Added bindable ads.
* Fixed rendering problem on controlbar cue points.
* Updated demo.
* Updated readme.
* Updated docs.

## v1.2.0
* Added Videogular cue points bar in controls plugin.
* Added Videogular new method API.setPlayback(playback), new callback vgUpdatePlayback(playback) and vgPlaybackButton in controls plugin.
* Added persistent volume and vgCanPlay callback.
* Fixed bug: vgChangeSource callback now triggers when the video player begins playing a new file.
* Fixed bug when a preroll was the last ad played.
* Fixed bug with plays inline styles.
* Fixed IMA demo.
* Improved Dash live demo.
* Code reformatted.
* Updated demo.
* Updated readme.
* Updated docs.

## v1.1.1
* Fixed bug on Android 2.3 browser.
* Fixed problems on Win8 IE10 and IE11.
* Fixed problem updating themes.
* Fixed fullscreen on Win8 IE10 and IE11.

## v1.1.0
* Added vg-cue-points property to videogular tag.
* Added to set state to stop when a source is changed. closes #174
* Allowed videogular directive as attribute. closes #162
* Fixed bug with vgAutoPlay. close #161
* Fixed problem with templating demo.
* Improved performance in main controller.
* Improved autohide in vg-controls.
* Updated demo.
* Updated readme.
* Updated docs.

## v1.0.1
* Added vg-type attribute in vg-media for "audio" or "video".
* Added watch for vg-plays-inline.
* Fixed problem with vg-plays-inline in iPhone devices.
* Fixed missing dependency in vg-media causing that vg-auto-play didn't work.
* Updated scrubbar in default theme.
* Updated docs.

## v1.0.0
* Added vg-config to load config file to init the player and plugins.
* Added Videogular Analytics.
* Added unit tests.
* Added "test" task in gruntfile.
* Added firefox in karma conf.
* Added config support in vg-analytics.
* Added views as $templateCache.
* Added analytics to build process.
* Added a new fullcreen service with a native fullscreen polyfill.
* Added vg-plays-inline to disable native fullscreen.
* Updated theme to set controls-container as a class instead of an id element.
* Updated Gruntfile with new build process.
* Updated gitignore to remove coverage directory.
* Updated package.json with new dependencies.
* Updated function to calculate the highest zIndex.
* Updated demo files.
* Updated docs.
* Changed vg-media to have a template.
* Changed private functions to scope functions.
* Changed vg-poster-image to vg-poster.
* Changed internal times from Date objects to miliseconds.
* Fixed error with duplicated CSS themes on head.
* Fixed problem seeking on Safari Yosemite.
* Moved plugins to outside of directives directory.
* Removed old scope variables on fullscreen button.
* Removed vg-ima-ads in karma conf.
* Removed template views.

## v0.7.2
* Changed videogular font name to 'videogular' to avoid problems with other 'icomoon' fonts.
* Improved error messages.
* Fixed NaN values when video duration is not specified.
* Fixed problem with Google IMA when preload='none'.
* Fixed problem with Google IMA when all ads complete it was starting the video again.
* Fixed bug when auto play is true and a source has been changed.

## v0.7.1
* Added vgError to notify video object error events.
* Improved buffering API.
* Fixed problems initializing player.
* Some minor code fixes for maintainability.
* Updated grunt files.

## v0.7.0
* Added DASH plugin for streaming and live streaming in Chrome. This is still beta, but it's awesome in Chrome.
* Updated demo.
* Moved all media files to dropbox.
* Fixed UTC time problems on time display.
* Fixed bindings for native controls.
* Fixed to hide buffering when it's loading content and state changes to stop.
* Fixed to use cursor pointer on buttons.

## v0.6.3
* Added jquery-event-fix for function `onScrubBarTouchMove`.
* Fixed error changing volume with keys.
* Fixed init problem when preload is 'none'.
* Updated docs.

## v0.6.2
* Updated IMA ads plugin to work with the new API.
* Added resize in IMA ads plugin.
* Updated demo with Google IMA ads.

## v0.6.1
* Added new API method clearMedia() to prevent browsers download media when player is destroyed or ngRoute changes.
* Fixed bug when autohide is true and user moves mouse wasn't showing the controls.
* Fixed bug when a source is changed but there are no tracks.
* Removed unnecessary scope variable on overlay-play.
* Improved docs.
* Improved demo.

## v0.6.0
* Added new directive vg-audio.
* Improved performance removing some $apply() calls.
* Fixed initialization problems in iOS, Android and Safari for Mac OS X.

## v0.5.1
* Added new directives vg-tracks.
* Added new directives vg-loop.
* Added new directives vg-preload.
* Added new directives vg-native-controls.

## v0.5.0
* Added new diretive vg-video and vg-source.
* Removed events now everything is bindable.

## v0.4.2
* Added seek by seconds or percentage passing a parameter.
* Added new "timeLeft" property.
* Added seek by seconds or percentage passing a parameter.

## v0.4.1
* Fixed bug at vg-src in Safari for Windows 8.
* Fixed bug with iOS screen size.
* Fixed bug in vgScrubbarcurrenttime, it wasn't updating the current time.

## v0.4.0
* Added support for IE11 fullscreen API.
* Added new callback vgChangeSource to change video source or quality.
* Added new stop method.
* Added licenses in all files.
* Fixed some issues related to $apply in progress error.
* Fixed to show icon correctly in overlay-play when a complete event is fired.

## v0.3.2
* Removed jQuery dependency.
* Added new vgSrc directivo to set by binding a video source.
* Added a new event ON_ERROR.
* Added gitignore, package.json and Gruntfile.
* Now icons are setted as CSS classes.

## v0.3.1
* Added support for minification.
* Added minified version.
* Fixed controlbar rendering on init.
* Now all plugin HTML templates are embedded in JS files (easier to deploy with bower).
* Improved fixEventOffset.

## v0.3.0
* Added IMA ads plugin.
* Improved fixEventOffset.
* Now vg-theme it's not mandatory.

## v0.2.0
* Support for full screen on devices without native full screen.
* Removed `$rootScope` dependencies.
* Added `vgComplete`, `vgUpdateVolume`, `vgUpdateTime`, `vgUpdateSize`, `vgUpdateState` and `vgPlayerReady` callbacks.
* Exposed API with name **"API"** instead of **"vg"**.
* Fixed problems with stretch mode.
* Improved code quality in link functions.
* Added **this** changelog.
