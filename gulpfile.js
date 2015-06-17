var gulp 			= require('gulp'),
	gutil 			= require('gulp-util'),
	concat 			= require('gulp-concat'),
	browserify 		= require('gulp-browserify'),
	sass 			= require('gulp-sass'),
	sourcemaps		= require('gulp-sourcemaps'),
	minifycss		= require('gulp-minify-css'),
	connect 		= require('gulp-connect'),
	gulpif 			= require('gulp-if'),
	uglify 			= require('gulp-uglify'),
	minifyhtml		= require('gulp-minify-html'),
	autoprefixer	= require('gulp-autoprefixer'),
	plumber			= require('gulp-plumber'),
	jsonminify		= require('gulp-jsonminify');

var env,
	jsSources,
	sassSources,
	htmlSources,
	jsonSources,
	outputDir,
	config;

var paths = {
	config					: {
		bower 					: './bower_components',
		node 					: './node_modules'
	},
	dev 					: {
		base 				: './builds/development',
		css 				: './builds/development/css',
		fonts 				: './builds/development/fonts',
		images 				: './builds/development/images',
		js 					: './builds/development/js'
	},
	dist					: {
		base 				: './builds/production',
		css 				: './builds/production/css',
		fonts 				: './builds/production/fonts',
		js 					: './builds/production/js'
	},
	components 				: {
		base				: './components',
		sass 				: './components/sass',
		js 					: './components/js'
	}
	vendor					: {
		bootstrap 			: {
			base			: './bower_components/bootstrap-sass',
			fonts 			: './bower_components/bootstrap-sass/assets/fonts',
			images 			: './bower_components/bootstrap-sass/assets/images',
			js 				: './bower_components/bootstrap-sass/assets/javascripts',
			css 			: './bower_components/bootstrap-sass/assets/stylesheets'
		},
		fontawesome			: {
			base            : './bower_components/fontawesome',
			css 			: './bower_components/fontawesome/css',
			fonts 			: './bower_components/fontawesome/fonts',
			sass 			: './bower_components/fontawesome/scss'
		}

	}
};

config = {
	bowerDir		: './bower_components',
	bootstrapDir 	: './bower_components/bootstrap-sass',
	nodeDir			: './node_modules'
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
jsSources = ['components/scripts/*.js'];

var onError = function (err) {  
	gutil.beep();
	console.log(err);
	this.emit('end');
};

gulp.task('default', ['html', 'json', 'css', 'fonts', 'icons', 'js', 'connect', 'watch']);

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
		.pipe(plumber({
      		errorHandler: onError
    	}))
		.pipe(gulpif(env === 'production', minifyhtml()))
		.pipe(gulpif(env === 'production', gulp.dest(outputDir)))
		.pipe(connect.reload())
});

gulp.task('json', function() {
	gulp.src('builds/development/js/*.json')
		.pipe(plumber({
      		errorHandler: onError
    	}))
		.pipe(gulpif(env === 'production', jsonminify()))
		.pipe(gulpif(env === 'production', gulp.dest('builds/production/js')))
		.pipe(connect.reload())
});

gulp.task('js', function() {
	gulp.src(jsSources)
		.pipe(plumber({
      		errorHandler: onError
    	}))
		.pipe(concat('script.js'))
		.pipe(browserify())
		.pipe(gulpif(env === 'production', uglify()))
		.pipe(gulp.dest(outputDir + 'js'))
		.pipe(connect.reload())
});

gulp.task('css', function() {
	gulp.src('./components/sass/style.scss')
		.pipe(plumber({
      		errorHandler: onError
    	}))
   		.pipe(sourcemaps.init())
		.pipe(sass({
			includePaths: [config.bootstrapDir + '/assets/stylesheets']
		}))
		.pipe(autoprefixer('last 10 versions', 'ie 9'))
		.pipe(gulpif(env === 'production', minifycss()))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(outputDir + 'css'))
		.pipe(connect.reload())
});

gulp.task('fonts', function() {
    gulp.src(config.bootstrapDir + '/assets/fonts/**/*')
		.pipe(plumber({
      		errorHandler: onError
    	}))
    	.pipe(gulp.dest(outputDir + '/fonts'))
    	.pipe(connect.reload())
});

gulp.task('icons', function() { 
    gulp.src(config.bowerDir + '/fontawesome/fonts/**.*') 
		.pipe(plumber({
      		errorHandler: onError
    	}))
    	.pipe(gulp.dest(outputDir + '/fonts'))
    	.pipe(connect.reload())
});