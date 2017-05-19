## webpack简介与使用

CommonJS 和 AMD 是用于 JavaScript 模块管理的两大规范，前者定义的是模块的同步加载，主要用于 NodeJS ；而后者则是异步加载，通过 RequireJS 等工具适用于前端。随着 npm 成为主流的 JavaScript 组件发布平台，越来越多的前端项目也依赖于 npm 上的项目，或者自身就会发布到 npm 平台。因此，让前端项目更方便的使用 npm 上的资源成为一大需求。

web 开发中常用到的静态资源主要有 JavaScript、CSS、图片等文件，webpack 中将静态资源文件称之为模块。 webpack 是一个 module bundler (模块打包工具)，其可以兼容多种 js 书写规范，且可以处理模块间的依赖关系，具有更强大的 js 模块化的功能。Webpack 对它们进行统一的管理以及打包发布，下面这张图来说明 Webpack 的作用：

![webpack图片](http://img.pfan123.com/webpack/webpack1_1.png)

## Webpack的核心原理

Webpack的两个最核心的原理分别是：

1.一切皆模块

正如js文件可以是一个“模块（module）”一样，其他的（如css、image或html）文件也可视作模 块。因此，你可以require('myJSfile.js')亦可以require('myCSSfile.css')。这意味着我们可以将事物（业务）分割成更小的易于管理的片段，从而达到重复利用等的目的。

2.按需加载

传统的模块打包工具（module bundlers）最终将所有的模块编译生成一个庞大的bundle.js文件。但是在真实的app里边，“bundle.js”文件可能有10M到15M之大可能会导致应用一直处于加载中状态。因此Webpack使用许多特性来分割代码然后生成多个“bundle”文件，而且异步加载部分代码以实现按需加载。

### webpack 官网文档

官网地址：https://webpack.js.org/

中文官网：https://doc.webpack-china.org/


### webpack 的优势

> 对 CommonJS 、 AMD 、ES6 的语法做了兼容
> 对 js、css、图片等资源文件都支持打包
> 串联式模块加载器以及插件机制，让其具有更好的灵活性和扩展性，例如提供对 CoffeeScript、ES6的支持
> 有独立的配置文件 webpack.config.js
> 可以将代码切割成不同的 chunk，实现按需加载，降低了初始化时间
> 支持 SourceUrls 和 SourceMaps，易于调试
> 具有强大的 Plugin 接口，大多是内部插件，使用起来比较灵活
> webpack 使用异步 IO 并具有多级缓存。这使得 webpack 很快且在增量编译上更加快

## webpack 安装和配置

##### 安装

```
npm install -g webpack  //全局安装
npm install --save-dev webpack   //局部安装
```

##### 执行

```
webpack —config webpack.config.js
```

##### 配置

每个项目下都必须配置有一个 webpack.config.js通常放在项目的根目录中，它本身也是一个标准的Commonjs规范的模块。在导出的配置对象中有几个关键的参数：

###### entry

entry 参数定义了打包后的入口文件，可以是个字符串或数组或者是对象；如果是数组，数组中的所有文件会打包生成一个filename文件；如果是对象，可以将不同的文件构建成不同的文件:

```
  entry: {
      index: "./page1／index.js",  
      //支持数组形式，将加载数组中的所有模块，但以最后一个模块作为输出
      login: ["./entry1/login.js", "./entry2/register.js"]
  }
```

###### output

output参数是个对象，定义了输出文件的位置及名字：

```
output: {
        path: path.resolve(__dirname, "build"), //打包输出路径，建议绝对路径
        
        // 配置文件在html中引用的根路径，改变静态资源引入的相对路径
        publicPath: "/assets/",
        //publicPath: "http://cdn.com/assets/",//可加上完整的url，效果与上面一致

        filename: "js/bundle.js",  // 单页应用只有一个入口文件时使用，引用入口模块
        filename: "js/[name].js",  // 传统多页应用有多个入口文件时使用，[name] 代入entry配置中的任意一项模块的名称，如：index
        filename: "js/[hash]/[chunkhash].js",  // 为生产环境实现前端静态资源增量更新时使用，[hash]是根据每次编译后项目总体文件的hash值, [chunkhash]是根据每个模块内容计算出的hash值
        
    }
```

###### module

在webpack中JavaScript，CSS，LESS，TypeScript，JSX，CoffeeScript，图片等静态文件都是模块，不同模块的加载是通过模块加载器（webpack-loader）来统一管理的:
```
module: {
 rules: [
   {
     test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
     loader: 'file-loader',
     query: {
       limit: 8192,
       name: './images/[name].[ext]?[hash]'
     },

   },     
   // 使用多个插件，使用use，sass文件使用style-loader, css-loader, less-loader来处理
   {
       test: /\.(sass|scss)$/,
       use: [
           'style-loader',
           'css-loader',
           'sass-loader',
           extractTextPlugin.extract(['style','css', 'less'])     
       ],
   }
 ]
}
```

> 注意： webpack 2.x 之后 module.loaders改成了module.rules

###### resolve

webpack在构建包的时候会按目录的进行文件的查找，resolve属性中的extensions数组中用于配置程序可以自行补全哪些文件后缀：

```
resolve: {
       modules: [path.resolve(__dirname, "node_modules")]
       extensions: ['', '.js', '.json', '.scss'],

       //模块别名定义，方便后续直接引用别名，无须多写长长的地址
       alias: {
           AppStore : 'js/stores/AppStores.js',//后续直接 require('AppStore') 即可
           ActionType : 'js/actions/ActionType.js',
           AppAction : 'js/actions/AppAction.js'
       }
   }
```

###### plugin

webpack提供了[丰富的组件]用来满足不同的需求，当然我们也可以自行实现一个组件来满足自己的需求：

```
plugins: [
     //your plugins list
 ]
```
常用插件：

- HotModuleReplacementPlugin --开启全局的模块热替换(HMR)

- NamedModulesPlugin --当模块热替换(HMR)时在浏览器控制台输出对用户更友好的模块名字信息

- [CommonsChunkPlugin](https://github.com/webpack/webpack/tree/master/examples/multiple-commons-chunks#webpackconfigjs) --提取chunk公共部分

- [ExtractTextPlugin](https://github.com/webpack-contrib/extract-text-webpack-plugin) --独立生成css文件，以外链的形式加载

- [UglifyJsPlugin](https://github.com/webpack-contrib/uglifyjs-webpack-plugin) --压缩js

- [HtmlWebpackPlugin](https://github.com/jantimon/html-webpack-plugin) --使用模版生成html

###### externals
防止将某些 import 的包(package)打包到 bundle 中，而是在运行时(runtime)再去从外部获取这些扩展依赖(external dependencies)。

例如，从 CDN 引入 jQuery，而不是把它打包：

```
<script src="https://code.jquery.com/jquery-3.1.0.js"
  integrity="sha256-slogkvB1K3VOkzAI8QITxV3VzpOnkeNVsKvtkYLMjfk="
  crossorigin="anonymous"></script>
```
```
externals: {
 "jquery": "jQuery"
}
```
这样就剥离了那些不需要改动的依赖模块，换句话，下面展示的代码还可以正常运行：

```
import $ from 'jquery';

$('.my-element').animate(...);

```

## webpack-dev-server

webpack-dev-server是一个小型的node.js Express服务器,它使用webpack-dev-middleware中间件来为通过webpack打包生成的资源文件提供Web服务。它还有一个通过Socket.IO连接着webpack-dev-server服务器的小型运行时程序。webpack-dev-server发送关于编译状态的消息到客户端，客户端根据消息作出响应。

webpack-dev-server有两种模式支持自动刷新:

- iframe模式
- inline模式

#### iframe模式

页面是嵌套在一个iframe下的，在代码发生改动的时候，这个iframe会重新加载。

使用iframe模式无需额外的配置，只需在浏览器输入 `http://localhost:8080/webpack-dev-server/index.html` ，显然webpack-dev-server默认的模式就是iframe


#### inline模式
的webpack-dev-server客户端会作为入口文件打包，会在后端代码改变的时候刷新页面。
配置方式有两种：CLI配置和通过Node.js Api手动配置

###### CLI 方式
此方式比较简单，只需在webpack.dev.server启动的命令中加入--inline即可
- 修改package.json中scripts配置，添加--inline：

```
"scripts":{
"start":"webpack-dev-server --inline --config webpack.config.dev.js"
}

```

- 重新运行`npm start`，浏览器访问 `http://localhost:8080` 即可，修改代码后保存，浏览器自动刷新

#### Node.js Api方式

- 第一种方案：将webpack/hot/dev-server配置到所有webpack入口文件中

```
var config = require("./webpack.config.js");
config.entry.app.unshift("webpack-dev-server/client?http://localhost:8080/");
var compiler = webpack(config);
var server = new WebpackDevServer(compiler, {...});
server.listen(8080);
```

- 第二种方案：将webpack-dev-server客户端脚本插入到html中即可：

```
<script src="http://localhost:8080/webpack-dev-server.js"></script>
```

## Hot Module Replacement

使用`webpack-dev-server的自动刷新功能时，浏览器会整页刷新。而热替换的区别就在于，前端代码变动时，无需刷新整个页面，只把变化的部分替换掉。配置的关键在于将 `webpack/hot/dev-server` 文件加入到webpack所有入口文件中。

> ps: 使用前要注入 HMR插件

```
// 开启全局的模块热替换(HMR)
new webpack.HotModuleReplacementPlugin(),

// 当模块热替换(HMR)时在浏览器控制台输出对用户更友好的模块名字信息
new webpack.NamedModulesPlugin()
```

使用HMR同样同样有两种方式：CLI和Node.js Api

#### CLI方式

命令行配置比较简单，只需在自动刷新的基础上，加上 `--hot` 配置即可。
此配置会自动将 `webpack/hot/dev-server` 添加到webpack所有入口点中。

```
"scripts":{
"start":"webpack-dev-server --inline --hot --config webpack.config.dev.js"
}
```

#### Node.js Api方式

```
var config = require("./webpack.config.js");
config.entry.app.unshift("webpack-dev-server/client?http://localhost:8080/", "webpack/hot/dev-server");
var compiler = webpack(config);
var server = new webpackDevServer(compiler, {
  hot: true
  ...
});
server.listen(8080);
```


> ps：要使HMR功能生效，就是要在应用热替换的模块或者根模块里面加入允许热替换的代码。否则，热替换不会生效，还是会重刷整个页面。下面是摘自webpack在github上docs的原话：


ps: 注意 webpack-dev-server 输出日志

```
//webpack-dev-server.js输出信息，可以发现
//contentBase存在，都会打印日志 Content not from webpack is served from
//webpack output is served from信息取自 output.publicPath 路径

function reportReadiness(uri, options) {
  const useColor = argv.color;
  let startSentence = `Project is running at ${colorInfo(useColor, uri)}`
  if(options.socket) {
    startSentence = `Listening to socket at ${colorInfo(useColor, options.socket)}`;
  }
  console.log((argv["progress"] ? "\n" : "") + startSentence);

  console.log(`webpack output is served from ${colorInfo(useColor, options.publicPath)}`);
  const contentBase = Array.isArray(options.contentBase) ? options.contentBase.join(", ") : options.contentBase;
  if(contentBase)
    console.log(`Content not from webpack is served from ${colorInfo(useColor, contentBase)}`);
  if(options.historyApiFallback)
    console.log(`404s will fallback to ${colorInfo(useColor, options.historyApiFallback.index || "/index.html")}`);
  if(options.open) {
    open(uri).catch(function() {
      console.log("Unable to open browser. If you are running in a headless environment, please do not use the open flag.");
    });
  }
}
```


[WEBPACK DEV SERVER](https://webpack.github.io/docs/webpack-dev-server.html)

[Hot Module Replacement](https://webpack.github.io/docs/hot-module-replacement.html)

[Hot Module Replacement 介绍](https://cupools.github.io/2016/07010/)

[Hot Module Replacement](https://survivejs.com/webpack/appendices/hmr/)

[如何写好.babelrc？Babel的presets和plugins配置解析](https://zhuanlan.zhihu.com/p/24224107)

[webpack2异步加载套路](https://segmentfault.com/a/1190000008279471)

[基于webpack搭建前端工程解决方案探索](https://github.com/chemdemo/chemdemo.github.io/issues/10)

[【翻译】Webpack——令人困惑的地方](https://github.com/chemdemo/chemdemo.github.io/issues/13)