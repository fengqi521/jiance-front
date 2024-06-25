<template>
  <div
    :id="'stat_pile' + refindex"
    class="section-charts"
  ></div>
</template>

<script>
import { chartData } from "@/js/data";
export default {
  props: {
    label: {
      type: String,
      default: "",
    },
    statlist: {
      // type: array,
      default: "",
    },
    refindex: {
      // type: array,
      default: "",
    },
  },
  data() {
    return {
      stat_pile: "",
      maxValue: null,
      flag: false,
    };
  },
  mounted() {
    // console.log('======' , this.statlist);
    setTimeout(() => {
      this.getRealtimeStatusData();
    }, 1000);
  },
  beforeDestroy() {
    window.removeEventListener("resize", () => {
      this.stat_pile.resize();
    });
  },
  methods: {
    //获取获取充电实时运行状态数据

    getRealtimeStatusData() {
      if (this.statlist.length == 0) return false;
      const {
        charging,
        free,
        appointment,
        occupy,
        offline,
        error,
        total,
      } = this.statlist;

      this.showEcharts(
        {
          charging,
          free,
          appointment,
          occupy,
          offline,
          error,
        },
        { total }
      );
    },
    //处理数据
    changeData(option) {
      let chartArr = [];
      let legend = [{ bottom: "auto" }];
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

    getCommonConf(option, all) {
      const { legend, colors, data, values } = this.changeData(option);
      var common_conf = this.$cmptConfig.getCommonPie();
      const newData = this.setNoneData(data);
      common_conf.color = colors;
      common_conf.legend.data = legend;
      common_conf.legend.left = "10%"; //图标的位置
      common_conf.legend.top = "75%"; //图标的位置
      common_conf.legend.itemGap = 12; //图标的位置
      const series = common_conf.series[0];
      series.radius = ["48%", "66%"];
      series.center = ["50%", "35%"]; //饼的位置
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
            // console.log('xixixi..' , params);
            return "{p|" + "总" + "}" + "\n{nm|" + all + "}"; //总值是all
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
    showEcharts(data, all) {
      var that = this;
      // console.log('===2==' , all)
      this.stat_pile = echarts.init(
        document.getElementById("stat_pile" + this.refindex)
      );
      var option = that.getCommonConf(data, all.total);
      that.stat_pile.clear();
      that.stat_pile.setOption(option);
      that.stat_pile.on("legendselectchanged", (data) => {
        const { name, selected } = data;
        const optionLegend = option.series[0].data;
        const flag = selected[name];
        const list = optionLegend.find((item) => item.name === name);
        if (!list) return;
        if (list.value === this.maxValue) {
          if (!flag) this.flag = true;
          else this.flag = false;
        }

        this.stat_pile.setOption(option);
      });
      window.addEventListener("resize", () => {
        this.stat_pile.resize();
      });
    },
    showChargeStatusPie(data) {
      this.showEcharts(data);
    },
  },
};
</script>

