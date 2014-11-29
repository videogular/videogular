CHANGELOG
================
## v0.7.2
* Fixed NaN values when video duration is not specified.
* Fixed problem with Google IMA when preload='none'.
* Fixed problem with Google IMA when all ads complete it was starting the video again.

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
