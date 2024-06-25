<template>
  <section>
    <div class="section-title">
      <router-link to='/platform/company'>大客户管理</router-link> > 大客户详情
    </div>
    <div class="section-list">
      <div class="section-item-header">
        <span>基本信息</span>
        <span
          class="btn_recovery"
          @click="resetPass"
        ><i class="edit-amount"></i>重置密码</span>
      </div>
      <div class="base-info clearfix">
        <div class="info-item">
          <div class="info-left">企业账号：</div>
          <div class="info-right ellipsis">{{account}}</div>
        </div>
        <div class="info-item">
          <div class="info-left">联系人：</div>
          <div class="info-right ellipsis">{{user_name}}</div>
        </div>
        <div class="info-item">
          <div class="info-left">联系电话：</div>
          <div class="info-right ellipsis">{{phone}}</div>
        </div>
        <div class="info-item">
          <div class="info-left">一号多充限额(元)：</div>
          <div class="info-right ellipsis">{{limit_amount}}</div>
        </div>
        <div class="info-item">
          <div class="info-left">成员角色：</div>
          <div class="info-right ellipsis">{{role_name}}</div>
        </div>
        <div class="info-item">
          <div class="info-left">状态：</div>
          <div class="info-right ellipsis">{{status}}</div>
        </div>
        <div class="info-item">
          <div class="info-left">创建时间：</div>
          <div class="info-right ellipsis">{{create_time}}</div>
        </div>
        <div class="info-item">
        <div class="info-left">联系邮箱：</div>
        <div class="info-right ellipsis">{{email ? email :'暂无'}}</div>
      </div>
      </div>
    </div>
    <div class="section-list">
      <div class="section-item-header">
        <span>消费信息</span>
        <!--<span class="btn_recovery" @click="resetBalance"><i class="edit-amount"></i>调整余额</span>-->
      </div>
      <div class="spend-info clearfix">
        <!--
        <div class="info-item">
          <div class="spend-left">
            <div class="spend-left-top">当前余额</div>
            <div class="spend-left-bottom">
              <span style="color:#38B487;">{{balance_money/100}}</span>元
            </div>
          </div>
          <div class="balance-img"></div>
        </div>
        -->
        <div class="info-item-center">
          <div class="info-item">
            <div class="spend-left">
              <div class="spend-left-top">充值总计</div>
              <div class="spend-left-bottom">
                <span>{{history_money}}</span>元
              </div>
            </div>
            <div class="recharge-img"></div>
          </div>
        </div>
        <div class="info-item-center">
          <div class="info-item">
            <div class="spend-left">
              <div class="spend-left-top">消费总计</div>
              <div class="spend-left-bottom">
                <span>{{consume_money}}</span>元
              </div>
            </div>
            <div class="spend-img"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="section-list">
      <div class="section-item-header">
        <span>授权账号</span>
        <!--<span class="btn_recovery" @click="exportExcel(id)"><i class="export-report"></i>导出报表</span>-->
      </div>
      <div class="section-content">
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td">账号</div>
            <div class="table-td">用户名</div>
            <div class="table-td">充电次数</div>
            <div class="table-td">充电度数总计(度)</div>
            <div class="table-td">服务费总计(元)</div>
            <div class="table-td">电费总计(元)</div>
            <div class="table-td">停车费总计(元)</div>
            <div class="table-td">消费总计(元)</div>
            <div class="table-td">账户余额（元）</div>
            <!--
            <div class="table-td">账户余额（元）</div>
            <div class="table-td">消费总计（元）</div>
            -->
          </div>
          <div class="table-body">
            <div
              class="table-tr"
              v-show="tableData && tableData.length > 0"
              v-for="(consume_info, index) in tableData"
              :key="index"
            >
              <div class="table-td">{{consume_info.tel}}</div>
              <div class="table-td">{{consume_info.nick_name}}</div>
              <div class="table-td">{{consume_info.charge_count}}</div>
              <div class="table-td">{{consume_info.charge_quantity_total}}</div>
              <div class="table-td">{{consume_info.service_amount_total}}</div>
              <div class="table-td">{{consume_info.charge_amount_total}}</div>
              <div class="table-td">{{consume_info.park_amount_total}}</div>
              <div class="table-td">{{consume_info.real_amount_total}}</div>
              <div class="table-td">{{consume_info.remaining_balance}}</div>
              <!--
              <div class="table-td">{{consume_info.remaining_balance/100}}</div>
              <div class="table-td">{{consume_info.real_amount_total/100}}</div>
              -->
            </div>
            <div
              v-if="!tableData || tableData.length === 0"
              class="table-tr unData"
            >
              <img :src="require('assets/img/unData.png')">
              <span>暂无数据</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 重置密码 -->
    <sf-modelBox
      :showModel.sync="showResetPassword"
      title="重置密码"
      @change="saveResetSure"
    >
      <el-form
        :model="resetInfo"
        ref="resetInfo"
        :rules="dataRules"
      >
        <div class="box-list">
          <div class="box-left">新密码</div>
          <div class="box-right">
            <el-form-item prop="password">
              <el-input
                v-model="resetInfo.password"
                type="password"
                placeholder="请输入新密码"
              />
            </el-form-item>
          </div>
        </div>
        <div class="box-list">
          <div class="box-left">确认密码</div>
          <div class="box-right">
            <el-form-item prop="check_password">
              <el-input
              v-model="resetInfo.check_password"
              type="password"
              placeholder="请输入确认密码"
              />
            </el-form-item>
          </div>
        </div>
      </el-form>
    </sf-modelBox>
    <!-- 调整余额 -->
    <sf-modelBox
      :showModel.sync="showBalance"
      title="调整余额"
      @change="saveBalanceSure"
    >
      <el-form
        :model="balanceInfo"
        ref="balanceInfo"
        :rules="dataRulesBalance"
      >
        <div class="box-list">
          <div class="box-left">余额</div>
          <div class="box-right box-amount">
            <el-form-item prop="amount">
              <el-input
                v-model="balanceInfo.amount"
                placeholder="请输入金额"
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
  name: "",
  components: {},
  data() {
    const onlyInteger = async (rule, value, callback) => {
      const boolean = new RegExp("^[1-9][0-9]*$").test(value);
      if (!boolean) {
        return callback(new Error("金额只能为正整数"));
      }
    };
    return {
      id: this.$route.params.id,
      account: "",
      user_name: "",
      phone: "",
      email: "",
      role_name: "",
      status: "",
      create_time: "",
      balance_money: "",
      history_money: "",
      consume_money: "",
      limit_amount:'0',
      tableData: [],
      showResetPassword: false,
      showBalance: false,
      resetInfo: {
        password: "",
        check_password:''
      },
      balanceInfo: {
        amount: ""
      },
      dataRules: {
        password: [
          { required: true, message: "* 请输入新密码", trigger: "blur" }
        ],
        check_password: [
            { required: true, message: "* 请输入确认密码", trigger: "blur" }
        ]
      },
      dataRulesBalance: {
        amount: [
          { required: true, message: "* 请输入金额", trigger: "blur" },
          { validator: onlyInteger, trigger: "blur" }
        ]
      },
      ENV: process.env.NODE_ENV == "development" ? "/api" : ""
    };
  },
  created() {
    this.getCompanyDetail();
  },
  methods: {
    resetBalance() {
      this.balanceInfo.amount = "";
      this.showBalance = true;
    },
    getCompanyDetail() {
      this.$api.roleCompanyDetail({ id: this.id }).then(data => {
        if (data.code == 1) {
          let _basic = data.data.basic;
          let _consumes = data.data.consumes;
          let _balance = data.data.balance;
          this.account = _basic.account;
          this.user_name = _basic.user_name;
          this.phone = _basic.tel;
          this.email = _basic.email;
          this.limit_amount = _basic.limit_amount
          this.role_name = _basic.role_name;
          this.status = _basic.user_status == 1 ? "启用" : "禁用";
          this.create_time = _basic.create_time;
          this.balance_money = _balance.balance;
          this.history_money = _balance.history;
          this.consume_money = _balance.consume;
          this.tableData = _consumes;
        }
      });
    },
    resetPass() {
      this.showResetPassword = true;
    },
    saveResetSure() {
      this.$refs["resetInfo"].validate(valid => {
        if (valid) {
          if(this.resetInfo.password != this.resetInfo.check_password){
              this.$sfNotify({
                  duration: 0,
                  type: "error",
                  message: "密码不一致"
              });
              return false;
          }
          this.$api
            .rolePassword({ id: this.id, pass: this.resetInfo.password })
            .then(data => {
              this.showResetPassword = false;
              if (data.code == 1) {
                this.$sfNotify({
                  message: "成功"
                });
              } else {
                this.$sfNotify({
                  duration: 0,
                  type: "error",
                  message: "失败"
                });
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    saveBalanceSure() {
      this.$refs["balanceInfo"].validate(valid => {
        if (valid) {
          this.balanceInfo.id = this.id;
          this.$api.roleDeposit(this.balanceInfo).then(data => {
            if (data.code == 1) {
              this.showBalance = false;
              this.$sfNotify({
                message: "成功"
              });
              this.balance_money =
                parseInt(this.balance_money) +
                parseInt(this.balanceInfo.amount) * 100;
              this.history_money =
                parseInt(this.history_money) +
                parseInt(this.balanceInfo.amount) * 100;
            } else {
              this.$sfNotify({
                duration: 0,
                type: "error",
                message: "失败"
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    exportExcel(id) {
      window.location.href = `${this.ENV}/role/export?id=${id}`;
    }
  }
};
</script>

<style scoped lang="scss">
@import "../../assets/css/platform/componyDetail.scss";
</style>
