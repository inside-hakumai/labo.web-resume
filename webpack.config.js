const webpackConfig = require('webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

let config = {
  target: 'web',
  entry:  {
    'root': './src/scripts/main.ts',
  },
  output: {
    path: __dirname + "/js",
      filename: 'bundle.js'
  },
  mode: 'development',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader'
          }
        ],
      }
    ]
  },
  resolve: {
    modules: ["node_modules"],
    extensions: ['.js', '.ts'],
    plugins: [new TsconfigPathsPlugin({configFile: "./tsconfig.json"})]
  }
};

module.exports = config;