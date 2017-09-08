# Videogular for AngularJS (1.x)
[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/2fdevs/videogular?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

**Videogular is an HTML5 video player for AngularJS**. Videogular is a wrapper over the HTML5 video tag, so you just could add whatever you want. This provides a very powerful, but simple to use solution, for everybody.

You could see a demo here: [www.videogular.com](http://www.videogular.com)

## Angular (2+) Support

Videogular2 is under active development and will be available with Angular 2+. Videogular2 will follow the same philosophy and we're open to discuss any possibilities. If you want to contribute you can open a new issue with your suggestions or clone the repository to make pull requests.

You can find a demo here:
https://videogular.github.io/videogular2-showroom/#/

And this is the development repository:
https://github.com/videogular/videogular2

## Why Videogular?

We're developing Videogular focusing on mobile devices and HTML5 video special capabilities. Videogular brings to you these key features:

* **Bindable properties**: Videogular's directives are bindable, just [try the demo](http://www.videogular.com) and play with bindings.
* **Extendable through plugins**: Thanks to our API you can develop your own plugins.
* **Theme based**: Customize it with your own themes and change between them on the fly.
* **Native fullscreen support**: Enjoy with native fullscreen support for Chrome, Firefox, Safari, iOS and Chrome for Android.
* **Mobile support**: Videogular can detect mobile devices to show/hide components in case that aren't supported. Also, you could use it in your responsive websites, Videogular will always scale to fit its container.

## Documentation and how to install

** Important information:** Bower repositories have been deprecated. Now all modules are available inside the same npm package:

https://www.npmjs.com/package/videogular

Simply run `npm install videogular`. Then import the desired features from the `dist` directory.

See the [Videogular's website](http://www.videogular.com) for more info about [how to start and installation notes](http://www.videogular.com/tutorials/how-to-start/) **(beware that this is presently out of date)**. We have also [tutorials](http://www.videogular.com/tutorials/) and [examples](http://www.videogular.com/examples/) if you need a guide or code samples.

For more info you can check the full [Videogular API documentation](http://www.videogular.com/docs/).

## Running and building

To run the project and create the minified and debug files just run `grunt`.

This will run the tests and if everything works as expected it would create a `build` folder on root.

## Third-party plugins

If you have developed a Videogular's plugin or theme [contact us through this form](http://www.videogular.com/contact/) and we will add you to this list.

* [**Youtube plugin**](https://github.com/NamPNQ/bower-videogular-youtube) by **[NamPNQ](https://github.com/NamPNQ)**
* [**Quiz plugin**](https://github.com/NamPNQ/bower-videogular-quiz) by **[NamPNQ](https://github.com/NamPNQ)**
* [**Flash fallback plugin**](https://github.com/NamPNQ/bower-videogular-flash) by **[NamPNQ](https://github.com/NamPNQ)**
* [**Background video plugin**](https://gist.github.com/panurge-ws/525caef640784a487aa2) by **[panurge-ws](https://github.com/panurge-ws)**
* [**Videogular subtitle plugin**](https://github.com/farhan-repo/videogular-subtitle-plugin) (for Videogular 0.4.0) by **[farhan-repo](https://github.com/farhan-repo)**
* [**Videogular Cuepoints plugin**](https://github.com/HarryCutts/videogular-cuepoints) by **[HarryCutts](https://github.com/HarryCutts)** (not to be confused with the later [Cue Points feature](http://www.videogular.com/tutorials/videogular-cue-points-synchronize-video-with-twitter/))

## Migrate to 2.0 from an older version of Videogular
Use of the `videogular` package on NPM is now the preferred method of distribution. This now includes all of the features that had previously been distributed separately. Simply import the features that you desire into your build.

## Migrate to 1.0 from an older version of Videogular

All attributes for the various directives (including plugins) are still being maintained as usual, however, the naming of several have changed significantly to conform to an improved coding style. Here is a semi-exhaustive list:

1. No more `<vg-video>`.  Ditched in favor of `<vg-media>` that supports audio as well.
2. `vg-controls`:

    ```
    vg-timedisplay -> vg-time-display
    vg-scrubBar -> vg-scrub-bar
    vg-scrubbarcurrenttime -> vg-scrub-bar-current-time
    vg-timedisplay -> vg-time-display
    vg-mutebutton -> vg-mute-button
    vg-volumebar -> vg-volume-bar
    ```
    
3. `vg-poster-image -> vg-poster`

For a complete migration guide we recommend you to check the [Migration guide to Videogular 1.0.0](http://www.videogular.com/tutorials/migration-guide-to-videogular-1-0-0/).

## Supported by

Videogular team would like to thank all of our generous sponsors who support this project:

[![](sponsors/jetbrains.png)](https://www.jetbrains.com)
[![](sponsors/toptal.png)](https://www.toptal.com)

## Credits

Videogular is an open source project maintained by (literally) [two fucking developers](http://twofuckingdevelopers.com/).

We want to thank all our contributors: [Raúl Jiménez](https://github.com/Elecash), [Robert Zhang](https://github.com/rogerz), [Javier Tejero](https://github.com/javiertejero), [Marcos González](https://github.com/qmarcos), [Rafał Lindemann](https://github.com/panrafal), [Alberto Tafoya](https://github.com/withattribution), [Sergey Okhotnitski](https://github.com/5erg), [Javier Cejudo](https://github.com/javiercejudo), [Sam Lau](https://github.com/schmooie), [paxal78](https://github.com/paxal78), [Raymond Klass](https://github.com/RaymondKlass), [Harry Cutts](https://github.com/Fodaro), [Chris MacPherson](https://github.com/chrismacp), [stefanvonderkrone](https://github.com/stefanvonderkrone), [Emil Ibatullin](https://github.com/cawabunga), [Uzair Sajid](https://github.com/UzEE), [pavelnikolov](https://github.com/pavelnikolov), [Frank3K](https://github.com/Frank3K), [EmilioAiolfi](https://github.com/EmilioAiolfi), [Bernhelm](https://github.com/Bernhelm), [Morriz](https://github.com/Morriz), [Chris Funk](https://github.com/a727891), [Johann Beishline](https://github.com/techmodo), [edisonh](https://github.com/edisonh), [Nainterceptor](https://github.com/Nainterceptor), [Max Maes](https://github.com/maxmaes), [pire](https://github.com/pire), [Davin Kevin](https://github.com/davinkevin), [bkuzma](https://github.com/bkuzma), [VanVan](https://github.com/VanVan), [Kevin Feinberg](https://github.com/kfeinUI), [Jonathan Asquier](https://github.com/jonathanasquier), [Centsent](https://github.com/centsent), [Zane McCaig](https://github.com/zanemcca), [Nils Thingvall](https://github.com/turbidwater), [Tim Costa](https://github.com/tjsail33), [Alex Wilde](https://github.com/alexthewilde), [jarrodlytle](https://github.com/jarrodlytle), [daviddk](https://github.com/daviddk) , [Artem Medvedev](https://github.com/ArtemMedvedev) , [super-ienien](https://github.com/super-ienien) , [Jared Fox](https://github.com/jalexanderfox) and [our bug submitters](https://github.com/2fdevs/videogular/issues?state=open).

## Changelog
Here you can see the complete [changelog](https://github.com/2fdevs/videogular/blob/master/CHANGELOG.md)
