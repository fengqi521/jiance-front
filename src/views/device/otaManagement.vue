<template>
  <section class="section-ota">
    <div class="section-title">OTA管理</div>
    <!-- 搜索条件 -->
    <div class="section-search">
      <div class="section-item-header clearfix"><span>筛选查询</span></div>
      <div class="header-content clearfix">
        <div class="content-item">
          <div class="header-left">桩企名称</div>
          <div class="header-right">
            <el-select v-model="searchData.enterprise_authid">
              <el-option label="全部" value="" />
              <el-option
                v-for="(item, index) in pileLists"
                :key="index"
                style="width: 148px"
                :label="item.title"
                :value="item.id"
              />
            </el-select>
          </div>
        </div>
        <div class="content-item">
          <div class="header-left">固件名称</div>
          <div class="header-right">
            <el-input
              class="search-input"
              v-model="searchData.ota_name"
              placeholder="输入固件名称"
            />
          </div>
        </div>
        <div class="content-item">
          <div class="btn_succ" @click="getFirmWareLists(1)">查询</div>
          <div class="btn_cancel" @click="resetSearchData()">重置</div>
        </div>
      </div>
    </div>
    <!-- table表格 -->
    <div class="section-container">
      <div class="section-item-header clearfix">
        <span>固件列表</span>
        <div class="btn_recovery upload" @click="showModel">上传固件</div>
      </div>
      <div class="section-main">
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td table-column__1">桩企名称</div>
            <div class="table-td">固件名称</div>
            <div class="table-td">固件版本</div>
            <div class="table-td">上传时间</div>
            <div class="table-td" style="min-width: 160px">固件描述</div>
            <div class="table-td">升级成功次数</div>
            <div class="table-td">升级失败次数</div>
            <div class="table-td" style="min-width: 110px">操作</div>
          </div>
          <div class="table-body" v-loading="listLoading">
            <div
              class="table-tr"
              v-show="firmWareLists && firmWareLists.length"
              v-for="(fault, index) in firmWareLists"
              :key="index"
            >
              <div class="table-td table-column__1">
                <div class="td-item">
                  {{
                    fault.enterprise_authid_name
                      ? fault.enterprise_authid_name
                      : "--"
                  }}
                </div>
              </div>
              <div class="table-td">
                <div class="td-item">
                  {{ fault.ota_name ? fault.ota_name : "--" }}
                </div>
              </div>
              <div class="table-td">
                <div class="td-item">
                  {{ fault.ota_bin_ver ? fault.ota_bin_ver : "--" }}
                </div>
              </div>
              <div class="table-td">
                <div class="td-item td-time">
                  {{ fault.create_time ? fault.create_time : "--" }}
                </div>
              </div>
              <div class="table-td" style="min-width: 160px">
                <div class="td-item limit-td">
                  <el-tooltip
                    :content="fault.ota_bin_desc"
                    v-if="fault.ota_bin_desc"
                    placement="top"
                  >
                    <span>{{
                      fault.ota_bin_desc ? fault.ota_bin_desc : "--"
                    }}</span>
                  </el-tooltip>
                  <span v-else>{{
                    fault.ota_bin_desc ? fault.ota_bin_desc : "--"
                  }}</span>
                </div>
              </div>
              <div class="table-td">
                <div class="td-item">
                  {{
                    fault.update_success_num ? fault.update_success_num : "--"
                  }}
                </div>
              </div>
              <div class="table-td">
                <div class="td-item">
                  {{ fault.update_fail_num ? fault.update_fail_num : "--" }}
                </div>
              </div>
              <div class="table-td" style="min-width: 110px">
                <div class="td-item">
                  <router-link
                    v-if="updateOta"
                    target="_blank"
                    :to="{
                      path: '/device/ota/update',
                      query: { ota_name: fault.ota_name },
                    }"
                    >升级</router-link
                  >
                  <div @click="notPermission" v-else>升级</div>
                  <router-link
                    style="margin-left: 8px"
                    v-if="viewOta"
                    target="_blank"
                    :to="{
                      path: '/device/ota/record',
                      query: { ota_name: fault.ota_name },
                    }"
                    >升级记录</router-link
                  >
                  <div style="margin-left: 8px" @click="notPermission" v-else>
                    升级记录
                  </div>
                </div>
              </div>
            </div>
            <div
              class="table-tr unData"
              v-if="!firmWareLists || firmWareLists.length === 0"
            >
              <img :src="require('assets/img/unData.png')" />
              <span>暂无数据</span>
            </div>
          </div>
          <!-- 分页 -->
          <sf-pagination
            v-show="firmWareLists && firmWareLists.length"
            :currentPage="currentPage"
            :page-count="pageTotal"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
    <!-- 上传固件 -->
    <sf-modelBox
      class="vehicle-box"
      :showModel.sync="showUploadModel"
      title="上传固件"
      @change="uploadFirmWare"
    >
      <el-form :model="firmWareInfo" ref="firmWareInfo" :rules="dataRules">
        <div class="section-list">
          <div class="box-list">
            <div class="box-left">桩企名称</div>
            <div class="box-right">
              <el-form-item prop="enterprise_authid">
                <el-select
                  style="width: 100%"
                  v-model="firmWareInfo.enterprise_authid"
                  placeholder="请选择桩企名称"
                >
                  <el-option
                    v-for="(item, index) in pileLists"
                    :key="index"
                    style="width: 100%"
                    :label="item.title"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </div>
          </div>
          <div class="box-list">
            <div class="box-left">固件名称</div>
            <div class="box-right">
              <el-form-item prop="ota_name">
                <el-input
                  class="account-input"
                  v-model="firmWareInfo.ota_name"
                  placeholder="最长32字符， 不支持中文"
                />
              </el-form-item>
            </div>
          </div>
          <div class="box-list">
            <div class="box-left">固件版本</div>
            <div class="box-right">
              <el-form-item prop="ota_bin_ver">
                <el-input
                  class="account-input"
                  v-model="firmWareInfo.ota_bin_ver"
                  placeholder="请输入固件版本"
                />
              </el-form-item>
            </div>
          </div>
          <div class="box-list">
            <div class="box-left">固件描述</div>
            <div class="box-right">
              <el-form-item prop="ota_bin_desc">
                <el-input
                  style="height: 96px"
                  class="account-input"
                  type="textarea"
                  v-model="firmWareInfo.ota_bin_desc"
                  placeholder="可填写描述信息，最长128字符"
                />
              </el-form-item>
            </div>
          </div>
          <div class="box-list">
            <div class="box-left" style="white-space: nowrap">选择文件</div>
            <div class="box-right" style="width: 260px">
              <el-form-item
                class="ota-upload-view"
                prop="ota_bin_url"
                style="width: 100%"
              >
                <el-upload
                  class="box-upload"
                  action="#"
                  :http-request="beforeUpload"
                  :show-file-list="false"
                  :on-change="handleChange"
                >
                  浏览...
                </el-upload>
                <div class="upload-progress" v-if="uploadStatus">
                  <div
                    class="upload-list"
                    v-for="(list, index) in fileList"
                    @mouseenter="enter"
                    @mouseleave="level"
                    :key="index"
                  >
                    <div class="upload-list-left">
                      <img
                        class="list-icon"
                        :src="require('assets/img/ota-upload-file.png')"
                      />
                      <span
                        class="list-name"
                        :class="
                          uploadStatus === fileUploadStatus['upload_error'] &&
                          'list-name-error'
                        "
                        >{{ list.name }}</span
                      >
                    </div>
                    <img
                      v-if="uploadStatus === fileUploadStatus['upload_error']"
                      class="list-icon list-right-icon"
                      :src="require('assets/img/ota-upload-update.png')"
                      @click="beforeUpload({ file: list })"
                    />
                    <img
                      v-show="
                        uploadStatus !== fileUploadStatus['upload_success'] ||
                        (seen &&
                          uploadStatus !== fileUploadStatus['upload_error'] &&
                          !showProgress)
                      "
                      class="list-icon list-right-icon"
                      @click="handleRemove"
                      :src="require('assets/img/ota-upload-fail.png')"
                    />
                    <img
                      v-if="
                        uploadStatus === fileUploadStatus['upload_success'] &&
                        showProgress
                      "
                      class="list-icon list-right-icon"
                      :src="require('assets/img/ota-upload-succ.png')"
                    />
                  </div>
                  <el-progress
                    v-if="showProgress"
                    :percentage="progress"
                    :show-text="false"
                    :stroke-width="2"
                    :color="
                      (uploadStatus === fileUploadStatus['upload_error'] &&
                        '#FF6632') ||
                      customColor
                    "
                  ></el-progress>
                </div>
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>
    </sf-modelBox>
  </section>
