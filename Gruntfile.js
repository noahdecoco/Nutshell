module.exports = function(grunt){

	// VARIABLES
	var _banner = '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n';
	var _jsFiles = [];

	// MODULES
	require('load-grunt-tasks')(grunt);

	// CONFIG
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		clean: {
			build: {
				src: ['dist/*']
			}
		},

		jshint: {
			options: {
				reporter: require('jshint-stylish'),
				esversion: 6
			},
			build: ['Gruntfile.js', 'src/**/*.js']
		},

		concat: {
			options: {
				sourceMap: true,
				sourceMapStyle: 'link'
			},
			libs: {
				src: 'src/js/libs/**/*.js',
				dest: 'dist/js/temp/libs.js'
			},
			main: {
				src: [
				'src/js/events/**/*.js',
				'src/js/services/**/*.js',
				'src/js/modules/**/*.js',
				'src/js/**/*.js',
				'src/js/main.js',
				'!src/js/libs/**/*.js'],
				dest: 'dist/js/temp/main.js'
			}
		},
		
		uglify: {
			options: {
				banner: _banner
			},
			build: {
				files: {
					'dist/js/libs.min.js':[
						'dist/js/temp/libs.js'
					],
					'dist/js/main.min.js':[
						'dist/js/temp/main.js'
					]
				}
			}
		},

		babel: {
			options: {
				sourceMap: true
			},
			dist: {
					files: {
					"dist/js/libs.min.js": "dist/js/temp/libs.js",
					"dist/js/main.min.js": "dist/js/temp/main.js"
				}
			}
		},

		less: {
			build: {
				compress: true,
				files: {
					'dist/css/libs/libs.css':'src/css/libs/*.less',
					'dist/css/styles.css':'src/css/*.less'
				}
			}
		},

		cssmin: {
			options: {
				banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
			},
			build: {
				files: {
					'dist/css/libs/libs.min.css':'dist/css/libs/libs.css',
					'dist/css/styles.min.css':'dist/css/styles.css'
				}
			}
		},

		htmlmin: {
			build: {
				options: {
					removeComments: true,
					collapseWhitespace: false
				},
				files: [
				{
					expand: true,
					cwd: 'src/',
					src: ['**/*.html'],
					dest: 'dist/'
				}
				]
			}
		},

		imagemin: {
			build: {
				files: [
				{
					expand: true,
					cwd: 'src/img/',
					src: ['**/*.jpg','**/*.png'],
					dest: 'dist/img/'
				}
				]
			}
		},

		browserSync: {
			dev: {
				bsFiles: {
					src : [
					'dist/css/*.css',
					'dist/js/*.js',
					'dist/*.html'
					]
				},
				options: {
					watchTask: true,
					server: './dist'
				}
			}
		},

		watch: {
			stylesheets: {
				files: ['src/**/*.less'],
				tasks: ['less','cssmin']
			},
			scripts:{
				files: ['src/**/*.js'],
				tasks: ['concat', 'babel']
			},
			html: {
				files:['src/**/*.html'],
				tasks:['htmlmin']
			}
		}
	});

	// TASKS
	grunt.registerTask('default',
		[
		'clean',
		// Javascript
		'concat',
		'uglify',
		// 'babel',
		// CSS
		'less',
		'cssmin',
		// Images
		'imagemin',
		// HTML
		'htmlmin'
		]);

	grunt.registerTask('serve',
		[
		'browserSync',
		'watch'
		]);

};