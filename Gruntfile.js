module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		karma: {
			build: {
				configFile: 'karma.conf.js',
				singleRun: true,
				logLevel: 'INFO',
				port: 8071
			},
			test: {
				configFile: 'karma.conf.js',
				autoWatch: true,
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
		uglify: {
			js: {
				files: {
					'build/videogular/videogular.min.js': ['app/scripts/com/2fdevs/videogular/videogular.js'],
					'build/buffering/buffering.min.js': ['app/scripts/com/2fdevs/videogular/plugins/buffering.js'],
					'build/controls/controls.min.js': ['app/scripts/com/2fdevs/videogular/plugins/controls.js'],
					'build/ima-ads/ima-ads.min.js': ['app/scripts/com/2fdevs/videogular/plugins/ima-ads.js'],
					'build/overlay-play/overlay-play.min.js': ['app/scripts/com/2fdevs/videogular/plugins/overlay-play.js'],
					'build/poster/poster.min.js': ['app/scripts/com/2fdevs/videogular/plugins/poster.js'],
					'build/dash/dash.min.js': ['app/scripts/com/2fdevs/videogular/plugins/dash.js']
				}
			}
		},
		copy: {
			main: {
				files: [
					{
						src: ['app/scripts/com/2fdevs/videogular/videogular.js'],
						dest: 'build/videogular/videogular.js',
						filter: 'isFile'
					},
					{
						expand: true,
						flatten: true,
						src: ['app/styles/themes/default/fonts/**'],
						dest: 'build/themes/default/fonts/',
						filter: 'isFile'
					},
					{
						src: ['app/styles/themes/default/videogular.css'],
						dest: 'build/themes/default/videogular.css',
						filter: 'isFile'
					},
					{
						src: ['app/scripts/com/2fdevs/videogular/plugins/buffering.js'],
						dest: 'build/buffering/buffering.js',
						filter: 'isFile'
					},
					{
						src: ['app/scripts/com/2fdevs/videogular/plugins/controls.js'],
						dest: 'build/controls/controls.js',
						filter: 'isFile'
					},
					{
						src: ['app/scripts/com/2fdevs/videogular/plugins/ima-ads.js'],
						dest: 'build/ima-ads/ima-ads.js',
						filter: 'isFile'
					},
					{
						src: ['app/scripts/com/2fdevs/videogular/plugins/overlay-play.js'],
						dest: 'build/overlay-play/overlay-play.js',
						filter: 'isFile'
					},
					{
						src: ['app/scripts/com/2fdevs/videogular/plugins/poster.js'],
						dest: 'build/poster/poster.js',
						filter: 'isFile'
					},
					{
						src: ['app/scripts/com/2fdevs/videogular/plugins/dash.js'],
						dest: 'build/dash/dash.js',
						filter: 'isFile'
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
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-hub');
	grunt.loadNpmTasks('grunt-ngdocs');

	grunt.registerTask('default', ['clean:build', 'cssmin:css', 'uglify:js', 'copy:main', 'copy:release']);
	grunt.registerTask('docs', ['clean:docs', 'ngdocs']);
	grunt.registerTask('major-release', ['default', 'hub:major']);
	grunt.registerTask('minor-release', ['default', 'hub:minor']);
	grunt.registerTask('patch-release', ['default', 'hub:patch']);
};
