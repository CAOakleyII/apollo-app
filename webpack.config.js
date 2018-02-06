var webpack = require('webpack');
var path = require('path');
module.exports = {
    entry: path.resolve(__dirname, 'src/main.js'),
    output: {
        path:  path.resolve(__dirname, 'scripts'),
        filename: 'bundle.js',
    },
    plugins: [
      new webpack.optimize.UglifyJsPlugin(),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.DefinePlugin({
          'process.env': {
              'NODE_ENV': '"production"'
          },
          'api_domain': '"apolloverlay.com"',
          'api_port': '"80"',
          'api_scheme': '"http"'

      })
    ],
    module: {
        rules: [
        {
            test: /\.vue$/,
            loader: 'vue-loader'
        },
        {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        },
          {
              test: /\.less$/,
              use: [
                "style-loader",
                "css-loader",
                "less-loader"
              ]
          }
        ]
    },
    resolve: {
        alias: {
          'vue$': 'vue/dist/vue.esm.js'
        },
        extensions: ['*', '.js', '.vue', '.json']
    }
};