<template>
  <section>
    <div class="section-title">
      <router-link to="/trad/agent">代理商分润管理</router-link> > 分润账单详情
    </div>
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
              :style="{color:out_trade_id?'#666':''}"
            >{{out_trade_id?out_trade_id:'--'}}</div>
          </div>
          <div class="top-item">
            <div class="top-item-tr">
              <div class="top-item-title">账单状态</div>
              <div
                :class="['top-item-text ellipsis' , order_status ? 'section-running':'section-no-begin']"
                style="font-size:16px"
              >{{order_status?order_status_array[order_status]:'--'}}</div>
            </div>
            <div class="top-item-tr">
              <div class="top-item-title">支付时间</div>
              <div
                class="top-item-text ellipsis"
                :style="{color:payment_time?'#666':''}"
              >{{payment_time?payment_time:'--'}}</div>
            </div>
          </div>
          <div class="top-item">
            <div class="top-item-tr">
              <div class="top-item-title">实付（元）</div>
              <div
                class="top-item-text ellipsis"
                :style="{color:parseFloat(real_amount)?'#666':''}"
              >{{parseFloat(real_amount)?real_amount / 100:0}}</div>
            </div>
            <div class="top-item-tr">
              <div class="top-item-title">退款（元）</div>
              <div
                :class="['top-item-text ellipsis' , parseFloat(handle_amount)?'section-no-begin':'']"
              >{{handle_amount ?  handle_amount/100 : 0}}</div>
            </div>
          </div>
        </div>
        <div class="header-content clearfix">
          <div class="content-item"><span>开始充电时间：</span>{{charge_start_time}}</div>
          <div class="content-item"><span>结束充电时间：</span>{{charge_finish_time}}</div>
          <div class="content-item"><span>充电时长（分钟）：</span>{{charge_time}}</div>
          <div class="content-item"><span>充电度数（度）：</span>{{charge_quantity}}</div>
          <div class="content-item"><span>总费用（元）：</span>{{total_amount/100}}</div>
          <div class="content-item"><span>优惠折扣（元）：</span>{{bonus_money/100}}</div>
          <div class="content-item"><span>特权折扣抵扣（元）：</span>{{discount_money/100}}</div>
          <div class="content-item"><span>总服务费（元）：</span>{{service_amount/100}}</div>
          <div class="content-item"><span>电费（元）：</span>{{charge_amount/100}}</div>
        </div>
        <div
          class="header-content header-content__1"
          v-if="refund_status"
        >
          <div class="content-item"><span>申请人（用户ID）：</span>{{user_id}}</div>
          <div class="content-item"><span>申请人退款原因：</span>{{service_content}}</div>
          <div class="content-item"><span>退款操作人：</span>{{operator}}</div>
          <div class="content-item"><span>同意/拒绝退款原因：</span>{{handle_content}}</div>
        </div>
      </div>
    </div>

  </section>
</template>

<script>
export default {
  data() {
    return {
      modelObj: {
        id: this.$route.query.id,
        start: this.$route.query.start,
        end: this.$route.query.end
      },
      out_trade_id: "",
      order_status: "",
      payment_time: "",
      real_amount: "",
      handle_amount: 0,
      order_status_array: { "0": "未完成", "1": "已完成" },
      charge_start_time: "",
      charge_finish_time: "",
      charge_time: "",
      charge_quantity: 0, // 电量
      charge_amount: 0, // 电费
      total_amount: 0, // 总费用
      bonus_money: 0, // 优惠金额
      service_amount: 0, // 服务费
      discount_money: 0, // 特权
      user_id: "",
      service_content: "",
      operator: "",
      handle_content: "",
      refund_status: false
    };
  },
  created() {
    this.getProfitDetailInfo();
  },
  methods: {
    getProfitDetailInfo() {
      this.$api.benefitDetail(this.modelObj).then(data => {
        if (data.code == 1) {
          if (data.data.refund.length !== 0) {
            this.refund_status = true;
            this.handle_amount = data.data.refund.handle_amount;
            this.user_id = data.data.refund.user_id;
            this.service_content = data.data.refund.service_content;
            this.operator = data.data.refund.operator;
            this.handle_content = data.data.refund.handle_content;
          }
          this.out_trade_id = data.data.out_trade_id;
          this.order_status = data.data.order_status;
          this.payment_time = data.data.payment_time;
          this.real_amount = data.data.real_amount;
          this.charge_start_time = data.data.charge_start_time;
          this.charge_finish_time = data.data.charge_finish_time;
          this.charge_time = data.data.charge_time;
          this.charge_quantity = data.data.charge_quantity;
          this.charge_amount = data.data.charge_amount;
          this.total_amount = data.data.total_amount;
          this.bonus_money = data.data.bonus_money;
          this.service_amount = data.data.service_amount;
          this.discount_money = data.data.discount_money;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../assets/css/trad/agentDetail.scss";
</style>
