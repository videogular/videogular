// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function (config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '../../',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'test/libs/jquery/2.1.0/jquery-2.1.0.min.js',
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-sanitize/angular-sanitize.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/bower_components/angulartics/src/angulartics.js',
      'app/bower_components/angulartics/src/angulartics-ga.js',
      'app/scripts/dash/dash.all.js',

      'app/scripts/com/2fdevs/videogular/vg-module.js',
      'app/scripts/com/2fdevs/videogular/**/*.js',
      'app/scripts/com/2fdevs/videogular/**/*.html',
      'test/spec/**/*.js'
    ],

    // web server port
    port: 8080,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['Chrome', 'Firefox'],

    plugins: [
      'karma-jasmine',
      'karma-junit-reporter',
      'karma-coverage',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-script-launcher',
      'karma-ng-html2js-preprocessor'
    ],

    "junitReporter": {
      outputFile: 'build/unit.xml',
      suite: 'unit'
    },

    // optionally, configure the reporter
    coverageReporter: {
      reporters:[
        {
          type: 'cobertura',
          dir: 'coverage/',
          file: 'coverage.xml'
        },
        {
          type: 'html',
          dir: 'coverage/'
        }
      ]
    },

    // coverage reporter generates the coverage
    reporters: [/*'progress', */'dots', 'coverage'],

    preprocessors: {
      // source files, that you wanna generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul)
      'app/scripts/com/2fdevs/videogular/**/!(vg-ima-ads)/*.js': ['coverage']
    },

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
