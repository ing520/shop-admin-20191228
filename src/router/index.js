import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../components/Login.vue'
// import Index from '../components/Index.vue'
// import Users from '../components/users/Users.vue'
// import Roles from '../components/rights/Roles.vue'
// import Rights from '../components/rights/Rights.vue'
// import Categories from '../components/products/Categories.vue'
// import Goods from '../components/products/Goods.vue'
// import GoodsAdd from '../components/products/GoodsAdd.vue'
// 进行分模块打包
const Login = () => import(/* webpackChunkName: 'index' */'../components/Login.vue')
const Index = () => import(/* webpackChunkName: 'index' */'../components/Index.vue')

const Users = () => import(/* webpackChunkName: 'users' */'../components/users/Users.vue')

const Roles = () => import(/* webpackChunkName: 'rights' */'../components/rights/Roles.vue')
const Rights = () => import(/* webpackChunkName: 'rights' */'../components/rights/Rights.vue')

const Categories = () => import(/* webpackChunkName: 'product' */'../components/products/Categories.vue')
const Goods = () => import(/* webpackChunkName: 'product' */'../components/products/Goods.vue')
const GoodsAdd = () => import(/* webpackChunkName: 'product' */'../components/products/GoodsAdd.vue')
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/index' },
  { path: '/login', component: Login },
  {
    path: '/index',
    component: Index,
    children: [
      { path: '/users', component: Users },
      { path: '/roles', component: Roles },
      { path: '/rights', component: Rights },
      { path: '/categories', component: Categories },
      { path: '/goods', component: Goods },
      { path: '/goods-add', component: GoodsAdd }
    ]
  }

]
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function (location) {
  return originalPush.call(this, location).catch(err => err)
}
const router = new VueRouter({
  routes
})
// 在路由跳转的时候，我们需要一些权限判断。这个时候就需要使用路由的钩子函数。
// to: Route: 即将要进入的目标 路由对象
// from: Route: 当前导航正要离开的路由
// next(): 进行管道中的下一个钩子。如果全部钩子执行完了，则导航的状态就是 confirmed (确认的)。
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  // console.log(to)
  if (to.path === '/login' || token) {
    next()
  } else {
    next('/login')
  }
})
export default router
