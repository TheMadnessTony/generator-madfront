const gulp = require('gulp');
const browserSync = require('browser-sync').create(); // Advanced filewatcher & livereload plugin
const sass = require('gulp-sass'); // The sass compiler
const autoprefixer = require('gulp-autoprefixer'); // Automatic prefixing
const csso = require('gulp-csso'); // Minify css
const plumber = require('gulp-plumber'); // Tracking errors
const notify = require('gulp-notify'); // Improved notifications
const size = require('gulp-filesize'); // Shows the size of file
const uglify = require('gulp-uglify-es').default; // Minify JavaScript
const htmlmin = require('gulp-htmlmin'); // Minify HTML
const clean = require('gulp-clean'); // Clean directory
const imagemin = require('gulp-imagemin'); // Minify images

const reload = browserSync.reload; // Function for restarting the browser after changing files

// HTML
gulp.task('html', function () {
  return gulp.src('src/*.html')
    .pipe(plumber({
      errorHandler: notify.onError(function(err) {
        return {
          title: 'HTML',
          message: err.message
        };
      })
    }))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'))
});

// Styles
gulp.task('styles', function () {
  return gulp.src('src/scss/**/*.scss')
    .pipe(plumber({
      errorHandler: notify.onError(function(err) {
        return {
          title: 'Styles',
          message: err.message
        };
      })
    }))
    .pipe(csso())
    .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(gulp.dest('dist/css'))
    .pipe(size())
});

// JavaScript
gulp.task('scripts', function () {
  return gulp.src('src/js/**/*.js')
    .pipe(plumber({
      errorHandler: notify.onError(function(err) {
        return {
          title: 'Scripts',
          message: err.message
        };
      })
    }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(size())
});

// Images
gulp.task('images', function () {
  return gulp.src('src/images/**/*')
    .pipe(plumber({
      errorHandler: notify.onError(function(err) {
        return {
          title: 'Images',
          message: err.message
        };
      })
    }))
    .pipe(imagemin())
    .pipe(size())
    .pipe(gulp.dest('dist/images'))
});

// Fonts
gulp.task('fonts', function () {
  return gulp.src('src/fonts/**/*')
    .pipe(plumber({
      errorHandler: notify.onError(function(err) {
        return {
          title: 'Fonts',
          message: err.message
        };
      })
    }))
    .pipe(gulp.dest('dist/fonts'))
});

// Extras
gulp.task('extras', function () {
  return gulp.src([
    'src/*',
    '!src/*.html'
  ], {
    dot: true
  })
    .pipe(gulp.dest('dist'))
});

// Watcher for files
gulp.task('watch', function () {
  gulp.watch('src/**/*.html', gulp.series('html'));
  gulp.watch('src/scss/**/*.*', gulp.series('styles'));
  gulp.watch('src/js/**/*.*', gulp.series('scripts'));
  gulp.watch('src/images/**/*.*', gulp.series('images'));
  gulp.watch('src/fonts/**/*.*', gulp.series('fonts'));
  gulp.watch(['src/*', '!src/*.html'], gulp.series('extras'));
});

// Browser-sync ( dev server with reload if files was changed )
gulp.task('serve', function() {
  browserSync.init({
    server: 'dist'
  });

  browserSync.watch('./dist/**/*.*').on('change', browserSync.reload);
});

// Clean dist directory ( build )
gulp.task('clean', function () {
  return gulp.src('dist/*', {read: false})
    .pipe(clean());
});

// Build a production version
gulp.task('build', gulp.series('clean', gulp.parallel('html', 'styles', 'scripts', 'images', 'fonts', 'extras'), function () {
  return gulp.src('dist')
    .pipe(plumber({
      errorHandler: notify.onError(function(err) {
        return {
          title: 'Build',
          message: err.message
        };
      })
    }))
    .pipe(size())
    .pipe(notify('Build is done!'))
}));

// Dev server with auto-reloading after changing files
gulp.task('dev', gulp.series('build', gulp.parallel('watch', 'serve')));



