<template>
  <section>
    <div class="section-title">
      <router-link to="/trad/bill">账单管理</router-link>
      > 账单详情
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
              <div class="top-item-text ellipsis" style="color: #666">{{ detail.out_trade_id }}
              </div>
            </div>
            <div class="top-item">
              <div class="top-item-tr">
                <div class="top-item-title">账单状态</div>
                <div
                  :class="['top-item-text ellipsis', detail.payment_status == 1 ? 'section-running' : 'section-no-begin']"
                  style="font-size: 16px">{{ detail.payment_status == 1 ? '已支付' : '未支付' }}</div>
              </div>
              <div class="top-item-tr">
                <div class="top-item-title">支付时间</div>
                <div class="top-item-text ellipsis"
                  :style="{ color: detail.payment_status == 1 && detail.payment_time ? '#666' : '' }">
                  {{ detail.payment_status == 1 && detail.payment_time ? detail.payment_time : '--' }}
                </div>
              </div>
            </div>
            <div class="top-item">
              <div class="top-item-tr">
                <div class="top-item-title">实付（元）</div>
                <div class="top-item-text ellipsis" :style="{ color: parseFloat(detail.real_amount) ? '#666' : '' }">
                  {{ detail.real_amount }} 元</div>
              </div>
              <div class="top-item-tr">
                <div class="top-item-title item-pay-type">支付方式</div>
                <div class="top-item-text ellipsis" :style="{color: detail.pay_way_text ? '#666' : ''}">
                  {{ detail.pay_way_text || '--' }}
                </div>
              </div>
            </div>
          </div>
          <div class="header-content clearfix">
            <div class="content-item">
              <span>开始充电时间：</span>
              {{ detail.charge_start_time ? detail.charge_start_time : '--' }}
            </div>
            <div class="content-item">
              <span>结束充电时间：</span>
              {{ detail.charge_finish_time ? detail.charge_finish_time : '--' }}
            </div>
            <div class="content-item">
              <span>充电时长（分钟）：</span>
              {{ detail.charge_time ? detail.charge_time : '0' }}
            </div>
            <div class="content-item">
              <span>充电度数（度）：</span>
              {{ detail.charge_quantity ? detail.charge_quantity : '0' }}
            </div>
            <div class="content-item">
              <span>总费用（元）：</span>
              {{ detail.total_amount }}
            </div>
            <div class="content-item">
              <span>优惠折扣（元）：</span>
              {{ detail.bonus_money }}
            </div>
            <div class="content-item">
              <span>特权折扣抵扣（元）：</span>
              {{ detail.discount_money }}
            </div>
            <div class="content-item">
              <span>总服务费（元）：</span>
              {{ detail.service_amount }}
            </div>
            <div class="content-item">
              <span>电费（元）：</span>
              {{ detail.charge_amount }}
            </div>
            <div class="content-item">
              <span>车架号：</span>
              {{ detail.vin ? detail.vin : '--' }}
            </div>
            <div class="content-item">
              <span>停止充电原因：</span>
              {{ detail.stop_code ? detail.stop_code : '--' }}
            </div>
            <div class="content-item">
              <span> 车牌号：</span>
              {{ detail.vehicle_number ? detail.vehicle_number : '--' }}
            </div>
            <div class="content-item">
              <span> 减免停车费时长：</span>
              {{ detail.park_bonus_minute ? detail.park_bonus_minute : '--' }}分钟
            </div>

          </div>
        </div>
      </div>
      <div class="section-list section-period" v-if="tableData&&tableData.length">
        <div class="section-item-header clearfix">
          <span>分时段计费信息</span>
        </div>
        <div class="section-main">
          <div class="table">
            <div class="table-th clearfix">
              <div class="table-td table-column__1">时段类型</div>
              <div class="table-td">充电时段</div>
              <div class="table-td">充电时长</div>
              <div class="table-td">充电度数（kWh）</div>
              <div class="table-td">电费（元）</div>
              <div class="table-td">服务费（元）</div>
              <div class="table-td">总费用（元）</div>
            </div>
            <div class="table-body">
              <div class="table-tr" v-show="tableData && tableData.length > 0" v-for="(item, index) in tableData"
                :key="index">
                <div class="table-td table-column__1">
                  <div class="td-item">
                    <span v-if="item.time_type === '0'" class="td-period td-period-tip"></span>
                    <span v-if="item.time_type === '1'" class="td-period td-period-peak"></span>
                    <span v-if="item.time_type === '3'" class="td-period td-period-valley"></span>
                    <span v-if="item.time_type === '2'" class="td-period td-period-flat"></span>
                    <span v-if="!item.time_type">{{ item.time_type ||'--' }}</span>
                  </div>
                </div>
                <div class="table-td">
                  <div class="td-item td-time">
                    <p v-for="(time,index) in item.charging_time" :key="index">{{time}}</p>
                  </div>
                </div>
                <div class="table-td">
                  <div class="td-item">
                    {{ item.charging_length || '--' }}
                  </div>
                </div>
                <div class="table-td">
                  <div class="td-item">{{ item.elec || '--' }}</div>
                </div>
                <div class="table-td">
                  <div class="td-item">{{ item.elec_fee || '--' }}</div>
                </div>

                <div class="table-td">
                  <div class="td-item">{{ item.serv_fee || '--' }}</div>
                </div>
                <div class="table-td">
                  <div class="td-item">{{ item.total_money || '--' }}</div>
                </div>
              </div>
              <div v-if="!tableData || tableData.length === 0" class="table-tr unData">
                <img :src="require('assets/img/unData.png')" />
                <span>暂无数据</span>
              </div>
            </div>
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
              <div class="content-item">
                <span>充电站：</span>
                {{ station ? station.station_name : '--' }}
              </div>
              <div class="content-item">
                <span>所属区域：</span>
                {{ station ? station.p_name : '--' }}{{ station ? station.c_name : '' }}
              </div>
              <div class="content-item">
                <span>详细地址：</span>
                <p>{{ station ? station.address : '--' }}</p>
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
                <div class="content-item">
                  <span>充电桩编号：</span>
                  {{ pile.pile_sn ? pile.pile_sn : '--' }}
                </div>
                <div class="content-item">
                  <span>充电枪编号：</span>
                  {{ pile.gun ? pile.gun : '--' }}
                </div>
                <div class="content-item" v-if="pile.pile_type == 1">
                  <span>充电桩类型：</span>
                  直流
                </div>
                <div class="content-item" v-else-if="pile.pile_type == 2">
                  <span>充电桩类型：</span>
                  交流
                </div>
                <div class="content-item" v-else-if="pile.pile_type == 3">
                  <span>充电桩类型：</span>
                  交直流
                </div>
                <div class="content-item" v-else-if="pile.pile_type == 4">
                  <span>充电桩类型：</span>
                  无线
                </div>
                <div class="content-item" v-else>
                  <span>充电桩类型：</span>
                  其他
                </div>
                <!--1家用插座 2交流接口插座 3交流接口插头 4直流接口枪头   5无线充电座 6其它-->
                <div class="content-item" v-if="pile.gun_type == 1">
                  <span>充电枪类型：</span>
                  家用插座
                </div>
                <div class="content-item" v-else-if="pile.gun_type == 2">
                  <span>充电枪类型：</span>
                  交流接口插座
                </div>
                <div class="content-item" v-else-if="pile.gun_type == 3">
                  <span>充电枪类型：</span>
                  交流接口插头
                </div>
                <div class="content-item" v-else-if="pile.gun_type == 4">
                  <span>充电枪类型：</span>
                  直流接口枪头
                </div>
                <div class="content-item" v-else-if="pile.gun_type == 5">
                  <span>充电枪类型：</span>
                  无线充电座
                </div>
                <div class="content-item" v-else>
                  <span>充电枪类型：</span>
                  其他
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="section-list">
          <div class="section-item-header clearfix">
            <span>用户信息</span>
          </div>
          <div class="header-main">
            <div class="header-content clearfix">
              <div class="content-item">
                <span>用户ID：</span>
                {{ user.id ? user.id : '--' }}
              </div>
              <div class="content-item">
                <span>用户名：</span>
                {{ user.nick_name ? user.nick_name : '--' }}
              </div>
              <div class="content-item">
                <span>账号：</span>
                {{ user.tel ? user.tel : '--' }}
              </div>
              <div class="content-item"
                v-if="(detail.order_type == 1 || detail.order_type == 4 || detail.order_type == 5 || detail.order_type == 7) && user.user_type == 1">
                <span>用户类型：</span>
                个人
              </div>
              <div class="content-item"
                v-else-if="(detail.order_type == 1 || detail.order_type == 4 || detail.order_type == 5 || detail.order_type == 7) && user.user_type == 2">
                <span>用户类型：</span>
                企业主用户
              </div>
              <div class="content-item"
                v-else-if="(detail.order_type == 1 || detail.order_type == 4 || detail.order_type == 5 || detail.order_type == 7) && user.user_type == 3">
                <span>用户类型：</span>
                特权用户
              </div>
              <div class="content-item"
                v-else-if="(detail.order_type == 1 || detail.order_type == 4 || detail.order_type == 5 || detail.order_type == 7) && user.user_type == 4">
                <span>用户类型：</span>
                企业子用户
              </div>
              <div class="content-item" v-else-if="detail.order_type == 2">
                <span>用户类型：</span>
                IC卡
              </div>
              <div class="content-item" v-else-if="detail.order_type == 3">
                <span>用户类型：</span>
                第三方运营商
              </div>
              <div class="content-item" v-else-if="detail.order_type == 8">
                <span>用户类型：</span>
                远程控制账单
              </div>
              <div class="content-item" v-else>
                <span>用户类型：</span>
                未知
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
  name: '',
  components: {},
  data() {
    return {
      id: this.$route.query.id || 0,
      month: this.$route.query.month || '',
      detail: {
        out_trade_id: '--',
        real_amount: '0'
      },
      pile: {},
      station: {},
      user: {},
      listLoading: false,
      tableData: []
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      this.listLoading = true
      this.$api
        .billDetail({ out_trade_id: this.id, month: this.month })
        .then((res) => {
          this.listLoading = false
          if (res.code == 1) {
            this.detail = res.data.detail
            this.pile = res.data.pile
            this.station = res.data.station
            this.user = res.data.user
            this.tableData = res.data.charging_money_list
          }
        })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../assets/css/trad/billDetail.scss';
</style>
