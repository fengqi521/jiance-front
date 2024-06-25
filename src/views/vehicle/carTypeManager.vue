<template>
  <section>
    <div class="section-title">
      <span class="section-title section-title-act" @click="handleBackAc()">车辆管理</span>
      <span class="section-title">></span>
      <span class="section-title">车型管理</span>
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
        <span>车型列表</span>
        <span @click="handleAdd(0)" class="btn_succ add-coupon">
          <i class="add-station-add"></i>添加车型
        </span>
        <span class="btn_recovery send-btn" style="width:110px;margin-left:2px;">
          <i class="add-station-out"></i>
          <!-- 批量导入 -->
          <el-upload
            class="upload-demo"
            ref="upload"
            :action="`${ENV}/vehicle/import-vehicle`"
            :before-upload="beforeUpload"
            :on-progress="progressUpload"
            :on-success="importCar"
            :show-file-list="false"
          >
            <el-button size="middle" type="primary" style="margin-right: 20px;font-size:12px;">批量导入</el-button>
          </el-upload>
          <el-tooltip content="点击下载导入示例" placement="top">
            <div class="hover-green" slot="content" style="line-height:18px;">
              <a
                :href="`${ENV}/vehicle/demo.xls`"
              >点击下载导入示例</a>
              <br />第一行：车品牌
              <br />第二行：车型
            </div>
            <div class="tips-icon"></div>
          </el-tooltip>
        </span>
        <router-link
          to="/vehicle/car/carbrand"
          style="padding:0 16px 0 18px;"
          class="btn_recovery send-btn"
        >品牌管理 >></router-link>
      </div>
      <div class="section-main">
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td">车品牌</div>
            <div class="table-td">车型</div>
            <!-- <div class="table-td table-column__1" style="min-width:330px;">品牌图标</div> -->
            <!-- <div class="table-td table-column__3">是否关联活动</div>
            <div class="table-td table-column__2">活动状态</div>
            <div class="table-td" style="min-width:98px;">广告状态</div>-->
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
                <div class="td-item">{{advert.parent_name}}</div>
              </div>
              <div class="table-td">
                <div class="td-item td-time">{{advert.name}}</div>
              </div>
              <div class="table-td table-operate">
                <el-tooltip content="编辑" placement="top">
                  <div class="td-item edit-icon" @click="handleEdit(advert)"></div>
                </el-tooltip>
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
      class="vehicle-box ad-box"
      :showModel.sync="showVehicleManager"
      :title="currentItem.id == 0 ? '新增车型' : '修改车型'"
      @change="saveActivitySure(currentItem.id)"
    >
      <el-form :model="carTypeInfo" ref="carTypeInfo">
        <div class="section-list">
          <div class="section-left">
            <i class="must-add-car">*</i>车品牌
          </div>
          <div class="section-right">
            <!-- <el-form-item prop="status">
              <el-input
                maxlength="10"
                class="logo-car-title"
                v-model="carTypeInfo.parent_id"
                placeholder="请输入车品牌,最多填10个字"
              />
            </el-form-item>-->
            <el-select v-model="addCarBrandListValueId" placeholder="请选择车品牌">
              <el-option
                v-for="list in addCarBrandList"
                :key="list.id"
                :label="list.name"
                :value="list.id"
              />
              <!-- <el-option label="启用" value="1" />
              <el-option label="停用" value="2" />-->
            </el-select>
          </div>
        </div>
        <div class="section-list">
          <div class="section-left">
            <i class="must-add-car">*</i>车型
          </div>
          <div class="section-right">
            <el-form-item prop="status">
              <el-input
                maxlength="30"
                type="textarea"
                class="logo-car-type"
                v-model="carTypeInfo.name"
                placeholder="请输入车型，最多前30个字"
              />
            </el-form-item>
          </div>
        </div>
      </el-form>
    </sf-modelBox>
    <!-- 删除 -->
    <sf-modelBox :showModel.sync="showDelete" title="删除确认" type="delete" @change="saveDeleteSure">
      <p>是否确定删除广告位“{{delete_sequence}}”？</p>
    </sf-modelBox>
    <sf-messageBox :showModel.sync="showProcessImport" title="温馨提示" @change="saveDeleteSure">
      <div class="import-process">
        <el-progress :show-text="false" :percentage="percentage" :color="customColor"></el-progress>
      </div>
      <div class="import-word">列表正在导入，请稍等......</div>
    </sf-messageBox>
    <sf-messageBox :showModel.sync="showProcessImportSuccess" title @change="saveDeleteSure">
      <div class="import-result-img">
        <div>
          <img src="../../assets/img/user-import.png" alt />
        </div>
        <div>
          <p>导入结束</p>
        </div>
      </div>
      <div class="import-result-word">
        <span class="import-common-word">导入数据</span>
        <span class="import-word">&nbsp;{{importWord}}&nbsp;</span>
        <span class="import-common-word">条，导入成功</span>
        <span class="import-word">&nbsp;{{importWordSuccess}}&nbsp;</span>
        <span class="import-common-word">条</span>
        <span class="import-common-word" v-if="importWordFail != 0">，导入失败</span>
        <span
          v-if="importWordFail != 0"
          class="import-word"
          style="color:#FF6632;"
        >&nbsp;{{importWordFail}}&nbsp;</span>
        <span v-if="importWordFail != 0" class="import-common-word">条</span>
      </div>
      <div v-if="importWordFail != 0" class="import-error">
        <a :href="`${this.ENV}/vehicle/get-error`">点击查看详细信息 ></a>
      </div>
      <div class="box-bottom clearfix import-sure">
        <div class="btn_succ" @click="importSure">确认</div>
      </div>
    </sf-messageBox>
  </section>
