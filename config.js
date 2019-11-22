
module.exports = {

    // 参考链接: https://www.npmjs.com/package/autoprefixer#options
    autoprefixerOptions: { borwsers: ['last 2 versions'] },

    // 参考链接: https://www.npmjs.com/package/postcss-pxtorem#options
    postcssOptions: {
        rootValue: 46.875,      // 根节点大小设置
        unitPrecision: 5,       // 小数点保留位数
        propList: ['*'],        // 需要被转换的属性列表, !border排除边框转换
        selectorBlackList: [],  // css选择器过滤数组, 匹配的都不会去转换
        replace: true,
        mediaQuery: false,      // 是否替换media中的px
        minPixelValue: 12       // 设置就是小于12px的都不会被转换
    },

    serverOptions: {
        port: 3000,
        root: 'dist',
        livereload: true
    }
}