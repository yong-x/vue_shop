import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式文件
import './assets/css/global.css'
// 导入axios用于发起http异步请求，并且将axios挂载到Vue原型上，使所有vue组件都可以通过this.$http.get()发起请求
import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:8848' //配置所有axios的全局请求根路径
Vue.prototype.$http = axios

//axios.post('/login',{username:'zhangsna'}).then(res=>console.log(res))

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
