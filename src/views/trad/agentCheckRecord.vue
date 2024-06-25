<template>
  <section class="coupon-ac-ma">
    <div class="section-title">
      <router-link to="/trad/agent/check">代理商分润管理</router-link> > 分润记录
    </div>
    <div class="section-account">代理商账号：{{ topData.account || "--" }}</div>
    <div class="section-amount">
      <div class="amount-right">
        <div class="amount-item-inner clearfix">
          <div class="amount-item">
            <div class="amount-item-title">已分润金额（元）</div>
            <p class="amount-item-text">
              <span>{{ topData.shared_profit_amount || "--" }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="section-container">
      <div class="section-item-header clearfix">
        <span>分润列表</span>
        <span class="tip">（*分润列表数据以当天支付时间为依据汇总）</span>
      </div>
      <div class="header-content clearfix">
        <div class="content-item">
          <div class="header-left">分润时间</div>
          <div class="header-right">
            <el-date-picker class="start-time" v-model="modelObj.start_time" type="date" placeholder="选择开始日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
            <el-date-picker class="end-time" v-model="modelObj.end_time" type="date" placeholder="选择结束日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </div>
        </div>
        <div class="content-item">
          <div class="btn_succ" @click="searchPile()">查询</div>
          <div class="btn_cancel" @click="resetSearch()">重置</div>
        </div>
        <div class="btn_recovery export-btn export-location" @click="handleExport"><i class="export-icon"></i>导出
        </div>
      </div>

      <div class="section-main">
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td">分润时间</div>
            <div class="table-td">分润总金额（元）</div>
            <div class="table-td">电费分润金额（元）</div>
            <div class="table-td">电费分润费率</div>
            <div class="table-td">服务费分润金额（元）</div>
            <div class="table-td">服务费分润费率</div>
            <div class="table-td table-column__1">分润充电站</div>
            <div class="table-td">操作</div>
          </div>
          <div class="table-body" v-loading="listLoading">
            <div class="table-tr" v-show="tableData && tableData.length > 0" v-for="(list, index) in tableData"
              :key="index">
              <div class="table-td">
                <div class="td-item">{{list.create_time}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{list.profit_money}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">
                  {{
                    list.profit_money_elec === null
                      ? "--"
                      : list.profit_money_elec
                  }}
                </div>
              </div>
              <div class="table-td">
                <div class="td-item">
                  {{
                    list.profit_rate_elec === null
                      ? "--"
                      : list.profit_rate_elec
                  }}%
                </div>
              </div>
              <div class="table-td">
                <div class="td-item">
                  {{
                    list.profit_money_service === null
                      ? "--"
                      : list.profit_money_service
                  }}
                </div>
              </div>
              <div class="table-td">
                <div class="td-item">
                  {{
                    list.profit_rate_service === null
                      ? "--"
                      : list.profit_rate_service
                  }}%
                </div>
              </div>
              <div class="table-td table-column__1">
                <el-tooltip :content="list.stations_str" :disabled="list.stations_str ? false : true" placement="top">
                  <div class="td-item" style="max-height: 110px; overflow: hidden">
                    {{ list.stations_str | ellipsis }}
                  </div>
                </el-tooltip>
              </div>
              <div class="table-td table-operate">
                <el-tooltip content="查看" placement="top">
                  <div class="td-item see-icon" @click="checkCouponAc(list.id)"></div>
                </el-tooltip>
              </div>
            </div>
            <div v-if="!tableData || tableData.length === 0" class="table-tr unData">
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
      modelObj: {
        start_time: '',
        end_time: '',
        user_id: this.$route.query.id
      },
      topData: {},
      currentPage: 1,
      page_count: 1,
      tableData: [],
      listLoading: false,
      ENV: process.env.NODE_ENV == 'development' ? '/api' : '',
      is_export: false
    }
  },
  created() {
    this.getTableDataList()
    this.getTopDataList()
  },
  filters: {
    ellipsis(value) {
      if (!value) return '--'
      if (value.length > 41) {
        return value.slice(0, 41) + '...'
      }
      return value
    }
  },
  methods: {
    getTopDataList() {
      this.modelObj.page = this.currentPage
      this.$api
        .profitRecordTop({ user_id: this.$route.query.id })
        .then((data) => {
          if (data.code == 1) {
            this.topData = data.data
          }
        })
    },
    getTableDataList() {
      this.listLoading = true
      this.modelObj.page = this.currentPage
      this.$api.profitRecordList(this.modelObj).then((data) => {
        this.listLoading = false
        if (data.code == 1) {
          this.tableData = data.data.list
          this.currentPage = data.data.current_page
          this.page_count = data.data.page_total
          this.is_export = data.data.is_export
        }
      })
    },
    // 点击分页触发
    handleCurrentChange(page) {
      this.currentPage = page
      this.getTableDataList()
    },
    searchPile() {
      this.currentPage = 1
      this.getTableDataList()
    },
    resetSearch() {
      this.modelObj = {
        time: '',
        user_id: this.$route.query.id
      }
      this.currentPage = 1
      this.page_count = 1
      this.tableData = []
      this.getTableDataList()
    },
    checkCouponAc(id) {
      this.$router.push({
        path: '/trad/agent/check/detail',
        query: { id: id, user_id: this.$route.query.id }
      })
    },
    // 导出
    handleExport() {
      if (this.is_export) {
        window.location.href = `${this.ENV}/profit/profit-history-export?user_id=${this.modelObj.user_id}&start_time=${this.modelObj.start_time}&end_time=${this.modelObj.end_time}`
      } else {
        this.$sfMessage.error('抱歉，当前用户没有操作权限')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/css/trad/agentCheckRecord.scss';
</style>
