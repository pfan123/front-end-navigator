const path = require('path')

//webpack打包，静态资源转存
function staticToBuild(opts) {
  this.dir = opts.dir || ""  //生成路径前缀
  this.regex = opts.regex || "" //匹配静态资源规则
}

//now you have access to all the compiler instance methods
staticToBuild.prototype.apply = function (compiler, callback) {
    let _this = this

    compiler.plugin("make",  (compilation, callback) => {
        // some code here
        callback();  // 异步回调，跟gulp类似
    });
    console.log("**************************************")
    //即将准备生成文件
    compiler.plugin("emit",  (compilation, callback) => { 
      console.log("**************************************")
      
      // compilation.chunks.forEach( (chunk) => {
      //     console.log("chunk.files", chunk.files)
      // } )
      
      // compilation.assets["/app/doc/images/logo.png"] = compilation.assets["./images/logo.png"] 
      let _assets = {}
      for(let key in compilation.assets){
          if(_this.regex.test(key)){
            let dir = path.join(_this.dir, key.replace(_this.dir, ''))
            _assets[""+dir] = compilation.assets[key]
            console.log("compilation.assets", key)
          }else{
            _assets[key] = compilation.assets[key]
          }
      }

      compilation.assets = _assets
      // console.log(compilation.assets)

      callback();
    });

    compiler.plugin("done",  (stats) => { 
      // console.log(compilation.assets)
      console.log("**************************************")
      // console.log("stats", stats)

    });
}


module.exports = staticToBuild