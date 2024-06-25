<template>
  <section>
    <div class="section-title">
      <router-link to="/card/message">卡信息</router-link> > 卡详情
    </div>
    <div class="section-header">
      <div class="section-item-router">
        <router-link :to="`/card/message/detail/${modelObj.card_number}`">充值详情</router-link>
        <router-link
          :to="`/card/message/account/${modelObj.card_number}`"
          class="section-act"
        >消费金额</router-link>
      </div>
      <div class="header-content clearfix" v-loading="topLoading">
        <div class="content-top">
          <div class="top-item">
            <div class="top-item-title">卡余额（元）</div>
            <div
              class="top-item-text ellipsis"
              :class="parseFloat(topData.balance) ? 'section-end' : '' "
            >
              {{ topData.balance ? topData.balance : 0 }}
            </div>
          </div>
          <div class="top-item">
            <div class="top-item-title">消费总计（元）</div>
            <div
              class="top-item-text ellipsis"
              :class="parseFloat(topData.total_cost_amount) ? 'section-end' : ''"
            >
              {{ topData.total_cost_amount ? topData.total_cost_amount : 0 }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="section-container">
      <div class="section-item-header">
        <span>账单列表</span>
      </div>
      <div class="section-main">
        <div class="header-content clearfix">
          <div class="content-item">
            <div class="header-left">账单编号</div>
            <div class="header-right">
              <el-input class="search-input" v-model="modelObj.search_content" placeholder="关键字搜索" />
            </div>
          </div>
          <div class="content-item">
            <div class="header-left">账单支付时间</div>
            <div class="header-right">
              <el-date-picker
                v-model="modelObj.start_time"
                type="date"
                placeholder="选择开始日期"
                value-format="yyyy-MM-dd"
                @change="changeStartDate" 
              >
              </el-date-picker>
              <el-date-picker
                class="end_time"
                v-model="modelObj.end_time"
                type="date"
                placeholder="选择结束日期"
                value-format="yyyy-MM-dd"
                @change="changeEndDate"
              >
              </el-date-picker>
            </div>
          </div>
          <div class="content-item">
            <div
              class="btn_succ"
              @click="searchStation()"
            >查询</div>
            <div
              class="btn_cancel"
              @click="resetSearch()"
            >重置</div>
          </div>
        </div>
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td">消费账单编号</div>
            <div class="table-td">消费时间</div>
            <div class="table-td">消费金额（元）</div>
          </div>
          <div
            class="table-body"
            v-loading="listLoading"
          >
            <div
              class="table-tr"
              v-show="tableData && tableData.length"
              v-for="(list, index) in tableData"
              :key="index"
            >
              <div class="table-td">
                <div class="td-item hover-green">
                  <router-link
                    :to="`/card/message/bill?id=${list.out_trade_id}&month=${modelObj.start_time}&card_number=${modelObj.card_number}`"
                  >{{list.out_trade_id}}</router-link>
                </div>
              </div>
              <div class="table-td">
                <div class="td-item">{{list.payment_time}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{list.real_amount}}</div>
              </div>
            </div>
            <div
              class="table-tr unData"
              v-if="!tableData || tableData.length === 0"
            >
              <img :src="require('assets/img/unData.png')">
              <span>暂无数据</span>
            </div>
          </div>
          <!-- 分页 -->
          <sf-pagination
            v-if="tableData && tableData.length>0"
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
      topData: {},
      tableData: [],
      listLoading: false,
      topLoading: false,
      currentPage: 1,
      page_count: 1,
      modelObj: {
        card_number: this.$route.params.id,
        start_time: "",
        end_time: "",
        search_type: "1",
        search_content: "",
      },
    };
  },
  created() {
    this.getMonthDay();
    this.getDataTopList();
    this.getDataList();
  },
  methods: {
    //卡详情
    getDataTopList() {
      this.topLoading = true;
      let param = {
        card_number: this.modelObj.card_number,
      };
      this.$api.getCardDetailTop(param).then(data => {
        this.topLoading = false;
        if (data.code == 1) {
          this.topData = data.data;
        }
      });
    },
    //卡详情列表
    getDataList() {
      this.listLoading = true;
      this.modelObj.page = this.currentPage;
      this.$api.getCardAccountList(this.modelObj).then(data => {
        this.listLoading = false;
        if (data.code == 1) {
          this.tableData = data.data.list;
          this.currentPage = data.data.current_page;
          this.page_count = data.data.page_total;
        }
      });
    },
    changeStartDate() {
      var lastDate = this.getMonthLastDate(this.modelObj.start_time);
      var endDate = this.modelObj.end_time;
      var startDate = this.modelObj.start_time;
      var splitStartDate = startDate.split("-");
      var splitEndDate = endDate.split("-");

      if ((splitStartDate[1] != splitEndDate[1]) || (splitStartDate[0]!= splitEndDate[0])) {
        this.modelObj.end_time =
          splitStartDate[0] + "-" + splitStartDate[1] + "-" + lastDate;
      }

      if (splitStartDate[2] > splitEndDate[2]) {
        this.modelObj.end_time =
          splitStartDate[0] + "-" + splitStartDate[1] + "-" + lastDate;
      }
    },
    changeEndDate() {
      var endDate = this.modelObj.end_time;
      var startDate = this.modelObj.start_time;
      var splitStartDate = startDate.split("-");
      var splitEndDate = endDate.split("-");

      if ((splitStartDate[1] != splitEndDate[1]) || (splitStartDate[0]!= splitEndDate[0])) {
        this.modelObj.start_time = splitEndDate[0] + "-" + splitEndDate[1] + "-01";
      }

      if (splitStartDate[2] > splitEndDate[2]) {
        this.modelObj.start_time = splitEndDate[0] + "-" + splitEndDate[1] + "-01";
      }
    },
    getMonthLastDate(_date) {
      var splitDate = _date.split("-");
      var date = new Date(splitDate[0], splitDate[1], 0);
      return date.getDate();
    },
    getMonthDay() {
      var date = new Date();
      var end_date = this.$utils.formatDate(date, "yyyy-MM-dd");
      this.modelObj.end_time = end_date;
      date.setDate(1);
      var _date = this.$utils.formatDate(date, "yyyy-MM-dd");
      this.modelObj.start_time = _date;
    },
    searchStation() {
      this.currentPage = 1;
      this.tableData = [];
      this.getDataList();
    },
    resetSearch() {
      this.modelObj = {
        card_number: this.$route.params.id,
        start_time: "",
        end_time: "",
        search_type: "1",
        search_content: "",
      },
      this.currentPage = 1;
      this.page_count = 1;
      this.tableData = [];
      this.getMonthDay();
      this.getDataList();
    },
    // 点击分页触发
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getDataList();
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../assets/css/card/messageAccount.scss";
</style>
