const fs = require('fs');
const path = require('path');
const uglifyJs = require('uglify-js');
const NODE_MODULES_PATH = `${process.cwd()}\\node_modules`;


/**
 * 获取node_modules里面的模块
 * 
 * @param {string} nodeModule 模块名
 */
function getNodeModules (nodeModule) {
    const modulePath = `${NODE_MODULES_PATH}\\${nodeModule}`;

    const exists = fs.existsSync(modulePath);
    if (!exists) throw new Error(`Cannot found '${nodeModule}' module`);

    const stat = fs.statSync(modulePath);
    if (stat.isDirectory()) {
        const files = fs.readdirSync(modulePath);
        let retFile = '';
        for (let file of files) {
            if ('package.json' === file) {
                const packageFile = fs.readFileSync(path.join(modulePath, file));
                const packageObj = JSON.parse(packageFile);
                if (packageObj.main) {
                    retFile = fs.readFileSync(path.join(modulePath, packageObj.main));
                    return uglifyJs.minify(retFile.toString()).code;
                }
            } else if ('src' === file) {
                retFile = fs.readFileSync(path.join(modulePath, file, 'index.js'));
                return uglifyJs.minify(retFile.toString()).code;
            }
        }
    }
}

module.exports = getNodeModules;