<template>
  <section>
    <div class="section-title">等级管理</div>
    <div class="section-container">
       <div class="section-item-router">
            <router-link to="/user/grade/class">等级配置管理</router-link>
            <router-link to="/user/grade/score">积分配置管理</router-link>
            <router-link to="/user/grade/change" class="section-act">积分兑换管理</router-link>
            <router-link to="/user/grade/equity">权益配置管理</router-link>
       </div>
      <div class="section-item-header section-item-btn clearfix">
        <div class="content-item user-only">
          <div class="header-left" style="padding-right: 24px !important">
            <div class="header-left">积分兑换名称</div>
          </div>
          <div class="header-right">
            <el-input
              class="search-input"
              v-model="modelInfo.search"
              placeholder="关键字搜索"
            />
          </div>
        </div>
        <div class="content-item">
            <div
              class="btn_succ"
              @click="search"
            >查询</div>
            <div
              class="btn_cancel"
              @click="reset"
            >重置</div>
          </div>
        <div class="btn_succ add-coupon" @click="handleAdd(0)">
          <i class="add-station"></i>添加兑换规则 
        </div>
      </div>
      <div class="section-main">
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td">添加时间</div>
            <div class="table-td">积分兑换名称</div>
            <div class="table-td">所需积分</div>
            <div class="table-td">权益名称</div>
            <div class="table-td">权益内容</div>
            <div class="table-td">操作</div>
          </div>
          <div
            class="table-body"
            v-loading="listLoading"
          >
            <div
              class="table-tr"
              v-show="tableData && tableData.length > 0"
              v-for="(change, index) in tableData"
              :key="index"
            >
              <div class="table-td">
                <div class="td-item">{{change.creat_time}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{change.title}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{change.integral}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{change.e_title}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{change.number}}张 {{change.e_type == 2 ? change.e_discount : change.e_amount }}{{change.e_type == 2 ? "折优惠券" : (change.e_type == 1 ? '元优惠券' : '度优惠券') }}</div>
              </div>
              <div class="table-td table-operate">
                <el-tooltip
                  content="编辑"
                  placement="top"
                >
                  <div class="td-item edit-icon" @click="handleAdd(change.id)"></div>
                </el-tooltip>
                <el-tooltip
                  content="删除"
                  placement="top"
                >
                  <div class="td-item delete-icon" @click="delClass(change)"></div>
                </el-tooltip>
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
          <!-- 分页 -->
          <sf-pagination
            v-if="tableData && tableData.length > 0"
            :currentPage="currentPage"
            :page-count="page_count"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
    <!-- 删除确认 -->
    <sf-modelBox
      :showModel.sync="showDelete"
      title="删除确认"
      type="delete"
      :show_flag="del_flag"
      @change="saveDeleteSure"
    >
     <!-- v-if="del_flag" -->
      <p>确定要删除此规则吗？</p>
      <!-- <p v-else>当前等级用户有{{grade_user_count}}个，不可删除</p>
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
        </div> -->
    </sf-modelBox>
  </section>
</template>

<script>
export default {
  data() {
    return {
      modelInfo:{
        search : ''
      },
      tableData: [],
      listLoading: false,
      showDelete: false,
      
      //编辑积分的修改
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
    this.getTableList();
  },
  methods: {
    //获取等级的列表
    getTableList() {
      this.listLoading = true;
      this.modelInfo.page = this.currentPage;
      this.$api.gradeChangeList(this.modelInfo).then(data => {
        this.listLoading = false;
        if (data.code == 1) {
          this.tableData = data.data.list;
          this.currentPage = data.data.current_page;
          this.page_count = data.data.page_total;
        }
      });
    },
    //添加修改点击操作
    handleAdd(id) {
        if(id){
            this.$router.push({path : '/user/grade/addchange',query:{id}})
        }else{
            this.$router.push({path : '/user/grade/addchange'})
        }
    },
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
    //删除操作
    saveDeleteSure() {
      // if(!this.isSurePassword){
      //   this.$sfNotify({
      //     duration: 0,
      //     type: "error",
      //     message: "密码不能为空"
      //   });
      //   return false;
      // }
      // ,password:this.isSurePassword
      this.$api.deleteGradeChange({id: this.del_class_id}).then(data => {
        this.showDelete = false;
        if (data.code == 1) {
          this.$sfNotify({
            message: "成功"
          });
          this.getTableList();
        } else {
          this.$sfNotify({
            duration: 0,
            type: "error",
            message: "失败"
          });
        }
      });
    },
    search(){
      this.currentPage = 1;
      this.getTableList();
    },
    reset(){
      this.currentPage = 1;
      this.modelInfo.search = '';
      this.getTableList();
    },
    // 点击分页触发
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getTableList();
    },
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/user/gradeChange.scss";
</style>
