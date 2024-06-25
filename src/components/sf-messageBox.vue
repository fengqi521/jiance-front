<template>
  <transition name="fade">
    <div
      v-if="showModel"
      class="message-box model"
    >
      <div class="box-outer">
        <img
          class="cancel"
          :src="require('assets/img/cancel.png')"
          @click="$emit('update:showModel', false)"
        >
        <div class="box-title">{{title}}</div>
        <div class="box-content">
          <slot>
            {{text}}
          </slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "sfMessageBox",
  props: {
    showModel: {
      type: Boolean
    },
    title: {
      type: String,
      default: ""
    },
    text: {
      type: String
    }
  }
};
</script>

<style ref="stylesheet/scss" lang="scss">
.message-box {
  .box-outer {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 408px;
    padding: 0 32px 32px;
    background: rgba(255, 255, 255, 1);
    transform-origin: center;
    border-radius: 4px;

    .cancel {
      display: block;
      position: absolute;
      top: -40px;
      right: 0;
      width: 28px;
      height: 28px;
      cursor: pointer;
    }

    .box-title {
      padding-top: 24px;
      font-size: 16px;
      color: rgba(34, 34, 34, 1);
      line-height: 24px;
    }
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>