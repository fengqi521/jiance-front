<template>
  <div class="app-wrapper">
    <Navbar ref="navBar" />
    <Sidebar />
    <App-main />
  </div>
</template>

<script>
import Navbar from './Navbar.vue'
import Sidebar from './Sidebar.vue'
import AppMain from './AppMain.vue'

export default {
  name: "layout",
  components: {
    Navbar,
    AppMain,
    Sidebar
  }
};
</script>
