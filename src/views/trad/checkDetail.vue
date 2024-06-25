<template>
  <section>
    <div class="section-title">
      <router-link to="/trad/profit">业主分润管理</router-link>
      > 对账单详情
    </div>
    <div class="section-container">
      <div class="section-header">
        <div class="section-item-header">
          账单列表
        </div>
        <div class="header-content clearfix">
          <div class="content-item">
            <div class="header-left">账单支付时间</div>
            <div class="header-right">
              <el-date-picker v-model="modelObj.start" type="date" placeholder="选择开始日期" value-format="yyyy-MM-dd"
                :picker-options="pickerOptions">
              </el-date-picker>
              <el-date-picker class="end-time" v-model="modelObj.end" type="date" placeholder="选择结束日期"
                value-format="yyyy-MM-dd" :picker-options="pickerOptions">
              </el-date-picker>
            </div>
          </div>
          <div class="content-item">
            <div class="btn_succ" @click="handleSearch">查询</div>
            <div class="btn_cancel" @click="resetSearch">重置</div>
          </div>
          <div class="btn_recovery export-btn" @click="detailExport">
            <i class="export-icon"></i>导出
          </div>
        </div>

      </div>
      <div class="section-main">
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td">账单编号</div>
            <div class="table-td">所属业主</div>
            <div class="table-td">账单支付时间</div>
            <div class="table-td">账单金额（元）</div>
            <div class="table-td">支付方式</div>
          </div>
          <div class="table-body" v-loading="listLoading">
            <div class="table-tr" v-show="tableData && tableData.length > 0" v-for="(detail, index) in tableData"
              :key="index">
              <div class="table-td">
                <div class="td-item">{{ detail.out_trade_id }}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{ detail.account }}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{ detail.payment_time }}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{ detail.real_amount }}</div>
              </div>
              <div class="table-td table-operate">
                <div class="td-item">
                  <div
                    :class="{ 'td-type': true, 'td-balance': detail.pay_way === '1', 'td-wechat-pay': detail.pay_way === '2', 'td-ali-pay': detail.pay_way === '3', 'td-card': detail.pay_way === '4', 'td-other': detail.pay_way === '5' }">
                  </div>
                  {{ detail.pay_way_text || '--' }}
                </div>
              </div>
            </div>
            <div v-if="!tableData || tableData.length == 0" class="table-tr unData">
              <img :src="require('assets/img/unData.png')" />
              <span>暂无数据</span>
            </div>
          </div>
          <!-- 分页 -->
          <sf-pagination v-if="tableData && tableData.length > 0" :currentPage="currentPage" :page-count="page_count"
            @current-change="handleCurrentChange" />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      id: this.$route.query.serial,
      currentPage: 1,
      page_count: 1,
      is_export: false,
      modelObj: {
        start: '',
        end: ''
      },
      pickerOptions: {
        disabledDate(time) {
          return false
        }
      },

      tableData: [],
      listLoading: false,
      ENV: process.env.NODE_ENV == 'development' ? '/api' : ''
    }
  },
  created() {
    this.getTableDataList()
  },
  methods: {
    getTableDataList() {
      this.listLoading = true
      let params = {
        serial: this.id,
        page: this.currentPage,
        ...this.modelObj
      }
      this.$api.profitStatement(params).then((data) => {
        this.listLoading = false
        if (data.code == 1) {
          this.tableData = data.data.list
          this.currentPage = data.data.current_page
          this.page_count = data.data.page_total
          this.is_export = data.data.is_export
        }
      })
    },
    // 搜索
    handleSearch() {
      this.currentPage = 1
      this.getTableDataList()
    },
    //重置
    resetSearch() {
      this.modelObj = {
        start: '',
        end: ''
      }
      this.currentPage = 1
      this.getTableDataList()
    },

    // 点击分页触发
    handleCurrentChange(page) {
      this.currentPage = page
      this.tableData = []
      this.getTableDataList()
    },
    // 对账单详情导出
    detailExport() {
      if (this.is_export) {
        if (!this.tableData.length) {
          this.$sfNotify({
            duration: 0,
            type: 'error',
            message: '没有可导出的对账单详情列表'
          })
          return false
        }
        window.location.href = `${this.ENV}/profit/detail-export?start=${this.modelObj.start}&end=${this.modelObj.end}&serial=${this.id}`
      } else {
        this.$sfMessage.error('抱歉，当前用户没有操作权限')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/css/trad/checkDetail.scss';
</style>
