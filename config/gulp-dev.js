
const { series, watch } = require('gulp');
const gulpConnect = require('gulp-connect');
const { clean, images, js, html, sass } = require('./gulp-base');
const config = require(`${process.cwd()}/config.js`);

// 输出加 热更新
function buildReload(fn) {
    return filepath => {
        console.log('\x1B[32m%s\x1B[39m', `[build]: File ${filepath}`);
        fn().pipe(gulpConnect.reload())
    }
}

// 端口输出配置
function serve(cb) {
    gulpConnect.server(config.serverOptions, () => {
        process.stdout.write('\033[2J');
        process.stdout.write('\033[0f');
        console.log('\x1B[34m%s\x1B[39m', `\r\nApp running at:\r\n`);
        console.log('\x1B[34m%s\x1B[39m', `    - Local:    http://localhost:${config.serverOptions.port}`);
    });
    cb();
}

// 监听
watch(['src/index.scss', 'src/pages/**/*.scss'])
    .on('change', buildReload(sass));

watch(['src/index.js', 'src/pages/**/*.js'])
    .on('change', buildReload(js));

watch(['src/index.html', 'src/pages/**/*.html'])
    .on('change', buildReload(html));

watch('src/**/*.@(jpg|png|gif)')
    .on('change', buildReload(images));

exports.default = series(clean, sass, js, html, images, serve);