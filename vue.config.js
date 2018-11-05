const path = require('path')

module.exports = {
  chainWebpack: config => {
    // Modify the export of every .vue file so that the
    // component is automatically installed if a global
    // Vue is available (e.g. from dropping Vue in as a
    // script tag).
    config.module
      .rule('vue')
      .use('global-vue-loader')
      .loader(path.resolve(__dirname, './build-utils/global-vue-loader'))
      .before('vue-loader')
  },
  pages: {
    index: {
      // entry for the page
      entry: 'tests/e2e/demo/src/main.js',
      // the source template
      template: 'tests/e2e/demo/public/index.html'
    }
  },
  css: {
    // Optionally set this to true if you want CSS
    // to be extracted into a separate CSS file.
    extract: false
  }
}
