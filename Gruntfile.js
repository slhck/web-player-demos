module.exports = grunt => {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		clean: [ 'dist' ],

		connect: {
			dev: {
				options: {
					useAvailablePort: true,
					port: 8000,
					directory: 'dist',
					base: 'dist',
					livereload: true,
					open: true
				}
			}
		},

		copy: {
			favicon: {
				src: 'src/favicon.ico',
				dest: 'dist/favicon.io'
			},
			assets: {
				expand: true,
				cwd: 'demos',
				src: [
					'**/*.js',
					'**/*.css',
					'**/assets/**'
				],
				dest: 'dist/'
			}
		},

		cssmin: {
			options: {
				keepSpecialComments: 0,
				processImport: false,
				sourceMap: false
			},
			build: {
				files: [
					{
						cwd: 'dist/css',
						dest: 'dist/css',
						expand: true,
						src: ['*.min.css']
					}
				]
			}
		},

		less: {
			options: {
				ieCompat: false,
				strictMath: true,
				paths: ['node_modules']
			},

			build: {
				options: {
					outputSourceFiles: true,
					sourceMap: true
				},
				src: ['src/less/style.less'],
				dest: 'dist/css/style.min.css'
			}
		},

		postcss: {
			options: {
				failOnError: true,
				processors: [require('autoprefixer')]
			},

			build: {
				src: ['dist/css/*.min.css']
			}
		},

		run: {
			dev: {
				cmd: 'node',
				args: [ 'build.js' ]
			}
		},

		stylelint: {
			dev: {
				options: {
					configFile: '.stylelintrc'
				},
				src: ['src/less/**/*.less']
			}
		},

		watch: {
			connect: {
				files: [
					'demos/**/*',
					'partials/**/*'
				],
				options: {
					atBegin: true,
					spawn: false,
					debounceDelay: 1000,
					livereload: true
				},
				tasks: [
					'default',
					'run:dev'
				]
			},

			styles: {
				options: {
					atBegin: true,
					livereload: true,
					spawn: false
				},
				files: ['src/less/**/*.less'],
				tasks: [
					'stylelint',
					'less:build',
					'postcss'
				]
			}
		}
	});

	grunt.loadNpmTasks('@lodder/grunt-postcss');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-run');
	grunt.loadNpmTasks('grunt-stylelint');

	grunt.registerTask('default', 'Build assets', [
		'stylelint',
		'clean',
		'copy',
		'less:build',
		'postcss:build',
		'cssmin'
	]);

	grunt.registerTask('dev', 'Watch for changes', [
		'default',
		'connect',
		'watch'
	]);
};
