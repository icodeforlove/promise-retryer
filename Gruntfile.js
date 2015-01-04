module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		jshint: {
			options: {
				jshintrc: true
			},
			all: ['./*.js', './test/*.js']
		},

		jasmine_node: {
			options: {
				forceExit: true,
				match: '.',
				matchall: false,
				extensions: 'js',
				specNameMatcher: 'test'
			},
			all: ['test/']
		},

		watch: {
			jasmine: {
				files: ['test/*.js'],
				tasks: ['test']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-jasmine-node');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('test', ['jshint', 'jasmine_node']);
};