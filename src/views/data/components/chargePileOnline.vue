<template>
  <div>
    <div id="pile_online_charts" class="section-online-charts"></div>
    <div class="section-bottom clearfix">
      <div class="bottom-item-inner">
        <div class="bottom-item">
          <div class="bottom-title">今日实时数据量</div>
          <div class="bottom-detail">
            <span
              class="detail-value ellipsis"
              :style="{ color: today_count != 0 ? '#333333' : '' }"
              >{{ today_count }}</span
            >
          </div>
        </div>
      </div>
      <div class="bottom-item-inner">
        <div class="bottom-item">
          <div class="bottom-title">与昨日相比</div>
          <div class="bottom-detail">
            <i :class="['detail-icon', rate_flag ? 'up-icon' : '']"></i>
            <span
              class="detail-text"
              :style="rate_flag ? 'color: #38B487;' : 'color: #FF6632;'"
              >{{ change_rate ? change_rate : 0 }}%</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      pile_online_charts: "",
      rate_flag: true,
      today_count: "--",
      change_rate: ""
    };
  },
  // mounted() {
  //   //    this.showEcharts();
  //   window.addEventListener("resize", () => {
  //     this.pile_online_charts.resize();
  //   });
  // },
  beforeDestroy () {
    window.removeEventListener("resize", () => {
      this.pile_online_charts.resize();
    });
  },
  methods: {
    getCommonConf (data) {
      var common_conf = this.$cmptConfig.getCommonEcharts(data.x);
      common_conf.legend.show = false;
      common_conf.grid = {
        show: true,
        top: "16",
        left: 5,
        right: 20,
        bottom: "0%",
        containLabel: true,
        borderColor: "transparent"
      };
      common_conf.yAxis[0].splitLine.show = true;
      common_conf.series[0] = {
        name: "活跃充电桩",
        type: "line",
        smooth: true,
        animation: false,
        symbol: "circle",
        areaStyle: {
          color: "rgba(255, 183, 60, 0.2)"
        },
        itemStyle: {
          color: "#FFB73C"
        },
        lineStyle: {
          width: 2,
          color: "#FFB73C"
        },
        data: data.y
      };
      return common_conf;
    },
    showEcharts (data) {
      var that = this;
      this.pile_online_charts = echarts.init(
        document.getElementById("pile_online_charts")
      );
      var option = that.getCommonConf(data);
      that.pile_online_charts.clear();
      that.pile_online_charts.setOption(option);
      window.addEventListener("resize", () => {
        this.pile_online_charts.resize();
      });
    },
    showChargePileOnline (data) {
      this.showEcharts(data);
      this.today_count = data.today_count;
      this.change_rate = data.change_rate;
      this.rate_flag = data.rate_flag;
    }
  }
};
</script>

<style lang="scss" scoped>
.section-online-charts {
  height: 126px;
}

.section-bottom {
  .bottom-item-inner {
    position: relative;
    float: left;
    padding: 0 0 0 24px;
    width: 50%;
    height: 71px;

    &:first-child {
      padding: 0 24px 0 0;

      &:after {
        position: absolute;
        content: "";
        display: block;
        right: -0.5px;
        top: 22px;
        bottom: 20px;
        width: 1px;
        background-color: #cccccc;
      }

      .bottom-item .bottom-detail {
        width: 85px;
      }
    }

    &:last-child {
      .bottom-item .bottom-detail {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .bottom-item {
      display: flex;
      height: 100%;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .bottom-title {
        padding-bottom: 4px;
        font-size: 12px;
        color: rgba(102, 102, 102, 1);
        line-height: 20px;
      }

      .bottom-detail {
        position: relative;
        height: 18px;
        color: #999;

        .detail-value {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          font-weight: bold;
        }

        .detail-icon {
          float: left;
          display: block;
          margin-right: 8px;
          width: 12px;
          height: 11px;
          background: url("../../../assets/img/down-icon.png") no-repeat;
          background-size: cover;

          &.up-icon {
            background: url("../../../assets/img/up-icon.png") no-repeat;
            background-size: cover;
          }
        }

        .detail-text {
          font-size: 18px;
          font-weight: bold;
          line-height: 18px;
        }
      }
    }
  }
}
</style>
