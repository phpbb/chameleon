'use strict';

const fs = require('fs');
const del = require('del');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const moment = require('moment');
const gulp = require('gulp');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const nunjucks = require('gulp-nunjucks-render');
const beautify = require('gulp-beautify').html;
const removeLines = require('gulp-remove-empty-lines');
const merge = require('gulp-merge-json');
const postcss = require('gulp-postcss');
const sorting = require('postcss-sorting');
const torem = require('postcss-pxtorem');
const sortOrder = require('./.postcss-sorting.json');
const pkg = require('./package.json');

// Config
const theme = '';

const build = {
	css: './all/css',
	twig: './all/views/',
	scss: './all/scss/',
	data: './tests/mock/',
	html: './tests/views/',
};

const AUTOPREFIXER_BROWSERS = [
	'ie >= 11',
	'edge >= 12',
	'ff >= 38',
	'chrome >= 35',
	'safari >= 8',
	'opera >= 35',
	'ios >= 8',
];

if (theme) {
	build.css = './' + theme + '/css';
	build.twig = './' + theme + '/css';
}

const db = JSON.parse(fs.readFileSync(build.data + 'db/db.json'));

const manageEnvironment = function (environment) {
	environment.addFilter('moment', (date, format, fromNow) => {
		if (fromNow) {
			date = moment(date, format).fromNow();
		} else {
			date = moment(date, format);
		}

		return date;
	});

	environment.addFilter('icon', (icon, type, classlist, hidden = false, title = '') => {
		let source = '';
		let html;
		hidden = hidden ? hidden = 'true' : hidden = 'false';
		type = type.toLowerCase();
		if (type === 'svg') {
			title = title === '' ? '' : 'alt="' + title + '" ';
		} else {
			title = title === '' ? '' : 'title="' + title + '" ';
		}
		// $icon = icon.isArray() ? $this->get_first_icon($icon) : $icon;

		if (icon === '')		{
			return '';
		}

		if (type === 'iconify') {
			source = icon.split(':');
			source = source[0];
			html = `<span class="iconify o-icon o-icon-src-${source} ${classlist}" ${title}data-icon="${icon}" data-inline="false" aria-hidden="${hidden}"></span>`;
		} else if (type === 'inline') {
			let item = {};
			for (item in db.icons) {
				if (db.icons[item].name) {
					item = db.icons[item];
					if (item.name === icon) {
						html = `
							<svg class="${classlist}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="${hidden}" role="img">
								<path fill-rule="evenodd" d="${item.path}" />
							</svg>`;
					}
				}
			}
		} else if (type === 'svg') {
			html = `<img class="o-icon o-icon-svg ${classlist}" ${title}src="../svg/${icon}.svg" aria-hidden="${hidden}">`;
		}

		return html;
	});
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
			onError: console.error.bind(console, 'Sass error:'),
		}))
		.pipe(
			postcss([
				autoprefixer(AUTOPREFIXER_BROWSERS),
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
					selectorBlackList: [
						'c-post-title',
						'c-copy',
					],
					replace: true,
					mediaQuery: false,
					minPixelValue: 0,
				}),
			])
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
	del([ build.css, ]);
	del([ build.html, ]);
});

gulp.task('minify', gulp.series('css', () => {
	const css = gulp
		.src(build.css + '/*.' + pkg.version + '.css')
		.pipe(sourcemaps.init())
		.pipe(
			postcss([
				cssnano(),
			])
		)
		.pipe(rename({
			suffix: '.min',
			extname: '.css',
		}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(build.css));

	return css;
}));

gulp.task('data', () => {
	const json = gulp
		.src(build.data + '*.json')
		.pipe(merge({
			fileName: 'db.json',
		}))
		.pipe(gulp.dest(build.data + '/db/'));

	return json;
});

gulp.task('twig', gulp.series('data', () => {
	db.version = pkg.version;
	const html = gulp
		.src(build.twig + '*.twig')
		.pipe(nunjucks({
			data: db,
			path: [ build.twig, ],
			manageEnv: manageEnvironment,
			autoescape: false,
		}))
		/* eslint-disable camelcase */
		.pipe(beautify({
			indent_size: 1,
			indent_char: '	',
			indent_with_tabs: false,
			eol: '\n',
			end_with_newline: false,
			preserve_newlines: true,
			max_preserve_newlines: 10,
			indent_inner_html: true,
			brace_style: 'collapse',
			indent_scripts: 'normal',
			wrap_line_length: 0,
			wrap_attributes: 'auto',
			wrap_attributes_indent_size: 1,
			templating: 'django',
		}))
		/* eslint-enable camelcase */
		.pipe(removeLines())
		.pipe(rename({
			extname: '.html',
		}))
		.pipe(gulp.dest(build.html));

	return html;
}));

gulp.task('watch', () => {
	gulp.watch(build.scss + '**/*.scss', gulp.series('css', 'minify'));
	gulp.watch(build.twig + '**/*.twig', gulp.series('twig'));
	gulp.watch(build.data + '*.json', gulp.series('twig'));
});

gulp.task('serve', gulp.series('watch'));
gulp.task('test', gulp.series('css', 'minify', 'data', 'twig'));
gulp.task('default', gulp.series('css', 'minify', 'data', 'twig', 'watch'));
