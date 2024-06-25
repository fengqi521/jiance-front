<template>
  <div id="chargeStatus_pie" class="section-charts"></div>
</template>

<script>
import { chartData } from '@/js/data'
import { toFixedNumber } from '@/utils'
export default {
  props: {
    label: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      chargeStatus_pie: ""
    };
  },
  beforeDestroy () {
    window.removeEventListener("resize", () => {
      this.chargeStatus_pie.resize();
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
        chartArr.push({
          name: item.name,
          value: current,
          itemStyle: {
            normal: { color: item.color },
            emphasis: { color: item.color }
          }
        })
      });
      return { legend, colors, data: chartArr };
    },


    //数据都为0时设置圆环
    setNoneData (data) {
      if (!data || !data.length) return;
      const isHave = data.some(item => parseFloat(item.value));
      if (!isHave) {
        data.forEach(item => item.value = null)
        data.unshift({ value: 100, name: '', itemStyle: { color: '#ECECEC' } })
      }
      return { data, isHave };
    },


    getCommonConf (options) {
      const { colors, legend, data } = this.changeData(options);
      const newData = this.setNoneData(data);
      var common_conf = this.$cmptConfig.getCommonPie();
      common_conf.color = colors;
      common_conf.legend = {
        orient: "vertical",
        left: 680,
        top: '18%',
        itemHeight: 10,
        itemWidth: 10,
        data: legend
      };
      common_conf.series[0] = {
        name: '车辆电池类型总数分布',
        type: 'pie',
        avoidLabelOverlap: true,
        radius: ["50%", "70%"],
        center: [290, '50%'],
        label: {
          formatter: (params) => {
            const { name, percent } = params;
            const newPercent = toFixedNumber(percent) + "%"
            return '' + name + " : " + newPercent;
          },
          fontSize: 12,
          color: '#666'
        },
        tooltip: {
          position: [220, '42%'],
          backgroundColor: 'transparent',
          textStyle: { color: '#666' },
          formatter: function (params) {
            const { name, percent } = params;
            const newName = "<span style='line-height:20px;font-size:14px'>" + name + "</span><br/>";
            const newPercent = "<span style='line-height:24px;font-size:20px;font-weight:bold'>" + toFixedNumber(percent) + "%</span>"
            return newName + newPercent;
          },
          extraCssText: 'width:142px;text-align:center',
        },
        data: newData.data
      }

      if (!newData.isHave) {
        common_conf.series[0].labelLine = { lineStyle: { opacity: 0 } };
        common_conf.series[0].label.show = false;
        common_conf.series[0].silent = true;
        common_conf.series[0].hoverAnimation = false;
        common_conf.legend.selectedMode = false;
      }

      return common_conf;
    },
    showEcharts (data) {
      var that = this;
      this.chargeStatus_pie = echarts.init(
        document.getElementById("chargeStatus_pie")
      );
      var option = that.getCommonConf(data);
      that.chargeStatus_pie.clear();
      that.chargeStatus_pie.setOption(option);
      window.addEventListener("resize", () => {
        this.chargeStatus_pie.resize();
      });
    }
  }
};
</script>

