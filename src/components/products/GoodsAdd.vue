<template>
  <div class="goods-add">
    <!-- 步骤条 -->
    <el-steps :active="active" finish-status="success">
      <el-step title="步骤 1" description="基本信息"></el-step>
      <el-step title="步骤 2" description="商品图片"></el-step>
      <el-step title="步骤 3" description="商品内容"></el-step>
    </el-steps>
    <!-- 左侧标签页 -->
    <el-tabs :tab-position="tabPosition" @tab-click="handleClick" v-model="activeTab">
      <el-tab-pane label="基本信息" name="0">
        <el-form ref="form" :model="form" label-width="80px" :rules="rules">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="form.goods_name" placeholder="请输入商品名称"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="form.goods_price" placeholder="请输入商品价格"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="form.goods_weight" placeholder="请输入商品重量"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="form.goods_number" placeholder="请输入商品数量"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="options">
            <el-cascader v-model="form.goods_cat" :options="options" :props="props"></el-cascader>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="next">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="1">
        <el-upload
          action="http://localhost:8888/api/private/v1/upload"
          list-type="picture-card"
          name="file"
          :headers="headers"
          multiple
          :on-success="successUrl"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <!-- 成功的钩子函数返回地址 name上传时的名称（准确获取值）-->
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt>
        </el-dialog>
        <el-button type="primary" @click="next">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="2">
        <quill-editor v-model="form.goods_introduce"></quill-editor>
        <el-button type="primary" @click="submitSuccess">确认</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: 0, // 步骤条的第几步
      tabPosition: 'left',
      form: {
        goods_name: '',
        goods_cat: [], // 商品分类, 将来给级联绑定的
        goods_price: 0,
        goods_weight: '',
        goods_number: '',
        pics: [],
        goods_introduce: ''
      },
      activeTab: '0',
      cat_pid: '',
      cat_name: '',
      cat_id: '',
      props: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      options: [],
      rules: {
        goods_name: [
          {
            required: true,
            message: '请输入商品名称',
            trigger: ['blur', 'change']
          }
        ],
        goods_price: [
          {
            required: true,
            message: '请输入商品价格',
            trigger: ['blur', 'change']
          }
        ],
        goods_weight: [
          {
            required: true,
            message: '请输入商品重量',
            trigger: ['blur', 'change']
          }
        ],
        goods_number: [
          {
            required: true,
            message: '请输入商品数量',
            trigger: ['blur', 'change']
          }
        ]
      },
      dialogImageUrl: '',
      dialogVisible: false,
      headers: {
        Authorization: localStorage.getItem('token')
      }
    }
  },
  created () {
    this.goodsAddRender()
  },
  methods: {
    async goodsAddRender () {
      const { meta, data } = await this.$axios.get(`categories`, {
        params: {
          type: 3
        }
      })
      console.log(meta, data)
      if (meta.status === 200) {
        this.options = data
        this.cat_pid = data.cat_pid
        this.cat_id = data.cat_id
        this.cat_name = data.cat_name
      }
    },
    handleClick (tab, event) {
      // console.log(tab, event)关联步骤条和tab栏
      this.active = +tab.index
    },
    async next () {
      try {
        await this.$refs.form.validate()
        // this.activeTab = '1'
        this.active++
        this.activeTab = this.active + ''
      } catch (e) {
        console.log(e)
      }
    },
    successUrl (response, file, fileList) {
      // console.log(response)
      // response.data.tmp_path
      const { meta, data } = response
      if (meta.status === 200) {
        this.form.pics.push({
          // 存上传成功后的地址
          pic: data.tmp_path
        })
      } else {
        console.log(meta.msg)
      }
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
      const path = file.response.data.tmp_path
      this.form.pics = this.form.pics.filter(item => item.pic !== path)
      console.log(this.form.pics)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    async submitSuccess () {
      console.log('hah')
      const { meta } = await this.$axios.post('goods', {
        ...this.form,
        goods_cat: this.form.goods_cat.join(',')
      })
      if (meta.status === 201) {
        this.$message.success('添加成功')
        this.$router.push('/goods')
      } else {
        this.$message.error(meta.msg)
      }
    }
  }
}
</script>

<style lang='scss'>
.quill-editor {
  background-color: #fff;
  .ql-editor {
    min-height: 300px;
  }
}
</style>
