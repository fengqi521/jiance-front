<template>
  <section>
    <div class="section-title">
      <router-link to="/platform/role">角色管理</router-link> > 添加角色
    </div>
    <div class="section-header">
      <div class="section-item-header clearfix">
        <span>角色信息</span>
      </div>
      <div class="header-content clearfix">
        <div class="content-item">
          <div class="header-left">角色名称</div>
          <div class="header-right">
            <el-input
              class="search-input"
              v-model="modelInfo.words"
              placeholder="输入角色名称"
            />
          </div>
        </div>
        <div class="content-item">
          <div class="header-left">角色类型</div>
          <div class="header-right">
            <el-select v-model="modelInfo.role_type">
              <el-option
                label="系统成员"
                value="1"
              />
              <el-option
                label="企业主成员"
                value="2"
              />
              <el-option
                label="业主成员"
                value="3"
              />
            </el-select>
          </div>
        </div>
      </div>
    </div>
    <div class="section-container">
      <div class="section-item-header clearfix">
        <span>权限选择</span>
        <div class="checkbox-item checkbox-all">
          <i class="checkbox-icon"></i>全选
        </div>
      </div>
      <div class="section-main">
        <div class="section-list clearfix">
          <div class="list-header">
            <span class="checkbox-item checkbox-header">
              <i class="checkbox-icon"></i>设备管理
            </span>
            <span
              class="rate-arrow"
              :class="{'rate-arrow-open':roleRate_1}"
              @click="roleRate_1 = !roleRate_1"
            ></span>
          </div>
          <div
            class="list-outer"
            v-if="roleRate_1"
          >
            <div class="list-content">
              <div class="content-left">
                <span class="checkbox-item checkbox-title">
                  <i class="checkbox-icon"></i>充电站管理：
                </span>
              </div>
              <div class="content-right">
                <span class="checkbox-item">
                  <i class="checkbox-icon"></i>查看充电站
                </span>
                <span class="checkbox-item">
                  <i class="checkbox-icon checkbox-act-icon"></i>查看充电站
                </span>
              </div>
            </div>
            <div class="list-content">
              <div class="content-left">
                <span class="checkbox-item checkbox-title">
                  <i class="checkbox-icon"></i>充电桩管理：
                </span>
              </div>
              <div class="content-right">
                <span class="checkbox-item">
                  <i class="checkbox-icon"></i>查看充电桩
                </span>
                <span class="checkbox-item">
                  <i class="checkbox-icon checkbox-act-icon"></i>新增充电桩
                </span>
              </div>
            </div>

          </div>
        </div>
        <div class="section-list clearfix">
          <div class="list-header">
            <span class="checkbox-item checkbox-header">
              <i class="checkbox-icon"></i>用户管理
            </span>
            <span
              class="rate-arrow"
              :class="{'rate-arrow-open':roleRate_2}"
              @click="roleRate_2 = !roleRate_2"
            ></span>
          </div>
          <div
            class="list-outer"
            v-if="roleRate_2"
          >
            <div class="list-content">
              <div class="content-left">
                <span class="checkbox-item checkbox-title">
                  <i class="checkbox-icon"></i>APP用户：
                </span>
              </div>
              <div class="content-right">
                <span class="checkbox-item">
                  <i class="checkbox-icon"></i>查看用户
                </span>
                <span class="checkbox-item">
                  <i class="checkbox-icon checkbox-act-icon"></i>新增用户
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="section-list clearfix">
          <div class="list-header">
            <span class="checkbox-item checkbox-header">
              <i class="checkbox-icon"></i>交易中心
            </span>
            <span
              class="rate-arrow"
              :class="{'rate-arrow-open':roleRate_3}"
              @click="roleRate_3 = !roleRate_3"
            ></span>
          </div>
          <div
            class="list-outer"
            v-if="roleRate_3"
          >
            <div class="list-content">
              <div class="content-left">
                <span class="checkbox-item checkbox-title">
                  <i class="checkbox-icon"></i>账单管理：
                </span>
              </div>
              <div class="content-right">
                <span class="checkbox-item">
                  <i class="checkbox-icon"></i>查看账单记录
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="section-list clearfix">
          <div class="list-header">
            <span class="checkbox-item checkbox-header">
              <i class="checkbox-icon"></i>活动平台
            </span>
            <span
              class="rate-arrow"
              :class="{'rate-arrow-open':roleRate_4}"
              @click="roleRate_4 = !roleRate_4"
            ></span>
          </div>
          <div
            class="list-outer"
            v-if="roleRate_4"
          >
            <div class="list-content">
              <div class="content-left">
                <span class="checkbox-item checkbox-title">
                  <i class="checkbox-icon"></i>优惠券管理：
                </span>
              </div>
              <div class="content-right">
                <span class="checkbox-item">
                  <i class="checkbox-icon"></i>查看优惠券
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="section-list clearfix">
          <div class="list-header">
            <span class="checkbox-item checkbox-header">
              <i class="checkbox-icon"></i>互联互通管理
            </span>
            <span
              class="rate-arrow"
              :class="{'rate-arrow-open':roleRate_5}"
              @click="roleRate_5 = !roleRate_5"
            ></span>
          </div>
          <div
            class="list-outer"
            v-if="roleRate_5"
          >
            <div class="list-content">
              <div class="content-left">
                <span class="checkbox-item checkbox-title">
                  <i class="checkbox-icon"></i>运营商权限：
                </span>
              </div>
              <div class="content-right">
                <span class="checkbox-item">
                  <i class="checkbox-icon"></i>查看运营商
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="section-list clearfix">
          <div class="list-header">
            <span class="checkbox-item checkbox-header">
              <i class="checkbox-icon"></i>告警管理
            </span>
            <span
              class="rate-arrow"
              :class="{'rate-arrow-open':roleRate_6}"
              @click="roleRate_6 = !roleRate_6"
            ></span>
          </div>
          <div
            class="list-outer"
            v-if="roleRate_6"
          >
            <div class="list-content">
              <div class="content-left">
                <span class="checkbox-item checkbox-title">
                  <i class="checkbox-icon"></i>故障配置：
                </span>
              </div>
              <div class="content-right">
                <span class="checkbox-item">
                  <i class="checkbox-icon"></i>查看故障配置
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="section-list clearfix">
          <div class="list-header">
            <span class="checkbox-item checkbox-header">
              <i class="checkbox-icon"></i>平台管理
            </span>
            <span
              class="rate-arrow"
              :class="{'rate-arrow-open':roleRate_7}"
              @click="roleRate_7 = !roleRate_7"
            ></span>
          </div>
          <div
            class="list-outer"
            v-if="roleRate_7"
          >
            <div class="list-content">
              <div class="content-left">
                <span class="checkbox-item checkbox-title">
                  <i class="checkbox-icon"></i>系统管理：
                </span>
              </div>
              <div class="content-right">
                <span class="checkbox-item">
                  <i class="checkbox-icon"></i>系统扩容
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="section-bottom clearfix">
        <div class="btn_succ">提交</div>
        <div class="btn_cancel">返回</div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      modelInfo: {
        words: "",
        role_type: "1"
      },
      roleRate_1: true,
      roleRate_2: true,
      roleRate_3: true,
      roleRate_4: true,
      roleRate_5: true,
      roleRate_6: true,
      roleRate_7: true,
      roleTypeRules: [],
    };
  },
  created() {
    // 获取角色对应的权限 默认系统成员
    this.getRoleTypeRules(this.modelInfo.role_type);
  },
  methods: {
    getRoleTypeRules(type) {
      this.$api.roleTypeRule({type: type}).then(data => {
        if (data.code == 1) {
          this.roleTypeRules = data.data;
        }
      });
    },
  }
};
</script>

<style scoped lang="scss" scoped>
@import "../../assets/css/platform/roleEdit.scss";
</style>
