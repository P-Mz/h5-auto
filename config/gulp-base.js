
const { src, dest } = require('gulp');
const gulpScss = require('gulp-sass');
const autoprefixer = require('autoprefixer');
const gulpBabel = require('gulp-babel');
const gulpBro = require('gulp-bro');
const gulpUglify = require('gulp-uglify');
const del = require('del');
const through2 = require('through2');
const path = require('path');
const fs = require('fs');
const postcss = require('gulp-postcss');
const postcssPxtorem = require('postcss-pxtorem');
const gulpRev = require('gulp-rev');
const gulpIf = require('gulp-if');
const config = require(`${process.cwd()}/config.js`);
const getNodeModule = require('./lib/get-node-module');

const isProd = process.env.NODE_ENV === 'production';

// sass 编译
function sass() {
    return src(['src/index.scss', 'src/pages/**/*.scss'], { base: 'src' })
        .pipe(gulpScss({ outputStyle: 'compressed' }))
        .pipe(postcss([
            autoprefixer(config.autoprefixerOptions),
            postcssPxtorem(config.postcssOptions)
        ]))
        .pipe(gulpIf(isProd, gulpRev()))
        .pipe(dest('dist'));
}

// html移动
function html() {
    return src(['src/index.html', 'src/pages/**/*.html'], { base: 'src' })
        .pipe(through2.obj(function (chunk, enc, callback) {
            let fileStr = chunk.contents.toString();
            const perentPath = path.resolve(chunk.path, '..').replace('src', 'dist');
            const files = fs.readdirSync(perentPath);
            const findCss = files.find(item => /.css$/.test(item));
            const findJs = files.find(item => /.js$/.test(item));

            // 加入css
            if (findCss) {
                fileStr = fileStr.replace('</head>', `<link rel="stylesheet" href="./${findCss}"></head>`);
            }

            // 加入js
            if (findJs) {
                fileStr = fileStr.replace('</body>', `<script src="./${findJs}"></script></body>`);
            }

            // 加入 hotcss, 用于适配
            const hotcss = getNodeModule('hotcss');
            if (hotcss) {
                fileStr = fileStr.replace('</head>', `<script>${hotcss}</script></head>`);
            }

            chunk.contents = Buffer.from(fileStr);
            this.push(chunk);
            callback();
        }))
        .pipe(dest('dist'));
}

// js编译
function js() {
    return src(['src/index.js', 'src/pages/**/*.js'], { base: 'src' })
        .pipe(gulpBro())
        .pipe(gulpIf(isProd, gulpBabel({ presets: ['@babel/env'] })))
        .pipe(gulpIf(isProd, gulpUglify()))
        .pipe(gulpIf(isProd, gulpRev()))
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