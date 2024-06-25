<template>
  <section>
    <div class="section-title">
      <router-link to="/user/users">消费用户</router-link> > 用户详情
    </div>
    <p class="section-name">用户 {{user_id}} 详情</p>
    <div class="section-header">
      <div class="section-item-router">
        <router-link
          :to="`/user/users/detail/${user_id}`"
        >基本信息</router-link>
        <router-link :to="`/user/users/amount/${user_id}`">金额明细</router-link>
        <router-link :to="`/user/users/level/${user_id}`">等级积分</router-link>
        <router-link :to="`/user/users/record/${user_id}`" class="section-act">邀请记录</router-link>
        <router-link :to="`/user/users/charge/${user_id}`" class="">充电记录</router-link>
      </div>
      <div class="section-main" style="margin-top:24px;">
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td table-column__1">序号</div>
            <div class="table-td">用户ID</div>
            <div class="table-td">用户名</div>
            <div class="table-td">用户账号</div>
            <div class="table-td">邀请状态</div>
          </div>
          <div
            class="table-body"
            v-loading="listLoading"
          >
            <div
              class="table-tr"
              v-show="tableData && tableData.length"
              v-for="(invite, index) in tableData"
              :key="index"
            >
              <div class="table-td table-column__1">
                <div class="td-item">{{index + 1}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{invite.shared_id}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{invite.shared_name}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{invite.shared_account}}</div>
              </div>
              <div class="table-td table-status">
                <div
                  class="td-item td-fault"
                  v-if="invite.status == 1"
                >{{invite_status[invite.status]}}</div>
                <div
                  class="td-item"
                  v-else
                >{{invite_status[invite.status]}}</div>
              </div>
            </div>
            <div
              class="table-tr unData"
              v-if="!tableData || tableData.length === 0"
            >
              <img :src="require('assets/img/unData.png')">
              <span>暂无数据</span>
            </div>
          </div>
          <!-- 分页 -->
          <sf-pagination
            v-if="tableData && tableData.length>0"
            :currentPage="currentPage"
            :page-count="page_count"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
    <!-- <div class="section-container">
      <div class="section-item-header">
        <span>邀请记录</span>
      </div>
      
    </div> -->
    <!-- 修改用户 -->
    <sf-modelBox
      class="addVipUser"
      :showModel.sync="showEditUser"
      title="修改用户"
      @change="saveUserInfo"
    >
      <el-form
        :model="userInfo"
        ref="userInfo"
        :rules="dataRules"
      >
        <div class="box-list">
          <div class="box-left">用户名</div>
          <div class="box-right">
            <el-form-item prop="user_name">
              <el-input
                v-model="userInfo.user_name"
                placeholder="请输入用户名"
              />
            </el-form-item>
          </div>
        </div>
        <div class="box-list">
          <div class="box-left">登录账号</div>
          <div class="box-right">
            <el-form-item prop="account">
              <el-input
                disabled
                v-model="userInfo.account"
                placeholder="请输入登录账号"
              />
            </el-form-item>
          </div>
        </div>
        <div class="box-list">
          <div class="box-left">登录密码</div>
          <div class="box-right">
            <el-form-item prop="pass">
              <el-input
                type="password"
                v-model="userInfo.pass"
                placeholder="请输入登录密码"
              />
            </el-form-item>
          </div>
        </div>
        <div class="box-list">
          <div class="box-left">用户优惠</div>
          <div class="box-right">
            <el-form-item prop="discount">
              <el-input
                v-model="userInfo.discount"
                type="number"
                placeholder="请输入用户优惠"
              />
              <span class="unit">折</span>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </sf-modelBox>
  </section>
</template>

<script>
export default {
  data() {
    const onlyInteger = async (rule, value, callback) => {
      const boolean =
        parseFloat(value) > 10 || parseFloat(value) < 0 ? true : false;
      if (boolean) {
        return callback(new Error("折扣应在0 到 10之间"));
      }
    };
    return {
      user_id: this.$route.params.id,
      currentPage: 1,
      page_count: 1,
      listLoading: false,
      loading: false,
      balance: "",
      charging_num: "",
      charging_quantity: "",
      nick_name: "",
      tel: "",
      user_type: "",
      user_type_word: "",
      user_type_array: {
        "1": "APP用户",
        "2": "企业用户",
        "3": "特权用户"
      },
      invite_status: {
        "1": "未注册",
        "2": "已注册",
        "3": "已消费"
      },
      user_discount: "",
      user_piles: [],
      tableData: [],
      showEditUser: false,
      userInfo: {
        user_name: "",
        account: "",
        pass: "",
        discount: ""
      },
      dataRules: {
        user_name: [
          { required: true, message: "* 请输入用户姓名", trigger: "change" }
        ],
        discount: [
          { required: true, message: "* 请输入用户优惠", trigger: "change" },
          { validator: onlyInteger, trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getTableDataList();
  },
  methods: {
    editUser() {
      this.showEditUser = true;
    },
    getTableDataList() {
      this.listLoading = true;
      this.loading = true;
      let param = {
        id: this.user_id,
        page: this.currentPage
      };
      this.$api.customerInvite(param).then(data => {
        this.listLoading = false;
        this.loading = false;
        var that = this;
        if (data.code == 1) {
          that.tableData = data.data.list;
          that.currentPage = data.data.current_page;
          that.page_count = data.data.page_total;
        }
      });
    },
    // 点击分页触发
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getTableDataList();
    },
    saveUserInfo() {
      this.$refs["userInfo"].validate(valid => {
        if (valid) {
          this.userInfo.user_id = this.user_id;
          this.$api.customerEdit(this.userInfo).then(data => {
            if (data.code == 1) {
              this.showEditUser = false;
              this.$sfNotify({
                message: "成功"
              });
              this.nick_name = this.userInfo.user_name;
              this.user_discount = this.userInfo.discount/10;
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
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../assets/css/user/record.scss";
</style>
