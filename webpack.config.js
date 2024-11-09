const path = require('path');

module.exports = {
  entry: './src/index.ts',  // Your entry file
  output: {
    filename: 'bundle.js',  // Output bundle file
    path: path.resolve(__dirname, 'dist'),
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
    static: {
      directory: './',  // Serve files from the `dist` directory
    },
    hot: true,  // Enable Hot Module Replacement
    open: true,  // Automatically open the browser
    watchFiles: {
      paths: ['src/**/*', 'index.html'],  // Watch for changes in index.html and the src folder
    },
    port: 8080,  // Set port to 8080 (or any other port you prefer)
    historyApiFallback: true,  // For SPA routing (redirects 404s to index.html)
  },
  mode: 'development',  // Set mode to development for better performance during development
};
