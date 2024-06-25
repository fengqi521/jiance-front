// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

const build_prod_env = require('./prod.env')
var build_html_path = '../../web-api/views/index/index.html'
var build_root_path = '../../web-api/web/front'
// if (build_prod_env.THEME.replace(/^\"|\"$/g, '') == 'blue') {
build_html_path = '../dist/index.html'
build_root_path = '../dist/front'
// }

module.exports = {
  build: {
    sitEnv: require('./sit.env'),
    prodEnv: require('./prod.env'),
    index: path.resolve(__dirname, build_html_path),
    assetsRoot: path.resolve(__dirname, build_root_path),
    assetsSubDirectory: '',
    assetsPublicPath: '/front/', //生产环境assetsPublicPath: '/'
    staticPath: '/front/', //生产环境 staticPath:''
    productionSourceMap: false,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: true,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: 2031,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    staticPath: '/static/',
    // host: '0.0.0.0',//将 host设置为 0.0.0.0
    // autoOpenBrowser: true,
    // errorOverlay: true,
    // notifyOnErrors: false,
    // poll: false,
    proxyTable: {
      '/api': {
        // target: 'http://192.168.1.37:8080',
        // target: 'https://testh5.qinglianyun.com:8104',
        target: 'https://manage-test.leisn.cn/',
        secure: false, // 如果是https接口，需要配置这个参数
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        }
      }
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
