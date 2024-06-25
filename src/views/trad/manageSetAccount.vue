<template>
  <section>
    <div class="section-title">
      <span class="section-title section-title-act"
        ><router-link to="/trad/manage">分润管理</router-link></span
      >
      <span class="section-title">></span>
      <span class="section-title">设置提现账户</span>
    </div>
    <!-- 添加编辑页面  车辆 -->
    <div class="section-container activity-box">
      <div class="section-item-header clearfix">
        <span class="manager-span">
          <div class="section-header">
            <div class="section-item-header">
              <span>提现账户信息</span>
            </div>
          </div>
        </span>
      </div>
      <div class="box-outer activity-box activity-box-car" v-loading="Loading">
        <div class="section-tips">
          <i class="warning-icon"></i>
          <div class="tips-box">
            <span class="tips-text">1、按照平台支持的账户类型进行设置</span>
            <span class="tips-text"
              >2、提交后便可使用此账户，账户信息用户实际提现使用，请谨慎填写。</span
            >
          </div>
        </div>
        <div class="section-content">
          <div class="content-left">
            <el-form :model="config" ref="config" :rules="dataRules">
              <div class="section-list">
                <div class="section-left">提现方式</div>
                <div class="section-right">
                  <div class="account-type">
                    <el-form-item class="radio-outer" prop="status">
                      <el-radio
                        @change="handleCashType"
                        class="type"
                        v-model="config.withdrawl_type"
                        label="2"
                        v-if="isAlipay == 1"
                      >
                        <img :src="require('assets/img/alipay.png')" />
                        <span> 支付宝</span>
                      </el-radio>

                      <el-radio
                        @change="handleCashType"
                        class="type"
                        v-model="config.withdrawl_type"
                        label="1"
                        v-if="isWxpay == 1"
                      >
                        <img :src="require('assets/img/wechat.png')" />
                        <span> 微信</span>
                      </el-radio>
                    </el-form-item>

                  </div>
                </div>
              </div>
              <div class="section-list">
                <div class="section-left">账户类型</div>
                <div class="section-right">
                  <div class="account-type">
                    <el-form-item class="radio-outer" prop="status">
                      <el-radio v-model="config.account_type" label="1"
                        >个人</el-radio
                      >
                      <el-radio v-model="config.account_type" label="2"
                        >企业</el-radio
                      >
                    </el-form-item>
                  </div>
                </div>
              </div>
              <div class="section-list">
                <div class="section-left">账户姓名</div>
                <div class="section-right">
                  <el-form-item prop="account_name">
                    <el-input
                      maxlength="20"
                      type="textarea"
                      v-model="config.account_name"
                      :placeholder="config.withdrawl_type==1 ? '请输入微信真实姓名' : '请输入支付宝真实姓名'"
                    />
                  </el-form-item>
                </div>
              </div>
              <!-- 共用 开始-->
              <div class="section-list">
                <div class="section-left">
                  {{ config.withdrawl_type == 2 ? "提现账户" : "账户认证id" }}
                </div>
                <div class="section-right">
                  <el-form-item prop="account">
                    <el-input
                      maxlength="36"
                      type="textarea"
                      v-model="config.account"
                      :placeholder="
                        '请输入' +
                        (config.withdrawl_type == 2 ? '提现账户' : '提现账户认证id')
                      "
                    />
                  </el-form-item>
                </div>
              </div>
              <div
                class="section-list notice-wechat-id"
                v-if="config.withdrawl_type == 1"
              >
                <div class="section-left"></div>
                <div class="section-right">
                  <div class="word">
                    * 打开微信扫描右侧二维码，获取账户认证id
                  </div>
                </div>
              </div>
              <div class="section-list">
                <div class="section-left">账户确认</div>
                <div class="section-right">
                  <el-form-item prop="check_account">
                    <el-input
                      maxlength="36"
                      type="textarea"
                      v-model="config.check_account"
                      :placeholder="
                        '请再次确认' +
                        (config.withdrawl_type == 2 ? '提现账户' : '提现账户认证id')
                      "
                    />
                  </el-form-item>
                </div>
              </div>
              <!-- 共用 结束-->
              <div class="section-list">
                <div class="section-left">手机号</div>
                <div class="section-right">
                  <el-form-item prop="tel">
                    <el-input
                      type="number"
                      maxlength="11"
                      v-model="config.tel"
                      placeholder="请填写联系电话"
                    />
                  </el-form-item>
                </div>
              </div>
            </el-form>
          </div>
          <div class="content-right" v-if="config.withdrawl_type == 1">
            <div class="code-box">
              <div class="code-title">账户认证ID获取：</div>
              <div class="code-img">
                <img :src="code_img_url" />
              </div>
              <div class="code-annotation">
                打开微信扫描二维码，获取账户认证id
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="section-item-header section-item-header-acsubmit"></div>
      <div
        class="box-bottom clearfix"
        style="display: flex; justify-content: center; margin-top: 20px"
      >
        <div class="btn_succ" @click="showCheck">提交</div>
      </div>
    </div>
    <!--    确认手机号-->
    <div v-if="showModel" class="message-box model">
      <div class="box-outer">
        <img
          class="cancel"
          :src="require('assets/img/cancel.png')"
          @click="closeModel"
        />
        <div class="box-title">账号验证</div>
        <div class="box-content">
          <div class="box-list">
            <div class="box-left">手机号</div>
            <div class="box-right">
              <el-input
                disabled
                v-model="origin_tel ? origin_tel : config.tel"
                placeholder="请输入手机号"
              />
            </div>
          </div>
          <div class="box-list">
            <div class="box-left">验证码</div>
            <div class="box-right">
              <el-input
                v-model="config.check_code"
                placeholder="请输入验证码"
              />
              <el-button v-if="show" class="get-code" @click="getCode"
                >获取验证码</el-button
              >
              <el-button v-if="!show" class="count" disabled
                >{{ count }}s后再次获取</el-button
              >
            </div>
          </div>
        </div>
        <div class="box-bottom clearfix">
          <div @click="saveActivitySure" :class="`btn_succ`">确认</div>
          <div class="btn_cancel" @click="closeModel">取消</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      ENV: process.env.NODE_ENV == "development" ? "/api" : "",
      code_img_url: "",
      isAlipay: "1",
      isWxpay: "1",
      Loading: false,
      config: {
        withdrawl_type: "2",
        account_type: "1",
        account_name: "",
        account: "",
        check_account: "",
        tel: "",
        check_code: "",
      },
      dataRules: {
        account_name: [
          { required: true, message: "* 请输入账户姓名", trigger: "blur" },
        ],
        account: [
          { required: true, message: "* 请输入账户号", trigger: "blur" },
        ],
        check_account: [
          { required: true, message: "* 请确认账户号", trigger: "blur" },
        ],
        tel: [{ required: true, message: "* 请输入联系电话", trigger: "blur" }],
      },
      showModel: false,
      check_phone: "ssss",
      show: true,
      count: 0,
      origin_tel: "",
    };
  },
  mounted() {
    this.$nextTick(() => {
      document.documentElement.style.minWidth = "1200px";
    });
  },
  created() {
    if (this.$route.query) {
      this.isAlipay = this.$route.query.isAlipay;
      this.isWxpay = this.$route.query.isWxpay;

      if (this.isAlipay == 1) {
        this.config.withdrawl_type = "2";
      } else if (this.isWxpay == 1) {
        this.config.withdrawl_type = "1";
      } else if (this.isAlipay == 1 && this.isWxpay == 1) {
        this.config.withdrawl_type = "2";
      }
    }
    this.getConfig();
    this.getConfigCode()
  },
  methods: {
    handleCashType() {
      this.getConfig();
    },
    getConfig() {
      this.Loading = true;
      this.$api
        .getWithdrawConfig({ withdrawl_type: this.config.withdrawl_type })
        .then((res) => {
          this.Loading = false;
          if (res.code == 1) {
            this.config.withdrawl_type = res.data.withdrawl_type;
            this.config.account_type = res.data.account_type;

            this.config.account_name = res.data.account_name;
            this.config.account = res.data.account;
            this.config.check_account = res.data.account;
            this.config.tel = res.data.tel;
            this.origin_tel = res.data.tel;
          }
        });
    },
    getConfigCode() {
      this.code_img_url = "";
      this.code_img_url = `${this.ENV}/withdrawl/get-qr-code`;
    },
    handleBackAc() {
      this.$router.push({ path: "/trad/manage" });
    },
    saveActivitySure() {
      //保存提现配置信息
      this.$refs["config"].validate((valid) => {
        if (valid) {
          if (this.config.account != this.config.check_account) {
            this.$sfNotify({
              duration: 0,
              type: "error",
              message: "请验证确认账号",
            });
            return false;
          }
          var reg = /^1\d{10}$/;
          if (!reg.test(this.config.tel.trim())) {
            this.$sfNotify({
              duration: 0,
              type: "error",
              message: "请输入正确手机号",
            });
            return false;
          }
          if (!this.config.check_code) {
            this.$sfNotify({
              duration: 0,
              type: "error",
              message: "验证码不能为空",
            });
            return false;
          }
          this.$api.saveWithdrawConfig(this.config).then((data) => {
            if (data.code == 1) {
              this.$sfNotify({
                message: "成功",
              });
              this.getConfig();
              this.showModel = false;
              this.config.check_code = "";
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
    getCode() {
      if (this.timer) {
        this.$sfNotify({
          duration: 0,
          type: "error",
          message: "请稍后再试",
        });
        return false;
      }
      var check_phone = this.origin_tel ? this.origin_tel : this.config.tel;
      this.$api.agentGetCheckCode({ phone: check_phone }).then((res) => {
        if (res.code == 1) {
          const TIME_COUNT = 60;
          if (!this.timer) {
            this.count = TIME_COUNT;
            this.show = false;
            this.timer = setInterval(() => {
              if (this.count > 0 && this.count <= TIME_COUNT) {
                this.count--;
              } else {
                this.show = true;
                clearInterval(this.timer);
                this.timer = null;
              }
            }, 1000);
          }
        } else {
          this.$sfNotify({
            duration: 0,
            type: "error",
            message: res.message,
          });
          return false;
        }
      });
    },
    showCheck() {
      this.showModel = true;
    },
    closeModel() {
      this.showModel = false;
      this.config.check_code = "";
    },
  },
  destroyed() {
    document.documentElement.style.minWidth = "1200px";
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/trad/manageSetAccount.scss";
</style>
