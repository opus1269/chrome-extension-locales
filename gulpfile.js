/*
 * Copyright (c) 2017, Michael A. Updike
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its
 * contributors may be used to endorse or promote products derived from this
 * software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
 * TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
 * PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF
 * USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE
 * USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
'use strict';

// paths and files
const base = {
	app: 'chrome-extension-locales',
	src: 'app/',
	dev: 'dev/',
};
const path = {
	scripts: base.src,
};
const files = {
    scripts: [path.scripts + '*.*', './gulpfile.js', './.eslintrc.js'],
};

const gulp = require('gulp');
const del = require('del');
const gutil = require('gulp-util');

// load the rest
const plugins = require('gulp-load-plugins')({
	pattern: ['gulp-*', 'gulp.*'],
	replaceString: /\bgulp[\-.]/,
});

// strip off filename path
const regex = new RegExp('^(.*?)' + base.app + '\\\\', 'g');

/**
 * Output filenames that changed
 * @param {Event} event
 */
function onChange(event) {
	const filename = gutil.colors.cyan(event.path.replace(regex, ''));
	const action = gutil.colors.magenta(event.type);
	gutil.log('File', filename, 'was', action);
}

// Default task - watch for changes in development
gulp.task('default', ['watch']);

// track changes in development
gulp.task('watch', ['lintjs'], function() {
    gulp.watch(files.scripts,
        ['lintjs']).on('change', onChange);
});

// clean output directories
gulp.task('clean', function() {
	return del(base.dev);
});

// lint Javascript
gulp.task('lintjs', function() {
	return gulp.src(files.scripts, {base: '.'})
		.pipe(plugins.changed(base.dev))
		.pipe(plugins.eslint())
		.pipe(plugins.eslint.format())
		.pipe(plugins.eslint.failAfterError())
        .pipe(gulp.dest(base.dev));
});
