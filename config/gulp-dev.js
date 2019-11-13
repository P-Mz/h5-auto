
const { series, watch } = require('gulp');
const gulpConnect = require('gulp-connect');
const { clean, images, js, html, sass } = require('./gulp-base');

const serverConfig = {
    port: 3000,
    root: 'dist',
    livereload: true
};

// 输出加 热更新
function buildReload(fn) {
    return filepath => {
        console.log('\x1B[32m%s\x1B[39m', `[build]: File ${filepath}`);
        fn().pipe(gulpConnect.reload())
    }
}

// 端口输出配置
function serve(cb) {
    gulpConnect.server(serverConfig, () => {
        process.stdout.write('\033[2J');
        process.stdout.write('\033[0f');
        console.log('\x1B[34m%s\x1B[39m', `\r\nApp running at:\r\n`);
        console.log('\x1B[34m%s\x1B[39m', `    - Local:    http://localhost:${serverConfig.port}/pages`);
    });
    cb();
}

// 监听
watch('src/pages/**/*.scss')
    .on('change', buildReload(sass));

watch('src/pages/**/*.html')
    .on('change', buildReload(html));

watch('src/pages/**/*.js')
    .on('change', buildReload(js));

watch('src/**/*.@(jpg|png|gif)')
    .on('change', buildReload(images));

exports.default = series(clean, sass, html, js, images, serve);