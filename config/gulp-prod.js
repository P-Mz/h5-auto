
const { series } = require('gulp');
const { clean, images, js, html, sass } = require('./gulp-base');


exports.default = series(clean, images, js, html, sass);