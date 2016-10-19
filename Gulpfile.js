(function () {
    'use strict';
    //GULP & PLUGINS
    var gulp = require('gulp');
    var concat = require('gulp-concat');
    var connect = require('gulp-connect');
    var sequence = require('run-sequence');
    var streamqueue = require('streamqueue');

    //CONFIGURATIONS
    var config = {
        index: "index.html",
        appFolder: {
            base: "./app/"
        },
        distFolder: {
            base: "./dist/",
            css: "css",
            js: "js"
        },
        files: {
            app: {
                js: [
                    './app/app.js',
                    './app/home/home.module.js',
                    './app/home/home.controller.js',
                    './app/location/location.module.js',
                    './app/location/location.service.js',
                    './app/openweather/openweather.module.js',
                    './app/openweather/openweather.service.js',
                    './app/widgets/widgets.module.js',
                    './app/widgets/modal/modal.directive.js',
                    './app/util/util.module.js',
                    './app/util/util.service.js'
                ],
                css: [
                    './app/assets/app.css'
                ]
            },
            vendor: {
                js: [
                    './node_modules/angular/angular.js',
                    './node_modules/angular-ui-router/release/angular-ui-router.js',
                    './node_modules/jquery/dist/jquery.min.js',
                    './node_modules/bootstrap/dist/js/bootstrap.min.js',
                    './node_modules/bootstrap-material-design/dist/js/material.min.js',
                    './node_modules/bootstrap-material-design/dist/js/ripples.min.js'
                ],
                css: [
                    './node_modules/bootstrap/dist/css/bootstrap.min.css',
                    './node_modules/bootstrap-material-design/dist/css/bootstrap-material-design.min.css',
                    './node_modules/bootstrap-material-design/dist/css/ripples.min.css',
                    './app/assets/font/weather-icons.min.css',
                    './app/assets/font/weather-icons-wind.min.css'
                ]
            },
            dist: {
                vendor: {
                    js: "vendor.js",
                    css: "vendor.css"
                },
                app: {
                    js: "app.js",
                    css: "app.css"
                }
            }
        }
    };
    //TASKS
    /**
     * It concats all the js files
     */
    gulp.task('concat:js', function () {
        sequence('concat:js:vendor', 'concat:js:app');
    });
    /**
     * It concats all vendor JS
     */
    gulp.task('concat:js:vendor', function () {
        var allVendorJS = config.files.vendor.js;
        return gulp
            .src(allVendorJS)
            .pipe(concat(config.files.dist.vendor.js))
            .pipe(gulp.dest(config.distFolder.base + config.distFolder.js))
    });
    /**
     * It concats all App JS
     */
    gulp.task('concat:js:app', function () {
        var allAppJS = config.files.app.js;
        return streamqueue({objectMode: true}, gulp.src(allAppJS))
            .pipe(concat(config.files.dist.app.js))
            .pipe(gulp.dest(config.distFolder.base + config.distFolder.js));
    });
    /**
     * It concats all the css files
     */
    gulp.task('concat:css', function () {
        sequence('concat:css:vendor', 'concat:css:app');
    });
    /**
     * It concats all the vendor css files
     */
    gulp.task('concat:css:vendor', function () {
        var allVendorCss = config.files.vendor.css;
        return gulp
            .src(allVendorCss)
            .pipe(concat(config.files.dist.vendor.css))
            .pipe(gulp.dest(config.distFolder.base + config.distFolder.css))
    });
    /**
     * It concats all the app css files
     */
    gulp.task('concat:css:app', function () {
        var allAppCss = config.files.app.css;
        return gulp
            .src(allAppCss)
            .pipe(concat(config.files.dist.app.css))
            .pipe(gulp.dest(config.distFolder.base + config.distFolder.css))
    });
    /**
     * Copy files to the dist folder
     */
    gulp.task('copy:html', function () {
        var filesToCopy = [].concat([config.appFolder.base+config.index, config.appFolder.base + '**/*.html']);
        return gulp
            .src(filesToCopy)
            .pipe(gulp.dest(config.distFolder.base));
    });
    /**
     * Copy the font files to the dist folder
     */
    gulp.task('copy:fonts', function () {
       var filesToCopy = [
           './app/assets/font/weathericons-regular-webfont.eot',
           './app/assets/font/weathericons-regular-webfont.svg',
           './app/assets/font/weathericons-regular-webfont.ttf',
           './app/assets/font/weathericons-regular-webfont.woff',
           './app/assets/font/weathericons-regular-webfont.woff2'
       ];
        return gulp
            .src(filesToCopy)
            .pipe(gulp.dest(config.distFolder.base+config.distFolder.css));
    });
    /**
     * Copy the json assets
     */
    gulp.task('copy:json', function () {
        var filesToCopy = ['./app/assets/**/*.json'];
        return gulp
            .src(filesToCopy)
            .pipe(gulp.dest(config.distFolder.base));
    });
    /**
     * Starts the development server
     */
    gulp.task('connect', function () {
        connect.server({
            root: './dist',
            livereload: true
        });
    });
    /**
     * Reloads the development server
     */
    gulp.task('connect:reload', function () {
        gulp.src(config.distFolder.base).pipe(connect.reload());
    });
    /**
     * Builds the app for production/development
     */
    gulp.task('build', function () {
        sequence('concat:js', 'concat:css', 'copy:html','copy:json', 'copy:fonts');
    });
    /**
     * Watches all the app files
     */
    gulp.task('watch', function () {
        gulp.watch(config.files.app.css, ['watch:css']);
        gulp.watch(config.files.app.js, ['watch:js'])
        gulp.watch(config.appFolder.base + '**/*.html', ['watch:html']);
    });
    /**
     * Watches all the css
     */
    gulp.task('watch:js', function () {
        sequence('concat:js', 'connect:reload');
    });
    /**
     * Watches all the css
     */
    gulp.task('watch:css', function () {
       sequence('concat:css', 'connect:reload');
    });
    /**
     * Watches all the html
     */
    gulp.task('watch:html', function () {
        sequence('copy:html', 'connect:reload');
    });
    /**
     * Starts the development task
     */
    gulp.task('develop', function () {
        sequence('build', 'connect', 'watch');
    });

}());
