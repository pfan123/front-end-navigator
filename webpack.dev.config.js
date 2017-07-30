//font字体问题http://stackoverflow.com/questions/34133808/webpack-ots-parsing-error-loading-fonts

//http://xwartz.xyz/blog/2016/06/electron-with-hmr/   hot-update.json无法更新模块，其实就是路径问题
const fs = require("fs")
const os = require("os")
const path = require('path')
const open = require("child_process")
const webpack = require('webpack')
const glob = require('glob')  //允许使用*等符号匹配对应规则的文件.
const HappyPack = require('happypack')
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })

//https://github.com/nuysoft/Mock/wiki/Getting-Started
const Mock = require('mockjs')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const staticToBuild = require('./lib/staticToBuild')
const ImageminPlugin = require('imagemin-webpack-plugin').default
const UglifyJsParallelPlugin = require('webpack-uglify-parallel')

process.traceDeprecation = true

function getLocalIP() {
  try{
    var ifaces = os.networkInterfaces();
    var reg = /^(10\.)|(172\.)|(192\.).+$/gi;
    for (var dev in ifaces) {
      var ip = ifaces[dev][1].address;
      if(reg.test(ip)) {
         return ip;
      }
    }    
  }catch(err){
    return "localhost"
  }  
}


process.traceDeprecation = true 
//配置启动项目
const APP_NAME = "doc"

//项目静态资源路径
const APP_PATH = path.join(__dirname, 'app', APP_NAME)
const APP_IMAGES = path.join(__dirname, 'app', APP_NAME, 'images')
const APP_FONTS = path.join(__dirname, 'app', APP_NAME, 'fonts')
const APP_SASS = path.join(__dirname, 'app', APP_NAME, 'sass')
const APP_COMPONENT = path.join(__dirname, 'app', APP_NAME, 'components')
const APP_MOCK = path.join(__dirname, 'app', APP_NAME, 'mock')

