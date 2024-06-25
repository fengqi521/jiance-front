<template>
  <section>
    <div class="section-title">群组管理</div>
    <div class="section-header">
      <div class="section-item-header clearfix">
        <span>筛选查询</span>
      </div>
      <div class="header-content clearfix">
        <div class="content-item user-only">
          <div class="header-left">
            群组名称
          </div>
          <div class="header-right">
            <el-input
              class="search-input"
              v-model="search_content"
              placeholder="关键字搜索"
            />
          </div>
        </div>
        <!-- <div class="content-item">
          <div class="header-left">群组类型</div>
          <div class="header-right">
            <el-select v-model="modelObj.group_type">
              <el-option label="全部" value="all" />
              <el-option label="企业" value="1" />
              <el-option label="个人" value="2" />
            </el-select>
          </div>
        </div> -->
        <div class="content-item">
          <div class="btn_succ" @click="searchPile()">查询</div>
          <div class="btn_cancel" @click="resetSearch()">重置</div>
        </div>
      </div>
    </div>
    <div class="section-container">
      <div class="section-item-header clearfix">
        <span>群组列表</span>
        <router-link to="/vehicle/groupmanager/addgroup" class="btn_succ add-coupon">
          <i class="add-station"></i>添加群组
        </router-link>
        <!-- <router-link to="/activity/coupon/send" class="btn_recovery send-btn"
          >已发优惠券</router-link
        > -->
      </div>
      <div class="section-main">
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td">创建时间</div>
            <div class="table-td">群组名称</div>
            <!-- <div class="table-td">群组类型</div> -->
            <div class="table-td">成员数量</div>
            <div class="table-td">操作</div>
          </div>
          <div class="table-body" v-loading="listLoading">
            <div
              class="table-tr"
              v-show="tableData && tableData.length > 0"
              v-for="(group_info, index) in tableData"
              :key="index"
            >
              <div class="table-td">
                <div class="td-item">
                  {{ group_info.create_time}}
                </div>
              </div>
              <div class="table-td">
                <div class="td-item">
                  {{ group_info.title }}
                </div>
              </div>
              <!-- <div class="table-td">
                <div class="td-item">{{ group_info.type == '1'? '企业' : '个人' }}</div>
              </div> -->
              <div class="table-td">
                <div class="td-item">
                  {{ group_info.count }}
                </div>
              </div>
              <div class="table-td table-operate">
                <el-tooltip content="查看" placement="top">
                  <div
                    class="td-item see-icon"
                    @click="showDetail(group_info.id)"
                  ></div>
                </el-tooltip>
                <el-tooltip content="编辑" placement="top">
                  <router-link
                    :to="{path:'/vehicle/groupmanager/addgroup',query:{id :group_info.id}}"
                    class="td-item edit-icon"
                  ></router-link>
                </el-tooltip>
                <el-tooltip content="删除" placement="top">
                  <div
                    class="td-item delete-icon"
                    @click="delItem(group_info.id, index)"
                  ></div>
                </el-tooltip>
              </div>
            </div>
            <div
              v-if="!tableData || tableData.length === 0"
              class="table-tr unData"
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
    <!-- 删除 -->
    <sf-modelBox
      :showModel.sync="showDelete"
      title="删除确认"
      type="delete"
      @change="saveDeleteSure"
    >
      <p>删除群组后，不会影响当前已使用该群组创建的优惠活动，是否删除？</p>
    </sf-modelBox>
    <!-- 查看权限 -->
    <!-- <sf-messageBox
      class="permission-box"
      :showModel.sync="showPermission"
      title="优惠券使用权限"
    >
      <div class="box-name">可用充电站：</div>
      <div class="box-main scrollBar">
        {{ available_stations }}
      </div>
    </sf-messageBox> -->
  </section>
</template>

<script>
import logVue from '../device/log.vue';
export default {
  data() {
    return {
      search_content:'',//搜索关键词
      modelObj: {
        search : '',
        group_type : "all",
      },
      currentPage: 1,
      page_count: 1,
      tableData: [],
      listLoading: false,
      showDelete: false,
    //   showPermission: false,
      bonus_type_array: {
        1: "邀请新用户",
        2: "充值",
        3: "累计消费",
      },
      available_stations: "",
      delete_id: "",
    };
  },
  created() {
    this.getTableDataList();
  },
  methods: {
    getTableDataList() {
      this.listLoading = true;
      this.modelObj.page = this.currentPage;
      this.$api.getGroupList(this.modelObj).then((data) => {
        this.listLoading = false;
        if (data.code == 1) {
          this.tableData = data.data.list;
          this.currentPage = data.data.current_page;
          this.page_count = data.data.page_total;
        }
      });
    },
    // 点击分页触发
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getTableDataList();
    },
    changeStatus(item, index) {
      let status = item.status == 1 ? 2 : 1;
      this.$api
        .bonusChangeStatus({ id: item.id, status: status })
        .then((data) => {
          if (data.code == 1) {
            this.$sfNotify({
              message: "成功",
            });
            this.tableData[index].status = status;
          } else {
            this.$sfNotify({
              duration: 0,
              type: "error",
              message: "失败",
            });
          }
        });
    },
    delItem(id, index) {
      this.delete_id = id;
      this.showDelete = true;
    },
    searchPile() {
      this.modelObj.search = this.search_content;
      this.currentPage = 1;
      this.getTableDataList();
    },
    resetSearch() {
      this.search_content = '';
      this.modelObj.search = '';
      this.modelObj.group_type = "all";
      this.currentPage = 1;
      this.page_count = 1;
      this.tableData = [];
      this.getTableDataList();
    },
    saveDeleteSure() {
      console.log('类型',typeof this.delete_id);
      this.$api.deleteGroupList({ id: this.delete_id }).then((data) => {
        this.showDelete = false;
        if (data.code == 1) {
          this.$sfNotify({
            message: "成功",
          });
          setTimeout(this.getTableDataList, 1500);
        } else {
          this.$sfNotify({
            duration: 0,
            type: "error",
            message: "失败",
          });
        }
      });
    },
    showDetail(id) {
    console.log('id',id);
        let routeUrl = this.$router.resolve({
            path: "/vehicle/groupmanager/groupdetail",
            query: {
            id: JSON.stringify(id),
            },
        });
        window.open(routeUrl.href, '_blank');
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/vehicle/groupManager.scss";
</style>
