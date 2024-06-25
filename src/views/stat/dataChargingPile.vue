<template>
  <section class="section-maintenance-charging">
    <div class="section-title">运维数据分析</div>
    <div class="section-select-stat">
      <div class="header-left">选择充电站</div>
      <div class="header-right">
        <el-select
          v-model="searchParams.station_id"
          placeholder="请选择"
          @change="changStation"
        >
          <el-option label="全部" value="" />
          <el-option
            v-for="item in station_list"
            style="width: 204px"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="section-container">
      <div class="section-item-header">故障数据统计</div>
      <!-- 故障统计 -->
      <div class="section-fault-statistic">
        <div class="fault-content">
          <div class="fault-item">
            <div class="item-info">
              <div class="info-left" style="width: 33.3%;">
                <div class="info-left-title">当前未解决故障次数</div>
                <div class="info-left-count">
                  {{
                    device_fault_data.pile_unfaults_total | dataCoversion(this)
                  }}
                </div>
              </div>
              <div class="info-right" style="width: 33.3%;">
                <div>
                  <div class="info-right-title">今日故障设备数</div>
                  <div class="info-right-title">今日故障次数</div>
                </div>
                <div>
                  <div class="info-right-count">
                    {{
                      device_fault_data.fault_today_device | dataCoversion(this)
                    }}
                  </div>
                  <div class="info-right-count">
                    {{
                      device_fault_data.fault_today_num | dataCoversion(this)
                    }}
                  </div>
                </div>
              </div>
              <div class="info-right" style="width: 33.3%;">
                <div>
                  <div class="info-right-title">近7日故障总设备数</div>
                  <div class="info-right-title">近7日故障总次数</div>
                </div>
                <div>
                  <div class="info-right-count">
                    {{
                      device_fault_data.fault_seven_day_device
                        | dataCoversion(this)
                    }}
                  </div>
                  <div class="info-right-count">
                    {{
                      device_fault_data.fault_seven_day_num
                        | dataCoversion(this)
                    }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 故障发生时间段分布\近7日故障类型 -->
      <div class="section-time-type">
        <div class="section-left" style="width: 100%">
          <div class="section-item-header clearfix" style="width: 100%">
            <span>故障发生时间段分布</span>
            <el-tooltip placement="right">
              <div slot="content">截止到十分钟前</div>
              <div class="tips-icon"></div>
            </el-tooltip>
          </div>
          <span class="content-title">
            展示今日故障和近7日故障发生时间段的分布趋势</span
          >
          <div class="section-item-content" style="width: 100%">
            <div class="section-charts-title" v-if="is_have_pile">
              <span>今日故障数量（个）</span>
              <span class="charts-title-right">近7日故障数量（个）</span>
            </div>
            <div
              is="doubleLineChart"
              ref="doubleLineChart"
              label="fault_time_distribution"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <div class="section-container" v-if="showData">
      <div class="section-item-header">运行数据统计</div>
      <!-- 7天内桩平均使用时长\充电实时运行状态 -->
      <div class="section-use-type">
        <div class="section-left">
          <div class="section-item-header clearfix">
            <span>7天内桩平均使用时长</span>
            <el-tooltip placement="right">
              <div slot="content">
                截止到昨天 <br />当天使用过的电桩平均时长和当天所有电桩的对比
              </div>
              <div class="tips-icon"></div>
            </el-tooltip>
          </div>
          <div class="section-item-content">
            <div class="section-charts-title">
              <span>充电桩数量</span>
              <span class="charts-title-right">充电时长（秒）</span>
            </div>
            <div
              is="useTimeChart"
              ref="useTimeChart"
              label="seven_run_data"
            ></div>
          </div>
        </div>
        <div class="section-right">
          <div class="section-item-header clearfix">
            <span>充电实时运行状态</span>
            <el-tooltip placement="right">
              <div slot="content">截止到十分钟前</div>
              <div class="tips-icon"></div>
            </el-tooltip>
          </div>
          <div
            is="chargeStatusPie"
            ref="chargeStatusPie"
            label="charging_real_status"
          ></div>
        </div>
      </div>
      <!-- 近7天桩使用率 -->
      <div class="section-use-rate">
        <div class="section-item-header clearfix">
          <span>近7天桩使用率</span>
          <el-tooltip placement="right">
            <div slot="content">
              截止到昨天 <br />
              使用率=当天使用过的电桩/当天所有可使用的电桩
            </div>
            <div class="tips-icon"></div>
          </el-tooltip>
        </div>
        <div class="section-item-content">
          <div class="section-charts-title">
            <span>百分比（%）</span>
          </div>
          <div
            is="useRateChart"
            ref="useRateChart"
            label="seven_use_data"
          ></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import restoreTimeChart from "./components/restoreTimeChart";
import todayFaultPie from "./components/todayFaultPie";
import doubleLineChart from "./components/doubleLineChart";
import sevenFaultPie from "./components/sevenFaultPie";
import useTimeChart from "./components/useTimeChart";
import chargeStatusPie from "./components/chargeStatusPie";
import useRateChart from "./components/useRateChart";
export default {
  components: {
    restoreTimeChart,
    todayFaultPie,
    doubleLineChart,
    sevenFaultPie,
    useTimeChart,
    chargeStatusPie,
    useRateChart,
  },
  data() {
    return {
      operator_id: (this.$route.query&&this.$route.query.operator_id)||'',
      searchParams: {
        provinceCode: "",
        pile_sn: "",
        station_id: "",
      },
      area_list: [],
      station_list: [],
      device_fault_data: {},
      showData: true,
      is_pile: 1,
      is_station_pile: 1,
    };
  },
  filters: {
    dataCoversion(value, that) {
      if (!that.is_have_pile) return "--";
      const count = parseFloat(value);
      if (!count) return 0;
      return count;
    },
  },
  computed: {
    is_have_pile() {
      return this.is_pile && this.is_station_pile;
    },
  },
  created() {
    let stat = localStorage.getItem("stat_data")
    this.searchParams.operator_id = this.operator_id;
    this.getChargingStation()
  },
  mounted() {
    this.getLoadData();
    this.getRunData();
  },
  methods: {
    //查询数据
    searchCharging: function () {
      const { pile_sn } = this.searchParams;
      this.getLoadData();
      if (pile_sn) {
        this.showData = false;
        return;
      }
      this.showData = true;
      this.getRunData();
    },
    //加载故障数据
    getLoadData: function () {
      this.getFaultStatisticsData();
      this.getRestoreTimeData();
      this.getFaultTypeData();
      this.getFaultTimeDistributionData();
    },

    //加载运行数据
    getRunData: function () {
      this.getSeventChartData();
      this.getRealtimeStatusData();
    },

    //切换站
    changStation(id) {
      this.searchParams.station_id = id;
      this.getLoadData();
      this.getRunData();
    },

    //根据城市获取取充电站
    getChargingStation: function () {
      this.searchParams.station_id = "";
      this.$api.getMaintenanceStationData({ operator_id: this.operator_id, }).then((res) => {
        if (res.code === 1) {
          const data = res.data || {};
          this.station_list = Object.keys(data).map((param) => {
            return { id: param, name: data[param] };
          });
        }
      });
    },

    //获取故障数据统计(次数、设备数)
    getFaultStatisticsData: function () {
      this.$api
        .getMaintenanceChargingFaultData(this.searchParams)
        .then((res) => {
          if (res.code === 1) {
            this.device_fault_data = res.data;
            this.isHaveChargingPile(res.data);
            this.promptInfo();
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },

    //故障数据统计(故障恢复时长分布)
    getRestoreTimeData: function () {
      this.$api
        .getMaintenanceRestoreTimeData(this.searchParams)
        .then((res) => {
          const restoreTimeChart = this.$refs.restoreTimeChart;
          if (res.code === 1) {
            const isHave = this.isHaveChargingPile(res.data);
            restoreTimeChart &&
              restoreTimeChart.showEcharts({ ...res.data, isHave });
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },

    //故障数据统计(故障类型饼图)
    getFaultTypeData: function () {
      this.$api
        .getMaintenanceFaultTypeData(this.searchParams)
        .then((res) => {
          const todayFaultPie = this.$refs.todayFaultPie;
          const sevenFaultPie = this.$refs.sevenFaultPie;
          if (res.code === 1) {
            const isHave = this.isHaveChargingPile(res.data);
            todayFaultPie &&
              todayFaultPie.showEcharts({
                ...res.data.today_fault_type,
                isHave,
              });
            sevenFaultPie &&
              sevenFaultPie.showEcharts({
                ...res.data.seven_fault_type,
                isHave,
              });
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },

    //故障发生时间段分布
    getFaultTimeDistributionData: function () {
      this.$api.getMaintenanceFaultTimeData(this.searchParams).then((res) => {
        const doubleLineChart = this.$refs.doubleLineChart;
        if (res.code === 1) {
          const isHave = this.isHaveChargingPile(res.data);
          doubleLineChart &&
            doubleLineChart.showEcharts({ ...res.data, isHave });
        }
      });
    },

    //获取7天内桩平均使用时长数据
    getSeventChartData: function () {
      this.$api.getSevenData(this.searchParams).then((res) => {
        const useTimeChart = this.$refs.useTimeChart;
        const useRateChart = this.$refs.useRateChart;
        if (res.code === 1) {
          const {
            data: { data_x, s_pile_time, s_pile_total, s_pile_rate },
          } = res;
          //7天内桩平均使用时长
          useTimeChart &&
            useTimeChart.showEcharts({ x: data_x, s_pile_time, s_pile_total });

          //7天桩使用率
          useRateChart && useRateChart.showEcharts({ x: data_x, s_pile_rate });
        }
      });
    },

    //获取获取充电实时运行状态数据
    getRealtimeStatusData: function () {
      this.$api.getRealtimeStatus(this.searchParams).then((res) => {
        const chargeStatusPie = this.$refs.chargeStatusPie;
        if (res.code == 1) {
          const {
            data: {
              s_book_pile_total,
              s_charging_pile_total,
              s_offline_pile_total,
              s_idle_pile_total,
              s_ready_pile_total,
              s_fault_pile_total,
            },
          } = res;
          chargeStatusPie &&
            chargeStatusPie.showEcharts({
              s_book_pile_total,
              s_charging_pile_total,
              s_idle_pile_total,
              s_offline_pile_total,
              s_ready_pile_total,
              s_fault_pile_total,
            });
        }
      });
    },
    //重置
    resetSearch: function () {
      this.searchParams = {
        provinceCode: "",
        pile_sn: "",
        station_id: "",
      };
      this.showData = true;
      this.getLoadData();
      this.getRunData();
    },

    //判断是否存在充电桩
    isHaveChargingPile: function (data) {
      const { is_pile, is_station_pile } = data;
      this.is_pile = is_pile;
      this.is_station_pile = is_station_pile;
      return is_pile && is_station_pile;
    },

    //判断提示信息
    promptInfo: function () {
      const { provinceCode, station_id } = this.searchParams;
      if (this.is_pile && this.is_station_pile) return;
      if (!provinceCode || !station_id) {
        this.notChargingPile("查无此充电桩");
        return;
      }
      this.notChargingPile("当前充电站查无此充电桩");
    },
    //提示错误
    notChargingPile: function (message) {
      this.$sfNotify({
        duration: 0,
        type: "error",
        message,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/data/maintenanceCharginPile.scss";
.section-select-stat {
  display: flex;
  align-items: center;
  margin-bottom: 24px;

  .header-left {
    margin-right: 24px;
    font-size: 12px;
    color: #333333;
    line-height: 16px;
  }
}
</style>
