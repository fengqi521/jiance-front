<template>
  <el-tooltip :popper-class="popperClass" :content="content" :placement="placement" :disabled="disabled">
    <slot />
  </el-tooltip>
</template>
<script>
export default {
  name: 'sfTooltip',
  props: {
    content: {
      type: String,
      default: ''
    },
    placement: {
      type: String,
      default: 'top'
    },
    line: {
      type: Number,
      default: 1
    },
    parentPadding: {
      type: Number,
      default: 0
    },
    maxHeight: {
      type: Number,
      default: 36
    },
    popperClass: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      disabled: false
    }
  },
  watch: {
    content: {
      handler (val) {
        this.$nextTick(() => {
          this.disabled = !this.content.length || this.visibleStatus()
        })
      },
      immediate: true,
    },

  },
  methods: {
    visibleStatus () {
      try {
        const ele = this.$slots.default[0].elm
        let parentWidth = ele.parentNode.offsetWidth
        let contentWidth = ele.scrollWidth

        if (this.parentPadding > 0) {
          contentWidth += this.parentPadding
        }

        if (this.line > 1) {
          let contentTotalHeight = ele.scrollHeight;
          return contentTotalHeight <= this.maxHeight
        }

        if (ele.previousElementSibling) {
          const siblingWidth = ele.previousElementSibling.offsetWidth;
          return (contentWidth + siblingWidth) < parentWidth
        }

        return contentWidth <= parentWidth
      } catch (error) {
        console.log(error)
      }

    }
  }

}
</script>
