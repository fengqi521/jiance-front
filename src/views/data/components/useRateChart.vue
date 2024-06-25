<template>
  <div id="useRate_charts" class="section-charts"></div>
</template>

<script>
import blue_icon from "assets/img/blue-icon.png";
import history_disabled from "assets/img/history-disabled.png";
import { chartData } from '@/js/data'
export default {
  props: {
    label: {
      type: String,
      default: ''
    }
  },
  data () {
    this.iconPath = {
      blue_icon
    };
    return {
      useRate_charts: ""
    };
  },
  beforeDestroy () {
    window.removeEventListener("resize", () => {
      this.useRate_charts.resize();
    });
  },
  methods: {
    //处理数据
    changeData (option) {
      let chartArr = [];
      let legend = [];
      let colors = [];
      let areaColors = []
      const choiceData = chartData[this.label];
      if (!choiceData) return;
      Object.keys(choiceData).forEach(attr => {
        const current = option[attr];
        const item = choiceData[attr];
        if (typeof current === 'undefined') return;
        colors.push(item.color)
        areaColors.push(item.areaStyleColor);
        legend.push({ name: item.name, icon: `image://${this.iconPath[item.icon]}`, ['data-icon']: item.icon });
        chartArr.push({ name: item.name, value: current })
      });
      return { legend, colors, areaColors, data: chartArr };
    },
    getCommonConf (option) {
      const { colors, areaColors, legend, data } = this.changeData(option);
      var common_conf = this.$cmptConfig.getCommonEcharts(option.x || []);
      common_conf.legend = {
        ...common_conf.legend,
        textStyle: {
          padding: [4, 0, 0],
        },
        data: legend
      }
      common_conf.yAxis[0].splitLine.show = true;
      common_conf.series = data.map((item, index) => {
        return {
          name: item.name,
          type: "line",
          smooth: true,
          animation: false,
          symbol: "circle",
          // yAxisIndex: index,
          areaStyle: {
            color: areaColors[index]
          },
          itemStyle: {
            color: colors[index]
          },
          lineStyle: {
            width: 2,
            color: colors[index]
          },
          data: item.value
        }
      });
      return common_conf;
    },
    showEcharts (data) {
      var that = this;
      this.useRate_charts = echarts.init(
        document.getElementById("useRate_charts")
      );
      var option = that.getCommonConf(data);
      that.useRate_charts.clear();
      that.useRate_charts.setOption(option);
      // 自定义图标置灰
      that.useRate_charts.on("legendselectchanged", (data) => {
        const { name, selected } = data;
        const optionLegend = option.legend.data;
        const flag = selected[name];
        const list = optionLegend.find((item) => item.name === name);
        if (!list) return;
        if (!flag) {
          list.icon = `image://${history_disabled}`;
        } else {
          list.icon = `image://${this.iconPath[list["data-icon"]]}`;
        }
        this.useRate_charts.setOption(option);
      });
      window.addEventListener("resize", () => {
        this.useRate_charts.resize();
      });
    },
    showUseRateChart (data) {
      this.showEcharts(data);
    }
  }
};
</script>

