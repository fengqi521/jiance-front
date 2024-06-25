<template>
  <section class="coupon-ac-ma">
    <div class="section-title">
      <router-link to="/trad/agent">代理商分润管理</router-link>
      <router-link
        :to="`/trad/agent/check/record?id=${this.$route.query.user_id}`"
      >
        > 分润记录</router-link
      >
      > 分润详情
    </div>
    <div class="section-amount">
      <div class="amount-right">
        <div class="amount-item-inner clearfix">
          <div class="amount-item">
            <div class="amount-item-title">分润时间</div>
            <p class="amount-item-text">
              <span>{{ topData.create_time || "--" }}</span>
            </p>
          </div>
          <div class="amount-item">
            <div class="amount-item-title">分润总金额（元）</div>
            <p class="amount-item-text">
              <span>{{ topData.profit_money || "--" }}</span>
            </p>
          </div>
          <div class="amount-item amount-item-specical">
            <div class="amount-item-special-title">
              <span>电费分润费率</span>
              <span>服务费分润费率</span>
            </div>
            <div
              class="amount-item-text amount-item-special-title"
              style="margin-left: 12px"
            >
              <span>{{ topData.profit_rate_elec || "--" }}%</span>
              <span>{{ topData.profit_rate_service || "--" }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="section-container">
      <div class="section-item-header clearfix">
        <span>分润详情列表</span>
        <div class="btn_recovery export-btn" @click="billExport()">
          <i class="export-icon"></i>导出对账
        </div>
      </div>
      <div class="section-main">
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td">账单编号</div>
            <div class="table-td">所属充电站</div>
            <div class="table-td">支付金额（元）</div>
            <div class="table-td">电费（元）</div>
            <div class="table-td">服务费（元）</div>
            <div class="table-td">分润总金额（元）</div>
          </div>
          <div class="table-body" v-loading="listLoading">
            <div
              class="table-tr"
              v-show="tableData && tableData.length > 0"
              v-for="(list, index) in tableData"
              :key="index"
            >
              <div class="table-td">
                <div class="td-item">{{ list.out_trade_id }}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{ list.station_name }}</div>
              </div>
              <div class="table-td">
                <div
                  class="td-item"
                  :class="{ orange: Number(list.real_amount) < 0 }"
                >
                  {{ list.real_amount }}
                </div>
              </div>
              <div class="table-td">
                <div
                  class="td-item"
                  :class="{ orange: Number(list.elec_amount) < 0 }"
                >
                  {{ list.elec_amount }}
                </div>
              </div>
              <div class="table-td">
                <div
                  class="td-item"
                  :class="{ orange: Number(list.service_amount) < 0 }"
                >
                  {{ list.service_amount }}
                </div>
              </div>
              <div class="table-td">
                <div
                  class="td-item"
                  :class="{ orange: Number(list.profit_money) < 0 }"
                >
                  {{ list.profit_money }}
                </div>
              </div>
            </div>
            <div
              v-if="!tableData || tableData.length === 0"
              class="table-tr unData"
            >
              <img :src="require('assets/img/unData.png')" />
              <span>暂无数据</span>
            </div>
          </div>
          <!-- 分页 -->
          <sf-pagination
            v-if="tableData && tableData.length > 0"
            :currentPage="currentPage"
            :page-count="page_count"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      ENV: process.env.NODE_ENV == "development" ? "/api" : "",
      is_export: 0,
      topData: {},
      modelObj: {
        id: this.$route.query.id,
      },
      currentPage: 1,
      page_count: 1,
      tableData: [],
      listLoading: false,
    };
  },
  created() {
    this.getTopDataList();
    this.getTableDataList();
  },
  methods: {
    getTopDataList() {
      this.$api
        .profitRecordDetailTop({ id: this.$route.query.id })
        .then((data) => {
          if (data.code == 1) {
            this.topData = data.data;
          }
        });
    },
    getTableDataList() {
      this.listLoading = true;
      this.modelObj.page = this.currentPage;
      this.$api.profitRecordDetailList(this.modelObj).then((data) => {
        this.listLoading = false;
        if (data.code == 1) {
          this.tableData = data.data.list;
          this.currentPage = data.data.current_page;
          this.page_count = data.data.page_total;
          this.is_export = data.data.is_export;
        }
      });
    },
    /*
        导出账单列表
         */
    billExport() {
      if (this.is_export) {
        window.location.href = `${this.ENV}/profit/export-agent?id=${this.$route.query.id}`;
      } else {
        this.$sfMessage.error("抱歉，当前用户没有操作权限");
      }
    },
    // 点击分页触发
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getTableDataList();
    },
    searchPile() {
      this.currentPage = 1;
      this.getTableDataList();
    },
    resetSearch() {
      this.modelObj = {
        search: "",
        status: "all",
        start_time: "",
        end_time: "",
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
@import "../../assets/css/trad/agentCheckDetail.scss";
</style>
