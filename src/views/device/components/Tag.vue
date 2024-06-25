<template>
  <div class="tag-container">
    <el-tag :key="tag" v-for="tag in value" closable :disable-transitions="false" @close="handleClose(tag)">
      {{ tag }}
    </el-tag>
    <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small"
      @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm" :maxlength="20">
    </el-input>
    <span v-if="!inputVisible && value.length < 5" class="btn_succ button-new-tag" size="small"
      @click="showInput">添加标签</span>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      inputVisible: false,
      inputValue: ''
    }
  },
  methods: {
    // 删除标签
    handleClose (tag) {
      const lists = this.value.filter(item => item !== tag)
      this.$emit('input', lists)
    },

    // 添加标签
    handleInputConfirm () {
      let inputValue = this.inputValue.trim();
      if (inputValue) {
        this.$emit('input', [...this.value, inputValue])
      }
      this.inputVisible = false;
      this.inputValue = '';
    },

    // 显示输入框
    showInput () {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
  }
}
</script>
<style lang="scss" scoped>
.tag-container {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.el-tag {
  margin: 6px 10px 6px 0;
  height: 24px;
  line-height: 24px;
  color: #0087FF;
}

.input-new-tag {
  margin-right: 10px;
  width: 200px;
}

.button-new-tag {
  float: none;
  display: inline-block;
  width: auto;
  padding: 0 8px;
  font-size: 12px;
  margin-right: 10px;
  height: 24px;
  line-height: 24px;
}
</style>