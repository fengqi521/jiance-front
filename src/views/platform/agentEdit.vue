<template>
  <section>
    <div class="section-title">
      <router-link to="/platform/agent">代理商</router-link> > {{ id ? '修改' : '添加' }}代理商
    </div>
    <div class="section-container">
      <div class="section-item-header clearfix">
        <span>代理商信息</span>
      </div>
      <el-form :model="modelInfo" ref="modelInfo" :rules="dataRules" v-loading="isLoading">
        <!-- 基本信息 -->
        <div class="section-info">
          <div class="info-content clearfix">
            <div class="info-left">
              <div class="box-list">
                <div class="box-left"><i>*</i>成员账号</div>
                <div class="box-right">
                  <el-form-item prop="account">
                    <el-input :disabled="this.id ? true : false" v-model="modelInfo.account" placeholder="请输入成员账号" />
                  </el-form-item>
                </div>
              </div>
              <div class="box-list">
                <div class="box-left"><i v-if="!id">*</i>登录密码</div>
                <div class="box-right">
                  <el-form-item prop="pass" :rules="id ? [{ required: false }] : dataRules.pass">
                    <el-input :type="password" @focus="password = 'password'" v-model="modelInfo.pass"
                      placeholder="请输入登录密码" auto-complete="new-password" />
                  </el-form-item>
                </div>
              </div>
              <div class="box-list">
                <div class="box-left"><i>*</i>角色名称</div>
                <div class="box-right">
                  <el-form-item prop="role_id">
                    <el-select v-model="modelInfo.role_id" placeholder="请选择成员角色">
                      <el-option v-for="(role, index) in role_names" :key="index" style="width:302px;"
                        :label="role.role_name" :value="role.id" />
                    </el-select>
                  </el-form-item>
                </div>
              </div>
              <div class="box-list">
                <div class="box-left"><i>*</i>类型</div>
                <div class="box-right">
                  <el-form-item prop="type">
                    <el-select v-model="modelInfo.type" placeholder="请选择类型">
                      <el-option label="个人" value="1" />
                      <el-option label="国有企业" value="2" />
                      <el-option label="集体企业" value="3" />
                      <el-option label="私营企业" value="4" />
                      <el-option label="其他企业" value="5" />
                      <el-option label="集团客户" value="6" />
                    </el-select>
                  </el-form-item>
                </div>
              </div>
              <div class="box-list">
                <div class="box-left">企业名称</div>
                <div class="box-right">
                  <el-input v-model="modelInfo.company_name" placeholder="请输入企业名称" />
                </div>
              </div>
              <div class="box-list">
                <div class="box-left"><i v-if="modelInfo.type !== '1' && modelInfo.type !== '6'">*</i>组织机构代码</div>
                <div class="box-right">
                  <el-form-item prop="agent_operator_id">
                    <el-input v-model="modelInfo.agent_operator_id" placeholder="请输入组织机构代码" />
                  </el-form-item>

                </div>
              </div>

              <div class="box-bottom clearfix">
                <div class="btn_succ" @click="saveModelInfo">提交</div>
                <div class="btn_cancel" @click="goToList">返回</div>
              </div>
            </div>
            <div class="info-right">
              <div class="box-list">
                <div class="box-left"><i>*</i>联系地址</div>
                <div class="box-right">
                  <el-form-item prop="address">
                    <el-input type='textarea' v-model="modelInfo.address" placeholder="请输入联系地址" />
                  </el-form-item>
                </div>
              </div>
              <div class="box-list">
                <div class="box-left"><i>*</i>联系人</div>
                <div class="box-right">
                  <el-form-item prop="user_name">
                    <el-input v-model="modelInfo.user_name" placeholder="请输入用户姓名" />
                  </el-form-item>
                </div>
              </div>
              <div class="box-list">
                <div class="box-left"><i>*</i>联系电话</div>
                <div class="box-right">
                  <el-form-item prop="phone">
                    <el-input :disabled="this.id ? true : false" v-model="modelInfo.phone" placeholder="请输入联系电话" />
                  </el-form-item>
                </div>
              </div>
              <div class="box-list">
                <div class="box-left">联系邮箱</div>
                <div class="box-right">
                  <el-form-item prop="email">
                    <el-input v-model="modelInfo.email" placeholder="请输入联系邮箱" />
                  </el-form-item>
                </div>
              </div>
              <div class="box-list box-list-space">
                <div class="box-left">是否允许代理商设置提现账户</div>
                <div class="box-right box-right-space">
                  <el-form-item class="radio-outer" prop="status">
                    <el-radio v-model="modelInfo.set_withdrawal_account" label="1">是</el-radio>
                    <el-radio v-model="modelInfo.set_withdrawal_account" label="0">否</el-radio>
                  </el-form-item>
                  <i class="right-tips">提示：设置为允许后，代理商可以设置支付宝账户，否则无法设置支付宝账户</i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-form>
    </div>
  </section>
