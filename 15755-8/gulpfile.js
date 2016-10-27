/**
 * gulpfile.js
 */

var gulp = require('gulp');

var cache = require('gulp-cache'),
  del = require('del'),
  imagemin = require('gulp-imagemin'),
  inlineCss = require('gulp-inline-css'),
  notify = require('gulp-notify'),
  rename = require('gulp-rename'),
  sass = require('gulp-sass'),
  zip = require('gulp-zip');

/**
 * @CONFIG
 */
var dir = {
  src: 'src',
  dist: 'dist',
};

var paths = {
  src_css: dir.src + '/sass',
  src_img: dir.src + '/images',
  dist_img: dir.dist + '/images',
};

var files = {
  main_css: 'styles.scss',
  main_html: 'index.html',
  main_zip: 'html.zip',
  img_zip: 'images.zip',
  plain_txt: 'plain.txt',
};

/**
 * @ERRORS
 *
 * http://www.mikestreety.co.uk/blog/a-simple-sass-compilation-gulpfilejs
 */
var displayError = function(error) {
  var errorString = '[' + error.plugin + ']';
  errorString += ' ' + error.message.replace("\n", '');

  if (error.fileName) {
    errorString += ' in ' + error.fileName;
  }

  if (error.lineNumber) {
    errorString += ' on line ' + error.lineNumber;
  }

  console.error(errorString);
}

/**
 * @CLEAN
 *
 * Delete previous files
 */
gulp.task('clean', function(cb) {
  del([
    dir.dist,
  ], cb);
});

/**
 * @STYLES:SASS
 *
 * This outputs to the src directory for reference only.
 * The resulting CSS file will then be run through our Inline task.
 * Make sure that the resulting CSS file is correctly referenced in your index.html <link> element.
 */
gulp.task('styles:sass', function() {
  return gulp.src(
    [
      paths.src_css + '/' + files.main_css,
    ])
    .pipe(sass(
      {
        errLogToConsole: true,
        outputStyle: 'expanded',
        sourceComments: false,
      }))
    .pipe(rename(
      {
        extname: '.css'
      }))
    .pipe(gulp.dest(dir.src))
    .on('error', function(err){
      displayError(err);
    })
    .pipe(notify({ message: 'Finished: styles:sass', onLast: true }));
});

/**
 * @INLINE
 *
 * Inline CSS
 */
gulp.task('styles:inline', ['styles:sass'], function() {
  return gulp.src(dir.src + '/' + files.main_html)
    .pipe(inlineCss({
      applyStyleTags: true,
      applyLinkTags: true,
      removeStyleTags: false,
      removeLinkTags: true
    }))
    .pipe(gulp.dest(dir.dist))
    .pipe(notify({ message: 'Finished: styles:inline', onLast: true }));
});

/**
 * @IMAGES
 *
 * optimizationLevel set to 0 to disable optimization.
 * use ImageOptim to avoid having to compress on every re-gulp.
 * We still want to make images progressive and interlaced.
 */
gulp.task('images', function() {
  return gulp.src(
    [
      paths.src_img + '/**/*.gif',
      paths.src_img + '/**/*.jpg',
      paths.src_img + '/**/*.png',
    ])
    .pipe(cache(imagemin(
      {
        optimizationLevel: 0,
        progressive: true,
        interlaced: true,
      }
    )))
    .pipe(gulp.dest(paths.dist_img))
    .pipe(notify({ message: 'Finished: images', onLast: true }));
});

/**
 * @PLAIN
 *
 * Pipe the plain text file over to dist
 */
gulp.task('plain', function() {
  return gulp.src(
    [
      dir.src + '/' + files.plain_txt,
    ])
    .pipe(gulp.dest(dir.dist))
    .pipe(notify({ message: 'Finished: plain', onLast: true }));
});

/**
 * @ZIP
 *
 * Zip all files in dist
 */
gulp.task('zip', ['default'], function() {
	return gulp.src(dir.dist + '/**/*')
		.pipe(zip(files.main_zip))
		.pipe(gulp.dest('./'))
    .pipe(notify({ message: 'Finished: zip', onLast: true }));
});

/**
 * @ZIP:IMAGES
 *
 * Zip only dist images
 */
gulp.task('zip:images', ['default'], function() {
	return gulp.src(paths.dist_img + '/**/*')
		.pipe(zip(files.img_zip))
		.pipe(gulp.dest('./'))
    .pipe(notify({ message: 'Finished: zip:images', onLast: true }));
});

/**
 * @DEFAULT TASK
 */
gulp.task('default', ['styles:inline', 'images', 'plain']);
