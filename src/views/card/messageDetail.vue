<template>
  <section>
    <div class="section-title">
      <router-link to="/card/message">卡信息</router-link> > 卡详情
    </div>
    <div class="section-header">
      <div class="section-item-router">
        <router-link :to="`/card/message/detail/${card_num}`" class="section-act"
          >充值详情</router-link
        >
        <router-link :to="`/card/message/account/${card_num}`"
          >消费金额</router-link
        >
      </div>
      <div class="header-content" v-loading="topLoading">
        <div class="content-top">
          <div class="top-item">
            <div class="top-item-title">卡余额（元）</div>
            <div
              class="top-item-text ellipsis"
              :class="parseFloat(topData.balance) ? 'section-end' : '' "
            >
              {{topData.balance ? topData.balance : 0 }}
            </div>
          </div>
          <div class="top-item">
            <div class="top-item-title">充值总计（元）</div>
            <div
              class="top-item-text ellipsis"
              :class="parseFloat(topData.total_recharge_amount) ? 'section-end' : ''"
            >
              {{ topData.total_recharge_amount ? topData.total_recharge_amount : 0 }}
            </div>
          </div>
        </div>
      </div>
      <div class="section-container">
        <div class="section-main">
          <div class="table">
            <div class="table-th clearfix">
              <div class="table-td">充值时间</div>
              <div class="table-td">充值金额</div>
            </div>
            <div class="table-body" v-loading="listLoading">
              <div
                class="table-tr"
                v-show="tableData && tableData.length"
                v-for="(item, index) in tableData"
                :key="index"
              >
                <div class="table-td">
                  <div class="td-item">{{ item.recharge_time || '--'}}</div>
                </div>
                <div class="table-td">
                  <div class="td-item">{{ item.recharge_amount || '--'}}</div>
                </div>
              </div>
              <div
                class="table-tr unData"
                v-if="!tableData || tableData.length === 0"
              >
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
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      card_num: this.$route.params.id,
      currentPage: 1,
      page_count: 1,
      topLoading: false,
      listLoading: false,
      tableData: [],
      topData:{},
    };
  },
  created() {
    this.getDataTopList();
    this.getDataList();
  },
  methods: {
    //卡详情
    getDataTopList() {
      this.topLoading = true;
      let param = {
        card_number: this.card_num,
      };
      this.$api.getCardDetailTop(param).then(data => {
        this.topLoading = false;
        if (data.code == 1) {
          this.topData = data.data;
        }
      });
    },
    //卡详情列表
    getDataList() {
      this.listLoading = true;
      let param = {
        card_number: this.card_num,
        page: this.currentPage,
      };
      this.$api.getCardDetailList(param).then(data => {
        this.listLoading = false;
        if (data.code == 1) {
          this.tableData = data.data.list;
        }
      });
    },
    // 点击分页触发
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getDataList();
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../assets/css/card/messageDetail.scss";
</style>
