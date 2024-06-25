<template>
  <div class="inviter-box" :style="background">
    <div class="wxtip" v-if="show_tip" @click="hiddenTip">
      <span class="wxtip-icon"></span>
    </div>
    <div class="invite-banner">
      <div class="invite-top">
        <div class="img-banner">
          <img :src="img_url" alt="" />
        </div>
      </div>
    </div>
    <div class="invite-ctivity">
      <div class="banner-btn-c" @click="openApp">
        <div class="btn">打开APP</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        show_tip:false, //控制弹出层的显示与否
        ENV: process.env.NODE_ENV == "development" ? "/api" : "",
        type:1,
        ios_value:'',
        show: true,
        count: "",
        timer: null,

        telPhone:'',
        telCode:'',
        group_id:this.$route.params.group_id,
        img_url:'',
        background:{
          background:'#70B08F'
        }
      };
    },
    methods: {
      hiddenTip(){
        this.show_tip = false
      },
      openApp(){
        var ua = navigator.userAgent;
        var isWeixin = !!/MicroMessenger/i.test(ua);
        if(isWeixin){
          this.show_tip = true;
        }else{
          this.jump()
        }
      },
      jump(){
        var that = this
        try{
          var ua = navigator.userAgent.toLowerCase();
          var t;
          var config = {
            /*scheme:必须*/
            scheme_IOS: 'lspile://activity?type='+this.type,
            scheme_Adr: 'lspile://activity?type='+this.type,
            timeout: 300
          };
          var startTime = Date.now();
          if(ua.indexOf('os')>0){
            location.href = 'lspile://activity?type=1';
            var ios_t = setTimeout(function() {
              that.$router.push({ path: "/download/"+that.group_id+'/1' });
            },500)
            window.onblur = function() {
              clearTimeout(ios_t);
            }
          }else{
            location.href = "lspile://activity?type=1";
            var t = setTimeout(function() {
              that.$router.push({ path: "/download/"+that.group_id+'/1' });
            }, 1200);
            window.onblur = function() {
              clearTimeout(t);
            }
          }
        }catch(err){
          console.log(err.description)
        }

      },
      getPlatformConfig(){
        this.$api.getPlatformConfig({group_id:this.group_id}).then(res=>{
          if(res.code == 1){
            this.img_url = `${this.ENV}`+res.data.activity_img
            this.background.background = res.data.activity_backgroud_color
          }
        })
      }
    },
    //创建前设置
    mounted() {
      document.querySelector("body").setAttribute("style", "min-width:340px");
      document.querySelector("#app22").setAttribute("style", "min-width:340px");
      this.getPlatformConfig()
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
  background: #70B08F;
  height: 724px;
  .invite-banner {
    height: 482px;
    .invite-top {
      height: 482px;
      background: url("./img/invite-background.png") no-repeat;
      .img-banner {
        width: 100%;
        height: 482px;
      }
    }
  }
  .invite-ctivity {
    height: 121px;
    margin-top: 10px;
    .banner-btn-c {
      display: flex !important;
      margin-top: 16px;
      width: 100%;
      height: 46px;
      text-align: center;
      .btn {
        z-index: 9999;
        width: 327px;
        height: 46px;
        background: #FFFFFF;;
        margin: 0 auto;
        line-height:  46px;
        
        border-radius: 100px;
        padding: 0 16px;
        box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.08);
        border: none;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 500;
        color: #333333;
        outline: none;
        -webkit-tap-border-radius: 100px;
      }
    }
  }
  .wxtip{
    background: #333333; text-align: center; width: 100%; height: 70px;}
  .wxtip-icon{
    background: url("./img/weixin-tip.svg") no-repeat; display: block; position: absolute;
    width:311px;
    height:46px;
    margin-top: 12px;
    left: 50%;
    margin-left: -155px;
  }
  .wxtip-txt{
    margin-top: 107px; color: #fff; font-size: 16px; line-height: 1.5;}
}

</style>