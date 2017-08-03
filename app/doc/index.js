// vue本身是带热刷新的 https://github.com/vuejs/vue-hot-reload-api
import styles from "./sass/style.s.scss"
import Vue from 'vue'
import axios from 'axios'
//https://github.com/imcvampire/vue-axios
import VueAxios from 'vue-axios'
import AV from 'av'
import VueResource from 'vue-resource'
import sideLeftNav from './components/sideLeftNav.vue'
import mainContent from './components/mainContent.vue'
import {checkType, sessionPosition, unqie} from './utils/util'
// import {data} from './mock/data.js'
import initLeanCloud from './utils/initLeanCloud'

import "babel-polyfill"

//注册 Service Worker 来启动安装
window.addEventListener("load", () => {
  navigator.serviceWorker && navigator.serviceWorker.register('/service-worker.js').then(() => {
      navigator.serviceWorker.addEventListener('message', e => {
          if (e.data === 'sw.update') {
            window.location.reload()
          }
      })
  })  
})

// HMR interface
if(module.hot) {
  // Capture hot update
  module.hot.accept()
}

// Vue.use(VueResource)
// Vue.use(VueAxios, axios)

window.middleVue = new Vue()

//vm.$el属性 elementOrSelector，元素或选择器
const vmHeader = new Vue({
  el: '[vm-mod="sideLeftNav"]', 
  // render: h => h(App) render是替代template字符串拼接形式推荐使用
 // render: (createElement) => {
 //   //createElement 函数中生成模板, 可通过组件生成
 // 	 return createElement(sideLeftNav)
 // 	// return createElement('div',  Array.apply(null, { length: 20 }).map(function () {
 // 	// 	console.log(createElement('p', 'hi1'))
 //  //     return createElement('p', 'hi1')
 //  //   }))
 // },
 template: '<side-left-nav></side-left-nav>',

 components: {
  "side-left-nav": sideLeftNav
 },

 created: () => {
  console.log("开始创建")
 }
})

const vmMain = new Vue({
  // render: h => h(App)
 render: (createElement) => {
 	 return createElement(mainContent)
 }
}).$mount('[vm-mod="mainContent"]')

window.response = ''

// vue-resource https://etianqq.gitbooks.io/vue2/content/chapter2-vue-resource/api.html
// Vue.http.get('/api/index', '').then( (response) => {
// 	window.response = response.data.list
// }, (e)=>{ throw e})

// Vue.axios.get('/api/index').then((response) => {
//   console.log(response.data)
// })

// 声明类型
let DataTypeDoc = AV.Object.extend('DataTypeDoc');

let objects = []

let data = []

data.map( (item) => {
  var dataTypeDoc = new DataTypeDoc();
  // 设置名称
  dataTypeDoc.set('cateTitle', item.cateTitle);
  // 设置优先级
  dataTypeDoc.set('title', item.title);
  dataTypeDoc.set('detail', item.detail);
  dataTypeDoc.set("image", item.image);
  dataTypeDoc.set('link', item.link);
  objects.push(dataTypeDoc)
} )
 // 批量创建（更新）
// AV.Object.saveAll(objects).then(function (objects) {
//   // 成功
//   console.log("批量添加成功")
// }, function (error) {
//   // 异常处理
// });

let query = new AV.Query('DataTypeDoc')
query.ascending('createdAt')
query.limit(1000)  //查询数据默认设置100条
query.find().then(function (json) {
     json = JSON.parse( JSON.stringify(json, null, 4) )

     let cateArr = []
     let docData = []
     json.map( (item) => {
     	cateArr.push(item.cateTitle)
     })

     cateArr = unqie(cateArr)
     
     cateArr.map((item, idx) => {
     	docData[idx] = {"cateTitle": item, data: []}
	    json.map( (cell) => {
	    	if(cell.cateTitle == item){
	    		docData[idx].data.push({
	    			'title': cell.title,
	    			'detail': cell.detail,
	    			'link': cell.link,
	    			'image': cell.image,
	    			'objectId': cell.objectId,
	    			'createdAt': cell.createdAt,
	    			'updatedAt': cell.updatedAt
	    		})
	    	}
	    })     	
     })

     // console.log(docData)
     window.response = docData
  }).catch(function(error) {
    alert(JSON.stringify(error));
  })


