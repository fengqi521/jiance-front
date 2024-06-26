// require('./check-versions')(); // 检查 Node 和 npm 版本
let config = require('../config');
if (!process.env.NODE_ENV) {
    // 假如process.env.NODE_ENV全局变量没有值时，设置为'development'
    process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV) 
}

const opn = require('opn')
const path = require('path');
const express = require('express');
const webpack = require('webpack');
const multer = require('multer');
const proxyMiddleware = require('http-proxy-middleware');
const webpackConfig = require('./webpack.dev.conf');

// default port where dev server listens for incoming traffic
const port = process.env.PORT || config.dev.port;
// automatically open browser, if not set will be false
const autoOpenBrowser = !!config.dev.autoOpenBrowser;
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
const proxyTable = config.dev.proxyTable;

const app = express();
const compiler = webpack(webpackConfig);

let devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    quiet: true
});

let hotMiddleware = require('webpack-hot-middleware')(compiler, {
    log: () => {
    }
});

// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
        hotMiddleware.publish({action: 'reload'});
        cb()
    })
});

// compiler.apply(new DashboardPlugin());

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
    let options = proxyTable[context]
    if (typeof options === 'string') {
        options = {target: options}
    }
    app.use(proxyMiddleware(options.filter || context, options))
});

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')());

// serve webpack bundle output
app.use(devMiddleware);

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware);

// ------------------------ 图片上传 start -------------------------------
const upload = multer({ dest: __dirname + '/uploads'})
app.post('/uploads', upload.single('file'), async (req, res) => {
    const file = req.file;
    res.send(file)
})
// ------------------------ 图片上传 end --------------------------

// serve pure static assets
let staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory);
app.use(staticPath, express.static('./static'));

let uri = 'http://localhost:' + port

devMiddleware.waitUntilValid(function () {
    console.log('> Listening at ' + uri + '\n')
});

module.exports = app.listen(port, function (err) {
    if (err) {
        console.log(err);
        return
    }

    // when env is testing, don't need open it
    if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
        opn(uri)
    }
});
