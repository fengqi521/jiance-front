<template>
  <section>
    <div class="section-title">账号资料</div>
    <div class="section-list section-mediaQuery clearfix">
      <div class="section-item-header">账户信息</div>
      <div class="section-main clearfix">
        <div class="main-left">
          <img :src="require('assets/img/userImg.png')" />
          <div class="user-name ellipsis">{{modelInfo.name}}</div>
          <div
            class="user-type"
            v-if="user_type == '0'"
          >超级管理员</div>
          <div
            class="user-type"
            v-else-if="user_type == '1'"
          >系统管理员</div>
          <div
            class="user-type"
            v-else-if="user_type == '2'"
          >企业主成员</div>
          <div
            class="user-type"
            v-else-if="user_type == '3'"
          >业主成员</div>
          <div
            class="user-type"
            v-else
          >其他</div>
        </div>
        <div class="main-right">
          <el-form
            class="clearfix"
            :model="modelInfo"
            ref="dataInfo"
            :rules="userRules"
          >
            <div class="main-right-list">
              <div class="list-left"><i>*</i>联系人</div>
              <div class="list-right">
                <el-form-item prop="name">
                  <el-input
                    v-model="modelInfo.name"
                    placeholder="请输入用户姓名"
                  />
                </el-form-item>
              </div>
            </div>
            <div class="main-right-list">
              <div class="list-left"><i>*</i>联系方式</div>
              <div class="list-right">
                <el-form-item prop="phone">
                  <el-input
                    v-model="modelInfo.phone"
                    placeholder="请输入联系电话"
                  />
                </el-form-item>
              </div>
            </div>
            <div class="main-right-list">
              <div class="list-left">联系邮箱</div>
              <div class="list-right">
                <el-form-item prop="email">
                  <el-input
                    v-model="modelInfo.email"
                    placeholder="请输入联系邮箱"
                  />
                </el-form-item>
              </div>
            </div>
            <div class="main-right-list">
              <div class="list-left"><i>*</i>登录密码</div>
              <div class="list-right">
                <el-input
                  type="password"
                  class="el-form-item"
                  disabled
                  v-model="password"
                  placeholder="请输入登录密码"
                />
                <i
                  class="edit-icon"
                  @click="showPasswordModel = true"
                ></i>
              </div>
            </div>
          </el-form>
          <div class="main-right-bottom clearfix">
            <div
              class="btn_succ"
              @click="saveUserInfo"
            >提交</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 修改登录密码 -->
    <div
      is="editPasswordModel"
      :showModel.sync="showPasswordModel"
    ></div>
  </section>
</template>

<script>
import editPasswordModel from "./components/editPasswordModel";

export default {
  components: {
    editPasswordModel
  },
  data() {
    return {
      user_type: "",
      password: "*******",
      modelInfo: {
        name: "",
        email: "",
        phone: ""
      },
      systemInfo: {
        system_id: "2020319309",
        count: "100台",
        used_count: "99台",
        auth_id: "",
        type: 0,
        version: "0.1"
      },
      companyInfo: {
        operator_name: "",
        title: "",
        operator_id: "",
        operator_note: "",
        operator_reg_address: "",
        operator_people: "",
        operator_tel: "",
        operator_url: "",
        id: ""
      },
      showPasswordModel: false,
      userRules: {
        name: [
          { required: true, message: "* 请输入用户姓名", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "* 请输入联系电话", trigger: "blur" }
        ]
      },
    };
  },
  created() {
    this.getDetail();
  },
  mounted() {},
  methods: {
    saveUserInfo() {
      var that = this;
      this.$refs["dataInfo"].validate(valid => {
        if (valid) {
          that.$api.saveUserInfo(that.modelInfo).then(res => {
            if (res.code == 1) {
              this.$sfNotify({
                message: "修改成功"
              });
              that.getDetail();
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getDetail() {
      var that = this;
      this.$api.platformDetail({}).then(res => {
        if (res.code == 1) {
          that.modelInfo.name = res.data.detail.user_name;
          that.modelInfo.phone = res.data.detail.tel;
          that.modelInfo.email = res.data.detail.email;
          that.user_type = res.data.detail.type;
        }
      });
    },
  }
};
</script>
<style scoped lang="scss" scoped>
@import "../../assets/css/data/info.scss";
</style>
