<template>
  <section>
    <div class="section-title">代理商分润管理</div>
    <div class="section-header">
      <div class="section-item-router">
        <router-link to="/trad/agent">分润规则</router-link>
        <router-link class="section-act" to="/trad/agent/check">分润信息</router-link>
      </div>
      <div class="section-item-header clearfix">
        <span>筛选查询</span>
      </div>
      <div class="header-content clearfix">
        <div class="content-item">
          <div class="header-left">代理商账号</div>
          <div class="header-right">
            <el-input class="search-input" v-model="modelObj.search" placeholder="关键字搜索" />
          </div>
        </div>
        <div class="content-item">
          <div class="btn_succ" @click="searchPile()">查询</div>
          <div class="btn_cancel" @click="resetSearch()">重置</div>
        </div>
      </div>
    </div>
    <div class="section-container">
      <div class="section-item-header clearfix">
        <span>分润信息列表</span>
      </div>
      <div class="section-main">
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td">代理商账号</div>
            <div class="table-td">代理商类型</div>
            <div class="table-td">联系人</div>
            <div class="table-td">联系电话</div>
            <div class="table-td">分润站点</div>
            <div class="table-td">创建时间</div>
            <div class="table-td">操作</div>
          </div>
          <div class="table-body" v-loading="listLoading">
            <div class="table-tr" v-show="tableData && tableData.length > 0" v-for="(list, index) in tableData"
              :key="index">
              <div class="table-td">
                <div class="td-item">{{ list.account }}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{ agent_type[list.type] }}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{ list.user_name || "--" }}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{ list.tel }}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{ list.stations_str || '--' }}</div>
              </div>
              <div class="table-td">
                <div class="td-item td-time">{{ list.create_time }}</div>
              </div>
              <div class="table-td hover-green">
                <router-link :to="`/trad/agent/check/record?id=${list.id}`" class="td-item">分润记录</router-link>
                <router-link :to="`/trad/agent/check/cash?id=${list.id}&account=${list.account}`"
                  class="td-item">提现记录</router-link>
                <!-- <el-tooltip
                  content="导出"
                  placement="top"
                >
                  <div
                    class="td-item export-icon"
                    @click="downloadDetail(list.statement_id)"
                  ></div>
                </el-tooltip> -->
              </div>
            </div>
            <div v-if="!tableData || tableData.length === 0" class="table-tr unData">
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
  </section>
</template>

<script>
export default {
  data () {
    return {
      modelObj: {
        search: '',
      },
      agent_type: {
        1: '个人',
        2: '国有企业',
        3: '集体企业',
        4: '私营企业',
        5: '其它企业',
        6: '集团客户',
      },
      currentPage: 1,
      page_count: 1,
      tableData: [],
      listLoading: false,
    };
  },
  created () {
    this.getTableDataList();
  },
  methods: {
    getTableDataList () {
      this.listLoading = true;
      this.modelObj.page = this.currentPage;
      this.$api.profitMessList(this.modelObj).then(data => {
        this.listLoading = false;
        if (data.code == 1) {
          this.tableData = data.data.list;
          this.currentPage = data.data.current_page;
          this.page_count = data.data.page_total;
        }
      });
    },
    searchPile () {
      this.currentPage = 1;
      this.tableData = [];
      this.getTableDataList();
    },
    resetSearch () {
      this.modelObj.search = "";
      this.currentPage = 1;
      this.tableData = [];
      this.getTableDataList();
    },
    // 点击分页触发
    handleCurrentChange (page) {
      this.currentPage = page;
      this.tableData = [];
      this.getTableDataList();
    },
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/trad/check.scss";
</style>
