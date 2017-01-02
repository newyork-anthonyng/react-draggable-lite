const path = require('path');

module.exports = {
  entry: './lib/draggable.js',
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'draggable.js',
  },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
};
