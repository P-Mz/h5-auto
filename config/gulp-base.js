
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
const config = require(`${process.cwd()}/config.js`);


// sass 编译
function sass() {
    return src(['src/index.scss', 'src/pages/**/*.scss'], { base: 'src' })
        .pipe(gulpScss({ outputStyle: 'compressed' }))
        .pipe(postcss([
            autoprefixer(config.autoprefixerOptions),
            postcssPxtorem(config.postcssOptions)
        ]))
        .pipe(dest('dist'));
}

// html移动
function html() {
    return src(['src/index.html', 'src/pages/**/*.html'], { base: 'src' })
        .pipe(through2.obj(function (chunk, enc, callback) {
            let fileStr = chunk.contents.toString();
            let { name, dir } = path.parse(chunk.path);

            if (fs.existsSync(path.join(dir, name + '.scss'))) {
                fileStr = fileStr.replace('</head>', `<link rel="stylesheet" href="./${name}.css">\n</head>`);
            }

            if (fs.existsSync(path.join(dir, name + '.js'))) {
                fileStr = fileStr.replace('</body>', `<script src="./${name}.js"></script>\n</body>`);
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