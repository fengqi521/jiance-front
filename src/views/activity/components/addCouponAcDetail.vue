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
        <div class="box-title">增加车辆</div>
        <div class="box-search">
          <div class="content-item">
            <div class="header-left">所属方</div>
            <div class="header-right">
              <el-select v-model="ownInput">
                <el-option label="全部" value="all" />
                <el-option label="个人" value="1" />
                <el-option label="企业" value="2" />
              </el-select>
            </div>
          </div>
          <div class="content-item">
            <div class="header-left">搜索</div>
            <div class="header-right">
              <el-input
              class="search-add-coupon-ac"
              v-model="searchUserInput"
              placeholder="请输入车牌号"
              v-if="ownInput == 1"
              />
              <el-input
              class="search-add-coupon-ac"
              v-model="searchUserInput"
              placeholder="请输入车牌号/企业名称"
              v-else-if="ownInput == 2"
              />
              <el-input
              class="search-add-coupon-ac"
              v-model="searchUserInput"
              placeholder="请输入车牌号"
              v-else
              />
            </div>
          </div>
          <div class="content-item">
            <div class="btn_succ" @click="searchInfo()">查询</div>
            <div class="btn_cancel" @click="resetSearch()">重置</div>
          </div>
        </div>
        <!-- <div class="box-search">
          <el-input
            v-model="searchUserInput"
            placeholder="请输入用户ID/用户名称"
          />
          <span
            class="btn_succ"
            @click="searchInfo"
          >搜索</span>
        </div> -->
        <div class="box-main">
          <div class="table">
            <div class="table-th clearfix">
               <!-- style="min-width:125px;" -->
              <!-- <div class="table-td table-td-center" style="min-width:126px;">用户账号</div> -->
              <div class="table-td table-td-center" style="min-width:138px;">车牌号</div>
              <div class="table-td table-td-center" style="min-width:169px;">车架号</div>
              <div class="table-td">所属方</div>
              <div class="table-td">企业名称</div>
              <div class="table-td">选择</div>
            </div>
            <div class="table-body scrollBar">
              <div
                class="table-tr"
                v-for="(item,index) in users"
                :key="index"
              >
                <!-- <div class="table-td table-td-center" style="min-width:126px;" >{{item.tel}}</div> -->
                <div class="table-td table-td-center" style="min-width:138px;">{{item.license_plate}}</div>
                <div class="table-td table-td-center" style="min-width:168px;">{{item.car_frame}}</div>
                <div class="table-td">{{item.bind_type == '1' ? '个人' : '企业'}}</div>
                <div class="table-td">
                  <div class="td-item">
                    <el-tooltip
                      v-if="item.bind_name ? item.bind_name : false"
                      :content="item.bind_name ? item.bind_name : '--'"
                      placement="top"
                    >
                      <div class="td-item td-time">{{item.bind_name | companyNameEllipsis}}</div>
                    </el-tooltip>
                  </div>
                  <div
                    class="td-item"
                    v-if="!item.bind_name"
                  >{{item.bind_name | companyNameEllipsis}}</div>
                </div>
                <div class="table-td">
                  <div
                    class="td-item checkbox-icon"
                    :class="{'checkbox-act-icon':tempChooseArr.indexOf(item.id) != -1}"
                    @click="handleCheckedArr(item.id,item)"
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
import logVue from '../../device/log.vue';
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

      resultChoose:[],

      words: "",
      owner_id: "",
      radio_id: "-1",
      searchUserInput: "",
      ownInput: 'all',
      tempChooseArr: this.choosedUser
    };
  },
  mounted() {},
  watch:{
    "showModel":{
      handler: function (newItem) {
        if(newItem == false){
          this.searchUserInput = '';
          this.ownInput = 'all';
        }
      },
      deep: true,
    }
  },
  filters: {
    companyNameEllipsis(value) {
      if (!value) return "--";
      if (value.length > 6) {
        return value.slice(0, 7) + "...";
      }
      return value;
    },
  },
  methods: {
    // 点击分页触发
    handleCurrentChange(page) {
      this.user_currentPage = page;
      this.$emit("update:userCurrentPage", this.user_currentPage);
    },
    handleCancel() {
      this.searchUserInput = '';
      this.ownInput = 'all';
      this.resultChoose = [];
      this.tempChooseArr = [];
      this.$emit("update:searchOwnUser", this.ownInput);
      this.$emit("update:resultChoose", this.resultChoose);
      this.$emit("update:choosedUser", this.tempChooseArr);
      this.$emit("update:showModel", false);
      this.$emit("update:choosedUser", []);
    },
    handleCheckedArr(_id,item) {
      // resultChoose
      var _ind = this.tempChooseArr.indexOf(_id);
      _ind != -1
        ? this.tempChooseArr.splice(_ind, 1)
        : this.tempChooseArr.push(_id);

     var _item = this.resultChoose.indexOf(item);
      _item != -1
        ? this.resultChoose.splice(_item, 1)
        : this.resultChoose.push(item.id);
    },
    searchInfo() {
      this.$emit("update:userCurrentPage", '1');
      this.$emit("update:searchUser", this.searchUserInput);
      this.$emit("update:searchOwnUser", this.ownInput);
      this.$parent.getVehicleAddList();
    },
    resetSearch() {
      this.searchUserInput = '';
      this.ownInput = 'all';
      this.$emit("update:searchUser", '');
      this.$emit("update:searchOwnUser", 'all');
      this.$parent.getVehicleAddList();
    },
    saveInfo() {
      this.searchUserInput = '';
      this.ownInput = 'all';
      this.$emit("update:resultChoose", this.resultChoose);
      this.$emit("update:choosedUser", this.tempChooseArr);
      this.resultChoose = [];
      this.tempChooseArr = [];
      this.$emit("update:fromSure", '1');
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
  width: 800px;
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
    justify-content: flex-start;
    /* .el-input {
      width: 320px;
    }
    .btn_succ {
      margin-left: 24px;
      width: 72px;
      font-size: 12px;
      float: none;
    } */
  }

  .box-main {
    padding: 16px 0 0;
    margin-bottom: 8px;
  }
  .pagination{
    margin: 8px 0 24px;
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
    }

    .table-td-center{
      justify-content: flex-start;
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
    padding: 0 202px;
    display: flex;
    justify-content: space-between;
  }

  .content-item {
      float: left;
      position: relative;
      padding: 0 40px 0 0;

      &:last-child {
          padding-right: 0;
      }

      .el-date-editor {
          float: left;
          width: 150px;

          &.end_time {
              margin-left: 12px;
          }

          /deep/ .el-input__inner {
              height: 32px;
              line-height: 16px;
          }
      }

      .el-select {
          position: relative;
          width: 150px;

          /deep/ .el-input__inner {
              height: 32px;
              line-height: 30px;
          }

          &.search-type {
              float: left;
              width: 100px;

              /deep/ .el-input__inner {
                  border-right: none;
                  border-radius: 3px 0 0 3px;
              }
          }
      }

      .search-input {
          float: left;
          width: 180px;

          /deep/ .el-input__inner {
              border-radius: 0 3px 3px 0;
              height: 32px;
              line-height: 30px;
          }
      }

      .header-left {
          float: left;
          padding-right: 24px;
          font-size: 12px;
          color: rgba(51, 51, 51, 1);
          line-height: 32px;
      }

      .header-right {
          float: left;
      }
  }
            
  .search-add-coupon-ac{
    /deep/ .el-input__inner{
      height: 32px !important;
    }
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
}
</style>