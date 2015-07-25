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
  return gulp.src('./src/textToJson.js')
    .pipe($.umd())
    .pipe(gulp.dest('./lib'))
    .pipe($.uglify())
    .pipe($.rename({ suffix: '.min' }))
    .pipe(gulp.dest('./lib'));
});

gulp.task('watch', ['build', 'test-jasmine'], function(){
  gulp.watch('./src/textToJson.js', ['build']);
});

gulp.task('test-jasmine', function() {
  return gulp.src('./spec/test.js')
      .pipe($.jasminePhantom({
          //integration: true,
          keepRunner: true,
          includeStackTrace: true,
          vendor: ['lib/textToJson.js']
      }));
});

gulp.task('default', ['server', 'watch']);