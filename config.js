const path = require('path')
const webpack = require('webpack')
const glob = require('glob')  //允许使用*等符号匹配对应规则的文件.
const HtmlWebpackPlugin = require('html-webpack-plugin')
const fs = require("fs")
console.log(__dirname)

//配置启动项目
const APP_NAME = "doc"

//项目静态资源路径
const APP_PATH = path.join(__dirname, 'app', APP_NAME)
const APP_IMAGES = path.join(__dirname, 'app', APP_NAME, 'images')
const APP_FONTS = path.join(__dirname, 'app', APP_NAME, 'fonts')
const APP_SASS = path.join(__dirname, 'app', APP_NAME, 'sass')
const APP_COMPONENT = path.join(__dirname, 'app', APP_NAME, 'components')

// function getEntries(globPath) {
//   var files = [];
//   if (Object.prototype.toString.call(globPath) === '[object Array]') {
//     globPath.forEach( (o, i) => {
//       files = files.concat(glob.sync(o))
//     })
//   } else {
//     files = glob.sync(globPath);
//   }
//   var _entries = {},
//     entry, dirname, basename;
//   for (var i = 0; i < files.length; i++) {
//     entry = files[i];
//     dirname = path.dirname(entry);
//     basename = path.basename(entry, '.js');
//     _entries[path.join(APP_NAME, basename).replace(/\\/g, '/')] = path.relative(__dirname, entry)
//   }
//   return _entries;
// }

// var entry = getEntries([APP_PATH+'/*.js'])
// console.log("entry", entry)
// 
// 
// var plugins = [
//     new HtmlWebpackPlugin({
//       filename: 'app/doc/index.html',
//       template: './app/doc/index.html',
//       inject: true,
//       minify: {
//         removeComments: true,
//         collapseWhitespace: true,
//         removeAttributeQuotes: true
//         // more options:
//         // https://github.com/kangax/html-minifier#options-quick-reference
//       }
//     }),
//     new HtmlWebpackPlugin({
//       filename: 'app/doc/index1.html',
//       template: './app/doc/index1.html',
//       inject: true,
//       minify: {
//         removeComments: true,
//         collapseWhitespace: true,
//         removeAttributeQuotes: true
//         // more options:
//         // https://github.com/kangax/html-minifier#options-quick-reference
//       }
//     })    
// ];

console.log(111, path.resolve(__dirname, 'app/doc/index.js'))
module.exports = {
  // context: path.resolve(__dirname, "app"),
 // entry: {
	//   "./src/main": "./src/main.js",
	//   about: "./about.js",
	//   contact: "./contact.js"
 //  },
  // entry: entry,
  entry: { 
    'index': path.resolve(__dirname, 'app/doc/index.js'), 
    'index1': path.resolve(__dirname, 'app/doc/index1.js') 
  },

  output: {
  	path: path.resolve(__dirname, 'dist/'),
  	// publicPath: '/dist/app',
    filename: 'app/doc/[name].js',
    chunkFilename: "[id].chunk.js"
  },

   module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this necessary.
            'scss': 'vue-style-loader!css-loader!sass-loader',
            'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
          }
          // other vue-loader options go here
        },
        // include: [
        //   APP_COMPONENT
        // ],
        exclude: /node_modules/      
      },    
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,  //排除node_modules文件夹
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },      
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'file-loader',
        query: {
          name: '/app/doc/images/[name].[ext]?[hash]'
        },
        include: [
  		    // path.resolve(__dirname, "app/styles"),
        //   path.resolve(__dirname, "vendor/styles"), 
        //   path.resolve(__dirname, "src/assets"), 
  		    APP_IMAGES
        ]
      },    
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
         // name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        },
        include: [
          APP_FONTS
        ]
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        query: {
          name: '[name].[ext]?[hash]'
        },
        include: [
          // path.resolve(__dirname, "app/styles"),
        //   path.resolve(__dirname, "vendor/styles"), 
        //   path.resolve(__dirname, "src/assets"), 
          APP_PATH
        ]
      },        

    ]
   },

   plugins: [
      new webpack.HotModuleReplacementPlugin(),
      // 开启全局的模块热替换(HMR)

      new webpack.NamedModulesPlugin(),
      // 当模块热替换(HMR)时在浏览器控制台输出对用户更友好的模块名字信息
   ],
   devServer: {
    contentBase: path.resolve(__dirname, 'app/'),
    // host: "0.0.0.0",
    port: 9999,
    noInfo: true,
    quiet: false,
    inline: true,
    historyApiFallback: false,
    open: true,
    hot: true,
    compress: true,
    setup: function (app){
 
      app.get(['*.shtml', '*.html'], (req, res, next) => {
        var targetPath = path.join(path.resolve(__dirname, 'app/'), req.path);

        if (!fs.existsSync(targetPath)) {
          return next();
        }

        res.set('Content-Type', 'text/html')
        let content = fs.readFileSync(targetPath, 'utf8')+'<script src="http://localhost:9999/webpack-dev-server.js"></script>'
        res.send(content);

      })     
    }
   }   
};


if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    // new webpack.optimize.UglifyJsPlugin({
    //   sourceMap: true,
    //   compress: {
    //     warnings: false
    //   }
    // }),
    // new webpack.LoaderOptionsPlugin({
    //   minimize: true
    // }),
    new HtmlWebpackPlugin({
      filename: 'app/doc/index.html',
      template: './app/doc/index.shtml',
      // inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      }
    }),
    new HtmlWebpackPlugin({
      filename: 'app/doc/index1.html',
      template: './app/doc/index1.shtml',
      // inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      }
    })    

  ])
}

//静态资源是相对于output路径， js路径是相对入口路径
