<template>
  <div id="restoreTime_charts" class="section-charts"></div>
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
  data () {
    return {
      restoreTime_charts: ""
    };
  },
  beforeDestroy () {
    window.removeEventListener("resize", () => {
      this.restoreTime_charts.resize();
    });
  },
  methods: {

    //处理数据
    changeData (option) {
      let chartArr = [];
      let colors = [];
      let legend = [];
      const choiceData = chartData[this.label];
      if (!choiceData) return;
      Object.keys(choiceData).forEach(attr => {
        const current = option[attr];
        const item = choiceData[attr];
        if (typeof current === 'undefined') return;
        legend.push(item.name);
        colors.push(item.color);
        if (Array.isArray(current) && current.length) {
          chartArr.push({ name: item.name, value: current })
        }
      });

      return { legend, colors, data: chartArr };
    },

    getCommonConf (option) {
      const { isHave } = option;
      var common_conf = this.$cmptConfig.getCommonStackBar();
      const { colors, legend, data } = this.changeData(option)
      common_conf.grid = {
        top: '28%',
        left: '0%',
        right: '1%',
        bottom: '4%',
        containLabel: true
      };
      common_conf.color = colors;
      common_conf.legend.data = legend;
      common_conf.tooltip = {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: 'rgba(0,0,0,0.8)'
          },
        },
        backgroundColor: 'rgba(0,0,0,0.8)',
        borderRadius: 2,
        formatter: (params) => {
          let res = "";
          let formatterName = "";
          params.forEach(current => {
            const {
              name,
              color,
              seriesName,
              value
            } = current;
            const selfMarker = `<span style="display:inline-block;margin:0 8px 2px 0;border-radius:6px;`
              + `width:6px;height:6px;background-color:${color};"></span>`;

            formatterName = "<span style='font-weight:bold'>" + name + "</span><br/>";
            res += selfMarker + seriesName + "<span style='margin-left:24px;float:right'>" + value + "</span><br/>";
          })
          return formatterName + res;
        },
        extraCssText: 'padding:12px',
        textStyle: {
          fontSize: 12
        },
      };
      common_conf.xAxis.data = ['0.5h以内', '0.5-2h', '2-4h', '4-6h', '6-8h', '8-10h', '10h以上'];
      common_conf.yAxis = [
        {
          type: 'value',
          min: 0,
          position: 'left',
          axisLine: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
        },
        {
          type: 'value',
          min: 0,
          position: 'right',
          axisLine: {
            show: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#ECECEC',
            }
          },
          axisTick: {
            show: false
          },
        },
      ];
      common_conf.series = data.map((item, index) => {
        return {
          name: item.name,
          type: "bar",
          barWidth: 30,
          yAxisIndex: index,
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
        common_conf.xAxis.show = false;
        common_conf.yAxis = common_conf.yAxis.map(item => {
          item.show = false;
          return item;
        })
        common_conf.series = data.map(item => ({ name: item.name, type: 'bar' }))
      }
      return common_conf;
    },
    showEcharts (data) {
      var that = this;
      this.restoreTime_charts = echarts.init(
        document.getElementById("restoreTime_charts")
      );
      that.restoreTime_charts.clear();
      var option = that.getCommonConf(data);
      that.restoreTime_charts.setOption(option);
      window.addEventListener("resize", () => {
        this.restoreTime_charts.resize();
      });
    }
  }
};
</script>

