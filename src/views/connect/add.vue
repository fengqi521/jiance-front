<template>
  <section>
    <div class="section-title">
      <router-link to="/connect/operator">运营商授权</router-link> > {{id == 0?'新增':'修改'}}运营商
    </div>
    <div class="section-container">
      <div class="section-item-header clearfix">
        <span>运营商信息</span>
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
                <div class="info-item-left"><i>*</i>名称</div>
                <div class="info-item-right">
                  <el-form-item prop="title">
                    <el-input
                      v-model="modelInfo.title"
                      placeholder="请输入名称"
                    />
                  </el-form-item>
                </div>
              </div>
              <!-- 对接平台 -->
              <div class="info-item">
                <div class="info-item-left"><i>*</i>对接平台</div>
                <div class="info-item-right">
                  <el-form-item prop="operator_name">
                    <el-input
                      v-model="modelInfo.operator_name"
                      placeholder="请输入对接平台"
                    />
                  </el-form-item>
                </div>
              </div>
              <!-- 对接平台 -->
              <div class="info-item">
                <div class="info-item-left"><i>*</i>公司简称</div>
                <div class="info-item-right">
                  <el-form-item prop="operator_note">
                    <el-input
                      v-model="modelInfo.operator_note"
                      placeholder="请输入公司简称"
                    />
                  </el-form-item>
                </div>
              </div>
              <!-- 联系电话 -->
              <div class="info-item">
                <div class="info-item-left"><i>*</i>联系电话</div>
                <div class="info-item-right">
                  <el-form-item prop="operator_tel">
                    <el-input
                      v-model.number="modelInfo.operator_tel"
                      placeholder="请输入联系电话"
                    />
                  </el-form-item>
                </div>
              </div>
              <!-- 第三方消息密钥(DataSecret) -->
              <div class="info-item">
                <div class="info-item-left show-app">第三方消息密钥(DataSecret)</div>
                <div class="info-item-right">
                  <el-form-item prop="third_data_secret">
                    <el-input
                      v-model="modelInfo.third_data_secret"
                      placeholder="请输入第三方消息密钥(DataSecret)"
                    />
                  </el-form-item>
                </div>
              </div>
              <!-- 第三方消息密钥初始化向量(DataSecretlV) -->
              <div class="info-item">
                <div class="info-item-left show-app">第三方消息密钥初始化向量(DataSecretlV)</div>
                <div class="info-item-right">
                  <el-form-item prop="third_data_secret_iv">
                    <el-input
                      v-model="modelInfo.third_data_secret_iv"
                      placeholder="请输入第三方消息密钥初始化向量(DataSecretlV)"
                    />
                  </el-form-item>
                </div>
              </div>
              <!-- 关联关系 -->
              <div class="info-item">
                <div class="info-item-left"><i>*</i>关联关系</div>
                <div class="info-item-right">
                  <el-form-item prop="access_type">
                    <el-select
                      v-model="modelInfo.access_type"
                      placeholder="请选择关联关系"
                    >
                      <el-option
                        label="互联互通"
                        value="1"
                      />
                      <el-option
                        label="授权"
                        value="3"
                      />
                      <el-option
                        label="接入"
                        value="2"
                      />
                    </el-select>
                  </el-form-item>
                </div>
              </div>
            </div>

            <div class="info-right">
              <!-- 公司地址 -->
              <div class="info-item">
                <div class="info-item-left">公司地址</div>
                <div class="info-item-right">
                  <el-form-item prop="operator_reg_address">
                    <el-input
                      type="textarea"
                      v-model="modelInfo.operator_reg_address"
                      placeholder="请输入请输入公司地址"
                    />
                  </el-form-item>
                </div>
              </div>
              <!-- 组织机构代码 -->
              <div class="info-item">
                <div class="info-item-left"><i>*</i>组织机构代码</div>
                <div class="info-item-right">
                  <el-form-item prop="operator_id">
                    <el-input
                      :disabled="id != 0 ? true:false"
                      v-model="modelInfo.operator_id"
                      placeholder="请输入组织机构代码"
                    />
                  </el-form-item>
                </div>
              </div>
              <!-- 联系人 -->
              <div class="info-item">
                <div class="info-item-left"><i>*</i>联系人</div>
                <div class="info-item-right">
                  <el-form-item prop="operator_people">
                    <el-input
                      v-model="modelInfo.operator_people"
                      placeholder="请输入联系人"
                    />
                  </el-form-item>
                </div>
              </div>
              <!-- url -->
              <div class="info-item">
                <div class="info-item-left"><i>*</i>URL地址 </div>
                <div class="info-item-right">
                  <el-form-item prop="third_platform_url">
                    <el-input
                      v-model="modelInfo.third_platform_url"
                      placeholder="请输入URL地址(地址默认以/结尾)"
                    />
                  </el-form-item>
                </div>
              </div>
              <!-- 第三方运营商密钥(OperatorSecret) -->
              <div class="info-item">
                <div class="info-item-left show-app">第三方运营商密钥(OperatorSecret)</div>
                <div class="info-item-right">
                  <el-form-item prop="third_operator_secret">
                    <el-input
                      v-model="modelInfo.third_operator_secret"
                      placeholder="请输入第三方运营商密钥(OperatorSecret)"
                    />
                  </el-form-item>
                </div>
              </div>
              <!-- sign -->
              <div class="info-item">
                <div class="info-item-left show-app">第三方签名密钥(SigSecret）</div>
                <div class="info-item-right">
                  <el-form-item prop="third_sig_secret">
                    <el-input
                      v-model="modelInfo.third_sig_secret"
                      placeholder="请输入第三方签名密钥(SigSecret）"
                    />
                  </el-form-item>
                </div>
              </div>
            </div>
          </div>
          <div
            class="btn_succ"
            @click="saveModelInfo"
          >提交</div>
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
      let validate = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
      const boolean = new RegExp(validate).test(value);
      if (!boolean) {
        return callback(new Error("* url格式不正确"));
      }
    };
    return {
      id: this.$route.params.id ? this.$route.params.id : 0,
      listLoading: false,
      modelInfo: {
        title: "",
        operator_name: "",
        operator_note: "",
        operator_tel: "",
        third_data_secret: "",
        third_data_secret_iv: "",
        access_type: "1",
        operator_reg_address: "",
        operator_id: "",
        operator_people: "",
        third_platform_url: "",
        third_operator_secret: "",
        third_sig_secret: "",

      },
      dataRules: {
        title: [{ required: true, message: "* 请输入名称", trigger: "change" }],
        operator_name: [
          { required: true, message: "* 请输入对接平台", trigger: "change" }
        ],
        operator_note: [
          { required: true, message: "* 请输入公司简称", trigger: "change" }
        ],
        operator_tel: [
          { required: true, message: "* 请输入联系人电话", trigger: "change" },
          { validator: onlyPhone, trigger: "blur" }
        ],
        // third_data_secret: [
        //   {
        //     required: true,
        //     message: "* 请输入第三方消息密钥(DataSecret)",
        //     trigger: "change"
        //   }
        // ],
        // third_data_secret_iv: [
        //   {
        //     required: true,
        //     message: "* 请输入第三方消息密钥初始化向量(DataSecretlV)",
        //     trigger: "change"
        //   }
        // ],
        access_type: [
          {
            required: true,
            message: "* 请选择关联关系",
            trigger: "change"
          }
        ],

        operator_id: [
          {required: true, message: "* 请输入组织机构代码", trigger: "blur"},
          { min: 9, max: 9, message: "* 长度应为9个字符", trigger: 'blur' }
        ],
        operator_people: [
          {
            required: true,
            message: "* 请输入联系人",
            trigger: "change"
          }
        ],
        third_platform_url: [
          {required: true, message: "* 请输入URL地址", trigger: "blur"},
          { validator: onlyUrl, trigger: "blur" }
        ],
        // third_operator_secret: [
        //   {
        //     required: true,
        //     message: "* 请输入第三方运营商密钥(OperatorSecret)",
        //     trigger: "change"
        //   }
        // ],
        // third_sig_secret: [
        //   {
        //     required: true,
        //     message: "* 请输入第三方签名密钥(SigSecret）",
        //     trigger: "change"
        //   }
        // ]
      }
    };
  },
  created(){
      this.getOperatorDetail();
  },
  methods: {
    saveModelInfo() {
      var that = this;
      this.$refs["modelInfo"].validate(valid => {
        if (valid) {
            if(this.id != 0){
                /*
                编辑
                 */
                that.modelInfo.id = that.id;
                that.$api.updateConnect(that.modelInfo).then(res=>{
                  if(res.code == 1){
                    this.$sfNotify({
                      message: "成功"
                    });
                    that.$router.push(`/connect/operator`)
                  }else{
                    this.$sfNotify({
                      duration: 0,
                      type: "error",
                      message: res.message
                    });
                  }
                })
            }else{
                /*
                添加
                 */
                that.$api.saveConnect(that.modelInfo).then(res=>{
                  if(res.code == 1){
                    this.$sfNotify({
                      message: "成功"
                    });
                    that.$router.push(`/connect/operator`)

                  }else{
                    this.$sfNotify({
                      duration: 0,
                      type: "error",
                      message: res.message
                    });
                  }
                })
            }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getOperatorDetail(){
      var that = this;
      if(this.id != 0){
        this.listLoading = true;
        this.$api.getConnectDetail({'id':this.id}).then(res=>{
          this.listLoading = false;
          that.modelInfo.title = res.data.third.title;
          that.modelInfo.operator_name = res.data.third.operator_name;
          that.modelInfo.operator_note = res.data.third.operator_note;
          that.modelInfo.operator_tel = res.data.third.operator_tel;
          that.modelInfo.third_data_secret = res.data.third.data_secret;
          that.modelInfo.third_data_secret_iv = res.data.third.data_secret_iv;
          that.modelInfo.access_type = res.data.third.access_type;
          console.log(res.data.third.type)
          if(res.data.third.type == 0){
            res.data.third.type = '1';
          }
          that.modelInfo.type =res.data.third.type ;
          that.modelInfo.operator_reg_address = res.data.third.operator_reg_address;
          that.modelInfo.operator_id = res.data.third.operator_id;
          that.modelInfo.operator_people = res.data.third.operator_people;
          that.modelInfo.third_platform_url = res.data.third.operator_url;
          that.modelInfo.third_operator_secret = res.data.third.operator_secret;
          that.modelInfo.third_sig_secret = res.data.third.sig_secret;
        })
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../assets/css/connect/add.scss";
</style>
