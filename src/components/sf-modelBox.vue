<template>
  <transition name="fade">
    <div
      v-if="showModel"
      class="model-box model"
    >
      <div :class="['box-outer',`box-outer--${type}`]">
        <img
          class="cancel"
          :src="require('assets/img/cancel.png')"
          @click="$emit('update:showModel', false)"
          alt=""
        >
        <div class="box-main">
          <div class="box-title">{{title}}</div>
          <div class="box-content">
            <slot>
              {{text}}
            </slot>
          </div>
          <div class="box-bottom clearfix" v-if="show_flag">
            <div
              :class="`btn_${type}`"
              @click="saveInfo"
            >确认</div>
            <div
              class="btn_cancel"
              @click="$emit('update:showModel', false)"
            >取消</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "sfModelBox",
  props: {
    showModel: {
      type: Boolean
    },
    type: {
      type: String,
      default: "succ"
    },
    title: {
      type: String,
      default: ""
    },
    show_flag:{
      type: Boolean,
      default:true
    },
    text: {
      type: String
    }
  },
  methods: {
    saveInfo() {
      this.$emit("change");
    },
    cancleInfo() {
      this.$emit("change");
    }
  }
};
</script>

<style ref="stylesheet/scss" lang="scss">
.model-box {
  .box-outer {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 408px;
    padding: 0 32px 32px;
    background: rgba(255, 255, 255, 1);
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

    .box-content {
      padding: 24px 0;
      font-size: 12px;
      color: #333;
      line-height: 20px;

      .ele-red{
        color:$elec-red;
      }
    }

    .box-list {
      padding-bottom: 24px;
      &:last-child {
        padding-bottom: 0;
      }
      .box-left {
        float: left;
        font-size: 12px;
        color: rgba(102, 102, 102, 1);
        line-height: 36px;
      }

      .box-right {
        margin-left: 48px;
      }
    }
    .box-bottom {
      padding: 0 6px;
    }
  }

  // 删除 css
  .box-outer--delete {
    .box-content {
      color: rgba(255, 88, 89, 1);
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