<template>
  <section>
    <div class="section-title">运维数据分析</div>
    <div class="section-header">
      <div class="section-item-router">
        <router-link to="/data/maintenance" class="section-act"
          >车辆数据</router-link
        >
        <router-link to="/data/maintenance/charging" v-if="pile_rule"
          >充电桩数据</router-link
        >
      </div>
      <div class="section-item-header clearfix">
        <span>筛选查询</span>
      </div>
      <div class="header-content clearfix">
        <div class="content-item">
          <div class="header-left">车架号</div>
          <div class="header-right">
            <el-input
              class="search-input"
              v-model="searchParams.search_content"
              placeholder="输入车架号"
            />
          </div>
        </div>
        <div class="content-item">
          <div class="header-left">电池类型</div>
          <div class="header-right">
            <el-select v-model="searchParams.battery_type" placeholder="请选择">
              <el-option label="全部" value="" />
              <el-option
                v-for="(item, index) in batteryList"
                :key="index"
                :label="item.label"
                :value="item.type"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="content-item">
          <div class="btn_succ" @click="searchBattery()">查询</div>
          <div class="btn_cancel" @click="resetSearch()">重置</div>
        </div>
      </div>
    </div>
    <div class="section-container">
      <div class="section-item-header clearfix">
        <span>车辆电池信息列表</span>
        <router-link to="/data/maintenance/battery" v-if="battery_rule">
          <div class="btn_recovery">车辆电池类型统计 >></div></router-link
        >
        <div class="btn_recovery" v-else @click="notPermission">
          车辆电池类型统计 >>
        </div>
      </div>
      <div class="section-main">
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td">车架号</div>
            <div class="table-td">电池类型</div>
            <div class="table-td">整车动力蓄电池系统额定容量(Ah)</div>
            <div class="table-td">最高允许充电电流(A)</div>
            <div class="table-td">最高允许充电总电压(V)</div>
            <div class="table-td">最高允许温度(℃)</div>
            <div class="table-td">电池生产厂商</div>
            <div class="table-td">电池组生产日期</div>
          </div>
          <div class="table-body" v-loading="listLoading">
            <div
              class="table-tr"
              v-show="tableData && tableData.length > 0"
              v-for="(profit, index) in tableData"
              :key="index"
            >
              <div class="table-td">
                <div class="td-item">{{ profit.vin ? profit.vin : "--" }}</div>
              </div>
              <div class="table-td">
                <div class="td-item">
                  {{
                    profit.battery_type_text ? profit.battery_type_text : "--"
                  }}
                </div>
              </div>
              <div class="table-td">
                <div class="td-item td-time">
                  {{ profit.battery_ah ? profit.battery_ah : "--" }}
                </div>
              </div>
              <div class="table-td">
                <div class="td-item td-time">
                  {{ profit.h_a ? profit.h_a : "--" }}
                </div>
              </div>
              <div class="table-td">
                <div class="td-item">
                  {{ profit.t_high_v ? profit.t_high_v : "--" }}
                </div>
              </div>
              <div class="table-td">
                <div class="td-item">
                  {{ profit.h_tem ? profit.h_tem : "--" }}
                </div>
              </div>
              <div class="table-td">
                <el-tooltip
                  v-if="profit.manufacturer"
                  :content="profit.manufacturer"
                  placement="top"
                >
                  <div class="td-item">
                    {{ profit.manufacturer }}
                  </div>
                </el-tooltip>
                <div class="td-item" v-else>--</div>
              </div>
              <div class="table-td">
                <div class="td-item">
                  {{ profit.manu_date ? profit.manu_date : "--" }}
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
  data () {
    return {
      searchParams: {
        search_content: '',
        battery_type: '',
      },
      batteryList: [],
      tableData: [],
      currentPage: 1,
      page_count: 1,
      listLoading: false,
      battery_rule: true,
      pile_rule: true
    };
  },
  created () {
    this.getBatteryType();
    this.getTableDataList();
  },
  methods: {

    //查询数据
    searchBattery () {
      this.currentPage = 1;
      this.getTableDataList();
    },

    //获取电池类型
    getBatteryType () {
      this.$api.getMaintenanceBatteryTypeData().then(res => {
        const { code, data = [] } = res;
        if (code === 1) {
          try {
            this.batteryList = Object.keys(data).map(attrName => {
              const label = data[attrName];
              return { type: attrName, label }
            });
          } catch (err) {
            console.error(err)
          }
        }
      })
    },

    //获取电池信息列表
    getTableDataList () {
      this.listLoading = true;
      this.searchParams.page = this.currentPage;
      this.$api.getMaintenanceBatteryData(this.searchParams).then(res => {
        this.listLoading = false;
        if (res.code == 1) {
          this.tableData = res.data.list;
          this.currentPage = res.data.current_page;
          this.page_count = res.data.page_total;
          this.is_export = res.data.is_export;
          this.battery_rule = res.data.battery_rule
          this.pile_rule = res.data.pile_rule
        } else {
          this.$sfNotify({
            duration: 0,
            type: "error",
            message: res.message,
          });
        }
      }).catch(err => {
        console.error(err)
      })
    },

    //重置
    resetSearch () {
      this.searchParams = {
        search_content: '',
        battery_type: ''
      };
      this.currentPage = 1;
      this.page_count = 1;
      this.tableData = [];
      this.getTableDataList();
    },

    // 点击分页触发
    handleCurrentChange (page) {
      this.currentPage = page;
      this.tableData = [];
      this.getTableDataList();
    },

    //权限判断
    notPermission () {
      this.$sfMessage.error("抱歉，当前用户没有操作权限");
    },
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/data/maintenanceVehicle.scss";
</style>