</template>

<script>
export default {
  data() {
    const validateOtaName = async (rule, value, callback) => {
      if (value) {
        const boolean = /[\u4e00-\u9fa5]+/.test(value);
        if (boolean) {
          return callback(new Error("* 不支持中文"));
        }

        callback();
      }
    };
    const validateOtaVer = async (rule, value, callback) => {
      if (value) {
        const ruleResult = /^\d+(\.\d+)+$/.test(value);
        if (!ruleResult) {
          return callback(
            new Error('* 固件版本格式限定为"数字"和"."，如"1.10"')
          );
        } else {
          callback();
        }
      }
    };

    const validateFile = async (rule, value, callback) => {
      const { ota_bin_url, ota_bin_filename, ota_bin_size, crc_value } =
        this.firmWareInfo;
      if (!ota_bin_url || !ota_bin_size || !crc_value || !ota_bin_filename) {
        if (!this.uploadStatus) return callback(new Error("* 请上传固件包"));
        else if (this.uploadStatus === this.fileUploadStatus["on_pendding"])
          return callback(new Error("* 固件包上传中"));
        else if (this.uploadStatus === this.fileUploadStatus["upload_error"])
          return callback(new Error("* 固件包上传失败"));
      } else {
        callback();
      }
    };

    this.fileUploadStatus = {
      not_start: 0, //未开始
      on_pendding: 1, //进行中
      upload_error: 2, //上传失败
      upload_success: 3, //上传成功
    };
    return {
      customColor: this.$store.state.app.customColor,
      pileLists: [], //桩企列表
      fileList: [],
      searchData: {
        //搜索条件
        enterprise_authid: "",
        ota_name: "",
      },
      firmWareInfo: {
        enterprise_authid: "",
        ota_name: "",
        ota_bin_ver: "",
        ota_bin_desc: "",
        ota_bin_url: "",
        ota_bin_filename: "",
        ota_bin_size: "",
        crc_value: "",
      },
      firmWareLists: [], //固件列表
      showUploadModel: false, //model框状态
      listLoading: false, //进度
      currentPage: 1, //当前页数
      pageTotal: 1, //总页数
      addOta: false,
      viewOta: false,
      updateOta: false,
      uploadUrl: "big/",
      length: 2097152,
      start: 0,
      end: 2097152,
      total_blob_num: 0,
      blob_num: 1,
      save_name: "",
      uploadStatus: 0,
      mean_value: 0,
      progress: 0,
      instance: null,
      fileList: [],
      showProgress: true,
      seen: false,
      num: 0,
      date: 0,
      dataRules: {
        enterprise_authid: [
          { required: true, message: "* 桩企名称不可为空", trigger: "change" },
        ],
        ota_name: [
          { required: true, message: "* 固件名称不可为空", trigger: "blur" },
          { max: 32, message: "* 最长输入32个字符!", trigger: "blur" },
          { validator: validateOtaName, trigger: "blur" },
        ],
        ota_bin_ver: [{ validator: validateOtaVer, trigger: "blur" }],
        ota_bin_desc: [
          {
            max: 128,
            message: "* 超过长度限制，描述最长可为128字符!",
            trigger: "blur",
          },
        ],
        ota_bin_url: [{ validator: validateFile, trigger: "change" }],
      },
    };
  },
  created() {
    this.getPileLists();
    this.getFirmWareLists();
  },
  watch: {
    showUploadModel(flag) {
      if (!flag) {
        if (this.cancel) {
          this.uploadStatus = this.fileUploadStatus["not_start"];
          this.cancel();
        }
      }
    },

    uploadStatus(val) {
      if (val && val === this.fileUploadStatus["upload_success"]) {
        setTimeout(() => {
          this.showProgress = false;
        }, 3000);
      }
    },
  },
  methods: {
    enter: function () {
      this.seen = true;
    },

    level: function () {
      this.seen = false;
    },
    //获取桩企下拉列表
    getPileLists: function () {
      this.$api
        .getPileListData({})
        .then((res) => {
          const { data = [] } = res;
          this.pileLists = data;
        })
        .catch((error) => {
          console.error(error);
        });
    },

    //获取固件列表
    getFirmWareLists: function (page) {
      this.listLoading = true;
      if (page) this.currentPage = page;
      const params = Object.assign({}, this.searchData, {
        page: this.currentPage,
      });

      this.$api
        .getFirmWareListData(params)
        .then((res) => {
          let { code } = res;
          this.listLoading = false;
          if (code === 1) {
            const {
              data: {
                current_page,
                list,
                page_total,
                add_oat_rule,
                oat_log_rule,
                oat_update_rule,
              },
            } = res;
            this.firmWareLists = list;
            this.currentPage = current_page;
            this.pageTotal = page_total;
            this.addOta = add_oat_rule;
            this.viewOta = oat_log_rule;
            this.updateOta = oat_update_rule;
          }
        })
        .catch((error) => {
          console.error(error);
          this.listLoading = false;
        });
    },

    //重置搜索条件
    resetSearchData: function () {
      this.searchData = {
        enterprise_authid: "",
        ota_name: "",
      };
      this.currentPage = 1;
      this.pageTotal = 1;
      this.getFirmWareLists();
    },

    // 点击分页触发
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getFirmWareLists();
    },
    //model框显示
    showModel: function () {
      if (!this.addOta) {
        this.$sfMessage.error("抱歉，当前用户没有操作权限");
        return;
      }
      this.firmWareInfo = {
        enterprise_authid: "",
        ota_name: "",
        ota_bin_ver: "",
        ota_bin_desc: "",
        ota_bin_url: "",
        ota_bin_filename: "",
        ota_bin_size: "",
        crc_value: "",
      };
      this.fileList = [];
      this.uploadStatus = this.fileUploadStatus["not_start"];
      this.showUploadModel = true;
    },
    //删除固件
    handleRemove: function () {
      this.fileList = [];
      this.uploadStatus = this.fileUploadStatus["not_start"];
      this.clearUploadParams();
      if (this.cancel) {
        this.cancel();
      }
    },
    //清除参数
    clearUploadParams: function () {
      this.firmWareInfo.ota_bin_url = "";
      this.firmWareInfo.ota_bin_filename = "";
      this.firmWareInfo.ota_bin_size = "";
      this.firmWareInfo.crc_value = "";
    },
    //上传固件
    uploadFirmWare: function () {
      this.$refs["firmWareInfo"].validate((valid) => {
        if (valid) {
          this.$api.saveFirmWareData(this.firmWareInfo).then((data) => {
            const { code } = data;
            if (code == 1) {
              this.showUploadModel = false;
              this.$sfNotify({
                message: "成功",
              });
              this.currentPage = 1;
              setTimeout(this.getFirmWareLists, 2000);
            } else {
              this.$sfNotify({
                duration: 0,
                type: "error",
                message: data.message,
              });
            }
          });
        } else {
          return false;
        }
      });
    },

    //权限判断
    notPermission: function () {
      this.$sfMessage.error("抱歉，当前用户没有操作权限");
    },

    //分片上传
    beforeUpload({ file }) {
      const { on_pendding, upload_error } = this.fileUploadStatus;
      this.date = new Date().getTime();
      if (this.cancel) this.cancel();
      this.clearUploadParams();
      this.num = 0;
      this.start = 0;
      this.end = 2097152;
      this.blob_num = 1;
      this.uploadStatus = on_pendding;
      this.progress = 0;
      this.showProgress = true;
      this.save_name = "";
      this.fileList = [file];
      if (file && !file.size) {
        this.$message({ message: "不能上传空文件", type: "warning" });
        this.uploadStatus = upload_error;
        this.progress = 100;
        return;
      }
      this.firmWareInfo.ota_bin_filename = file.name;

      this.total_blob_num = Math.ceil(file.size / this.length);
      this.mean_value = Math.floor(100 / this.total_blob_num);
      this.uploadZip({ file, date: this.date });
    },
    uploadZip({ file, date }) {
      const { upload_error, upload_success } = this.fileUploadStatus;
      let blob = this.cutFile(file);
      let params = this.formatData(blob, file);
      if (!this.instance) {
        this.instance = axios.create({
          withCredentials: true,
        });
      }
      let CancelToken = axios.CancelToken;
      let self = this;
      this.instance
        .post(this.uploadUrl, params, {
          cancelToken: new CancelToken(function executor(c) {
            self.cancel = c;
          }),
        })
        .then((res) => {
          let data = res.data;
          this.num = 0;
          if (data.code == 1) {
            this.save_name = data.save_name;
            this.$message({
              message:
                "共有 " +
                this.total_blob_num +
                " 个分片，第 " +
                this.blob_num +
                " 个分片上传成功！",
              type: "success",
            });
            this.progress = this.mean_value * this.blob_num;

            this.blob_num += 1;
            this.uploadZip({ file, date });
          } else if (data.code == 2) {
            const { path, size, crc_value } = data;
            this.firmWareInfo.ota_bin_url = path;
            this.firmWareInfo.crc_value = crc_value;
            this.firmWareInfo.ota_bin_size = size;
            this.progress = 100;
            this.$message({
              message:
                "共有 " +
                this.total_blob_num +
                " 个分片，第 " +
                this.blob_num +
                " 个分片上传成功！",
              type: "success",
            });
            if (
              path &&
              crc_value &&
              size &&
              this.firmWareInfo.ota_bin_filename
            ) {
              this.$refs["firmWareInfo"].clearValidate("ota_bin_url");
            }
            this.uploadStatus = upload_success;
          } else {
            this.clearUploadParams();
            this.progress = 100;
            this.$message({ message: "上传失败", type: "error" });
            this.uploadStatus = upload_error;
          }
        })
        .catch((error) => {
          if (!this.uploadStatus || this.date !== date) return;
          if (this.num < 4) {
            this.end = this.start;
            this.start = this.start - this.length;
            this.num++;
            this.uploadZip({ file, date });
            return;
          }
          this.num = 0;
          this.progress = 100;
          this.uploadStatus = upload_error;
        });
    },
    cutFile(file) {
      let file_blob = file.slice(this.start, this.end);
      this.start = this.end;
      this.end = this.start + this.length;
      return file_blob;
    },
    formatData(blob, file) {
      let formData = new FormData();
      formData.append("file", blob);
      formData.append("blob_num", this.blob_num);
      formData.append("total_blob_num", this.total_blob_num);
      formData.append("file_name", file.name);
      formData.append("save_name", this.save_name);
      return formData;
    },

    //上传文件数量限制
    handleChange(files, fileLists) {
      this.fileList = fileLists.splice(fileLists.length - 1);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/device/otaManagement.scss";
</style>
