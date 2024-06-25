<template>
  <section>
    <div class="section-title">等级管理</div>
    <div class="section-container">
       <div class="section-item-router">
            <router-link to="/user/grade/class">等级配置管理</router-link>
            <router-link to="/user/grade/score">积分配置管理</router-link>
            <router-link to="/user/grade/change">积分兑换管理</router-link>
            <router-link to="/user/grade/equity" class="section-act">权益配置管理</router-link>
       </div>
      <div class="section-item-header section-item-btn clearfix">
          <div class="content-item user-only">
            <div class="header-left" style="padding-right: 24px !important">
                <div class="header-left">权益名称</div>
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
                <i class="add-station"></i>添加权益 
           </div>
      </div>
      <div class="section-main">
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td">添加时间</div>
            <div class="table-td">权益名称</div>
            <div class="table-td">权益类型</div>
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
              v-for="(equity, index) in tableData"
              :key="index"
            >
              <div class="table-td">
                 <div class="td-item">{{equity.create_time}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{equity.title}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{equity_type_array[equity.type]}}</div>
              </div>
              <div class="table-td">
                  <div class="td-item" v-if="equity.type == 1">{{equity.number}}张{{equity.amount}}元现金劵,支付金额满{{equity.min_good_amount}}元可用,有效期{{equity.expire}}天</div>
                  <div class="td-item" v-else-if="equity.type == 2">{{equity.number}}张{{equity.discount}}折折扣劵,服务费金额满{{equity.min_good_amount}}元可用,有效期{{equity.expire}}天</div>
                  <div class="td-item" v-else>{{equity.number}}张{{equity.amount}}度电度劵,电度度数满{{equity.min_good_amount}}度可用,有效期{{equity.expire}}天</div>
              </div>
              <div class="table-td table-operate" v-if="!equity.i_use && !equity.p_use">
                <el-tooltip
                  content="编辑"
                  placement="top"
                >
                  <div class="td-item edit-icon" @click="handleAdd(equity.id)"></div>
                </el-tooltip>
                <el-tooltip
                  content="删除"
                  placement="top"
                >
                  <div class="td-item delete-icon" @click="delClass(equity)"></div>
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
     equity_type_array: {
        "1": "现金立减",
        "2": "专享折扣",
        "3": "电度优惠",
      },
      tableData: [],
      listLoading: false,
      //列表数据
      currentPage: 1, 
      page_count: 10,
      
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
    getTableList() {
      this.listLoading = true;
      this.modelInfo.page = this.currentPage;
      this.$api.gradeEquityList(this.modelInfo).then(data => {
        this.listLoading = false;
        if (data.code == 1) {
          this.tableData = data.data.list;
          this.currentPage = data.data.current_page;
          this.page_count = data.data.page_total;
        }
      });
    },
    //添加点击操作
    handleAdd(id) {
        if(id){
            this.$router.push({path : '/user/grade/addequity',query:{id}})
        }else{
            this.$router.push({path : '/user/grade/addequity'})
        }
    },
    // 确认删除
    saveDeleteSure() {
      // ,password:this.isSurePassword
      this.$api.delEquity({ id: this.del_class_id}).then((data) => {
        this.delete_id = "";
        this.showDelete = false;
        if (data.code == 1) {
          this.$sfNotify({
            message: "成功",
          });
          setTimeout(this.getTableList, 1500);
        } else {
          this.$sfNotify({
            duration: 0,
            type: "error",
            message: "失败",
          });
        }
      });
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
@import "../../assets/css/user/gradeEquity.scss";
</style>
