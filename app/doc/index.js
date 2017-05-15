// vue本身是带热刷新的 https://github.com/vuejs/vue-hot-reload-api
import styles from "./sass/style.s.scss"
// require('./sass/style.s.scss')
import Vue from 'vue'
import VueResource from 'vue-resource'
import sideLeftNav from './components/sideLeftNav.vue'
import mainContent from './components/mainContent.vue'
import {checkType, sessionPosition, unqie} from './utils/util'
import initLeanCloud from './utils/initLeanCloud'


// HMR interface
if(module.hot) {
  // Capture hot update
  module.hot.accept()
}

Vue.use(VueResource)
// console.log(styles)

window.middleVue = new Vue()

//vm.$el属性 elementOrSelector，元素或选择器
const vmHeader = new Vue({
  el: '[vm-mod="sideLeftNav"]', 
  // render: h => h(App)
 render: (createElement) => {
 	 return createElement(sideLeftNav)
 	// return createElement('div',  Array.apply(null, { length: 20 }).map(function () {
 	// 	console.log(createElement('p', 'hi1'))
  //     return createElement('p', 'hi1')
  //   }))
 }
})

const vmMain = new Vue({
  // render: h => h(App)
 render: (createElement) => {
 	 return createElement(mainContent)
 }
}).$mount('[vm-mod="mainContent"]')

console.log(new checkType().isArray([1,2]))

window.response = ''

// vue-resource https://etianqq.gitbooks.io/vue2/content/chapter2-vue-resource/api.html
// Vue.http.get('/api/index', '').then( (response) => {
// 	window.response = response.data.list
// }, (e)=>{ throw e})

// 声明类型
let DataTypeDoc = AV.Object.extend('DataTypeDoc');
// 新建对象
let dataTypeDoc = new DataTypeDoc();
// 设置名称
dataTypeDoc.set('cateTitle','TOOL');
// 设置优先级
dataTypeDoc.set('title','vue文档11');
dataTypeDoc.set('detail','vue文档');
dataTypeDoc.set("image", "xx.jpg");
dataTypeDoc.set('link','https://github.com/pfan123/mobile-web-favorites');
// dataTypeDoc.save().then(function (todo) {
//   console.log('objectId is ' + todo);
// }, function (error) {
//   console.error(error);
// });


let query = new AV.Query('DataTypeDoc');
query.ascending('createdAt');
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


