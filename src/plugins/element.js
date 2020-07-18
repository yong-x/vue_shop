/* 由于element是按需导入的，所以必须按照es6模块规范导入要用到的element组件,并且使用Vue.use把它们注册为vue的全局组件 */
import Vue from 'vue'
import { Button, Form, FormItem, Input, Message } from 'element-ui'
/* 注册作为vue的全局组件,使所有vue组件中均可使用 */
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$message=Message //使每个vue组件可以通过this.$message进行调用
