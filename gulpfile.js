var gulp 			= require('gulp'),
	gutil 			= require('gulp-util'),
	concat 			= require('gulp-concat'),
	browserify 		= require('gulp-browserify'),
	compass 		= require('gulp-compass'),
	coffee 			= require('gulp-coffee');

var coffeeSources 	= ['components/coffee/*.coffee'];
var jsSources 		= [
	'components/scripts/rclick.js',
	'components/scripts/pixgrid.js',
	'components/scripts/tagline.js',
	'components/scripts/template.js'
];

var sassSources		= ['components/sass/style.scss'];

gulp.task('default', ['coffee', 'js', 'compass']);

gulp.task('js', function() {
	gulp.src(jsSources)
		.pipe(concat('script.js'))
		.pipe(browserify())
		.pipe(gulp.dest('builds/development/js'))
});

gulp.task('compass', function() {
	gulp.src(sassSources)
		.pipe(compass({
			sass: 'components/sass',
			images: 'builds/development/images',
			style: 'expanded'
		}))
		.on('error', gutil.log)
		.pipe(gulp.dest('builds/development/css'))
});

gulp.task('coffee', function() {
	gulp.src(coffeeSources)
		.pipe(coffee({bare:true}))
		.on('error', gutil.log)
		.pipe(gulp.dest('components/scripts'));
});