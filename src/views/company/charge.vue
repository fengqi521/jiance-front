<template>
  <section>
    <div class="section-title">充值记录</div>
    <div class="section-list">
      <div class="spend-info">
        <span class="spend-title">充值总计：</span>
        <span class="spend-value">{{recharge_total}}</span>
        <span class="spend-title">元</span>
      </div>
    </div>
    <div class="section-header">
      <div class="section-item-header clearfix">
        <span>筛选查询</span>
      </div>
      <div class="header-content clearfix">
        <div class="content-item">
          <div class="header-left">充值时间</div>
          <div class="header-right">
            <el-date-picker
                    v-model="modelObj.date"
                    type="date"
                    placeholder="选择充值日期"
                    value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </div>
        </div>
        <div class="content-item">
          <div
                  class="btn_succ"
                  @click="searchBill()"
          >查询</div>
          <div
                  class="btn_cancel"
                  @click="resetSearch"
          >重置</div>
        </div>
      </div>
    </div>
    <div class="section-container">
      <div class="section-item-header clearfix">
        <span>充值列表</span>
      </div>
      <div class="section-main">
        <div
                class="table"
                v-loading="loadingFlag"
        >
          <div class="table-th clearfix">
            <div class="table-td">充值时间</div>
            <div class="table-td">充值金额（元）</div>
          </div>
          <div class="table-body">
            <div
                    class="table-tr"
                    v-show="tableData &&tableData.length > 0"
                    v-for="(item,index) in tableData"
                    :key="index"
            >
              <div class="table-td">
                <div class="td-item">{{item.create_time ? item.create_time : '--'}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{item.change_value}}</div>
              </div>
            </div>
            <div
                    v-if="!tableData || tableData.length == 0"
                    class="table-tr unData"
            >
              <img :src="require('assets/img/unData.png')">
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
        modelObj: {
          date: ""
        },
        recharge_total: 0,
        currentPage: 1,
        page_count: 10,
        tableData: []
      };
    },
    created() {
      this.getChargeList();
    },
    methods: {
      // 点击分页触发
      handleCurrentChange(page) {
        this.currentPage = page;
        this.getChargeList();
      },
      //获取账单列表
      getChargeList() {
        var that = this;
        that.loadingFlag = true;
        this.modelObj.page = this.currentPage;
        this.$api.getCompanyCharge(this.modelObj).then(res => {
          that.loadingFlag = false;
          if (res.code == 1) {
            let result = res.data.result;
            that.recharge_total = res.data.charge;
            that.currentPage = result.current_page;
            that.page_count = result.page_total;
            that.tableData = result.list;
          }
        });
      },
      searchBill() {
        this.currentPage = 1;
        this.tableData = [];
        this.getChargeList();
      },
      //重置搜索条件
      resetSearch() {
        this.modelObj = {
          date: ""
        };
        this.currentPage = 1;
        this.getChargeList();
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../assets/css/company/charge.scss";
</style>
