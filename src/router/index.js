import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    redirect: '/welcome',
    children: [
      {path:'/welcome', component: Welcome},
      {path:'/users', component: Users},
      {path: '/', redirect: '/welcome'},
      {path: '/rights', component: Rights},
      {path: '/roles', component: Roles}
    ]
  }
]

const router = new VueRouter({
  routes
})

//挂载路由导航守卫,在进行路由跳转之前进行检查，一般作权限检查
//to要跳转的目标路由，from表示从哪一个路由跳转而来，next是一个函数对象，表示放行。
router.beforeEach((to,from,next)=>{
  if(to.path==='/login') return next()
  //检查token是否存在
  const tokenstr=window.sessionStorage.getItem('token')
  if(!tokenstr) return next('/login') //token不存在跳转到登录页
  next() //token存在直接放行
})
//下面的代码解决重复点击菜单时报错  Avoided redundant navigation to current location
const originalPush = VueRouter.prototype.push
   VueRouter.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}
export default router
