var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    csso = require('gulp-csso'),
    del = require('del');


// Config
var theme = {
    css: './dist/assets/css',
    fonts: './dist/assets/fonts',
    imgs: './dist/assets/imgs',
    js: './dist/assets/js'
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

var render = function(layer){
    'use strict';

    var css = gulp
        .src('./guide/assets/scss/' + layer + '.scss')
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
    }

    css = css
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(theme.css));

    return css;
};

gulp.task('css', function(){
    render('style');
});

gulp.task('theme', function(){
    render('theme');
});

gulp.task('core', function(){
    render('core');
});

gulp.task('utilities', function(){
    render('utilities');
});

gulp.task('components', function(){
    render('components');
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
