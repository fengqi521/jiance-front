<template>
  <div class="app-wrapper">
    <Navbar ref="navBar" />
    <Sidebar />
    <App-main />
  </div>
</template>

<script>
import { Navbar, AppMain, Sidebar } from "views/layout";

export default {
  name: "layout",
  components: {
    Navbar,
    AppMain,
    Sidebar
  }
};
</script>
