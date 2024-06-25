<template>
  <div id="todayFault_pie" class="section-charts"></div>
</template>
<script>
import { chartData } from "@/js/data";
export default {
  props: {
    label: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      todayFault_pie: "",
      maxValue: null,
      flag: false,
    };
  },
  beforeDestroy() {
    window.removeEventListener("resize", () => {
      this.todayFault_pie.resize();
    });
  },
  methods: {
    //处理数据
    changeData(option) {
      let chartArr = [];
      let colors = [];
      let legend = [];
      let values = [];
      const choiceData = chartData[this.label];
      if (!choiceData) return;
      Object.keys(choiceData).forEach((attr) => {
        const current = option[attr];
        const item = choiceData[attr];
        if (typeof current === "undefined") return;
        legend.push(item.name);
        colors.push(item.color);
        values.push(parseFloat(current));
        chartArr.push({
          name: item.name,
          value: current,
          itemStyle: {
            normal: { color: item.color },
            emphasis: { color: item.color },
          },
        });
      });
      return { legend, colors, data: chartArr, values };
    },

    //数据都为0时设置圆环
    setNoneData(data) {
      if (!data || !data.length) return;
      const isHave = data.some((item) => parseFloat(item.value));
      if (!isHave) {
        data.unshift({ value: 100, name: "", itemStyle: { color: "#ECECEC" } });
      }
      return { data, isHave };
    },

    getCommonConf(option) {
      const common_conf = this.$cmptConfig.getCommonPie();
      const { colors, legend, data, values } = this.changeData(option);
      const newData = this.setNoneData(data);
      let series = common_conf.series[0];
      common_conf.color = colors;
      common_conf.legend.data = legend;
      series.data = newData.data;
      series.tooltip.show = false;
      series.label = {
        fontSize: 16,
        lineHeight: 20,
        position: "center",
        formatter: (params) => {
          // 默认显示第一个数据
          if (!option.isHave) return "{nm|" + "--}";
          if (!newData.isHave) return "";
          this.maxValue = Math.max(...values);
          const index = values.findIndex((value) => value === this.maxValue);
          if (params.dataIndex === index || this.flag) {
            return "{p|" + params.name + "}" + "\n{nm|" + params.percent + "%}";
          } else {
            return "";
          }
        },
        emphasis: {
          formatter: function (params) {
            return "{p|" + params.name + "}" + "\n{nm|" + params.percent + "%}";
          },
        },
        rich: {
          p: {
            height: 20,
            lineHeight: 20,
            fontSize: 14,
            color: "#666",
            backgroundColor: "#FFF",
          },
          nm: {
            width: 74,
            height: 24,
            lineHeight: 24,
            fontSize: 20,
            fontWeight: "bold",
            color: "#666",
            backgroundColor: "#FFF",
          },
        },
      };
      if (!newData.isHave || !option.isHave) {
        series.silent = true;
        series.hoverAnimation = false;
        common_conf.legend.selectedMode = false;
      }
      return common_conf;
    },

    showEcharts(data) {
      const that = this;
      this.todayFault_pie = echarts.init(
        document.getElementById("todayFault_pie")
      );
      const option = that.getCommonConf(data);
      that.todayFault_pie.clear();
      that.todayFault_pie.setOption(option);
      that.todayFault_pie.on("legendselectchanged", (data) => {
        const { name, selected } = data;
        const optionLegend = option.series[0].data;
        const flag = selected[name];
        const list = optionLegend.find((item) => item.name === name);
        if (!list) return;
        if (list.value === this.maxValue) {
          if (!flag) this.flag = true;
          else this.flag = false;
        }
        this.todayFault_pie.setOption(option);
      });
      window.addEventListener("resize", () => {
        this.todayFault_pie.resize();
      });
    },
  },
};
</script>

