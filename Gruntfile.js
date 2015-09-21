module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        karma: {
            test: {
                configFile: 'test/conf/karma.conf.js',
                singleRun: true,
                logLevel: 'INFO',
                port: 8070
            }
        },
        cssmin: {
            css: {
                src: 'app/styles/themes/default/videogular.css',
                dest: 'dist/themes/default/latest/videogular.min.css'
            }
        },
        concat: {
            videogular: {
                src: [
                    'app/scripts/com/2fdevs/videogular/vg-module.js',
                    'app/scripts/com/2fdevs/videogular/constants/*.js',
                    'app/scripts/com/2fdevs/videogular/controllers/*.js',
                    'app/scripts/com/2fdevs/videogular/directives/*.js',
                    'app/scripts/com/2fdevs/videogular/services/*.js'
                ],
                dest: 'dist/videogular/latest/videogular.js'
            },
            vgControls: {
                src: [
                    'app/scripts/com/2fdevs/videogular/plugins/vg-controls/vg-controls.js',
                    'app/scripts/com/2fdevs/videogular/plugins/vg-controls/**/*.js'
                ],
                dest: 'dist/controls/latest/vg-controls.js'
            }
        },
        uglify: {
            js: {
                files: {
                    'dist/videogular/latest/videogular.min.js': ['dist/videogular/latest/videogular.js'],
                    'dist/analytics/latest/vg-analytics.min.js': ['app/scripts/com/2fdevs/videogular/plugins/vg-analytics/vg-analytics.js'],
                    'dist/buffering/latest/vg-buffering.min.js': ['app/scripts/com/2fdevs/videogular/plugins/vg-buffering/vg-buffering.js'],
                    'dist/controls/latest/vg-controls.min.js': ['dist/controls/latest/vg-controls.js'],
                    'dist/ima-ads/latest/vg-ima-ads.min.js': ['app/scripts/com/2fdevs/videogular/plugins/vg-ima-ads/vg-ima-ads.js'],
                    'dist/overlay-play/latest/vg-overlay-play.min.js': ['app/scripts/com/2fdevs/videogular/plugins/vg-overlay-play/vg-overlay-play.js'],
                    'dist/poster/latest/vg-poster.min.js': ['app/scripts/com/2fdevs/videogular/plugins/vg-poster/vg-poster.js'],
                    'dist/dash/latest/vg-dash.min.js': ['app/scripts/com/2fdevs/videogular/plugins/vg-dash/vg-dash.js']
                }
            }
        },
        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        cwd: 'app/styles/themes/default/',
                        src: ['**'],
                        dest: 'dist/themes/default/latest/'
                    },
                    {
                        expand: true,
                        cwd: 'app/scripts/com/2fdevs/videogular/plugins/vg-analytics/',
                        src: ['**'],
                        dest: 'dist/analytics/latest/'
                    },
                    {
                        expand: true,
                        cwd: 'app/scripts/com/2fdevs/videogular/plugins/vg-buffering/',
                        src: ['**'],
                        dest: 'dist/buffering/latest/'
                    },
                    {
                        expand: true,
                        cwd: 'app/scripts/com/2fdevs/videogular/plugins/vg-ima-ads/',
                        src: ['**'],
                        dest: 'dist/ima-ads/latest/'
                    },
                    {
                        expand: true,
                        cwd: 'app/scripts/com/2fdevs/videogular/plugins/vg-overlay-play/',
                        src: ['**'],
                        dest: 'dist/overlay-play/latest/'
                    },
                    {
                        expand: true,
                        cwd: 'app/scripts/com/2fdevs/videogular/plugins/vg-poster/',
                        src: ['**'],
                        dest: 'dist/poster/latest/'
                    },
                    {
                        expand: true,
                        cwd: 'app/scripts/com/2fdevs/videogular/plugins/vg-dash/',
                        src: ['**'],
                        dest: 'dist/dash/latest/'
                    }
                ]
            },
            release: {
                files: [
                    {
                        flatten: true,
                        expand: true,
                        src: ['dist/videogular/latest/*.js'],
                        dest: '../bower-videogular/',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: ['dist/themes/default/latest/*.css', 'dist/themes/default/latest/*.map'],
                        dest: '../bower-videogular-themes-default/',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: ['dist/themes/default/latest/fonts/**'],
                        dest: '../bower-videogular-themes-default/fonts/',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: ['dist/analytics/latest/*.js'],
                        dest: '../bower-videogular-analytics/',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: ['dist/buffering/latest/*.js'],
                        dest: '../bower-videogular-buffering/',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: ['dist/controls/latest/*.js'],
                        dest: '../bower-videogular-controls/',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: ['dist/ima-ads/latest/*.js'],
                        dest: '../bower-videogular-ima-ads/',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: ['dist/overlay-play/latest/*.js'],
                        dest: '../bower-videogular-overlay-play/',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: ['dist/poster/latest/*.js'],
                        dest: '../bower-videogular-poster/',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: ['dist/dash/latest/*.js'],
                        dest: '../bower-videogular-dash/',
                        filter: 'isFile'
                    }
                ]
            }
        },
        clean: {
            build: [
                "build"
            ],
            docs: [
                "docs"
            ]
        },
        ngdocs: {
            options: {
                dest: 'docs',
                html5Mode: false
            },
            api: {
                title: "API Reference",
                src: [
                    'docs/content/api/*.ngdoc',
                    'app/scripts/com/2fdevs/videogular/**/*.js'
                ]
            }
        },
        hub: {
            major: {
                src: [
                    "../bower-videogular/Gruntfile.js",
                    "../bower-videogular-analytics/Gruntfile.js",
                    "../bower-videogular-buffering/Gruntfile.js",
                    "../bower-videogular-controls/Gruntfile.js",
                    "../bower-videogular-ima-ads/Gruntfile.js",
                    "../bower-videogular-overlay-play/Gruntfile.js",
                    "../bower-videogular-poster/Gruntfile.js",
                    "../bower-videogular-dash/Gruntfile.js",
                    "../bower-videogular-themes-default/Gruntfile.js"],
                tasks: ["release:major"],
                concurrent: 1
            },
            minor: {
                src: [
                    "../bower-videogular/Gruntfile.js",
                    "../bower-videogular-analytics/Gruntfile.js",
                    "../bower-videogular-buffering/Gruntfile.js",
                    "../bower-videogular-controls/Gruntfile.js",
                    "../bower-videogular-ima-ads/Gruntfile.js",
                    "../bower-videogular-overlay-play/Gruntfile.js",
                    "../bower-videogular-poster/Gruntfile.js",
                    "../bower-videogular-dash/Gruntfile.js",
                    "../bower-videogular-themes-default/Gruntfile.js"],
                tasks: ["release:minor"],
                concurrent: 1
            },
            patch: {
                src: [
                    "../bower-videogular/Gruntfile.js",
                    "../bower-videogular-analytics/Gruntfile.js",
                    "../bower-videogular-buffering/Gruntfile.js",
                    "../bower-videogular-controls/Gruntfile.js",
                    "../bower-videogular-ima-ads/Gruntfile.js",
                    "../bower-videogular-overlay-play/Gruntfile.js",
                    "../bower-videogular-poster/Gruntfile.js",
                    "../bower-videogular-dash/Gruntfile.js",
                    "../bower-videogular-themes-default/Gruntfile.js"],
                tasks: ["release:patch"],
                concurrent: 1
            }
        }
    });

    // And comment these ugly loadNpmTasks code.
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-release');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-hub');
    grunt.loadNpmTasks('grunt-ngdocs');

    grunt.registerTask('default', ['karma:test', 'clean:build', 'cssmin:css', 'concat', 'uglify:js', 'copy:main', 'copy:release']);
    grunt.registerTask('docs', ['clean:docs', 'ngdocs']);
    grunt.registerTask('test', ['karma:test']);
    grunt.registerTask('major-release', ['default', 'hub:major']);
    grunt.registerTask('minor-release', ['default', 'hub:minor']);
    grunt.registerTask('patch-release', ['default', 'hub:patch']);
};
