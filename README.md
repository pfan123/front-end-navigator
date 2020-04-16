## 前端导航平台简介

是否有过当你看到比较优秀的前端资源时，由于没有时间来的及收录，过段时间等需要的时，却翻来覆去不知道去哪了～～ 前端导航站，收集前端业内优秀技术博客、框架，方便快速寻找优秀资源，～～宝宝再也不用担心查找资源了～～

## 前端导航平台由来

记得2015年时，当我为查找资料而烦恼时，时间久了容易忘记时，为了方便自己记忆以备后用，简单的搭了 [前端开发导航平台](http://doc.pfan123.com/)（其实就是一静态页面展示，手动在页面上添加数据），但随着时间过去，前端圈的变化，以及工作的忙碌，后来越来越懒得去手动添加，感觉异常的麻烦，一直是自己想解决的一个问题。最近，抽了一个周末，把平台重新重构了一遍，优化了预览导航，以及增加简单的管理，[NEW 前端开发导航平台](https://docs.pfan123.com)。

[前端导航首页](https://docs.pfan123.com)

[前端导航登录页面](https://docs.pfan123.com/admin.html#/)

[前端导航管理页面](https://docs.pfan123.com/admin.html#/edit)


## 平台重构涉及技术点

技术架构： webpack2+vue2+vue-router2+leancloud+Mockjs

- 1.构建webpack2.0多页面应用 
- 2.vue2数据渲染，实践父、子组件通信，组件与组件之间通信
- 3.vue-router2、axios实现控制管理页面路由
- 4.leancloud数据云存储
- 5.Mockjs开发过程中模拟测试数据

规范提交：husky + validate-commit-msg + conventional-changelog

[husky](https://github.com/typicode/husky)

[validate-commit-msg](https://github.com/conventional-changelog/validate-commit-msg)

[conventional-changelog](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-cli)

[Git commit message和工作流规范](http://ivweb.io/topic/58ba702bdb35a9135d42f83d)

[知乎Commit message提交格式](https://www.zhihu.com/question/56120376)

## 收录前端资源


### 移动端开发资源

[前端导航平台数据列表](./前端导航平台数据列表.md)

导航目录结构：

- 前端圈子社区
- 前端规范文档
- 移动端开发资源
- 图片优化
- CSS3动画
- JS动画引擎
- JS游戏框架
- MVVM框架
- 浏览器检测工具
- 图表工具
- 图标工具
- 前端安全
- 前端自动化
- 桌面端开发
- 设计资源
- 开发工具技巧
- 优秀博客／资料
- 前端面试资料
- 前端导航平台

## 使用方式

1.拉取仓库

```
git clone git@github.com:o2team/wxapp-market.git
```

2.执行命令

```
yarn run app  //启动 webpack-dev-server  执行 webpack.config.js
yarn run dev  //启动 webpack-dev-server  执行 webpack.dev.config.js
yarn run prod  //启动 webpack-dev-server  执行 webpack.dev.prod.js
npm run analyzer //执行 analyzer
```
![img](http://img.pfan123.com/vue_mvvm.jpg)

## 技术实践文章

[webpack简介与使用](./webpack简介与使用.md)

[从 webpack v1 迁移到 webpack v2 新特性](./webpack2新特性.md)

[webpack2 使用优化](https://github.com/gwuhaolin/blog/issues/2)

[Webpack插件中CommonsChunkPlugin 与 ExtractTextPlugin](https://github.com/pfan123/front-end-navigator/issues/2)

[webpack插件开发](./webpack插件开发.md)

[vue数据更新， 视图未更新](https://github.com/pfan123/front-end-navigator/issues/1)

[Vue 2.0组件通信](https://vuefe.cn/v2/guide/components.html#构成组件)

[Vuex2.0 状态管理](./Vuex2.0状态管理.md)

[Vue2.0 中 render 和 template 疑惑点](https://github.com/pfan123/front-end-navigator/issues/3)

[webpack 3: Official Release](https://medium.com/webpack/webpack-3-official-release-15fd2dd8f07b)

[webpack 2: Github](https://github.com/webpack/webpack)


## 参考案例

[腾讯前端导航](http://www.alloyteam.com/nav/)

[圈子](https://luuman.github.io/FrontEndGuide/V1/index.html#page_9)

[前端网址导航-haorooms导航](http://www.haorooms.com/nav)

## webpack更新构建优化

[webpack-uglify-parallel](https://github.com/tradingview/webpack-uglify-parallel)多线程并行压缩代码，提高效率
```
- new webpack.optimize.UglifyJsPlugin({
-   exclude:/\.min\.js$/
-   mangle:true,
-   compress: { warnings: false },
-   output: { comments: false }
- })

+ new UglifyJsParallelPlugin({
+  workers: os.cpus().length,
+  mangle: true,
+  compressor: {
+    warnings: false,
+    drop_console: true,
+    drop_debugger: true
+   }
+ })

```
[webpack-bundle-analyzer](https://github.com/th0r/webpack-bundle-analyzer)将内容束展示为方便交互的树状图的Webpack插件和CLI实用工具。

[DllPlugin 与 DllReferencePlugin](https://webpack.js.org/plugins/dll-plugin/)
使用DllPlugin和DllReferencePlugin预编译, 通过前置这些依赖包的构建，来提高真正的 build 和 rebuild 的构建效率。

```
new webpack.DllPlugin({
    path: path.join(APP_PATH, 'manifest.json'),
	name: "[name]_library",
	context: __dirname
})

new webpack.DllReferencePlugin({
	context: __dirname,
	manifest: require(path.join(APP_PATH, 'manifest.json'))
})
```

[sw-precache-webpack-plugin](https://github.com/goldhand/sw-precache-webpack-plugin)工具，生成service-worker caches列表

[sw-toolbox](https://github.com/GoogleChrome/sw-toolbox) 预缓存 Precaching，构建阶段检测任何本地资源是否已更改，自动更新缓存列表

[sw-precache](https://github.com/GoogleChrome/sw-precache) 运行时缓存 Runtime caching，不提供额外的缓存更新机制，需要设置匹配文件的请求并使用适当的处理
   程序的路由

## 更新升级到webpack 3.1

`问题1`：
>DeprecationWarning: Chunk.modules is deprecated. Use Chunk.getNumberOfModules/mapModules/forEachModule/containsModule instead.
>错误是由于 extract-text-webpack-plugin 引起，由于webpack升级到3.0之后，改变了引入extract-text-webpack-plugin参数的形式， 解决方案 [升级 webpack@3.1.0 + extract-text-webpack-plugin@3.0.0](https://github.com/webpack-contrib/extract-text-webpack-plugin/issues/529), 同时更改[extract-text-webpack-plugin](https://github.com/webpack-contrib/extract-text-webpack-plugin)参数方式

`问题2`：
>parseQuery() will be replaced with getOptions() in the next major version of loader-utils
>此问题，是在`babel-loader@6.x`里面出现由`file-loader or url-loader`导致，更新到`babel-loader@7.x`可以解决 

`问题3`：
> 由于 Babel 默认只转换转各种 ES2015 语法，而不转换新的 API，比如 Promise，以及Object.assign、Array.from 这些新方法，这时我们需要提供一些 ployfill 来模拟出这样一个提供原生支持功能的浏览器环境。
>主要有两种方式：babel-runtime 和 babel-polyfill

`问题4`：
>引入[happypack](https://github.com/amireh/happypack)多进程构建，提升构建效率。配置 new HappyPack， 提示报错HappyPack: plugin for the loader '1' could not be found
>必须要增加new HappyPack({id:1})，有点不明白
>解决问题，是由于替换当前loader未去掉其中options导致
```
test: /\.js$/,
exclude: /node_modules/,  //排除node_modules文件夹
use: {
  loader: 'happypack/loader?id=js'
-  options: {
-     presets: ['es2015','stage-2']
-  }
},  

new HappyPack({
	id: 'js',
	//注意参数
+	loaders: [ 'babel-loader?cacheDirectory=true&presets[]=es2015&presets[]=stage-2' ],  
	threadPool: happyThreadPool,
	cache: true,
	verbose: true        
})          

```

`问题5`： 
> 在linux下执行sh文件时提示下面信息： -bash: ./xx.sh: Permission denied
> 出现情况是由于，文件权限导致，chmod 777 xx.sh即可

`问题6`：

vue.common.js 与 vue.runtime.js 区别

- 独立构建包括编译和支持 template 选项。 它也依赖于浏览器的接口的存在，所以你不能使用它来为服务器端渲染。

  ```
  <div id="app">
  	<banner></banner>
  	<contain></contain>
  </div>
  ```

- 运行时构建不包括模板编译，不支持 template 选项。运行时构建，可以用 render 选项，但它只在单文件组件中起作用，因为单文件组件的模板是在构建时预编译到 render 函数中，运行时构建只有独立构建大小的 30%，只有 16Kb min+gzip 大小。

```
<div id="app">
</div>
import APP from './app.vue'
new Vue({
  render: (createElement) => {
    return createElement(APP)
  }
}).$mount('#app')
```


[基于webpack Code Splitting实现react组件的按需加载](https://zhuanlan.zhihu.com/p/26228500)

[Babel下的ES6兼容性与规范](http://imweb.io/topic/561f9352883ae3ed25e400f5)

[使用 ES6 的浏览器兼容性问题](https://zhuanlan.zhihu.com/p/20904140)

[Bable polyfill](https://babeljs.io/docs/usage/polyfill/)

[Babel polyfill 知多少](https://zhuanlan.zhihu.com/p/29058936)

[Babel 用户手册](https://github.com/thejameskyle/babel-handbook/blob/master/translations/zh-Hans/user-handbook.md)

## License

This content is released under the [MIT](http://opensource.org/licenses/MIT)  License.
