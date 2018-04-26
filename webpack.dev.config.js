var webpack = require('webpack');
var path = require('path');
var outputPath = path.resolve(__dirname, 'build');
outputPath = outputPath.charAt(0).toUpperCase() + outputPath.slice(1);

module.exports = {
    entry: [
      'webpack-dev-server/client?http://localhost:8081',
      path.join(__dirname, 'src', 'main.js'),
    ],
    output: {
        path:  path.resolve(__dirname, 'public/scripts'),
        publicPath: "http://localhost:8081/",
        filename: 'bundle.js',
    },
    devServer : {
      hot: true,
      contentBase: 'public/scripts',
      publicPath: "http://localhost:80801/",
      port: 8081,
      https: false,
      historyApiFallback: true,
      proxy: {
        '/api' : {
          target: 'https://localhost:44314',
          secure: false
        }
      }
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),      
      new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': '"DEBUG"'
        },
        'site_domain': '"localhost"',
        'site_port': '"3000"',
        'site_scheme': '"http"',
        'api_domain': '"localhost"',
        'api_port': '"3000"',
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