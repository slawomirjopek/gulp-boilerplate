var gulp = require('gulp')
var sass = require('gulp-sass')
var del = require('del')

gulp.task('clean', function() {
  return del('./dist')
})

gulp.task('styles', function() {
  return gulp
    .src('./src/styles/*.scss')
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(gulp.dest('./dist'))
})

gulp.task('default', gulp.series('clean', gulp.parallel('styles')))
