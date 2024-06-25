<template>
  <div
    :class="[type =='textarea'?'sf-textarea':'sf-input']"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
  >
    <!-- input -->
    <template v-if="type!== 'textarea'">
      <input
        ref="input"
        :class="[
        isEmpty ?'input-error':'',
        {
          'show-limit-input':showWordLimit,
          'show-clear-input':clearable,
        }
        ]"
        :type="type"
        :maxlength="maxlength"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        :disabled="inputDisabled"
        @focus="handleFocus"
        @blur="handleBlur"
        @input="handleInput"
        @keydown="handleKeydown"
      />
      <div class="edit-item">
        <i
          v-if="showClear"
          class="clear-icon"
          @click="clear"
        ></i>
        <span
          v-if="showWordLimit"
          class="input-real-number"
        ><i
            v-if="value && value.length>0"
            style="color:#666;"
          >{{value.length}}</i><i v-else>0</i>/{{maxlength}}
        </span>
      </div>
      <div
        v-if="isEmpty"
        class="error-msg"
      >{{errmsg}}</div>

    </template>
    <!-- textarea -->
    <template v-else>
      <textarea
        ref="input"
        :class="[isEmpty ?'input-error':'']"
        :placeholder="placeholder"
        type="text"
        :maxlength="maxlength"
        :autocomplete="autocomplete"
        :disabled="inputDisabled"
        @focus="handleFocus"
        @blur="handleBlur"
        @input="handleInput"
      />
      <!-- <i v-if="showClear" class="clear-icon" @click="clear"></i> -->
      <div v-if="isEmpty" class="error-msg">{{errmsg}}</div>
      <div v-if="showWordLimit" class="textarea-real-number">
        <i
            v-if="value && value.length>0"
            style="color:#666;"
          >{{value.length}}</i><i v-else>0</i>/{{maxlength}}
      </div>
    </template>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "sfInput",
  props: {
    value: [String, Number],
    isEmpty: Boolean,
    disabled: Boolean,
    placeholder: String,
    errmsg: String,
    clearable: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: "text"
    },
    maxlength: {
      type: [String, Number],
      default: "500"
    },
    autocomplete: {
      type: String,
      default: "off"
    },
    showSpace: {
      type: Boolean,
      default: false
    },
    showWordLimit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      hovering: false,
      focused: false
    };
  },
  computed: {
    nativeInputValue() {
      return this.value === null || this.value === undefined
        ? ""
        : String(this.value);
    },
    showClear() {
      return (
        this.clearable &&
        !this.inputDisabled &&
        this.nativeInputValue &&
        (this.hovering || this.focused)
      );
    },
    inputDisabled() {
      return this.disabled;
    }
  },

  watch: {
    nativeInputValue() {
      this.setNativeInputValue();
    }
  },
  mounted() {
    this.setNativeInputValue();
  },

  methods: {
    setNativeInputValue() {
      const input = this.$refs.input;
      if (!input) return;
      if (input.value === this.nativeInputValue) return;
      input.value = this.nativeInputValue;
    },

    handleInput(event) {
      if (event.target.value) this.$emit("update:isEmpty", false);
      if (event.target.value === this.nativeInputValue) return;
      this.$emit("input", event.target.value);
      this.$nextTick(this.setNativeInputValue);
    },
    handleFocus() {
      this.focused = true;
    },
    handleBlur() {
      this.focused = false;
    },
    clear() {
      this.$emit("input", "");
    },
    handleKeydown(event) {
      var keyCode_ary = [8, 37, 39];
      if (
        (event.keyCode == 32 && (this.type == "password" || !this.showSpace)) ||
        (this.type == "number" &&
          !/\d/.test(event.key) &&
          keyCode_ary.indexOf(event.keyCode) == -1)
      ) {
        event.preventDefault();
        event.returnValue = false;
      }
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
.sf-input,
.sf-textarea {
  position: relative;

  input,
  textarea {
    width: 100%;
    height: 100%;
    padding: 7px 12px;
    font-size: 12px;
    line-height: 16px;
    color: #222;
    background: rgba(255, 255, 255, 1);
    border-radius: 2px;
    border: 1px solid rgba(224, 224, 224, 1);

    &.show-clear-input{
      padding-right:34px;
    }
    &.show-limit-input{
      padding-right:70px;
    }
   
    &:focus {
      box-shadow: 0px 0px 2px 0px rgba(76, 137, 255, 0.7);
      border-radius: 2px;
      border: 1px solid rgba(76, 137, 255, 1);
    }

    &.input-error {
      box-shadow: 0px 0px 2px 0px rgba(255, 88, 89, 1);
      border: 1px solid rgba(255, 88, 89, 1);
    }
  }

  .textarea-real-number {
    position: absolute;
    bottom: 6px;
    right: 10px;
    font-size: 12px;
    color: #999999;
    line-height: 20px;
  }

  .edit-item {
    position: absolute;
    display: block;
    top: 0;
    bottom: 0;
    margin: auto;
    right: 12px;
    height: 16px;

    .input-real-number {
      margin-left: 8px;
      float: left;
      font-size: 12px;
      color: #999999;
      line-height: 16px;
    }

    .clear-icon {
      margin-left: 8px;
      float: left;
      display: block;
      width: 16px;
      height: 16px;
      background: url("../assets/img/clear-icon.png") no-repeat;
      background-size: cover;
      cursor: pointer;

      &:hover {
        background: url("../assets/img/clear-icon-hover.png") no-repeat;
        background-size: cover;
      }
    }
  }
}

.sf-textarea .error-msg {
  position: relative;
  padding-top: 2px;
  top: 0;
}

.error-msg {
  position: absolute;
  top: 38px;
  left: 0;
  padding-top: 4px;
  font-size: 11px;
  color: rgba(255, 88, 89, 1);
  line-height: 13px;
  transform-origin: left;
  transform: scale(0.9);
  -webkit-transform: scale(0.9);
  white-space: nowrap;
}
</style>