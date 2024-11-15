const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
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
      paths: ['src/**/*'],  // Watch for changes in index.html and the src folder
    },
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // HMR Plugin
    new HtmlWebpackPlugin({
      template: './src/index.html', // Source HTML file
      filename: './index.html', // Output HTML file
    }),
  ],
  mode: 'development',  // Set mode to development for better performance during development
};
