<template>
  <transition name="fade">
    <div
      v-if="showModel"
      class="model"
    >
      <div class="box-outer">
        <img
          class="cancel"
          :src="require('assets/img/cancel.png')"
          @click="handleCancel"
        >
        <div class="box-title">选择车辆</div>
        <div class="box-search">
          <el-input
            v-model="searchUserInput"
            placeholder="请输入车牌号"
          />
          <span
            class="btn_succ"
            @click="searchInfo"
          >搜索</span>
        </div>
        <div class="box-main">
          <div class="table">
            <div class="table-th clearfix">
              <!-- <div class="table-td" style="min-width:125px;">用户账号</div> -->
              <div class="table-td" style="min-width:125px;">车牌号</div>
              <div class="table-td" style="min-width:186px;">车架号</div>
              <div class="table-td table-td-center">选择</div>
            </div>
            <div class="table-body scrollBar">
              <div
                class="table-tr"
                v-for="(item,index) in users"
                :key="index"
              >
                <!-- <div class="table-td" style="min-width:125px;">{{item.tel}}</div> -->
                <div class="table-td" style="min-width:125px;">{{item.license_plate}}</div>
                <div class="table-td" style="min-width:186px;">{{item.car_frame}}</div>
                <div class="table-td table-td-center">
                  <div
                    class="td-item checkbox-icon"
                    :class="{'checkbox-act-icon':tempChooseArr.indexOf(item.id) != -1}"
                    @click="handleCheckedArr(item.id)"
                  ></div>
                </div>
              </div>
            </div>
            <div
              v-if="!users || users.length === 0"
              class="table-tr unData only-company-group"
            >
              <img :src="require('assets/img/unData.png')" />
              <span>暂无数据</span>
            </div>
          </div>
        </div>
        <!-- 分页 -->
        <sf-pagination
          v-if="users && users.length > 0"
          :currentPage="userCurrentPage"
          :page-count="userPageCount"
          @current-change="handleCurrentChange"
        />
        <div class="box-btn">
          <div
            class="btn_succ"
            @click="saveInfo"
          >确认</div>
          <div
            class="btn_cancel"
            @click="handleCancel"
          >取消</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    showModel: {
      type: Boolean
    },
    users: {
      type: Array
    },
    choosedUser: {
      type: Array
    },
    searchUser: {
      type: String
    },
    userCurrentPage: {
      type: null
    },
    userPageCount: {
       type: null
    }
  },
  data() {
    return {
      //个人分页
      user_currentPage: 1,

      words: "",
      owner_id: "",
      radio_id: "-1",
      searchUserInput: "",
      tempChooseArr: this.choosedUser,
    };
  },
  mounted() {},
  watch:{
    "showModel":{
      handler: function (newItem) {
        if(newItem == false){
          this.searchUserInput = '';
        }
      },
      deep: true,
    },
    //便点击，边向输入框填数据
    // "tempChooseArr":{
    //   handler: function (newItem) {
    //       this.$emit("update:choosedUser", this.tempChooseArr);
    //   },
    //   deep: true,
    // }
  },
  methods: {
    // 点击分页触发
    handleCurrentChange(page) {
      this.user_currentPage = page;
       //便点击，边向输入框填数据
      // this.$emit("update:choosedUser", this.tempChooseArr);
      this.$emit("update:userCurrentPage", this.user_currentPage);
    },
    handleCancel() {
      this.tempChooseArr = [];
      this.$emit("update:userCurrentPage", '1');
      this.$emit("update:showModel", false);
      //便点击，边向输入框填数据
      // this.$emit("update:choosedUser", []);
    },
    handleCheckedArr(_id) {
      var _ind = this.tempChooseArr.indexOf(_id);
      _ind != -1
        ? this.tempChooseArr.splice(_ind, 1)
        : this.tempChooseArr.push(_id);
    },
    searchInfo() {
      this.$emit("update:searchUser", this.searchUserInput);
      this.$parent.getPileUsers();
    },
    saveInfo() {
      this.$emit("update:userCurrentPage", '1');
      this.$emit("update:choosedUser", this.tempChooseArr);
      this.$emit("update:showModel", false);
    }
  }
};
</script>

<style ref="stylesheet/scss" lang="scss" scoped>
.box-outer {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 592px;
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
    padding: 24px 0;
    font-size: 16px;
    color: rgba(51, 51, 51, 1);
    line-height: 24px;
  }

  .box-search {
    display: flex;
    align-items: center;
    justify-content: center;
    .el-input {
      width: 320px;
      /deep/ .el-input__inner{
        padding-left: 12px !important;
      }
    }
    .btn_succ {
      margin-left: 8px;
      width: 72px;
      font-size: 12px;
      float: none;
    }
  }

  .box-main {
    padding: 16px 0 0;
    margin-bottom:24px;
  }
  .pagination{
    margin: -8px 0 16px 0;
  }

  .table {
    border-radius: 3px;
    border: 1px solid #e0e0e0;

    .table-body {
      max-height: 360px;
      overflow-y: auto;
    }
    .table-th,
    .table-tr {
      height: 36px;
    }
    .table-tr:last-child {
      border-bottom: none;
    }

    .table-td {
      padding: 0 24px;
      justify-content: flex-start;
    }

    .table-td-center{
      justify-content: center !important;
    }

    .table-column__1 {
      flex: 3.34;
      justify-content: flex-start;
    }

    .el-radio {
      height: 16px;
      /deep/ .el-radio__label {
        padding: 0;
        font-size: 0;
      }
    }
  }

  .box-btn {
    padding: 0 98px;
    display: flex;
    justify-content: space-between;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.only-company-group{
  height: 72px !important;
  /* overflow: hidden; */
}

</style>