<template>
  <div v-html="html">
  </div>
</template>

<script>
export default {
  data() {
    return {
      html:'',
      type: this.$route.params.type,
      uid:this.$route.params.id
    };
  },
  methods: {
    refreshRem(desW) {
      var winW = document.documentElement.clientWidth;
      document.documentElement.style.fontSize = winW / desW * 100 + 'px'
    },
    getHtml(){
        this.$api.getAppDesc({id:this.uid,type:this.type}).then(res=>{
          if(res.code == 1){
            this.html = res.data.desc
          }else{
            this.html = '暂无数据';
          }
        })
    }
  },
  //创建前设置
  mounted() {
    this.refreshRem(350);
    window.addEventListener('resize', this.refreshRem(350));
    window.addEventListener('touchstart', function () { });
    document.querySelector("body").setAttribute("style", "min-width:350px");
    document.querySelector("#app22").setAttribute("style", "min-width:350px");
    this.getHtml()
  },
  //销毁前清除
  beforeDestroy() {
    document.querySelector("body").removeAttribute("style");
    document.querySelector("#app22").removeAttribute("style");
  },
};
</script>

<style lang="scss" scoped>
  .top{
    text-align: center;
    width:100%;
    font-size: 16px;
    margin-bottom: 10px;
  }
  div{
    width:100%;
    font-size: 16px;
    padding-top: 16px;
    padding-left: 20px;
    padding-right: 20px;
  }
  p{
    margin-top: 0px;
    font-size: 14px;
    margin-bottom: 0px;
  }
</style>