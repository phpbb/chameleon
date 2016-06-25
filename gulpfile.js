var fs = require('fs'),
    gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    csso = require('gulp-csso'),
    del = require('del'),
    gzip = require('gulp-gzip');


// Config
var dist = {
    css: './dist/assets/css',
    fonts: './dist/assets/fonts',
    imgs: './dist/assets/imgs',
    js: './dist/assets/js'
};

var src = {
    objs: './src/scss/object',
    comps: './src/scss/component'
};

var objects = fs.readdirSync(src.objs);
var components = fs.readdirSync(src.comps);


var minify = true;
var gzip = false;

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
        .src('src/scss/style.scss')
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

    if (gzip) {
       css = css
       .pipe(gzip())
       .pipe(rename('core.min.css.gz'));
    }

    css = css
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(dist.css));

    return css;
});

gulp.task('theme', function () {
    'use strict';
    var css = gulp
        .src('src/scss/theme.scss')
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

    if (gzip) {
       css = css
       .pipe(gzip())
       .pipe(rename('core.min.css.gz'));
    }

    css = css
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(dist.css));

    return css;
});

gulp.task('core', function () {
    'use strict';
    var css = gulp
        .src('src/scss/core.scss')
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

    if (gzip) {
       css = css
       .pipe(gzip())
       .pipe(rename('core.min.css.gz'));
    }

    css = css
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(dist.css));

    return css;
});

gulp.task('utilities', function () {
    'use strict';
    var css = gulp
        .src('src/scss/utilities.scss')
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

    if (gzip) {
       css = css
       .pipe(gzip())
       .pipe(rename('core.min.css.gz'));
    }

    css = css
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(dist.css));

    return css;
});

gulp.task('components', function () {
    'use strict';
    var css = gulp
        .src('src/scss/components.scss')
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

    if (gzip) {
       css = css
       .pipe(gzip())
       .pipe(rename('core.min.css.gz'));
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
