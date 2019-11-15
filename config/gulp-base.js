
const { src, dest } = require('gulp');
const gulpScss = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const gulpBabel = require('gulp-babel');
const gulpBro = require('gulp-bro');
const gulpUglify = require('gulp-uglify');
const del = require('del');

// sass 编译
function sass() {
    return src(['src/index.scss', 'src/pages/**/*.scss'], { base: 'src' })
        .pipe(gulpScss({ outputStyle: 'compressed' }))
        .pipe(autoprefixer({
            borwsers: ['last 2 versions']
        }))
        .pipe(dest('dist'));
}

// html移动
function html() {
    return src(['src/index.html', 'src/pages/**/*.html'], { base: 'src' })
        .pipe(dest('dist'));
}

// js编译
function js() {
    return src(['src/index.js', 'src/pages/**/*.js'], { base: 'src' })
        .pipe(gulpBro())
        .pipe(gulpBabel({ presets: ['@babel/env'] }))
        .pipe(gulpUglify())
        .pipe(dest('dist'));
}

// 图片移动
function images() {
    return src('src/**/*.@(jpg|png|gif)')
        .pipe(dest('dist'));
}

// 清理dist文件夹
function clean(cb) {
    del.sync('dist/**');
    cb();
}

module.exports = {
    clean,
    images,
    js,
    html,
    sass
};