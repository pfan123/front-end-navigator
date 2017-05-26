## Vuex2.0 状态管理

在 Vue.js 中，提供了两种方式便于我们针对不同应用项目进行通信管理： 一、小型的单页项目采取组件之间的通信方式；二、开发大型单页应用通常采用Vuex2.0 状态机制实现通信。

### 组件之间的通信
在 Vue.js 中，父子组件的关系可以总结为 props down, events up 。父组件通过 props 向下传递数据给子组件，子组件通过 events 给父组件发送消息。

![vue2.0组件通信](http://img.pfan123.com/vue2.0/props-events.png)

### Vuex 是什么？

Vex 是一个专为 Vue.js 应用程序开发的`状态管理模式`。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的`单向数据流`方式发生变化。

#### 状态管理应用基本包含部分

- state，驱动应用的数据源；
- view，以声明方式将state映射到视图；
- actions，响应在view上的用户输入导致的状态变化。

![vuex2.0数据更新机制](http://img.pfan123.com/vue2.0/vuex.png)

[Vuex2.0官方文档](https://vuex.vuejs.org/zh-cn/state.html)

