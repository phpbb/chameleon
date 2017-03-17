'use strict';

var del = require('del');
var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var cssnano = require('gulp-cssnano');
var postcss = require('gulp-postcss');
var stylefmt = require('gulp-stylefmt');
var nunjucks = require('gulp-nunjucks-render');
var data = require('gulp-data');
var sorting = require('postcss-sorting');
var torem = require('postcss-pxtorem');
var moment = require('moment');
var sortOrder = require('./.postcss-sorting.json');
var pkg = require('./package.json');
var mock = require('./src/mock/index.json');

var manageEnvironment = function (environment) {
	environment.addFilter('moment', function (date, format, fromNow) {
		if (fromNow) {
			date = moment(date, format).fromNow();
		} else {
			date = moment(date, format);
		}

		return date;
	});
};

// Config
var build = {
	css: './dist/assets/css',
	docs: {
		scss: './docs/assets/scss/',
		css: './docs/assets/css/',
		html: './docs/'
	},
	twig: './src/views/',
	data: './src/mock/',
	scss: './src/scss/'
};

var AUTOPREFIXER_BROWSERS = [
	'ie >= 11',
	'edge >= 12',
	'ff >= 38',
	'chrome >= 35',
	'safari >= 8',
	'opera >= 35',
	'ios >= 8'
];

gulp.task('css', function () {
	var css = gulp
	.src(build.scss + '*.scss')
	.pipe(sourcemaps.init())
	.pipe(sass({
		indentType: 'tab',
		indentWidth: 1,
		outputStyle: 'expanded',
		precision: 10,
		onError: console.error.bind(console, 'Sass error:')
	}))
	.pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
	.pipe(
		postcss([
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
					'padding-bottom'],
				selectorBlackList: [],
				replace: true,
				mediaQuery: false,
				minPixelValue: 0
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
});

gulp.task('clean', function () {
	del(['dist']);
});

gulp.task('minify', ['css'], function () {
	var css = gulp
	.src(build.css + '/*.' + pkg.version + '.css')
	.pipe(sourcemaps.init())
	.pipe(cssnano())
	.pipe(rename({
		suffix: '.min',
		extname: '.css'
	}))
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest(build.css));

	return css;
});

gulp.task('docs:html', function () {
	var css = gulp
	.src(build.twig + '*.twig')
	.pipe(data(function () {
		mock.version = pkg.version;
		return mock;
	}))
	.pipe(nunjucks({
		path: [build.twig],
		manageEnv: manageEnvironment
	}))
	.pipe(rename({
		extname: '.html'
	}))
	.pipe(gulp.dest(build.docs.html));

	return css;
});

gulp.task('docs:css', function () {
	var css = gulp
	.src(build.docs.scss + '*.scss')
	.pipe(sourcemaps.init())
	.pipe(sass({
		indentType: 'tab',
		indentWidth: 1,
		outputStyle: 'expanded',
		precision: 10,
		onError: console.error.bind(console, 'Sass error:')
	}))
	.pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
	.pipe(
		postcss([
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
					'padding-bottom'],
				selectorBlackList: [],
				replace: true,
				mediaQuery: false,
				minPixelValue: 0
			})
		])
	)
	.pipe(stylefmt())
	.pipe(cssnano())
	.pipe(rename({
		suffix: '.' + pkg.version + '.min',
		extname: '.css'
	}))
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest(build.docs.css));

	return css;
});

gulp.task('watch', function () {
	gulp.watch('src/scss/**/*.scss', ['css', 'minify']);
	// gulp.watch('docs/assets/scss/**/*.scss', ['docs:css', 'minify']);
	// gulp.watch('src/views/**/*.twig', ['docs:html']);
	// gulp.watch('src/mock/**/*.json', ['docs:html']);
});

gulp.task('serve', ['watch']);
gulp.task('default', ['css', 'minify', 'watch']);
