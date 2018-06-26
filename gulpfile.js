const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const postcss = require('gulp-postcss');
const reporter = require('postcss-reporter');
const scssSyntax = require('postcss-scss');
const stylelint = require('stylelint');
const del = require('del');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const gulpIf = require('gulp-if');
const uglify = require('gulp-uglify');

const TYPES = {
  STYLES: 'styles',
  SCRIPTS: 'scripts',
  DIST: 'dist',
  EXT_STYLES: 'scss',
  EXT_SCRIPTS: 'js',
};

const config = { src: {} };
config.src[TYPES.STYLES] = './src/styles';
config.src[TYPES.SCRIPTS] = './src/scripts';
config.src[TYPES.DIST] = './dist';

function getSrc(folder, ext, disableVendor, additionalRules) {
  const src = [`${config.src[folder]}/**/*.${ext}`];
  if (disableVendor) src.push(`!${config.src[folder]}/vendor/**/*.${ext}`);
  if (additionalRules && Array.isArray(additionalRules)) src.concat(additionalRules);
  return src;
}

function isFixed(file) {
  return file.eslint != null && file.eslint.fixed;
}

gulp.task('clean', () => del('./dist'));

gulp.task('styles', () => gulp
  .src(getSrc(TYPES.STYLES, TYPES.EXT_STYLES))
  .pipe(autoprefixer({
    browsers: ['last 2 versions'],
    cascade: false,
  }))
  .pipe(sass({
    outputStyle: 'compressed',
  }))
  .pipe(gulp.dest(config.src.dist)));

gulp.task('scripts', () => gulp
  .src(getSrc(TYPES.SCRIPTS, TYPES.EXT_SCRIPTS))
  .pipe(babel({
    presets: ['env'],
  }))
  .pipe(uglify())
  .pipe(gulp.dest(config.src.dist)));

gulp.task('lint:styles', () => {
  const stylelintConfig = {
    rules: {
      'block-no-empty': true,
      // TBA
    },
  };

  const processors = [
    stylelint(stylelintConfig),
    reporter({
      clearMessages: true,
      throwError: true,
    }),
  ];

  return gulp.src(getSrc(TYPES.STYLES, TYPES.EXT_STYLES))
    .pipe(postcss(processors, {
      syntax: scssSyntax,
    }));
});

gulp.task('lint:scripts', () => gulp
  .src(getSrc(TYPES.SCRIPTS, TYPES.EXT_SCRIPTS, true, ['!node_modules/**']))
  .pipe(eslint({
    fix: true,
  }))
  .pipe(eslint.format())
  .pipe(gulpIf(isFixed, gulp.dest(config.src.scripts)))
  .pipe(eslint.failAfterError()));

gulp.task('default', gulp.series('clean', 'lint:styles', 'lint:scripts', gulp.parallel('styles', 'scripts')));
