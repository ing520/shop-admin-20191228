<template>
  <div class="users">
    <pp-button></pp-button>
    <g-button></g-button>
    <gButton></gButton>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="nav">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--查询数据 输入框  -->
    <el-input placeholder="请输入内容" v-model="query" class="input-with-select inputSearch">
      <el-button slot="append" icon="el-icon-search" @click="queryUser"></el-button>
    </el-input>
    <el-button type="success" plain @click="showAddBounce">添加用户</el-button>
    <!-- 表格 -->
    <el-table :data="userList" style="width: 100%">
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态">
        <!-- 作用域插槽，需要用到子组件中的数据（row=》相当于我们自己封装的v-for（item in list）item在子组件中） -->
        <template v-slot:default="obj">
          <!-- {{obj.row}}当前一行的数据 -->
          <el-switch
            v-model="obj.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeStatus(obj.row.id,obj.row.mg_state)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="{row}">
          <el-button
            size="mini"
            icon="el-icon-edit"
            type="primary"
            plain
            @click="showEditBounce(row)"
          ></el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            plain
            @click="delUsers(row.id)"
          ></el-button>
          <el-button
            plain
            size="small"
            icon="el-icon-check"
            type="success"
            @click="assignRoleDialog(row)"
          >分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!--
     @size-change="handleSizeChange" 一页几条数据改变触发
     @current-change="handleCurrentChange" 当前页数改变触发
    -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- （内部通过定位）点击添加-弹出的对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="40%" @close="closeDialog">
      <el-form ref="addForm" :model="addForm" label-width="80px" :rules="rules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile" placeholder="请输入手机"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editVisible" width="40%">
      <el-form ref="editForm" :model="editForm" label-width="80px" :rules="rules">
        <el-form-item label="用户名">
          <el-tag type="info">{{editForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="editForm.email" placeholder="请输入邮箱" prop="email"></el-input>
        </el-form-item>
        <el-form-item label="手机">
          <el-input v-model="editForm.mobile" placeholder="请输入手机号" prop="mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色的对话框 -->
    <el-dialog :model="assignForm" title="分配角色" :visible.sync="assignVisible" width="40%">
      <el-form label-width="80px">
        <el-form-item>
          <el-tag type="info">{{assignForm.username}}</el-tag>
        </el-form-item>
        <el-form-item>
          <!-- 绑定的value值就是将来要el-select显示的value值 -->
          <el-select v-model="assignForm.rid" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import PPButton from '../pp-button/pp-button'
export default {
  // 注册局部组件
  components: {
    'pp-button': PPButton
  },
  // vue组件也是vue实例，也有自己的生命周期函数
  created () {
    this.getUserList()
  },
  data () {
    return {
      userList: [],
      query: '',
      pagenum: 1,
      pagesize: 4,
      total: 0,
      dialogVisible: false,
      editVisible: false,
      editForm: {
        id: 0, // 存起来方便发axios
        username: '',
        email: '',
        mobile: ''
      },
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      assignVisible: false,
      options: [],
      assignForm: {
        username: '',
        rid: '',
        id: ''
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: ['blur', 'change']
          },
          // 确保和登录时的验证信息一致
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
          // 确保和登录时的验证信息一致
          {
            min: 3,
            max: 12,
            message: '长度在 3 到 12 个字符',
            trigger: ['blur', 'change']
          }
        ],
        email: [{ type: 'email', message: '请输入正确的邮箱格式' }],
        mobile: [{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确手机格式' }]
      }
    }
  },

  methods: {
    async getUserList () {
      const { meta, data } = await this.$axios.get('users', {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      if (meta.status === 200) {
        this.userList = data.users
        this.total = data.total
      } else {
        this.$message.error(meta.msg)
      }
      // this.$axios
      //   .get('users', {
      //     params: {
      //       query: this.query,
      //       pagenum: this.pagenum,
      //       pagesize: this.pagesize
      //     }
      //   })
      //   .then(res => {
      //     console.log(res)
      //     const { meta, data } = res
      //     if (meta.status === 200) {
      //       this.userList = data.users
      //       this.total = data.total
      //     } else {
      //       this.$message.error(meta.msg)
      //     }
      //   })
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pagesize = val
      // ！！！每次改变每页几条的时候，记得从第一页开始展示，以免出现没有那么多页 无数据的情况
      // 修改每页条数后，之前有些页码没有了，推荐从第一页开始展示
      this.pagenum = 1
      // 只 渲染当前页
      this.getUserList()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getUserList()
    },
    async delUsers (id) {
      try {
        await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          type: 'warning'
        })
        console.log('到这里ajax发送成功')
        const { meta } = await this.$axios.delete(`users/${id}`, {
          params: {
            id: id
          }
        })
        if (meta.status === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          // 当前页只有一条数据，删除后当前页--
          if (this.userList.length === 1 && this.pagenum > 1) {
            this.pagenum--
          }
          this.getUserList()
        }
      } catch (e) {
        console.log(e)
      }
    },
    queryUser () {
      // 保证从第一页开始渲染
      this.pagenum = 1
      // 会出现当前页（3）找不到数据的情况
      this.getUserList()
    },
    // 文档中，change事件参数默认参数，新状态的值,后来传参覆盖了默认值，仍要传参
    async changeStatus (id, flag) {
      const { meta } = await this.$axios.put(`users/${id}/state/${flag}`, {
        data: {
          uId: id,
          type: flag
        }
      })
      if (meta.status === 200) {
        this.$message.success('修改成功')
      } else {
        this.$message.error(meta.msg)
      }

      // this.$axios.put(`users/${id}/state/${flag}`, {
      //   data: {
      //     uId: id,
      //     type: flag
      //   }
      // }).then(res => {
      //   console.log(res)
      //   const { meta } = res
      //   if (meta.status === 200) {
      //     this.$message.success('修改成功')
      //   } else {
      //     this.$message.error(meta.msg)
      //   }
      // })
    },
    showAddBounce () {
      this.dialogVisible = true
    },
    async addUser () {
      try {
        await this.$refs.addForm.validate()
        console.log('到这则是成功')
        const { meta, data } = await this.$axios.post(`users`, this.addForm)
        console.log(data)

        if (meta.status === 201) {
          this.dialogVisible = false
          this.$message.success(meta.msg)
          // 看到最后一页，渲染最后一页
          // 添加一项之后要另一页展示，（加一页，改变数据）
          this.total++
          this.pagenum = Math.ceil(this.total / this.pagesize)

          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    closeDialog () {
      this.$refs.addForm.resetFields()
    },
    showEditBounce (obj) {
      this.editVisible = true
      this.editForm.username = obj.username
      this.editForm.email = obj.email
      this.editForm.mobile = obj.mobile
      this.editForm.id = obj.id
    },
    async editUser () {
      try {
        await this.$refs.editForm.validate()
        console.log('校验成功')
        const { meta, data } = await this.$axios.put(
          `users/${this.editForm.id}`,
          {
            id: this.editForm.id,
            email: this.editForm.email,
            mobile: this.editForm.mobile
          }
        )
        console.log(meta, data)
        if (meta.status === 200) {
          this.editVisible = false
          this.getUserList()
          this.$message.success(meta.msg)
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 分配角色
    async assignRoleDialog (row) {
      this.assignVisible = true
      // 1.回显
      // console.log(row)
      this.assignForm.username = row.username
      this.assignForm.id = row.id
      // 获取rid(回显rid)根据id获取其他rid
      const { meta, data } = await this.$axios.get(`users/${row.id}`)
      if (meta.status === 200) {
        this.assignForm.rid = data.rid === -1 ? '' : data.rid
        console.log(meta, data)
      } else {
        console.log(meta.msg)
      }
      // 渲染options,发送角色的axios
      const res = await this.$axios.get(`roles`)
      if (res.meta.status === 200) {
        console.log(res)
        this.options = res.data
      } else {
        console.log(res.meta.msg)
      }
    },
    async assignRole () {
      const { meta, data } = await this.$axios.put(
        `users/${this.assignForm.id}/role`,
        { rid: this.assignForm.rid }
      )
      console.log(meta, data)
      if (meta.status === 200) {
        this.assignVisible = false
        this.getUserList()
        this.$message.success(meta.msg)
      } else {
        this.$message.error(meta.msg)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.inputSearch {
  width: 300px;
  margin-right: 20px;
  margin-bottom: 20px;
}
</style>
