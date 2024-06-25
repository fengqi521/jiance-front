<template>
  <section>
    <div class="section-title">
      <span
        class="section-title section-title-act"
        @click="handleBack()"
        >等级管理</span
      >
      <span class="section-title">></span>
      <span class="section-title" v-if="detailId ? false : true"
        >添加兑换规则</span
      >
      <span class="section-title" v-else
        >编辑兑换规则</span
      >
    </div>
    <div class="section-container change-box">
      <div class="section-item-header clearfix">
        <span class="manager-span">
          <div class="section-header">
            <div class="section-item-header">
              <span>{{
                detailId ? "编辑兑换规则" : "添加兑换规则"
              }}</span>
            </div>
          </div>
        </span>
      </div>
      <div
        class="box-outer"
      >
        <el-form :model="addInfo" ref="addInfo" :rules="dataRules">
          <div class="section-list">
            <div class="section-left"><span class="team-left-blod">积分兑换名称</span></div>
            <div class="section-right">
              <el-form-item prop="title">
                <!-- onkeypress="if(value.length>60)value=value.slice(0,60)" -->
                <el-input
                  maxlength="11"
                  v-model="addInfo.title"
                  placeholder="请输入积分兑换名称"
                />
              </el-form-item>
            </div>
          </div>
          <div class="section-list">
            <div class="section-left"><span class="team-left-blod">所需积分</span></div>
            <div class="section-right">
              <el-form-item prop="integral">
                <el-input
                  maxlength="12"
                  type="number"
                  v-model="addInfo.integral"
                  onkeypress="return( /[\d]/.test(String.fromCharCode(event.keyCode) ) )"
                  placeholder="请输入兑换积分（正整数）"
                />
                <span class="team-unit">分</span>
              </el-form-item>
            </div>
          </div>
          <div class="section-list section-list-16">
            <div class="section-left"><span class="team-left-blod"> 权益类型</span></div>
            <div class="section-right right-bottom-16">
              <div class="section-right-36"><span class="team-enough">满足当前级别可享受权益</span><span class="team-valid" v-if="!detailId">（提前在权益配置管理配好模板）</span></div>
            </div>
          </div>
          <div class="section-list">
            <div class="section-right">
              <el-select
                v-model="type_arry"
                placeholder="请选择享受优惠的群组名称"
              >
                <el-option
                  label="现金立减"
                  value="1"
                />
                <el-option
                  label="专享折扣"
                  value="2"
                />
                <el-option
                  label="电度优惠"
                  value="3"
                />
              </el-select>
              <el-select
                class="el-select-16"
                v-model="addInfo.equity_id"
                placeholder="请选择权益名称"
              >
                <el-option
                  v-for="(item, index) in discount_name"
                  :key="index"
                  :label="item.title"
                  :value="item.id"
                />
              </el-select>
            </div>
          </div>
        </el-form>
      </div>
      <div class="section-item-header team-header"></div>
      <div
        class="box-bottom clearfix"
        style="display: flex; justify-content: center; margin-top: 20px"
      >
        <div class="btn_succ" @click="saveActivitySure()">
          提交
        </div>
        <div class="btn_cancel" style="margin-left:48px;" @click="handleBack()">
          取消
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import logVue from '../device/log.vue';
export default {
  data() {
    return {
      listLoading: false,
      type_arry: this.$route.query.id ? '' : '1',//类型
      detailId : this.$route.query.id,
      addInfo:{
        title : '',
        integral : '',
        equity_id : '',
      },
      discount_name : [],
      dataRules: {
        title: [{ required: true, message: "* 请填写积分兑换名称", trigger: "blur" }],
        integral: [{ required: true, message: "* 请填写兑换积分（正整数）", trigger: "blur" }],
      },
    };
  },
  mounted() {
    this.$nextTick(() => {
      document.documentElement.style.minWidth = "1300px";
    });
  },
  created() {
    if(this.detailId){
      this.getDetailList();
    }
    this.getTypeList();
  },
  watch : {
    "type_arry":{
      handler: function (newItem,oldItem) {
        this.discount_name = [];
        //如果编辑来的话，为空
        //不是编辑来的切换可以成功
        if(oldItem != ''){
          this.addInfo.equity_id = '';
        }
        this.getTypeList();
      },
      deep: true,
    },
  },
  methods: {
    getDetailList() {
      this.$api.detailGradeChange({id : this.detailId}).then(data => {
        if (data.code == 1) {
          this.addInfo.title = data.data.title;
          this.addInfo.integral = data.data.integral;
          this.addInfo.equity_id = data.data.equity_allocation_id;
          this.type_arry = data.data.type;
        }
      });
    },
    getTypeList() {
      this.$api.gradeChangeTypeList({type : this.type_arry}).then(data => {
        if (data.code == 1) {
          this.discount_name = data.data;
        }
      });
    },
    saveActivitySure() {
      // 验证是否权益类型
      if (!this.addInfo.equity_id) {
        this.$sfNotify({
          duration: 0,
          type: "error",
          message: "请选择权益类型",
        });
        return false;
      }

      if (!this.detailId) {
        // 添加
        this.$refs["addInfo"].validate((valid) => {
          if (valid) {
            this.$api.createGradeChange(this.addInfo).then((data) => {
              if (data.code == 1) {
                this.$sfNotify({
                  message: "成功",
                });
                setTimeout(this.getTableDataList, 2000);
                this.$router.push({ path: "/user/grade/change" });
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
      } else {
        this.$refs["addInfo"].validate((valid) => {
          if (valid) {
            this.addInfo.id = this.detailId;
            this.$api.editGradeChange(this.addInfo).then((data) => {
              if (data.code == 1) {
                this.$sfNotify({
                  message: "成功",
                });
                setTimeout(this.getTableDataList, 2000);
                this.$router.push({ path: "/user/grade/change" });
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
      }
    },
    handleBack() {
      this.$router.push({ path: "/user/grade/change" });
    },
  },
  destroyed() {
    document.documentElement.style.minWidth = "1200px";
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/user/gradeChangeAdd.scss";
</style>
