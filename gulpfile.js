var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var csswring = require('csswring');
var del = require('del');

// Config
var dist = {
    css: './dist/css',
    fonts: './dist/fonts',
    imgs: './dist/imgs',
    js: './dist/js'
};

var minify = 'true';

var browsers = [
    'Chrome >= 35', // Exact version number here is kinda arbitrary
    'Firefox >= 40', // Current Firefox Extended Support Release (ESR)
    'Edge >= 12',
    'Explorer >= 11',
    'iOS >= 8',
    'Safari >= 8',
    'Android 2.3',
    'Android >= 4',
    'Opera >= 12'
];

gulp.task('css', function () {
    'use strict';
    var css = gulp
        .src('./src/base.less')
        .pipe(sourcemaps.init())
            .pipe(sass().on('error', sass.logError))
            .pipe(autoprefixer({ browsers: browsers }));

    if (minify) {
        css = css
        .pipe(csswring)
        .pipe(rename('base.min.css'));
    }

    return css
        .pipe(sourcemaps.write(dist.css))
        .pipe(gulp.dest(dist.css));
});

gulp.task('clean', function() {
    'use strict';
    del(['dist']);
});

gulp.task('serve', ['watch']);
