<template>
  <section>
    <div class="section-title">
      <router-link to="/user/users">消费用户</router-link> > 用户详情
    </div>
    <p class="section-name">用户 {{user_id}} 详情</p>
    <div class="section-header">
      <div class="section-item-router">
        <router-link :to="`/user/users/detail/${user_id}`">基本信息</router-link>
        <router-link :to="`/user/users/amount/${user_id}`">金额明细</router-link>
        <router-link :to="`/user/users/level/${user_id}`" class="section-act">等级积分</router-link>
        <router-link :to="`/user/users/record/${user_id}`">邀请记录</router-link>
        <router-link :to="`/user/users/charge/${user_id}`">充电记录</router-link>
      </div>
      <div class="header-content">
        <div class="content-top">
          <div class="top-left">
            <span class="user-level">{{changeLevel(level)}}</span>
          </div>
          <div class="top-right clearfix">
            <div class="top-item">
              <div class="top-item-title">积分累计（分）</div>
              <div
                :class="['top-item-text ellipsis' ,parseFloat(total)?'section-running':'']"
              >{{parseFloat(total) ? total : 0}}</div>
            </div>
            <div class="top-item">
              <div class="top-item-title">现有可用积分（次）</div>
              <div
                class="top-item-text ellipsis"
                :style="{color:parseFloat(count)?'#666':''}"
              >{{parseFloat(count) ? count : 0}}</div>
            </div>
            <div class="top-item">
              <div class="top-item-title">消费累计（分）</div>
              <div
                class="top-item-text ellipsis"
                :style="{color:parseFloat(used)?'#666':''}"
              >{{parseFloat(used) ? used : 0}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="section-container">
      <div class="section-item-header">
        <span>积分明细</span>
      </div>
      <div class="section-main">
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td">时间</div>
            <div class="table-td">类型</div>
            <div class="table-td">积分(分)</div>
            <div class="table-td ">描述</div>
          </div>
          <div class="table-body" v-loading="listLoading">
            <div
              class="table-tr"
              v-show="tableData && tableData.length"
              v-for="(item, index) in tableData"
              :key="index"
            >
              <div class="table-td">
                <div class="td-item">{{item.create_time}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{type_array[item.type]}}</div>
              </div>
              <div class="table-td">
                <div class="td-item" v-if="item.type == 3">-{{item.number}}</div>
                <div class="td-item" v-else>{{item.number}}</div>
              </div>
              <div class="table-td">
                <div class="td-item" >{{item.describe}}</div>
              </div>
            </div>
            <div class="table-tr unData" v-if="!tableData || tableData.length === 0">
              <img :src="require('assets/img/unData.png')" />
              <span>暂无数据</span>
            </div>
          </div>
          <!-- 分页 -->
          <sf-pagination
            v-if="tableData && tableData.length>0"
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
      total:0,
      count:0,
      level:'',
      used:0,
      user_id: this.$route.params.id,
      currentPage: 1,
      page_count: 1,
      listLoading: false,
      loading: false,
      tableData: [],
      type_array: {
        "1": "登录赠送",
        "2": "充电赠送",
        "3": "积分兑换"
      },
    };
  },
  created() {
    this.getBasicDetail();
    this.getIntegralList();
  },
  methods: {
    //获取积分详情
    getBasicDetail() {
      this.listLoading = true;
      this.loading = true;
      let param = {
        id: this.user_id,
      };
      this.$api.customerLevel(param).then((data) => {
        this.listLoading = false;
        this.loading = false;
        if (data.code == 1) {
          this.total = data.data.total
          this.count = data.data.count
          this.used = data.data.total-data.data.count
          this.level = data.data.level
        }
      });
    },
    //获取积分列表
    getIntegralList(){
        this.listLoading = true;
        this.loading = true;
        let param = {
            id: this.user_id,
            page: this.currentPage,
        };
        this.$api.IntegralList(param).then((data) => {
            this.listLoading = false;
            this.loading = false;
            var that = this
            if (data.code == 1) {
                that.tableData = data.data.list;
                that.currentPage = data.data.current_page;
                that.page_count = data.data.page_total;
            }
        });
    },
    // 点击分页触发
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getIntegralList();
    },
    //切换等级
    changeLevel(level) {
      switch (level) {
        case '2':
          return '二级';
        case '3':
          return '三级';
        case '4':
          return '四级';
        case '5':
          return '五级';
        case '6':
          return '六级';
        case '7':
          return '七级';
        case '8':
          return '八级';
        default:
          return '一级';
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../assets/css/user/level.scss";
</style>
