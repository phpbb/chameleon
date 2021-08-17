'use strict';

const fs = require('fs');
const del = require('del');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss');
const sorting = require('postcss-sorting');
const torem = require('postcss-pxtorem');
const sortOrder = require('./.postcss-sorting.json');
const moment = require('moment');
const nunjucks = require('gulp-nunjucks-render');
const beautify = require('gulp-beautify').html;
const removeLines = require('gulp-remove-empty-lines');
const merge = require('gulp-merge-json');
const pkg = require('./package.json');

sass.compiler = require('node-sass');

// Config
// Config
const paths = {
	scss: {
		src: './all/scss/*.scss',
		all: './all/scss/**/*.scss',
		css: './all/css/*.' + pkg.version + '.css',
		dest: './all/css',
	},
	data: {
		src: './tests/mock/*.json',
		db: './tests/mock/db/db.json',
		dest: './tests/mock/db/',
	},
	twig: {
		src: './all/views/*.twig',
		all: './all/views/**/*.twig',
		views: './all/views/',
		dest: './tests/views/',
	},
	theme: '',
};

if (paths.theme) {
	paths.scss.dest = './' + paths.theme + '/css';
	paths.twig.dest = './' + paths.theme + '/views';
}

const manageEnvironment = function(environment) {
	environment.addFilter('moment', (date, format, fromNow) => {
		if (fromNow) {
			date = moment(date, format).fromNow();
		} else {
			date = moment(date, format);
		}

		return date;
	});

	environment.addFilter('numFormatter', number => {
		const SI_SYMBOL = [ '', 'k', 'M', 'G', 'T', 'P', 'E' ];

		// what tier? (determines SI symbol)
		const tier = Math.log10(number) / 3 | 0;

		if (tier === 0) {
			return number;
		}

		const suffix = SI_SYMBOL[tier];
		const scale = 10 ** (tier * 3);
		const scaled = number / scale;

		return scaled.toFixed(1) + suffix;
	});

	environment.addFilter('icon', (icon, type, classlist, hidden = false, title = '', viewbox = '0 0 24 24' ) => {
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
			html = `<span class="iconify o-icon o-icon-src-${source} ${classlist}" ${title} data-icon="${icon}" data-inline="false" aria-hidden="${hidden}"></span>`;
		} else if (type === 'inline') {
			let item = {};
			let db = JSON.parse(fs.readFileSync(paths.data.db));
			for (item in db.icons) {
				if (db.icons[item].name) {
					item = db.icons[item];
					if (item.name === icon) {
						html = `
							<svg class="${classlist}" viewBox="${viewbox}" xmlns="http://www.w3.org/2000/svg" aria-hidden="${hidden}" role="img">
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

function clean() {
	del([ paths.scss.dest ]);
	del([ paths.twig.dest ]);
}

function scss() {
	return gulp.src(paths.scss.src)
		.pipe(sourcemaps.init())
		.pipe(sass({
			indentType: 'tab',
			indentWidth: 1,
			outputStyle: 'expanded',
			precision: 10,
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
					selectorBlackList: [
						'c-post-title',
						'c-copy',
					],
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

function minify() {
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

function data() {
	return gulp.src(paths.data.src)
		.pipe(merge({
			fileName: 'db.json',
			edit: (parsedJson, file) => {
				parsedJson.version = pkg.version;
				return parsedJson;
			},
		}))
		.pipe(gulp.dest(paths.data.dest));

	let db = JSON.parse(fs.readFileSync(paths.data.db));
	db.version = pkg.version;
}

function twig() {
	let db = JSON.parse(fs.readFileSync(paths.data.db));

	return gulp.src(paths.twig.src)
		.pipe(nunjucks({
			data: db,
			path: [ paths.twig.views ],
			manageEnv: manageEnvironment,
			autoescape: false,
		}))
		/* eslint-disable camelcase */
		.pipe(beautify({
			indent_size: 1,
			indent_char: '	',
			indent_with_tabs: true,
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
		.pipe(gulp.dest(paths.twig.dest));
}

function watchAll() {
	gulp.watch(paths.scss.all, gulp.series(scss, minify));
	gulp.watch(paths.twig.all, gulp.series(twig));
	gulp.watch(paths.data.src, gulp.series(data, twig));
}

function watchCss() {
	gulp.watch(paths.scss.all, gulp.series(scss, minify));
}

exports.clean = clean;
exports.scss = scss;
exports.minify = minify;
exports.data = data;
exports.twig = twig;
exports.serve = watchCss;
exports.serve = watchAll;

exports.test = gulp.series(scss, minify, data, twig);
exports.css = gulp.series(scss, minify, watchCss);
exports.default = gulp.series(scss, minify, data, twig, watchAll);
