<template>
  <section>
    <div class="section-title">卡信息</div>
    <div class="section-header">
      <div class="section-item-header clearfix">
        <span>筛选查询</span>
      </div>
      <div class="header-content clearfix">
        <div class="content-item">
         <div class="header-left">卡号</div>
         <div class="header-right">
             <el-input
                class="search-input"
                v-model="modelObj.search_content"
                placeholder="关键字搜索"
            />
         </div>
        </div>
        <div class="content-item">
          <div
            class="btn_succ"
            @click="searchStation()"
          >查询</div>
          <div
            class="btn_cancel"
            @click="resetSearch()"
          >重置</div>
        </div>
      </div>
    </div>
    <div class="section-container">
      <div class="section-item-header clearfix">
        <span>卡列表</span>
      </div>
      <div class="section-main">
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td">卡号</div>
            <div class="table-td">创建时间</div>
            <div class="table-td">余额（元）</div>
            <div class="table-td">状态</div>
            <div class="table-td">操作</div>
          </div>
          <div
            class="table-body"
            v-loading="listLoading"
          >
            <div
              class="table-tr"
              v-show="tableData && tableData.length"
              v-for="(item, index) in tableData"
              :key="index"
            >
              <div class="table-td">
                <div class="td-item">{{item.card_num}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{item.create_time ? item.create_time : '--'}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{item.balance ? item.balance : '--'}}</div>
              </div>
              <div class="table-td">
                <div class="td-item" :class="status_class_array[item.status]">{{status_array[item.status]?status_array[item.status]:'--'}}</div>
              </div>
              <div class="table-td table-operate">
                <el-tooltip
                  content="查看"
                  placement="top"
                >
                  <router-link
                    target="_blank"
                    :to="`/card/message/detail/${item.card_num}`"
                    class="td-item see-icon"
                  ></router-link>
                </el-tooltip>
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
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      password: "text",
      modelObj: {
        search_content: "",
      },
      currentPage: 1,
      page_count: 1,
      listLoading: false,
      tableData: [],
      status_array: {
        "1": "可用",
        "2": "冻结",
        "3": "禁用",
        "4": "--"
      },
      status_class_array: {
        "1": "section-running",
        "2": "section-no-begin",
        "3": "section-no-begin",
        "4": "section-end"
      },
    };
  },
  created() {
    this.getTableDataList();
  },
  methods: {
    getTableDataList() {
      this.listLoading = true;
      this.modelObj.page = this.currentPage;
      this.$api.getCardList(this.modelObj).then(data => {
        this.listLoading = false;
        if (data.code == 1) {
          this.tableData = data.data.list;
          this.currentPage = data.data.current_page;
          this.page_count = data.data.page_total;
        }
      });
    },
    searchStation() {
      this.currentPage = 1;
      this.tableData = [];
      this.getTableDataList();
    },
    resetSearch() {
      this.modelObj.search_content = "";
      this.currentPage = 1;
      this.page_count = 1;
      this.tableData = [];
      this.getTableDataList();
    },
    // 点击分页触发
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getTableDataList();
    },
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/card/message.scss";
</style>
