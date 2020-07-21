import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式文件
import './assets/css/global.css'
// 导入axios用于发起http异步请求，并且将axios挂载到Vue原型prototype上，使所有vue组件都可以通过this.$http.get()发起请求
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8848' //配置所有axios的全局请求根路径
axios.interceptors.request.use(req_config=>{  //为所有axios挂载请求拦截器，在请求头中添加token,前端的所有请求添加token，便于后端验证
  console.log('正在向服务器请求数据',req_config)
  req_config.headers.Authorization = window.sessionStorage.getItem('token')
  return req_config //最后必须return req_config，表示放行
})
Vue.prototype.$http = axios





Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
