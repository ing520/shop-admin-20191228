<template>
  <div class="roles">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="nav">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" plain @click="showAddRole">添加角色</el-button>
    <!-- 表格 -->
    <el-table :data="roleList" style="width:100%">
      <el-table-column type="expand">
        <!-- row代表每行角色
        角色下面是一级分类（每一行）[左侧：一级分类的名称，右侧：一级分类的内容]
        一级分类右侧[一级分类的内容]包括：二级分类（每一行）[左侧：二级分类的名称，右侧：二级分类的内容]
        二级分类的右侧[二级分类的内容]（每一行）包括三级分类（多行三级内容）
        -->
        <template v-slot:default="{row}">
          <!-- {{row.children}} -->
          <el-row v-for="item1 in row.children" :key="item1.id" class="row1">
            <el-col :span="4">
              <el-tag type="primary" closable @close="cancelTag(row,item1.id)">{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row v-for="item2 in item1.children" :key="item2.id" class="row2">
                <el-col :span="4">
                  <el-tag
                    type="success"
                    closable
                    @close="cancelTag(row,item2.id)"
                  >{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    type="warning"
                    closable
                    v-for="item3 in item2.children"
                    :key="item3.id"
                    class="row3"
                    @close="cancelTag(row,item3.id)"
                  >{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="{row}">
          <el-button type="primary" plain icon="el-icon-edit" @click="showEditRoleBounce(row)"></el-button>
          <el-button type="danger" plain icon="el-icon-delete" @click="delRoleBounce(row)"></el-button>
          <el-button type="success" plain icon="el-icon-check" @click="showRightsBounce(row)">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 删除角色 -->
    <el-dialog title="删除角色" :visible.sync="delRoleVisible">
      <template v-slot:default="footer" class="dialog-footer">
        <p>你确定要删除吗?</p>
        <el-button @click="delRoleVisible=false">取消</el-button>
        <el-button type="primary" @click="delRole">确定</el-button>
      </template>
    </el-dialog>
    <!-- 修改角色 !!!标志去除 -->
    <el-dialog title="修改角色" :visible.sync="editRoleVisible">
      <el-form ref="editRoleForm" :modal="editRoleForm" label-width="80px" :rules="rules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <el-button @click="editRoleVisible=false">取消</el-button>
      <el-button @click="editRole">确定</el-button>
    </el-dialog>
    <!-- 添加角色的弹框 -->
    <el-dialog title="添加角色" :visible.sync="addRoleVisible" @close="closeAddRole">
      <template v-slot:default="footer" class="dialog-footer">
        <el-form ref="addRoleForm" :model="addRoleForm" label-width="80px" :rules="rules">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addRoleForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addRoleForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <el-button @click="addRoleVisible=false">取消</el-button>
        <el-button type="primary" @click="addRole">确定</el-button>
      </template>
    </el-dialog>
    <!-- 分配权限 弹框 -->
    <el-dialog title="分配权限" :visible.sync="dialogVisible">
      <el-tree
        ref="tree"
        :data="data"
        show-checkbox
        default-expand-all
        node-key="id"
        :props="defaultProps"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      roleList: [],
      // 删除角色
      delRoleVisible: false,
      // 修改角色
      editRoleForm: {
        id: 0,
        roleName: '',
        roleDesc: ''
      },
      editRoleVisible: false,
      // 增加角色
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      addRoleVisible: false,
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: ['blur', 'change'] }
        ],
        roleDesc: [
          { required: true, message: '请输入角色名称', trigger: ['blur', 'change'] }
        ]
      },
      // 分配权限
      data: [],
      dialogVisible: false,
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      rowId: 0
    }
  },
  created () {
    this.rolesRender()
  },
  methods: {
    async rolesRender () {
      const { meta, data } = await this.$axios.get(`roles`)
      console.log(meta, data)
      if (meta.status === 200) {
        this.roleList = data
      } else {
        console.log(meta.msg)
      }
    },
    // 删除tag
    async cancelTag (row, rightId) {
      const { meta, data } = await this.$axios.delete(
        `roles/${row.id}/rights/${rightId}`
      )
      console.log(meta, data)
      if (meta.status === 200) {
        row.children = data
        this.$message.success(meta.msg)
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 添加角色
    showAddRole () {
      this.addRoleVisible = true
    },
    async addRole () {
      try {
        await this.$refs.addRoleForm.validate()
        const { meta, data } = await this.$axios.post(
          `roles`,
          this.addRoleForm
        )
        console.log(meta, data)
        if (meta.status === 201) {
          this.$message.success(meta.msg)
          this.addRoleVisible = false
          this.rolesRender()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    closeAddRole () {
      this.$refs.addRoleForm.resetFields()
    },
    showEditRoleBounce (row) {
      this.editRoleVisible = true
      this.editRoleForm.id = row.id
      this.editRoleForm.roleName = row.roleName
      this.editRoleForm.roleDesc = row.roleDesc
    },
    async editRole () {
      try {
        await this.$refs.editRoleForm.validate()
        const { meta, data } = await this.$axios.put(
          `roles/${this.editRoleForm.id}`,
          this.editRoleForm
        )
        console.log(meta, data)
        if (meta.status === 200) {
          this.editRoleVisible = false
          this.$message.success(meta.msg)
          this.rolesRender()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 删除角色弹框
    delRoleBounce (row) {
      this.delRoleVisible = true
      this.editRoleForm.id = row.id
    },
    async delRole () {
      console.log(this.editRoleForm.id)
      const { meta, data } = await this.$axios.delete(
        `roles/${this.editRoleForm.id}`
      )
      console.log(meta, data)
      if (meta.status === 200) {
        this.delRoleVisible = false
        this.$message.success(meta.msg)
        this.rolesRender()
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 分配权限
    async showRightsBounce (row) {
      this.rowId = row.id
      this.dialogVisible = true
      const { meta, data } = await this.$axios.get(`rights/tree`)
      console.log(meta, data)
      if (meta.status === 200) {
        this.data = data
        // 修改权限的回显
        const ids = []
        row.children.forEach(l1 => {
          // 拿到所有的一级
          l1.children.forEach(l2 => {
            // 拿到所有的二级
            l2.children.forEach(l3 => {
              // 拿到所有的三级
              ids.push(l3.id)
            })
          })
        })
        this.$refs.tree.setCheckedKeys(ids)
      } else {
        this.$message.error(meta.msg)
      }
    },
    async assignRole () {
      // 全选的和半选的都要
      const halfId = this.$refs.tree.getHalfCheckedKeys()
      const allId = this.$refs.tree.getCheckedKeys()
      const rids = [...halfId, ...allId].join(',')
      const { meta, data } = await this.$axios.post(
        `roles/${this.rowId}/rights`,
        { rids }
      )
      console.log(meta, data)
      if (meta.status === 200) {
        this.dialogVisible = false
        this.rolesRender()
        this.$message.success(meta.msg)
      } else {
        this.$message.error(meta.msg)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.roles {
  .row1 {
    margin: 10px;
    border-bottom: 1px dotted #ccc;
    padding-bottom: 10px;
    &:last-child {
      border: none;
    }
  }
  .row2 {
    margin-bottom: 10px;
  }
  .row3 {
    margin: 0 5px 5px;
  }
}
</style>
