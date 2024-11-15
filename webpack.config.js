const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.ts', // Your main TypeScript entry file
  output: {
    filename: 'bundle.js', // Name of the output JS bundle
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/', // Ensure assets are served correctly from the root
  },
  resolve: {
    extensions: ['.ts', '.js'], // Automatically resolve these extensions
  },
  module: {
    rules: [
      {
        test: /\.ts$/, // Match TypeScript files
        use: 'ts-loader', // Use ts-loader for TypeScript
        exclude: /node_modules/, // Exclude node_modules
      },
      {
        test: /\.css$/, // Match CSS files
        use: ['style-loader', 'css-loader', 'postcss-loader'], // Enable TailwindCSS processing
      },
    ],
  },
  devServer: {
    static: path.join(__dirname, 'dist'), // Serve files from 'dist'
    hot: true, // Enable Hot Module Replacement
    open: true, // Automatically open the browser
    historyApiFallback: true, // Handle SPA routing
    client: {
      overlay: true, // Show errors and warnings in the browser overlay
    },
    watchFiles: {
      paths: ['src/**/*', 'src/index.html'], // Watch for changes in src folder
    },
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // HMR plugin for live updates
    new HtmlWebpackPlugin({
      template: './src/index.html', // Source HTML file
      filename: './index.html', // Output HTML file
    }),
  ],
  mode: 'development', // Set mode to development
};
