<template>
  <section>
    <div class="section-title">等级管理</div>
    <div class="section-container">
       <div class="section-item-router">
            <router-link
            to="/user/grade/class"
            class="section-act"
            >等级配置管理</router-link>
            <router-link to="/user/grade/score">积分配置管理</router-link>
            <router-link to="/user/grade/change">积分兑换管理</router-link>
            <router-link to="/user/grade/equity">权益配置管理</router-link>
       </div>
      <div class="section-item-header section-item-btn clearfix">
        <div class="section-item-word">【注意】 等级以及对应权益的配置修改，会实时同步给app展示，但是“等级计算和权益发放”实际生效时间为下个月。</div>
        <div class="btn_succ add-coupon" @click="handleAdd(0)">
          <i class="add-station"></i>添加等级 
        </div>
        <div class="btn_delete instruction-btn" @click="checkInstruction">
          等级说明
        </div>
      </div>
      <div class="section-main">
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td">等级级别</div>
            <div class="table-td">等级名称</div>
            <div class="table-td">等级升级条件</div>
            <div class="table-td">等级权益</div>
            <div class="table-td">操作</div>
          </div>
          <div
            class="table-body"
            v-loading="listLoading"
          >
            <div
              class="table-tr"
              v-show="tableData && tableData.length > 0"
              v-for="(integral, index) in tableData"
              :key="index"
            >
              <div class="table-td">
                 <div class="td-item">{{integral_type_array[integral.level]}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{integral.name}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{integral.level == 1 ? '已注册用户' : "上月充电度数满"+integral.amount+"度"}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{integral.equity}}</div>
              </div>
              <div class="table-td table-operate" v-if="integral.level !=1">
                <el-tooltip
                  content="编辑"
                  placement="top"
                >
                  <div class="td-item edit-icon" @click="handleAdd(integral.id)"></div>
                </el-tooltip>
                <el-tooltip
                  content="删除"
                  placement="top"
                >
                  <div class="td-item delete-icon" @click="delClass(integral)"></div>
                </el-tooltip>
              </div>
              <div class="table-td table-operate" v-else>
                --
              </div>
            </div>
            <div
              v-if="!tableData || tableData.length == 0"
              class="table-tr unData"
            >
              <img :src="require('assets/img/unData.png')">
              <span>暂无数据</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 添加/修改告警 -->
    <!-- <sf-modelBox
      class="grade-class"
      :showModel.sync="showGradeClassInfo"
      :title="currentItem.id== 0 ? '添加等级' : '修改等级'"
      @change="saveClassInfo(currentItem.id)"
    >
      <el-form
        :model="gradeClassInfo"
        ref="gradeClassInfo"
        :rules="dataRules"
      >
        <div class="box-list">
          <div class="box-left">等级级别</div>
          <div class="box-right">
            <el-form-item prop="class">
              <el-input
                class="el-input-falut"
                v-model="integral_type_array[gradeClassInfo.level]"
                :disabled="true"
                placeholder="请输入等级级别"
              />
            </el-form-item>
            <span class="class-only-one">
              * 等级最多可以设置到第八级别
            </span>
          </div>
        </div>
        <div class="box-list">
          <div class="box-left">等级名称</div>
          <div class="box-right">
            <el-form-item prop="name">
              <el-input
                class="el-select"
                v-model="gradeClassInfo.name"
                placeholder="请输入等级名称"
              />
            </el-form-item>
          </div>
        </div>
        <div class="box-list">
          <div class="box-left">升级所需积分</div>
          <div class="box-right">
            <el-form-item prop="amount">
              <el-input
                class="el-select"
                v-model="gradeClassInfo.amount"
                placeholder="请输入升级积分"
                :disabled="change_amount_flag"
              />
              <span class="class-give">分</span>
            </el-form-item>
          </div>
        </div>
        <div class="box-list">
          <div class="box-left">等级享受折扣</div>
          <div class="box-right">
            <el-form-item prop="discount">
              <el-input
                class="el-select"
                v-model="gradeClassInfo.discount"
                placeholder="等级享受折扣"
                oninput="if(value>10)value=10"
              />
              <span class="class-give">折</span>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </sf-modelBox> -->
    <!-- 删除确认 -->
    <sf-modelBox
    class="grade-class-sure"
      :showModel.sync="showDelete"
      title="删除确认"
      type="delete"
      :show_flag="del_flag"
      @change="saveDeleteSure"
    >
      <p class="p1">删除等级将会影响现有用户，请谨慎操作！</p>
      <p class="p2">等级数据将会实时更新在APP展示，如果删除的等级有用户，用户会出现降级现象。</p>
      <!-- <p v-if="del_flag">删除等级会影响现有用户，请谨慎操作！</p> -->
      <!-- <p v-else>当前等级用户有{{grade_user_count}}个，不可删除</p> -->
      <div class="box-list box-list-del" v-if="del_flag">
          <div class="box-left">登录密码</div>
          <div class="box-right">
              <el-input
                type="password"
                class="el-select"
                v-model="isSurePassword"
                placeholder="请输入平台登录密码"
              />
          </div>
        </div>
    </sf-modelBox>
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
        "8": "八级"
      },
      tableData: [],
      listLoading: false,
      max_level:'1',
      gradeClassInfo:{
        'level':1,
        'name':'',
        'amount':'',
        'discount':''
      },
      showGradeClassInfo: false,
      showDelete: false,
      currentItem: {
        id: 0
      },
      dataRules: {
        name: [
          { required: true, message: "* 请输入等级名称", trigger: "blur" }
        ],
        amount: [
          { required: true, message: "* 请输入升级积分", trigger: "blur" }
        ],
        discount: [
          { required: true, message: "* 请输入等级享受折扣", trigger: "blur" }
        ],
      },
      //编辑积分的修改
      change_amount_flag:false,
      del_class_id: "",
      del_flag:true,
      grade_user_count:'',
      // 删除确认，登录密码
      isSurePassword : '',
    };
  },
  filters: {
    ellipsis(value) {
      if (!value) return "--";
      if (value.length > 41) {
        return value.slice(0, 41) + "...";
      }
      return value;
    }
  },
  created() {
    this.getTableDataList();
  },
  methods: {
    checkInstruction(){
      this.$router.push({path : '/user/grade/instructe'})
    },
    //添加修改点击操作
    handleAdd(id) {
        if(id){
            this.$router.push({path : '/user/grade/addclass',query:{id}})
        }else{
            this.$router.push({path : '/user/grade/addclass'})
        }
    },
    //添加点击操作
    // addButton(id) {
    //   this.currentItem.id = id;
    //   // 添加
    //   let level = 1
    //   if(parseInt(this.max_level) >= 8){
    //     level = 1;
    //   }else{
    //     level = parseInt(this.max_level) + 1
    //   }
    //   this.gradeClassInfo = {
    //     'level':level,
    //     'name':'',
    //     'amount':'',
    //     'discount':''
    //   }
    //   this.showGradeClassInfo = true;
    //   this.change_amount_flag = false
    // },
    //修改点击操作
    // editButton(row){
    //   this.currentItem.id = row.id;
    //   this.gradeClassInfo = {
    //     'level':row.level,
    //     'name':row.name,
    //     'amount':row.amount,
    //     'discount':row.discount
    //   }
    //   if(row.count){
    //     this.change_amount_flag = true
    //   }else{
    //     this.change_amount_flag = false
    //   }
    //   this.showGradeClassInfo = true;
    // },
    delClass(row) {
      this.del_class_id = row.id;
      if(row.count){
        this.del_flag = false
        this.grade_user_count = row.count
      }else{
        this.del_flag = true
        this.grade_user_count = 0
      }
      this.showDelete = true;
    },
    //获取等级的列表
    getTableDataList() {
      this.listLoading = true;
      this.$api.integralList({}).then(data => {
        this.listLoading = false;
        if (data.code == 1) {
          this.tableData = data.data.list;
          this.max_level = data.data.max_level;
        }else{
          this.tableData = [];
        }
      });
    },
    //添加or保存操作
    // saveClassInfo(id) {
    //   let check_flag = true
    //   this.$refs['gradeClassInfo'].validate(valid=>{
    //     if(!valid){
    //       check_flag = false;
    //     }
    //   })
    //   if(!check_flag){
    //     return false;
    //   }
    //   //添加
    //   if(id == 0){
    //     this.$api.createIntegral(this.gradeClassInfo).then(data=>{
    //       if(data.code ==1){
    //         this.$sfNotify({
    //           message: "成功"
    //         });
    //         this.getTableDataList();
    //         this.showGradeClassInfo = false;
    //       }else{
    //         this.$sfNotify({
    //           duration: 0,
    //           type: "error",
    //           message:data.message
    //         });
    //       }
    //     })
    //   }
    //   //修改
    //   if(id){
    //     this.gradeClassInfo.id = this.currentItem.id
    //     this.$api.updateIntegral(this.gradeClassInfo).then(data=>{
    //       if(data.code ==1){
    //         this.$sfNotify({
    //           message: "成功"
    //         });
    //         this.getTableDataList();
    //         this.showGradeClassInfo = false;
    //       }else{
    //         this.$sfNotify({
    //           duration: 0,
    //           type: "error",
    //           message:data.message
    //         });
    //       }
    //     })
    //   }
    // },
    //删除操作
    saveDeleteSure() {
      if(!this.isSurePassword){
        this.$sfNotify({
          duration: 0,
          type: "error",
          message: "密码不能为空"
        });
        return false;
      }
      this.$api.deleteIntegral({id: this.del_class_id,password:this.isSurePassword}).then(data => {
        this.showDelete = false;
        console.log('**',data);
        if (data.code == 1) {
          this.$sfNotify({
            message: "成功"
          });
          this.getTableDataList();
        } else {
          this.$sfNotify({
            duration: 0,
            type: "error",
            message: data.message
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/user/gradeClass.scss";
</style>
