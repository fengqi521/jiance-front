<template>
  <div id="order_profit_charts" class="section-charts"></div>
</template>

<script>
import orange_icon from "assets/img/orange-icon.png";
import blue_icon from "assets/img/blue-icon.png";
import history_disabled from "assets/img/history-disabled.png";
import { chartData } from '@/js/data'
export default {
  props: { label: { type: String, default: '' } },
  data () {
    this.iconPath = {
      orange_icon,
      blue_icon
    };
    return {
      order_profit_charts: ""
    };
  },

  beforeDestroy () {
    window.removeEventListener("resize", () => {
      this.order_profit_charts.resize();
    });
  },

  methods: {
    //处理数据
    changeData (option) {
      let chartArr = [];
      let legend = [];
      let colors = [];
      const choiceData = chartData[this.label];
      if (!choiceData) return;
      Object.keys(choiceData).forEach(attr => {
        const current = option[attr];
        const item = choiceData[attr];
        if (typeof current === 'undefined') return;
        colors.push(item.color)
        legend.push({ name: item.name, icon: `image://${this.iconPath[item.icon]}`, ["data-icon"]: item.icon, });
        chartArr.push({ name: item.name, value: current, areaColor: item.areaStyleColor })
      });
      return { legend, colors, data: chartArr };
    },
    getCommonConf (config_data) {
      var common_conf = this.$cmptConfig.getCommonEcharts(config_data.data_x);
      const { legend, colors, data } = this.changeData(config_data);
      common_conf.color = colors;
      common_conf.legend = {
        ...common_conf.legend,
        textStyle: {
          padding: [4, 0, 0],
        },
        itemGap: 32,
        data: legend
      };
      common_conf.series = data.map((item, index) => {
        return {
          name: item.name,
          type: "line",
          smooth: true,
          animation: false,
          symbol: "circle",
          yAxisIndex: index,
          areaStyle: {
            color: item.areaColor
          },
          lineStyle: {
            width: 2
          },
          data: item.value
        }
      })

      return common_conf;
    },
    showEcharts (data) {
      var that = this;
      this.order_profit_charts = echarts.init(
        document.getElementById("order_profit_charts")
      );
      var option = that.getCommonConf(data);
      that.order_profit_charts.clear();
      that.order_profit_charts.setOption(option);
      // 自定义图标置灰
      that.order_profit_charts.on("legendselectchanged", (data) => {
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
        this.order_profit_charts.setOption(option);
      });
      window.addEventListener("resize", () => {
        this.order_profit_charts.resize();
      });
    },
    showOrderProfitChart (data) {
      this.showEcharts(data)
    }
  }
};
</script>

