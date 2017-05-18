import Vue from 'vue'
import AV from 'av'
import VueRouter from 'vue-router'
import App from './components/admin.vue'
import Login from './components/login.vue'
import Register from './components/register.vue'
import Edit from './components/edit.vue'
import {checkType, sessionPosition, unqie} from './utils/util'
import initLeanCloud from './utils/initLeanCloud'

// HMR interface
if(module.hot) {
  // Capture hot update
  module.hot.accept()
}

require('./sass/style.s.scss')

Vue.use(VueRouter)

const routes = [
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/edit', component: Edit },
  { path: '*', component: Login }
]

//https://github.com/vuejs/vue-router/blob/next/examples/scroll-behavior/app.js
const scrollBehavior =  (to, from, savedPosition) => {
  if (savedPosition) {
    return savedPosition
  } else {
    return { x: 0, y: 0 }
  }
}

// 3. 创建 router 实例，然后传 `routes` 配置
// 你还可以传别的配置参数, 不过先这么简单着吧。
const router = new VueRouter({
  // mode: 'history',
  scrollBehavior,
  routes // （缩写）相当于 routes: routes
})

new Vue({
  router,
  render: h => h(App)
}).$mount("#app")

// 该语句应该只声明一次
let username = "admin"
let password = "admin2243012345"

let user = new AV.User()
user.setUsername(username)
user.setPassword(password)




// user.signUp().then(function (loginedUser) {
// 	console.log(loginedUser)
// }, (function (error) {
// 	alert(JSON.stringify(error));
// }))
// userObject.save().then(function(testObject) {
// 	// 存储成功
// 	console.log("存储成功")
// }, function(error) {
// 	// 存储失败
// 	throw error
// });