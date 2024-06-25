<template>
  <section>
    <div class="section-title">业主分润管理</div>
    <div class="section-header">
      <div class="section-item-header">
        <router-link
          to="/demo/list/tab"
          class="section-act"
        >分润账单</router-link>
        <router-link to="/demo/list/tab">对账单</router-link>
      </div>
      <div class="section-item-header clearfix">
        <span>筛选查询</span>
      </div>
      <div class="header-content clearfix">
        <div class="content-item">
          <div class="header-left">所属业主</div>
          <div class="header-right">
            <el-select
                    v-model="searchObj.search_type"
            >
              <el-option
                      label="1111"
                      value="1"
              />
              <el-option
                      label="22222"
                      value="2"
              />
              <el-option
                      label="dddd"
                      value="3"
              />
            </el-select>
          </div>
        </div>
        <div class="content-item">
          <div class="header-left">账单支付时间</div>
          <div class="header-right">
            <el-date-picker
              v-model="searchObj.start"
              type="date"
              placeholder="选择开始日期"
              value-format="yyyy-MM-dd"
              @change="changeStartDate"
            >
            </el-date-picker>
            <el-date-picker
              class="end-time"
              v-model="searchObj.end"
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
              v-for="(item, index) in tableData"
              :key="index"
            >
              <div class="table-td table-column__1">
                <div class="td-item">{{item.out_trade_id}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{item.account ? item.account : '--'}}</div>
              </div>
              <div class="table-td">
                <div class="td-item td-time">{{item.create_time?item.create_time:'--'}}</div>
              </div>
              <div class="table-td">
                <div class="td-item td-time">{{item.payment_time?item.payment_time:'--'}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{item.real_amount / 100}}</div>
              </div>
              <div class="table-td">
                <el-tooltip
                  content="查看"
                  placement="top"
                >
                  <router-link
                    target="_blank"
                    :to="`/trad/profit/detail?id=${item.id}&start=${modelObj.start}&end=${modelObj.end}`"
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
      ownerList: [],
      roleType: this.$store.state.user.roleType,
      is_export: 0,
      // 分页数据
      currentPage: 1,
      page_count: 1,
      tableData: [],
      // 数据loading
      listLoading: false,
      //搜索条件
      searchObj: {
        search_type: "1",
        words: "",
        station_status: "",
        station_type: "",
        start:'',
        end:''
      },
    };
  },
  created() {
    this.getMonthDay();
    this.getList();
  },
  methods: {
    //修改开始时间
    changeStartDate() {
      var lastDate = this.getMonthLastDate(this.searchObj.start);
      var endDate = this.searchObj.end;
      var startDate = this.searchObj.start;
      var splitStartDate = startDate.split("-");
      var splitEndDate = endDate.split("-");
      if ((splitStartDate[1] != splitEndDate[1]) || (splitStartDate[0]!= splitEndDate[0])) {
        this.searchObj.end =
                splitStartDate[0] + "-" + splitStartDate[1] + "-" + lastDate;
      }
      if (splitStartDate[2] > splitEndDate[2]) {
        this.searchObj.end =
                splitStartDate[0] + "-" + splitStartDate[1] + "-" + lastDate;
      }
    },
    //修改结束时间
    changeEndDate() {
      var endDate = this.searchObj.end;
      var startDate = this.searchObj.start;
      var splitStartDate = startDate.split("-");
      var splitEndDate = endDate.split("-");
      if ((splitStartDate[1] != splitEndDate[1]) || (splitStartDate[0]!= splitEndDate[0])) {
        this.searchObj.start = splitEndDate[0] + "-" + splitEndDate[1] + "-01";
      }
      if (splitStartDate[2] > splitEndDate[2]) {
        this.searchObj.start = splitEndDate[0] + "-" + splitEndDate[1] + "-01";
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
      this.searchObj.end = end_date;
      date.setDate(1);
      var _date = this.$utils.formatDate(date, "yyyy-MM-dd");
      this.searchObj.start = _date;
    },
    //获取列表
    getList() {
      this.listLoading = true;
      this.searchObj.page = this.currentPage;
      this.$api.profitList(this.searchObj).then(data => {
        this.listLoading = false;
        if (data.code == 1) {
          this.tableData = data.data.list;
          this.currentPage = data.data.current_page;
          this.page_count = data.data.page_total;
        }
      });
    },
    // 搜索内容
    searchContent(){
      this.currentPage = 1;
      this.tableData = [];
      this.getConfig();
    },
    // 重置搜索
    resetSearch(){
      this.searchObj = {
        search_type: "1",
        words: "",
        station_status: "",
        station_type: ""
      };
      this.getMonthDay();
      this.getList()
    },
    // 点击分页触发
    handleCurrentChange(page) {
      this.currentPage = page;
      this.tableData = [];
      this.getList();
    },
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/trad/profit.scss";
</style>
