'use strict';

const del = require('del');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const gulp = require('gulp');
const sass = require('gulp-sass');
const chromatic = require('chromatic-sass');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const sorting = require('postcss-sorting');
const torem = require('postcss-pxtorem');
const sortOrder = require('./.postcss-sorting.json');
const pkg = require('./package.json');

sass.compiler = require('node-sass');

// Config
const build = {
	css: './dist/assets/css',
	html: './dist/views/',
	twig: './src/views/',
	data: './src/mock/',
	scss: './src/scss/',
	docs: './docs/_media/',
};

gulp.task('css', () => {
	const css = gulp
		.src(build.scss + '*.scss')
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
			]),
		)
		.pipe(rename({
			suffix: '.' + pkg.version,
			extname: '.css',
		}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(build.css));

	return css;
});

gulp.task('clean', () => {
	del([ 'dist' ]);
});

gulp.task('minify', gulp.series('css', () => {
	const css = gulp
		.src(build.css + '/*.' + pkg.version + '.css')
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
		.pipe(gulp.dest(build.css));

	return css;
}));

gulp.task('docs:css', () => {
	const css = gulp
		.src(build.docs + '*.scss')
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
			]),
		)
		.pipe(rename({
			suffix: '.' + pkg.version,
			extname: '.css',
		}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(build.docs));

	return css;
});

gulp.task('docs:minify', gulp.series('docs:css', () => {
	const css = gulp
		.src(build.docs + '/*.' + pkg.version + '.css')
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
		.pipe(gulp.dest(build.docs));

	return css;
}));

gulp.task('watch', () => {
	gulp.watch('src/scss/**/*.scss', gulp.series('css', 'minify'));
	gulp.watch('docs/media/**/*.scss', gulp.series('docs:css', 'docs:minify'));
});

gulp.task('serve', gulp.series('watch'));
gulp.task('test', gulp.series('css', 'minify'));
gulp.task('docs', gulp.series('docs:css', 'docs:minify'));
gulp.task('default', gulp.series('css', 'minify', 'watch'));
