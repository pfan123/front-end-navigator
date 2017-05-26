## Vuex2.0 状态管理

在 Vue.js 中，提供了两种方式便于我们针对不同应用项目进行通信管理： 一、小型的单页项目采取组件之间的通信方式；二、开发大型单页应用通常采用Vuex2.0 状态机制实现通信。

### 组件之间的通信
在 Vue.js 中，父子组件的关系可以总结为 props down, events up 。父组件通过 props 向下传递数据给子组件，子组件通过 events 给父组件发送消息。

![vue2.0组件通信](http://img.pfan123.com/vue2.0/props-events.png)

### Vuex 是什么？

Vex 是一个专为 Vue.js 应用程序开发的 `状态管理模式`。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的`单向数据流`方式发生变化。

#### 状态管理应用基本包含部分

- state，驱动应用的数据源；
- mutations，同步或异步操作 action 驱动 mutations (必须是同步函数) 更新 store.state 数据源；
- actions，响应在 view 上的用户输入导致的状态变化，
- getters，从 store 中的 state 中派生出一些状态。

![vuex2.0数据更新机制](http://img.pfan123.com/vue2.0/vuex.png)

### Vuex2.0 几大变化

#### 1. 更加语义化

- `dispatch`：表明有某些事件发生的意向（可能是异步操作产生的副作用），通常是使用在触发 action

```
methods:{
    Add : function(){
      this.$store.dispatch('ADD',2).then(function(resp){
          console.log(resp)
      })
    }
}

```

- `commit`：说明会使实际状态发生改变的同步操作，驱动 mutation 更新 state

```
actions:{
    "ADD" : function(store , param){
        return new Promise(function(resolve, reject) {
            store.commit('ADD',param)
            resolve("ok");
        })
    }
}
```

调用异步 API 和 分发多重 mutations 复杂例子：

```
actions: {
  checkout ({ commit, state }, products) {
    // 把当前购物车的物品备份起来
    const savedCartItems = [...state.cart.added]
    // 发出结账请求，然后乐观地清空购物车
    commit(types.CHECKOUT_REQUEST)
    // 购物 API 接受一个成功回调和一个失败回调
    shop.buyProducts(
      products,
      // 成功操作
      () => commit(types.CHECKOUT_SUCCESS),
      // 失败操作
      () => commit(types.CHECKOUT_FAILURE, savedCartItems)
    )
  }
}
```

>ps: vue1.x 触发 action 和 mutation 使用 dispatch

#### 2. Vue 组件中获得 Vuex 状态， computed 与 mapState

由于 Vuex 的状态存储是响应式的，从 store 实例中读取状态最简单的方法就是在[计算属性](https://cn.vuejs.org/v2/guide/computed.html)中返回某个状态：

- computed 计算属性

计算属性是为了解决模版内表达式的数据运算来的，能够计算缓存解藕代码。

在 Vuex 中，可以通过 computed 很方便的计算读取 store 实例中状态，store.state.count 变化的时, 都会重新求取计算属性，更新相关联的 DOM。

```
// 创建一个 Counter 组件

//全局状态单例，不推荐
const Counter = {
  template: `<div>{{ count }}</div>`,
  computed: {
    count () {
      return store.state.count
    }
  }
}

//局部状态单例，推荐，需store注册到根实例
const Counter = {
  template: `<div>{{ count }}</div>`,
  computed: {
    count () {
      return this.$store.state.count
    }
  }
}
```
每当 `store.state.count` 变化的时候, 都会重新求取计算属性，并且触发更新相关联的 DOM。

- mapState 辅助函数

当一个组件需要获取多个状态时候，将这些状态都声明为计算属性会有些重复和冗余。为了解决这个问题，我们可以使用 `mapState` 辅助函数帮助我们生成计算属性，让你少按几次键：

```
// 在单独构建的版本中辅助函数为 Vuex.mapState
import { mapState } from 'vuex'

export default {
  // ...
  computed: mapState({
    // 箭头函数可使代码更简练
    count: this.$store.state => state.count,

    // 传字符串参数 'count' 等同于 `state => state.count`
    countAlias: 'count',

    // 为了能够使用 `this` 获取局部状态，必须使用常规函数
    countPlusLocalState (state) {
      return this.$store.state.count + this.localCount
    }
  })
}
```

#### 3.mapActions 组件中分发 Action

在组件中使用 `this.$store.dispatch('xxx')` 分发 action，或者使用 `mapActions` 辅助函数将组件的 methods 映射为 `store.dispatch` 调用（需要先在根节点注入 `store`）

```
import { mapActions } from 'vuex'

export default {
  // ...
  methods: {
    ...mapActions([
      'increment' // 映射 this.increment() 为 this.$store.dispatch('increment')
    ]),
    ...mapActions({
      add: 'increment' // 映射 this.add() 为 this.$store.dispatch('increment')
    })
  }
}
```

#### 4.异步组合 Actions

Action 通常是异步的， store.dispatch 可以处理被触发的 action 的回调函数返回的 Promise，并且 `store.dispatch` 仍旧返回Promise，可知道 action 何时结束，方便组合多个 action 处理更加复杂的异步流程。

active 以往异步 promise 方式：

```
actions: {
  actionA ({ commit }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        commit('someMutation')
        resolve()
      }, 1000)
    })
  }
}
```

现在更好的方式可以：

```
//store里面形式
actions: {
  // ...
  actionB ({ dispatch, commit }) {
    return dispatch('actionA').then(() => {
      commit('someOtherMutation')
    })
  }
}

//组件里面形式
store.dispatch('actionA').then(() => {
  // ...
})
```

利用 [async / await](https://tc39.github.io/ecmascript-asyncawait/) 这个 JavaScript 即将到来的新特性，我们可以像这样组合 action

```
// 假设 getData() 和 getOtherData() 返回的是 Promise

actions: {
  async actionA ({ commit }) {
    commit('gotData', await getData())
  },
  async actionB ({ dispatch, commit }) {
    await dispatch('actionA') // 等待 actionA 完成
    commit('gotOtherData', await getOtherData())
  }
}
```

#### 5.Modules

由于使用单一状态树，应用的所有状态会集中到一个比较大的对象。当应用变得非常复杂时，store 对象就有可能变得相当臃肿。

为了解决以上问题，Vuex 允许我们将 store 分割成`模块（module）`。每个模块拥有自己的 state、mutation、action、getter、甚至是嵌套子模块——从上至下进行同样方式的分割：

```
const moduleA = {
  state: { ... },
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: { ... },
  mutations: { ... },
  actions: { ... }
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> moduleA 的状态
store.state.b // -> moduleB 的状态
```

##### 模块的局部状态

对于模块内部的 mutation 和 getter，接收的第一个参数是`模块的局部状态对象`。
```
const moduleA = {
  state: { count: 0 },
  mutations: {
    increment (state) {
      // 这里的 `state` 对象是模块的局部状态
      state.count++
    }
  },

  getters: {
    doubleCount (state) {
      return state.count * 2
    }
  }
}
```

同样，对于模块内部的 action，局部状态通过 `context.state` 暴露出来， 根节点状态则为 `context.rootState`：

```
const moduleA = {
  // ...
  actions: {
    incrementIfOddOnRootSum ({ state, commit, rootState }) {
      if ((state.count + rootState.count) % 2 === 1) {
        commit('increment')
      }
    }
  }
}
```

对于模块内部的 getter，根节点状态会作为第三个参数暴露出来：

```
const moduleA = {
  // ...
  getters: {
    sumWithRootCount (state, getters, rootState) {
      return state.count + rootState.count
    }
  }
}

```

##### 命名空间

默认情况下，模块内部的 action、mutation 和 getter 是注册在全局命名空间的——这样使得多个模块能够对同一 mutation 或 action 作出响应。如果希望你的模块更加自包含或提高可重用性，你可以通过添加 namespaced: true 的方式使其成为命名空间模块。当模块被注册后，它的所有 getter、action 及 mutation 都会自动根据模块注册的路径调整命名。例如：


```
const store = new Vuex.Store({
  modules: {
    account: {
      namespaced: true,
      // 模块内容（module assets）
      state: { ... }, // 模块内的状态已经是嵌套的了，使用 `namespaced` 属性不会对其产生影响
      getters: {
        isAdmin () { ... } // -> getters['account/isAdmin']
      },
      actions: {
        login () { ... } // -> dispatch('account/login')
      },
      mutations: {
        login () { ... } // -> commit('account/login')
      },
      // 嵌套模块
      modules: {
        // 继承父模块的命名空间
        myPage: {
          state: { ... },
          getters: {
            profile () { ... } // -> getters['account/profile']
          }
        },
        // 进一步嵌套命名空间
        posts: {
          namespaced: true,
          state: { ... },
          getters: {
            popular () { ... } // -> getters['account/posts/popular']
          }
        }
      }
    }
  }
})
```

#### 6.模块动态注册

在 store 创建之后，你可以使用 `store.registerModule` 方法注册模块：

```
// 注册模块 `myModule`
store.registerModule('myModule', {
  // ...
})
// 注册嵌套模块 `nested/myModule`
store.registerModule(['nested', 'myModule'], {
  // ...
})
```
之后就可以通过 store.state.myModule 和 store.state.nested.myModule 访问模块的状态。

参考资料：

[Vuex2.0官方文档](https://vuex.vuejs.org/zh-cn/state.html)

[Vuex2.0 design](https://github.com/vuejs/vuex/issues/236)

