<template>
  <section>
    <div class="section-title">
      分润管理
    </div>
    <div class="section-list">
      <div class="section-item-header clearfix">
        <span>基本信息</span>
        <div class="btn_recovery add-coupon" v-if="set_withdrawal_account === '1'"
          :style="isCash == '1' ? '' : 'cursor: not-allowed;'" @click="handleIsCash()">
          <router-link :style="isCash == '1' ? '' : 'cursor: not-allowed;'" :to="isCash == '1' ? {
            path: '/trad/manage/set',
            query: { isAlipay: `${isAlipay}`, isWxpay: `${isWxpay}` },
          } : ''">
            设置提现账户
          </router-link>
        </div>
      </div>
      <div class="header-main">
        <div class="header-box" v-loading="listLoading">
          <div class="header-content clearfix">
            <div class="content-item" v-if="alipay.account">
              <img class="radio-img" :src="require('assets/img/alipay.png')" />
              <span>提现账户类型： </span>{{ alipay.account_type == 1 ? '个人' : '企业' }}
            </div>
            <div class="content-item" v-else><img class="radio-img"
                :src="require('assets/img/alipay.png')" /><span>提现账户类型： </span>--</div>
            <div class="content-item"><span>账户持有人姓名：</span>{{ alipay.account_name ? alipay.account_name : '--' }}</div>
            <div class="content-item"><span>提现账户：</span> <span>{{ alipay.account ? alipay.account : '--' }}</span></div>
            <div class="content-item"><span>联系电话：</span>{{ alipay.tel ? alipay.tel : '--' }}</div>
          </div>
          <div class="header-content clearfix">
            <div class="content-item" v-if="wxpay.account">
              <img class="radio-img" :src="require('assets/img/wechat.png')" />
              <span>提现账户类型： </span>{{ wxpay.account_type == 1 ? '个人' : '企业' }}
            </div>
            <div class="content-item" v-else><img class="radio-img"
                :src="require('assets/img/wechat.png')" /><span>提现账户类型： </span>--</div>
            <div class="content-item"><span>账户持有人姓名：</span>{{ wxpay.account_name ? wxpay.account_name : '--' }}</div>
            <div class="content-item"><span>提现账户：</span> <span>{{ wxpay.account ? wxpay.account : '--' }}</span></div>
            <div class="content-item"><span>联系电话：</span>{{ wxpay.tel ? wxpay.tel : '--' }}</div>
          </div>

        </div>
        <div class="bank-container">
          <p class="bank-header">银行卡信息</p>
          <div class="table bank-table">
            <div class="table-th clearfix">
              <div class="table-td">收方户名</div>
              <div class="table-td">收方账号</div>
              <div class="table-td">开户行名称</div>
              <div class="table-td">收方手机号</div>
              <div class="table-td">收款比率（%）</div>
            </div>
            <div class="table-body" v-loading="isLoading">
              <div class="table-tr" v-show="tableData && tableData.length" v-for="(owner, i) in tableData" :key="i">
                <div class="table-td">
                  <div class="td-item">{{ owner.recipient_name }}</div>
                </div>
                <div class="table-td">
                  <div class="td-item">{{ owner.recipient_account }}</div>
                </div>
                <div class="table-td">
                  <div class="td-item">{{ owner.bank_name }}</div>
                </div>
                <div class="table-td">
                  <div class="td-item">{{ owner.recipient_phone }}</div>
                </div>
                <div class="table-td">
                  <div class="td-item">{{ owner.withdrawal_ratio }}</div>
                </div>
              </div>
              <div v-if="!tableData || !tableData.length" class="table-tr unData">
                <img :src="require('assets/img/unData.png')">
                <span>暂无数据</span>
              </div>
            </div>
            <!-- 分页 -->
            <sf-pagination v-if="tableData && tableData.length" :currentPage="currentPage" :page-count="page_count"
              @current-change="handleCurrentChange" />
          </div>
        </div>

        <div class="header-amount" v-loading="infoLoading">
          <div class="top-item">
            <div class="top-item-title">已分润金额（元）</div>
            <div class="top-item-text ellipsis">{{ info.shared_profit_amount ? info.shared_profit_amount : '--' }}</div>
            <div class="top-a hover-green"><router-link to="/trad/manage/record">分润记录 >></router-link></div>
          </div>
          <div class="top-item">
            <div class="top-item-title">已提现金额（元）</div>
            <div class="top-item-text ellipsis">{{ info.cash_withdrawn ? info.cash_withdrawn : '--' }}</div>
            <div class="top-a hover-green"><router-link to="/trad/manage/cash">提现记录 >></router-link></div>
          </div>
          <div class="top-item">
            <div class="top-item-title">未提现金额（元）</div>
            <div class="top-item-text ellipsis">{{ info.no_withdrawl ? info.no_withdrawl : '--' }}</div>
            <div class="top-a hover-green" :style="isCash == '1' ? '' : 'cursor: not-allowed;'" @click="handleIsCash()">
              <router-link :style="isCash == '1' ? '' : 'cursor: not-allowed;'" :to="isCash == '1' ? {
                path: '/trad/manage/apply',
                query: { isAlipay: `${isAlipay}`, isWxpay: `${isWxpay}`, isCard: (tableData.length && `${card_config}`) || 0 },
              } : ''">
                申请提现 >>
              </router-link>
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
  data () {
    return {
      isCash: '1',
      isAlipay: '1',
      isWxpay: '1',
      allowed: '1',
      card_config: '1',
      set_withdrawal_account: '0',
      listLoading: false,
      infoLoading: false,
      alipay: {
        account_name: '',
        account_type: '',
        account: '',
        tel: '',
        withdrawl_type: ''
      },
      wxpay: {
        account_name: '',
        account_type: '',
        account: '',
        tel: '',
        withdrawl_type: ''
      },
      account_type: {
        1: '微信',
        2: '支付宝',
        3: '银行卡',
      },
      info: {
        shared_profit_amount: '',
        cash_withdrawn: '',
        no_withdrawl: ''
      },
      isLoading: false,
      searchParams: {
        recipient_name: "",
        recipient_account: "",
        limit: 3
      },
      tableData: [],
      currentPage: 1,
      page_count: 1,
    };
  },
  created () {
    this.getConfig();
    this.getDetail()
    this.getTableDataList()
  },
  methods: {
    getConfig () {
      this.listLoading = true;
      this.$api.getWithdrawOriginConfig().then(res => {
        this.listLoading = false;
        if (res.code == 1) {
          this.alipay = res.data.alipay;
          this.wxpay = res.data.wxpay;
          this.isAlipay = res.data.ali_config;
          this.isWxpay = res.data.wx_config;
          this.card_config = res.data.card_config;
          this.set_withdrawal_account = res.data.set_withdrawal_account
        }
      })
    },
    getDetail () {
      this.infoLoading = true;
      this.$api.getAgentMoney().then(res => {
        this.infoLoading = false;
        if (res.code == 1) {
          this.info.shared_profit_amount = res.data.shared_profit_amount
          this.info.cash_withdrawn = res.data.cash_withdrawn
          this.info.no_withdrawl = res.data.no_withdrawl
          this.isCash = res.data.is_config;
        }
      });
    },
    // 获取银行卡数据
    getTableDataList () {
      this.isLoading = true;
      this.searchParams.page = this.currentPage;
      this.$api.getAgentCollect(this.searchParams).then(data => {
        this.isLoading = false;
        if (data.code == 1) {
          this.tableData = data.data.list;
          this.currentPage = data.data.current_page;
          this.page_count = data.data.page_total;
        }
      });
    },
    // 点击分页触发
    handleCurrentChange (page) {
      this.currentPage = page;
      this.tableData = [];
      this.getTableDataList();
    },

    handleIsCash () {
      if (this.isCash != '1') {
        this.$sfNotify({
          duration: 0,
          type: "error",
          message: "暂不支持在线提现",
        });
      }
    },
  }
};
</script>
<style lang="scss" scoped>
@import "../../assets/css/trad/manage.scss";
</style>
