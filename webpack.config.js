//font字体问题http://stackoverflow.com/questions/34133808/webpack-ots-parsing-error-loading-fonts

//http://xwartz.xyz/blog/2016/06/electron-with-hmr/   hot-update.json无法更新模块，其实就是路径问题
const fs = require("fs")
const os = require("os")
const path = require('path')
const open = require("child_process");
const webpack = require('webpack')
const glob = require('glob')  //允许使用*等符号匹配对应规则的文件.

//https://github.com/nuysoft/Mock/wiki/Getting-Started
const Mock = require('mockjs')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const staticToBuild = require('./lib/staticToBuild')
const ImageminPlugin = require('imagemin-webpack-plugin').default

console.log(__dirname)

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
    _entries[basename] = entry
  }
  return _entries;
}

const entries = getEntries([APP_PATH+'/*.js'])

module.exports = {
  entry: entries,

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
        loader: "eslint-loader", //https://github.com/MoOx/eslint-loader
        include: [
          APP_PATH
        ]            
      },    
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this necessary.
            'scss': 'vue-style-loader!css-loader!postcss-loader!sass-loader',
            'sass': 'vue-style-loader!css-loader!postcss-loader!sass-loader?indentedSyntax'
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
        loader: 'babel-loader?cacheDirectory',
        exclude: /node_modules/,  //排除node_modules文件夹
        options: {
          presets: ['es2015']
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
      '@font': "",
      '@img': "../images"
    },
    modules: [path.resolve(__dirname, "node_modules")]

   },


   plugins: [
      // 开启全局的模块热替换(HMR)
      new webpack.HotModuleReplacementPlugin(),
      
      // 当模块热替换(HMR)时在浏览器控制台输出对用户更友好的模块名字信息
      new webpack.NamedModulesPlugin(),

      //https://github.com/webpack/webpack/tree/master/examples/multiple-commons-chunks#webpackconfigjs
      new webpack.optimize.CommonsChunkPlugin({
          name: 'vendors', // 将公共模块提取，生成名为`vendors`的chunk
          chunks: Object.keys(entries),
          minChunks: Object.keys(entries).length // 提取所有entry共同依赖的模块
      }),

      new ImageminPlugin({
        disable: process.env.NODE_ENV !== 'production', // Disable during development
        pngquant: {
          quality: '95-100'
        }
      })      
      
      // //静态资源分割存储
      // new staticToBuild({
      //   dir: '/app/doc',
      //   regex: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf|css)(\?.*)?$/i
      // })
   ],
   devServer: {
    contentBase: path.resolve(__dirname, 'dist/'),  //访问localhost:xxx 浏览器能看到的目录
    host: getLocalIP(),
    port: 9999,
    noInfo: true,
    quiet: false,
    //inline: true, //内联模式(inline mode)有两种方式：命令行方式和Node.js API
    historyApiFallback: false,
    open: true,
    hot: true,  //Hot Module Replacement, 启用 webpack 的模块热替换特性，结合插件 new webpack.HotModuleReplacementPlugin()
    compress: true,
    stats: "errors-only",
    // hotOnly: true,
    setup: function (app){
 
      app.get(['*.shtml', '*.html'], (req, res, next) => {
        console.log('req.path', req.path)
        let targetPath = path.join(APP_PATH, req.path);

        if (!fs.existsSync(targetPath)) {
          return next();
        }

        // //targetJSPath 是预览相对于/dist/输出路径
        // let targetJSPath = targetPath.replace(__dirname, '').replace(path.extname(targetPath), '.js')
        let targetJSPath = req.path.replace(/\.(shtml|html)/, '.js')

        res.set('Content-Type', 'text/html')
        let content = fs.readFileSync(targetPath, 'utf8')+'<script src="./vendors.js"></script><script src=".' + targetJSPath + '"></script>'
        res.send(content);

      })  

      let data = Mock.mock({
          // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
          'list|10': [{
            'cateTitle': '@name',
            'data|5': [{
              'title': '@title(5)',
              'detail': '@cparagraph(8)',
              'link': '@url',
              'image': '@image'
            }]         
          }]

      })

      app.get('/api/index', (req, res, next) => {
        // res.send(data);
        let data = fs.readFileSync(path.join(APP_MOCK, 'data.json'), 'utf8')
        res.send( {'list': JSON.parse(data)} );
      })

    }
   }   
};


if (process.env.NODE_ENV === 'production') {
  delete  module.exports.output.publicPath   //publicPath会影响打包路径

  module.exports.module.rules =  (module.exports.module.rules || []).concat([
      //ExtractTextPlugin 与预览输出css不能同时存在
      {
        test: /\.(css|scss)$/,
        //https://github.com/webpack-contrib/extract-text-webpack-plugin
        use: ExtractTextPlugin.extract({
             fallback: 'style-loader',
             use: ['css-loader', "postcss-loader", "sass-loader"]
        })        
        ,
        include: [
          APP_SASS
        ]        
      }
  ])

  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    // new webpack.DefinePlugin({
    //   'process.env': {
    //     NODE_ENV: '"production"'
    //   }
    // }),
    // 
    // [name]将会和entry中的chunk的名字一致
    // new ExtractTextPlugin( './css/[name].[contenthash].css'),
    new ExtractTextPlugin( './css/[name].css'),

    new webpack.optimize.UglifyJsPlugin({
      compress: true,
      beautify: false,
      sourceMap: false,
      compress: {
        warnings: false
      }
    })

    // new webpack.LoaderOptionsPlugin({
    //   minimize: true
    // })

  ])
}else{
  module.exports.module.rules =  (module.exports.module.rules || []).concat([
      {
        test: /\.(css|scss)$/,
        use: [    
          {
            loader: 'style-loader',
            options: {
              name: './css/[name].[ext]?[hash]'   //devServer预览都是相对dist输出目录
            }              
          },
          "css-loader?minimize",
          "postcss-loader",
          "sass-loader"
        ],
        include: [
          APP_SASS
        ]        
      }
  ])

}

  Object.keys(entries).map( (name) => {
    var plugin = new HtmlWebpackPlugin({
          filename: name + '.html',
          template: path.join(APP_PATH, name+'.shtml'),
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
