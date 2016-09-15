module.exports = function(grunt){

	// VARIABLES
	var _banner = '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n';

	// MODULES
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-wiredep');
	grunt.loadNpmTasks('grunt-bower-concat');
	grunt.loadNpmTasks('grunt-browser-sync');

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
				reporter: require('jshint-stylish')
			},
			build: ['Gruntfile.js', 'src/**/*.js']
		},

		uglify: {
			options: {
				banner: _banner
			},
			build: {
				files: {
					'dist/js/libs/libs.min.js':[
						'src/js/libs/*.js'
					],
					'dist/js/main.min.js':[
						'src/js/*.js'
					]
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

		bower_concat: {
			build: {
				dest: {
					'js': 'dist/js/bower/bower.js',
					'css': 'dist/css/bower/bower.css'
				}
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
				tasks: ['jshint', 'uglify']
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
		'jshint',
		'bower_concat',
		'uglify',
		'less',
		'cssmin',
		'htmlmin',
		'imagemin'
		]);

	grunt.registerTask('serve',
		[
		'browserSync',
		'watch'
		]);

};