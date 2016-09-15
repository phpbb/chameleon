var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var csso = require('gulp-csso');
var csscomb = require('gulp-csscomb');
var twig = require('gulp-twig');
var data = require('gulp-data');
var del = require('del');
var path = require('path');

// Config
var build = {
    css: './dist/assets/css',
    docs: './docs',
    views: './docs/views/',
    scss: './src/scss/'
};

var minify = true;

var AUTOPREFIXER_BROWSERS = [
    'ie >= 11',
    'edge >= 20',
    'ff >= 40',
    'chrome >= 35',
    'safari >= 8',
    'opera >= 35',
    'ios >= 8'
];

var getJsonData = function (file) {
    return require('./template/json/' + path.basename(file.path) + '.json');
};

var render = function (layer) {
    'use strict';

    var css = gulp
        .src(build.scss + layer + '.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            precision: 10,
            onError: console.error.bind(console, 'Sass error:')
        }))
        .pipe(autoprefixer(AUTOPREFIXER_BROWSERS));

    if (minify) {
        css = css
            .pipe(csso())
            .pipe(rename({
                suffix: '.min',
                extname: '.css'
            }));
    } else {
        css = css
            .pipe(csscomb());
    }

    css = css
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(build.css));

    return css;
};

gulp.task('css', ['core', 'theme', 'utilities'], function () {
    render('style');
});

gulp.task('theme', function () {
    render('theme');
});

gulp.task('core', function () {
    render('core');
});

gulp.task('utilities', function () {
    render('utilities');
});

gulp.task('docs', function () {
    return gulp.src(build.views + '**/*.twig')
        .pipe(data(getJsonData))
        .pipe(twig())
        .pipe(gulp.dest(build.docs));
});

gulp.task('clean', function () {
    'use strict';
    del(['dist']);
});

gulp.task('watch', function () {
    'use strict';
    gulp.watch('src/scss/*.scss', ['css']);
});

gulp.task('serve', ['watch']);
gulp.task('default', ['css', 'watch']);
