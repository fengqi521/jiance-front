<template>
  <section>
    <div class="section-title">
      <span class="section-title section-title-act" @click="handleBackAc()">车型管理</span>
      <span class="section-title">></span>
      <span class="section-title">品牌管理</span>
    </div>
    <div class="section-header-car">
      <div class="section-item-header clearfix">
        <span>筛选查询</span>
      </div>
      <div class="header-content-car clearfix">
        <div class="content-item">
          <div class="header-left">车品牌</div>
          <div class="header-right">
            <el-input class="search-input" v-model="keyword" placeholder="关键字搜索" />
          </div>
        </div>
        <div class="content-item">
          <div class="btn_succ" @click="searchResultAc">查询</div>
          <div class="btn_cancel" @click="searchReset">重置</div>
        </div>
      </div>
    </div>
    <div class="section-container activity-box">
      <div class="section-item-header clearfix">
        <span>车品牌列表</span>
        <span @click="handleAdd(0)" class="btn_succ add-coupon">
          <i class="add-station-add"></i>添加品牌
        </span>
      </div>
      <div class="section-main">
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td">车品牌</div>
            <div class="table-td" style="min-width:330px;">品牌图标</div>
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
                <div class="td-item">{{advert.name}}</div>
              </div>
              <div class="table-td table-img">
                <img
                  v-if="advert.logo_url"
                  style="width:56px;height:56px;"
                  class="news-img"
                  :src="`${ENV}${advert.logo_url}`"
                />
                <div class="td-item td-time" v-else-if="advert.logo_url == null">--</div>
                <div class="td-item td-time" v-else-if="advert.logo_url == ''">--</div>
              </div>
              <div class="table-td table-operate">
                <el-tooltip content="编辑" placement="top">
                  <div class="td-item edit-icon" @click="handleEdit(advert)"></div>
                </el-tooltip>
                <!-- <el-tooltip content="删除" placement="top">
                  <div class="td-item delete-icon" @click="delVehicle(advert)"></div>
                </el-tooltip>-->
              </div>
            </div>
            <div v-if="!tableData || tableData.length === 0" class="table-tr unData">
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
      class="brand-box ad-box"
      :showModel.sync="showVehicle"
      :title="currentItem.id == 0 ? '新增品牌' : '修改品牌'"
      @change="saveActivitySure(currentItem.id)"
    >
      <el-form :model="carBrandInfo" ref="carBrandListInfo">
        <div class="section-list">
          <div class="section-left">
            <i class="must-add-car">*</i>车品牌
          </div>
          <div class="section-right">
            <el-form-item prop="status">
              <el-input
                maxlength="10"
                class="logo-car-title"
                v-model="carBrandInfo.name"
                placeholder="请输入车品牌,最多填10个字"
              />
            </el-form-item>
          </div>
        </div>
        <div class="section-list">
          <div class="section-left">品牌图标</div>
          <div class="section-right">
            <!-- 替换图片 -->
            <template v-if="carBrandInfo.logo_url">
              <div class="cover-outer">
                <img :src="real_img_url" class="coverImg" />
                <el-upload
                  class="edit-uploader"
                  :action="`${ENV}/vehicle/upload`"
                  :show-file-list="false"
                  :on-success="changeImgUrl"
                  :beforeUpload="beforeAvatarUpload"
                >更换图片…</el-upload>
              </div>
            </template>
            <!--添加图片 -->
            <template v-else>
              <el-upload
                class="add-uploader"
                :action="`${ENV}/vehicle/upload`"
                :show-file-list="false"
                :on-success="changeImgUrl"
                :beforeUpload="beforeAvatarUpload"
              >
                <div class="uploader-main__1">
                  <div class="uploader-icon"></div>
                </div>
              </el-upload>
            </template>
            <div class="uploader-tips">* 推荐上传像素：216*216px</div>
            <div class="uploader-tips uploader-size">（只能上传jpg/png格式文件，文件不能超过2M）</div>
          </div>
        </div>
      </el-form>
    </sf-modelBox>
    <!-- 删除 -->
    <sf-modelBox :showModel.sync="showDelete" title="删除确认" type="delete" @change="saveDeleteSure">
      <p>是否确定删除广告位“{{delete_sequence}}”？</p>
    </sf-modelBox>
  </section>
