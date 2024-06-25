<template>
  <section>
    <div class="section-title">资产管理</div>
    <div class="section-tips">
      <i class="warning-icon"></i>
      <span class="tips-text"
        >注意：资产管理主要是设备白名单管理，只有白名单的设备才能接入平台</span
      >
    </div>
    <div class="section-amount">
      <div class="amount-left">
        <i class="basic-icon"></i>
        <p class="version-text">基础版</p>
      </div>
      <div class="amount-right">
        <div class="amount-item-inner clearfix">
          <div class="amount-item">
            <div class="amount-item-title">最大授权设备数量</div>
            <p class="amount-item-text">
              <span class="amount-item-number">{{ max_amount }}</span
              >台
            </p>
          </div>
          <div class="amount-item">
            <div class="amount-item-title">现有启用设备数量</div>
            <p class="amount-item-text">
              <span class="amount-item-now">{{ current_amount }}</span
              >台
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="section-header">
      <div class="section-item-header clearfix">
        <span>筛选查询</span>
      </div>
      <div class="header-content clearfix">
        <div class="content-item">
          <div class="header-left">桩企名称</div>
          <div class="header-right">
            <el-select v-model="modelObj.enterprise_id">
              <el-option label="全部" value="all" />
              <el-option
                v-for="(item, index) in enterprise_list"
                :key="index"
                style="width: 148px"
                :label="item.title"
                :value="item.id"
              />
            </el-select>
          </div>
        </div>
        <div class="content-item">
          <div class="header-left">启用/停用</div>
          <div class="header-right">
            <el-select v-model="modelObj.using">
              <el-option label="全部" value="all" />
              <el-option label="启用" value="1" />
              <el-option label="停用" value="0" />
            </el-select>
          </div>
        </div>
        <div class="content-item">
          <div class="header-left">充电桩编号</div>
          <div class="header-right">
            <el-input
              class="search-input"
              v-model="modelObj.pile_sn"
              placeholder="输入充电桩编号"
            />
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
        <span>资产列表</span>
        <span
          class="btn_succ add-coupon"
          style="margin-left: 24px"
          @click="addWhiteDevice"
        >
          <i class="add-station"></i>添加资产
        </span>
        <span class="btn_recovery send-btn send-btn-car">
          <i class="add-station-out"></i>
          <!-- 批量导入 -->
          <span
            style="margin-left: 15px; font-size: 12px"
            @click="importWhiteDevice"
            >批量导入</span
          >
          <el-tooltip content="点击下载导入示例" placement="top">
            <div slot="content" style="line-height: 18px" class="hover-green">
              <a class="import-underline" :href="`${ENV}/white/demo.xls`"
                >点击下载导入示例</a
              >
              <br />第一行：充电桩编号
            </div>
            <div class="tips-icon"></div>
          </el-tooltip>
        </span>
        <router-link to="/device/asset/enterprise" class="btn_recovery send-btn"
          >桩企管理 >>
        </router-link>
      </div>
      <div class="section-main">
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td table-column__1">桩企名称</div>
            <div class="table-td table-column__1">接入ID</div>
            <div class="table-td table-column__2" style="min-width: 200px">
              充电桩编号
              <el-tooltip content="充电桩编号为设备序列号" placement="top">
                <div class="tips-icon"></div>
              </el-tooltip>
            </div>
            <div class="table-td">接入Token</div>
            <div class="table-td table-column__2">添加时间</div>
            <div class="table-td table-column__2">启用/停用</div>
            <div class="table-td table-column__3">描述</div>
            <div class="table-td table-column__2">当前运行版本</div>
            <div class="table-td table-column__1">操作</div>
          </div>
          <div class="table-body" v-loading="listLoading">
            <div
              class="table-tr"
              v-show="tableData && tableData.length"
              v-for="(asset, index) in tableData"
              :key="index"
            >
              <div class="table-td table-column__1">
                <div class="td-item">{{ asset.title }}</div>
              </div>
              <div class="table-td table-column__1">
                <div class="td-item">
                  {{ asset.auth_id ? asset.auth_id : "--" }}
                </div>
              </div>
              <div class="table-td table-column__2" style="min-width: 200px">
                <div class="td-item td-time">
                  <!--                  {{asset.pile_sn?asset.pile_sn:'&#45;&#45;'}}-->
                  <el-tooltip :content="asset.pile_sn" placement="top">
                    <span
                      style="max-width: 140px"
                      class="item-text scrollBar"
                      >{{ asset.pile_sn | pilesellipsis }}</span
                    >
                  </el-tooltip>
                </div>
              </div>
              <div class="table-td">
                <div class="td-item">
                  {{ asset.auth_token ? asset.auth_token : "--" }}
                </div>
              </div>
              <div class="table-td table-column__2">
                <div class="td-item td-time">
                  {{ asset.create_time ? asset.create_time : "--" }}
                </div>
              </div>
              <div class="table-td table-column__2">
                <div
                  :class="['knob', asset.status == 1 ? 'started' : '']"
                  @click="changeStatus(asset)"
                ></div>
                <div class="knob-text">
                  {{ asset.status == 1 ? "启用" : "停用" }}
                </div>
              </div>
              <div class="table-td table-column__3 table-operate">
                <div class="td-item">
                  <el-tooltip :content="asset.desc" placement="top">
                    <span class="td-item-text ellipsis">{{ asset.desc }}</span>
                  </el-tooltip>
                  <el-tooltip content="编辑" placement="top">
                    <span
                      class="edit-icon"
                      @click="handleEditDesc(asset)"
                    ></span>
                  </el-tooltip>
                </div>
              </div>
              <div class="table-td table-column__2">
                <div class="td-item">
                  {{ asset.current_ver ? asset.current_ver : "--" }}
                </div>
              </div>
              <div class="table-td table-column__1">
                <div class="td-item" v-if="is_ota_log">
                  <router-link
                    target="_blank"
                    :to="{
                      path: '/device/ota/record',
                      query: { pile_sn: asset.pile_sn },
                    }"
                    class="upgrade-ota"
                    >查看OTA升级记录</router-link
                  >
                </div>
                <div @click="adminOtaList" class="td-item" v-else>
                  <span class="upgrade-ota">查看OTA升级记录</span>
                </div>
              </div>
            </div>
            <div
              class="table-tr unData"
              v-if="!tableData || tableData.length === 0"
            >
              <img :src="require('assets/img/unData.png')" />
              <span>暂无数据</span>
            </div>
          </div>
          <!-- 分页 -->
          <sf-pagination
            v-show="tableData && tableData.length"
            :currentPage="currentPage"
            :page-count="page_count"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
    <!-- 编辑备注信息 -->
    <sf-modelBox
      class="editTextarea"
      :showModel.sync="showDescSure"
      title="编辑备注信息"
      @change="sureEditDesc"
    >
      <el-form :model="currItembj" ref="currItembj" :rules="currItembjRules">
        <div class="box-list">
          <div class="box-left">备注</div>
          <div class="box-right scrollBar">
            <el-form-item prop="desc">
              <el-input
                type="textarea"
                v-model="currItembj.desc"
                placeholder="填写备注信息"
              />
            </el-form-item>
          </div>
        </div>
      </el-form>
    </sf-modelBox>
    <!-- 启用确认 -->
    <sf-modelBox
      :showModel.sync="showStartSure"
      title="启用确认"
      @change="saveStopPile"
    >
      <p>是否确定启用此电桩？</p>
    </sf-modelBox>
    <!-- 停用确认 -->
    <sf-modelBox
      type="delete"
      :showModel.sync="showStopSure"
      title="停用确认"
      @change="saveStopPile"
    >
      <p>是否确定停用此电桩，停用后充电桩将直接下线？</p>
    </sf-modelBox>
    <sf-messageBox :showModel.sync="showProcessImport" title="温馨提示">
      <div class="import-process">
        <el-progress
          :show-text="false"
          :percentage="percentage"
          :color="customColor"
        ></el-progress>
      </div>
      <div class="import-word">列表正在导入，请稍等......</div>
    </sf-messageBox>
    <sf-messageBox :showModel.sync="showProcessImportSuccess">
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
        <span class="import-word">&nbsp;{{ importWord }}&nbsp;</span>
        <span class="import-common-word">条，导入成功</span>
        <span class="import-word">&nbsp;{{ importWordSuccess }}&nbsp;</span>
        <span class="import-common-word">条</span>
        <span class="import-common-word" v-if="importWordFail != 0"
          >，导入失败</span
        >
        <span v-if="importWordFail != 0" class="import-word section-no-begin"
          >&nbsp;{{ importWordFail }}&nbsp;</span
        >
        <span v-if="importWordFail != 0" class="import-common-word">条</span>
      </div>
      <div v-if="importWordFail != 0" class="import-error">
        <a :href="`${this.ENV}/assets/get-error`">点击查看详细信息 ></a>
      </div>
      <div class="box-bottom clearfix import-sure">
        <div class="btn_succ" @click="importSure">确认</div>
      </div>
    </sf-messageBox>
    <!--添加白名单列表-->
    <sf-modelBox
      class="addWhite"
      :showModel.sync="showAddWhite"
      title="添加资产"
      @change="saveWhiteDevice"
    >
      <el-form>
        <div class="box-list">
          <div class="box-left">桩企名称</div>
          <div class="box-right">
            <el-select v-model="create_enterprise_id">
              <el-option
                v-for="(item, index) in enterprise_list"
                :key="index"
                :label="item.title"
                :value="item.id"
              />
            </el-select>
          </div>
        </div>
        <div class="box-list">
          <div class="box-left">充电桩编号</div>
          <div class="box-right">
            <el-input
              v-model="create_pile_sn"
              maxlength="45"
              placeholder="请输入充电桩编号"
            />
          </div>
        </div>
      </el-form>
    </sf-modelBox>
    <!--导入白名单-->
    <sf-modelBox
      class="addWhite"
      :showModel.sync="showImportWhite"
      title="批量导入"
      @change="saveBatchDevice"
    >
      <el-form>
        <div class="box-list">
          <div class="box-left">桩企名称</div>
          <div class="box-right">
            <el-select v-model="import_enterprise_id">
              <el-option
                v-for="(item, index) in enterprise_list"
                :key="index"
                :label="item.title"
                :value="item.id"
              />
            </el-select>
          </div>
        </div>
        <div class="box-list">
          <div class="box-left">选择文件</div>
          <div class="box-right">
            <el-upload
              class="upload-demo"
              ref="upload"
              :action="`${ENV}/assets/import-excel`"
              :before-upload="beforeUpload"
              :on-success="importExcel"
              :show-file-list="false"
            >
              <el-button size="small" type="primary" class="import-note"
                >浏览...</el-button
              >
            </el-upload>
            <span class="uploaded-file-name" v-if="upload_file_origin_name"
              >({{ upload_file_origin_name }})</span
            >
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
      showAddWhite: false,
      showImportWhite: false,
      showDescSure: false,
      showStartSure: false,
      showStopSure: false,
      currItembj: {
        desc: "",
      },
      currItembjRules: {
        desc: [
          { required: true, message: "* 请输入描述信息", trigger: "blur" },
        ],
      },
      modelObj: {
        using: "all",
        enterprise_id: "all",
        pile_sn: "",
      },
      currentPage: 1,
      page_count: 1,
      max_amount: "0",
      current_amount: "0",
      already_amount: "0",
      listLoading: false,
      tableData: [],
      pile_sn_edit: "",
      //桩企下拉列表
      enterprise_list: [],
      //修改充电桩的状态
      pile_sn: "",
      pile_sn_status: "",
      //桩企的名称
      create_pile_sn: "",
      create_enterprise_id: "",
      //上传文件的名称
      upload_file_origin_name: "",
      upload_file_save_name: "",
      import_enterprise_id: "",

      //批量导入进度条
      ENV: process.env.NODE_ENV == "development" ? "/api" : "",
      showProcessImport: false, //是否显示进度条
      showProcessImportSuccess: false, //导入结束无失败
      importWord: "0", //导入的数据总条数
      importWordSuccess: "0", //成功导入的数量
      importWordFail: "0", //导入失败的数量
      percentage: 0,
      customColor: this.$store.state.app.customColor,
      import_flag: 1,
      is_ota_log: 0,
      device_status_array: {
        1: "在线",
        2: "离线",
      },
    };
  },
  created() {
    this.getBasicInfo();
    this.getTableDataList();
    this.getEnterpriseList();
  },
  filters: {
    pilesellipsis(value) {
      if (!value) return "--";
      if (value.length > 25) {
        return value.slice(0, 25) + "...";
      }
      return value;
    },
  },
  methods: {
    //获取头部基础信息
    getBasicInfo() {
      this.$api.assetBasic().then((data) => {
        if (data.code == 1) {
          this.max_amount = data.data.max_num;
          this.current_amount = data.data.cur_num;
          this.already_amount = data.data.in_num;
        }
      });
    },
    //获取白名单列表
    getTableDataList() {
      this.listLoading = true;
      this.modelObj.page = this.currentPage;
      this.$api.assetsAssets(this.modelObj).then((data) => {
        this.listLoading = false;
        if (data.code == 1) {
          this.tableData = data.data.list;
          this.currentPage = data.data.current_page;
          this.page_count = data.data.page_total;
          this.import_flag = data.data.is_import;
          this.is_ota_log = data.data.is_ota_log;
        }
      });
    },
    //获取下拉桩企
    getEnterpriseList() {
      this.$api.assetsEnterprise({}).then((data) => {
        if (data.code == 1) {
          this.enterprise_list = data.data;
        } else {
          this.enterprise_list = [];
        }
      });
    },
    searchPile() {
      this.currentPage = 1;
      this.tableData = [];
      this.getTableDataList();
    },
    resetSearch() {
      this.modelObj.enterprise_id = "all";
      this.modelObj.using = "all";
      this.modelObj.pile_sn = "";
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
    handleEditDesc(item) {
      this.currItembj.desc = item.desc;
      this.pile_sn_edit = item.pile_sn;
      this.showDescSure = true;
    },
    changeStatus(item) {
      let is_run_now = item.status;
      if (is_run_now == 1) {
        this.pile_sn = item.pile_sn;
        this.pile_sn_status = 0;
        this.showStopSure = true;
      }
      if (is_run_now == 0) {
        this.pile_sn = item.pile_sn;
        this.pile_sn_status = 1;
        this.showStartSure = true;
      }
    },
    //开启停用接口
    saveStopPile() {
      this.showStartSure = false;
      this.showStopSure = false;
      this.$api
        .assetsStatus({ pile_sn: this.pile_sn, status: this.pile_sn_status })
        .then((data) => {
          if (data.code == 1) {
            this.$sfNotify({
              message: "成功",
            });
            this.getTableDataList();
            this.getBasicInfo();
          } else {
            this.$sfNotify({
              duration: 0,
              type: "error",
              message: data.message,
            });
          }
        });
    },
    //修改描述接口
    sureEditDesc() {
      if (this.showDescSure) {
        this.$api
          .assetsDescription({
            pile_sn: this.pile_sn_edit,
            desc: this.currItembj.desc,
          })
          .then((data) => {
            if (data.code == 1) {
              this.$sfNotify({
                message: "成功",
              });
              this.getTableDataList();
            } else {
              this.$sfNotify({
                duration: 0,
                type: "error",
                message: "失败",
              });
            }
          });
      }
      this.showDescSure = false;
    },
    //保存单个白名单列表
    saveWhiteDevice() {
      if (!this.create_enterprise_id || !this.create_pile_sn) {
        this.$sfNotify({
          duration: 0,
          type: "error",
          message: "请检查桩企与设备序列号是否正确",
        });
      }
      this.$api
        .createWhiteDevice({
          pile_sn: this.create_pile_sn,
          enterprise_id: this.create_enterprise_id,
        })
        .then((data) => {
          if (data.code == 1) {
            this.$sfNotify({
              message: "成功",
            });
            this.showAddWhite = false;
            this.getBasicInfo();
            this.getTableDataList();
          } else {
            this.$sfNotify({
              duration: 0,
              type: "error",
              message: data.message,
            });
          }
        });
    },
    //保存批量白名单列表
    saveBatchDevice() {
      if (!this.import_enterprise_id || !this.upload_file_save_name) {
        this.$sfNotify({
          duration: 0,
          type: "error",
          message: "请检查桩企与文件是否正确",
        });
        return false;
      }
      this.$api
        .importWhiteDevice({
          upload_save_name: this.upload_file_save_name,
          enterprise_id: this.import_enterprise_id,
        })
        .then((data) => {
          if (data.code == 1) {
            this.showImportWhite = false;
            //导入进度开始
            this.showProcessImport = true;
            this.progressUpload(data);
          } else {
            this.$sfNotify({
              duration: 0,
              type: "error",
              message: data.message,
            });
          }
        });
    },
    //添加白名单的按钮
    addWhiteDevice() {
      this.create_pile_sn = "";
      this.create_enterprise_id = "";
      this.showAddWhite = true;
    },
    //导入白名单的按钮
    importWhiteDevice() {
      console.log(this.import_flag);
      if (!this.import_flag) {
        this.$sfMessage.error("抱歉，当前用户没有操作权限");
        return false;
      }
      this.showImportWhite = true;
      this.upload_file_save_name = "";
      this.upload_file_origin_name = "";
      this.import_enterprise_id = "";
    },
    //查看OTA升级记录
    adminOtaList() {
      console.log(this.is_ota_log);
      this.$sfMessage.error("抱歉，当前用户没有操作权限");
    },

    importSure() {
      this.showProcessImportSuccess = false;
    },
    beforeUpload(file) {
      const extension = file.name.split(".")[1] === "xls";
      const extension2 = file.name.split(".")[1] === "xlsx";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!extension && !extension2) {
        this.$message.warning("上传模板只能是 xls、xlsx格式!");
        return;
      }
      if (!isLt2M) {
        this.$message.warning("上传模板大小不能超过 2M!");
        return;
      }
      return true; // 返回false不会自动上传
    },
    importExcel(res) {
      if (res.code == 1) {
        this.upload_file_save_name = res.data.upload_file_save_name;
        this.upload_file_origin_name = res.data.upload_file_origin_name;
      } else {
        this.upload_file_save_name = "";
        this.upload_file_origin_name = "";
      }
    },
    progressUpload(res) {
      let percentage = 0;
      let a = setInterval(() => {
        if (percentage < 100) {
          this.percentage = percentage++;
        } else {
          clearInterval(a);
          this.showProcessImport = false;
          this.showProcessImportSuccess = true;
          this.importWord = res.data.total;
          this.importWordSuccess = res.data.succ;
          this.importWordFail = res.data.fail;
          this.getBasicInfo();
          this.getTableDataList();
        }
      }, 50);
    },
  },
};
</script>
<style ref="stylesheet/scss" lang="scss" scoped>
@import "../../assets/css/device/asset.scss";
</style>