</template>

<script>
export default {
  data() {
    return {
      ENV: process.env.NODE_ENV == "development" ? "/api" : "",
      //批量导入进度条
      showProcessImport: false, //是否显示进度条
      showProcessImportSuccess: false, //导入结束无失败
      importWord: "",
      importWordSuccess: "",
      importWordFail: "",
      percentage: 0,
      customColor: this.$store.state.app.customColor,

      addCarBrandListValueId: "", //车品牌的默认值
      addCarBrandList: [],
      keyword: "",
      //活动管理编辑数据
      currentPage: 1,
      page_count: 1,
      listLoading: false,
      tableData: [],
      currentItem: {
        id: 0,
      },
      showDelete: false,
      showVehicleManager: false,
      carTypeInfo: {
        parent_id: "",
        name: "",
      },
      delete_id: "",
      delete_sequence: "",
      import_flag:0
    };
  },
  mounted() {
    this.$nextTick(() => {
      document.documentElement.style.minWidth = "1300px";
    });
  },
  created() {
    this.getTableDataList();
    this.$api.addVehicleBrandList().then((data) => {
      this.addCarBrandList = data.data;
    });
  },
  methods: {
    importSure() {
      this.showProcessImportSuccess = false;
    },
    beforeUpload(file) {
      if(this.import_flag != 1){
          this.$sfMessage.error("抱歉，当前用户没有操作权限");
          return false;
      }
      this.showProcessImport = true;
      const extension = file.name.split(".")[1] === "xls";
      const extension2 = file.name.split(".")[1] === "xlsx";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!extension && !extension2) {
        this.$message.warning("上传文件只能是 xls、xlsx格式!");
        return;
      }
      if (!isLt2M) {
        this.$message.warning("上传文件大小不能超过 2M!");
        return;
      }
      return true; // 返回false不会自动上传
    },
    importCar(res) {
      if (this.percentage == 100) {
        if (res.code == 1) {
          this.showProcessImport = false;
          this.showProcessImportSuccess = true;
          this.importWord = res.data.total;
          this.importWordSuccess = res.data.succ;
          this.importWordFail = res.data.fail;
        }
      }
    },
    //进度条导入进度
    format(percentage) {
      return percentage === 100 ? "满" : `${percentage}%`;
    },
    progressUpload(event) {
      this.percentage = event.percent;
      if (this.percentage >= 100) {
        this.percentage = 100;
        let a = setTimeout(() => {
          clearTimeout(a)
        }, 500); 
      }
    },

    handleBackAc() {
      this.$router.push({ path: "/vehicle/car" });
    },
    //重置输入框
    searchReset() {
      this.keyword = "";
      this.currentPage = 1;
      this.getTableDataList();
    },
    //搜索关键字
    searchResultAc() {
      this.currentPage = 1;
      this.$api
        .getVehicleType({
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
    getTableDataList() {
      this.listLoading = true;
      this.$api
        .getVehicleType({ search: this.keyword, page: this.currentPage })
        .then((data) => {
          this.listLoading = false;
          if (data.code == 1) {
            this.import_flag = data.data.is_import
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
      this.carTypeInfo = {
        parent_id: "",
        name: "",
      };
      this.showVehicleManager = true;
    },
    handleEdit(row) {
      this.currentItem.id = 1;
      this.showVehicleManager = true;
      this.addCarBrandListValueId = row.parent_id;
      this.carTypeInfo = {
        parent_id: row.parent_id,
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
      this.carTypeInfo.parent_id = this.addCarBrandListValueId;
      if (!this.carTypeInfo.name) {
        this.$sfNotify({
          duration: 0,
          type: "error",
          message: "请上传车型",
        });
        return false;
      }
      if (!this.carTypeInfo.parent_id) {
        this.$sfNotify({
          duration: 0,
          type: "error",
          message: "请上传车品牌",
        });
        return false;
      }
      if (id == 0) {
        // 添加
        this.$api.addVehicleType(this.carTypeInfo).then((data) => {
          if (data.code == 1) {
            this.showVehicleManager = false;
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
        this.$refs["carTypeInfo"].validate((valid) => {
          if (valid) {
            this.$api.editVehicleType(this.carTypeInfo).then((data) => {
              if (data.code == 1) {
                this.showVehicleManager = false;
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

    changeActStatus(item, index) {
      let status = item.status == 1 ? 0 : 1;
      this.$api
        .changeAdvertStatus({ id: item.id, status: status })
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
@import "../../assets/css/vehicle/carTypeManager.scss";
</style>