function getEntries(globPath) {
  let files = [];
  if (Object.prototype.toString.call(globPath) === '[object Array]') {
    globPath.forEach( (o, i) => {
      files = files.concat(glob.sync(o))
    })
  } else {
    files = glob.sync(globPath);
  }
  let _entries = {},
    entry, dirname, basename;
  for (let i = 0; i < files.length; i++) {
    entry = files[i];
    dirname = path.dirname(entry)
    basename = path.basename(entry, '.js');

    // _entries[entry.replace(__dirname+'/', '').replace(/\.js/, '')] = entry
    // 不推荐用路径做entry名字，会导致生成模版、图片、字体、样式路径不好确定
    _entries[basename] = [entry, 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=2000&reload=true']

  }
  return _entries;
}

const entries = getEntries([APP_PATH+'/*.js'])

module.exports = {
  entry: entries,
  "cache": true,
  "context": __dirname,

  output: {
    path: path.resolve(__dirname, 'dist/'),
    publicPath: 'http://' + getLocalIP() + ':9999/',
    // publicPath: 'http://localhost:9999/',
    // publicPath: '/',
    filename: '[name].js',     //name，对应entry名称
    chunkFilename: "[id].chunk.js"
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: "pre",  //module.preLoaders的替代方案
        loader: "happypack/loader?id=eslint", //https://github.com/MoOx/eslint-loader
        include: [
          APP_PATH
        ]            
      },   
      {
          "test": /\.vue$/,   // ExtractTextPlugin https://github.com/vuejs/vue-loader/issues/622
          "loader": "vue-loader",
          "options": {
              "loaders": {
                  "css": [
                      "vue-style-loader",
                      {
                          "loader": "css-loader",
                          "options": {
                              "minimize": false,
                              "sourceMap": false
                          }
                      }
                  ],
                  "postcss": [
                      "vue-style-loader",
                      {
                          "loader": "css-loader",
                          "options": {
                              "minimize": false,
                              "sourceMap": false
                          }
                      }
                  ],
                  "less": [
                      "vue-style-loader",
                      {
                          "loader": "css-loader",
                          "options": {
                              "minimize": false,
                              "sourceMap": false
                          }
                      },
                      {
                          "loader": "less-loader",
                          "options": {
                              "sourceMap": false
                          }
                      }
                  ],
                  "sass": [
                      "vue-style-loader",
                      {
                          "loader": "css-loader",
                          "options": {
                              "minimize": false,
                              "sourceMap": false
                          }
                      },
                      {
                          "loader": "sass-loader",
                          "options": {
                              "indentedSyntax": true,
                              "sourceMap": false
                          }
                      }
                  ],
                  "scss": [
                      "vue-style-loader",
                      {
                          "loader": "css-loader",
                          "options": {
                              "minimize": false,
                              "sourceMap": false
                          }
                      },
                      {
                          "loader": "sass-loader",
                          "options": {
                              "sourceMap": false
                          }
                      }
                  ]
              }
          },
          // include: [
          //   APP_COMPONENT
          // ],
          exclude: /node_modules/          
      },  
      {
        test: /\.js$/,
        exclude: /node_modules/,  //排除node_modules文件夹
        use: {
          loader: 'happypack/loader?id=js'
          // options: {
          //   presets: ['es2015','stage-2']
          // }
        },        
        include: [
          APP_PATH
        ]        
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },  
      {
        test: /\.(css|scss)$/,
        use: [    
          {
            loader: 'style-loader',
            options: {
              name: './css/[name].[ext]?[hash]'   //devServer预览都是相对dist输出目录
            }              
          },
          {
              "loader": "css-loader",
              "options": {
                  "minimize": false,
                  "sourceMap": false
              }
          },
          "postcss-loader",
          "sass-loader"
        ],
        include: [
          APP_SASS
        ]        
      },                       
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          limit: 10000,
          name: './images/[name].[ext]?[hash]'   //devServer预览都是相对dist输出目录
        },
        include: [
          APP_IMAGES
        ]
      },    
      {
        test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: './fonts/[name].[hash].[ext]'
          // name: '/fonts/[name].[hash].[ext]'
          // name: './fonts/[name].[ext]'
        },
        include: [
          APP_FONTS
        ]
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        options: {
          name: '[name].[ext]?[hash]'
        },
        include: [
          APP_PATH
        ]
      }   

    ]
   },

   //页面已经cdn加载，则不需要打包到chunk
   externals: {
     "av": "AV"
   },

   resolve: {
    alias: {
      'vue': 'vue/dist/vue.common.js',
      '@font': "",
      '@img': "../images"
    },
    modules: [path.resolve(__dirname, "node_modules")]
   },

  performance: {
    "maxAssetSize": 250000,
    "maxEntrypointSize": 250000,
    hints: process.env.NODE_ENV === 'production' ? 'warning' : false
  },

   plugins: [
      // 开启全局的模块热替换(HMR)
      new webpack.HotModuleReplacementPlugin(),
      
      // 当模块热替换(HMR)时在浏览器控制台输出对用户更友好的模块名字信息
      new webpack.NamedModulesPlugin(),

      new webpack.optimize.ModuleConcatenationPlugin(), //减少模块闭包函数数量从而加快JS的执行速度

      new ImageminPlugin({
        disable: process.env.NODE_ENV !== 'production', // Disable during development
        pngquant: {
          quality: '95-100'
        }
      }),      

      //https://github.com/webpack/webpack/tree/master/examples/multiple-commons-chunks#webpackconfigjs
      new webpack.optimize.CommonsChunkPlugin({
          name: 'vendors', // 将公共模块提取，生成名为`vendors`的chunk
          chunks: Object.keys(entries),
          // minChunks: Infinity
          minChunks: Object.keys(entries).length // 提取所有entry共同依赖的模块
      }),
      
      new HappyPack({
        id: 'js',
        loaders: [ 'babel-loader?cacheDirectory=true&presets[]=es2015&presets[]=stage-2' ],
        threadPool: happyThreadPool,
        cache: true,
        verbose: true        
      }),

      new HappyPack({
        id: 'eslint',
        loaders: [ 'eslint-loader' ],
        threadPool: happyThreadPool,
        cache: true,
        verbose: true        
      })    
      // new webpack.optimize.CommonsChunkPlugin({
      //     name: 'manifest' //But since there are no more common modules between them we end up with just the runtime code included in the manifest file
      // }),
   
      // //静态资源分割存储
      // new staticToBuild({
      //   dir: '/app/doc',
      //   regex: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf|css)(\?.*)?$/i
      // })
   ]
};



Object.keys(entries).map( (name) => {
  var plugin = new HtmlWebpackPlugin({
        filename: name + '.html',
        template: path.join(APP_PATH, name+'.html'),
        inject: true,
        chunks: ["vendors", name],
        showErrors: true,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true
          // more options:
          // https://github.com/kangax/html-minifier#options-quick-reference
        }
      })   

  module.exports.plugins.push(plugin);
} )

//静态资源是相对于output路径， js路径是相对入口路径
