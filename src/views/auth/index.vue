<template>
  <section>
    <div class="section-title">APP管理</div>
    <div class="section-amount">
      <div class="amount-right">
        <div class="amount-item-inner clearfix">
          <div class="amount-item">
            <div class="amount-item-title">接入ID</div>
            <p class="amount-item-text">
              <span>{{ auth_info.auth_id }}</span>
            </p>
          </div>
          <div class="amount-item">
            <div class="amount-item-title">接入token</div>
            <p class="amount-item-text">
              <span>{{ auth_info.auth_token }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="section-container">
      <div class="section-item-header clearfix">
        <span>APP配置</span>
        <span class="section-tips"
          >*
          注意：APP下载页面将用于扫码下载、组队活动邀请、邀请好友多个功能，未配置功能无法正常使用</span
        >
        <div class="btn_recovery add-coupon" @click="handleThird()">
          第三方登录授权
        </div>
      </div>
      <div class="section-main">
        <div class="section-item">
          APP下载页面：<span class="section-edit"
            ><router-link to="/auth/index/download">编辑</router-link></span
          >
        </div>
        <div class="section-item">
          组队活动页面：<span class="section-edit"
            ><router-link to="/auth/index/exercise">编辑</router-link></span
          >
        </div>
        <div class="section-item">
          邀请好友页面：<span class="section-edit"
            ><router-link to="/auth/index/invite">编辑</router-link></span
          >
        </div>
        <div class="section-item">
          客服电话：<span class="section-edit" @click="showServicePhone"
            >编辑</span
          >
        </div>
        <div class="section-item">
          常见问题页面：<span class="section-edit"
            ><router-link to="/auth/index/question">编辑</router-link></span
          >
        </div>
        <div class="section-item">
          隐私政策页面：<span class="section-edit"
            ><router-link to="/auth/index/privacy">编辑</router-link></span
          >
        </div>
        <div class="section-item">
          用户使用协议页面：<span class="section-edit"
            ><router-link to="/auth/index/agreement">编辑</router-link></span
          >
        </div>
        <div class="section-item" style="display: flex; align-items: center">
          停止充电验证码开关：<span class="section-edit">
            <div
              class="header-knob"
              style="display: flex; flex-direction: row; align-items: center"
            >
              <div
                :class="['knob', appStopCodeIsShow == 1 ? 'started' : '']"
                @click="changeStatus(appStopCodeIsShow)"
              ></div>
              <div
                class="knob-text"
                :style="{ color: appStopCodeIsShow == 1 ? '' : '#999' }"
              >
                {{ appStopCodeIsShow == 1 ? "启用" : "停用" }}
              </div>
            </div>
          </span>
        </div>
      </div>
    </div>
    <!-- APP 第三方登录授权 -->
    <sf-modelBox
      class="third-switch"
      :showModel.sync="showThirdAuth"
      title="第三方登录接入授权"
      @change="saveThirdAuth"
    >
      <el-form :model="thirdInfo" ref="thirdInfo">
        <div class="third-title">授权信息</div>
        <div class="third-box">
          <div class="third-list">
            <div class="third-box-title">微信登陆</div>
            <div class="third-box-content">
              <div class="box-list">
                <div class="box-left">接入ID</div>
                <div class="box-right">
                  <el-form-item prop="name">
                    <el-input
                      v-model="thirdInfo['2'].oauth_id"
                      placeholder="请输入接入ID"
                    />
                  </el-form-item>
                </div>
              </div>
              <div class="box-list">
                <div class="box-left">接入token</div>
                <div class="box-right">
                  <el-form-item prop="name">
                    <el-input
                      v-model="thirdInfo['2'].oauth_secret"
                      placeholder="请输入接入token"
                    />
                  </el-form-item>
                </div>
              </div>
            </div>
          </div>
          <div class="third-list">
            <div class="third-box-title">微信小程序</div>
            <div class="third-box-content">
              <div class="box-list">
                <div class="box-left">接入ID</div>
                <div class="box-right">
                  <el-form-item prop="name">
                    <el-input
                      v-model="thirdInfo['3'].oauth_id"
                      placeholder="请输入接入名称"
                    />
                  </el-form-item>
                </div>
              </div>
              <div class="box-list">
                <div class="box-left">接入token</div>
                <div class="box-right">
                  <el-form-item prop="name">
                    <el-input
                      v-model="thirdInfo['3'].oauth_secret"
                      placeholder="请输入接入token"
                    />
                  </el-form-item>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-form>
    </sf-modelBox>
    <!-- 添加企业 -->
    <sf-modelBox
      :showModel.sync="showAddCompany"
      title="添加接入信息"
      @change="saveCompanyInfo"
    >
      <el-form :model="companyInfo" ref="companyInfo" :rules="dataRules">
        <div class="box-list">
          <div class="box-left">接入名称</div>
          <div class="box-right">
            <el-form-item prop="name">
              <el-input
                v-model="companyInfo.name"
                placeholder="请输入接入名称"
              />
            </el-form-item>
          </div>
        </div>
      </el-form>
    </sf-modelBox>
    <!-- 删除 -->
    <sf-modelBox
      :showModel.sync="showDeleteInfo"
      title="删除确认"
      type="delete"
      @change="saveDeleteSure"
    >
      <p style="margin-bottom: 16px" v-if="delete_app">
        注意：删除已授权的APP，该APP应用将无法使用！
      </p>
      <p style="margin-bottom: 16px" v-if="delete_dev">
        注意：删除已授权桩企，该桩企下所有设备将无法使用！
      </p>
      <el-form :model="resetInfo" ref="resetInfo" :rules="deleteRules">
        <div class="box-list">
          <div class="box-left">登录密码</div>
          <div class="box-right">
            <el-form-item prop="password">
              <el-input
                type="password"
                v-model="resetInfo.password"
                placeholder="请输入登录密码"
              />
            </el-form-item>
          </div>
        </div>
      </el-form>
    </sf-modelBox>

    <!--编辑客服电话 -->
    <sf-modelBox
      class="third-switch service-phone-model"
      :showModel.sync="showTelephone"
      title="客服电话"
      @change="saveTelephone"
    >
      <el-form ref="thirdInfo">
        <div class="third-title service_phone">
          客服电话将展示在APP联系客服信息内。
        </div>
        <div class="third-box service_phone_box">
          <div class="third-list">
            <div class="third-box-content">
              <div class="box-list">
                <div class="box-left">客服电话</div>
                <div class="box-right">
                  <el-form-item prop="name">
                    <el-input
                      v-model="service_phone"
                      placeholder="请输入客服电话"
                    />
                  </el-form-item>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-form>
    </sf-modelBox>

    <!--充电停止验证码 -->
    <sf-modelBox
      class="third-switch service-phone-model"
      :showModel.sync="isAppStopCodeIsShow"
      :title="appStopCodeIsShow == 0 ? '开启确认' : '关闭确认'"
      @change="saveChangeStatus"
    >
      <p>
        确认{{ appStopCodeIsShow == 0 ? "开启" : "关闭" }}输入验证码停止充电吗？
      </p>
    </sf-modelBox>
  </section>
</template>

<script>
export default {
  data() {
    return {
      appStopCodeIsShow: 0, //停止充电验证码
      isAppStopCodeIsShow: false, //停止充电验证码
      modelObj: {
        name: "",
        auth_type: "",
      },
      auth_info: {
        auth_id: "",
        auth_token: "",
      },
      pay_type: 2,
      currentPage: 1,
      page_count: 1,
      tableData: [],
      showAddCompany: false,
      showDeleteInfo: false,
      companyInfo: {
        name: "",
        type: "2",
        credit_code: "",
      },
      dataRules: {
        name: [
          { required: true, message: "* 请输入接入名称", trigger: "blur" },
        ],
        credit_code: [
          { required: true, message: "* 请输入组织机构代码", trigger: "blur" },
          { min: 9, max: 9, message: "* 长度应为9个字符", trigger: "blur" },
        ],
      },
      listLoading: false,
      auth_type_array: {
        1: "设备",
        2: "APP",
        3: "WEB",
      },
      delete_id: "",
      delete_dev: false,
      delete_app: false,
      resetInfo: {
        id: "",
        password: "",
      },
      balanceInfo: {
        amount: "",
      },
      deleteRules: {
        password: [
          { required: true, message: "* 请输入登录密码", trigger: "blur" },
        ],
      },
      showThirdAuth: false,
      thirdInfo_array: {
        1: "设备",
        2: "APP",
        3: "WEB",
      },
      thirdInfo: {
        1: { oauth_id: "", oauth_secret: "" },
        2: { oauth_id: "", oauth_secret: "" },
        3: { oauth_id: "", oauth_secret: "" },
      },
      third_auth_id: "",
      showTelephone: false,
      service_phone: "",
    };
  },
  created() {
    this.getTableDataList();
    this.getAppStopCodeList();
  },
  methods: {
    // 是否停止充电验证码
    changeStatus(val) {
      this.isAppStopCodeIsShow = true;
    },
    getAppStopCodeList() {
      this.$api.getPcConfig({}).then((data) => {
        if (data.code == 1) {
          this.appStopCodeIsShow = data.data.app_stop_code_show;
        }
      });
    },
    saveChangeStatus() {
      this.appStopCodeIsShow = (this.appStopCodeIsShow == 1) ? 0 : 1;
      this.$api
        .changeAppStopCode({app_stop_code_show: this.appStopCodeIsShow})
        .then((data) => {
          if (data.code == 1) {
            this.$sfNotify({
              message: "成功",
            });
            this.isAppStopCodeIsShow = false;
            this.getAppStopCodeList();
          } else {
            this.$sfNotify({
              duration: 0,
              type: "error",
              message: data.message || '失败',
            });
          }
        });
    },
    getTableDataList() {
      this.listLoading = true;
      this.modelObj.page = this.currentPage;
      this.$api.authList(this.modelObj).then((data) => {
        this.listLoading = false;
        if (data.code == 1) {
          this.auth_info = data.data;
        }
      });
    },
    searchPile() {
      this.currentPage = 1;
      this.getTableDataList();
    },
    resetSearch() {
      this.modelObj.name = "";
      this.modelObj.auth_type = "";
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
    handleAdd() {
      this.companyInfo.name = "";
      this.companyInfo.type = "2";
      this.companyInfo.credit_code = "";
      this.showAddCompany = true;
    },
    handleDelete(auth_info) {
      // 初始化
      this.resetInfo.id = "";
      this.resetInfo.password = "";
      this.delete_app = false;
      this.delete_dev = false;

      this.resetInfo.id = auth_info.id;
      if (auth_info.auth_type == 1) {
        this.delete_dev = true;
        this.delete_app = false;
      }
      if (auth_info.auth_type == 2) {
        this.delete_dev = false;
        this.delete_app = true;
      }
      this.showDeleteInfo = true;
    },
    saveCompanyInfo() {
      this.$refs["companyInfo"].validate((valid) => {
        if (valid) {
          let params = {
            name: this.companyInfo.name,
            type: this.companyInfo.type,
          };
          if (this.companyInfo.type == 1) {
            params.credit_code = this.companyInfo.credit_code;
          }
          this.$api.authCreate(params).then((data) => {
            this.showAddCompany = false;
            if (data.code == 1) {
              this.$sfNotify({
                message: "成功",
              });
              setTimeout(this.getTableDataList, 1500);
            } else {
              this.$sfNotify({
                duration: 0,
                type: "error",
                message: data.message,
              });
            }
          });
        } else {
        }
      });
    },
    // 确认删除
    saveDeleteSure() {
      this.$refs["resetInfo"].validate((valid) => {
        if (valid) {
          this.$api.authDelete(this.resetInfo).then((data) => {
            this.delete_id = "";
            this.showDeleteInfo = false;
            if (data.code == 1) {
              this.$sfNotify({
                message: "成功",
              });
              setTimeout(this.getTableDataList, 1500);
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
    },
    //第三方登录授权
    getThirdList(id) {
      this.$api.authThirdList({ auth_id: id }).then((data) => {
        if (data.code == 1) {
          this.thirdInfo = data.data;
        } else {
          this.$sfNotify({
            duration: 0,
            type: "error",
            message: data.message,
          });
        }
      });
    },
    saveThirdAuth() {
      this.$refs["thirdInfo"].validate((valid) => {
        if (valid) {
          let arr = [];
          arr[1] = this.thirdInfo["1"];
          arr[2] = this.thirdInfo["2"];
          arr[3] = this.thirdInfo["3"];
          let params = {
            auth_id: this.third_auth_id,
            third_info: arr,
          };
          this.$api.authThirdCreate(params).then((data) => {
            this.showThirdAuth = false;
            if (data.code == 1) {
              this.$sfNotify({
                message: "成功",
              });
              setTimeout(this.getTableDataList, 1500);
            } else {
              this.$sfNotify({
                duration: 0,
                type: "error",
                message: data.message,
              });
            }
          });
        } else {
        }
      });
    },
    handleThird() {
      this.showThirdAuth = true;
      this.third_auth_id = this.auth_info.auth_id;
      this.getThirdList(this.auth_info.auth_id);
    },
    saveTelephone() {
      this.$api
        .saveServicePhone({ service_phone: this.service_phone })
        .then((data) => {
          this.showTelephone = false;
          if (data.code == 1) {
            this.$sfNotify({
              message: "成功",
            });
          } else {
            this.$sfNotify({
              duration: 0,
              type: "error",
              message: data.message,
            });
          }
        });
    },
    showServicePhone() {
      this.showTelephone = true;
      var that = this;
      //获取服务电话
      this.$api.getPcConfig({}).then((res) => {
        if (res.code == 1) {
          that.service_phone = res.data.service_phone;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/auth/index.scss";
</style>
