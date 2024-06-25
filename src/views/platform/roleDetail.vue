<template>
  <section>
    <div class="section-title">
      <router-link to="/platform/role">角色管理</router-link> > 角色详情
    </div>
    <div class="section-header">
      <div class="section-item-header clearfix">
        <span>角色信息</span>
      </div>
      <div class="header-content clearfix">
        <div class="content-item">
          <div class="header-left">角色名称：</div>
          <div class="header-right">{{role_name}}</div>
        </div>
        <div class="content-item">
          <div class="header-left">角色类型：</div>
          <div class="header-right">{{type}}</div>
        </div>
      </div>
    </div>
    <div
      class="section-container"
      v-show="roleTypeRules && roleTypeRules.length > 0"
    >
      <div class="section-item-header clearfix">
        <span>权限选择</span>
        <div class="checkbox-item checkbox-all">
          <i
            class="checkbox-icon"
            :class="{'checkbox-act-icon' : checkbox_all}"
            @click="handleCheckedAll"
          ></i>全选
        </div>
        <span class="section-tips">（* 功能模块有 ”查看“ 权限时，导航才会展示此功能模块）</span>
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
              v-for="(cItem, cIndex) in item.child"
              :key="cIndex"
            >
              <div class="content-left">
                <span class="checkbox-item checkbox-title">
                  <i
                    class="unShow-icon"
                    :class="{'show-icon': showNavItems(cItem)}"
                  ></i>{{cItem.name}}：
                </span>
              </div>
              <div class="content-right">
                <span
                  class="checkbox-item"
                  v-for="(gItem, gIndex) in cItem.child"
                  :key="gIndex"
                >
                  <i
                    class="checkbox-icon"
                    :class="{'checkbox-act-icon': modelInfo.rules.indexOf(gItem.id) != -1}"
                    @click="handleThirdChecked(gItem)"
                  ></i>{{gItem.name}}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="section-bottom clearfix">
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
    return {
      modelInfo: {
        id: this.$route.params.id,
        type: "",
        rules: []
      },
      role_name: "",
      type: "",
      type_array: {
        "0": "超级管理员",
        "1": "运营成员",
        "2": "大客户成员",
        "3": "业主成员",
        "4": "代理商成员",
        "5": "运维成员"
      },
      roleTypeRules: [],
      all_rules_ids: [],
      checkbox_all: false
    };
  },
  created() {
    this.getRoleDetails();
  },
  methods: {
    // 保存权限信息
    saveCreateRole() {
      this.$api.roleEdit(this.modelInfo).then(data => {
        if (data.code == 1) {
          this.$sfNotify({
            message: "成功"
          });
          this.$router.push(`/platform/role`);
        } else {
          this.$sfNotify({
            duration: 0,
            type: "error",
            message: "失败"
          });
        }
      });
    },
    // 获取权限详情
    getRoleDetails() {
      this.$api.roleDetail({ id: this.modelInfo.id }).then(data => {
        if (data.code == 1) {
          let that = this;
          let _data = data.data;
          this.role_name = _data.role_name;
          this.type = _data.c_type;
          this.modelInfo.type = _data.type;
          _data.rules.forEach(function(e_f) {
            e_f.is_open = true;
            e_f.siblings = [];
            if (e_f.child) {
              e_f.child.forEach(function(e_s) {
                if (e_s.child) {
                  e_s.child.forEach(function(e_t) {
                    that.all_rules_ids.push(e_t.id);
                    e_f.siblings.push(e_t.id);
                    // 初始化的时候判断所拥有的权限
                    if (e_t.checked == 1) {
                      that.modelInfo.rules.push(e_t.id);
                    }
                  });
                }
              });
            }
          });
          this.roleTypeRules = _data.rules;
          this.checkbox_all =
            that.modelInfo.rules.length == this.all_rules_ids.length
              ? true
              : false;
        }
      });
    },
    // 添加/取消 所有权限
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
            this.modelInfo.rules.indexOf(item.id) != -1 && item.is_title == 1
        );
      }
      return false;
    },
    handleThirdChecked(item) {
      let _array = this.modelInfo.rules;
      if (_array.indexOf(item.id) != -1) {
        _array.splice(_array.indexOf(item.id), 1);
      } else {
        _array.push(item.id);
      }
      this.checkbox_all =
        _array.length == this.all_rules_ids.length ? true : false;
    },
    goToList() {
      this.$router.push(`/platform/role`);
    }
  }
};
</script>

<style scoped lang="scss" scoped>
@import "../../assets/css/platform/roleDetail.scss";
</style>
