<template>
  <nav>
    <div class="logo">
      <!-- <img :src="`${ENV}${LOGO}`" alt="">
      <router-link to="/"></router-link> -->
    </div>
    <div class="nav-right">
      <!-- 账号资料 -->
      <div class="account-outer" :class="[showSelect ? 'dropdown-open' : '']">
        <div class="user-name ellipsis" @click.stop="onDropDown">{{ username }}</div>
        <!-- 下拉框 -->
        <div class="dropdown-outer">
          <div class="dropdown-inner">
            <router-link to="/info" class="dropdown-item">账号资料</router-link>
            <div class="dropdown-item" @click="doLogout">退出</div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data () {
    return {
      ENV: process.env.NODE_ENV == "development" ? "/api" : "",
      showSelect: false,
      username: Cookies.get("SuserId") ? Cookies.get("SuserId") : "游客",
      LOGO: Cookies.get("SuserLogo") ? Cookies.get("SuserLogo") : ""
    };
  },
  mounted () {
    var that = this;
    document.addEventListener("click", e => {
      that.showSelect = false;
    });
  },
  methods: {
    onDropDown () {
      this.showSelect = !this.showSelect;
    },
    doLogout () {
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



