var gulp = require('gulp');
var jade = require('gulp-jade');
var watch = require('gulp-watch');
gulp.task('default', function() {
  var YOUR_LOCALS = {};

  gulp.src('./lib/views/*.jade')
    .pipe(jade({
      locals: YOUR_LOCALS
    }))
    .pipe(gulp.dest('./'))
});

gulp.task('watch', function () {  
    watch('./lib/views/*.jade')
        .pipe(jade())
        .pipe(gulp.dest('./'));
});