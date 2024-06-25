<template>
  <div class="container" v-html="html">
  </div>
</template>

<script>
export default {
  data() {
    return {
      html:'',
      group_id:this.$route.params.group_id
    };
  },
  methods: {
    refreshRem(desW) {
      var winW = document.documentElement.clientWidth;
      document.documentElement.style.fontSize = winW / desW * 100 + 'px'
    },
    getHtml(){
      this.$api.getQuestion({group_id:this.group_id}).then(res=>{
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
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .container{
    background: #fff;
    font-size: .14rem;
    padding: .2rem;
    color: rgba(89, 114, 119, 1);
    /*width: 100%;*/
    /*height:100% ;*/
    /*position: fixed;*/
    /*top: 0;*/
    /*left: 0;*/
    /*  .textarea{*/
    /*    height: 100%;*/
    /*  }*/
    /*  #textarea{*/
    /*      border:0;*/
    /*  }*/
  }
  pre {
      /*white-space: pre-wrap;*/
      /*white-space: -moz-pre-wrap;*/
      /*white-space: -pre-wrap;*/
      /*white-space: -o-pre-wrap;*/
      /*word-wrap: break-word;*/

      white-space: pre-wrap;       /* css-3 */
      white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
      white-space: -pre-wrap;      /* Opera 4-6 */
      white-space: -o-pre-wrap;    /* Opera 7 */
      word-wrap: break-word;       /* Internet Explorer 5.5+ */
      word-break:break-all;
      overflow:hidden;

  }
  .detail{
    padding: .2rem 0;
  }
</style>