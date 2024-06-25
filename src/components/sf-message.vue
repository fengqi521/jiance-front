<template>
  <transition
    name="sf-message-fade"
    @after-leave="handleAfterLeave"
  >
    <div
      v-show="visible"
      :class="['sf-message', type ? `sf-message--${type}` : '']"
      :style="positionStyle"
    >
      <i :class="['message-icon', `message-${type}-icon`]"></i>
      <!-- <slot> -->
      <p v-if="!dangerouslyUseHTMLString" class="sf-message__content">
        {{ message }}
      </p>
      <p v-else v-html="message" class="sf-message__content"></p>
      <!-- </slot> -->
    </div>
  </transition>
</template>
<script>
export default {
  name: "sfMessage",
  components: {},
  data() {
    return {
      onClose: null,
      visible: false,
      closed: false,
      message: "",
      type: "info",
      duration: 3000,
      verticalOffset: 20,
      dangerouslyUseHTMLString: false
    };
  },
  watch: {
    closed(newVal) {
      if (newVal) {
        this.visible = false;
      }
    }
  },
  computed: {
    positionStyle() {
      return {
        top: `${this.verticalOffset}px`
      };
    }
  },
  mounted() {
    this.startTimer();
  },
  methods: {
    close() {
      this.closed = true;
      if (typeof this.onClose === "function") {
        this.onClose(this);
      }
    },
    startTimer() {
      if (this.duration > 0) {
        this.timer = setTimeout(() => {
          if (!this.closed) {
            this.close();
          }
        }, this.duration);
      }
    },
    handleAfterLeave() {
      this.$destroy(true);
      this.$el.parentNode.removeChild(this.$el);
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
.sf-message {
  min-width: 200px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 4px;
  position: fixed;
  left: 50%;
  top: 50%;
  -webkit-transform: translateX(-50%, -50%);
  transform: translate(-50%, -50%);
  -webkit-transition: opacity 0.3s, top 0.4s, -webkit-transform 0.4s;
  transition: opacity 0.3s, top 0.4s, -webkit-transform 0.4s;
  transition: opacity 0.3s, transform 0.4s, top 0.4s;
  transition: opacity 0.3s, transform 0.4s, top 0.4s, -webkit-transform 0.4s;
  overflow: hidden;
  padding: 24px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  flex-direction: column;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  z-index: 20000;
}

.sf-message .message-icon {
  margin: 0 auto;
  display: block;
  width: 32px;
  height: 32px;
}

.sf-message__content {
  padding-top: 13px;
  font-size: 14px;
  color: rgba(255, 255, 255, 1);
  line-height: 24px;
}

.sf-message-fade-enter,
.sf-message-fade-leave-active {
  opacity: 0;
  -webkit-transform: translate(-50%, -100%);
  transform: translate(-50%, -100%);
}
</style>
