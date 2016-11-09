module.exports = function(grunt) {

	// slipper att skriva många rader
	require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

	// sätt ihop hela Grunt-grejer
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		/* SASS-inställningar */
		sass: {
			dist: {
				options: {
					style: 'compressed',
					sourcemap: 'none',
					precision: 2,
					update: true
				},
				files: {
					// målfil : källfil
					'css/style.css' : 'src/scss/style.scss'
				}
			}
		},

		/* POST CSS */
		postcss: {
			options: {
				map: false,
				processors: [
				require('autoprefixer')({browsers: 'last 2 versions'}),
				require('cssnano')()
				]
			},
			dist: {
				// alla filer som är .css
				src: 'css/*.css'
			}
		},

		/* JSCS */
		jscs: {
			src: 'src/js/*.js',
			options: {
				// man kan välja andra standard inställningar (setup)
				'preset': 'google'
			}
		},

		/* UGLIFY */
		uglify: {
			options: {
				beautify: false,
				preservComments: false,
				quoteStyle: 1, // enkel fnutar
				compress: {
					drop_console: true // alla console.log försvinner
				}
			},
			build: {
				files: [{
					expand: true,
					src: 'src/js/build/*.js',
					dest: 'js/',
					flatten: true,
					rename: function(destBase, destPath) {
						return destBase+destPath.replace('.js', '.min.js');
					}
				}]
			}
		},

		/* CONCAT */
		concat: {
			options: {
				separator: '\n'
			},
			dist: {
				src: ['src/js/main.js', 'src/js/mobile.js'], // de slår ihop till scripts.js
				dest: 'src/js/build/scripts.js'
			}
		},

		/* WATCH - man slipper att skriva grunt i terminalen varje gång man har ändrat något på scss-filen */
		watch: {
			css: {
				files: ['**/*.scss'],
				tasks: ['sass', 'postcss']
			},
			js: {
				files: ['src/js/*.js'],
				// kör först jscs, sen concat och sen uglify; i exakt den här ordningen man har skrivit moduler
				tasks: [/*'jscs',*/ 'concat', 'uglify'] // man kan kommentera bort ([/*'jscs']*/) om man inte vill att det kör varje gång man spara sin js-filen
			},
			options: {
				nospawn: true
			}
		}
	});
	grunt.registerTask('default', ['watch']);
}