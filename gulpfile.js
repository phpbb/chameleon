'use strict';

const fs = require('fs');
const gulp = require('gulp');
const moment = require('moment');
const nunjucks = require('gulp-nunjucks-render');
const rename = require('gulp-rename');
const merge = require('gulp-merge-json');
const pkg = require('./package.json');

// Config

const paths = {
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
		/* eslint-enable camelcase */
		.pipe(rename({
			extname: '.html',
		}))
		.pipe(gulp.dest(paths.twig.dest));
}

function watchAll() {
	gulp.watch(paths.twig.all, gulp.series(twig));
	gulp.watch(paths.data.src, gulp.series(data, twig));
}


exports.data = data;
exports.twig = twig;
exports.serve = watchAll;

exports.default = gulp.series(data, twig, watchAll);
