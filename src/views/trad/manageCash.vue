<template>
  <section class="coupon-ac-ma">
    <div class="section-title">
      <router-link to="/trad/manage">分润管理</router-link>
      > 提现记录
    </div>
    <!-- <div class="section-account">代理商账号：{{top_detail.account}}</div> -->
    <div class="section-amount" v-loading="top_loading">
      <div class="amount-right">
        <div class="amount-item-inner clearfix">
          <div class="amount-item">
            <div class="amount-item-title">已分润金额（元）</div>
            <p class="amount-item-text">
              <span>{{ top_detail.shared_profit_amount || '--' }}</span>
            </p>
          </div>
          <div class="amount-item">
            <div class="amount-item-title">已提现金额（元）</div>
            <p class="amount-item-text">
              <span>{{ top_detail.cash_withdrawn || '--' }}</span>
            </p>
          </div>
          <div class="amount-item">
            <div class="amount-item-title">未提现金额（元）</div>
            <p class="amount-item-text">
              <span>{{ top_detail.no_withdrawl || '--' }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="section-container">
      <div class="section-item-header clearfix">
        <span>提现列表</span>
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
        <div class="content-item">
          <div class="btn_succ" @click="searchPile()">查询</div>
          <div class="btn_cancel" @click="resetSearch()">重置</div>
        </div>
        <div class="btn_recovery export-btn" @click="generateCheck()">
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
            <div class="table-td">到账时间</div>
            <div class="table-td">到账金额（元）</div>
            <div class="table-td">提现手续费（元）</div>
            <div class="table-td">状态</div>
            <div class="table-td">失败原因</div>
          </div>
          <div class="table-body" v-loading="listLoading">
            <div class="table-tr" v-show="tableData && tableData.length > 0"
              v-for="(preferential_info, index) in tableData" :key="index">
              <div class="table-td">
                <div class="td-item">{{ preferential_info.create_time }}</div>
              </div>
              <div class="table-td">
                <!-- <div class="td-item">{{bonus_type_array[preferential_info.type]}}</div> -->
                <div class="td-item">{{ preferential_info.withdrawl_amount }}</div>
              </div>
              <div class="table-td">
                <div class="td-item" v-if="preferential_info.withdrawl_type == 1">
                  微信
                </div>
                <div class="td-item" v-else-if="preferential_info.withdrawl_type == 2">
                  支付宝
                </div>
                <div class="td-item" v-else>
                  银行卡
                </div>
              </div>
              <div class="table-td">
                <div class="td-item">
                  {{ preferential_info.account_type |setAccountType }}
                </div>
              </div>
              <div class="table-td">
                <div class="td-item">{{ preferential_info.account }}</div>
              </div>
              <div class="table-td">
                <div class="td-item" v-if="preferential_info.status == 3">{{ preferential_info.payment_time || "--" }}
                </div>
                <div class="td-item" v-else>--</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{ preferential_info.payment_amount }}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{ preferential_info.real_service_amount }}
                </div>
              </div>
              <div class="table-td">
                <div class="td-item section-no-begin" v-if="preferential_info.status == 1">提现失败</div>
                <div class="td-item section-running" v-if="preferential_info.status == 2">提现中...</div>
                <div class="td-item section-end" v-if="preferential_info.status == 3">提现成功</div>
              </div>
              <div class="table-td">
                <div class="td-item">
                  <el-tooltip :content="preferential_info.failed_reason" placement="top">
                    <div class="td-item" style="max-height: 110px; overflow: hidden">
                      {{ preferential_info.failed_reason | ellipsis }}
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
      top_loading: false,
      top_detail: {
        account: '',
        cash_withdrawn: '',
        no_withdrawl: '',
        shared_profit_amount: ''
      },
      is_export: 1,
      modelObj: {
        status: "all",
        start_time: '',
        end_time: ''
      },
      ENV: process.env.NODE_ENV == "development" ? "/api" : "",
      currentPage: 1,
      page_count: 1,
      tableData: [],
      listLoading: false,
    };
  },
  filters: {
    setAccountType(val){
      if(val==1) return '个人'
      if(val==2) return '企业'
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
    this.getTopDetail()
    this.getTableDataList();
  },
  methods: {
    getTopDetail () {
      this.top_loading = true;
      this.$api.getAgentOperatorDetail().then(res => {
        this.top_loading = false
        if (res.code == 1) {
          this.top_detail.account = res.data.account
          this.top_detail.cash_withdrawn = res.data.cash_withdrawn
          this.top_detail.no_withdrawl = res.data.no_withdrawl
          this.top_detail.shared_profit_amount = res.data.shared_profit_amount
        }
      })
    },
    getTableDataList () {
      this.listLoading = true;
      this.modelObj.page = this.currentPage;
      this.$api.getAgentWithdrawList(this.modelObj).then((data) => {
        this.listLoading = false;
        if (data.code == 1) {
          this.tableData = data.data.list;
          this.currentPage = data.data.current_page;
          this.page_count = data.data.page_total;
          // this.is_export = data.data.is_export;
        }
      });
    },
    generateCheck () {
      if (this.is_export) {
        if (this.tableData.length == 0) {
          this.$sfNotify({
            type: "error",
            message: "暂无可生成的对账单",
          });
          return false;
        }
        const { status, start_time, end_time } = this.modelObj;
        window.location.href = `${this.ENV}/profit/agent-export-withdrawl?status=${status}&start_time=${start_time}&end_time=${end_time}`;
      } else {
        this.$sfMessage.error("抱歉，当前用户没有操作权限");
      }
    },
    // 点击分页触发
    handleCurrentChange (page) {
      this.currentPage = page;
      this.getTableDataList();
    },
    delItem (id, index) {
      this.delete_id = id;
      this.showDelete = true;
    },
    searchPile () {
      this.currentPage = 1;
      this.getTableDataList();
    },
    resetSearch () {
      this.modelObj = {
        status: "all",
        start_time: "",
        end_time: "",
      };
      this.currentPage = 1;
      this.page_count = 1;
      this.tableData = [];
      this.getTableDataList();
    },
    saveDeleteSure () {
      this.$api.preferentialAcDelete({ id: this.delete_id }).then((data) => {
        this.showDelete = false;
        if (data.code == 1) {
          this.$sfNotify({
            message: "成功",
          });
          setTimeout(this.getTableDataList, 1500);
        } else {
          this.$sfNotify({
            duration: 0,
            type: "error",
            message: "失败",
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/trad/manageCash.scss";
</style>