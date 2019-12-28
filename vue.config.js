module.exports = {
  devServer: {
    open: true,
    port: 3000,
    proxy: {
      // /sss 会匹配到http://localhost:8888/api/private/sss/v1/
      // 去掉/sss路径重写后
      // /sss  =》http://localhost:8888/api/private/sss/v1/

      '/sss': {
        target: 'http://localhost:8888/api/private/v1/',
        pathRewrite: { '^/sss': '' }
      }
    }
  },
  // 配置webpack
  // 配置排除项，导入时，就直接找全局的Vue,VueRouter
  configureWebpack: {
    // 配置打包的排除项, 从外部引入
    // import Vue from 'vue'
    // import VueRouter from 'vue-router'
    // 当配置了排除项后, 导入时, 就直接找全局的 Vue, VueRouter
    externals: {
      // 包名: 全局变量名
      vue: 'Vue',
      'vue-router': 'VueRouter',
      'element-ui': 'ELEMENT'
    }
  }
}
