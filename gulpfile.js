// Load plugins
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
	rename			= require( 'gulp-rename' ),
	jsonminify		= require( 'gulp-jsonminify' );

// Paths object that contains all variables for paths/directories used in this file
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

// Sources object that contains variables for all paths/sources used in the gulp.src lines within gulp tasks
var sources = {
	html 				: [paths.dev.base + '/*.html'],
	css 				: [paths.components.sass + '/style.scss'],
	js 					: [paths.components.js + '/*.js'],
	json 				: [paths.dev.js + '/*.json'],
	fonts 				: [paths.vendor.bootstrap.fonts + '/**.*'],
	icons 				: [paths.vendor.fontawesome.fonts + '/**.*']
};

// Setup our environment variable to use what we set in Terminal or 'development' by default
// To set the variable in terminal to 'production', "use NODE_ENV=production gulp"
var env = process.env.NODE_ENV || 'development';

// Setup our output variable
// This determines whether or not we write to the development build or the production build
var outputDir;
if( env === 'development' ) {
	outputDir = paths.dev.base;
} else {
	outputDir = paths.pub.base;
}

// Setup our default gulp task that runs the specified tasks when "gulp" is entered in Terminal
gulp.task( 'default', ['html', 'json', 'css', 'fonts', 'icons', 'js', 'connect', 'watch'] );

// Create our "watch" task
// Whenever we edit and save any files that we are watching below, the associated tasks will run
gulp.task( 'watch', function() {
	gulp.watch( sources.js, ['js'] );
	gulp.watch( paths.components.sass + '/*.scss', ['css'] );
	gulp.watch( sources.html, ['html'] );
	gulp.watch( sources.json, ['json'] );
});

// Create our "connect" task to start our server for live reload
gulp.task( 'connect', function() {
	connect.server({
		root : outputDir,
		livereload : true
	});
});

// Create our "html" task
// When run in 'production' mode, we'll get a minified version of our html files
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

// Create our "css" task
// We compile our sass partials here, autoprefix them, create our sourcemaps,
// and minify if this is being run in 'production' mode
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
		//.pipe( gulpif( env === 'production', rename( { suffix : '.min' } ) ) )
		.pipe( gulpif( env === 'production', minifycss() ) )
		.pipe( sourcemaps.write() )
		.pipe( gulp.dest( outputDir + '/css') )
		.pipe( connect.reload() );
	logInfo( sources.css, outputDir + '/css' );
});

// Create our "js" task
// First we pull all our js files into one file with concat, pull in required libraries through browserify,
// then uglify if we're running in 'production' mode
gulp.task( 'js', function() {
	gulp.src( sources.js )
		.pipe( plumber({
      		errorHandler : onError
    	}))
		.pipe( concat( 'script.js' ) )
		.pipe( browserify() )
		//.pipe( gulpif( env === 'production', rename( { suffix : '.min' } ) ) )
		.pipe( gulpif(env === 'production', uglify() ) )
		.pipe( gulp.dest( outputDir + '/js' ) )
		.pipe( connect.reload() );
	logInfo( sources.js, outputDir + '/js' );
});

// Create our "json" task
// When running in 'production' mode, we minify our json before writing
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

// Create our "fonts" task to move fonts from their vendor libraries to the appropriate build dir
gulp.task( 'fonts', function() {
    gulp.src( sources.fonts )
		.pipe( plumber({
      		errorHandler : onError
    	}))
    	.pipe( gulp.dest( outputDir + '/fonts') )
    	.pipe( connect.reload() );
	logInfo( sources.fonts, outputDir + '/fonts' );
});

// Create our "icons" task to move fonts from their vendor libraries to the appropriate build dir
gulp.task( 'icons', function() { 
    gulp.src( sources.icons ) 
		.pipe( plumber({
      		errorHandler : onError
    	}))
    	.pipe( gulp.dest( outputDir + '/fonts' ) )
    	.pipe( connect.reload() );
	logInfo( sources.icons, outputDir + '/fonts' );
});

// Error handling function used by gulp-plubmer
var onError = function( err ) {  
	gutil.beep();
	console.log( err );
	this.emit( 'end' );
};

// Function for writing additional color-coded debug information to Terminal
var logInfo = function( src, dest ) {
	gutil.log( gutil.colors.yellow( 'From: ' +  src ) );
	gutil.log( gutil.colors.yellow( 'To: ' +  dest ) );
};