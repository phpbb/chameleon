'use strict';

// Plugins
var gulp            = require('gulp'),
    es              = require('event-stream'),
    plugins         = require('gulp-load-plugins')();

// Dir Variables
var assetsDir   = 'assets/',
    lessDir     = assetsDir + 'less/',
    cssDir      = assetsDir + 'css/',
    cssminDir   = './' + cssDir,
    htmlDir     = './' + 'views/',
    imgDir      = assetsDir + 'imgs/';

// Functions
var customReporter = function (file) {
    plugins.util.log(
        plugins.util.colors.cyan(file.csslint.errorCount)
        + ' errors in '
        + plugins.util.colors.magenta(file.path)
    );

    file.csslint.results.forEach(function(result) {
        plugins.util.log(
            plugins.util.colors.red(result.error.message)
            + ' on line '
            + plugins.util.colors.green(result.error.line)
        );
    });
};

// Tasks
gulp.task('html:index', function () {
    var htmlStream = plugins.twig({
        strict_variables: false,
        data: require('./views/global.json')
    });

    htmlStream.on('error', function (err) {
        plugins.util.log(plugins.util.colors.red.bold('INDEX - TWIG error:'), err.message);
    });

    var PrettifyStream = plugins.htmlPrettify({indent_char: ' ', indent_size: 4});

    PrettifyStream.on('error', function (err) {
        plugins.util.log(plugins.util.colors.red.bold('Prettify error:'), err.message);
    });

    var stream = gulp.src(htmlDir + 'index.twig');
    stream = stream
                .pipe(htmlStream)
                .pipe(PrettifyStream)
                .pipe(plugins.notify({
                    'message': 'HTML: index.html Generated!',
                    'onLast': true
                }));

    stream.pipe(gulp.dest('./'));
});

gulp.task('html:test', function () {
    var htmlStream = plugins.twig({
        strict_variables: false,
        data: require('./views/global.json')
    });

    htmlStream.on('error', function (err) {
        plugins.util.log(plugins.util.colors.red.bold('TEST - TWIG error:'), err.message);
    });

    var PrettifyStream = plugins.htmlPrettify({indent_char: ' ', indent_size: 4});

    PrettifyStream.on('error', function (err) {
        plugins.util.log(plugins.util.colors.red.bold('Prettify error:'), err.message);
    });

    var stream = gulp.src(htmlDir + 'tests/**/*.twig');

    stream = stream
                .pipe(htmlStream)
                .pipe(PrettifyStream)
                .pipe(plugins.notify({
                    'message': 'HTML: tests Generated!',
                    'onLast': true
                }));

    stream.pipe(gulp.dest('./tests'));
});

gulp.task('css:build', function () {
    var stream = gulp.src([
                            lessDir + 'style.less',
                            lessDir + 'core.less',
                            lessDir + 'theme.less'
                        ]);

    stream = stream
                .pipe(plugins.sourcemaps.init())
                .pipe(plugins.less()).pipe(plugins.notify({'message': 'LESS: Rendered!','onLast': true}))
                .pipe(plugins.csscomb('csscomb.json')).pipe(plugins.notify({'message': 'CSS: Sorted!','onLast': true}))
                .pipe(plugins.sourcemaps.write('./'))
                .pipe(plugins.notify({'message': 'CSS: Maped!','onLast': true}));

    stream.pipe(gulp.dest('./dist/' + cssDir));
});

gulp.task('css:minify', function () {
    var stream = gulp.src([
                            './dist/' + cssDir + 'style.css',
                            './dist/' + cssDir + 'core.css',
                            './dist/' + cssDir + 'theme.css'
                        ]);

    stream = stream
                .pipe(plugins.minifyCss({
                    keepBreaks: false,
                    processImport: true,
                    noAdvanced: false
                }))
                .pipe(plugins.rename({dirname: 'min', suffix: '.min'}))
                .pipe(plugins.notify({'message': 'CSS: Minified!','onLast': true}));

    stream.pipe(gulp.dest('./dist/' + cssminDir));
});

gulp.task('img:crush', function () {
    var imgStream = plugins.imagemin({
                        progressive: true,
                        interlaced: true
                    });

    imgStream.on('error', function (err) {
        plugins.util.log(plugins.util.colors.red.bold('Image error:'), err.message);
    });

    var stream = gulp.src(imgDir + '*.png');

    stream = stream
                .pipe(plugins.cache(imgStream))
                .pipe(plugins.notify({
                    'message': 'IMAGES: Crushed!',
                    'onLast': true
                }));

    stream.pipe(gulp.dest('./dist/' + imgDir));
});

gulp.task('lint:core', function () {
    gulp.src(cssDir + 'core.css')
        .pipe(plugins.csslint('csslintrc.json'))
        .pipe(plugins.csslint.reporter(customReporter));
});

gulp.task('lint:theme', function () {
    gulp.src(cssDir + 'theme.css')
        .pipe(plugins.csslint('csslintrc.json'))
        .pipe(plugins.csslint.reporter(customReporter));
});

gulp.task('watch', function () {
    gulp.watch(htmlDir + '**/*.*', ['html:index', 'html:test']);
    gulp.watch(lessDir + '**/*.less', ['css:build']);
    gulp.watch('./dist/' + cssDir + '/*.css', ['css:minify']);
    gulp.watch(imgDir + '**/*.*', ['img:crush']);
});

gulp.task('default', ['css:build', 'html:index', 'html:test', 'watch']);
