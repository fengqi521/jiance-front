<template>
  <div id="line_chart" class="section-charts"></div>
</template>

<script>
import blue_icon from "assets/img/blue-icon.png";
import orange_icon from "assets/img/orange-icon.png";
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
      orange_icon,
      blue_icon
    };
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
    //处理数据
    changeData (option) {
      let chartArr = [];
      let legend = [];
      let colors = [];
      let areaColors = [];
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
    getCommonConf (config_data) {
      const { isHave } = config_data;
      var common_conf = this.$cmptConfig.getCommonEcharts();
      const { colors, areaColors, legend, data } = this.changeData(config_data);
      common_conf.color = colors;
      common_conf.legend = {
        ...common_conf.legend,
        textStyle: {
          padding: [4, 0, 0],
        },
        itemGap: 32,
        data: legend
      }
      common_conf.xAxis[0].axisLabel.rotate = -20;
      common_conf.xAxis[0].data = [
        '00:00-02:00', '02:00-04:00', '04:00-06:00', '06:00-08:00',
        '08:00-10:00', '10:00-12:00', '12:00-14:00', '14:00-16:00',
        '16:00-18:00', '18:00-20:00', '20:00-22:00', '22:00-24:00'];
      common_conf.series = data.map((item, index) => {
        return {
          name: item.name,
          type: "line",
          smooth: true,
          animation: false,
          symbol: "circle",
          yAxisIndex: index,
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
      })
      if (!isHave) {
        common_conf.title = {
          x: 'center',
          y: 'center',
          text: "{a|}{b|暂无数据}",
          textStyle: {
            rich: {
              a: {
                width: 22,
                height: 22,
                backgroundColor: {
                  image: require('assets/img/unData.png'),
                }
              },
              b: {
                padding: [0, 0, 2, 4],
                height: 24,
                lineHeight: 24,
                fontSize: 14,
                fontWeight: "normal",
                color: "#999990",
                verticalAlign: "middle"
              }
            }
          }
        };

        common_conf.tooltip.show = false;
        common_conf.legend.selectedMode = false;
        common_conf.xAxis[0].show = false;
        common_conf.yAxis = common_conf.yAxis.map(item => {
          item.show = false;
          return item;
        })
        common_conf.series = data.map(item => ({ name: item.name, type: 'line' }))
      }

      return common_conf;
    },
    showEcharts (data) {
      var that = this;
      that.line_chart && that.line_chart.clear();
      that.line_chart && that.line_chart.dispose()
      this.line_chart = echarts.init(
        document.getElementById("line_chart")
      );
      var option = that.getCommonConf(data);
      that.line_chart.setOption(option);
      // 自定义图标置灰
      that.line_chart.on("legendselectchanged", (data) => {
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
        this.line_chart.setOption(option);
      });
      window.addEventListener("resize", () => {
        this.line_chart.resize();
      });
    }
  }
};
</script>

