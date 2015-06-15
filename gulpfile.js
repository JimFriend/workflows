var gulp 	= require('gulp'),
	gutil 	= require('gulp-util'),
	coffee 	= require('gulp-coffee');

var coffeeSources = ['components/coffee/*.coffee'];

gulp.task('coffee', function() {
	gulp.src(coffeeSources)
		.pipe(coffee())
			.on('error', gutil.log)
		.pipe(gulp.dest('components/scripts'));
});