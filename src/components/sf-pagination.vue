<template>
  <!-- 分页 -->
  <div class="pagination">
    <div class="paginate-left">当前第{{currentPage}}页，共{{pageCount}}页</div>
    <div class="paginate-center">
      <!-- 上一页按钮 -->
      <div
        :hidden="currentPage == 1"
        class="first"
      >
        <div
          class="item-li first-item"
          @click="handleStep(1)"
        >
          <span></span>
        </div>
        <div
          class="item-li prev-item"
          @click="handleStep(2)"
        >
          <span></span>
        </div>
      </div>
      <!-- 页码 -->
      <ul
        class="pager-main"
        @click="onPagerClick"
      >
        <li
          :class="{ active: currentPage === 1}"
          v-if="pageCount > 0"
          class="number"
        >1</li>
        <li v-if="showPrevMore">...</li>
        <li
          :class="{ active: currentPage === pager}"
          class="number"
          v-for="pager in pagers"
          :key="pager"
        >{{pager}}</li>
        <li v-if="showNextMore">...</li>
        <li
          :class="{ active: currentPage === pageCount}"
          class="number"
          v-if="pageCount > 1"
        >{{ pageCount }}</li>
      </ul>
      <!-- 下一页按钮 -->
      <div
        :hidden="currentPage == pageCount"
        class="next"
      >
        <div
          class="item-li next-item"
          @click="handleStep(3)"
        >
          <span></span>
        </div>
        <div
          class="item-li last-item"
          @click="handleStep(4)"
        >
          <span></span>
        </div>
      </div>
    </div>
    <div class="paginate-jump">
      <input
        ref="input"
        type="number"
        :value="currentPage"
        class="jump-input"
        @input="handleInput"
      >
      <span
        class="jump-go"
        @click="handleJump"
      >GO</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "sfPagination",
  props: {
    currentPage: {
      type: [String, Number],
      default: 1
    },
    pageCount: {
      type: [String, Number],
      default: 1
    }
  },
  data() {
    return {
      current: null,
      showPrevMore: false,
      showNextMore: false,
      pagerCount: 7
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
    }
  },
  methods: {
    //  点击页数跳转
    onPagerClick(event) {
      const target = event.target;
      const currentPage = this.currentPage;
      let newPage = Number(event.target.textContent);

      if (target.tagName === "UL" || isNaN(newPage)) {
        return;
      }
      if (newPage !== currentPage) {
        this.current = newPage;
        this.$emit("current-change", newPage);
      }
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
    }
  }
};
</script>
