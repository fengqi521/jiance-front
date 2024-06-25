<template>
  <div class="container">
    <h3><span>1</span>停车熄火</h3>
    <p>按照场地导向指引标识或充电站管理人员引导在划线车位停放好车辆，并熄火做准备<br>温馨提示：停车前请在APP确认充电桩可用</p>
    <h3><span>2</span>插枪</h3>
    <p>取下充电枪，连接到车辆充电插座，并确认连接可靠</p>
    <h3><span>3</span>选桩/扫码</h3>
    <p>扫描充电桩上对应二维码，或在APP内选中当前使用的充电桩，点击开始充电即可</p>
    <h3><span>4</span>充电开始</h3>
    <p>正在充电时，车内显示屏会显示“正在充电中”字样，并且功率会慢慢上升</p>
    <h3><span>5</span>充电进度查看</h3>
    <p>通过车内的中控显示屏幕或者充电桩显示屏了解充电进度</p>
    <h3><span>6</span>停止充电</h3>
    <p>可在APP内手动点击停止充电或等待车辆充满自动停止</p>
    <h3><span>7</span>拔枪归还</h3>
    <p>确认充电已停止后，取下充电枪，归位</p>
    <h3><span>8</span>结算支付</h3>
    <p>使用用户余额支付应付费用，个人用户可选择可用优惠券</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  methods: {
    refreshRem(desW) {
      var winW = document.documentElement.clientWidth;
      document.documentElement.style.fontSize = winW / desW * 100 + 'px'
    }
  },
  //创建前设置
  mounted() {
    this.refreshRem(350);
    window.addEventListener('resize', this.refreshRem(350));
    window.addEventListener('touchstart', function () { });
    document.querySelector("body").setAttribute("style", "min-width:350px");
    document.querySelector("#app22").setAttribute("style", "min-width:350px");
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
    position: relative;
    padding: .2rem;
    font-size:.14rem;
    color: #333333;
    font-family:  "PingFang SC", Roboto;
    h3{
      position: relative;
      color: #333333;
      z-index: 1;
      font-weight: bold;
    }

    h3 span{
      margin-right: 10px;
      display: inline-block;
      width: .23rem;
      height: .23rem;
      text-align: center;
      line-height: .18rem;
      border: .02rem solid #333333;
      border-radius: .23rem;
      background: #fff;
    }

    p{
      padding:.11rem 0 .22rem .32rem;
    }
  }

  .container:after{
    display: block;
    content:"";
    position: absolute;
    top: .26rem;
    left: .31rem;
    bottom:1.2rem;
    border-left: .01rem dashed #EAEAEA;
  }


</style>