<template>
  <div id="stackPercent_charts" class="section-charts"></div>
</template>

<script>
import { chartData } from '@/js/data'
export default {
  props: {
    label: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      stackPercent_charts: ""
    };
  },
  beforeDestroy() {
    window.removeEventListener("resize", () => {
      this.stackPercent_charts.resize();
    });
  },
  methods: {
    //处理数据
    changeData(option) {
      let chartArr = [];
      let legend = [];
      const choiceData = chartData[this.label];
      if (!choiceData) return;
      Object.keys(choiceData).forEach(attr => {
        const current = option[attr];
        const item = choiceData[attr];
        if (typeof current === 'undefined') return;
        legend.push(item.name);
        if (Array.isArray(current) && current.length) {
          chartArr.push({ name: item.name, color: item.color, value: current });

        }
      });
      return { x: option.date_x, legend, data: chartArr };
    },

    getCommonConf(option) {
      const { legend, x, data } = this.changeData(option)
      var common_conf = this.$cmptConfig.getCommonStackBar();
      common_conf.legend.data = legend;
      common_conf.xAxis.data = x;
      common_conf.series = data.map(({ name, color, value }) => {
        return {
          name: name,
          type: 'bar',
          barWidth: 40,
          stack: '总量',
          label: { show: false },
          data: value,
          itemStyle: { color },
          emphasis: { itemStyle: { color } }
        }
      })

      return common_conf;
    },

    showEcharts(data) {
      var that = this;
      this.stackPercent_charts = echarts.init(
        document.getElementById("stackPercent_charts")
      );
      var option = that.getCommonConf(data);
      that.stackPercent_charts.clear();
      that.stackPercent_charts.setOption(option);
      window.addEventListener("resize", () => {
        this.stackPercent_charts.resize();
      });
    }
  }
};
</script>

