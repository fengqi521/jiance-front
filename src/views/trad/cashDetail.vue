<template>
  <section>
    <div class="section-title">
      <span
        class="section-title section-title-act"
        @click="handleBackAc()"
      >提现管理</span> > 退款详情
    </div>
    <div class="section-container" style="margin-top:0px;">
      <div class="section-item-header clearfix">
        <span>退款列表</span>
      </div>
      <div class="section-main">
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td">退款单号</div>
            <div class="table-td">充值单号</div>
            <div class="table-td">充值时间</div>
            <div class="table-td">充值金额（元）</div>
            <div class="table-td">退款方式</div>
            <div class="table-td">退款金额（元）</div>
            <div class="table-td">退款时间</div>
            <div class="table-td">退款状态</div>
            <div class="table-td">备注</div>
          </div>
          <div class="table-body" v-loading="listLoading">
            <div
              class="table-tr"
              v-show="tableData &&tableData.length > 0"
              v-for="(item, index) in tableData"
              :key="index"
            >
              <div class="table-td">
                <div class="td-item">{{item.transfer_id?item.transfer_id:"暂无"}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{item.recharge_id}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{item.recharge_time}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{item.recharge_amount}}</div>
              </div>
              <div class="table-td table-type">
                <div v-if="item.refund_type == 2" class="td-item td-ali-pay"></div>
                <div v-else class="td-item td-wechat-pay"></div>
              </div>
              <div class="table-td">
                <div class="td-item td-time">{{item.real_refund_amount}}</div>
              </div>
              <div class="table-td">
                <div class="td-item td-time">{{item.update_time}}</div>
              </div>
              <div class="table-td">
                <div class="td-item section-no-begin" v-if="item.refund_status == 2">失败</div>
                <div class="td-item" v-else-if="item.refund_status == 1">成功</div>
                <div class="td-item section-running" v-else-if="item.refund_status == 0">处理中</div>
              </div>
              <div class="table-td table-operate">
                <el-tooltip v-if="item.transfer_status != 1" :content="item.refund_fail_reason" placement="top">
                  <span>{{item.refund_fail_reason | noteNllipsis}}</span>
                </el-tooltip>
                <span v-if="item.transfer_status == 1">--</span>
              </div>
            </div>
            <div v-if="!tableData || tableData.length == 0" class="table-tr unData">
              <img :src="require('assets/img/unData.png')" />
              <span>暂无数据</span>
            </div>
          </div>
          <!-- 分页 -->
          <sf-pagination
            v-if="tableData && tableData.length > 0"
            :currentPage="currentPage"
            :page-count="page_count"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      currentPage: 1,
      page_count: 1,
      tableData: [],
      listLoading: false,
      refund_list: {
        limit:'10',
        page:'',
        transfer_id : JSON.parse(this.$route.query.id)
      },
    };
  },
  created() {
    if(this.refund_list.transfer_id){
      this.getCashRefundList();
    }
  },
  filters: {
    noteNllipsis(value) {
      if (!value) return "--";
      if (value.length > 38) {
        return value.slice(0, 38) + "...";
      }
      return value;
    },
  },
  methods: {
    //获取退款列表
    getCashRefundList() {
      var that = this;
      that.listLoading = true;
      this.refund_list.page = String(this.currentPage);
      this.$api.cashRefundList(this.refund_list).then((res) => {
        that.listLoading = false;
        if (res.code == 1) {
          that.page_count = Math.ceil(res.data.total_count / 10);
          that.currentPage = res.data.current_page;
          that.tableData = res.data.list;
        }
      });
    },
    handleBackAc(){
        this.$router.push({path:'/trad/cash'})
    },
    // 点击分页触发
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getCashRefundList();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/trad/cash.scss";
</style>

