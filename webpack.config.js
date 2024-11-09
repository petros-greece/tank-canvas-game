const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.ts',  // Your entry file
  output: {
    filename: 'bundle.js',  // Output bundle file
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/', // Ensure the assets are served correctly from the root
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',  // Use ts-loader for TypeScript
        exclude: /node_modules/,
      },
    ],
  },
  devServer: {
    static: path.join(__dirname, 'dist'), // Serve files from 'dist'
    hot: true, // Enable HMR
    open: true, // Automatically open the browser
    historyApiFallback: true, // Allow navigation in single-page apps
    client: {
      overlay: true, // Show error overlay in the browser
    },
    watchFiles: {
      paths: ['src/**/*', 'index.html', 'dist/**/*'],  // Watch for changes in index.html and the src folder
    },
  },
  // devServer: {
  //   static: {
  //     directory: './',  // Serve files from the `dist` directory
  //   },
  //   hot: true,  // Enable Hot Module Replacement
  //   open: true,  // Automatically open the browser
  //   watchFiles: {
  //     paths: ['src/**/*', 'index.html', 'dist/**/*'],  // Watch for changes in index.html and the src folder
  //   },
  //   watchOptions: {
  //     ignored: /node_modules/,
  //     poll: 1000,
  //   },
  //   port: 8080,  // Set port to 8080 (or any other port you prefer)
  //   historyApiFallback: true,  // For SPA routing (redirects 404s to index.html)
  // },
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // HMR Plugin
  ],
  mode: 'development',  // Set mode to development for better performance during development
};
