<template>
  <section>
    <div class="section-title">
      <router-link to="/trad/invoice">发票管理</router-link> > 发票详情
    </div>
    <div class="section-header" v-loading="loading">
      <div class="header-content clearfix">
        <div class="content-top">
          <div class="top-item">
            <div class="top-item-title">发票金额</div>
            <div class="top-item-text ellipsis">
              {{ teamTop.invoice_amount ? teamTop.invoice_amount + '元' : '--' }}
            </div>
          </div>
          <div class="top-item">
            <div class="top-item-title">发票状态</div>
            <div class="top-item-text ellipsis section-no-begin" v-if="teamTop.status != 2">
              {{ teamTop.status == 1 ? '待开票' : '开票失败' }}
            </div>
            <div class="top-item-text ellipsis section-running hover-green" v-else>
              已开票
              <a :href="teamTop.down_url" v-if="teamTop.invoice_type == 2">
                <div class="download-info"><span class="invoice-download">下载电子发票</span><img class="download-img"
                    :src="require('static/theme/blue/img/invoice-download.png')"></div>
              </a>
            </div>
          </div>
        </div>
        <div class="content-bottom clearfix">
          <div class="content-item"><span>申请时间：</span>{{ teamTop.create_time }}</div>
          <div class="content-item"><span>发票抬头：</span>{{ teamTop.invoice_title }}</div>
          <div class="content-item" v-if="teamTop.title_type == 1"><span>纳税人识别号：</span>{{ teamTop.tax_number ?
            teamTop.tax_number : '--' }}</div>
          <div class="content-item" v-else><span>纳税人识别号：</span>--</div>
          <div class="content-item"><span>电子邮箱：</span>{{ teamTop.receive_email ? teamTop.receive_email : '--' }}</div>
          <div class="content-item"><span>联系方式：</span>{{ teamTop.receive_tel ? teamTop.receive_tel : '--' }}</div>
        </div>
      </div>
    </div>
    <div class="section-container">
      <div class="section-item-header clearfix">
        <span>开票订单</span>
        <div class="btn_recovery export-btn" @click="downloadDetail">
          <i class="export-icon"></i>
          导出
        </div>
      </div>
      <div class="section-main">
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td">订单编号</div>
            <div class="table-td">充电站名称</div>
            <div class="table-td">充电桩编号</div>
            <div class="table-td">支付时间</div>
            <div class="table-td">总费用（元）</div>
            <div class="table-td">总服务费（元）</div>
            <div class="table-td">总电费（元）</div>
            <div class="table-td">优惠抵扣（元）</div>
            <div class="table-td">实付（元）</div>
          </div>
          <div class="table-body" v-loading="listLoading">
            <div class="table-tr" v-show="teamBottom && teamBottom.length" v-for="(list, index) in teamBottom"
              :key="index">
              <div class="table-td">
                <div class="td-item">{{ list.trade_id }}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{ list.station_name }}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{ list.pile_sn }}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{ list.payment_time }}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{ list.total_amount }}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{ list.service_amount }}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{ list.charge_amount }}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{ list.bonus_money }}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{ list.real_amount }}</div>
              </div>
            </div>
            <div class="table-tr unData" v-if="!teamBottom || teamBottom.length === 0">
              <img :src="require('assets/img/unData.png')" />
              <span>暂无数据</span>
            </div>
          </div>
          <!-- 分页 -->
          <sf-pagination v-if="teamBottom && teamBottom.length > 0" :currentPage="currentPage" :page-count="page_count"
            @current-change="handleCurrentChange" />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data () {
    return {
      ENV: process.env.NODE_ENV == "development" ? "/api" : "",
      progress_array: {
        1: "进行中",
        2: "已结束"
      },
      coupon_array: {
        2: "已发券",
        1: "未发券"
      },
      teamTop: {},
      teamBottom: {},
      //获取优惠活动下车辆的列表
      modelObj: {
        page: '',
        limit: '10',
        id: this.$route.params.id
      },
      currentPage: 1,
      page_count: 1,
      listLoading: false,
      loading: false,
      balance: "",
      is_export: false
    };
  },
  created () {
    this.getTableDataListTop();
    this.getTableDataListBottom();
  },
  methods: {
    getTableDataListTop () {
      this.loading = true;
      this.$api.invoiceDetail({ id: this.$route.params.id }).then((data) => {
        this.loading = false;
        if (data.code == 1) {
          this.teamTop = data.data
          this.is_export = data.data.invoice_bill_import
        }
      });
    },
    getTableDataListBottom () {
      this.listLoading = true;
      this.modelObj.page = this.currentPage;
      this.$api.invoiceBill(this.modelObj).then((data) => {
        this.listLoading = false;
        if (data.code == 1) {
          this.teamBottom = data.data.list
          this.currentPage = data.data.current_page;
          this.page_count = data.data.page_total;
        }
      });
    },
    // 点击分页触发
    handleCurrentChange (page) {
      this.currentPage = page;
      this.getTableDataListBottom();
    },

    // 导出
    downloadDetail () {
      if (this.is_export) {
        window.location.href = `${this.ENV}/invoice/invoice-bill-import?id=${this.modelObj.id}`
      } else {
        this.$sfMessage.error('抱歉，当前用户没有操作权限')
      }
    },
  },
};
</script>
<style lang="scss">
.el-tooltip__popper.is-dark {
  max-width: 180px;
}
</style>
<style lang="scss" scoped>
@import "../../assets/css/trad/invoiceDetail.scss";
</style>
