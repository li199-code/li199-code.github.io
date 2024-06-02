const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');
const uglify = require('gulp-uglify');
const plumber = require('gulp-plumber');

// Compress CSS files
gulp.task('minify-css', () => {
  return gulp.src('public/**/*.css')
    .pipe(plumber())
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(gulp.dest('public'));
});

// Compress HTML files
gulp.task('minify-html', () => {
  return gulp.src('public/**/*.html')
    .pipe(plumber())
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true,
      minifyJS: true,
      minifyCSS: true,
      ignoreCustomFragments: [ /<%[\s\S]*?%>/, /<\?[\s\S]*?\?>/ ]
    }))
    .pipe(gulp.dest('public'));
});

// Compress JS files
gulp.task('minify-js', () => {
  return gulp.src('public/**/*.js')
    .pipe(plumber())
    .pipe(uglify())
    .pipe(gulp.dest('public'));
});

// Default task to run all compression tasks
gulp.task('compress', gulp.parallel('minify-css', 'minify-html', 'minify-js'));
