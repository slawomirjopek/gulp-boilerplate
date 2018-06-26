var gulp = require('gulp')
var sass = require('gulp-sass')
var autoprefixer = require('gulp-autoprefixer')
var postcss = require('gulp-postcss')
var reporter = require('postcss-reporter')
var scssSyntax = require('postcss-scss')
var stylelint = require('stylelint')
var del = require('del')

gulp.task('clean', function() {
  return del('./dist')
})

gulp.task('styles', function() {
  return gulp
    .src([
      './src/styles/**/*.scss',
      '!./src/styles/vendor/**/*.scss'
    ])
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(gulp.dest('./dist'))
})

gulp.task("lint:styles", function() {
  var config = {
    "rules": {
      "block-no-empty": true,
      // TBA
    }
  }

  var processors = [
    stylelint(config),
    reporter({
      clearMessages: true,
      throwError: true
    })
  ]

  return gulp.src([
    './src/styles/**/*.scss',
    '!./src/styles/vendor/**/*.scss'
  ])
  .pipe(postcss(processors, {
    syntax: scssSyntax
  }));
})

gulp.task('default', gulp.series('clean', 'lint:styles', gulp.parallel('styles')))
