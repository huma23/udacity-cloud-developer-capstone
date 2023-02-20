const path = require('path');
const slsw = require('serverless-webpack');
//const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  entry: slsw.lib.entries,
  externals: [],
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
  },  
  target: 'node',
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader'},
      { test: /\.html$/i,loader: "html-loader"}
    ],
  },
  output: {
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
    libraryTarget: 'commonjs2'
  }
};
