<template>
  <div id="app22">
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>
<script>
export default {
  name: "APP",
  provide () {
    return {
      reload: this.reload,
    };
  },
  data () {
    return {
      isRouterAlive: true
    };
  },
  methods: {
    reload () {
      this.isRouterAlive = false;
      this.$nextTick(function () {
        this.isRouterAlive = true;
      });
    }
  }
};
</script>
