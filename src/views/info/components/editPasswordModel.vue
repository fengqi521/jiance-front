<template>
  <transition name="fade">
    <div
      v-if="showModel"
      class="model"
    >
      <div class="box-outer">
        <img
          class="cancel"
          :src="require('assets/img/cancel.png')"
          @click="handleCancel"
        >
        <div class="box-title">修改密码</div>
        <el-form
          :model="modelInfo"
          ref="dataInfo"
          :rules="dataRules"
        >
          <div class="box-list">
            <div class="list-left"><i>*</i> 原密码</div>
            <div class="list-right">
              <el-form-item prop="oldPassword">
                <el-input
                  type="password"
                  v-model="modelInfo.oldPassword"
                  placeholder="请输入原始密码"
                />
              </el-form-item>
            </div>
          </div>
          <div class="box-list">
            <div class="list-left"><i>*</i> 新密码</div>
            <div class="list-right">
              <el-form-item prop="newPassword">
                <el-input
                  type="password"
                  v-model="modelInfo.newPassword"
                  placeholder="请输入新密码"
                />
              </el-form-item>
            </div>
          </div>
          <div class="box-list">
            <div class="list-left"><i>*</i> 确认密码</div>
            <div class="list-right">
              <el-form-item prop="repeatPassword">
                <el-input
                  type="password"
                  v-model="modelInfo.repeatPassword"
                  placeholder="请再次输入密码"
                />
              </el-form-item>
            </div>
          </div>
        </el-form>
        <div class="box-btn">
          <div
            class="btn_succ"
            @click="saveInfo"
          >确认</div>
          <div
            class="btn_cancel"
            @click="handleCancel"
          >取消</div>
        </div>

      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    showModel: {
      type: Boolean
    }
  },
  data() {
    const confirmPass = async (rule, value, callback) => {
      if (this.modelInfo.newPassword.trim() !== this.modelInfo.repeatPassword.trim()) {
        return callback(new Error("* 确认密码与新密码不一致"));
      }
    };
    return {
      modelInfo: {
        oldPassword: "",
        newPassword: "",
        repeatPassword: ""
      },
      dataRules: {
        oldPassword: [
          { required: true, message: "* 请输入原始密码", trigger: "blur" }
        ],
        newPassword: [
          { required: true, message: "* 请输入新密码", trigger: "blur" }
        ],
        repeatPassword: [
          { required: true, message: "* 请再次输入密码", trigger: "blur" },
          { validator: confirmPass, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    handleCancel() {
      this.modelInfo.oldPassword = "";
      this.modelInfo.newPassword = "";
      this.modelInfo.repeatPassword = "";
      this.$emit("update:showModel", false);
    },
    saveInfo() {
      var that = this;
      this.$refs["dataInfo"].validate(valid => {
        if (valid) {
            that.$api.saveUserPassword(that.modelInfo).then(res => {
                if (res.code == 1) {
                    that.handleCancel();
                    that.$api.doLogout().then(res => {
                        if (res.code == 1) {
                            Cookies.remove("SuserId");
                            window.location.href = "/";
                        }
                    });
                }else{
                    this.$sfNotify({
                        duration: 0,
                        type: "error",
                        message: res.message
                    });
                }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style ref="stylesheet/scss" lang="scss" scoped>
.box-outer {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  width: 408px;
  padding: 0 32px 32px;
  background: rgba(255, 255, 255, 1);
  transform-origin: center;
  border-radius: 4px;

  .cancel {
    display: block;
    position: absolute;
    top: -40px;
    right: 0;
    width: 28px;
    height: 28px;
    cursor: pointer;
  }

  .box-title {
    padding: 24px 0;
    font-size: 16px;
    color: rgba(51, 51, 51, 1);
    line-height: 24px;
  }

  .box-list {
    padding-bottom: 24px;
    .list-left {
      float: left;
      font-size: 12px;
      color: rgba(102, 102, 102, 1);
      line-height: 36px;
      i {
        color: #FF6632;
      }
    }

    .list-right {
      margin-left: 82px;

      .el-form-item {
        width: 252px;
      }
    }
  }

  .box-btn {
    padding: 0 6px;
    display: flex;
    justify-content: space-between;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
