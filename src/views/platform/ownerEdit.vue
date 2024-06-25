<template>
  <section>
    <div class="section-title">
      <router-link to="/platform/owner">业主</router-link>
      > {{id == 0?'添加':'修改'}}业主
    </div>
    <div class="section-container">
      <div class="section-item-header clearfix">
        <span>业主信息</span>
      </div>
      <el-form :model="modelInfo" ref="modelInfo" :rules="dataRules">
        <!-- 基本信息 -->
        <div class="section-info">
          <div class="info-content clearfix">
            <div class="info-left">
              <div class="box-list">
                <div class="box-left">
                  <i>*</i>成员账号
                </div>
                <div class="box-right">
                  <el-form-item prop="account">
                    <el-input v-model="modelInfo.account" placeholder="请输入成员账号" />
                  </el-form-item>
                </div>
              </div>
              <div class="box-list">
                <div class="box-left">
                  <i>*</i>登录密码
                </div>
                <div class="box-right">
                  <el-form-item prop="pass">
                    <el-input
                      :type="password"
                      @focus="password = 'password'"
                      v-model="modelInfo.pass"
                      placeholder="请输入登录密码"
                      auto-complete="new-password"
                    />
                  </el-form-item>
                </div>
              </div>
              <div class="box-list">
                <div class="box-left">
                  <i>*</i>角色名称
                </div>
                <div class="box-right">
                  <el-form-item prop="role_id">
                    <el-select v-model="modelInfo.role_id" placeholder="请选择成员角色">
                      <el-option
                        v-for="(role, index) in role_names"
                        :key="index"
                        style="width:302px;"
                        :label="role.role_name"
                        :value="role.id"
                      />
                    </el-select>
                  </el-form-item>
                </div>
              </div>
              <div class="box-list">
                <div class="box-left">
                  <i>*</i>类型
                </div>
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

              <div class="box-bottom clearfix">
                <div class="btn_succ" @click="saveModelInfo">提交</div>
                <div class="btn_cancel" @click="goToList">返回</div>
              </div>
            </div>
            <div class="info-right">
              <div class="box-list">
                <div class="box-left">
                  <i>*</i>联系地址
                </div>
                <div class="box-right">
                  <el-form-item prop="address">
                    <el-input type="textarea" v-model="modelInfo.address" placeholder="请输入联系地址" />
                  </el-form-item>
                </div>
              </div>
              <div class="box-list">
                <div class="box-left">
                  <i>*</i>联系人
                </div>
                <div class="box-right">
                  <el-form-item prop="user_name">
                    <el-input v-model="modelInfo.user_name" placeholder="请输入用户姓名" />
                  </el-form-item>
                </div>
              </div>
              <div class="box-list">
                <div class="box-left">
                  <i>*</i>联系电话
                </div>
                <div class="box-right">
                  <el-form-item prop="phone">
                    <el-input v-model="modelInfo.phone" placeholder="请输入联系电话" />
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
            </div>
          </div>
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
    const onlyEmail = async (rule, value, callback) => {
      if (value != "") {
        const boolean = new RegExp(
          "^[a-z0-9]+([._\\\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"
        ).test(value);
        if (!boolean) {
          return callback(new Error("* 邮箱格式不正确"));
        }
      }
    };
    return {
      id: this.$route.params.id ? this.$route.params.id : 0,
      password: "text",
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
      },
      dataRules: {
        account: [
          { required: true, message: "* 请输入账号名称", trigger: "blur" },
        ],
        pass: [
          { required: true, message: "* 请输入登录密码", trigger: "blur" },
        ],
        address: [{ required: true, message: "* 请输入地址", trigger: "blur" }],
        user_name: [
          { required: true, message: "* 请输入联系人姓名", trigger: "blur" },
        ],
        phone: [
          { required: true, message: "* 请输入联系方式", trigger: "blur" },
          { validator: onlyPhone, trigger: "blur" },
        ],
        email: [{ validator: onlyEmail, trigger: "blur" }],
      },
      role_names: [],
    };
  },
  created() {
    this.getAllRoleName();
  },
  methods: {
    getAllRoleName() {
      this.$api.roleRoleName({ type: 3 }).then((data) => {
        if (data.code == 1) {
          let _data = data.data;
          this.role_names = _data;
        }
      });
    },
    saveModelInfo() {
      this.$refs["modelInfo"].validate((valid) => {
        if (valid) {
          this.$api.roleCreateOwner(this.modelInfo).then((data) => {
            if (data.code == 1) {
              this.$sfNotify({
                message: "成功",
              });
              this.$router.push(`/platform/owner`);
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
    goToList() {
      this.$router.push(`/platform/owner`);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../assets/css/platform/ownerEdit.scss";
</style>
