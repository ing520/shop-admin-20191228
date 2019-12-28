<template>
  <el-container class="index">
    <el-header>
      <div class="logo">
        <img src="../assets/logo.png" alt>
      </div>
      <div class="head-m">
        <h3>电商后台管理系统</h3>
      </div>
      <div class="head-r">
        欢迎光临~
        <span @click="del">退出</span>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <!--  默认高亮default-active 动态属性渲染 -->
        <el-menu
          :default-active='highLight'
          router
          unique-opened
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-submenu :index="item.path" v-for="item in list" :key="item.id">
            <template v-slot:title>
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="item2.path" v-for="item2 in item.children" :key="item2.id">
              <i class="el-icon-menu"></i>
              <span slot="title">{{item2.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      list: []
    }
  },
  computed: {
    highLight () {
      // console.log(this.$route.path)
      return this.$route.path.slice(1).split('-')[0]
    }
  },
  async created () {
    const { meta, data } = await this.$axios.get(`menus`)
    // console.log(meta, data)
    if (meta.status === 200) {
      this.list = data
      console.log(this.list)
    } else {
      this.$message.error(meta.msg)
    }
  },
  methods: {
    del () {
      this.$confirm('确定要退出吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          localStorage.removeItem('token')
          this.$router.push('/login')
          this.$message({
            type: 'success',
            message: '退出成功!'
          })
        })
        .catch(e => {
          console.log(e)
        })
    }
  }
}
</script>

<style lang='scss' scoped>
.index {
  height: 100%;
  .el-header {
    display: flex;
    height: 60px;
    background: #d8d8d8;
    .logo {
      width: 200px;
      padding: 10px;
      img {
        height: 40px;
      }
    }
    .head-m {
      text-align: center;
      line-height: 60px;
      flex: 1;
    }
    .head-r {
      width: 200px;
      padding: 10px;
      font-weight: 700;
      line-height: 40px;
      text-align: right;
      span {
        color: orange;
      }
    }
  }
  .el-aside {
    background-color: #545c64;
  }
  .el-main {
    background-color: #ecf0f1;
  }
  .el-aside {
    .el-menu {
      border: none;
    }
  }
}
</style>
