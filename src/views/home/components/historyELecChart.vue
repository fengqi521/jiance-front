<template>
  <div id="historyELecChart_charts" class="section-charts"></div>
</template>

<script>
import history_1 from "assets/img/history-1.png";
import history_2 from "assets/img/history-2.png";
import history_3 from "assets/img/history-3.png";
import history_4 from "assets/img/history-4.png";
import history_5 from "assets/img/history-5.png";
import history_6 from "assets/img/history-6.png";
import history_7 from "assets/img/history-7.png";
import history_8 from "assets/img/history-8.png";
import history_9 from "assets/img/history-9.png";
import history_10 from "assets/img/history-10.png";
import history_11 from "assets/img/history-11.png";
import history_12 from 'assets/img/history-12.png';
import history_13 from 'assets/img/history-13.png';
import history_special_disabled from 'assets/img/history-special-disabled.png'
import history_disabled from "assets/img/history-disabled.png";
import history_handle from "assets/img/history-handle.png";

export default {
  data () {
    this.historyImg = {
      history_1,
      history_2,
      history_3,
      history_4,
      history_5,
      history_6,
      history_7,
      history_8,
      history_9,
      history_10,
      history_11,
      history_12,
      history_13,
      history_disabled,
      history_special_disabled,
      history_handle,
    };
    return {
      historyELecChart_charts: "",
    };
  },
  beforeDestroy () {
    window.removeEventListener("resize", () => {
      this.historyELecChart_charts.resize();
    });
  },
  methods: {
    //处理数据
    changeData (option) {
      const { mapList, chartData } = option;
      let data = [];
      let legend = [];
      Object.keys(mapList).forEach((attr) => {
        const current = chartData[attr];
        const item = mapList[attr];
        legend.push({
          name: item.title,
          icon: `image://${this.historyImg[item.icon]}`,
          ["data-icon"]: item.icon,
        });
        data.push({ name: item.title, value: current, color: item.color, unit: item.unit });
      });
      return { legend, data };
    },
    getCommonConf (config_data) {
      const { chartData } = config_data;
      const { legend, data } = this.changeData(config_data);
      var common_conf = this.$cmptConfig.getCommonEcharts(chartData.data_x);
      common_conf.grid = {
        ...common_conf.grid,
        top: 80,
        bottom: 60
      };
      common_conf.legend = {
        ...common_conf.legend,
        data: legend,
        itemGap: 16,
        animation: false,
        textStyle: {
          padding: [2, 0, 0],
        }
      }
      common_conf.yAxis[0].splitLine.show = true;
      common_conf.tooltip.formatter = (params) => {
        let res = "";
        let formatterName = "";
        const val = params.some(item => parseFloat(item.value));
        if (!val) return ''
        params.forEach(current => {
          const {
            name,
            color,
            seriesName,
            value
          } = current;
          const list = data.filter(item => item.name === seriesName);
          const unit = list && list.length && list[0].unit;
          const selfMarker = `<span style="display:inline-block;margin:0 8px 2px 0;border-radius:6px;`
            + `width:6px;height:6px;background-color:${color};"></span>`;
          formatterName = "<span style='font-weight:bold'>" + name + "</span><br/>";
          res += selfMarker + seriesName + "<span style='margin-left:24px;float:right'>" + value + unit + "</span><br/>";
        })
        return formatterName + res;
      };
      common_conf.series = data.map((item) => {
        if (!item.unit) {
          return {
            name: item.name,
            type: 'line',
            markArea: {
              silent: true,
              itemStyle: {
                color: item.color
              },
              data: item.value,
            }
          }
        }
        return {
          name: item.name,
          type: "line",
          smooth: true,
          animation: false,
          symbol: "circle",
          label: { show: false },
          data: item.value,
          itemStyle: {
            color: item.color,
          }
        };
      });

      common_conf.dataZoom = [
        {
          type: "slider",
          show: true,
          height: 24,
          bottom: 24,
          // start: 0,
          // end: 90,
          borderColor: "#EFF2F6",
          handleStyle: {
            backgroundColor: "#D6DFF1",
            // shadowBlur: 4,
            width: 8,
          },
          textStyle: {
            color: "",
          },
          handleSize: "100%", // 手柄大小
          handleWidth: 8,
          // handleIcon: "path://M0,0 v9.7h5 v-9.7h-5 Z",// 画一个圆形
          handleIcon: `image://${this.historyImg.history_handle}`, //手柄
          fillerColor: "#D6DFF1", //条-填充颜色
          backgroundColor: "#EFF2F6", //条-上
          dataBackground: {
            width: 8,
            areaStyle: {
              color: "#E0E6EE", //条下
            },
            lineStyle: {
              opacity: 0.8,
              color: "#C4CFDE", //背景-中分线
            },
          },

          brushSelect: true,
        },
        {
          type: "inside",
          height: 30,
        },
      ];
      return common_conf;
    },
    showEcharts (data) {
      var that = this;
      that.historyELecChart_charts && that.historyELecChart_charts.dispose()
      this.historyELecChart_charts = echarts.init(
        document.getElementById("historyELecChart_charts")
      );
      var option = that.getCommonConf(data);
      that.historyELecChart_charts.setOption(option);
      // 自定义图标置灰
      that.historyELecChart_charts.on("legendselectchanged", (data) => {
        const { name, selected } = data;
        const optionLegend = option.legend.data;
        const flag = selected[name];
        const list = optionLegend.find((item) => item.name === name);
        if (!list) return;
        if (!flag) {
          if (list['data-icon'] === "history_13") {
            list.icon = `image://${this.historyImg.history_special_disabled}`;
          } else {
            list.icon = `image://${this.historyImg.history_disabled}`;
          }
        } else {
          list.icon = `image://${this.historyImg[list["data-icon"]]}`;
        }
        this.historyELecChart_charts.setOption(option);
      });
      window.addEventListener("resize", () => {
        this.historyELecChart_charts.resize();
      });
    },
  },
};
</script>

