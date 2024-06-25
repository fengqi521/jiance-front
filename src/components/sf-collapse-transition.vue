<template>
  <transition
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-on:leave="leave"
    v-bind="$attrs"
  >
    <slot></slot>
  </transition>

</template>

<script>
export default {
  name: "sfCollapseTransition",
  methods: {
    beforeEnter: function(el) {
      el.style.opacity = 0;
      el.style.height = 0;
    },
    enter: function(el, done) {
      setTimeout(() => {
        done();
      }, 200);

      if (el.scrollHeight !== 0) {
        el.style.height = el.scrollHeight + "px";
      } else {
        el.style.height = "";
      }

      el.style.opacity = 1;
    },
    leave: function(el, done) {
      setTimeout(() => {
        done();
      }, 200);
      el.style.height = 0;
      el.style.opacity = 0;
      el.style.padding = 0;
    }
  }
};
</script>

<style>
</style>