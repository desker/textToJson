var gulp = require('gulp'),
    $    = require('gulp-load-plugins')();

gulp.task('server', function() {
  gulp.src('.')
    .pipe($.webserver({
      livereload: true,
      fallback: './demo/index.html',
      directoryListing: true
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

gulp.task('watch', ['test-jasmine'], function(){
  gulp.watch('./src/textToJson.js', ['test-jasmine']);
});

gulp.task('test-jasmine', ['build'], function() {
  return gulp.src('./spec/test.js')
    .pipe($.jasminePhantom({
      keepRunner: true,
      vendor: ['lib/textToJson.js']
    }));
});

gulp.task('default', ['server', 'watch']);