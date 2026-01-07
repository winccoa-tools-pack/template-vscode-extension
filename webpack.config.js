
// webpack.config.js
/* eslint-env node */
const path = require('path');

module.exports = {
  context: __dirname,
  target: 'node',             // VS Code runs in Node/Electron
  mode: 'production',         // 'production' for optimized bundle (use 'none' if you wish)
  entry: './src/extension.ts',
  output: {
    path: path.resolve(__dirname, 'out'),  // align with package.json "main": "./out/extension.js"
    filename: 'extension.js',
    libraryTarget: 'commonjs2',            // VS Code expects CommonJS
    clean: true,
  },
  externals: {
    vscode: 'commonjs vscode',             // VS Code API is provided at runtime
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,         // faster builds; rely on tsc or eslint for type checking
            },
          },
        ],
      },
    ],
  },
  devtool: 'source-map',                   // good for debugging; 'hidden-source-map' for production publishing
  infrastructureLogging: {
    level: 'info',
  },
  // Optional: better defaults for Node externals
  externalsPresets: { node: true },
  // Optional: suppress warnings for dynamic requires from some deps
  ignoreWarnings: [
    { module: /node_modules/, message: /Critical dependency: the request of a dependency is an expression/ },
  ],
};
