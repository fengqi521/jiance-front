<template>
  <section>
    <div class="section-title">告警列表</div>
    <div class="section-header">
      <div class="section-item-header clearfix">
        <span>筛选查询</span>
      </div>
      <div class="header-content clearfix">
        <div class="content-item">
          <div class="header-left">告警时间</div>
          <div class="header-right">
            <el-date-picker
              v-model="modelObj.start"
              type="date"
              placeholder="选择开始日期"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
            <el-date-picker
              class="end-time"
              v-model="modelObj.end"
              type="date"
              placeholder="选择结束日期"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </div>
        </div>
        <div class="content-item">
          <div class="header-left">联系人</div>
          <div class="header-right">
            <el-input
              class="search-input"
              v-model="modelObj.contact"
              placeholder="输入联系人手机号"
            />
          </div>
        </div>
        <div class="content-item">
          <div class="header-left">故障类型</div>
          <div class="header-right">
            <el-select v-model="modelObj.fault_type">
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
            </el-select>
          </div>
        </div>
        <div class="content-item">
          <div class="header-left">告警结果</div>
          <div class="header-right">
            <el-select v-model="modelObj.status">
              <el-option
                label="全部"
                value="0"
              />
              <el-option
                label="告警成功"
                value="1"
              />
              <el-option
                label="告警失败"
                value="2"
              />
            </el-select>
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
        <span>告警列表</span>
      </div>
      <div class="section-main">
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td table-column__1">告警标题</div>
            <div class="table-td">告警方式</div>
            <div class="table-td">联系人</div>
            <div class="table-td">告警时间</div>
            <div class="table-td table-column__2">告警内容</div>
            <div class="table-td table-column__3">故障类型</div>
            <div class="table-td">告警结果</div>
          </div>
          <div
            class="table-body"
            v-loading="listLoading"
          >
            <div
              class="table-tr"
              v-show="tableData &&tableData.length > 0"
              v-for="(history, index) in tableData"
              :key="index"
            >
              <div class="table-td table-column__1">
                <div class="td-item">{{history.title}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{alarm_type_array[history.type]}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{history.contact}}</div>
              </div>
              <div class="table-td">
                <div class="td-item td-time">{{history.create_time}}</div>
              </div>
              <div class="table-td  table-column__2">
                <div class="td-item">{{history.content?history.content:'暂无'}}</div>
              </div>
              <div class="table-td  table-column__3">
                <div class="td-item">{{fault_type_array[history.fault_type]}}</div>
              </div>
              <div class="table-td">
                <div
                  :class="['td-item' , history.status == 2 ? 'section-no-begin' : '']"
                >{{history.status == 1?'成功':'失败'}}</div>
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
      modelObj: {
        start: "",
        end: "",
        contact: "",
        fault_type: "0",
        status: "0"
      },
      currentPage: 1,
      page_count: 1,
      tableData: [],
      listLoading: false,
      alarm_type_array: {
        "1": "手机号",
        "2": "邮件"
      },
      fault_type_array: {
        "1": "设备故障",
        "2": "电源故障",
        "3": "车辆故障"
      }
    };
  },
  created() {
    this.getTableDataList();
  },
  methods: {
    getTableDataList() {
      this.listLoading = true;
      this.modelObj.page = this.currentPage;
      this.$api.alarmHistory(this.modelObj).then(data => {
        this.listLoading = false;
        if (data.code == 1) {
          this.tableData = data.data.list;
          this.currentPage = data.data.current_page;
          this.page_count = data.data.page_total;
        }
      });
    },
    searchPile() {
      this.currentPage = 1;
      this.tableData = [];
      this.getTableDataList();
    },
    resetSearch() {
      this.modelObj.start = "";
      this.modelObj.end = "";
      this.modelObj.contact = "";
      this.modelObj.fault_type = "";
      this.modelObj.status = "";
      this.currentPage = 1;
      this.page_count = 1;
      this.tableData = [];
      this.getTableDataList();
    },
    // 点击分页触发
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getTableDataList();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/run/deploy.scss";
</style>
