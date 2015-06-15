var gulp 			= require('gulp'),
	gutil 			= require('gulp-util'),
	concat 			= require('gulp-concat'),
	browserify 		= require('gulp-browserify'),
	compass 		= require('gulp-compass'),
	minifycss		= require('gulp-minify-css')
	connect 		= require('gulp-connect'),
	gulpif 			= require('gulp-if'),
	uglify 			= require('gulp-uglify'),
	minifyhtml		= require('gulp-minify-html'),
	coffee 			= require('gulp-coffee');

var env,
	coffeeSources,
	jsSources,
	sassSources,
	htmlSources,
	jsonSources,
	outputDir;

env 			= process.env.NODE_ENV || 'development';

if( env === 'development' ) {
	outputDir 	= 'builds/development/';
} else {
	outputDir 	= 'builds/production/';
}

coffeeSources 	= ['components/coffee/*.coffee'];
sassSources		= ['components/sass/style.scss'];
htmlSources		= [outputDir + '*.html'];
jsonSources		= [outputDir + 'js/*.json'];
jsSources 		= [
	'components/scripts/rclick.js',
	'components/scripts/pixgrid.js',
	'components/scripts/tagline.js',
	'components/scripts/template.js'
];


gulp.task('default', ['html', 'json', 'coffee', 'js', 'compass', 'connect', 'watch']);

gulp.task('watch', function() {
	gulp.watch(coffeeSources, ['coffee']);
	gulp.watch(jsSources, ['js']);
	gulp.watch('components/sass/*.scss', ['compass']);
	gulp.watch('builds/development/*.html', ['html']);
	gulp.watch(jsonSources, ['json']);
});

gulp.task('connect', function() {
	connect.server({
		root: outputDir,
		livereload: true
	});
});

gulp.task('html', function() {
	gulp.src('builds/development/*.html')
	.pipe(gulpif(env === 'production', minifyhtml()))
	.pipe(gulpif(env === 'production', gulp.dest(outputDir)))
	.pipe(connect.reload())
});

gulp.task('json', function() {
	gulp.src(jsonSources)
	.pipe(connect.reload())
});

gulp.task('js', function() {
	gulp.src(jsSources)
		.pipe(concat('script.js'))
		.pipe(browserify())
		.pipe(gulpif(env === 'production', uglify()))
		.pipe(gulp.dest(outputDir + 'js'))
		.pipe(connect.reload())
});

gulp.task('compass', function() {
	gulp.src(sassSources)
		.pipe(compass({
			sass: 'components/sass',
			images: outputDir + 'images',
		}))
		.on('error', gutil.log)
		.pipe(gulpif(env === 'production', minifycss()))
		.pipe(gulp.dest(outputDir + 'css'))
		.pipe(connect.reload())
});

gulp.task('coffee', function() {
	gulp.src(coffeeSources)
		.pipe(coffee({bare:true}))
		.on('error', gutil.log)
		.pipe(gulp.dest('components/scripts'));
});