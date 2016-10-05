(function () {
    'use strict';
    //GULP & PLUGINS
    var gulp = require('gulp');
    var concat = require('gulp-concat');
    var connect = require('gulp-connect');
    var sequence = require('run-sequence');

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
                js: [],
                css: [
                    './app/assets/app.css'
                ]
            },
            vendor: {
                js: [
                    './node_modules/bootstrap-material-design/dist/js/material.min.js',
                    './node_modules/bootstrap-material-design/dist/js/ripples.min.js'
                ],
                css: [
                    './node_modules/bootstrap-material-design/dist/css/bootstrap-material-design.min.css',
                    './node_modules/bootstrap-material-design/dist/css/ripples.min.css'
                ]
            },
            dist: {
                js: "vendor.js",
                css: "vendor.css"
            }
        }
    };
    //TASKS
    /**
     * It concats all the js files
     */
    gulp.task('concat:js', function () {
        var allJS = config.files.vendor.js.concat(config.files.app.js);
        return gulp
            .src(allJS)
            .pipe(concat(config.files.dist.js))
            .pipe(gulp.dest(config.distFolder.base + config.distFolder.js))
    });
    /**
     * It concats all the css files
     */
    gulp.task('concat:css', function () {
        var allCss = config.files.vendor.css.concat(config.files.app.css);
        return gulp
            .src(allCss)
            .pipe(concat(config.files.dist.css))
            .pipe(gulp.dest(config.distFolder.base + config.distFolder.css))
    });
    /**
     * Copy files to the dist folder
     */
    gulp.task('copy', function () {
        var filesToCopy = [].concat(config.appFolder.base+config.index);
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
        sequence('concat:js', 'concat:css', 'copy');
    });
    /**
     * Watches all the app files
     */
    gulp.task('watch', function () {
        gulp.watch(config.files.app.css, ['watch:css']);
    });
    /**
     * Watches all the css
     */
    gulp.task('watch:css', function () {
       sequence('concat:css', 'connect:reload');
    });
    /**
     * Starts the development task
     */
    gulp.task('develop', function () {
        sequence('concat:js', 'concat:css', 'copy', 'connect', 'watch');
    });

}());
