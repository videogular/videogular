module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		docular: {
			groups: [
				{
					groupTitle: "Videogular",
					groupId: "videogular",
					groupIcon: "icon-play-circle",
					showSource: true,
					sections: [
						{
							id: "using-videogular",
							title: "Using Videogular",
							showSource: false,
							docs: [
								"js/docs/using-videogular"
							],
                            rank: {
                                'how-to-use-videogular':1,
                                'plugins':2,
                                'plugin-example':3,
                                'adding-a-plugin':4,
                                'themes':5
                            }
						},
						{
							id: "videogular-reference",
							title: "Videogular reference",
							showSource: false,
							docs: [
								"js/docs/videogular-reference"
							]
						},
						{
							id: "plugins-reference",
							title: "Plugins reference",
							showSource: false,
							docs: [
								"js/docs/plugins-reference"
							],
                            rank: {
                                'buffering':1,
                                'controlbar':2,
                                'overlay-play':3,
                                'poster':4
                            }
						}
					]
				}
			],
			showDocularDocs: false,
			showAngularDocs: false
		}

	});

	// Load the plugin that provides the "docular" tasks.
	grunt.loadNpmTasks('grunt-docular');

	// Default task(s).
	grunt.registerTask('default', ['docular']);
};