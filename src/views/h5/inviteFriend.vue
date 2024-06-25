<template>
  <div class="inviter-box">
    <div class="invite-banner">
      <div class="invite-top">
        <div class="img-banner">
          <img src="./img/invite-banner.png" alt="" />
        </div>
        <div class="banner-input">
          <input maxlength="11" type="tel" v-model.trim="telPhone" @input="telPhone = telPhone.replace(/[^\d]/g, '')" placeholder="请输入电话号码"/>
        </div>
        <div class="banner-input banner-input-code">
          <input type="tel" maxlength="8" v-model.trim="telCode" @input="telCode = telCode.replace(/[^\d]/g, '')" placeholder="请输入验证码" />
          <span v-if="show" class="get-code" @click="getCode">获取验证码</span>
          <span v-if="!show" class="count">{{ count }}s后再次获取</span>
        </div>
        <div class="banner-input banner-input-accept" @click="register">
          <button>接受邀请</button>
        </div>
      </div>
    </div>
    <div class="invite-ctivity">
      <div class="activity-rule">活动规则</div>
      <div class="ac-border"></div>
      <div class="ac-word">{{content}}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: true,
      count: "",
      timer: null,

      telPhone:'',
      telCode:'',
      id:this.$route.params.id,
      content:'',
      group_id:''
    };
  },
  methods: {
    getCode() {
      if(this.timer){
          this.$sfNotify({
              duration: 0,
              type: "error",
              message: '请稍后再试',
              customClass:'h5_style'
          });
          return false;
      }
      this.$api.getInviteCode({id:this.id,phone:this.telPhone}).then(res=>{
            if(res.code == 1){
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
            }else{
                this.$sfNotify({
                    duration: 0,
                    type: "error",
                    message: res.msg,
                    customClass:'h5_style'
                });
                return false;
            }
      })
    },
    register(){
        if(!this.telPhone){
            this.$sfNotify({
                duration: 0,
                type: "error",
                message: '请输入手机号',
                customClass:'h5_style'
            });
            return false;
        }
        if(!this.telCode){
            this.$sfNotify({
                duration: 0,
                type: "error",
                message: '请输入验证码',
                customClass:'h5_style'
            });
            return false;
        }

        this.$api.InviteRegister({id:this.id,phone:this.telPhone,code:this.telCode}).then(res=>{
            if(res.code ==1){
                this.$router.push({ path: "/download/"+this.group_id+'/2' });
            }else{
                this.$sfNotify({
                    duration: 0,
                    type: "error",
                    message: res.msg,
                    customClass:'h5_style'
                });
                return false;
            }
        })
    },
    getInviteConfig(){
      this.$api.getInviteConfig({id:this.id}).then(res=>{
        if(res.code == 1){
          this.content = res.data.invite_h5_note
          this.group_id = res.data.group_id
        }
      })
    }
  },
  //创建前设置
  mounted() {
    document.querySelector("body").setAttribute("style", "min-width:340px");
    document.querySelector("#app22").setAttribute("style", "min-width:340px");
    this.getInviteConfig()
  },
  //销毁前清除
  beforeDestroy() {
    document.querySelector("body").removeAttribute("style");
    document.querySelector("#app22").removeAttribute("style");
  },
};
</script>

<style lang="scss" scoped>
.inviter-box {
  background: #f3f3f3;
  height: 788px;
  .invite-banner {
    height: 416px;
    background: white;
    padding-top: 33px;
    .invite-top {
      height: 290px;
      padding: 0 7px;
      background: url("./img/invite-background.png") no-repeat;
      .img-banner {
        width: 100%;
        height: 198px;
      }
      .banner-input {
        width: 100%;
        height: 44px;
        text-align: center;
        input {
          width: 327px;
          height: 44px;
          background: #f3f3f3;
          padding: 0 16px;
          box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.08);
          border-radius: 22px;
        }
      }
      .banner-input-code {
        margin-top: 16px;
        position: relative;
        .get-code {
          position: absolute;
          right: 40px;
          top: 12px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #CAA040;
          line-height: 20px;
        }
        .count{
          position: absolute;
          right: 28px;
          top: 12px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
          line-height: 20px;
        }
      }
      .banner-input-accept {
        margin-top: 16px;
        width: 100%;
        height: 20px;
        text-align: center;
        button {
          width: 327px;
          height: 46px;
          background: #CAA040;
          border-radius: 100px;
          padding: 0 16px;
          box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.08);
          border: none;
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #ffffff;
          line-height: 22px;
          outline: none;
          /* -webkit-tap-highlight-color: rgba(0, 0, 0, 0); */
          -webkit-tap-border-radius: 100px;
          /* -webkit-user-modify: read-write-plaintext-only; */
        }
      }
    }
  }
  .invite-ctivity {
    margin-top: 10px;
    background: white;
    pre {
      white-space: pre-wrap;
      white-space: -moz-pre-wrap;
      white-space: -pre-wrap;
      white-space: -o-pre-wrap;
      word-wrap: break-word;
    }
    .activity-rule {
      padding: 21px 0;
      margin: 0 24px;
      font-size: 18px;
      font-weight: bold;
      color: #333333;
      line-height: 18px;
      /* border-bottom: 1px solid #EAEAEA; */
    }
    .ac-border {
      margin: 0 16px;
      border-top: 1px solid #eaeaea;
    }
    .ac-word {
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
      line-height: 20px;
      padding: 0 24px;
      padding-bottom: 16px;

      white-space: pre-wrap;       /* css-3 */
      white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
      white-space: -pre-wrap;      /* Opera 4-6 */
      white-space: -o-pre-wrap;    /* Opera 7 */
      word-wrap: break-word;       /* Internet Explorer 5.5+ */
      word-break:break-all;
      overflow:hidden;
    }
  }
}
</style>