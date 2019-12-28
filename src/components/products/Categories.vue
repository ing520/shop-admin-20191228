<template>
  <div class="categories">
    <el-button type="success" plain @click="addCategoriesDialog">添加分类</el-button>
    <el-table :data="addForm" row-key="cat_id" v-loading="loading">
      <el-table-column label="分类名称" prop="cat_name"></el-table-column>
      <el-table-column label="是否有效">
        <template v-slot:default="{row}">{{row.cat_deleted?'否':'是'}}</template>
      </el-table-column>
      <el-table-column label="层级" prop="cat_level"></el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="{obj}">
          <el-button icon="el-icon-edit" plain size="small" type="primary"></el-button>
          <el-button icon="el-icon-delete" plain size="small" type="danger"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagesize"
      :page-sizes="[4,8,12,16]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类" :visible.sync="adddialogVisible" width="30%" @close='clearAddForm'>
      <el-form ref="form" :model="form" width="80px" :rules="rules" >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="form.cat_name" class="input"></el-input>
        </el-form-item>
        <el-form-item label="父级名称" prop="cat_pid">
          <!--v-model:选中项绑定值,绑定前两级的id
           options：可选项数据源，键名可通过 Props 属性配置
          -->
          <el-cascader
           clearable
           v-model="form.cat_pid"
           :options="options"
           :props="props"
           ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addcategories">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      addForm: [],
      pagenum: 1,
      pagesize: 4,
      total: 0,
      loading: false,
      adddialogVisible: false,
      form: {
        cat_pid: '', // 通过v-model="form.cat_name"双向数据绑定
        cat_name: '',
        cat_level: ''// 手动设置
      },
      options: [], // 父级下拉列表（axios请求回来渲染）
      props: {
        checkStrictly: true,
        children: 'children',
        label: 'cat_name',
        value: 'cat_id'
      },
      rules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created () {
    this.renderForm()
  },
  methods: {
    async renderForm () {
      this.loading = true
      const { meta, data } = await this.$axios.get(`categories`, {
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize,
          type: 3
        }
      })
      if (meta.status === 200) {
        this.addForm = data.result
        console.log(' this.addForm', this.addForm)
        this.total = data.total
      } else {
        console.log(meta.msg)
      }
      this.loading = false
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.renderForm()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.renderForm()
    },
    async addCategoriesDialog () {
      this.adddialogVisible = true
      const { meta, data } = await this.$axios.get(`categories`, {
        params: {
          type: 2,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      console.log(meta, data)
      this.options = data.result// option里是父级数组
    },
    async addcategories () {
      try {
        await this.$refs.form.validate()
        const { meta, data } = await this.$axios.post(`categories`, {
          cat_pid: this.form.cat_pid[this.form.cat_pid.length - 1], // 只要父元素级别
          cat_name: this.form.cat_name,
          cat_level: this.form.cat_pid.length
        })
        console.log(meta, data)
        if (meta.status === 201) {
          this.adddialogVisible = false
          this.renderForm()
          this.$message.success(meta.msg)
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    clearAddForm () {
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang='scss'>
.categories{
  .input{
    width: 60%;
  }
}
</style>
