var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
// var csswring = require('csswring');
var csso = require('gulp-csso');
var del = require('del');

// Config
var dist = {
    css: './dist/css',
    fonts: './dist/fonts',
    imgs: './dist/imgs',
    js: './dist/js'
};

var minify = 'true';

var AUTOPREFIXER_BROWSERS = [
  'ie >= 11',
  'edge >= 20',
  'ff >= 40',
  'chrome >= 35',
  'safari >= 8',
  'opera >= 35',
  'ios >= 8'
];

gulp.task('css', function () {
    'use strict';
    var css = gulp
        .src('./src/scss/core.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            precision: 10,
            onError: console.error.bind(console, 'Sass error:')
        }))
        .pipe(autoprefixer(AUTOPREFIXER_BROWSERS));

    if (minify) {
       css = css
       .pipe(csso())
       .pipe(rename('core.min.css'));
    }

    css = css
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(dist.css));

    return css;
});

gulp.task('clean', function() {
    'use strict';
    del(['dist']);
});

gulp.task('watch', function () {
    'use strict';
    gulp.watch('src/**/*.scss', ['css']);
});

gulp.task('serve', ['watch']);
gulp.task('default', ['css', 'watch']);
