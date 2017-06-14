'use strict';

const fs = require('fs');
const path = require('path');
const del = require('del');
const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('gulp-cssnano');
const postcss = require('gulp-postcss');
const stylefmt = require('gulp-stylefmt');
const nunjucks = require('gulp-nunjucks-render');
const data = require('gulp-data');
const sorting = require('postcss-sorting');
const torem = require('postcss-pxtorem');
const moment = require('moment');
const sortOrder = require('./.postcss-sorting.json');
const pkg = require('./package.json');

const manageEnvironment = function (environment) {
	environment.addFilter('moment', (date, format, fromNow) => {
		if (fromNow) {
			date = moment(date, format).fromNow();
		} else {
			date = moment(date, format);
		}

		return date;
	});
};

// Config
const build = {
	css: './dist/assets/css',
	html: './dist/views/',
	twig: './src/views/',
	data: './src/mock/',
	scss: './src/scss/'
};

const AUTOPREFIXER_BROWSERS = [
	'ie >= 11',
	'edge >= 12',
	'ff >= 38',
	'chrome >= 35',
	'safari >= 8',
	'opera >= 35',
	'ios >= 8'
];

gulp.task('css', () => {
	const css = gulp
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

gulp.task('clean', () => {
	del(['dist']);
});

gulp.task('minify', ['css'], () => {
	const css = gulp
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

gulp.task('twig', () => {
	const css = gulp
	.src(build.twig + '*.twig')
	.pipe(data(file => {
		const data = JSON.parse(fs.readFileSync(build.data + path.basename(file.path, '.twig') + '.json'));
		data.version = pkg.version;
		return data;
	}))
	.pipe(nunjucks({
		path: [build.twig],
		manageEnv: manageEnvironment
	}))
	.pipe(rename({
		extname: '.html'
	}))
	.pipe(gulp.dest(build.html));

	return css;
});

gulp.task('docs:css', () => {
	const css = gulp
	.src(build.docs + '*.scss')
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
	.pipe(gulp.dest(build.docs));

	return css;
});

gulp.task('setup:settings', () => {
	const settings = gulp
	.src('node_modules/base-l.settings/*.scss')
	.pipe(gulp.dest('src/scss/settings/'));

	return settings;
});

gulp.task('setup:mixins', () => {
	const mixins = gulp
		.src('node_modules/base-l.tools/mixin/*.scss')
		.pipe(gulp.dest('src/scss/tools/mixin/'));

	return mixins;
});

gulp.task('setup:functions', () => {
	const funcitons = gulp
		.src('node_modules/base-l.tools/function/*.scss')
		.pipe(gulp.dest('src/scss/tools/function/'));

	return funcitons;
});

gulp.task('watch', () => {
	gulp.watch('src/scss/**/*.scss', ['css', 'minify']);
	gulp.watch('src/views/**/*.twig', ['twig']);
	gulp.watch('src/mock/**/*.json', ['twig']);
});

gulp.task('setup', ['setup:settings', 'setup:mixins', 'setup:functions']);
gulp.task('serve', ['watch']);
gulp.task('test', ['css', 'minify', 'twig']);
gulp.task('default', ['css', 'minify', 'twig', 'watch']);
