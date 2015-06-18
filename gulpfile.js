// @TODO
// Make sure watch task is working

var gulp 			= require( 'gulp' ),
	gutil 			= require( 'gulp-util' ),
	concat 			= require( 'gulp-concat' ),
	browserify 		= require( 'gulp-browserify' ),
	sass 			= require( 'gulp-sass' ),
	sourcemaps		= require( 'gulp-sourcemaps' ),
	minifycss		= require( 'gulp-minify-css' ),
	connect 		= require( 'gulp-connect' ),
	gulpif 			= require( 'gulp-if' ),
	uglify 			= require( 'gulp-uglify' ),
	minifyhtml		= require( 'gulp-minify-html' ),
	autoprefixer	= require( 'gulp-autoprefixer' ),
	plumber			= require( 'gulp-plumber' ),
	jsonminify		= require( 'gulp-jsonminify' );

var paths = {
	config				: {
		bower 			: './bower_components',
		node 			: './node_modules'
	},
	dev 				: {
		base 			: './builds/development',
		images 			: './builds/development/images',
		css 			: './builds/development/css',
		js 				: './builds/development/js',
		fonts 			: './builds/development/fonts'
	},
	pub					: {
		base 			: './builds/production',
		css 			: './builds/production/css',
		js 				: './builds/production/js',
		fonts 			: './builds/production/fonts'
	},
	components 			: {
		base			: './components',
		sass 			: './components/sass',
		js 				: './components/scripts'
	},
	vendor				: {
		bootstrap 		: {
			base		: './bower_components/bootstrap-sass',
			images 		: './bower_components/bootstrap-sass/assets/images',
			css 		: './bower_components/bootstrap-sass/assets/stylesheets',
			js 			: './bower_components/bootstrap-sass/assets/javascripts',
			fonts 		: './bower_components/bootstrap-sass/assets/fonts'
		},
		fontawesome		: {
			base        : './bower_components/fontawesome',
			css 		: './bower_components/fontawesome/css',
			sass 		: './bower_components/fontawesome/scss',
			fonts 		: './bower_components/fontawesome/fonts'
		}

	}
};

var sources = {
	html 				: [paths.dev.base + '/*.html'],
	css 				: [paths.components.sass + '/style.scss'],
	js 					: [paths.components.js + '/*.js'],
	json 				: [paths.dev.js + '/*.json'],
	fonts 				: [paths.vendor.bootstrap.fonts + '/**.*'],
	icons 				: [paths.vendor.fontawesome.fonts + '/**.*']
};

var env = process.env.NODE_ENV || 'development';

var outputDir;
if( env === 'development' ) {
	outputDir = paths.dev.base;
} else {
	outputDir = paths.pub.base;
}

gulp.task( 'default', ['html', 'json', 'css', 'fonts', 'icons', 'js', 'connect', 'watch'] );

gulp.task( 'watch', function() {
	gulp.watch( sources.js, ['js'] );
	gulp.watch( 'components/sass/*.scss', ['css'] );
	gulp.watch( 'builds/development/*.html', ['html'] );
	gulp.watch( 'builds/development/*.json', ['json'] );
});

gulp.task( 'connect', function() {
	connect.server({
		root : outputDir,
		livereload : true
	});
});

gulp.task( 'html', function() {
	gulp.src( sources.html )
		.pipe( plumber({
      		errorHandler : onError
    	}))
		.pipe( gulpif( env === 'production', minifyhtml() ) )
		.pipe( gulpif( env === 'production', gulp.dest( outputDir ) ) )
		.pipe( connect.reload() );
	if( env === 'production' ) {
		logInfo( sources.html, outputDir );
	}
});

gulp.task( 'css', function() {
	gulp.src( sources.css )
		.pipe( plumber({
      		errorHandler : onError
    	}))
   		.pipe( sourcemaps.init() )
		.pipe( sass({
			includePaths : [paths.vendor.bootstrap.css]
		}))
		.pipe( autoprefixer( 'last 10 versions', 'ie 9' ) )
		.pipe( gulpif(env === 'production', minifycss() ) )
		.pipe( sourcemaps.write() )
		.pipe( gulp.dest( outputDir + '/css') )
		.pipe( connect.reload() );
	logInfo( sources.css, outputDir + '/css' );
});

gulp.task( 'js', function() {
	gulp.src( sources.js )
		.pipe( plumber({
      		errorHandler : onError
    	}))
		.pipe( concat( 'script.js' ) )
		.pipe( browserify() )
		.pipe( gulpif(env === 'production', uglify() ) )
		.pipe( gulp.dest( outputDir + '/js' ) )
		.pipe( connect.reload() );
	logInfo( sources.js, outputDir + '/js' );
});

gulp.task( 'json', function() {
	gulp.src( sources.json )
		.pipe( plumber({
      		errorHandler : onError
    	}))
		.pipe( gulpif( env === 'production', jsonminify() ) )
		.pipe( gulpif( env === 'production', gulp.dest( paths.pub.js ) ) )
		.pipe( connect.reload() );
	if( env === 'production' ) {
		logInfo( sources.json, paths.pub.js );
	}
});

gulp.task( 'fonts', function() {
    gulp.src( sources.fonts )
		.pipe( plumber({
      		errorHandler : onError
    	}))
    	.pipe( gulp.dest( outputDir + '/fonts') )
    	.pipe( connect.reload() );
	logInfo( sources.fonts, outputDir + '/fonts' );
});

gulp.task( 'icons', function() { 
    gulp.src( sources.icons ) 
		.pipe( plumber({
      		errorHandler : onError
    	}))
    	.pipe( gulp.dest( outputDir + '/fonts' ) )
    	.pipe( connect.reload() );
	logInfo( sources.icons, outputDir + '/fonts' );
});

var onError = function( err ) {  
	gutil.beep();
	console.log( err );
	this.emit( 'end' );
};

var logInfo = function( src, dest ) {
	gutil.log( gutil.colors.yellow( 'From: ' +  src ) );
	gutil.log( gutil.colors.yellow( 'To: ' +  dest ) );
};