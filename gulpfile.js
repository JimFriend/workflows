var gulp 			= require('gulp'),
	gutil 			= require('gulp-util'),
	concat 			= require('gulp-concat'),
	browserify 		= require('gulp-browserify'),
	sass 			= require('gulp-sass'),
	minifycss		= require('gulp-minify-css')
	connect 		= require('gulp-connect'),
	gulpif 			= require('gulp-if'),
	uglify 			= require('gulp-uglify'),
	minifyhtml		= require('gulp-minify-html'),
	jsonminify		= require('gulp-jsonminify');

var env,
	jsSources,
	sassSources,
	htmlSources,
	jsonSources,
	outputDir,
	config;

config = {
	bootstrapDir: './bower_components/bootstrap-sass'
};

env = process.env.NODE_ENV || 'development';

if( env === 'development' ) {
	outputDir = 'builds/development/';
} else {
	outputDir = 'builds/production/';
}

sassSources = [
	'components/sass/style.scss'
];
htmlSources = [outputDir + '*.html'];
jsonSources = [outputDir + 'js/*.json'];
jsSources = ['components/scripts/debug.js'];

gulp.task('default', ['html', 'json', 'css', 'fonts', 'js', 'connect', 'watch']);

gulp.task('watch', function() {
	gulp.watch(jsSources, ['js']);
	gulp.watch('components/sass/*.scss', ['css']);
	gulp.watch('builds/development/*.html', ['html']);
	gulp.watch('builds/development/*.json', ['json']);
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
	gulp.src('builds/development/js/*.json')
	.pipe(gulpif(env === 'production', jsonminify()))
	.pipe(gulpif(env === 'production', gulp.dest('builds/production/js')))
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

gulp.task('css', function() {
	gulp.src('./components/sass/style.scss')
		.pipe(sass({
			includePaths: [config.bootstrapDir + '/assets/stylesheets']
		}))
		.on('error', gutil.log)
		.pipe(gulpif(env === 'production', minifycss()))
		.pipe(gulp.dest(outputDir + 'css'))
		.pipe(connect.reload())
});

gulp.task('fonts', function() {
    gulp.src(config.bootstrapDir + '/assets/fonts/**/*')
    	.pipe(gulp.dest(outputDir + '/fonts'));
});