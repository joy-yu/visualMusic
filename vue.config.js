var CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  publicPath: 'music',
  // devServer: {
  //   proxy: {
  //     '/api': {
  //       target: '',
  //       secure: false,
  //       changeOrigin: true,
  //     },
  //   },
  // },
  productionSourceMap: false,
  configureWebpack: {
    plugins: [
      new CompressionPlugin({
        test: /\.(js|html|css)$/,
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        threshold: 20480,
        minRatio: 0.8,
      }),
    ],
  },
};
