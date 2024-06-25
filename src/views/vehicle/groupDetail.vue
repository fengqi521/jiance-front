<template>
  <section>
    <div class="section-title">
      <span
        class="section-title section-title-act"
        @click="handleBackAc()"
      >群组管理</span> > 群组详情
    </div>
    <div class="section-container" style="margin-top:0px;">
      <div class="section-item-header clearfix">
        <span>群组详情</span>
      </div>
      <div class="section-main">
        <div class="table">
          <div class="table-th clearfix">
            <!-- <div class="table-td">用户账号</div> -->
            <div class="table-td">车牌号</div>
            <div class="table-td">车架号</div>
            <div class="table-td">车辆类型</div>
            <!-- <div class="table-td">退款状态</div>
            <div class="table-td">备注</div> -->
          </div>
          <div class="table-body" v-loading="listLoading">
            <div
              class="table-tr"
              v-show="tableData &&tableData.length > 0"
              v-for="(item, index) in tableData"
              :key="index"
            >
              <!-- <div class="table-td">
                <div class="td-item">{{item.tel}}</div>
              </div> -->
              <div class="table-td">
                <div class="td-item">{{item.license_plate}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{item.car_frame}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{item.car_type == '1' ? '运营车辆' : '个人车辆'}}</div>
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
      group_detail_id : JSON.parse(this.$route.query.id)
    };
  },
  created() {
    if(this.group_detail_id){
      this.getGroupList();
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
    getGroupList() {
      var that = this;
      that.listLoading = true;
      // this.refund_list.page = String(this.currentPage);
      this.$api.GroupDetail({id : this.group_detail_id}).then((res) => {
        that.listLoading = false;
        if (res.code == 1) {
          that.page_count = Math.ceil(res.data.total_count / 10);
          that.currentPage = res.data.current_page;
          that.tableData = res.data.list;
          console.log('GroupDetail',res.data);
        }
      });
    },
    handleBackAc(){
        this.$router.push({path:'/vehicle/groupmanager'})
    },
    // 点击分页触发
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getGroupList();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/trad/cash.scss";
.is-plug-status{
  color: #FF6632;
}
</style>

