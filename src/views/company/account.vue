<template>
  <section>
    <div class="section-title">子账号管理</div>
    <div class="section-header">
      <div class="section-item-header clearfix">
        <span>筛选查询</span>
      </div>
      <div class="header-content clearfix">
        <div class="content-item">
          <div class="header-left">关键字查询</div>
          <div class="header-right">
            <el-input
                    class="search-input"
                    v-model="modelObj.search"
                    placeholder="请输入关键字"
            />
          </div>
        </div>
        <div class="content-item">
          <div
                  class="btn_succ"
                  @click="searchChild"
          >查询</div>
          <div
                  class="btn_cancel"
                  @click="resetSearch"
          >重置</div>
        </div>
      </div>
    </div>
    <div class="section-container">
      <div class="section-item-header clearfix">
        <span>子账号列表</span>
        <span class="section-tips">（* 总计数据统计截止到昨天，账户余额为实时数据）</span>
        <div
                class="btn_succ add-coupon"
                @click="handleAdd(0,'')"
        >
          <i class="add-station"></i>添加子用户
        </div>
      </div>
      <div
              class="section-main"
              v-loading="listLoading"
      >
        <!-- 列表 -->
        <el-table
                :data="tableData"
                style="width: 100%"
                header-row-class-name="table-head-class"
                header-cell-class-name="table-head-cell-class"
        >
          <el-table-column
                  fixed
                  prop="id"
                  label="用户ID"
                  style="width:7.89%"
                  align="center"
          >
          </el-table-column>
          <el-table-column
                  prop="tel"
                  label="账号"
                  style="width:7.89%"
                  align="center"
          >
          </el-table-column>
          <el-table-column
                  prop="nick_name"
                  label="用户名"
                  style="width:7.89%"
                  align="center"
          >
          </el-table-column>
          <el-table-column
                  prop="charge_count"
                  label="充电次数"
                  style="width:7.89%"
                  align="center"
          >
          </el-table-column>
          <el-table-column
                  prop="charge_quantity_total"
                  label="充电度数总计（度）"
                  style="width:7.89%"
                  align="center"
          >
          </el-table-column>
          <el-table-column
                  prop="service_amount_total"
                  label="服务费总计（元）"
                  style="width:7.89%"
                  align="center"
          >
          </el-table-column>
          <el-table-column
                  prop="charge_amount_total"
                  label="电费总计（元）"
                  style="width:7.89%"
                  align="center"
          >
          </el-table-column>
          <el-table-column
                  prop="park_amount_total"
                  label="停车费总计（元）"
                  style="width:7.89%"
                  align="center"
          >
          </el-table-column>
          <el-table-column
                  prop="total_amount_total"
                  label="消费总计（元）"
                  style="width:7.89%"
                  align="center"
          >
          </el-table-column>
          <el-table-column
                  prop="remaining_balance"
                  label="账户余额（元）"
                  style="width:7.89%"
                  align="center"
          >
          </el-table-column>
          <el-table-column
                  fixed="right"
                  label="状态"
                  style="width:9.2%"
                  align="center"
          >
            <template slot-scope="scope">
              <div class="knob-outer">
                <span
                        :class="['knob',
              {'started': scope.row.user_status == 1}
              ]"
                        @click="changeStatus(scope.row.user_status,scope.row.id)"
                ></span>
                <span class="knob-text">{{scope.row.user_status == 1?'启用':'停用'}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
                  fixed="right"
                  label="操作"
                  style="width:9.2%"
                  align="center"
                  width="120"
          >
            <template slot-scope="scope">
              <div class="td-operate">
                <el-tooltip
                        content="编辑"
                        placement="top"
                >
                  <div
                          class="td-item edit-icon"
                          @click="handleAdd(scope.row.id,scope.row)"
                  ></div>
                </el-tooltip>
                <el-tooltip
                        content="调整余额"
                        placement="top"
                >
                  <div
                          class="td-item balance-icon"
                          @click="handleBalance(scope.row)"
                  ></div>
                </el-tooltip>
                <el-tooltip
                        content="关联"
                        placement="top"
                >
                  <router-link
                          class="td-item connect-icon"
                          :to="`/company/account/stationassign?id=${scope.row.id}&title=企业子账户
                          `"
                  ></router-link>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <sf-pagination
                v-if="tableData && tableData.length > 0"
                :currentPage="currentPage"
                :page-count="page_count"
                @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 添加/编辑 成员 -->
    <sf-modelBox
            :showModel.sync="showAddUser"
            :title="userInfo.id== 0?'添加子用户':'修改子用户'"
            @change="saveUserSure"
    >
      <el-form
              :model="userInfo"
              ref="userInfo"
              :rules="dataRules"
      >
        <div class="box-list">
          <div class="box-left">用户名</div>
          <div class="box-right">
            <el-form-item prop="name">
              <el-input
                      v-model="userInfo.name"
                      placeholder="请输入用户名"
                      auto-complete="new-password"
              />
            </el-form-item>
          </div>
        </div>
        <div class="box-list">
          <div class="box-left">手机号码</div>
          <div class="box-right">
            <el-form-item prop="account">
              <el-input
                      :disabled="userInfo.id== 0?false:true"
                      v-model="userInfo.account"
                      placeholder="请输入用户账号"
              />
            </el-form-item>
          </div>
        </div>
        <div class="box-list">
          <div class="box-left">登录密码</div>
          <div
                  class="box-right"
                  v-if="userInfo.id"
          >
            <el-form-item>
              <el-input
                      type="password"
                      v-model="userInfo.password"
                      placeholder="请输入登录密码"
                      auto-complete="new-password"
              />
            </el-form-item>
          </div>
          <div
                  class="box-right"
                  v-else
          >
            <el-form-item prop="password">
              <el-input
                      type="password"
                      v-model="userInfo.password"
                      placeholder="请输入登录密码"
              />
            </el-form-item>
          </div>
        </div>
      </el-form>
    </sf-modelBox>

    <!-- 调整余额 -->
    <sf-modelBox
            :showModel.sync="showBalanceInfo"
            title="调整余额"
            @change="saveBalanceSure"
    >
      <el-form
              :model="balanceInfo"
              ref="balanceInfo"
              :rules="balanceRules"
      >
        <div class="section-tips">
          <div class="warning-icon"></div>
          <p>可分配金额：<span>{{balanceInfo.available ? balanceInfo.available : 0}} </span>元</p>
        </div>
        <div class="box-list">
          <div class="box-left">用户账号</div>
          <div class="box-right box-balance ellipsis">{{balanceInfo.account ? balanceInfo.account : '--'}}</div>
        </div>
        <div class="box-list">
          <div class="box-left">当前余额</div>
          <div class="box-right box-balance ellipsis">{{balanceInfo. balance ? balanceInfo.balance : 0}}元</div>
        </div>
        <div class="box-list">
          <div class="box-left">调整金额</div>
          <div class="box-right">
            <el-form-item prop="amount">
              <el-input
                      class="amount-input"
                      type="number"
                      v-model.number="balanceInfo.amount"
                      placeholder="请输入调整金额，负数为减少"
              />
              <span class="unit">元</span>
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
      const onlyPhone = async (rule, value, callback) => {
        const boolean = new RegExp("^1(3|4|5|6|7|8|9)\\d{9}$").test(value);
        if (!boolean) {
          return callback(new Error("* 手机号格式不正确"));
        }
      };
      const chargeBalance = async (rule, value, callback) => {
        if (value === 0) {
          return callback(new Error("* 金额不能为 0"));
        }
        if (value < 0 && Math.abs(value) > this.balanceInfo.balance) {
          return callback(new Error("* 金额不能小于当前账户余额"));
        }
      };
      return {
        modelObj: {
          search: ""
        },
        currentPage: 1,
        page_count: 1,
        tableData: [],
        listLoading: false,
        showAddUser: false,
        showBalanceInfo: false,
        userInfo: {
          id: "",
          name: "",
          account: "",
          password: ""
        },
        balanceInfo: {
          available: 0,
          account: "",
          balance: "",
          amount: "",
          id: ""
        },
        dataRules: {
          name: [{ required: true, message: "* 请输入用户名", trigger: "blur" }],
          account: [
            { required: true, message: "* 请输入手机号", trigger: "blur" },
            { validator: onlyPhone, trigger: "blur" }
          ],
          password: [
            { required: true, message: "* 请输入密码", trigger: "change" }
          ]
        },
        balanceRules: {
          amount: [
            { required: true, message: "* 请输入调整金额", trigger: "change" },
            { validator: chargeBalance, trigger: "blur" }
          ]
        }
      };
    },
    created() {
      //    this.getAllRoleName();
      this.getTableDataList();
    },
    methods: {
      getTableDataList() {
        this.listLoading = true;
        this.modelObj.page = this.currentPage;
        this.$api.getCompanyChildList(this.modelObj).then(data => {
          this.listLoading = false;
          if (data.code == 1) {
            this.tableData = data.data.list;
            this.currentPage = data.data.current_page;
            this.page_count = data.data.page_total;
          }
        });
      },
      searchChild() {
        this.currentPage = 1;
        this.tableData = [];
        this.getTableDataList();
      },
      resetSearch() {
        this.modelObj.search = "";
        this.currentPage = 1;
        this.getTableDataList();
      },
      // 点击分页触发
      handleCurrentChange(page) {
        this.currentPage = page;
        this.tableData = [];
        this.getTableDataList();
      },
      handleAdd(id, row) {
        this.userInfo.id = id;
        if (id) {
          this.userInfo.name = row.nick_name;
          this.userInfo.account = row.tel;
          this.userInfo.password = "";
          this.showAddUser = true;
        } else {
          this.userInfo.name = "";
          this.userInfo.account = "";
          this.userInfo.password = "";
          this.showAddUser = true;
        }
      },
      saveUserSure() {
        var that = this;
        this.$refs["userInfo"].validate(valid => {
          if (valid) {
            if (that.userInfo.id) {
              that.$api.updateChildInfo(that.userInfo).then(res => {
                if (res.code == 1) {
                  that.showAddUser = false;
                  this.$sfNotify({
                    message: "成功"
                  });
                  setTimeout(this.getTableDataList, 1500);
                } else {
                  this.$sfNotify({
                    duration: 0,
                    type: "error",
                    message: res.message
                  });
                }
              });
            } else {
              that.$api.createChild(that.userInfo).then(res => {
                if (res.code == 1) {
                  that.showAddUser = false;
                  this.$sfNotify({
                    message: "成功"
                  });
                  that.getTableDataList();
                } else {
                  this.$sfNotify({
                    duration: 0,
                    type: "error",
                    message: res.message
                  });
                }
              });
            }
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
      // 调整余额
      handleBalance(row) {
        this.balanceInfo.account = row.tel;
        this.balanceInfo.balance = row.remaining_balance;
        this.balanceInfo.amount = "";
        this.balanceInfo.id = row.id;
        this.$api.getAvailable().then(res=>{
          if(res.code == 1){
            this.balanceInfo.available = res.data.available;
            this.showBalanceInfo = true;
          }else{
            this.$sfNotify({
              duration: 0,
              type: "error",
              message: "出错了，请稍后再试",
            });
          }
        });
      },
      saveBalanceSure() {
        this.$refs["balanceInfo"].validate(valid => {
          if (valid) {
            this.$api
                    .updateChildBalance({
                      id: this.balanceInfo.id,
                      amount: this.balanceInfo.amount
                    })
                    .then(res => {
                      this.showBalanceInfo = false;
                      if (res.code == 1) {
                        this.$sfNotify({
                          message: "成功"
                        });
                        setTimeout(this.getTableDataList(), 1500);
                      } else {
                        this.$sfNotify({
                          duration: 0,
                          type: "error",
                          message: res.message
                        });
                      }
                    });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
      changeStatus(status, id) {
        if (parseInt(status)) {
          status = 0;
        } else {
          status = 1;
        }
        var that = this;
        that.$api.updateChildStatus({ status: status, id: id }).then(res => {
          if (res.code == 1) {
            this.$sfNotify({
              message: "成功"
            });
            this.getTableDataList();
          } else {
            this.$sfNotify({
              duration: 0,
              type: "error",
              message: res.message
            });
          }
        });
      }
    }
  };
</script>
<style lang="scss">
  .el-table__header,
  .el-table__body {
    width: 100% !important;
  }

  .table-head-class {
    height: 48px;
  }

  .table-head-cell-class {
    background-color: #eeeeee !important;
    padding: 4px 0 !important;
    font-size: 12px;
    height: 48px;
    border-right: 2px solid #fff;
    color: rgba(44, 57, 59, 1);

    .cell {
      line-height: 20px;
    }
  }

  .table-head-cell-class:last-child {
    border-right: none !important;
    border-radius: 0 4px 0 0 !important;
  }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "../../assets/css/company/account.scss";
</style>
