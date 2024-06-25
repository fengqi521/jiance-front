<template>
  <section>
    <div class="section-title">
      <router-link to="/run/counter">远程充电账单</router-link> > 账单详情
    </div>
    <div v-loading="listLoading">
      <div class="section-list">
        <div class="section-item-header clearfix">
          <span>账单信息</span>
        </div>
        <div class="header-main">
          <div class="header-amount">
            <div class="top-item">
              <div class="top-item-title">账单编号</div>
              <div
                class="top-item-text ellipsis"
                style="color:#666"
              >{{detail.out_trade_id}}</div>
            </div>
            <div class="top-item">
              <div class="top-item-title">操作人</div>
              <div
                class="top-item-text ellipsis"
                style="color:#666"
              >{{detail.user_id}}</div>
            </div>
          </div>
          <div class="header-content clearfix">
            <div class="content-item"><span>开始充电时间：</span>{{detail.charge_start_time ? detail.charge_start_time : "--"}}</div>
            <div class="content-item"><span>结束充电时间：</span>{{detail.charge_finish_time ? detail.charge_finish_time : "--"}}</div>
            <div class="content-item"><span>充电时长（分钟）：</span>{{detail.charge_time ? detail.charge_time : "0"}}</div>
            <div class="content-item"><span>充电度数（度）：</span>{{detail.charge_quantity ? detail.charge_quantity : "0"}}</div>
            <div class="content-item"><span>总费用（元）：</span>{{detail.total_amount}}</div>
            <div class="content-item"><span>总服务费（元）：</span>{{detail.service_amount}}</div>
            <div class="content-item"><span>电费（元）：</span>{{detail.charge_amount}}</div>
            <div class="content-item"><span>车架号：</span>{{detail.vin ? detail.vin : "--"}}</div>
          </div>
        </div>
      </div>
      <div class="section-main clearfix">
        <div class="section-list">
          <div class="section-item-header clearfix">
            <span>充电站信息</span>
          </div>
          <div class="header-main">
            <div class="header-content clearfix">
              <div class="content-item"><span>充电站：</span>{{station ? station.station_name : "--"}}</div>
              <div class="content-item"><span>所属区域：</span>{{station ? station.p_name : "--"}}{{station ? station.c_name : ""}}</div>
              <div class="content-item">
                <span>详细地址：</span>
                <p>{{station ? station.address : "--"}}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="section-main-center">
          <div class="section-list">
            <div class="section-item-header clearfix">
              <span>充电桩信息</span>
            </div>
            <div class="header-main">
              <div class="header-content clearfix">
                <div class="content-item"><span>充电桩编号：</span>{{pile.pile_sn ? pile.pile_sn : "--"}}</div>
                <div class="content-item"><span>充电枪编号：</span>{{pile.gun ? pile.gun : "--"}}</div>
                <div
                  class="content-item"
                  v-if="pile.pile_type == 1"
                ><span>充电桩类型：</span>直流</div>
                <div
                  class="content-item"
                  v-else-if="pile.pile_type == 2"
                ><span>充电桩类型：</span>交流</div>
                <div
                  class="content-item"
                  v-else-if="pile.pile_type == 3"
                ><span>充电桩类型：</span>交直流</div>
                <div
                  class="content-item"
                  v-else-if="pile.pile_type == 4"
                ><span>充电桩类型：</span>无线</div>
                <div
                  class="content-item"
                  v-else
                ><span>充电桩类型：</span>其他</div>
                <!--1家用插座 2交流接口插座 3交流接口插头 4直流接口枪头   5无线充电座 6其它-->
                <div
                  class="content-item"
                  v-if="pile.gun_type == 1"
                ><span>充电枪类型：</span>家用插座</div>
                <div
                  class="content-item"
                  v-else-if="pile.gun_type == 2"
                ><span>充电枪类型：</span>交流接口插座</div>
                <div
                  class="content-item"
                  v-else-if="pile.gun_type == 3"
                ><span>充电枪类型：</span>交流接口插头</div>
                <div
                  class="content-item"
                  v-else-if="pile.gun_type == 4"
                ><span>充电枪类型：</span>直流接口枪头</div>
                <div
                  class="content-item"
                  v-else-if="pile.gun_type == 5"
                ><span>充电枪类型：</span>无线充电座</div>
                <div
                  class="content-item"
                  v-else
                ><span>充电枪类型：</span>其他</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "",
  components: {},
  data() {
    return {
      id: this.$route.query.id || 0,
      month: this.$route.query.month || "",
      detail: {
        out_trade_id: "--",
        real_amount: "0"
      },
      pile: {},
      station: {},
      listLoading: false
    };
  },
  created() {
    this.getDetail();
  },
  methods: {
    getDetail() {
      this.listLoading = true;
      var that = this;
      // getElecBillDetail
      this.$api
        .getElecBillDetail({ out_trade_id: this.id, month: this.month })
        .then(res => {
          this.listLoading = false;
          if (res.code == 1) {
            that.detail = res.data.detail;
            that.pile = res.data.pile;
            that.station = res.data.station;
          }
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.section-main{
  display: flex;
  & div {
    flex: 1;
  }

  .section-main-center {
    padding: 0px !important;
    padding-left: 24px !important;
  }
}
@import "../../assets/css/trad/billDetail.scss";
</style>
