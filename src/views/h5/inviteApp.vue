<template>
  <div class="downloadx">
      <div class="wxtip" v-if="show_tip" @click="hiddenTip">
          <span class="wxtip-icon"></span>
      </div>
      <div class="downloadx-box">
        <div class="down-img"><img :src="img_url" alt=""></div>
          <div class="down-type down" @click="openAndroid"><img src="./img/androd.png" alt=""></div>
          <div class="down-type" @click="openIos"><img src="./img/iphone.png" alt=""></div>
      </div>
  </div>
</template>

<script>
export default {
    data(){
        return{
            show_tip:false, //控制弹出层的显示与否
            type:this.$route.params.type, // 1代表组队 2代表邀新
            group_id:this.$route.params.group_id,
            ENV: process.env.NODE_ENV == "development" ? "/api" : "",
            img_url:'',
            android_url:'',
            ios_url:''
        }
    },
    methods: {
        hiddenTip(){
            this.show_tip = false
        },
        openAndroid(){
            var that = this
            var ua = navigator.userAgent;
            var isWeixin = !!/MicroMessenger/i.test(ua);
            if(isWeixin){
                this.show_tip = true;
            }else{
                if(this.type == 1){
                    location.href = 'lspile://activity?type=1';
                }else{
                    location.href = 'lspile://invitation?type=1';
                }
                var startTime = Date.now();
                var t = setTimeout(function() {
                    var endTime = Date.now();
                    if (!startTime || endTime - startTime < 1000 + 200) {
                            window.location = that.android_url;
                    }
                }, 1000);
                window.onblur = function() {
                    clearTimeout(t);
                }
            }
        },
        openIos(){
            var that = this
            var ua = navigator.userAgent;
            var isWeixin = !!/MicroMessenger/i.test(ua);
            if(isWeixin){
                this.show_tip = true;
            }else{
                if(this.type == 1){
                    location.href = 'lspile://activity?type=1';
                }else{
                    location.href = 'lspile://invitation?type=1';
                }
                var ios_t = setTimeout(function() {
                    location.href = that.ios_url;
                },500)
                window.onblur = function() {
                    clearTimeout(ios_t);
                }
            }
        },
        getPlatformConfig(){
            this.$api.getPlatformConfig({group_id:this.group_id}).then(res=>{
                if(res.code == 1){
                    this.img_url = `${this.ENV}`+res.data.app_download_img
                    this.android_url = res.data.app_android_url
                    this.ios_url = res.data.app_ios_url
                }
            })
        }
    },
  //创建前设置
  mounted() {
    document.querySelector("body").setAttribute("style", "min-width:375px");
    document.querySelector("#app22").setAttribute("style", "min-width:375px");
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
.downloadx{
    background-color: white;
    height: 702px;
    .downloadx-box{
        height: 579px;
        background: url('./img/download-background.png') no-repeat;
        display: flex;
        flex-direction: column;
        align-items: center;
        .down-img{
            margin-top: 56px;
            img{
                width: 196px;
                height: 216px;
            }
        }
        .down{
            margin: 40px 0 8px 0;
        }
        .down-type{
            width: 230px;
            height: 71px;
            img{
                width: 100%;
                height: 100%;
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