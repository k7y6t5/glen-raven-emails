/**
 * gulpfile.js
 */

var gulp = require('gulp');

var cache = require('gulp-cache'),
  del = require('del'),
  fs = require('fs'),
  imagemin = require('gulp-imagemin'),
  inlineCss = require('gulp-inline-css'),
  lazypipe = require('lazypipe'),
  notify = require('gulp-notify'),
  rename = require('gulp-rename'),
  replace = require('gulp-replace'),
  sass = require('gulp-sass'),
  siphon = require('siphon-media-query'),
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
  main_sass: 'styles.scss',
  main_css: 'styles.css',
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
 * Compile SASS into a single stylesheet
 *
 * Input: main SASS stylesheet containing @import rules
 * Output (ex): src/styles.css
 */
gulp.task('styles:sass', function() {
  return gulp.src(paths.src_css + '/' + files.main_sass)
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
 * STYLES:MQS
 *
 * Scrape compiled CSS for media query rules and inject into <head>
 *
 * Input (ex): src/styles.css
 * Output (ex): dist/index.html
 */
gulp.task('styles:mqs', ['styles:sass'], function() {
  var css = fs.readFileSync(dir.src + '/' + files.main_css).toString();
  var mqCss = siphon(css);

  return gulp.src(dir.src + '/' + files.main_html)
    .pipe(replace('<!-- <style> -->', `<style>\n${mqCss}\n\t</style>`))
    .pipe(gulp.dest(dir.dist))
    .on('error', function(err){
      displayError(err);
    })
    .pipe(notify({ message: 'Finished: styles:mqs', onLast: true }));
});

/**
 * @STYLES:INLINE
 *
 * Scrape compiled CSS and inline its rules onto the appropriate element(s)
 *
 * Input (ex): dist/index.html
 * Output (ex): dist/index.html
 */
gulp.task('styles:inline', ['styles:mqs'], function() {
 return gulp.src(dir.dist + '/' + files.main_html)
   .pipe(inlineCss({
     applyStyleTags: true,
     applyLinkTags: true,
     removeStyleTags: false,
     removeLinkTags: true
   }))
   .pipe(gulp.dest(dir.dist))
   .on('error', function(err){
     displayError(err);
   })
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
gulp.task('zip:images', ['images'], function() {
	return gulp.src(paths.dist_img + '/**/*')
		.pipe(zip(files.img_zip))
		.pipe(gulp.dest('./'))
    .pipe(notify({ message: 'Finished: zip:images', onLast: true }));
});

/**
 * @DEFAULT TASK
 */
gulp.task('default', ['styles:inline', 'images', 'plain']);
