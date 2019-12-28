// 不希望从node_modules中引入而是从全局Vue中引入,webpack中配置排除项
import Vue from 'vue'
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'

import App from './App.vue'
import router from './router'
import axios from 'axios'
import moment from 'moment'
import VueQuillEditor from 'vue-quill-editor'

// 自定义组件
// require styles
import gButton from './components/g-button/gButton.js'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 1.
import GButton from './components/g-button/g-button.vue'
Vue.component('g-button', GButton)
// 2.
Vue.use(gButton)
Vue.use(VueQuillEditor /* { default global options } */)
// 组件是可复用的vue实例，将axios挂载到Vue原型上，这样所有的vue实例都可以使用
Vue.prototype.$axios = axios
// 只要请求路径中包含/sss,就会被代理，自动匹配自己开启的服务器localhost:3000/sss
axios.defaults.baseURL = '/sss'
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么（统一带上token）
  config.headers.Authorization = localStorage.getItem('token')
  // console.log(config)
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})
// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么(对响应回来的数据进行处理)
  // console.log(response)
  // 1.返回的数据res  每次都要res.data
  response = response.data
  // 后台约定 token过期的状态码
  if (response.meta.status === 401) {
    response.meta.msg = '身份过期'
    // this.$router.push('/login')
    // 清除无效的token（更严谨一点）
    localStorage.removeItem('token')
    router.push('/login')
  }
  return response
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})
// 过滤器处理时间格式
Vue.filter('time', function (value) {
  return moment(value * 1000).format('YYYY-MM-DD HH:mm:ss')// 时间戳是秒转换成毫秒
})

Vue.config.productionTip = false
Vue.use(ElementUI)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
