<template>
  <section>
    <div class="section-title">
      提现管理
    </div>
    <div class="section-header">
      <div class="section-item-header clearfix">
        <span>筛选查询</span>
      </div>
      <div class="header-content clearfix">
        <div class="content-item">
          <el-select class="search-type" v-model="modelObj.search_type">
            <el-option label="提现单号" value="1" />
            <el-option label="提现账号" value="3" />
          </el-select>
          <el-input class="search-input" v-model="modelObj.search_content" placeholder="关键字搜索" />
        </div>
        <div class="content-item">
          <div class="header-left">申请时间</div>
          <div class="header-right">
            <el-date-picker v-model="modelObj.start_time" type="date" value-format="yyyy-MM-dd"
              placeholder="选择开始日期"></el-date-picker>
            <el-date-picker class="end-time" v-model="modelObj.end_time" value-format="yyyy-MM-dd" type="date"
              placeholder="选择结束日期"></el-date-picker>
          </div>
        </div>
        <!-- <div class="content-item">
          <div class="header-left">提现方式</div>
          <div class="header-right">
            <el-select v-model="modelObj.platform_type">
              <el-option
                label="全部"
                value="all"
              />
              <el-option
                label="微信"
                value="1"
              />
              <el-option
                label="支付宝"
                value="2"
              />
            </el-select>
          </div>
        </div>-->
        <div class="content-item">
          <div class="header-left">提现状态</div>
          <div class="header-right">
            <el-select v-model="modelObj.status">
              <el-option label="全部" value="all" />
              <el-option label="待处理" value="0" />
              <el-option label="处理中" value="1" />
              <el-option label="成功" value="2" />
            </el-select>
          </div>
        </div>
        <div class="content-item">
          <div class="btn_succ" @click="getCashList">查询</div>
          <div class="btn_cancel" @click="resetSearch">重置</div>
        </div>
      </div>
    </div>
    <div class="section-container">
      <div class="section-item-header clearfix">
        <span>提现列表</span>
        <div class="btn_recovery export-btn" @click="cashExport">
          <i class="export-icon"></i>导出
        </div>
        <div class="btn_succ recharge-btn" @click="adminWithdrawList">
          人工提现>>
        </div>
      </div>
      <div class="section-main">
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td">提现单号</div>
            <div class="table-td">提现账号</div>
            <div class="table-td">申请提现金额（元）</div>
            <div class="table-td">申请时间</div>
            <div class="table-td">实际退款金额（元）</div>
            <div class="table-td">提现状态</div>
            <div class="table-td">操作</div>
          </div>
          <div class="table-body" v-loading="listLoading">
            <div class="table-tr" v-show="tableData && tableData.length > 0" v-for="(item, index) in tableData"
              :key="index">
              <div class="table-td">
                <div class="td-item">{{ item.transfer_id ? item.transfer_id : "暂无" }}</div>
              </div>
              <div class="table-td">
                <div class="td-item" v-if="item.logout_user_tel">
                  {{ item.user_tel ? item.user_tel : "暂无" }}(已注销)
                </div>
                <div class="td-item" v-else>
                  {{ item.user_tel ? item.user_tel : "暂无" }}
                </div>
              </div>
              <div class="table-td">
                <div class="td-item">{{ item.refund_amount }}</div>
              </div>
              <div class="table-td">
                <div class="td-item td-time">{{ item.create_time }}</div>
              </div>
              <div class="table-td">
                <div class="td-item td-time">
                  {{
                    item.transfer_status == 2 ? item.real_refund_amount : "--"
                  }}
                </div>
              </div>
              <div class="table-td">
                <div class="td-item section-no-begin" v-if="item.transfer_status == '0'">待处理</div>
                <div class="td-item section-no-begin" v-if="item.transfer_status == '1'">处理中</div>
                <div class="td-item section-end" v-else-if="item.transfer_status == '2'">成功</div>
              </div>
              <div class="table-td table-operate">
                <el-tooltip :content="item.transfer_status != 1 ? '查看退款详情' : '待处理状态下无法查看详情'" placement="top">
                  <span v-if="item.transfer_status != 1" class="td-item see-icon" @click="handleCash(item)"></span>
                  <span v-else class="td-item cash-disabled-icon"></span>
                </el-tooltip>
              </div>
            </div>
            <div v-if="!tableData || tableData.length == 0" class="table-tr unData">
              <img :src="require('assets/img/unData.png')" />
              <span>暂无数据</span>
            </div>
          </div>
          <!-- 分页 -->
          <sf-pagination v-if="tableData && tableData.length > 0" :currentPage="currentPage" :page-count="page_count"
            @current-change="handleCurrentChange" />
        </div>
      </div>
    </div>
    <!-- 提现 -->
    <!-- <sf-messageBox
      class="cash-box"
      :showModel.sync="showCashModel"
      title="提现处理"
    >
      <div class="box-list">
        <span class="box-left">提现金额</span>{{apply_money}} 元
      </div>
      <div class="box-list">
        <span class="box-left">申请时间</span>{{apply_time}}
      </div>
      <div class="box-bottom clearfix">
        <div
          class="btn_succ"
          @click="handleRefund(1)"
        >同意提现</div>
        <div
          class="btn_delete"
          @click="handleRefund(2)"
        >拒绝提现</div>
      </div>
    </sf-messageBox>-->
  </section>
