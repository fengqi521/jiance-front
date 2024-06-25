<template>
  <section>
    <div class="section-title">业主分润管理</div>
    <div class="section-header">
      <div class="section-item-router">
        <router-link
          to="/trad/profit"
          class="section-act"
        >分润账单</router-link>
        <router-link to="/trad/profit/check">对账单</router-link>
      </div>
      <div class="section-item-header clearfix">
        <span>筛选查询</span>
      </div>
      <div class="header-content clearfix">
        <div class="content-item">
          <div class="header-left">所属业主</div>
          <div class="header-right">
            <el-select
              v-model="modelObj.owner_id"
              filterable
              :disabled="roleType == 3 ? true : false"
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in ownerList"
                :key="index"
                style="width:148px"
                :label="item.account"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="content-item">
          <div class="header-left">账单支付时间</div>
          <div class="header-right">
            <el-date-picker
              v-model="modelObj.start"
              type="date"
              placeholder="选择开始日期"
              value-format="yyyy-MM-dd"
              @change="changeStartDate"
            >
            </el-date-picker>
            <el-date-picker
              class="end-time"
              v-model="modelObj.end"
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
            @click="searchPile()"
          >查询</div>
          <div
            class="btn_cancel"
            @click="resetSearch()"
          >重置</div>
        </div>
      </div>
    </div>
    <div class="section-container">
      <div class="section-item-header clearfix">
        <span>账单列表</span>
        <div
          class="btn_recovery export-btn"
          @click="generateCheck()"
        ><i class="export-icon"></i>生成对账单</div>
      </div>
      <div class="section-main">
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td table-column__1">账单编号</div>
            <div class="table-td">所属业主</div>
            <div class="table-td">账单生成时间</div>
            <div class="table-td">账单支付时间</div>
            <div class="table-td">账单金额（元）</div>
            <div class="table-td">操作</div>
          </div>
          <div
            class="table-body"
            v-loading="listLoading"
          >
            <div
              class="table-tr"
              v-show="tableData &&tableData.length > 0"
              v-for="(profit, index) in tableData"
              :key="index"
            >
              <div class="table-td table-column__1">
                <div class="td-item">{{profit.out_trade_id}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{profit.account ? profit.account : '--'}}</div>
              </div>
              <div class="table-td">
                <div class="td-item td-time">{{profit.create_time?profit.create_time:'--'}}</div>
              </div>
              <div class="table-td">
                <div class="td-item td-time">{{profit.payment_time?profit.payment_time:'--'}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{profit.real_amount}}</div>
              </div>
              <div class="table-td">
                <el-tooltip
                  content="查看"
                  placement="top"
                >
                  <router-link
                    target="_blank"
                    :to="`/trad/profit/detail?id=${profit.id}&start=${modelObj.start}&end=${modelObj.end}`"
                    class="td-item see-icon"
                  ></router-link>
                </el-tooltip>
              </div>
            </div>
            <div
              v-if="!tableData || tableData.length === 0"
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
      search_account: "",
      modelObj: {
        owner_id: "",
        account: "",
        start: "",
        end: ""
      },
      currentPage: 1,
      page_count: 1,
      tableData: [],
      listLoading: false,
      ownerList: [],
      roleType: this.$store.state.user.roleType,
      is_export: 0,
    };
  },
  created() {
    this.getMonthDay();
    this.getOwnersList();
  },
  methods: {
    getOwnersList() {
      var _this = this;
      var params = {
        search: _this.words
      };
      this.$api.pileOwners(params).then(res => {
        if (res.code == 1) {
          this.ownerList = res.data;
          if (this.ownerList.length > 0) {
            this.modelObj.owner_id = this.ownerList[0].id;
            this.getTableDataList();
          }
        }
      });
    },
    changeStartDate() {
      var lastDate = this.getMonthLastDate(this.modelObj.start);
      var endDate = this.modelObj.end;
      var startDate = this.modelObj.start;
      var splitStartDate = startDate.split("-");
      var splitEndDate = endDate.split("-");

      if ((splitStartDate[1] != splitEndDate[1]) || (splitStartDate[0]!= splitEndDate[0])) {
        this.modelObj.end =
          splitStartDate[0] + "-" + splitStartDate[1] + "-" + lastDate;
      }

      if (splitStartDate[2] > splitEndDate[2]) {
        this.modelObj.end =
          splitStartDate[0] + "-" + splitStartDate[1] + "-" + lastDate;
      }
    },
    changeEndDate() {
      var endDate = this.modelObj.end;
      var startDate = this.modelObj.start;
      var splitStartDate = startDate.split("-");
      var splitEndDate = endDate.split("-");

      if ((splitStartDate[1] != splitEndDate[1]) || (splitStartDate[0]!= splitEndDate[0])) {
        this.modelObj.start = splitEndDate[0] + "-" + splitEndDate[1] + "-01";
      }

      if (splitStartDate[2] > splitEndDate[2]) {
        this.modelObj.start = splitEndDate[0] + "-" + splitEndDate[1] + "-01";
      }
    },
    getMonthLastDate(_date) {
      var splitDate = _date.split("-");
      var date = new Date(splitDate[0], splitDate[1], 0);
      return date.getDate();
    },
    getTableDataList() {
      this.listLoading = true;
      this.modelObj.page = this.currentPage;
      this.$api.profitList(this.modelObj).then(data => {
        this.listLoading = false;
        if (data.code == 1) {
          this.tableData = data.data.list;
          this.currentPage = data.data.current_page;
          this.page_count = data.data.page_total;
          this.is_export = data.data.is_export;
        }
      });
    },
    searchPile() {
      this.search_account = this.modelObj.account;
      this.currentPage = 1;
      this.getTableDataList();
    },
    resetSearch() {
      this.search_account = "";
      this.modelObj.account = "";
      this.modelObj.start = "";
      this.modelObj.end = "";
      this.currentPage = 1;
      this.page_count = 1;
      this.tableData = [];
      this.getMonthDay();
      this.getTableDataList();
    },
    // 点击分页触发
    handleCurrentChange(page) {
      this.currentPage = page;
      this.tableData = [];
      this.getTableDataList();
    },
    generateCheck() {
      if (this.is_export) {
        if (this.tableData.length  == 0) {
          this.$sfNotify({
            type: "error",
            message: "暂无可生成的对账单"
          });
          return false;
        }
        this.modelObj.account = this.search_account;
        this.$api.profitGenerate(this.modelObj).then(data => {
          if (data.code == 1) {
            // 成功
            this.$sfNotify({
              message: "成功"
            });
            this.getTableDataList();
          } else {
            this.$sfNotify({
              duration: 0,
              type: "error",
              message: "失败"
            });
          }
        });
      } else {
        this.$sfMessage.error("抱歉，当前用户没有操作权限");
      }
    },
    getMonthDay() {
      var date = new Date();
      var end_date = this.$utils.formatDate(date, "yyyy-MM-dd");
      this.modelObj.end = end_date;
      date.setDate(1);
      var _date = this.$utils.formatDate(date, "yyyy-MM-dd");
      this.modelObj.start = _date;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/trad/profit.scss";
</style>