</template>

<script>
export default {
  data () {
    const onlyPhone = async (rule, value, callback) => {
      const boolean = new RegExp("^1(3|4|5|6|7|8|9)\\d{9}$").test(value);
      if (!boolean) {
        return callback(new Error("* 手机号格式不正确"));
      }
    };
    const onlyEmail = async (rule, value, callback) => {
      if (value) {
        const boolean = new RegExp(
          "^[a-z0-9]+([._\\\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"
        ).test(value);
        if (!boolean) {
          return callback(new Error("* 邮箱格式不正确"));
        }
        return;
      }
      callback()
    };
    const agentOperatorId = async (rule, value, callback) => {

      if (this.modelInfo.agent_operator_id == "" && this.modelInfo.type != 1 && this.modelInfo.type != 6) {
        return callback(new Error("* 请填写组织机构代码"));
      }
      callback()
    };
    const id = this.$route.params.id ? this.$route.params.id : ''
    return {
      isLoading: false,
      id,
      password: 'text',
      modelInfo: {
        account: "",
        pass: "",
        role_id: "",
        type: "",
        company_name: "",
        address: "",
        user_name: "",
        email: "",
        phone: "",
        agent_operator_id: "",
        set_withdrawal_account: '0'
      },
      dataRules: {
        account: [
          { required: true, message: "* 请输入账号名称", trigger: "blur" }
        ],
        pass: [
          { required: true, message: "* 请输入登录密码", trigger: "blur" }
        ],
        address: [{ required: true, message: "* 请输入地址", trigger: "blur" }],
        user_name: [
          { required: true, message: "* 请输入联系人姓名", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "* 请输入联系方式", trigger: "blur" },
          { validator: onlyPhone, trigger: "blur" }
        ],
        email: [{ validator: onlyEmail, trigger: "blur" }],
        agent_operator_id: [
          { validator: agentOperatorId, trigger: "blur" },
        ],

      },
      role_names: []
    };
  },
  created () {
    this.getAllRoleName();
    if (this.id) this.getAccountInfo()
  },
  methods: {
    getAllRoleName () {
      this.$api.roleRoleName({ type: 4 }).then(data => {
        if (data.code == 1) {
          let _data = data.data;
          this.role_names = _data;
        }
      });
    },
    getAccountInfo () {
      this.isLoading = true;
      this.$api.roleAccount({ id: this.id }).then((data) => {
        this.isLoading = false;
        if (data.code == 1) {
          let _data = data.data;
          this.modelInfo.account = _data.account;
          this.modelInfo.pass = "";
          this.modelInfo.role_id = _data.role_id;
          this.modelInfo.type = _data.type;
          this.modelInfo.company_name = _data.company_name;
          this.modelInfo.address = _data.address;
          this.modelInfo.user_name = _data.user_name;
          this.modelInfo.email = _data.email;
          this.modelInfo.phone = _data.tel;
          this.modelInfo.agent_operator_id = _data.agent_operator_id;
          this.modelInfo.set_withdrawal_account = _data.set_withdrawal_account
        }
      });
    },
    async saveModelInfo () {
      const valid = await this.$refs['modelInfo'].validate().catch(err => err)
      if (!valid) return;
      this.isLoading = true;
      if (this.id) {
        // 编辑
        this.modelInfo.id = this.id;
        this.$api.roleEditAgent(this.modelInfo).then((data) => {
          this.isLoading = false;
          if (data.code == 1) {
            this.$sfNotify({
              message: "修改成功",
            });
            this.$router.push(`/platform/agent`);
          } else {
            this.$sfNotify({
              duration: 0,
              type: "error",
              message: data.message,
            });
          }
        });
        return;
      }

      // 添加
      this.$api.roleCreateAgent(this.modelInfo).then(data => {
        this.isLoading = false;
        if (data.code == 1) {
          this.$sfNotify({
            message: "添加成功"
          });
          this.$router.push(`/platform/agent`);
        } else {
          this.$sfNotify({
            duration: 0,
            type: "error",
            message: data.message
          });
        }
      });
    },
    goToList () {
      this.$router.push(`/platform/agent`);
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../assets/css/platform/ownerEdit.scss";
</style>