</template>

<script>
export default {
  data() {
    return {
      keyword: "",
      //活动管理编辑数据
      ENV: process.env.NODE_ENV == "development" ? "/api" : "",
      currentPage: 1,
      page_count: 1,
      listLoading: false,
      tableData: [],
      currentItem: {
        id: 0,
      },
      showDelete: false,
      showVehicle: false,
      carBrandInfo: {
        name: "",
        logo_url: "",
      },
      real_img_url: "",
      delete_id: "",
      delete_sequence: "",
    };
  },
  mounted() {
    this.$nextTick(() => {
      document.documentElement.style.minWidth = "1300px";
    });
  },
  created() {
    this.getTableDataList();
  },
  methods: {
    handleBackAc() {
      this.$router.push({ path: "/vehicle/car/cartype" });
    },
    //重置输入框
    searchReset() {
      this.keyword = "";
      this.getTableDataList();
    },
    //搜索关键字
    searchResultAc() {
      this.$api
        .getVehicleBrand({
          search: this.keyword,
          page: this.currentPage,
        })
        .then((data) => {
          this.listLoading = false;
          if (data.code == 1) {
            this.tableData = data.data.list;
            this.currentPage = data.data.current_page;
            this.page_count = data.data.page_total;
          }
        });
    },
    changeImgUrl(file) {
      var _url = file.url ? file.url : file.response.url;
      this.carBrandInfo.logo_url = _url;
      this.real_img_url = `${this.ENV}${_url}`;
    },
    getTableDataList() {
      this.listLoading = true;
      this.$api
        .getVehicleBrand({ search: this.keyword, page: this.currentPage })
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
      this.currentItem.id = id;
      this.real_img_url = "";
      this.carBrandInfo = {
        name: "",
        logo_url: "",
      };
      this.showVehicle = true;
    },
    handleEdit(row) {
      this.currentItem.id = row.id;
      this.showVehicle = true;
      this.real_img_url = `${this.ENV}${row.logo_url}`;
      this.carBrandInfo = {
        logo_url: row.logo_url,
        name: row.name,
        id: row.id,
      };
    },
    // 确认删除
    saveDeleteSure() {
      this.$api.deleteAdvert({ id: this.delete_id }).then((data) => {
        this.delete_id = "";
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
    saveActivitySure(id) {
      if (!this.carBrandInfo.name) {
        this.$sfNotify({
          duration: 0,
          type: "error",
          message: "请上传车品牌",
        });
        return false;
      }
      if (id == 0) {
        // 添加
        this.$api.addVehicleBrand(this.carBrandInfo).then((data) => {
          if (data.code == 1) {
            this.showVehicle = false;
            this.$sfNotify({
              message: "成功",
            });
            setTimeout(this.getTableDataList, 2000);
          } else {
            this.$sfNotify({
              duration: 0,
              type: "error",
              message: data.message,
            });
          }
        });
      } else {
        this.$refs["carBrandListInfo"].validate((valid) => {
          if (valid) {
            this.$api.editVehicleBrand(this.carBrandInfo).then((data) => {
              if (data.code == 1) {
                this.showVehicle = false;
                this.$sfNotify({
                  message: "成功",
                });
                setTimeout(this.getTableDataList, 2000);
              } else {
                this.$sfNotify({
                  duration: 0,
                  type: "error",
                  message: data.message,
                });
              }
            });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }
    },
    delVehicle(advert) {
      this.showDelete = true;
      this.delete_id = advert.id;
      this.delete_sequence = advert.sequence;
    },
    beforeAvatarUpload(file) {
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extension = testmsg === "jpg";
      const extension2 = testmsg === "png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!extension && !extension2) {
        this.$sfNotify({
          duration: 0,
          type: "error",
          message: "上传文件只能是 jpg、png格式!",
        });
      }
      if (!isLt2M) {
        this.$sfNotify({
          duration: 0,
          type: "error",
          message: "上传文件大小不能超过 2M!",
        });
      }
      return extension || (extension2 && isLt2M);
    },
  },
  destroyed() {
    document.documentElement.style.minWidth = "1200px";
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/vehicle/carBrandManager.scss";
</style>
