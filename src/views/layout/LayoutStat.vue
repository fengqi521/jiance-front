<template>
  <div class="app-wrapper">
    <Navbar ref="navBar" />
    <SidebarStat />
    <div class="stat-banner">
      <img :src="require('assets/img/stat-banner.png')" />
      <div class="stat-banner-word">第三方运营商：{{operator}}</div>
    </div>
    <App-main />
  </div>
</template>

<script>
import { Navbar, AppMain, SidebarStat } from "views/layout";

export default {
  name: "layout",
  components: {
    Navbar,
    AppMain,
    SidebarStat,
  },
  data() {
    return {
      operator:  (this.$route.query&&this.$route.query.title)||'',
    }
  }
};
</script>
<style lang="scss" scoped>
.stat-banner {
  position: sticky;
  top: 60px;
  z-index: 10;
  height: 40px;
  background: #ffedcf;
  padding: 11px 32px 11px 208px;
  margin-bottom: -24px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 16px;
    height: 16px;
    margin-right: 12px;
  }

  .stat-banner-word {
    font-size: 14px;
    color: #fa830f;
    line-height: 18px;
  }
}
</style>
