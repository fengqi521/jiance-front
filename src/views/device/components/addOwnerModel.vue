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
        <div class="box-title">选择业主</div>
        <div class="box-search">
          <el-input
            v-model="words"
            placeholder="请输入用户账号/手机号"
          />
          <span
            class="btn_succ"
            @click="searchOwners"
          >搜索</span>
        </div>
        <div class="box-main">
          <div class="table">
            <div class="table-th clearfix">
              <div class="table-td">序号</div>
              <div class="table-td table-column__1">账号-手机号</div>
              <div class="table-td">选择</div>
            </div>
            <div class="table-body scrollBar">
              <div
                class="table-tr"
                v-for="(item,index) in tableData"
                :key="index"
              >
                <div class="table-td">{{parseInt(index)+1}}</div>
                <div class="table-td table-column__1">{{item.account}}-{{item.tel}}-{{item.id}}</div>
                <div class="table-td">
                  <el-radio
                    v-model="radio_id"
                    :label="index"
                    :value="item.id"
                    @change="ownerChangeSelect(item.id)"
                  ></el-radio>
                </div>
              </div>
            </div>
          </div>
        </div>
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
    owner_id: {
      type: String
    },
    owner_name: {}
  },
  watch: {
    owner_id: {
      handler: function(newItem) {
        var users = this.tableData;
        for (const key in users) {
          var item = users[key];
          if (item.id == newItem) {
            this.$emit("update:owner_name", item.account);
            this.radio_id = parseInt(key);
          }
        }
      },
      deep: true
    },
    tableData: {
      handler: function(newItem) {
        var users = newItem;
        for (const key in users) {
          var item = users[key];
          if (item.id == this.owner_id) {
            this.$emit("update:owner_name", item.account);
            this.radio_id = parseInt(key);
          }
        }
      },
      deep: true
    }
  },
  data() {
    return {
      words: "",
      radio_id: "-1",
      tableData: []
    };
  },
  created() {
    this.getOwnersList();
  },
  methods: {
    searchOwners() {
      this.getOwnersList();
    },
    getOwnersList() {
      var _this = this;
      var params = {
        search: _this.words
      };
      this.$api.pileOwners(params).then(res => {
        if (res.code == 1) {
          this.tableData = res.data;
        }
      });
    },
    ownerChangeSelect(_id) {
      this.$emit("update:owner_id", _id);
    },
    handleCancel() {
      this.$emit("update:owner_name", "");
      this.$emit("update:owner_id", "");
      this.$emit("update:showModel", false);
    },
    saveInfo() {
      console.log(this.owner_id, this.radio_id, "--");
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
  border-radius: 3px;
  
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
    }
    .btn_succ {
      margin-left: 24px;
      width: 72px;
      font-size: 12px;
      float: none;
    }
  }

  .box-main {
    padding: 16px 0 24px;
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
</style>