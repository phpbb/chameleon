'use strict';

const del = require('del');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const chromatic = require('chromatic-sass');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss');
const sorting = require('postcss-sorting');
const torem = require('postcss-pxtorem');
// const stylefmt = require('stylefmt');
const sortOrder = require('./.postcss-sorting.json');
const pkg = require('./package.json');

sass.compiler = require('node-sass');

// Config
const paths = {
	scss: {
		src: './src/scss/*.scss',
		all: './src/scss/**/*.scss',
		css: './dist/assets/css/*.' + pkg.version + '.css',
		dest: './dist/assets/css',
	},
	css: {
		src: './dist/assets/css/*.' + pkg.version + '.css',
		dest: './dist/assets/css',
	},
	docs: {
		src: './docs/_media/*.scss',
		css: './docs/_media/*.' + pkg.version + '.css',
		dest: './docs/_media/',
	},
};

function clean () {
	return del([ 'dist' ]);
}

function scss () {
	return gulp.src(paths.scss.src)
		.pipe(sourcemaps.init())
		.pipe(sass({
			indentType: 'tab',
			indentWidth: 1,
			outputStyle: 'expanded',
			precision: 10,
			functions: chromatic,
		}).on('error', sass.logError))
		.pipe(
			postcss([
				autoprefixer(),
				sorting(sortOrder),
				torem({
					rootValue: 16,
					unitPrecision: 7,
					propWhiteList: [
						'font',
						'font-size',
						'margin',
						'margin-left',
						'margin-right',
						'margin-top',
						'margin-bottom',
						'padding',
						'padding-left',
						'padding-right',
						'padding-top',
						'padding-bottom',
					],
					selectorBlackList: [],
					replace: true,
					mediaQuery: false,
					minPixelValue: 0,
				}),
				// stylefmt(),
			]),
		)
		.pipe(rename({
			suffix: '.' + pkg.version,
			extname: '.css',
		}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(paths.scss.dest));
}

function minify () {
	return gulp.src(paths.scss.css)
		.pipe(sourcemaps.init())
		.pipe(
			postcss([
				cssnano(),
			]),
		)
		.pipe(rename({
			suffix: '.min',
			extname: '.css',
		}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(paths.scss.dest));
}

function docs () {
	return gulp.src(paths.docs.src)
		.pipe(sourcemaps.init())
		.pipe(sass({
			indentType: 'tab',
			indentWidth: 1,
			outputStyle: 'expanded',
			precision: 10,
			functions: chromatic,
		}).on('error', sass.logError))
		.pipe(
			postcss([
				autoprefixer(),
				sorting(sortOrder),
				torem({
					rootValue: 16,
					unitPrecision: 7,
					propWhiteList: [
						'font',
						'font-size',
						'margin',
						'margin-left',
						'margin-right',
						'margin-top',
						'margin-bottom',
						'padding',
						'padding-left',
						'padding-right',
						'padding-top',
						'padding-bottom',
					],
					selectorBlackList: [],
					replace: true,
					mediaQuery: false,
					minPixelValue: 0,
				}),
				// stylefmt(),
			]),
		)
		.pipe(rename({
			suffix: '.' + pkg.version,
			extname: '.css',
		}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(paths.docs.dest));
}

function docsMinify () {
	return gulp.src(paths.docs.css)
		.pipe(sourcemaps.init())
		.pipe(
			postcss([
				cssnano(),
			]),
		)
		.pipe(rename({
			suffix: '.min',
			extname: '.css',
		}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(paths.docs.dest));
}

function watch () {
	gulp.watch(paths.scss.all, build);
	gulp.watch(paths.docs.src, build);
}

const build = gulp.series(scss, minify, docs, docsMinify);

exports.clean = clean;
exports.scss = scss;
exports.minify = minify;
exports.docs = docs;
exports.docsMinify = docsMinify;
exports.watch = watch;
exports.build = build;

exports.default = gulp.series(build, watch);
