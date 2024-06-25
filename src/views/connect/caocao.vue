<template>
  <section>
    <div class="section-title">运营商授权</div>
    <div class="section-tips">
      <i class="warning-icon"></i>
      <div class="section-tips-content">
        <p class="tips-text">注意：曹操出行的关联关系为单向授权</p>
        <p class="tips-text">
          【授权】单向授权曹操出行使用我方桩的权限，我方无法使用对方的桩
        </p>
      </div>
    </div>
    <div class="section-container">
      <div class="section-item-router">
        <router-link to="/connect/operator">中电联、联行配置</router-link>
        <router-link to="/connect/operator/caocao" class="section-act"
          >曹操出行配置</router-link
        >
      </div>
      <div
        class="section-item-header section-item-knob"
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
        "
      >
        <div style="display: flex; flex-direction: column; width: 100%;">
          <div class="tips-text section-no-begin">
            注意：以下表单数据由第三方曹操出行提供
          </div>
          <div class="header-knob">
            <div class="knob-box">
              <div
                :class="['knob', modelInfo.status == 1 ? 'started' : '']"
                @click="changeStatus(modelInfo.status)"
              ></div>
              <div class="knob-text">
                {{ modelInfo.status == 1 ? "启用" : "停用" }}
              </div>
            </div>
            <div>
              <router-link
                :to="`/connect/operator/accept/${'caocao'}`"
                class="btn_recovery send-btn"
                >关联充电站 >></router-link
              >
            </div>
          </div>
        </div>
      </div>
      <el-form
        v-loading="listLoading"
        :model="modelInfo"
        ref="modelInfo"
        :rules="dataRules"
      >
        <!-- 基本信息 -->
        <div class="section-info">
          <div class="info-content clearfix">
            <div class="info-left">
              <!-- 名称 -->
              <div class="info-item">
                <div class="info-item-left"><i>*</i>应用ID</div>
                <div class="info-item-right">
                  <el-form-item prop="app_id">
                    <el-input
                      v-model="modelInfo.app_id"
                      placeholder="请输入应用ID"
                    />
                  </el-form-item>
                </div>
              </div>

              <!-- 对接平台 -->
              <div class="info-item">
                <div class="info-item-left"><i>*</i>应用Key</div>
                <div class="info-item-right">
                  <el-form-item prop="app_key">
                    <el-input
                      v-model="modelInfo.app_key"
                      placeholder="请输入应用Key"
                    />
                  </el-form-item>
                </div>
              </div>
              <!-- 应用密钥 -->
              <div class="info-item">
                <div class="info-item-left"><i>*</i>应用密钥</div>
                <div class="info-item-right">
                  <el-form-item prop="app_secret">
                    <el-input
                      v-model="modelInfo.app_secret"
                      placeholder="请输入应用密钥"
                    />
                  </el-form-item>
                </div>
              </div>
              <!-- 数据加密秘钥 -->
              <div class="info-item">
                <div class="info-item-left show-app"><i>*</i>数据加密秘钥</div>
                <div class="info-item-right">
                  <el-form-item prop="data_secret">
                    <el-input
                      v-model="modelInfo.data_secret"
                      placeholder="数据加密秘钥"
                    />
                  </el-form-item>
                </div>
              </div>
            </div>

            <div class="info-right">
              <!-- 数据加密向量(dataSecretiv) -->
              <div class="info-item">
                <div class="info-item-left show-app-long">
                  <i>*</i>数据加密向量(dataSecretiv)
                </div>
                <div class="info-item-right">
                  <el-form-item prop="data_secret_iv">
                    <el-input
                      v-model="modelInfo.data_secret_iv"
                      placeholder="数据加密向量(dataSecretiv)"
                    />
                  </el-form-item>
                </div>
              </div>
              <!-- 请求地址(url) -->
              <div class="info-item">
                <div class="info-item-left show-app-long">
                  <i>*</i>请求地址（不建议修改）
                </div>
                <div class="info-item-right">
                  <el-form-item prop="push_url">
                    <el-input
                      v-model="modelInfo.push_url"
                      placeholder="请输入请求地址"
                    />
                  </el-form-item>
                </div>
              </div>
              <div class="info-item">
                <div class="info-item-left show-app-long">
                  <i>*</i>充电枪实时状态变更、数据推送接口地址（特殊接口）
                </div>
                <div class="info-item-right">
                  <el-form-item prop="push_url2">
                    <el-input
                      v-model="modelInfo.push_url2"
                      placeholder="请输入充电枪实时状态变更、数据推送接口地址"
                    />
                  </el-form-item>
                </div>
              </div>
            </div>
          </div>
          <p class="caocao-tips-text" v-if="app_id">
            提供给曹操出行的URL地址：
            {{ api_host }}/caocao/open/charge/v1/{{ app_id }}
          </p>
          <p class="caocao-tips-text" v-if="!app_id">
            提供给曹操出行的URL地址：填写完表单后自动生成
          </p>
          <div class="btn_succ" @click="saveModelInfo">提交</div>
        </div>
      </el-form>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    const onlyPhone = async (rule, value, callback) => {
      const boolean = new RegExp("^1(3|4|5|6|7|8|9)\\d{9}$").test(value);
      if (!boolean) {
        return callback(new Error("* 手机号格式不正确"));
      }
    };
    const onlyUrl = async (rule, value, callback) => {
      let validate =
        /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
      const boolean = new RegExp(validate).test(value);
      if (!boolean) {
        return callback(new Error("* url格式不正确"));
      }
    };
    return {
      id: this.$route.params.id ? this.$route.params.id : 0,
      listLoading: false,
      app_id: "",
      api_host: "",
      modelInfo: {
        app_id: "",
        status: "",
        app_key: "",
        app_secret: "",
        data_secret: "",
        data_secret_iv: "",
        push_url: "https://biz.caocaokeji.cn/dic-gateway/",
        push_url2: "https://charging.caocaokeji.cn/",
      },
      dataRules: {
        app_id: [
          { required: true, message: "* 请输入应用ID", trigger: "change" },
        ],
        app_key: [
          { required: true, message: "* 请输入应用Key", trigger: "change" },
        ],
        app_secret: [
          { required: true, message: "* 请输入应用密钥", trigger: "change" },
        ],
        data_secret: [
          {
            required: true,
            message: "* 请输入数据加密密钥",
            trigger: "change",
          },
        ],
        data_secret_iv: [
          {
            required: true,
            message: "* 请输入数据加密向量",
            trigger: "change",
          },
        ],
        push_url: [
          {
            required: true,
            message: "* 请输入请求地址",
            trigger: "change",
          },
        ],
        push_url2: [
          {
            required: true,
            message: "* 请输入充电枪实时状态变更、数据推送接口地址",
            trigger: "change",
          },
        ],
      },
    };
  },
  created() {
    this.getCaoCaoData();
  },
  methods: {
    saveModelInfo() {
      var that = this;
      that.listLoading = true;

      this.$refs["modelInfo"].validate((valid) => {
        if (valid) {
          that.modelInfo.id = that.id;
          that.$api.saveCaoCaoData(that.modelInfo).then((res) => {
            that.listLoading = false;

            if (res.code == 1) {
              this.$sfNotify({
                message: "成功",
              });
              // that.$router.push(`/connect/operator/caocao`)
            } else {
              this.$sfNotify({
                duration: 0,
                type: "error",
                message: res.message,
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    changeStatus(val) {
      let status = val == 1 ? 0 : 1;
      this.modelInfo.status = status;
    },
    getCaoCaoData() {
      var that = this;

      this.listLoading = true;
      this.$api.getCaoCaoData().then((res) => {
        this.listLoading = false;
        var data = JSON.stringify(res.data);

        if (res.code > 0) {
          that.app_id = res.data.app_id;
          that.modelInfo.title = res.data.title;
          that.modelInfo.app_id = res.data.app_id;
          that.modelInfo.app_key = res.data.app_key;
          that.modelInfo.app_secret = res.data.app_secret;
          that.modelInfo.data_secret = res.data.data_secret;
          that.modelInfo.data_secret_iv = res.data.data_secret_iv;
          that.modelInfo.push_url = res.data.push_url;
          that.modelInfo.push_url2 = res.data.push_url2;
          that.modelInfo.status = res.data.status;
          that.api_host = res.data.api_host;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../assets/css/connect/caocao.scss";
</style>
