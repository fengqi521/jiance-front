<template>
  <div id="line_chart" class="section-charts"></div>
</template>

<script>
import blue_icon from "assets/img/blue-icon.png";
import green_icon from "assets/img/green-icon.png";

export default {
  data () {
    return {
      line_chart: ""
    };
  },
  beforeDestroy () {
    window.removeEventListener("resize", () => {
      this.line_chart.resize();
    });
  },
  methods: {
    getCommonConf (config_data) {
      const { series } = config_data;
      var common_conf = this.$cmptConfig.getCommonEcharts(config_data.x);
      common_conf.legend.data = [{
        name: "今日故障",
        icon: `image://${blue_icon}`
      },
      {
        name: "近7日故障",
        icon: `image://${green_icon}`
      }];
      common_conf.series[0] = {
        name: "用户量",
        type: "line",
        smooth: true,
        animation: false,
        symbol: "circle",
        areaStyle: {
          color: "rgba(56, 180, 135, 0.2)"
        },
        itemStyle: {
          color: "#38b487"
        },
        lineStyle: {
          width: 2,
          color: "#38b487"
        },
        data: config_data.user
      };
      common_conf.series[1] = {
        name: "营收额",
        type: "line",
        smooth: true,
        animation: false,
        symbol: "circle",
        yAxisIndex: 1,
        areaStyle: {
          color: "rgba(128, 173, 255, 0.2)"
        },
        itemStyle: {
          color: "#80ADFF"
        },
        lineStyle: {
          width: 2,
          color: "#80ADFF"
        },
        data: config_data.amount
      };
      return common_conf;
    },
    showEcharts (data) {
      var that = this;
      this.line_chart = echarts.init(
        document.getElementById("line_chart")
      );
      var option = that.getCommonConf(data);
      that.line_chart.clear();
      that.line_chart.setOption(option);
      window.addEventListener("resize", () => {
        this.line_chart.resize();
      });
    },
    showUserProfitChart (data) {
      this.showEcharts(data);
    }
  }
};
</script>

