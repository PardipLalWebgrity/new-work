const path = require('path');

module.exports = {
  entry: './components/wbtr-app/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    module: true, // ← important for native modules
  },
  experiments: {
    outputModule: true, // ← enable native ESM output
  },
  mode: 'development',
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist'),
    },
    port: 3000,       // You can change this to any port
    open: true,       // Automatically opens the browser
    hot: true,        // Enables Hot Module Replacement (optional)
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        type: 'javascript/esm'
      }
    ]
  }
};