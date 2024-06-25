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
        >添加权益</span
      >
      <span class="section-title" v-else
        >编辑权益</span
      >
    </div>
    <div class="section-container change-box">
      <div class="section-item-header clearfix">
        <span class="manager-span">
          <div class="section-header">
            <div class="section-item-header">
              <span>{{
                detailId ? "编辑权益" : "添加权益"
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
            <div class="section-left"><span class="team-left-blod">权益类型</span></div>
            <div class="section-right">
              <el-form-item prop="type">
                <el-select
                  v-model="addInfo.type"
                  placeholder="请选择权益类型"
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
              </el-form-item>
            </div>
          </div>
          <div class="section-list">
            <div class="section-left"><span class="team-left-blod">权益名称</span></div>
            <div class="section-right">
              <el-form-item prop="title">
                <el-input
                  maxlength="25"
                  v-model="addInfo.title"
                  placeholder="请输入权益名称"
                />
              </el-form-item>
            </div>
          </div>
          <div class="section-list">
            <div class="section-left"><span>权益内容</span></div>
            <div class="section-right">
              <div class="team-pay" v-if="addInfo.type == 1">
                <span class="team-ac-require">现金优惠：</span>
                <el-form-item prop="number">
                  <el-input
                    class="input-160"
                    type="number"
                    maxlength="5"
                    v-model="addInfo.number"
                    placeholder="请输入优惠券数量"
                  />
                </el-form-item>
                <span class="team-ac-enjoy">张</span>
                <el-form-item prop="amount">
                  <el-input
                    class="input-160"
                    maxlength="5"
                    type="number"
                    v-model="addInfo_amount"
                    oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')"
                    placeholder="请输入优惠金额"
                  />
                </el-form-item>
                <span class="team-ac-enjoy">元，现金券</span>
              </div>
              <div class="team-pay" v-if="addInfo.type == 2">
                   <span class="team-ac-require">折扣优惠：</span>
                <el-form-item prop="number">
                  <el-input
                    class="input-160"
                    maxlength="5"
                    type="number"
                    v-model="addInfo.number"
                    placeholder="请输入优惠券数量"
                  />
                </el-form-item>
                <span class="team-ac-enjoy">张</span>
                <el-form-item prop="discount">
                  <el-input
                    class="input-160"
                    @input="input"
                    type="number"
                    v-model="addInfo_discount"
                    placeholder="请输入优惠折扣1.0-10.0"
                  />
                </el-form-item>
                <span class="team-ac-enjoy">折，折扣券</span>
              </div>
              <div class="team-pay" v-if="addInfo.type == 3">
                <span class="team-ac-require">电度优惠：</span>
                <el-form-item prop="number">
                  <el-input
                    class="input-160"
                    maxlength="5"
                    type="number"
                    v-model="addInfo.number"
                    placeholder="请输入优惠券数量"
                  />
                </el-form-item>
                <span class="team-ac-enjoy">张</span>
                <el-form-item prop="amount">
                  <el-input
                    class="input-160"
                    maxlength="5"
                    type="number"
                    v-model="addInfo_amount"
                    placeholder="请输入优惠度数"
                  />
                </el-form-item>
                <span class="team-ac-enjoy">度，电度券</span>
              </div>
            </div>
          </div>
          <div class="section-list">
            <div class="section-right">
              <div class="team-pay" v-if="addInfo.type == 1">
                <span class="team-ac-enjoy">支付金额满</span>
                <el-form-item prop="min_good_amount">
                  <el-input
                    class="input-160"
                    maxlength="5"
                    type="number"
                    v-model="addInfo.min_good_amount"
                    oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')"
                    placeholder="请输入金额"
                  />
                  <i class="only-i">*账单享受优惠</i>
                </el-form-item>
                <span class="team-ac-enjoy">元时可以使用，有效期</span>
                <el-form-item prop="expire">
                  <el-input
                    class="input-160"
                    maxlength="5"
                    type="number"
                    v-model="addInfo.expire"
                    placeholder="请输入天数"
                  />
                  <i class="only-i">*发券后开始计算</i>
                </el-form-item>
                <span class="team-ac-enjoy">天</span>
              </div>
              <div class="team-pay" v-if="addInfo.type == 2">
                <span class="team-ac-enjoy">服务费金额满</span>
                <el-form-item prop="min_good_amount">
                  <el-input
                    class="input-160"
                    maxlength="5"
                    type="number"
                    oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')"
                    v-model="addInfo.min_good_amount"
                    placeholder="请输入金额"
                  />
                  <i class="only-i">*仅服务费享受优惠</i>
                </el-form-item>
                <span class="team-ac-enjoy">元时可以使用，有效期</span>
                <el-form-item prop="expire">
                  <el-input
                    class="input-160"
                    maxlength="5"
                    type="number"
                    v-model="addInfo.expire"
                    placeholder="请输入天数"
                  />
                  <i class="only-i">*发券后开始计算</i>
                </el-form-item>
                <span class="team-ac-enjoy">天</span>
              </div>
              <div class="team-pay" v-if="addInfo.type == 3">
                <span class="team-ac-enjoy">电度度数满</span>
                <el-form-item prop="min_good_amount">
                  <el-input
                    class="input-160"
                    maxlength="5"
                    type="number"
                    v-model="addInfo.min_good_amount"
                    placeholder="请输入度数"
                  />
                  <i class="only-i">*仅电费享受优惠</i>
                </el-form-item>
                <span class="team-ac-enjoy">度时可以使用，有效期</span>
                <el-form-item prop="expire">
                  <el-input
                    class="input-160"
                    maxlength="5"
                    type="number"
                    v-model="addInfo.expire"
                    placeholder="请输入天数"
                  />
                  <i class="only-i">*发券后开始计算</i>
                </el-form-item>
                <span class="team-ac-enjoy">天</span>
              </div>
            </div>
          </div>
        </el-form>
      </div>
      <div class="section-item-header team-header"></div>
      <div
        class="box-bottom clearfix"
        style="display: flex; justify-content: center; margin-top: 20px"
      >
        <div class="btn_succ" @click="saveEquitySure()">
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
      addInfo_discount:"",
      addInfo_amount:"",
      addInfo:{
        title : '',
        type : '1',
        number : '',
        min_good_amount:'',
        expire:'',
      },
      watch_old_type:'',//为了切换权益类型的时候记住最初的编辑详情
      
      detailId : this.$route.query.id,
      dataRules: {
        type: [{ required: true, message: "* 请填写权益类型", trigger: "blur" }],
        title: [{ required: true, message: "* 请填写权益名称", trigger: "blur" }],
        number: [{ required: true, message: "* 请填写张数", trigger: "blur" }],
        // min_good_amount: [{ required: true, message: "* 仅服务费享受优惠", trigger: "blur" }],
        // expire: [{ required: true, message: "* 发券后开始计算", trigger: "blur" }],
      },
    };
  },
  mounted() {
    this.$nextTick(() => {
      document.documentElement.style.minWidth = "1200px";
    });
  },
  created() {
    if(this.detailId){
      this.getDetailList();
    }
  },
  watch : {
    "addInfo.type":{
      handler: function (newItem,oldItem) {
        this.addInfo_discount = '';
        this.addInfo_amount = '';
        this.addInfo.number = '';
        this.addInfo.min_good_amount = '';
        this.addInfo.expire = '';
        if(this.addInfo.type == this.watch_old_type){
          this.getDetailList();
        }
      },
      deep: true,
    },
  },
  methods: {
    getDetailList() {
      this.$api.detailEquity({id : this.detailId}).then(data => {
        if (data.code == 1) {
          this.addInfo.title = data.data.title;
          this.addInfo.type = data.data.type;
          this.watch_old_type = data.data.type;
          this.addInfo.number = data.data.number;
          this.addInfo.min_good_amount = data.data.min_good_amount;
          this.addInfo.expire = data.data.expire;
          if(data.data.type == 2){
            this.addInfo_discount = data.data.discount;
          }else{
            this.addInfo_amount = data.data.amount;
          }
        }
      });
    },
    handleBack() {
      this.$router.push({ path: "/user/grade/equity" });
    },
    input(e){
      e=(e.match(/^\d*(\.?\d{0,1})/g)[0]) || null
      this.addInfo_discount = e
    },
    saveEquitySure() {
      if(this.addInfo.type == 2){
        if(!this.addInfo_discount){
          this.$sfNotify({
              duration: 0,
              type: "error",
              message: '请填写优惠折扣',
          });
          return false;
        }
        this.addInfo.discount = this.addInfo_discount;
        if(this.addInfo.discount<1 ||this.addInfo.discount>10 ){
          this.$sfNotify({
            duration: 0,
            type: "error",
            message: '优惠折扣范围为1.0~10.0',
          });
          return false;
        }
        this.addInfo.amount = '';
      }else{
         if(!this.addInfo_amount){
          this.$sfNotify({
              duration: 0,
              type: "error",
              message: '请填写优惠',
          });
          return false;
        }
        this.addInfo.amount = this.addInfo_amount;
        this.addInfo.discount = '';
      }
      if (!this.detailId) {
        // 添加
        this.$refs["addInfo"].validate((valid) => {
          if (valid) {
            this.$api.createEquity(this.addInfo).then((data) => {
              if (data.code == 1) {
                this.$sfNotify({
                  message: "成功",
                });
                setTimeout(this.getTableDataList, 2000);
                this.$router.push({ path: "/user/grade/equity" });
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
            this.$api.editEquity(this.addInfo).then((data) => {
              if (data.code == 1) {
                this.$sfNotify({
                  message: "成功",
                });
                setTimeout(this.getTableDataList, 2000);
                this.$router.push({ path: "/user/grade/equity" });
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
  },
  destroyed() {
    document.documentElement.style.minWidth = "1200px";
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/user/gradeEquityAdd.scss";
</style>
