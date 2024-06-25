<template>
  <nav>
    <Logo />
    <div class="nav-right">
      <!-- 日期 -->
      <CurrentTime />
      <!-- 账号信息 -->
      <Avatar :avatarUrl="avatarUrl" :userName="userName" :role="role" />
      <!-- 退出 -->
      <SignOut />
    </div>
  </nav>
</template>

<script>
import { Logo, Avatar, CurrentTime, SignOut } from './components'
export default {
  components: {
    Logo,
    Avatar,
    CurrentTime,
    SignOut
  },
  data() {
    return {
      role: '超级管理员',
      userName: Cookies.get("SuserId") ? Cookies.get("SuserId") : "游客",
      avatarUrl: 'http://5b0988e595225.cdn.sohucs.com/images/20190816/8afe3bfafdfa43a5ad75f0150af013df.jpeg',
      // LOGO: Cookies.get("SuserLogo") ? Cookies.get("SuserLogo") : ""
    };
  },
  mounted() {

  },
  methods: {
    onDropDown() {
      this.showSelect = !this.showSelect;
    },
    doLogout() {
      this.$api.doLogout().then(res => {
        if (res.code == 1) {
          Cookies.remove("SuserId");
          localStorage.removeItem('USER_MENU');
          window.location.href = "/";
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.nav-right {
  display: flex;
  align-items: center;
}
</style>



