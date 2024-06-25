<template>
  <transition
          name="sf-notification-fade"
          @after-leave="handleAfterLeave"
  >
    <div
            v-show="visible"
      :class="[
        'sf-notification',
        type ? `sf-notification--${type}` : '',
        customClass,
      ]"
            :style="positionStyle"
    >
      <i class="notify-icon"></i>
      <!-- <slot> -->
      <p v-if="!dangerouslyUseHTMLString" class="sf-notification__content">
        {{ message }}
      </p>
      <p v-else v-html="message" class="sf-notification__content"></p>
      <!-- </slot> -->
      <div
              class="sf-icon-close"
              v-if="showClose"
              @click.stop="close"
      ></div>
    </div>
  </transition>
</template>
<script>
  export default {
    name: "sfNotify",
    components: {},
    data() {
      return {
        onClose: null,
        visible: false,
        closed: false,
        message: "",
        type: "success",
        customClass:'',
        duration: 3000,
        verticalOffset: 72,
        dangerouslyUseHTMLString: false,
        showClose: true
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