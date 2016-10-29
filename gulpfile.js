'use strict';

var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var csso = require('gulp-csso');
var csscomb = require('gulp-csscomb');
var postcss = require('gulp-postcss');
var stripComments = require('postcss-discard-comments');
var del = require('del');
var pkg = require('./package.json');

// Config
var build = {
	css: './dist/assets/css',
	scss: './src/scss/'
};

var AUTOPREFIXER_BROWSERS = [
	'ie >= 11',
	'edge >= 20',
	'ff >= 40',
	'chrome >= 35',
	'safari >= 8',
	'opera >= 35',
	'ios >= 8'
];

var render = function (layer) {
	'use strict';

	var css = gulp
	.src(build.scss + layer + '.scss')
	.pipe(sourcemaps.init())
	.pipe(sass({
		precision: 10,
		onError: console.error.bind(console, 'Sass error:')
	}))
	.pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
	.pipe(rename({
		suffix: '.' + pkg.version,
		extname: '.css'
	}))
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest(build.css));

	return css;
};

gulp.task('core', function () {
	render('core');
});

gulp.task('utilities', function () {
	render('utilities');
});

gulp.task('clean', function () {
	del(['dist']);
});

gulp.task('minify', ['core', 'utilities'], function () {
	var css = gulp
	.src(build.css + '/*.' + pkg.version + '.css')
	.pipe(sourcemaps.init())
	.pipe(csso())
	.pipe(rename({
		suffix: '.min',
		extname: '.css'
	}))
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest(build.css));

	return css;
});

gulp.task('watch', function () {
	gulp.watch('src/scss/**/*.scss', ['core', 'utilities', 'minify']);
});

gulp.task('serve', ['watch']);
gulp.task('default', ['core', 'utilities', 'minify', 'watch']);