</template>

<script>
export default {
  data () {
    return {
      ENV: process.env.NODE_ENV == "development" ? "/api" : "",
      modelObj: {
        search_type: "3",
        search_content: "",
        start_time: "",
        end_time: "",
        platform_type: "all",
        status: "all",
      },
      pay_type: 2,
      currentPage: 1,
      page_count: 1,
      tableData: [],
      showCashModel: false,
      apply_money: "",
      apply_time: "",
      refund_id: "",
      listLoading: false,
      is_export: 0,
      is_admin_withdraw: 0,
    };
  },
  created () {
    this.getCashList();
  },
  methods: {
    // 点击分页触发
    handleCurrentChange (page) {
      this.currentPage = page;
      this.getCashList();
    },
    handleCash (item) {
      let { transfer_id } = item;
      let routeUrl = this.$router.resolve({
        path: "/trad/cash/detail",
        query: {
          id: JSON.stringify(transfer_id),
        },
      });
      window.open(routeUrl.href, "_blank");
    },
    /*
     获取提现列表
     */
    getCashList () {
      var that = this;
      that.listLoading = true;
      this.modelObj.page = this.currentPage;
      this.$api.cashList(this.modelObj).then((res) => {
        that.listLoading = false;
        if (res.code == 1) {
          that.page_count = Math.ceil(res.data.total_count / 10);
          that.currentPage = res.data.current_page;
          that.tableData = res.data.list;
          that.is_export = res.data.is_export;
          that.is_admin_withdraw = res.data.is_admin_withdraw;
        }
      });
    },

    cashExport () {
      if (this.is_export) {
        window.location.href = `${this.ENV}/refund/import-list?start_time=${this.modelObj.start_time}&end_time=${this.modelObj.end_time}&search_type=${this.modelObj.search_type}&search_content=${this.modelObj.search_content}&status=${this.modelObj.status}`;
      } else {
        this.$sfMessage.error("抱歉，当前用户没有操作权限");
      }
    },
    adminWithdrawList () {

      if (this.is_admin_withdraw) {
        this.$router.push({ path: "/trad/cash/admincash" });
      } else {
        this.$sfMessage.error("抱歉，当前用户没有操作权限");
      }

    },
    resetSearch () {
      this.modelObj = {
        search_type: "1",
        search_content: "",
        start_time: "",
        end_time: "",
        platform_type: "all",
        status: "all",
      };
      this.currentPage = 1;
      this.getCashList();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/trad/cash.scss";
</style>
