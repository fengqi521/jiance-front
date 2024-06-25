<template>
  <section class="coupon-ac-ma">
    <div class="section-title">
      <router-link to="/trad/agent/check">代理商分润管理</router-link>
      > 提现记录
    </div>
    <div class="section-account">代理商账号：{{ account }}</div>
    <div class="section-amount">
      <div class="amount-right">
        <div class="amount-item-inner clearfix">
          <div class="amount-item">
            <div class="amount-item-title">已分润金额（元）</div>
            <p class="amount-item-text">
              <span>{{ topData.shared_profit_amount || "--" }}</span>
            </p>
          </div>
          <div class="amount-item">
            <div class="amount-item-title">已提现金额（元）</div>
            <p class="amount-item-text">
              <span>{{ topData.cash_withdrawn || "--" }}</span>
            </p>
          </div>
          <div class="amount-item">
            <div class="amount-item-title">未提现金额（元）</div>
            <p class="amount-item-text">
              <span>{{ topData.no_withdrawl || "--" }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="section-container">
      <div class="section-item-header">
        提现列表
      </div>
      <div class="header-content clearfix">
        <div class="content-item">
          <div class="header-left">状态</div>
          <div class="header-right">
            <el-select v-model="modelObj.status">
              <el-option label="全部" value="all" />
              <el-option label="提现失败" value="1" />
              <el-option label="提现中" value="2" />
              <el-option label="提现成功" value="3" />
            </el-select>
          </div>
        </div>
        <div class="content-item">
          <div class="header-left">申请提现时间</div>
          <div class="header-right">
            <el-date-picker v-model="modelObj.start_time" type="date" placeholder="选择开始日期" value-format="yyyy-MM-dd">
            </el-date-picker>
            <el-date-picker class="end-time" v-model="modelObj.end_time" type="date" placeholder="选择结束日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </div>
        </div>
        <div class="content-item content-search">
          <div class="btn_succ" @click="searchPile()">查询</div>
          <div class="btn_cancel" @click="resetSearch()">重置</div>
        </div>
        <div class="btn_recovery export-btn" @click="billExport()">
          <i class="export-icon"></i>导出对账
        </div>
      </div>
      <div class="section-main">
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td">申请提现时间</div>
            <div class="table-td">申请提现金额（元）</div>
            <div class="table-td">提现方式</div>
            <div class="table-td">提现账户类型</div>
            <div class="table-td">账号</div>
            <div class="table-td">实际转账金额（元）</div>
            <div class="table-td">实际支付手续费（元）</div>
            <div class="table-td">到账时间</div>
            <div class="table-td">到账金额（元）</div>
            <div class="table-td">提现手续费（元）</div>
            <div class="table-td">状态</div>
            <div class="table-td">失败原因</div>
          </div>
          <div class="table-body" v-loading="listLoading">
            <div class="table-tr" v-show="tableData && tableData.length > 0" v-for="(list, index) in tableData"
              :key="index">
              <div class="table-td">
                <div class="td-item">{{ list.create_time }}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{ list.withdrawl_amount }}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{ pay_array[list.withdrawl_type] }}</div>
              </div>
              <div class="table-td">
                <div class="td-item">
                  {{ list.account_type | setAccountType }}
                </div>
              </div>
              <div class="table-td">
                <div class="td-item">{{ list.account }}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{ list.real_transfer_amount }}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{ list.real_service_amount }}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{ list.payment_time || "--" }}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{ list.payment_amount }}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{ list.deduction_service_amount }}</div>
              </div>
              <div class="table-td">
                <div class="td-item" :class="list.status == 1
                  ? 'section-no-begin'
                  : list.status == 2
                    ? 'section-running'
                    : 'section-end'
                  ">
                  {{ status_array[list.status] }}
                </div>
              </div>
              <div class="table-td">
                <div class="td-item">
                  <el-tooltip :content="list.failed_reason" placement="top">
                    <div class="td-item" style="max-height: 110px; overflow: hidden">
                      {{ list.failed_reason | ellipsis }}
                    </div>
                  </el-tooltip>
                </div>
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
  data () {
    return {
      ENV: process.env.NODE_ENV == "development" ? "/api" : "",
      is_export: 0,
      topData: "",
      account: this.$route.query.account,
      modelObj: {
        status: "all",
        user_id: this.$route.query.id,
        start_time: '',
        end_time: ''
      },
      currentPage: 1,
      page_count: 1,
      tableData: [],
      listLoading: false,
      showPermission: false,
      status_array: {
        1: "提现失败",
        2: "提现中...",
        3: "提现成功",
      },
      pay_array: {
        1: "微信",
        2: "支付宝",
        3: "银行卡",
      },
      available_stations: "",
      delete_id: "",
    };
  },
  filters: {
    setAccountType (val) {
      if (val == 1) return '个人'
      if (val == 2) return '企业'
      return '--'
    },
    ellipsis (value) {
      if (!value) return '--'
      if (value.length > 15) {
        return value.slice(0, 15) + '...'
      }
      return value
    },
  },
  created () {
    this.getTopDataList();
    this.getTableDataList();
  },
  methods: {
    getTopDataList () {
      this.modelObj.page = this.currentPage;
      this.$api
        .profitRecordTop({ user_id: this.$route.query.id })
        .then((data) => {
          if (data.code == 1) {
            this.topData = data.data;
          }
        });
    },
    getTableDataList () {
      this.listLoading = true;
      this.modelObj.page = this.currentPage;
      this.$api.profitApplyList(this.modelObj).then((data) => {
        this.listLoading = false;
        if (data.code == 1) {
          this.tableData = data.data.list;
          this.currentPage = data.data.current_page;
          this.page_count = data.data.page_total;
          this.is_export = data.data.is_export;
        }
      });
    },

    // 导出账单列表

    billExport () {
      if (this.is_export) {
        const { status, user_id, start_time, end_time } = this.modelObj;
        window.location.href = `${this.ENV}/profit/export-withdrawl?user_id=${user_id}&status=${status}&start_time=${start_time}&end_time=${end_time}`;
      } else {
        this.$sfMessage.error("抱歉，当前用户没有操作权限");
      }
    },
    // 点击分页触发
    handleCurrentChange (page) {
      this.currentPage = page;
      this.getTableDataList();
    },
    searchPile () {
      this.currentPage = 1;
      this.getTableDataList();
    },
    resetSearch () {
      this.modelObj = {
        status: "all",
        user_id: this.$route.query.id,
        start_time: '',
        end_time: ''
      };
      this.currentPage = 1;
      this.page_count = 1;
      this.tableData = [];
      this.getTableDataList();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/trad/manageCash.scss";
</style>
