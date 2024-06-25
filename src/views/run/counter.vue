<template>
  <section>
    <div class="section-title">远程充电账单</div>
    <div class="section-tips">
      <i class="warning-icon"></i>
      <div class="section-tips-content">
        <span class="tips-text">注意：远程充电账单仅显示从设备监控页面，远程控制开始充电的账单，账单列表会显示充电操作人。</span>
      </div>
    </div>
    <div class="section-header">
      <div class="section-item-header clearfix">
        <span>筛选查询</span>
      </div>
      <div class="header-content clearfix">
        <div class="content-item">
          <el-select
            class="search-type"
            v-model="modelObj.search_type"
          >
            <el-option
              label="账单编号"
              value="1"
            />
            <el-option
              label="充电桩编号"
              value="2"
            />
            <el-option
              label="操作人"
              value="3"
            />
          </el-select>
          <el-input
            class="search-input"
            v-model="modelObj.search_content"
            placeholder="关键字搜索"
          />
        </div>
        <div class="content-item">
          <div class="header-left">账单生成时间</div>
          <div class="header-right">
            <el-date-picker
              v-model="modelObj.start_time"
              type="date"
              placeholder="选择开始日期"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptionsStart"
              @change="changeStartDate"
            >
            </el-date-picker>
            <el-date-picker
              class="end-time"
              v-model="modelObj.end_time"
              type="date"
              placeholder="选择结束日期"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptionsEnd"
              @change="changeEndDate"
            >
            </el-date-picker>
          </div>
        </div>
        <div class="content-item">
          <div class="header-left">所属充电站</div>
          <div class="header-right">
            <el-select v-model="modelObj.station_id">
              <el-option
                label="全部"
                value="all"
              />
              <el-option
                v-for="(item,index) in station_list"
                :label="item.station_name"
                :key="index"
                style="width:148px"
                :value="item.station_id"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="content-item">
          <div
            class="btn_succ"
            @click="seachBill"
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
        <span>账单列表</span>
        <div
          class="btn_recovery export-btn"
          @click="billExport"
        ><i class="export-icon"></i>导出</div>
      </div>
      <div class="section-main">
        <div
          class="table"
          v-loading="loadingFlag"
        >
          <div class="table-th clearfix">
            <div class="table-td table-column__1">账单编号</div>
            <div class="table-td">账单生成时间</div>
            <div class="table-td">充电桩编号</div>
            <div class="table-td">所属充电站</div>
            <div class="table-td">车架号</div>
            <div class="table-td">充电操作人</div>
            <div class="table-td">操作</div>
          </div>
          <div class="table-body">
            <div
              class="table-tr"
              v-show="tableData &&tableData.length > 0"
              v-for="(item, index) in tableData"
              :key="index"
            >
              <div class="table-td table-column__1">
                <div
                  class="td-item">{{item.out_trade_id ? item.out_trade_id : '--'}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{item.payment_time ? item.payment_time : '--'}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{item.pile_sn}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{item.station_name}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{item.vin ? item.vin:'--'}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{item.user_id}}</div>
              </div>
              <div class="table-td">
                <el-tooltip
                  content="查看"
                  placement="top"
                >
                  <router-link
                    target="_blank"
                    :to="`/run/counter/detail?id=${item.out_trade_id}&month=${modelObj.start_time}`"
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
      ENV: process.env.NODE_ENV == "development" ? "/api" : "",
      loadingFlag: false,
      modelObj: {
        search_type: "1",
        search_content: "",
        start_time: "",
        end_time: "",
        status: "all",
        station_id: "all",
      },
      station_list: [],
      currentPage: 1,
      page_count: 0,
      tableData: [],
      pickerOptionsStart: {
        disabledDate(time) {
          return false;
        }
      },
      pickerOptionsEnd: {
        disabledDate(time) {
          return false;
        }
      },
      is_export: 0,
    };
  },
  created() {
    this.getElecBillList();
    this.getStationList();
    this.getMonthDay();
  },
  methods: {
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
        this.modelObj.start_time =
          splitEndDate[0] + "-" + splitEndDate[1] + "-01";
      }

      if (splitStartDate[2] > splitEndDate[2]) {
        this.modelObj.start_time =
          splitEndDate[0] + "-" + splitEndDate[1] + "-01";
      }
    },
    getMonthLastDate(_date) {
      var splitDate = _date.split("-");
      var date = new Date(splitDate[0], splitDate[1], 0);
      return date.getDate();
    },
    // 点击分页触发
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getElecBillList();
    },
    seachBill() {
      this.currentPage = 1;
      this.getElecBillList();
    },
    /*
       获取账单列表
       */
    getElecBillList() {
      var that = this;
      that.loadingFlag = true;
      this.modelObj.page = this.currentPage;
      this.$api.getElecBillList(this.modelObj).then(res => {
        that.loadingFlag = false;
        if (res.code == 1) {
          that.page_count = Math.ceil(res.data.total_count / 10);
          that.currentPage = res.data.current_page;
          that.tableData = res.data.list;
          that.is_export = res.data.is_export;
        }
      });
    },
    /*
       重置搜索条件
     */
    resetSearch() {
      this.modelObj.search_type = "1";
      this.currentPage = 1;
      this.modelObj.search_content = "";
      this.modelObj.status = "all";
      this.modelObj.station_id = "all";
      this.modelObj.status = "all";

      this.getMonthDay();
      this.getElecBillList();
    },
    /*
      获取充电站的列表
     */
    getStationList() {
      var that = this;
      this.$api.getElecStation({}).then(res => {
        if (res.code == 1) {
          that.station_list = res.data.list;
        }
      });
    },
    /*
      获取当月的第一天
       */
    getMonthDay() {
      var date = new Date();
      var toDay = this.$utils.formatDate(date, "yyyy-MM-dd");
      this.modelObj.end_time = toDay;
      date.setDate(1);
      var _date = this.$utils.formatDate(date, "yyyy-MM-dd");
      this.modelObj.start_time = _date;
    },
    /*
      导出账单列表
       */
    billExport() {
      if (this.is_export) {
        window.location.href = `${this.ENV}/maintain/maintain/export?start_time=${this.modelObj.start_time}&end_time=${this.modelObj.end_time}&station_id=${this.modelObj.station_id}&search_type=${this.modelObj.search_type}&search_content=${this.modelObj.search_content}`;
      } else {
        this.$sfMessage.error("抱歉，当前用户没有操作权限");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/run/counter.scss";
</style>
