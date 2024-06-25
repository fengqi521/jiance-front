<template>
  <div id="chargeStatus_pie" class="section-charts"></div>
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
      chargeStatus_pie: "",
      maxValue: null,
      flag: false,
    };
  },
  beforeDestroy() {
    window.removeEventListener("resize", () => {
      this.chargeStatus_pie.resize();
    });
  },
  methods: {
    //处理数据
    changeData(option) {
      let chartArr = [];
      let legend = [];
      let colors = [];
      let values = [];
      const choiceData = chartData[this.label];
      if (!choiceData) return;
      Object.keys(choiceData).forEach((attr) => {
        const current = option[attr];
        const item = choiceData[attr];
        if (typeof current === "undefined") return;
        colors.push(item.color);
        legend.push(item.name);
        values.push(parseFloat(current));
        chartArr.push({
          name: item.name,
          value: parseFloat(current),
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
      const isHave = data.some((item) => item.value);
      if (!isHave) {
        data.unshift({ value: 100, name: "", itemStyle: { color: "#ECECEC" } });
      }
      return { data, isHave };
    },

    getCommonConf(option) {
      const { legend, colors, data, values } = this.changeData(option);
      var common_conf = this.$cmptConfig.getCommonPie();
      const newData = this.setNoneData(data);
      common_conf.color = colors;
      common_conf.legend.data = legend;
      const series = common_conf.series[0];
      series.radius = ["48%", "66%"];
      series.tooltip.show = false;
      series.data = newData.data;
      series.label = {
        fontSize: 16,
        lineHeight: 20,
        position: "center",
        formatter: (params) => {
          if (!newData.isHave) return "";
          this.maxValue = Math.max(...values);
          let index = values.findIndex((value) => value === this.maxValue);
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
            width: 74,
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
      if (!newData.isHave) {
        series.silent = true;
        series.hoverAnimation = false;
        common_conf.legend.selectedMode = false;
      }
      return common_conf;
    },
    showEcharts(data) {
      var that = this;
      this.chargeStatus_pie = echarts.init(
        document.getElementById("chargeStatus_pie")
      );
      var option = that.getCommonConf(data);
      that.chargeStatus_pie.clear();
      that.chargeStatus_pie.setOption(option);
      that.chargeStatus_pie.on("legendselectchanged", (data) => {
        const { name, selected } = data;
        const optionLegend = option.series[0].data;
        const flag = selected[name];
        const list = optionLegend.find((item) => item.name === name);
        if (!list) return;
        if (list.value === this.maxValue) {
          if (!flag) this.flag = true;
          else this.flag = false;
        }
        this.chargeStatus_pie.setOption(option);
      });
      window.addEventListener("resize", () => {
        this.chargeStatus_pie.resize();
      });
    },
    showChargeStatusPie(data) {
      this.showEcharts(data);
    },
  },
};
</script>

