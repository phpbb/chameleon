'use strict';

const fs = require('fs');
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
const merge = require('gulp-merge-json');
const sorting = require('postcss-sorting');
const torem = require('postcss-pxtorem');
const moment = require('moment');
const htmlBeautify = require('gulp-html-beautify');
const removeLines = require('gulp-remove-empty-lines');
const sortOrder = require('./.postcss-sorting.json');
const pkg = require('./package.json');

// Config
const AUTOPREFIXER_BROWSERS = [
	'ie >= 11',
	'edge >= 12',
	'ff >= 38',
	'chrome >= 35',
	'safari >= 8',
	'opera >= 35',
	'ios >= 8',
];

const theme = '';

const build = {
	css: './all/css',
	twig: './all/views/',
	scss: './all/scss/',
	data: './tests/mock/',
	html: './tests/views/',
};

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

	environment.addFilter('icon', (icon, type, classlist, hidden = false) => {
		let html;
		hidden = hidden ? hidden = 'true' : hidden = 'false';
		let item = {};
		for (item in db.icons) {
			if (db.icons[item].name) {
				item = db.icons[item];
				if (item.name === icon) {
					if (type === 'iconify' && item.lib !== 'mdi') {
						type = 'inline';
					}

					if (type === 'inline') {
						html = `
							<svg class="${classlist}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="${hidden}" role="img">
								<path fill-rule="evenodd" d="${item.path}" />
							</svg>`;
					} else if (type === 'iconify') {
						html = `<span class="iconify ${classlist}" data-icon="${item.lib}:${item.name}" data-inline="false" aria-hidden="${hidden}"></span>`;
					} else if (type === 'iconify-api') {
						html = `<img class="${classlist}" src="https://api.iconify.design/${item.lib}-${item.name}.svg" data-inline="false" aria-hidden="${hidden}"></span>`;
					} else {
						html = `<svg class="${classlist}" aria-hidden="${hidden}"><use xlink:href="#${item.name}"></use></svg>`;
					}

					return html;
				}
			}
		}
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
						'padding-bottom',
					],
					selectorBlackList: [],
					replace: true,
					mediaQuery: false,
					minPixelValue: 0,
				}),
			])
		)
		.pipe(stylefmt())
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

gulp.task('data', () => {
	const json = gulp
		.src(build.data + '*.json')
		.pipe(merge({
			fileName: 'db.json',
		}))
		.pipe(gulp.dest(build.data + '/db/'));

	return json;
});

gulp.task('minify', gulp.series('css', () => {
	const css = gulp
		.src(build.css + '/*.' + pkg.version + '.css')
		.pipe(sourcemaps.init())
		.pipe(cssnano())
		.pipe(rename({
			suffix: '.min',
			extname: '.css',
		}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(build.css));

	return css;
}));

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
		.pipe(htmlBeautify({
			indent_size: 1,
			indent_char: '	',
			eol: '\n',
			indent_level: 0,
			indent_with_tabs: false,
			preserve_newlines: true,
			max_preserve_newlines: 10,
			jslint_happy: false,
			space_after_anon_function: false,
			brace_style: 'collapse',
			keep_array_indentation: false,
			keep_function_indentation: false,
			space_before_conditional: true,
			break_chained_methods: false,
			eval_code: false,
			unescape_strings: false,
			wrap_line_length: 0,
			wrap_attributes: 'auto',
			wrap_attributes_indent_size: 4,
			end_with_newline: false,
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
