<template>
  <div class="login">
    <nav>
      <div class="logo">
        <img :src="`${ENV}/logo/logo.png`" alt="">
        <router-link to="/"></router-link>
      </div>
    </nav>
    <div class="section-main">
      <div class="section-login">
        <span class="login-bg"></span>
        <div class="login-main">
          <div class="login-title">登 录</div>
          <el-form
            :model="model_info"
            ref="dataInfo"
            :rules="dataInfoRules"
          >
            <div class="login-list">
              <el-form-item prop="name">
              <el-input
                v-model="model_info.account"
                placeholder="请输入用户名"
              />
              </el-form-item>
            </div>
            <div class="login-list">
              <el-form-item prop="password">
                <el-input
                  v-model.trim="model_info.password"
                  type="password"
                  placeholder="请输入密码"
                />
              </el-form-item>
            </div>
          </el-form>

          <div
            :class="['login-btn login_btn_succ', (model_info.account && model_info.password) ?'':'login_btn_disable']"
            @click="doLogin"
          >登 录</div>
        </div>
      </div>
    </div>
    <div class="footer hover-green">{{company_name}}  <a href="https://beian.miit.gov.cn/" target="_blank" class="footer-link">{{record_number}}</a>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ENV: process.env.NODE_ENV == "development" ? "/api" : "",
      model_info: {
        account: "",
        password: ""
      },
      company_name:'--',
      record_number:'--',
      dataInfoRules: {
        account: [{ required: true, message: "* 请输入用户", trigger: "change" }],
        password: [
          { required: true, message: "* 请输入密码", trigger: "change" }
        ]
      }
    };
  },
  mounted(){
    //绑定事件
     window.addEventListener('keyup',this.keyUp);
    this.getCompany()
  },
  destroyed(){
      window.removeEventListener('keyup',this.keyUp,false);
  },
  methods: {
    //键盘回车登录
    keyUp(e){
        //如果是回车则执行登录方法
      if(e.keyCode == 13){
        this.doLogin();
      }
    },
    getCompany(){
      this.$api.getRecordNumber().then(res=>{
        this.company_name = res.data.company_name
        this.record_number = res.data.record_number
      })
    },
    doLogin() {
      this.$refs['dataInfo'].validate(valid => {
        if (valid) {
          this.$api.doLogin(this.model_info).then(res => {
            if (res.code == 1) {
              Cookies.set("SuserId", res.data.username);
                Cookies.set("SuserLogo", res.data.logo_url);
                Cookies.set('auth_info', res.data.auth_info)
              this.$store.commit("SET_UID", res.data.username);
              this.$store.commit("SET_MENU", JSON.stringify(res.data.menus));
              this.$store.commit("SET_ROLE_TYPE", res.data.role_type);
              localStorage.setItem("USER_MENU",JSON.stringify(res.data.menus));
              this.$router.replace(res.data.url);
            } else {
              this.$message.error(res.message);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.login {
  nav {
    z-index: 1;
  }

  .section-main {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 570px;
    height: calc(100vh - 96px);
    overflow: auto;
    z-index: 2;

    .section-login {
      margin: 0 auto;
      width: 842px;
      height: 440px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 8px 12px 0px rgba(90, 104, 200, 0.04),
        0px 8px 30px 0px rgba(90, 104, 200, 0.08);
      border-radius: 10px;

      .login-main {
        margin-left: 360px;
        padding: 0 80px;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .login-title {
          padding-bottom: 40px;
          font-size: 20px;
          color: rgba(51, 51, 51, 1);
          line-height: 26px;
        }

        .login-list {
          position: relative;
          padding-bottom: 24px;
        }

        .login-btn {
          float: none;
          width: 100%;
          height: 40px;
          line-height: 40px;
          color: #fff;
          font-weight: bold;
        }
      
      }
    }

  }
  .footer{
    text-align: center;
    margin-bottom: 24px;
    color:#999999;
    font-size: 12px;
    
  }
}
</style>
