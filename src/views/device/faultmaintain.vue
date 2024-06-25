<template>
  <section>
    <div class="section-title">
      <router-link to="/device/pile">充电桩管理</router-link> > 充电桩运维
    </div>
    <p class="section-name">充电桩名称：{{pile_name}}</p>
    <div class="section-container">
      <div class="section-item-router">
        <router-link :to="`/device/pile/maintain?pile_id=${pile_id}&pile_sn=${pile_sn}&source=${source}`">设备运维</router-link>
        <router-link
          :to="`/device/pile/fault?pile_id=${pile_id}&pile_sn=${pile_sn}&source=${source}`"
          class="section-act"
        >故障运维</router-link>
      </div>
      <div class="header-content clearfix">
        <div class="content-left clearfix">
          <div class="content-item">
            <div class="header-left">事件</div>
            <div class="header-right">
              <el-select
                class="event-type"
                v-model="modelObj.etype"
              >
                <el-option
                  label="全部"
                  value=""
                />
                <el-option
                  label="发生故障"
                  value="0"
                />
                <el-option
                  label="自动修复故障"
                  value="1"
                />
                <el-option
                  label="手动修复故障"
                  value="2"
                />
              </el-select>
            </div>
          </div>
          <div class="content-item">
            <div class="header-left">发生时间：</div>
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
            <div class="header-left">故障类型：</div>
            <div class="header-right">
              <el-select v-model="modelObj.ftype">
                <el-option
                  label="全部"
                  value="0"
                />
                <el-option
                  label="设备故障"
                  value="1"
                />
                <el-option
                  label="电源故障"
                  value="2"
                />
                <el-option
                  label="车辆故障"
                  value="3"
                />
                <el-option
                  label="未知故障"
                  value="8"
                />
              </el-select>
            </div>
          </div>
          <div class="content-item">
            <div
              class="btn_succ"
              @click="searchFault()"
            >查询</div>
            <div
              class="btn_cancel"
              @click="resetSearch()"
            >重置</div>
          </div>
        </div>
        <div
          v-if="source == 1"
          class="btn_recovery recovery-btn"
          @click="showFaultSure = true"
        >故障恢复</div>
        <el-tooltip content="不允许修改第三方充电桩" placement="top">
            <div
              v-if="source != 1"
              style="cursor: not-allowed;"
              class="btn_recovery recovery-btn"
            >故障恢复</div>
        </el-tooltip>
        
      </div>
      <div class="section-main">
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td table-name">发生时间</div>
            <div class="table-td table-name">事件</div>
            <div class="table-td table-name">故障类型</div>
            <div class="table-td">枪口号</div>
            <div class="table-td table-desc">故障描述</div>
            <div class="table-td">操作人</div>
          </div>
          <div
            class="table-body"
            v-loading="listLoading"
          >
            <div
              class="table-tr"
              v-show="tableData && tableData.length"
              v-for="(pile_fault, index) in tableData"
              :key="index"
            >
              <div class="table-td table-name">
                <div class="td-item">{{pile_fault.dt}}</div>
              </div>
              <div class="table-td table-name">
                <div class="td-item">{{etype_array[pile_fault.etype]}}</div>
              </div>
              <div class="table-td table-name">
                <div class="td-item">{{pile_fault.ftype?ftype_array[pile_fault.ftype]:'--'}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{pile_fault.gun_index?pile_fault.gun_index:'--'}}</div>
              </div>
              <div class="table-td table-desc">
                <div class="td-item" v-if="pile_fault.ftype == 8">{{pile_fault.code?pile_fault.code:'--'}}</div>
                <div class="td-item" v-else>{{pile_fault.desc?pile_fault.desc:'--'}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{pile_fault.opuser}}</div>
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
            v-show="tableData && tableData.length"
            :currentPage="currentPage"
            :page-count="page_count"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
    <!-- 故障恢复 -->
    <sf-modelBox
      :showModel.sync="showFaultSure"
      title="恢复确认"
      @change="doPileResume"
    >
      <p>确定所有故障都已恢复？</p>
    </sf-modelBox>
  </section>
</template>

<script>
export default {
  data() {
    return {
      pile_sn: this.$route.query.pile_sn ? this.$route.query.pile_sn : "",
      pile_id: this.$route.query.pile_id ? this.$route.query.pile_id : "",
      source: this.$route.query.source ? this.$route.query.source : "",
      showFaultSure: false,
      modelObj: {
        etype: "",
        ftype: "0",
        start_time: "",
        end_time: "",
        pile_sn: this.$route.query.pile_sn ? this.$route.query.pile_sn : ""
      },
      currentPage: 1,
      page_count: 1,
      listLoading: false,
      tableData: [],
      pile_name: "",
      etype_array: {
        "0": "发生故障",
        "1": "自动恢复故障",
        "2": "手动恢复故障"
      },
      ftype_array: {
        "1": "设备故障",
        "2": "电源故障",
        "3": "车辆故障",
        "8": "未知故障"
      },
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
    };
  },
  created() {
    this.getMonthDay();
    this.getTableDataList();
  },
  methods: {
    getTableDataList() {
      this.listLoading = true;
      this.modelObj.page = this.currentPage;
      this.$api.pileFault(this.modelObj).then(data => {
        this.listLoading = false;
        if (data.code == 1) {
          this.pile_name = data.data.pile.pile_name;
          this.tableData = data.data.list;
          this.currentPage = data.data.current_page;
          this.page_count = data.data.page_total;
        }
      });
    },
    doPileResume() {
      var params = {
        pile_sn: this.pile_sn
      };
      this.$api.pileResume(params).then(res => {
        this.showFaultSure = false;
        if (res.code == 1) {
          this.$sfNotify({
            message: "恢复成功"
          });
          this.currentPage = 1
          this.getTableDataList()
        } else {
          this.$sfNotify({
            type: "error",
            message: res.message
          });
        }
      });
    },
    searchFault() {
      this.currentPage = 1;
      this.tableData = [];
      this.getTableDataList();
    },
    resetSearch() {
      this.modelObj.etype = "";
      this.modelObj.fault_type = "0";
      this.modelObj.date = "";
      this.currentPage = 1;
      this.page_count = 1;
      this.tableData = [];
      this.getTableDataList();
    },
    // 点击分页触发
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getTableDataList();
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
  }
};
</script>
<style ref="stylesheet/scss" lang="scss" scoped>
@import "../../assets/css/device/fault.scss";
</style>
