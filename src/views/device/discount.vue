<template>
  <section>
    <div class="section-title">
      <router-link to="/device/station">充电站管理</router-link> > 充电站详情
    </div>
    <p class="section-name">{{station_name}}</p>
    <div class="section-container">
      <div class="section-item-header">
        <router-link :to="`/device/station/detail/${station_id}`">基本信息</router-link>
        <router-link :to="`/device/station/operate/${station_id}`">运营信息</router-link>
        <router-link
          :to="`/device/station/discount/${station_id}`"
          class="section-act"
        >查看优惠</router-link>
      </div>
      <div class="header-content clearfix">
        <div class="content-item">
          <div class="header-left">状态</div>
          <div class="header-right">
            <el-select v-model="modelObj.status">
              <el-option
                label="全部"
                value="0"
              />
              <el-option
                label="开启"
                value="1"
              />
              <el-option
                label="关闭"
                value="2"
              />
            </el-select>
          </div>
        </div>
        <div class="content-item">
          <div
            class="btn_succ"
            @click="getDiscountList()"
          >查询</div>
          <div
            class="btn_cancel"
            @click="resetSearch()"
          >重置</div>
        </div>
      </div>
      <div class="table">
        <div class="table-th clearfix">
          <div class="table-td">优惠方式</div>
          <div class="table-td">最近更新时间</div>
          <div class="table-td">使用条件</div>
          <div class="table-td">有效期</div>
          <div class="table-td">状态</div>
        </div>
        <div
          class="table-body"
          v-loading="listLoading"
        >
          <div
            v-show="tableData && tableData.length"
            class="table-tr"
            v-for="(item,index) in tableData"
            :key="index"
          >
            <div class="table-td">
              <div class="td-item">{{getDiscountType(item.type)}}</div>
            </div>
            <div class="table-td">
              <div class="td-item">{{item.update_time}}</div>
            </div>
            <div class="table-td">
              <div class="td-item">应付满{{item.min_good_amount/100}}元可用</div>
            </div>
            <div class="table-td">
              <div class="td-item">领取后{{item.exp}}日内</div>
            </div>
            <div class="table-td">
              <div :class="['td-item' , item.status == 1?'section-running':'']">{{item.status == 1 ? "开启" : "关闭"}}</div>
            </div>
          </div>
          <div
            v-if="!tableData || tableData.length == 0"
            class="table-tr unData"
          >
            <img :src="require('assets/img/unData.png')">
            <span>暂无数据</span>
          </div>
        </div>
        <!-- 分页 -->
        <sf-pagination
          v-if="tableData && tableData.length"
          :currentPage="currentPage"
          :page-count="page_count"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      station_id: this.$route.params.id ? this.$route.params.id : "",
      modelObj: {
        id: this.$route.params.id ? this.$route.params.id : "",
        page: 1,
        limit: 10,
        status: "0"
      },
      listLoading: false,
      currentPage: 1,
      page_count: 1,
      tableData: [],
      station_name: "",
    };
  },
  created() {
    this.getDiscountList();
  },
  methods: {
    getDiscountType(type) {
      switch (type) {
        case "1":
          return "邀请新用户";
          break;
        case "2":
          return "充值";
          break;
        case "3":
          return "累计消费";
          break;
        default:
          return "未知";
          break;
      }
    },
    //resetSearch
    resetSearch() {
      this.modelObj.status = "0";
      this.getDiscountList();
    },
    getDiscountList() {
      this.listLoading = true;
      this.$api.getDiscountList(this.modelObj).then(res => {
        if (res.code == 1) {
          this.station_name = res.data.station_name;
          this.tableData = res.data.list;
          this.currentPage = res.data.current_page;
          this.page_count = Math.ceil(
            res.data.total_count / this.modelObj.limit
          );
        }
        this.listLoading = false;
      });
    },
    // 点击分页触发
    handleCurrentChange(page) {
      this.modelObj.page = page;
      this.getDiscountList();
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../assets/css/device/discount.scss";
</style>
