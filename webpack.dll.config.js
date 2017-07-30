const path = require('path')
const os = require("os")
const webpack = require('webpack')
const UglifyJsParallelPlugin = require('webpack-uglify-parallel')

//配置启动项目
const APP_NAME = "doc"
//项目静态资源路径
const APP_PATH = path.join(__dirname, 'app', APP_NAME)

const vendors = [
    'vue/dist/vue.common.js',
    'axios',
    'vue-axios',
    'vue-resource'
]

//DllPlugin 与 DllReferencePlugin https://webpack.js.org/plugins/dll-plugin/
module.exports = {
	cache: true,
    entry: {
        bundle: vendors
    },
    output: {
        path: path.resolve(__dirname, 'dist/'),
        filename: '[name].dll.js',
        library: '[name]_library' // 暴露出的全局变量名
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.join(APP_PATH, 'manifest.json'),
			name: "[name]_library",
			context: __dirname
        }),
	    new UglifyJsParallelPlugin({
	      workers: os.cpus().length,
	      mangle: true,
	      compressor: {
	        warnings: false,
	        drop_console: true,
	        drop_debugger: true
	       }
	    })
    ]
}
