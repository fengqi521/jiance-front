<template>
  <section>
    <div class="section-title">
      <router-link :to="`/card/message/account/${card_number}`">卡账单</router-link> > 账单详情
    </div>
    <div class="section-list">
      <div class="section-item-header clearfix">
        <span>账单信息</span>
      </div>
      <div class="header-main">
        <div class="header-amount">
          <div class="top-item">
            <div class="top-item-title">账单编号:</div>
            <div
              :class="['top-item-text ellipsis' , detail.out_trade_id?'section-end':'']"
            >{{detail.out_trade_id?detail.out_trade_id:'--'}}</div>
          </div>
          <div class="top-item">
            <div class="top-item-tr">
              <div class="top-item-title">账单状态：</div>
              <div
                :class="['top-item-text ellipsis' ,detail.payment_status == 1?'section-running':'section-no-begin' ]"
                style="font-size:16px"
              >{{detail.payment_status == 1?'已支付':'未支付'}}</div>
            </div>
            <div class="top-item-tr">
              <div class="top-item-title">支付时间：</div>
              <div
                class="top-item-text ellipsis"
                :class="detail.payment_status == 1 ? 'section-end' : ''"
              >{{detail.payment_status?detail.payment_time:"--"}}</div>
            </div>
          </div>
          <div class="top-item">
            <div class="top-item-tr">
              <div class="top-item-title">实付（元）：</div>
              <div
                class="top-item-text ellipsis"
                :class="parseFloat(detail.real_amount) ? 'section-end' : ''"
              >{{parseFloat(detail.real_amount)?detail.real_amount:0}} 元</div>
            </div>
            <div class="top-item-tr">
              <div class="top-item-title"></div>
              <div class="top-item-text ellipsis"></div>
            </div>
            <!--
            <div class="top-item-tr">
              <div class="top-item-title">退款（元）：</div>
              <div
                class="top-item-text ellipsis"
                :style="{color:parseFloat(detail.handle_amount)?'#666':''}"
              >{{parseFloat(detail.handle_amount)?detail.handle_amount/100:0}} 元</div>
            </div>
            -->
          </div>
        </div>
        <div class="header-content clearfix">
          <div class="content-item"><span>开始充电时间：</span><span>{{detail.charge_start_time ? detail.charge_start_time : "--"}}</span></div>
          <div class="content-item"><span>结束充电时间：</span><span>{{detail.charge_finish_time ? detail.charge_finish_time : "--"}}</span></div>
          <div class="content-item"><span>充电时长（分钟）：</span><span>{{detail.charge_time ? detail.charge_time : "0"}}</span></div>
          <div class="content-item"><span>充电度数（度）：</span><span>{{detail.charge_quantity ? detail.charge_quantity : "0"}}</span></div>
          <div class="content-item"><span>总费用（元）：</span><span>{{detail.total_amount ? detail.total_amount : "0"}}</span></div>
          <div class="content-item"><span>优惠折扣（元）：</span><span>{{detail.bonus_money ? detail.bonus_money : "0"}}</span></div>
          <div class="content-item"><span>特权折扣抵扣（元）：</span><span>{{detail.discount_money ? detail.discount_money : "0"}}</span></div>
          <div class="content-item"><span>总服务费（元）：</span><span>{{detail.service_amount ? detail.service_amount: "0"}}</span></div>
          <div class="content-item"><span>电费（元）：</span><span>{{detail.charge_amount ? detail.charge_amount : "0"}}</span></div>
          <div class="content-item"><span>车架号：</span><span>{{detail.vin ? detail.vin : "--"}}</span></div>
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
            <div class="content-item"><span>充电站：</span><span>{{station.station_name ? station.station_name : "--"}}</span></div>
            <div class="content-item"><span>所属区域：</span><span>{{(station.p_name && station.c_name) ? station.p_name + station.c_name : "--"}}</span></div>
            <div class="content-item"><span>详细地址：</span><p>{{station.address ? station.address : "--"}}</p></div>
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
              <div class="content-item"><span>充电桩编号：</span>{{pile.pile_sn?pile.pile_sn:'--'}}</div>
              <div class="content-item"><span>充电枪编号：</span>{{pile.gun?pile.gun:'--'}}</div>
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
                v-else-if="pile.pile_type == 5"
              ><span>充电桩类型：</span>其他</div>
              <div
                class="content-item"
                v-else
              ><span>充电桩类型：</span>--</div>
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
                v-else-if="pile.gun_type == 6"
              ><span>充电枪类型：</span>其他</div>
              <div
                class="content-item"
                v-else
              ><span>充电枪类型：</span>--</div>
            </div>
          </div>
        </div>
      </div>
      <div class="section-list">
        <div class="section-item-header clearfix">
          <span>卡信息</span>
        </div>
        <div class="header-main">
          <div class="header-content clearfix">
            <div class="content-item user-card-number"><span >卡号：</span> <p>{{user.card_num ? user.card_num : "--"}}</p></div>
            <div class="content-item"><span>创建时间：</span>{{user.create_time ? user.create_time : "--"}}</div>
            <!-- <div class="content-item"><span>账号：</span>{{user.tel ? user.tel : "--"}}</div> -->
            <!-- <div
              class="content-item"
              v-if="user.user_type == 1"
            ><span>用户类型：</span>app用户</div>
            <div
              class="content-item"
              v-if="user.user_type == 2"
            ><span>用户类型：</span>企业用户</div>
            <div
              class="content-item"
              v-if="user.user_type == 3"
            ><span>用户类型：</span>特权用户</div>
            <div
              class="content-item"
              v-else
            ><span>用户类型：</span>--</div> -->
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
  created() {
    this.getDetail();
  },
  data() {
    return {
      id: this.$route.query.id || 0,
      month: this.$route.query.month || "",
      card_number: this.$route.query.card_number || "",
      detail: {},
      pile: {},
      station: {},
      user: {}
    };
  },
  methods: {
    getDetail() {
      var that = this;
      this.$api
        .getCardAccountTradList({ out_trade_id: this.id, month: this.month })
        .then(res => {
          if (res.code == 1) {
            that.detail = res.data.detail;
            that.pile = res.data.pile;
            that.station = res.data.station;
            that.user = res.data.user;
          }
        });
    },
  }
};
</script>
<style lang="scss" scoped>
@import "../../assets/css/card/messageAccountTrad.scss";
</style>
