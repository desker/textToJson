var gulp = require('gulp'),
    $    = require('gulp-load-plugins')();

gulp.task('server', function() {
  gulp.src('.')
    .pipe($.webserver({
      livereload: true,
      fallback: './demo/index.html',
      directoryListing: true,
      open: true
    }));
});

gulp.task('build', function() {
  gulp.src('./src/textToJson.js')
    .pipe($.umd())
    .pipe(gulp.dest('./lib'))
    .pipe($.uglify())
    .pipe($.rename({ suffix: '.min' }))
    .pipe(gulp.dest('./lib'));
});

gulp.task('watch', ['build'], function(){
  gulp.watch('./src/textToJson.js', ['build']);
});

gulp.task('default', ['server', 'watch']);