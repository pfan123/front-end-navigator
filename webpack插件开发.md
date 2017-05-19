##webpack插件开发

插件向第三方开发者提供了 `webpack` 引擎中完整的能力。使用阶段式的构建回调，开发者可以引入它们自己的行为到 `webpack` 构建流程中。创建插件比创建 `loader` 更加高级，需要理解一些 `webpack` 底层的内部特性来做相应的勾子。

## 创建插件

webpack插件的组成：

- 一个JavaScript命名函数
- 在它的原型上定义一个apply方法
- 指定挂载的webpack事件钩子
- 处理webpack内部实例的特定数据
- 功能完成后调用webpack提供的回调

```
// 命名函数
function MyExampleWebpackPlugin() {

};

// 在它的 prototype 上定义一个 `apply` 方法。
MyExampleWebpackPlugin.prototype.apply = function(compiler) {
  // 指定挂载的webpack事件钩子。
  compiler.plugin('webpacksEventHook', function(compilation /* 处理webpack内部实例的特定数据。*/, callback) {
    console.log("This is an example plugin!!!");

    // 功能完成后调用webpack提供的回调。
    callback();
  });
};
```

## 编译器 `Compiler` 和编译 `Compilation`

在插件开发中最重要的两个资源就是 compiler 和 compilation 对象。理解它们的角色是扩展 webpack 引擎重要的第一步。

### Compiler

`compiler` 对象代表了完整的 webpack 环境配置。这个对象在启动 webpack 时被一次性建立，并在所有可操作的设置中被配置，包括原始配置，loader 和插件。当在 webpack 环境中应用一个插件时，插件将收到一个编译器对象的引用。可以使用它来访问 webpack 的主环境。

webpack 的实际入口是 Compiler 中的 run 方法，run 一旦执行后，就开始了编译和构建流程 ，其中有几个比较关键的 webpack 事件节点。

```
compile 开始编译
make 从入口点分析模块及其依赖的模块，创建这些模块对象
build-module 构建模块
after-compile 完成构建
seal 封装构建结果
emit 把各个chunk输出到结果文件
after-emit 完成输出
```

### Compilation

`compilation` 对象代表了一次单一的版本构建和生成资源, 继承于compiler。当运行 webpack 开发环境中间件时，每当检测到一个文件变化，一次新的编译将被创建，从而生成一组新的编译资源。一个编译对象表现了当前的模块资源、编译生成资源、变化的文件、以及被跟踪依赖的状态信息。编译对象也提供了很多关键点回调供插件做自定义处理时选择使用。

常用 `compilation.assets`属性

这两个成员是任何 webpack 插件不可或缺的部分（特别是 `compilation`），如果开发者阅读它们的源码并进行熟悉，将获益匪浅：

- [Compiler Source](https://github.com/webpack/webpack/blob/master/lib/Compiler.js)
- [Compilation Source](https://github.com/webpack/webpack/blob/master/lib/Compilation.js)


## 基本插件架构

插件都是被实例化的带有 `apply` 原型方法的对象。这个 `apply` 方法在安装插件时将被 webpack 编译器调用一次。`apply` 方法提供了一个对应的编译器对象的引用，从而可以访问到相关的编译器回调。一个简单的插件结构如下：

```
function HelloWorldPlugin(options) {
  // 使用配置（options）设置插件实例
}

HelloWorldPlugin.prototype.apply = function(compiler) {
  compiler.plugin('done', function() {
    console.log('Hello World!');
  });
};

module.exports = HelloWorldPlugin;
```

然后要安装这个插件，只需要在你的 webpack 配置的 `plugin` 数组中加入一个实例：

```
var HelloWorldPlugin = require('hello-world');

var webpackConfig = {
  // ... 这里是其他配置 ...
  plugins: [
    new HelloWorldPlugin({options: true})
  ]
};
```

## 访问编译

使用编译器对象时，你可以绑定提供了编译对象引用的回调拿到每次新的编译对象。这些编译对象提供了构建流程中很多步骤的回调来做勾子。

```
//构造函数
function HelloCompilationPlugin(options) {}

//原型方法
HelloCompilationPlugin.prototype.apply = function(compiler) {

  compiler.plugin("compile", function(params) {
    console.log("The compiler is starting to compile...");
  });

  // 设置回调来访问编译对象：
  compiler.plugin("compilation", function(compilation) {
    console.log("The compiler is starting a new compilation...");

	// 现在设置回调来访问编译中的步骤：
    compilation.plugin("optimize", function() {
      console.log("The compilation is starting to optimize files...");
    });
  });

  compiler.plugin("emit", function(compilation, callback) {
    console.log("The compilation is going to emit files...");
    callback();
  });

};

module.exports = HelloCompilationPlugin;
```

## 异步编译插件

有一些编译插件中的步骤是异步的，这样要传递一个回调函数，并且在插件运行结束时回调必须被调用。

```
function HelloAsyncPlugin(options) {}

HelloAsyncPlugin.prototype.apply = function(compiler) {
  compiler.plugin("emit", function(compilation, callback) {

    // 做一些异步处理……
    setTimeout(function() {
      console.log("Done with async work...");
      callback();
    }, 1000);

  });
};

module.exports = HelloAsyncPlugin;
```

参考资料：

[HOW TO WRITE A PLUGIN](https://webpack.github.io/docs/how-to-write-a-plugin.html)

[Compiler](https://webpack.js.org/api/plugins/compiler/)

[Compilation](https://webpack.js.org/api/plugins/compilation/)

[如何编写一个插件？](https://doc.webpack-china.org/development/how-to-write-a-plugin/)

[如何编写一个 loader？](https://doc.webpack-china.org/development/how-to-write-a-loader/)

[如何写一个webpack插件（一）](https://github.com/lcxfs1991/blog/issues/1)

[细说 webpack 之流程篇](http://taobaofed.org/blog/2016/09/09/webpack-flow/)
