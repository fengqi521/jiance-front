<template>
  <div class="">
    <Navbar />
    <div v-if="showDeviceTab" class="main-container">
      <div class="main-section">
        <!-- 设备导航栏 -->
        <div class="device-nav">
          <router-link to="/device/index" :class="$route.path.indexOf('/device/index') != -1?'nav-act':''">设备模版</router-link>
          <router-link to="/device/list" :class="$route.path.indexOf('/device/list') != -1?'nav-act':''">设备列表</router-link>
          <router-link to="/device/ota" :class="$route.path.indexOf('/device/ota') != -1?'nav-act':''">设备OTA</router-link>
          <router-link to="/device/parser" :class="$route.path.indexOf('/device/parser') != -1?'nav-act':''">协议解析器</router-link>
        </div>

        <App-main />
      </div>
    </div>
    <div v-else>
      <App-main />
    </div>

  </div>

</template>

<script>
import { Navbar, AppMain } from "views/layout";

export default {
  name: "deviceLayout",
  components: {
    Navbar,
    AppMain
  },
  computed:{
    showDeviceTab(){
      let arr = ['/device/machine','/device/machineList','/device/addParser','/device/test','/device/record'];
      return arr.indexOf(this.$route.path) == -1
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.main-container {
  padding: 32px 40px 40px;

  .main-section {
    padding: 0 24px 24px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.06);
    border-radius: 8px;

    .device-nav {
      border-bottom: 2px solid #e5e9ef;

      a {
        display: inline-block;
        position: relative;
        margin-right: 32px;
        padding: 16px 0;
        font-size: 16px;
        color: rgba(34, 34, 34, 1);
        line-height: 24px;

        &.nav-act:after {
          position: absolute;
          display: block;
          content: "";
          bottom: -2px;
          width: 100%;
          height: 2px;
          background: #4c89ff;
        }
      }
    }
  }
}
</style>