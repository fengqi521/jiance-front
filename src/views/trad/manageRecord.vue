<template>
  <section class="coupon-ac-ma">
    <div class="section-title">
      <router-link to="/trad/manage">分润管理</router-link> > 分润记录
    </div>
    <div class="section-amount">
      <div class="amount-right">
        <div class="amount-item-inner clearfix">
          <div class="amount-item">
            <div class="amount-item-title">已分润金额（元）</div>
            <p class="amount-item-text">
              <span>{{
                shared_profit_amount ? shared_profit_amount : "--"
              }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="section-container">
      <div class="section-item-header clearfix">
        <span>分润列表</span>
      </div>
      <div class="header-content clearfix">
        <div class="content-item">
          <div class="header-left">分润时间</div>
          <div class="header-right">
            <el-date-picker v-model="modelObj.start_time" type="date" placeholder="选择开始日期" value-format="yyyy-MM-dd">
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
            <div class="table-td">分润充电站</div>
            <div class="table-td">操作</div>
          </div>
          <div class="table-body" v-loading="listLoading">
            <div class="table-tr" v-show="tableData && tableData.length > 0"
              v-for="(preferential_info, index) in tableData" :key="index">
              <div class="table-td">
                <div class="td-item">{{preferential_info.create_time}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{preferential_info.profit_money}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">
                  {{
                    preferential_info.profit_money_elec === null
                      ? "--"
                      : preferential_info.profit_money_elec
                  }}
                </div>
              </div>

              <div class="table-td">
                <div class="td-item">
                  {{
                    preferential_info.profit_rate_elec === null
                      ? "--"
                      : preferential_info.profit_rate_elec
                  }}%
                </div>
              </div>
              <div class="table-td">
                <div class="td-item">
                  {{
                    preferential_info.profit_money_service === null
                      ? "--"
                      : preferential_info.profit_money_service
                  }}
                </div>
              </div>
              <div class="table-td">
                <div class="td-item">
                  {{
                    preferential_info.profit_rate_service === null
                      ? "--"
                      : preferential_info.profit_rate_service
                  }}%
                </div>
              </div>
              <div class="table-td">
                <el-tooltip :content="preferential_info.stations_str"
                  :disabled="preferential_info.stations_str ? false : true" placement="top">
                  <div class="td-item" style="max-height: 110px; overflow: hidden">
                    {{ preferential_info.stations_str | ellipsis }}
                  </div>
                </el-tooltip>
              </div>
              <div class="table-td table-operate">
                <el-tooltip content="查看" placement="top">
                  <div class="td-item see-icon" @click="checkCouponAc(preferential_info.id)"></div>
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
      shared_profit_amount: '',

      modelObj: {
        start_time: '',
        end_time: ''
      },
      currentPage: 1,
      page_count: 1,
      tableData: [],
      listLoading: false,
      ENV: process.env.NODE_ENV == 'development' ? '/api' : ''
    }
  },
  filters: {
    ellipsis(value) {
      if (!value) return '--'
      if (value.length > 40) {
        return value.slice(0, 44) + '...'
      }
      return value
    }
  },
  created() {
    // this.getMonthDay()
    this.getTableDataList()
    this.getOperatorInfo()
  },
  methods: {
    //获取已分润金额
    getOperatorInfo() {
      this.$api.getAgentMoney().then((res) => {
        if (res.code && res.code == 1) {
          this.shared_profit_amount = res.data.shared_profit_amount
        }
      })
    },
    getTableDataList() {
      this.listLoading = true
      this.modelObj.page = this.currentPage
      this.$api.getAgentProfitHistory(this.modelObj).then((data) => {
        this.listLoading = false
        if (data.code == 1) {
          this.tableData = data.data.list
          this.currentPage = data.data.current_page
          this.page_count = data.data.page_total
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
        start_time: '',
        end_time: ''
      }
      this.currentPage = 1
      this.page_count = 1
      this.tableData = []
      this.getTableDataList()
    },
    checkCouponAc(id) {
      this.$router.push({
        path: '/trad/manage/record/detail',
        query: { id: id }
      })
    },
    /*
      获取当月的第一天
    */
    getMonthDay() {
      var date = new Date()
      var toDay = this.$utils.formatDate(date, 'yyyy-MM-dd')
      this.modelObj.time = toDay
    },
    // 导出列表
    handleExport() {
      window.location.href = `${this.ENV}/profit/agent-profit-history-export?start_time=${this.modelObj.start_time}&end_time=${this.modelObj.end_time}`
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/css/trad/agentCheckRecord.scss';
</style>
