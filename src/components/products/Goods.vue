<template>
  <div class="goods">
    <el-button type="success" plain @click='toGoodAdd'>添加商品</el-button>
    <el-table :data="goodsTable">
      <!--  :index="indexMethod" 自定义索引 计算属性 -->
      <el-table-column type="index" :index="indexMethod"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
      <el-table-column prop="add_time" label="创建时间">
        <template v-slot:default={row}>
            <span>{{row.add_time|time}}</span>
        </template>
      </el-table-column>
      <el-table-column  label="操作">
        <template v-slot:default="{row}">
          <el-button icon="el-icon-edit" plain type="primary"></el-button>
          <el-button icon="el-icon-delete" plain type="danger"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2,4,6,8]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  data () {
    return {
      goodsTable: [],
      pagenum: 1,
      pagesize: 4,
      total: 0
    }
  },
  created () {
    this.renderForm()
  },
  methods: {
    async renderForm () {
      const { meta, data } = await this.$axios.get(`goods`, {
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      console.log(meta, data)
      if (meta.status === 200) {
        this.goodsTable = data.goods
        this.total = data.total
      } else {
        console.log(meta.msg)
      }
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.pagenum = 1

      this.renderForm()// 点击 页码没反应，需要重新渲染
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.renderForm()
    },
    toGoodAdd () {
      this.$router.push('goods-add')
    }
  },
  computed: {
    indexMethod () {
      return this.pagesize * (this.pagenum - 1) + 1
    }
  }
}
</script>

<style>
</style>
