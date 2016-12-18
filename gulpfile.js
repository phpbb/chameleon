'use strict';

var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var csso = require('gulp-csso');
var postcss = require('gulp-postcss');
var sorting = require('postcss-sorting');
// var stripComments = require('postcss-discard-comments');
var stylefmt = require('gulp-stylefmt');
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
	var css = gulp
	.src(build.scss + layer + '.scss')
	.pipe(sourcemaps.init())
	.pipe(sass({
		precision: 10,
		onError: console.error.bind(console, 'Sass error:')
	}))
	.pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
	.pipe(
		postcss([
			// stripComments(),
			sorting({
				'empty-lines-between-children-rules': 1,
				'empty-lines-between-media-rules': 1,
				'preserve-empty-lines-between-children-rules': true,
				'empty-lines-before-comment': true,
				'sort-order': 'sort-order'
			})
		])
	)
	.pipe(stylefmt())
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
