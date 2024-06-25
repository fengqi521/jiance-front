<template>
  <!-- 分页 -->
  <div class="pagination">
    <div class="paginate-left">总计: {{ totalCount }}条</div>
    <div class="paginate-right">
      <div class="paginate-page">{{ currentPage }}/{{ pageCount }}页</div>
      <div class="paginate-select">
        <el-select v-model="limit" @change="handleLimit">
          <el-option label="12条/页" value="12" />
          <el-option label="24条/页" value="24" />
          <el-option label="36条/页" value="36" />
          <el-option label="48条/页" value="48" />
        </el-select>
      </div>
      <div class="paginate-jump">
        <input
          ref="input"
          type="number"
          :value="currentPage"
          class="jump-input"
          @input="handleInput"
        />
        <span class="jump-go" @click="handleJump">GO</span>
      </div>
      <div class="paginate-center">
        <!-- 上一页按钮 -->
        <!-- :hidden="currentPage == 1" -->
        <div class="first">
          <div class="item-li prev-item" @click="handleStep(2)">
            <span></span>
          </div>
        </div>
        <!-- 下一页按钮 -->
        <!-- :hidden="currentPage == pageCount" -->
        <div class="next">
          <div class="item-li next-item" @click="handleStep(3)">
            <span></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "sfStatpage",
  props: {
    currentPage: {
      type: [String, Number],
      default: 1,
    },
    pageCount: {
      type: [String, Number],
      default: 1,
    },
    totalCount: {
      type: [String, Number],
      default: 0,
    },
    // limit: {
    //   type: [String, Number],
    //   default: 12,
    // },
  },
  data() {
    return {
      current: null,
      showPrevMore: false,
      showNextMore: false,
      pagerCount: 7,
      limit: '12',
    };
  },
  computed: {
    pagers() {
      const pagerCount = this.pagerCount;
      const halfPagerCount = (pagerCount - 1) / 2;

      const currentPage = Number(this.currentPage);
      const pageCount = Number(this.pageCount);

      let showPrevMore = false;
      let showNextMore = false;

      if (pageCount > pagerCount) {
        if (currentPage > pagerCount - halfPagerCount) {
          showPrevMore = true;
        }
        if (currentPage < pageCount - halfPagerCount) {
          showNextMore = true;
        }
      }

      const array = [];
      if (showPrevMore && !showNextMore) {
        const startPage = pageCount - (pagerCount - 2);
        for (var i = startPage; i < pageCount; i++) {
          array.push(i);
        }
      } else if (!showPrevMore && showNextMore) {
        for (var i = 2; i < pagerCount; i++) {
          array.push(i);
        }
      } else if (showPrevMore && showNextMore) {
        const offset = Math.floor(pagerCount / 2) - 1;
        for (var i = currentPage - offset; i <= currentPage + offset; i++) {
          array.push(i);
        }
      } else {
        for (var i = 2; i < pageCount; i++) {
          array.push(i);
        }
      }

      this.showPrevMore = showPrevMore;
      this.showNextMore = showNextMore;

      return array;
    },
  },
  created() {
  },
  methods: {
    // 每页多少条
    handleLimit() {
      this.$emit("limit-change", this.limit);
      this.$emit("pageCount", this.pageCount);
    },
    //  点击上一页/下一页 跳转
    handleStep(type) {
      var that = this;
      var curr_page = Number(that.currentPage);
      var total_page = Number(that.pageCount);

      switch (type) {
        case 1:
          curr_page = 1;
          break;
        case 2:
          if (curr_page > 1) {
            curr_page--;
          } else {
            curr_page = 1;
          }
          break;
        case 3:
          if (curr_page < total_page) {
            curr_page++;
          } else {
            curr_page = total_page;
          }
          break;
        case 4:
          curr_page = total_page;
          break;
      }

      that.current = curr_page;
      that.$emit("current-change", curr_page);
    },

    // 获取跳转目的页的值
    handleInput(event) {
      var _val = event ? event.target.value : "";
      this.current = !isNaN(_val)
        ? _val > this.pageCount
          ? this.pageCount
          : _val < 1
          ? 1
          : _val
        : this.currentPage;
    },

    //  点击GO跳转
    handleJump() {
      const input = this.$refs.input;
      if (input.value == this.currentPage) return;
      input.value = this.current;
      this.$emit("current-change", this.current);
    },
  },
};
</script>
<style lang="scss" scoped>
.pagination {
  padding: 0px;
  display: flex;
  justify-content: space-between;

  .paginate-left {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
    line-height: 30px;
  }

  /deep/.paginate-select {
    margin-right: 8px;
    .el-input__inner {
      width: 88px;
      height: 30px;
      font-size: 14px;
      font-weight: 400;
      color: #333333;
      line-height: 20px;
    }
  }

  .paginate-page {
    position: relative;
    right: 12px;
    font-size: 14px;
    font-weight: 400;
    color: #999999;
    line-height: 30px;
  }

  .paginate-right {
    display: flex;
  }

  .paginate-jump {
    position: relative;
    right: 4px;
    width: 68px;
    height: 30px;
    background: #fff;
    border-radius: 4px;
    border: 1px solid #e0e0e0;
    overflow: hidden;
  }
}
</style>
