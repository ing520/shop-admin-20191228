<template>
  <div class="login">
    <el-form :model="form" label-width="80px" ref="form" :rules="rules" status-icon>
      <img class="inco" src="../assets/avatar.jpg" alt>
      <el-form-item label="用户名" prop="username">
        <el-input placeholder="请输入用户名" v-model="form.username" @keyup.enter.native="login"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          placeholder="请输入密码"
          type="password"
          v-model="form.password "
          @keyup.enter.native="login"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="btn-one" @click="login">登录</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: ['blur', 'change']
          },
          {
            min: 3,
            max: 12,
            message: '长度在 3 到 12 个字符',
            trigger: ['blur', 'change']
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: ['blur', 'change']
          },
          {
            min: 3,
            max: 12,
            message: '长度在 3 到 12 个字符',
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  methods: {
    resetForm () {
      /*
       属性是变量的话用中括号语法
       @click="resetForm('form')"
      resetForm (formName){
        this.$refs[formName].resetFields()
      }
      */
      this.$refs.form.resetFields()
    },
    async login () {
      // 非空校验
      // 先拿到from表单组件，在调用组件的方法
      // validate不传参，则会返回一个 promise对象
      try {
        await this.$refs.form.validate()
        console.log('只要到这就是成功了')
        const res = await this.$axios.post('login', this.form)
        const { meta, data } = res
        console.log(data)

        if (meta.status === 200) {
          // ajax成功之后，服务器响应并将token令牌返回存储到localStorage
          localStorage.setItem('token', data.token)
          this.$message({
            type: 'success',
            message: meta.msg,
            duration: 1000
          })
          this.$router.push('/index')
        } else {
          this.$message({
            message: meta.msg,
            type: 'error'
          })
        }
      } catch (e) {
        console.log(e)
      }

      // this.$refs.form.validate(isValid => {
      //   if (!isValid) return
      //   console.log('发送ajax')
      //   this.$axios.post('login', this.form).then(res => {
      //     console.log(res)
      //     const { meta, data } = res
      //     if (meta.status === 200) {
      //       // ajax成功之后，服务器响应并将token令牌返回存储到localStorage
      //       localStorage.setItem('token', data.token)
      //       this.$message({
      //         type: 'success',
      //         message: meta.msg,
      //         duration: 1000
      //       })
      //       this.$router.push('/index')
      //     } else {
      //       this.$message({
      //         message: meta.msg,
      //         type: 'error'
      //       })
      //     }
      //   })
      // })
    }
  }
}
</script>

<style lang='scss' scoped>
.login {
  overflow: hidden;
  height: 100%;
  width: 100%;
  background-color: #2d434c;
  .el-form {
    background-color: white;
    margin: 0 auto;
    margin-top: 200px;
    padding: 20px;
    padding-top: 70px;
    width: 440px;
    border-radius: 20px;
    position: relative;
    .inco {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: -70px;
      border-radius: 50%;
      border: 5px solid #fff;
    }
    .btn-one {
      margin-right: 70px;
    }
  }
}
</style>
