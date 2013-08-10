## Videogular

Videogular is an HTML5 video player for AngularJS. Videogular is a wrapper over the HTML5 video tag, so you just could add whatever you want. This provides a very powerful but simple to use solution for everybody.

You could see a demo here: http://twofuckingdevelopers.com/examples/videogular/examples/

**Videogular is currently under development** and now it's not working on iOS but we plan to provide support to all major platforms.

## How to use Videogular

To start using Videogular, just create a `DIV` with the `videogular` attribute and the `video` tag inside. In AngularJS the HTML5 `poster` video attribute is not supported, so you could use `vg-poster` to add your image to your video tag.

```html
<div videogular width="640" height="264">
	<video class='videoPlayer' controls preload='none' width='640' height='264' vg-poster='assets/images/oceans-clip.png'>
		<source src='assets/videos/oceans-clip.mp4' type='video/mp4'>
		<source src='assets/videos/oceans-clip.webm' type='video/webm'>
		<source src='assets/videos/oceans-clip.ogv' type='video/ogg'>
	</video>
</div>
```

Because `videogular` is an HTML5 video player for AngularJS it works (obviously) with all the AngularJS directives.

```html
<div videogular width="640" height="264">
	<video class='videoPlayer' preload='none' width='{{ data.width }}' height='{{ data.height }}' vg-poster='{{ data.poster }}'>
		<source ng-repeat='media in data.media' ng-src='{{ media.url }}' type='{{ media.type }}'>
	</video>
</div>
```


## Plugins

With Videogular you can write your own plugins through a simple API based in events. The plugins should be directives and they should communicate with the main `videogular` directive through an API based in events.

## API Events

- **VG_EVENTS.ON_PLAY**: Triggered when video plays.
- **VG_EVENTS.ON_START_PLAYING**: Triggered when video starts playing after buffer.
- **VG_EVENTS.ON_PAUSE**: Triggered when video is paused.
- **VG_EVENTS.ON_COMPLETE**: Triggered when video is completed
- **VG_EVENTS.ON_SET_STATE**: Triggered when state changes. Possible values could be "play", "pause" or "stop".
- **VG_EVENTS.ON_SET_VOLUME**: Triggered when volume changes.
- **VG_EVENTS.ON_TOGGLE_FULLSCREEN**: Triggered when fullscreen changes.
- **VG_EVENTS.ON_ENTER_FULLSCREEN**: Triggered when video enters in fullscreen.
- **VG_EVENTS.ON_EXIT_FULLSCREEN**: Triggered when video exits from fullscreen.
- **VG_EVENTS.ON_BUFFERING**: Triggered when video is buffering.
- **VG_EVENTS.ON_UPDATE_TIME**: Triggered when video progress updates.
- **VG_EVENTS.ON_UPDATE_SIZE**: Triggered when video size updates.

## Plugin example

Currently you will find a plugins folder with some source code to inspire you, however, you could see how easy is to write your own plugin with this example:

```js
var myVGPlugin = angular.module("com.2fdevs.videogular.plugins.myPlugin", []);
myVGPlugin.directive("vgOverlayplay", function($rootScope, VG_EVENTS, VG_STATES, VG_THEMES){
		return {
			restrict: "E",
			template: "<div>my videogular plugin</div>",
			link: function(scope, elem, attrs) {
				function onChangeState(target, params) {
					console.log("state changed to " + params[0]);
				}

				$rootScope.$on(VG_EVENTS.ON_SET_STATE, onChangeState);
			}
		}
	}
);
```

## Adding a plugin

To add a plugin just add your directives to your HTML. This is an example of a Videogular player:

```html
<div videogular width="640" height="264">
    <vg-buffering></vg-buffering>
    <vg-overlayPlay></vg-overlayPlay>

    <vg-controls vg-autohide="false">
        <vg-playpauseButton></vg-playpauseButton>
        <vg-timeDisplay>{{ currentTime }}</vg-timeDisplay>
        <vg-scrubBar>
            <vg-scrubbarcurrenttime></vg-scrubbarcurrenttime>
        </vg-scrubBar>
        <vg-timeDisplay>{{ totalTime }}</vg-timeDisplay>
        <vg-volume>
            <vg-mutebutton></vg-mutebutton>
            <vg-volumebar></vg-volumebar>
        </vg-volume>
        <vg-fullscreenButton></vg-fullscreenButton>
    </vg-controls>

    <video class='videoPlayer' preload='none' width='{{ data.width }}' height='{{ data.height }}' vg-poster='{{ data.poster }}'>
        <source ng-repeat='media in data.media' ng-src='{{ media.url }}' type='{{ media.type }}'>
    </video>
</div>
```

Because AngularJS is so cool, you could just remove or add any directive and the player should work as expected. For example, you could remove `<vg-timeDisplay>{{ currentTime }}</vg-timeDisplay>` and change `<vg-timeDisplay>{{ totalTime }}</vg-timeDisplay>` for `<vg-timeDisplay>{{ currentTime }} / {{ totalTime }}</vg-timeDisplay>` to change your time display component.

```html
<div videogular width="640" height="264">
    <vg-buffering></vg-buffering>
    <vg-overlayPlay></vg-overlayPlay>

    <vg-controls vg-autohide="false">
        <vg-playpauseButton></vg-playpauseButton>
        <vg-scrubBar>
            <vg-scrubbarcurrenttime></vg-scrubbarcurrenttime>
        </vg-scrubBar>
        <vg-timeDisplay>{{ currentTime }} / {{ totalTime }}</vg-timeDisplay>
        <vg-volume>
            <vg-mutebutton></vg-mutebutton>
            <vg-volumebar></vg-volumebar>
        </vg-volume>
        <vg-fullscreenButton></vg-fullscreenButton>
    </vg-controls>

    <video class='videoPlayer' preload='none' width='{{ data.width }}' height='{{ data.height }}' vg-poster='{{ data.poster }}'>
        <source ng-repeat='media in data.media' ng-src='{{ media.url }}' type='{{ media.type }}'>
    </video>
</div>
```

In the same way you could remove `<vg-volumebar></vg-volumebar>` and leave only `<vg-mutebutton></vg-mutebutton>` and so on. That's an easy way to build your own Videogular layout.

Additionally, you will need to add your module plugins and videogular to your application:

```js
"use strict";
var videogularApp = angular.module("videogularApp",
	[
		"controllers",

		"com.2fdevs.videogular",
		"com.2fdevs.videogular.plugins.controlbar",
		"com.2fdevs.videogular.plugins.overlayplay",
		"com.2fdevs.videogular.plugins.buffering"
	]
);
```

And that's all :)

## Themes

Videogular supports a very simple theme system through vg-theme directive and CSS styles.

To set your theme just set vg-theme attribute with a CSS url or a scope variable. If you pass a scope variable Videogular creates a binding and you just could change your theme on the fly.

Setting a binding through a scope variable:
```html
<!-- 
"theme" is a scope variable with a value like "themes/default/videogular.css"
-->
<div videogular width="640" height="264" vg-theme="theme">
    <!-- Videogular plugins and video tag... -->
</div>
```

Setting a CSS theme:
```html
<!-- 
If you pass a String with ".css" inside it loads and injects the CSS on the HTML
-->
<div videogular width="640" height="264" vg-theme="themes/default/videogular.css">
    <!-- Videogular plugins and video tag... -->
</div>
```

To change and create your own themes should be very easy just modifying `examples/css/videogular.css` file.
