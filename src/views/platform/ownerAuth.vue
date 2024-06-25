<template>
  <section>
    <div class="section-title">
      <router-link to="/platform/owner">业主</router-link> > 关联充电桩
    </div>
    <el-form :model="modelInfo" ref="modelInfo">
      <p class="section-name">{{account}}</p>
      <div class="section-container" v-show="roleTypeRules && roleTypeRules.length > 0">
        <div class="section-item-header clearfix">
          <span>关联选择</span>
          <div class="checkbox-item checkbox-all" v-show="roleTypeRules.length">
            <i
              class="checkbox-icon"
              :class="{'checkbox-act-icon' : checkbox_all}"
              @click="handleCheckedAll"
            ></i>全选
          </div>
        </div>
        <div class="section-main">
          <div class="section-list clearfix" v-for="(item, index) in roleTypeRules" :key="index">
            <div class="list-header">
              <span class="checkbox-item checkbox-header">
                <i
                  class="checkbox-icon"
                  :class="{'checkbox-act-icon': showFirstRule(item)}"
                  @click="addFirstRule(item)"
                ></i>
                {{item.name}}
              </span>
              <span
                class="rate-arrow"
                :class="{'rate-arrow-open':item.is_open}"
                @click="item.is_open = !item.is_open"
              ></span>
            </div>
            <div class="list-outer" v-if="item.is_open">
              <div
                class="list-content"
                v-show="item.child && item.child.length > 0"
                v-for="(cItem, cIndex) in item.child"
                :key="cIndex"
              >
                <div class="content-left">
                  <span class="checkbox-item checkbox-title">
                    {{cItem.name}}：
                  </span>
                </div>
                <div class="content-right">
                  <span class="checkbox-item" v-for="(gItem, gIndex) in cItem.child" :key="gIndex">
                    <i
                      class="checkbox-icon"
                      :class="{'checkbox-act-icon': modelInfo.rules.indexOf(gItem.pile_sn) != -1}"
                      @click="handleThirdChecked(gItem)"
                    ></i>
                    {{gItem.name}}
                  </span>
                </div>
              </div>
            </div>
          </div>
        
        </div>
        <div v-show="!roleTypeRules.length" class="no-data"> 
          <img
           :src="require('assets/img/unData.png')">&nbsp;
           没有可关联的桩
        </div>
      </div>
      <div v-show="!roleTypeRules.length" class="no-data">
        <div class="section-item-header clearfix">
          <span>关联选择</span>
        </div>
        <div class="table-tr">
          <img :src="require('assets/img/unData.png')">
          <span>没有可关联的桩</span>
        </div>
        <div v-show="!roleTypeRules.length" class="no-data">
          <img :src="require('assets/img/unData.png')" />&nbsp;
          没有可关联的桩
        </div>
      </div>
    </el-form>
    <div class="section-bottom clearfix" v-show="roleTypeRules && roleTypeRules.length > 0">
      <div class="btn_succ" @click="saveCreateRole">提交</div>
      <div class="btn_cancel" @click="goToList">返回</div>
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
        rules: [],
      },
      roleTypeRules: [],
      all_rules_ids: [],
      checkbox_all: false,
      dataRules: {
        name: [
          { required: true, message: "* 请输入角色名称", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    // 获取角色对应的权限 默认系统成员
    this.getRoleTypeRules(this.modelInfo.type);
  },
  methods: {
    saveCreateRole() {
      this.$refs["modelInfo"].validate((valid) => {
        if (valid) {
          this.$api.roleAddOwnerAuth(this.modelInfo).then((data) => {
            if (data.code == 1) {
              this.$sfNotify({
                message: "成功",
              });
              this.$router.push(`/platform/owner`);
            } else {
              this.$sfNotify({
                duration: 0,
                type: "error",
                message: data.message,
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getRoleTypeRules(type) {
      let that = this;
      this.$api.roleOwnerAuth({ id: this.modelInfo.id }).then((res) => {
        if (res.code == 1) {
          let that = this;
          let _data = res.data;
          console.log('_data',_data);
          _data.forEach(function (e_f) {
            e_f.is_open = true;
            if (e_f.child) {
              e_f.child.forEach(function (e_s) {
                if (e_s.child) {
                  e_s.child.forEach(function (e_t) {
                    that.all_rules_ids.push(e_t.pile_sn);
                    // 初始化的时候判断所拥有的权限
                    if (e_t.checked == 1) {
                      that.modelInfo.rules.push(e_t.pile_sn);
                    }
                  });
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
        item.siblings.map((_citem) => {
          if (_array.indexOf(_citem) != -1) {
            _array.splice(_array.indexOf(_citem), 1);
          }
        });
      } else {
        item.siblings.map((_citem) => {
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
          (item) => this.modelInfo.rules.indexOf(item) != -1
        );
      }
      return false;
    },
    // 是否显示二级目录
    showNavItems(_menu) {
      if (_menu.child) {
        return _menu.child.some(
          (item) =>
            this.modelInfo.rules.indexOf(item.id) != -1 && item.is_title == 1
        );
      }
      return false;
    },
    handleThirdChecked(item) {
      let _array = this.modelInfo.rules;
      if (_array.indexOf(item.pile_sn) != -1) {
        _array.splice(_array.indexOf(item.pile_sn), 1);
      } else {
        _array.push(item.pile_sn);
      }
      this.checkbox_all =
        _array.length == this.all_rules_ids.length ? true : false;
    },
    goToList() {
      this.$router.push(`/platform/owner`);
    },
  },
};
</script>

<style scoped lang="scss" scoped>
@import "../../assets/css/platform/ownerAuth.scss";
</style>
