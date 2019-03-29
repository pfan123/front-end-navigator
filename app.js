//https://segmentfault.com/a/1190000004883199  为 Koa 框架封装 webpack-dev-middleware 中间件

const Koa = require('koa')
const serve = require('koa-static')
const app = new Koa()

const webpack = require('webpack')
const proxyMiddleware = require('http-proxy-middleware')
const history = require('connect-history-api-fallback')
const port = 9999

//connect-history-api-fallback 中间件，转换为koa2中间件
const koaHistory = (opts) => {
	return async (ctx, next) => {
		new Promise( (resolve, reject) => {
			try{
				history(opts)(ctx.req, ctx.res, () => {
					//resolve.bind(null, true)
					resolve(true)
				})
			}catch(error){
				reject(error)
			}		
		})

		await next()
	}	
}

//https://github.com/leecade/koa-webpack-middleware
const { devMiddleware, hotMiddleware } = require('koa-webpack-middleware')


// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
const webpackConfig = process.env.NODE_ENV === 'production'
  ? require('./webpack.prod.config.js')
  : require('./webpack.dev.config.js')
const compiler = webpack(webpackConfig)

app.use(serve('./dist/'));

app.use(koaHistory())

//https://github.com/webpack/webpack-dev-middleware
app.use(devMiddleware(compiler, {
    // display no info to console (only warnings and errors)
    noInfo: false,

    // display nothing to the console
    quiet: false,

    // watch options (only lazy: false)
    watchOptions: {
        aggregateTimeout: 300,
        poll: true
    },

    // public path to bind the middleware to
    // use the same as in webpack
    //publicPath: "/assets/",
    publicPath: webpackConfig.output.publicPath,

    // custom headers
    headers: { "X-Custom-Header": "yes" },

    // options for formating the statistics
    stats: {
        colors: true
    }
}))

//https://github.com/glenjamin/webpack-hot-middleware
app.use(hotMiddleware(compiler, {
  log: console.log,
  path: '/__webpack_hmr',
  heartbeat: 10 * 1000
}))


// const render = page => {
// 	return new Promise( (resolve, reject) => {
// 	    let viewUrl = `./view/${page}`
// 	    fs.readFile(viewUrl, "binary", ( err, data ) => {
// 	      if ( err ) {
// 	        reject( err )
// 	      } else {
// 	        resolve( data )
// 	      }
// 	    })		
// 	})
// }

// const defineRoute = async( url ) => {
// 	let view = '404.html'
// 	switch (url) {
// 	    case '/':
// 	      view = 'index.html'
// 	      break
// 	    case '/index':
// 	      view = 'index.html'
// 	      break		      
// 	}
// 	return await render( view )
// }

app.listen(port, () => {
	console.log("the server is starting at port " + port)
})



