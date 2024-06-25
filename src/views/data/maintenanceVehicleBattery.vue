<template>
  <section class="section-maintenance-battery">
    <!-- 标题 -->
    <div class="section-title">
      <router-link to="/data/maintenance">运维数据分析</router-link>
      >车辆电池
    </div>
    <!-- 查询 -->
    <div class="section-select">
      <span class="select-label">选择区域</span>
      <el-select v-model="area_id" placeholder="请选择" @change="loadingData">
        <el-option label="全国" value="" />
        <el-option
          v-for="item in area_list"
          style="width: 140px"
          :key="item.code"
          :label="item.name"
          :value="item.code"
        >
        </el-option>
      </el-select>
    </div>
    <!--车辆电池类型总数分布-->
    <div class="section-distribution">
      <div class="section-item-header clearfix">车辆电池类型总数分布</div>
      <span class="chart-title"
        >统计截止到昨天，在选定区域内充电车辆的电池类型总数百分比分布，一台车辆只记一次</span
      >
      <div
        is="batteryDistributionPie"
        ref="batteryDistributionPie"
        label="battery_type_distribution"
      ></div>
    </div>
    <!-- 车辆电池类型百分比 -->
    <div class="section-percent">
      <div class="section-item-header clearfix">车辆电池类型百分比</div>
      <span class="chart-title"
        >统计每个月内（不记当前月），在选定区域内充电车辆的电池类型分布，一台车辆只记一次</span
      >
      <div
        is="stackPercentChart"
        ref="stackPercentChart"
        label="battery_type_distribution"
      ></div>
    </div>
  </section>
</template>
<script>
import stackPercentChart from "./components/stackPercentChart";
import batteryDistributionPie from './components/batteryDistributionPie'
export default {
  components: {
    stackPercentChart,
    batteryDistributionPie
  },
  data () {
    return {
      area_id: '',
      area_list: [],
    };
  },
  mounted () {
    this.getAreaList();
    this.loadingData()
  },
  methods: {
    //获取全国的地域列表
    getAreaList: function () {
      var that = this;
      this.$api.getAreaList({}).then(res => {
        that.area_list = res.data;
      });
    },
    //切换区域
    loadingData: function () {
      this.getBatteryVisualTotalData();
      this.getBatteryPercentData()
    },
    //获取车辆电池类型总数分布
    getBatteryVisualTotalData: function () {
      this.$api
        .getMaintenanceBatteryVisualData({ provinceCode: this.area_id })
        .then((res) => {
          if (res.code === 1) {
            this.$refs.batteryDistributionPie.showEcharts(res.data);
          } else {
            this.$sfNotify({
              duration: 0,
              type: "error",
              message: res.message,
            });
          }
        })
        .catch((error) => {
          console.error(error);
          this.listLoading = false;
        });
    },

    //获取车辆电池类型百分比数据
    getBatteryPercentData: function () {
      this.$api.getMaintenanceBatteryPercentData({ provinceCode: this.area_id }).then(res => {
        if (res.code === 1) {
          this.$refs.stackPercentChart.showEcharts(res.data)
        } else {
          this.$sfNotify({
            duration: 0,
            type: "error",
            message: res.message,
          });
        }
      }).catch((error) => {
        console.error(error);
        this.listLoading = false;
      });
    }
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/data/maintenanceBatteryType.scss";
</style>
