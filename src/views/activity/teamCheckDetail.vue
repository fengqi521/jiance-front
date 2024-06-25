<template>
  <section>
    <div class="section-title">
      <router-link :to="{path:'/activity/team/checkteam',query:{id :backId}}">组队活动管理</router-link> > 队伍详情
    </div>
    <div class="section-container">
      <div class="section-item-header">
        <span>队伍信息</span>
      </div>
      <div class="section-main">
        <div class="header-content header-content-bottom clearfix">
          <div class="content-top">
            <div class="top-item">
              <div class="top-item-title">队伍周期</div>
              <div
                class="top-item-text ellipsis"
                :style="{
                  fontSize: '18px',
                  color: parseFloat(balance) ? '#666666' : '#666666',
                }"
              >
                {{
                  parseFloat(checkDetailTop.create_time)
                    ? checkDetailTop.create_time
                    : 0
                }}
                <br />
                {{
                  parseFloat(checkDetailTop.expire_time)
                    ? checkDetailTop.expire_time
                    : 0
                }}
              </div>
            </div>
            <div class="top-item">
              <div class="top-item-title">队伍名称</div>
              <div
                class="top-item-text ellipsis"
                :style="{
                  fontSize: '18px',
                  color: parseFloat(checkDetailTop.name)
                    ? '#666666'
                    : '#666666',
                }"
              >
                {{
                  checkDetailTop.name
                    ? checkDetailTop.name
                    : '--'
                }}
              </div>
            </div>
            <div class="top-item">
              <div class="top-item-title">总支付金额（元）</div>
              <div
                class="top-item-text ellipsis"
                :style="{
                  fontSize: '18px',
                  color: parseFloat(checkDetailTop.max_spend_money)
                    ? '#666666'
                    : '#666666',
                }"
              >
                {{
                  parseFloat(checkDetailTop.max_spend_money)
                    ? checkDetailTop.max_spend_money
                    : 0
                }}
              </div>
            </div>
          </div>
        </div>
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td">用户账号</div>
            <div class="table-td">已支付金额（元）</div>
            <div class="table-td">发券时间
                <el-tooltip content="队伍结束后，1小时内系统发券" placement="top">
                    <div slot="content" style="width:200px;">
                        队伍结束后，1小时内系统发券
                    </div>
                    <div class="tips-icon"></div>
                </el-tooltip>
            </div>
          </div>
          <div class="table-body" v-loading="listLoading">
            <div
              class="table-tr"
              v-show="checkDetailBottom && checkDetailBottom.length"
              v-for="(list, index) in checkDetailBottom"
              :key="index"
            >
              <div class="table-td">
                <div class="td-item">{{ list.tel }}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{ list.spend_money }}</div>
              </div>
              <div class="table-td">
                <div class="td-item">
                  {{ list.status == "2" ? list.update_time : "--" }}
                </div>
              </div>
            </div>
            <div
              class="table-tr unData"
              v-if="!checkDetailBottom || checkDetailBottom.length === 0"
            >
              <img :src="require('assets/img/unData.png')" />
              <span>暂无数据</span>
            </div>
          </div>
          <!-- 分页 -->
          <sf-pagination
            v-if="checkDetailBottom && checkDetailBottom.length > 0"
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
import addCouponAcDetail from "./components/addCouponAcDetail";
export default {
  components: {
    addCouponAcDetail,
  },
  data() {
    return {
      checkDetailTop: {},
      checkDetailBottom: {},
      //改变状态
      checkDetailChangeStatus: {
        type: "2",
        status: "1",
        preferential_id: this.$route.query.id,
        change_id: "", //当类型为全部修改时，不需要传值
      },
      //获取优惠活动下车辆的列表
      modelObj: {
        id: this.$route.query.id,
        search: "",
        type: "all",
        status: "all",
      },
      //获取单独添加车辆列表
      modeltVehicleAdd: {
        type: "",
        search: "",
        page: "",
        preferential_id: this.$route.query.id,
      },
      //页面按面包屑返回时，返回有数据
      backId: this.$route.query.backId,
      currentPage: 1,
      page_count: 1,
      listLoading: false,
      balance: "",
    };
  },
  created() {
    this.getTableDataListTop();
    this.getTableDataListBottom();
  },
  methods: {
    getTableDataListTop() {
      this.loading = true;
      this.$api
        .checkteamDeatilTop({ id: this.$route.query.id })
        .then((data) => {
          this.loading = false;
          if (data.code == 1) {
            this.checkDetailTop = data.data;
          }
        });
    },
    getTableDataListBottom() {
      this.listLoading = true;
      this.modelObj.page = this.currentPage;
      this.$api.checkteamDeatilBottom(this.modelObj).then((data) => {
        this.listLoading = false;
        if (data.code == 1) {
          this.checkDetailBottom = data.data.list;
          this.currentPage = data.data.current_page;
          this.page_count = data.data.page_total;
        }
      });
    },
    // 点击分页触发
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getTableDataListBottom();
    },
  },
  destroyed() {
    document.documentElement.style.minWidth = "1300px";
  },
};
</script>
<style lang="scss">
.el-tooltip__popper.is-dark {
  max-width:181px;
}
</style>
<style lang="scss" scoped>
@import "../../assets/css/activity/teamCheckDetail.scss";
</style>
