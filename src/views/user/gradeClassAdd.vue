<template>
  <section>
    <div class="section-title">
      <span
        class="section-title section-title-act"
        @click="handleBack()"
        >等级管理</span
      >
      <span class="section-title">></span>
      <span class="section-title">{{currentItem.id ? '编辑等级' : '添加等级'}}</span>
    </div>
    <div class="section-container change-box">
      <div class="section-item-header clearfix">
        <span class="manager-span">
          <div class="section-header">
            <div class="section-item-header">
              <span>{{
                currentItem.id ? "编辑等级" : "添加等级"
              }}</span>
            </div>
          </div>
        </span>
      </div>
      <div
        class="box-outer"
      >
        <!-- :title="currentItem.id == 0 ? '添加组队活动信息' : '编辑组队活动信息'" -->
        <el-form :model="gradeClassInfo" ref="gradeClassInfo" :rules="teamDataRules">
          <div class="section-list">
            <div class="section-left"><span class="team-left-blod">等级级别</span></div>
            <div class="section-right">
              <el-form-item prop="class">
                <el-input
                    class="el-input-falut"
                    v-model="integral_type_array[gradeClassInfo.level]"
                    :disabled="true"
                    placeholder="请输入等级级别"
                />
                </el-form-item>
                <span class="team-valid">
                （等级最多可以设置到第八级别）
                </span>
            </div>
          </div>
          <div class="section-list">
            <div class="section-left"><span class="team-left-blod">等级名称</span></div>
            <div class="section-right">
              <el-form-item prop="name">
                <el-input
                    class="el-select"
                    v-model="gradeClassInfo.name"
                    placeholder="请输入等级名称"
                />
               </el-form-item>
            </div>
          </div>
          <div class="section-list">
            <div class="section-left"><span class="team-left-blod">等级升级条件</span></div>
            <div class="section-right">
              <div class="team-pay">
                <span class="team-ac-enjoy">上月支付总度数满</span>
                <el-form-item prop="amount">
                  <el-input
                    class="input-160"
                    maxlength="5"
                    type="number"
                    v-model="gradeClassInfo.amount"
                    placeholder="请输入"
                  />
                </el-form-item>
                <span class="team-ac-enjoy">度</span>
                <span class="team-valid">
                （每月初计算上个月消费的度数确定本月用户的等级）
                 </span>
              </div>
            </div>
          </div>
          <div class="section-list">
            <div class="section-left"><span class="team-left-blod"> 等级权益</span></div>
            <div class="section-right">
              <div class="section-right-36"><span class="team-enough">满足当前级别可享受权益</span><span class="team-valid">（提前在权益配置管理配好模板）</span></div>
            </div>
          </div>
          <div class="section-list">
            <div class="section-left">
              <div class="checkbox-item">
                  <span
                  class="checkbox-icon"
                  :class="{
                      'checkbox-act-icon': only_checked,
                      'no-touch': !discount1}"
                  @click="handleOnly()"
                  ></span
                  >
              </div>
            </div>
            <div class="section-right">
              <span class="team-ac-enjoy">专享折扣：</span>
              <el-select
                v-model="discount1"
                placeholder="请选择专享折扣权益名称"
              >
                <el-option
                  v-for="(item, index) in only_discount"
                  :key="index"
                  :label="item.title"
                  :value="item.id"
                />
              </el-select>
            </div>
          </div>
          <div class="section-list">
            <div class="section-left">
              <div class="checkbox-item">
                  <span
                  class="checkbox-icon"
                  :class="{
                      'checkbox-act-icon': cash_checked,
                      'no-touch': !discount2}"
                  @click="handleCash()"
                  ></span
                  >
              </div>
            </div>
            <div class="section-right">
              <span class="team-ac-enjoy">现金立减：</span>
              <el-select
                v-model="discount2"
                placeholder="请选择现金立减权益名称"
              >
                <el-option
                  v-for="(item, index) in cash_discount"
                  :key="index"
                  :label="item.title"
                  :value="item.id"
                />
              </el-select>
            </div>
          </div>
          <div class="section-list">
            <div class="section-left">
              <div class="checkbox-item">
                  <span
                  class="checkbox-icon"
                  :class="{
                      'checkbox-act-icon': elec_checked,
                      'no-touch': !discount3
                      }"
                  @click="handleElec()"
                  ></span
                  >
              </div>
            </div>
            <div class="section-right">
              <span class="team-ac-enjoy">电度优惠：</span>
              <el-select
                v-model="discount3"
                placeholder="请选择电度优惠权益名称"
              >
                <el-option
                  v-for="(item, index) in elec_discount"
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
        <div class="btn_succ" @click="saveClassInfo()">
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
export default {
  data() {
    return {
      integral_type_array: {
        "1": "一级",
        "2": "二级",
        "3": "三级",
        "4": "四级",
        "5": "五级",
        "6": "六级",
        "7": "七级",
        "8": "八级",
        '0': "其他"
      },
      listLoading: false,
      gradeClassInfo:{
        level: '',
        name:'',
        amount:'',
        equity_ids:[]
      },
      only_discount:[],//待选中列表
      cash_discount:[],
      elec_discount:[],
      only_checked: false, //选中按钮
      cash_checked: false,
      elec_checked: false,
      discount1 : '',//选中的值
      discount2 : '',
      discount3 : '',


      currentItem: {
        id: this.$route.query.id,
      },
       //选框
      saleChecked: [],
      sale_arr: { id: "1" },
      sale_ids: [], //为了全选的时候，取到所有数据
      checkbox_all: false,

      isShowWriteWord: false, //显示‘编辑活动’或者‘添加活动’
      currentPage: 1,
      page_count: 1,
      listLoading: false,
   
      detailId : this.$route.query.id,
      teamDataRules: {
        people_number: [{ required: true, message: "* 请填写团队成员最大限额", trigger: "blur" }],
        expire_day: [{ required: true, message: "* 请填写有效期", trigger: "blur" }],
        total_amount: [{ required: true, message: "* 请填写金额", trigger: "blur" }],
        number: [{ required: true, message: "* 请填写优惠券数量", trigger: "blur" }],
        discount: [{ required: true, message: "* 请填写优惠折扣", trigger: "blur" }],
        min_good_amount: [{ required: true, message: "* 请填写服务金额", trigger: "blur" }],
      },

      discount : [],
      discount_name : [],
    };
  },
  mounted() {
    this.$nextTick(() => {
      document.documentElement.style.minWidth = "1300px";
    });
  },
  created() {
    this.getEquityType();
    if(this.currentItem.id){
      this.getClassDetail();
    }else{
      this.getGradeClass();
    }
  },
  watch: {
    'discount1' : {
      handler(newItem){
        this.only_checked = true;
      },
        deep: true
    },
    'discount2' : {
      handler(newItem){
        this.cash_checked = true;
      },
        deep: true
    },
    'discount3' : {
      handler(newItem){
        this.elec_checked = true;
      },
        deep: true
    },
  },
  methods: {
    getGradeClass() {
      this.$api.integralGetMaxLevel().then(data => {
        if (data.code == 1) {
         let level = data.data.level;
         if(level <= 8){
           this.gradeClassInfo.level = level;
         }else{
           this.gradeClassInfo.level = '0';
         }
        }
      });
    },
    getEquityType() {
      this.$api.integralGetEquityType({id : this.currentItem.id}).then(data => {
        if (data.code == 1) {
          let item =  data.data;
          if(item['2']){
            this.only_discount = item['2'];
            item['2'].forEach((val) => {
              if(val.checked == 1){
                this.only_checked = val.checked;
                this.discount1 = val.id;
              }
            })
          }
          if(item['1']){
            this.cash_discount = item['1'];
             item['1'].forEach((val) => {
              if(val.checked == 1){
                this.cash_checked = val.checked;
                this.discount2 = val.id;
              }
            })
          }

          if(item['3']){
            this.elec_discount = item['3'];
            item['3'].forEach((val) => {
              if(val.checked == 1){
                this.elec_checked = val.checked;
                this.discount3 = val.id;
              }
            })
          }

        }
      });
    },
    getClassDetail() {
      this.$api.integralClassDetail({id : this.currentItem.id}).then(data => {
        if (data.code == 1) {
          this.gradeClassInfo.level = data.data.level;
          this.gradeClassInfo.name = data.data.name;
          this.gradeClassInfo.amount = data.data.amount;
        }
      });
    },
    handleOnly(){
      if(this.discount1){
        this.only_checked = !this.only_checked;
      }
    },
    handleCash(){
      if(this.discount2){
        this.cash_checked = !this.cash_checked;
      }
    },
    handleElec(){
      if(this.discount3){
        this.elec_checked = !this.elec_checked;
      }
    },
    handleBack() {
      this.$router.push({ path: "/user/grade/class" });
    },
    //添加or保存操作
    saveClassInfo() {
      if(this.gradeClassInfo.level > 8){
        this.$sfNotify({
          duration: 0,
          type: "error",
          message: "等级级别最高8级"
        });
      }
      let arr = [];
      if(this.only_checked){
        arr.push(this.discount1)
      }
      if(this.cash_checked){
        arr.push(this.discount2)
      }
      if(this.elec_checked){
        arr.push(this.discount3)
      }
      this.gradeClassInfo.equity_ids = arr;
      //添加
      if(!this.currentItem.id){
        this.$api.createIntegral(this.gradeClassInfo).then(data=>{
          if(data.code ==1){
            this.$sfNotify({
              message: "成功"
            });
            this.$router.push({path : '/user/grade/class'})
          }else{
            this.$sfNotify({
              duration: 0,
              type: "error",
              message:data.message
            });
          }
        })
      }
      //修改
      if(this.currentItem.id){
        this.gradeClassInfo.id = this.currentItem.id
        this.$api.updateIntegral(this.gradeClassInfo).then(data=>{
          if(data.code ==1){
            this.$sfNotify({
              message: "成功"
            });
            this.$router.push({path : '/user/grade/class'})
          }else{
            this.$sfNotify({
              duration: 0,
              type: "error",
              message:data.message
            });
          }
        })
      }
    },
  },
  destroyed() {
    document.documentElement.style.minWidth = "1200px";
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/user/gradeClassAdd.scss";
</style>
