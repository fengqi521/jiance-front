<template>
  <section>
    <div class="section-title">
      <router-link to="/platform/agent">代理商</router-link> > 关联充电站
    </div>
    <el-form
      :model="modelInfo"
      ref="modelInfo"
    >
      <p class="section-name">{{account}}</p>
      <div
        class="section-container"
        v-show="roleTypeRules && roleTypeRules.length > 0"
      >
        <div class="section-item-header clearfix">
          <span>关联选择</span>
          <div class="checkbox-item checkbox-all">
            <i
              class="checkbox-icon"
              :class="{'checkbox-act-icon' : checkbox_all}"
              @click="handleCheckedAll"
            ></i>全选
          </div>
        </div>
        <div class="section-main">
          <div
            class="section-list clearfix"
            v-for="(item, index) in roleTypeRules"
            :key="index"
          >
            <div class="list-header">
              <span class="checkbox-item checkbox-header">
                <i
                  class="checkbox-icon"
                  :class="{'checkbox-act-icon': showFirstRule(item)}"
                  @click="addFirstRule(item)"
                ></i>{{item.name}}
              </span>
              <span
                class="rate-arrow"
                :class="{'rate-arrow-open':item.is_open}"
                @click="item.is_open = !item.is_open"
              ></span>
            </div>
            <div
              class="list-outer"
              v-if="item.is_open"
            >
              <div
                class="list-content"
                v-show="item.child && item.child.length > 0"
              >
                <div class="content-right">
                  <span
                    class="checkbox-item"
                    v-for="(gItem, gIndex) in item.child"
                    :key="gIndex"
                  >
                    <i
                      class="checkbox-icon"
                      :class="{'checkbox-act-icon': modelInfo.rules.indexOf(gItem.station_id) != -1}"
                      @click="handleThirdChecked(gItem)"
                    ></i>{{gItem.name}}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-show="!roleTypeRules.length" class="no-data">
        <div class="section-item-header clearfix">
          <span>关联选择</span>
        </div>
        <div class="table-tr">
          <img :src="require('assets/img/unData.png')">
          <span>没有可关联的站</span>
        </div>
      </div>
    </el-form>
    <div class="section-bottom clearfix" v-show="roleTypeRules && roleTypeRules.length > 0">
      <div
        class="btn_succ"
        @click="saveCreateRole"
      >提交</div>
      <div
        class="btn_cancel"
        @click="goToList"
      >返回</div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    var validateRules = (rule, value, callback) => {
      if (this.modelInfo.rules.length === 0) {
        callback(new Error("请选择权限"));
      } else {
        callback();
      }
    };
    return {
      account: this.$route.params.account,
      modelInfo: {
        id: this.$route.params.id,
        rules: []
      },
      roleTypeRules: [],
      all_rules_ids: [],
      checkbox_all: false
    };
  },
  created() {
    // 获取角色对应的权限 默认系统成员
    this.getRoleTypeRules(this.modelInfo.id);
  },
  methods: {
    saveCreateRole() {
      this.$refs["modelInfo"].validate(valid => {
        if (valid) {
          this.$api.roleAddAgentAuth(this.modelInfo).then(data => {
            if (data.code == 1) {
              this.$sfNotify({
                message: "成功"
              });
              this.$router.push(`/platform/agent`);
            } else {
              this.$sfNotify({
                duration: 0,
                type: "error",
                message: data.message
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getRoleTypeRules(id) {
      let that = this;
      this.$api.roleAgentAuth({ id: id }).then(res => {
        if (res.code == 1) {
          let that = this;
          let _data = res.data;
          that.modelInfo.rules = [];
          _data.forEach(function(e_f) {
            e_f.is_open = true;
            if (e_f.child) {
              e_f.child.forEach(function(e_s) {
                  that.all_rules_ids.push(e_s.station_id);
                  if (e_s.checked == 1) {
                      that.modelInfo.rules.push(e_s.station_id);
                  }
              });
            }
          });
          this.roleTypeRules = _data;
          this.checkbox_all =
            that.modelInfo.rules.length == this.all_rules_ids.length
              ? true
              : false;
        }
      });
    },
    changeRoleType(type) {
      this.all_rules_ids = [];
      this.getRoleTypeRules(type);
    },
    // 全选
    handleCheckedAll() {
      this.modelInfo.rules = this.checkbox_all
        ? []
        : JSON.parse(JSON.stringify(this.all_rules_ids));
      this.checkbox_all = !this.checkbox_all;
    },
    // 添加/取消 一级目录权限
    addFirstRule(item) {
      let _array = this.modelInfo.rules;
      let flag = this.showFirstRule(item);
      if (flag) {
        item.siblings.map(_citem => {
          if (_array.indexOf(_citem) != -1) {
            _array.splice(_array.indexOf(_citem), 1);
          }
        });
      } else {
        item.siblings.map(_citem => {
          if (_array.indexOf(_citem) == -1) {
            _array.push(_citem);
          }
        });
      }

      this.checkbox_all =
        _array.length == this.all_rules_ids.length ? true : false;
    },
    // 显示一级目录（全选/部分选中）
    showFirstRule(_menu) {
      if (_menu.siblings) {
        return _menu.siblings.every(
          item => this.modelInfo.rules.indexOf(item) != -1
        );
      }
      return false;
    },
    // 是否显示二级目录
    showNavItems(_menu) {
      if (_menu.child) {
        return _menu.child.some(
          item =>
            this.modelInfo.rules.indexOf(item.station_id) != -1 && item.is_title == 1
        );
      }
      return false;
    },
    handleThirdChecked(item) {
      let _array = this.modelInfo.rules;
      if (_array.indexOf(item.station_id) != -1) {
        _array.splice(_array.indexOf(item.station_id), 1);
      } else {
        _array.push(item.station_id);
      }
      this.checkbox_all =
        _array.length == this.all_rules_ids.length ? true : false;
    },
    goToList() {
      this.$router.push(`/platform/agent`);
    }
  }
};
</script>

<style scoped lang="scss" scoped>
@import "../../assets/css/platform/agentAuth.scss";
</style>
