<template>
  <div class="download">
      <div class="download-box">
        <div class="down-img"><img src="./img/download.png" alt=""></div>
        <div class="down-type down"><img src="./img/androd.png" alt=""></div>
        <div class="down-type"><img src="./img/iphone.png" alt=""></div>
      </div>
  </div>
</template>

<script>
export default {
  //创建前设置
  mounted() {
    document.querySelector("body").setAttribute("style", "min-width:375px");
    document.querySelector("#app22").setAttribute("style", "min-width:375px");
  },
  //销毁前清除
  beforeDestroy() {
    document.querySelector("body").removeAttribute("style");
    document.querySelector("#app22").removeAttribute("style");
  },
};
</script>

<style lang="scss" scoped>
.download{
    background-color: white;
    height: 724px;
    padding-bottom: 22px;
    .download-box{
        height: 702px;
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
}


</style>