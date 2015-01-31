module.exports = function(grunt) {
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
				dest: 'build/themes/default/videogular.min.css'
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
        dest: 'build/videogular/videogular.js'
      },
      vgControls: {
        src: [
          'app/scripts/com/2fdevs/videogular/plugins/vg-controls/vg-controls.js',
          'app/scripts/com/2fdevs/videogular/plugins/vg-controls/**/*.js'
        ],
        dest: 'build/controls/vg-controls.js'
      }
    },
		uglify: {
			js: {
				files: {
					'build/videogular/videogular.min.js': ['build/videogular/videogular.js'],
					'build/analytics/vg-analytics.min.js': ['app/scripts/com/2fdevs/videogular/plugins/vg-analytics/vg-analytics.js'],
					'build/buffering/vg-buffering.min.js': ['app/scripts/com/2fdevs/videogular/plugins/vg-buffering/vg-buffering.js'],
					'build/controls/vg-controls.min.js': ['build/controls/vg-controls.js'],
					'build/ima-ads/vg-ima-ads.min.js': ['app/scripts/com/2fdevs/videogular/plugins/vg-ima-ads/vg-ima-ads.js'],
					'build/overlay-play/vg-overlay-play.min.js': ['app/scripts/com/2fdevs/videogular/plugins/vg-overlay-play/vg-overlay-play.js'],
					'build/poster/vg-poster.min.js': ['app/scripts/com/2fdevs/videogular/plugins/vg-poster/vg-poster.js'],
					'build/dash/vg-dash.min.js': ['app/scripts/com/2fdevs/videogular/plugins/vg-dash/vg-dash.js']
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
            dest: 'build/themes/default/'
          },
          {
            expand: true,
            cwd: 'app/scripts/com/2fdevs/videogular/plugins/vg-analytics/',
            src: ['**'],
            dest: 'build/analytics/'
          },
          {
            expand: true,
            cwd: 'app/scripts/com/2fdevs/videogular/plugins/vg-buffering/',
            src: ['**'],
            dest: 'build/buffering/'
          },
          {
            expand: true,
            cwd: 'app/scripts/com/2fdevs/videogular/plugins/vg-ima-ads/',
            src: ['**'],
            dest: 'build/ima-ads'
          },
          {
            expand: true,
            cwd: 'app/scripts/com/2fdevs/videogular/plugins/vg-overlay-play/',
            src: ['**'],
            dest: 'build/overlay-play'
          },
          {
            expand: true,
            cwd: 'app/scripts/com/2fdevs/videogular/plugins/vg-poster/',
            src: ['**'],
            dest: 'build/poster'
          },
          {
            expand: true,
            cwd: 'app/scripts/com/2fdevs/videogular/plugins/vg-dash/',
            src: ['**'],
            dest: 'build/dash'
          }
        ]
      },
			release: {
				files: [
					{
						flatten: true,
						expand: true,
						src: ['build/videogular/*.js'],
						dest: '../bower-videogular/',
						filter: 'isFile'
					},
					{
						expand: true,
						flatten: true,
						src: ['build/themes/default/*.css'],
						dest: '../bower-videogular-themes-default/',
						filter: 'isFile'
					},
					{
						expand: true,
						flatten: true,
						src: ['build/themes/default/fonts/**'],
						dest: '../bower-videogular-themes-default/fonts/',
						filter: 'isFile'
					},
					{
						expand: true,
						flatten: true,
						src: ['build/analytics/*.js'],
						dest: '../bower-videogular-analytics/',
						filter: 'isFile'
					},
					{
						expand: true,
						flatten: true,
						src: ['build/buffering/*.js'],
						dest: '../bower-videogular-buffering/',
						filter: 'isFile'
					},
					{
						expand: true,
						flatten: true,
						src: ['build/controls/*.js'],
						dest: '../bower-videogular-controls/',
						filter: 'isFile'
					},
					{
						expand: true,
						flatten: true,
						src: ['build/ima-ads/*.js'],
						dest: '../bower-videogular-ima-ads/',
						filter: 'isFile'
					},
					{
						expand: true,
						flatten: true,
						src: ['build/overlay-play/*.js'],
						dest: '../bower-videogular-overlay-play/',
						filter: 'isFile'
					},
					{
						expand: true,
						flatten: true,
						src: ['build/poster/*.js'],
						dest: '../bower-videogular-poster/',
						filter: 'isFile'
					},
					{
						expand: true,
						flatten: true,
						src: ['build/dash/*.js'],
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

	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-release');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
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
