<template>
  <div class="app-main">
    <transition
      name="fade"
      mode="out-in"
    >
      <router-view
        :key="key"
        v-bind:role-type="roleType"
      ></router-view>
    </transition>
  </div>
</template>

<script>
//使用组件步骤：
//1.通过import语法导入组件
//2.在当前vue实例注册组件（全局、局部注册），以下components就是局部组件名称Levelbar
//3.注册完，如何使用？直接在当前模板中通过<>中放组件名的形式使用组件。
export default {
  name: "AppMain",
  props: ["barType", "roleType"],
  computed: {
    key() {
      return this.$route.name !== undefined
        ? this.$route.name + +new Date()
        : this.$route + +new Date();
    }
  }
};
</script>
