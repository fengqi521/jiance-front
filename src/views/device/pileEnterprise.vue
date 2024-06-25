<template>
  <section>
    <div class="section-title">
      <span class="section-title section-title-act" @click="handleBackAc()"
        >资产管理</span
      >
      <span class="section-title">></span>
      <span class="section-title">桩企管理</span>
    </div>
    <div class="section-container activity-box">
      <div class="section-item-header clearfix">
        <span>桩企列表</span>
        <span @click="handleAdd(0)" class="btn_succ add-coupon">
          <i class="add-station-add"></i>添加桩企
        </span>
      </div>
      <div class="section-main">
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td">桩企名称</div>
            <div class="table-td">接入ID</div>
            <div class="table-td">创建时间</div>
            <div class="table-td">操作</div>
          </div>
          <div class="table-body" v-loading="listLoading">
            <div
              class="table-tr"
              v-show="tableData && tableData.length > 0"
              v-for="(advert, index) in tableData"
              :key="index"
            >
              <div class="table-td">
                <div class="td-item">{{ advert.title }}</div>
              </div>
              <div class="table-td">
                <div class="td-item td-time">{{ advert.auth_id }}</div>
              </div>
              <div class="table-td">
                <div class="td-item td-time">{{ advert.create_time }}</div>
              </div>
              <div class="table-td table-operate">
                <el-tooltip content="编辑" placement="top">
                  <div
                    class="td-item edit-icon"
                    @click="handleEdit(advert)"
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
          <sf-pagination
            v-if="tableData && tableData.length > 0"
            :currentPage="currentPage"
            :page-count="page_count"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
    <!-- 添加/编辑 活动 -->
    <sf-modelBox
      class="vehicle-box add-asset-box"
      :showModel.sync="showVehicleManager"
      :title="edit_id == 0 ? '添加桩企' : '修改桩企'"
      @change="saveActivitySure(edit_id)"
    >
      <el-form>
        <div class="section-list">
          <div class="section-left">桩企名称</div>
          <div class="section-right">
            <el-form-item prop="status">
              <el-input
                maxlength="15"
                type="input"
                class="logo-car-type"
                v-model="enterpriseInfo.title"
                placeholder="请输入桩企名称"
              />
            </el-form-item>
          </div>
        </div>
      </el-form>
    </sf-modelBox>
  </section>
</template>

<script>
export default {
  data() {
    return {
      showVehicleManager: false,
      //桩企列表数据
      currentPage: 1,
      page_count: 1,
      listLoading: false,
      tableData: [],
      //添加桩企
      enterpriseInfo: {
        title: "",
      },
      edit_id: 0,
    };
  },
  mounted() {
    this.$nextTick(() => {
      document.documentElement.style.minWidth = "1200px";
    });
  },
  created() {
    this.getTableDataList();
  },
  methods: {
    handleBackAc() {
      this.$router.push({ path: "/device/asset" });
    },
    //获取桩企的列表
    getTableDataList() {
      this.listLoading = true;
      this.$api
        .assetsEnterpriseList({ page: this.currentPage })
        .then((data) => {
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
    handleAdd(id) {
      this.edit_id = id;
      this.enterpriseInfo.title = "";
      this.showVehicleManager = true;
    },
    handleEdit(row) {
      this.edit_id = row.id;
      this.showVehicleManager = true;
      this.enterpriseInfo = {
        title: row.title,
      };
    },
    saveActivitySure(id) {
      if (!this.enterpriseInfo.title) {
        this.$sfNotify({
          duration: 0,
          type: "error",
          message: "桩企名称不能为空",
        });
        return false;
      }
      if (!id) {
        // 添加
        this.$api.createEnterprise(this.enterpriseInfo).then((data) => {
          if (data.code == 1) {
            this.showVehicleManager = false;
            this.$sfNotify({
              message: "成功",
            });
            this.getTableDataList();
          } else {
            this.$sfNotify({
              duration: 0,
              type: "error",
              message: data.message,
            });
          }
        });
      } else {
        this.enterpriseInfo.id = this.edit_id;
        this.$api.editEnterprise(this.enterpriseInfo).then((data) => {
          if (data.code == 1) {
            this.showVehicleManager = false;
            this.$sfNotify({
              message: "成功",
            });
            this.getTableDataList();
          } else {
            this.$sfNotify({
              duration: 0,
              type: "error",
              message: data.message,
            });
          }
        });
      }
    },
  },
  destroyed() {
    document.documentElement.style.minWidth = "1200px";
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/device/enterprise.scss";
</style>
