<template>
  <section>
    <div class="section-title">
      <router-link to="/user/users">消费用户</router-link>
      > 用户详情
    </div>
    <p class="section-name">用户 {{modelObj.id}} 详情</p>
    <div class="section-header">
      <div class="section-item-router">
        <router-link :to="`/user/users/detail/${modelObj.id}`">基本信息</router-link>
        <router-link
                :to="`/user/users/amount/${modelObj.id}`"
                class="section-act"
        >金额明细
        </router-link>
        <router-link :to="`/user/users/level/${modelObj.id}`">等级积分</router-link>
        <router-link :to="`/user/users/record/${modelObj.id}`">邀请记录</router-link>
        <router-link :to="`/user/users/charge/${modelObj.id}`">充电记录</router-link>
      </div>
      <div class="header-content clearfix">
        <div class="content-top">
          <div class="top-item">
            <div class="top-item-title">账户余额（元）</div>
            <div
                    :class="['top-item-text ellipsis' , parseFloat(balance)?'section-running':'']"
            >{{balance || '0.0000'}}
            </div>
          </div>
          <div class="top-item">
            <div class="top-item-tr">
              <div class="top-item-title">充值总计（元）</div>
              <div
                      class="top-item-text ellipsis"
                      :style="{color:parseFloat(charge_amount)?'#666':''}"
              >{{charge_amount || '0'}}
              </div>
            </div>
            <div class="top-item-tr">
              <div class="top-item-title">消费总计（元）</div>
              <div
                      class="top-item-text ellipsis"
                      :style="{color:parseFloat(consume_amount)?'#666':''}"
              >{{consume_amount  || '0'}}
              </div>
            </div>
          </div>
          <div class="top-item">
            <div class="top-item-tr">
              <div class="top-item-title">提现总计（元）</div>
              <div
                      class="top-item-text ellipsis"
                      :style="{color:parseFloat(reflect_amount)?'#666':''}"
              >{{reflect_amount  || '0'}}
              </div>
            </div>
            <div class="top-item-tr">
              <div class="top-item-title">退款总计（元）</div>
              <div
                      class="top-item-text ellipsis"
                      :style="{color:parseFloat(refund_amount)?'#666':''}"
              >{{refund_amount  || '0'}}
              </div>
            </div>
          </div>
        </div>

      </div>

      <!--            &#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;-->
      <div class="admin-withdraw-detail">
        <div class="admin-withdraw-header ">
          不可提现余额明细
        </div>
        <div>
          <div class="admin-withdraw-content">
            <div class="admin-withdraw-list">平台充值金额（元）：<span>{{webRechargeAmount}}</span></div>
            <div class="admin-withdraw-list"> 优惠锁定金额（元）：<span>{{couponLockAmount}}</span></div>
            <div class="admin-withdraw-list"> 超过6个月需人工提现金额（元）：<span>{{artificialWithdrawalAmount}}</span>
              <span v-if="!hasUnFinishedOrder" class="green"
                    @click="showAdminWithdrawModel = true">人工提现</span>
              <span v-else class="red">有未支付订单</span>
            </div>

          </div>

        </div>

      </div>

      <!--            &#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;-->
    </div>
    <div class="section-container">
      <div class="section-item-header">
        <span>金额明细</span>
      </div>
      <div class="section-main">
        <div class="header-content clearfix">
          <div class="content-item">
            <div class="header-left">搜索时间</div>
            <div class="header-right">
              <el-date-picker
                      v-model="modelObj.start"
                      type="date"
                      placeholder="选择开始日期"
                      value-format="yyyy-MM-dd"
              >
              </el-date-picker>
              <el-date-picker
                      class="end_time"
                      v-model="modelObj.end"
                      type="date"
                      placeholder="选择结束日期"
                      value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </div>
          </div>
          <div class="content-item">
            <div class="header-left">类型</div>
            <div class="header-right">
              <el-select v-model="modelObj.type">
                <el-option
                        label="全部"
                        value="0"
                />
                <el-option
                        label="充值"
                        value="1"
                />
                <el-option
                        label="消费"
                        value="2"
                />
                <el-option
                        label="提现"
                        value="3"
                />
                <el-option
                        label="退款"
                        value="4"
                />
              </el-select>
            </div>
          </div>
          <div class="content-item">
            <div
                    class="btn_succ"
                    @click="searchStation()"
            >查询
            </div>
            <div
                    class="btn_cancel"
                    @click="resetSearch()"
            >重置
            </div>
          </div>
        </div>
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td table-column__1">序号</div>
            <div class="table-td">日期</div>
            <div class="table-td">类型</div>
            <div class="table-td">金额(元）</div>
            <div class="table-td">描述</div>
          </div>
          <div
                  class="table-body"
                  v-loading="listLoading"
          >
            <div
                    class="table-tr"
                    v-show="tableData && tableData.length"
                    v-for="(consume, index) in tableData"
                    :key="index"
            >
              <div class="table-td table-column__1">
                <div class="td-item">{{index + 1}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{consume.create_time}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{change_type_array[consume.change_type]}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{consume.change_value}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{desc_array[consume.desc]}}</div>
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
    <!-- 添加人工提现 -->
    <sf-modelBox
            class="withdraw-box"
            title="人工提现"
            :showModel.sync="showAdminWithdrawModel"
            @change="saveAdminWithdrawInfo"
    >
      <el-form
              :model="adminWithdrawInfo"
              ref="adminWithdrawInfo"
              :rules="dataRules"
      >
        <div class="box-list">
          <div class="box-left">提现账号</div>
          <div class="box-right">
            <el-form-item prop="account">
              <el-input
                      v-model="adminWithdrawInfo.account"
                      placeholder="请输入提现账号"
              />
            </el-form-item>
          </div>
        </div>
        <div class="box-list">
          <div class="box-left">提现金额</div>
          <div class="box-right">
            <el-form-item prop="refund_amount">
              <el-input
                      class="account-input"
                      v-model="adminWithdrawInfo.refund_amount"
                      placeholder="请输入提现金额"
              />
              <span class="unit">元</span>
            </el-form-item>
          </div>
        </div>
        <div class="box-list">
          <div class="box-left">银行卡号</div>
          <div class="box-right">
            <el-form-item prop="card_number">
              <el-input
                      v-model="adminWithdrawInfo.card_number"
                      placeholder="请输入银行卡号"
              />
            </el-form-item>
          </div>
        </div>
        <div class="box-list">
          <div class="box-left">真实姓名</div>
          <div class="box-right">
            <el-form-item prop="real_name">
              <el-input
                      v-model="adminWithdrawInfo.real_name"
                      placeholder="请输入真实姓名"
              />
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
      return {
        modelObj: {
          id: this.$route.params.id,
          start: "",
          end: "",
          type: "0"
        },
        currentPage: 1,
        page_count: 1,
        listLoading: false,
        balance: "",
        charge_amount: "",
        consume_amount: "",
        reflect_amount: "",
        refund_amount: "",
        tableData: [],
        change_type_array: {
          "1": "充值",
          "2": "充值",
          "3": "消费",
          "4": "退款",
          "5": "充值",
          "6": "余额分配",
          "7": "提现",
          "8": "提现",
          "32": "充值(子账号)",
          "33": "余额消费(企业主)",
          "31": "消费(企业主)",
          "9": "消费",
          "10": "消费",
          "11": "充值",
          "12": "消费",
        },
        desc_array: {
          "1": "微信充值",
          "2": "支付宝充值",
          "3": "余额消费",
          "4": "账单退款",
          "5": "人工操作",
          "6": "余额分配",
          "7": "提现余额",
          "8": "提现余额失败",
          "9": "微信实时支付(APP)",
          "10": "支付宝实时支付",
          "11": "微信充值(小程序)",
          "12": "微信实时支付(小程序)",
        },
        showAdminWithdrawModel: false,
        adminWithdrawInfo: {
          account: "",
          refund_amount: "",
          card_number: "",
          real_name: ""
        },
        dataRules: {
          account: [
            {required: true, message: "* 请输入提现账号", trigger: "change"}
          ],
          refund_amount: [
            {required: true, message: "* 请输入提现金额", trigger: "change"},
            // {type: 'number', message: '充值金额必须为数字值', trigger: "change"}
          ],
          card_number: [
            {required: true, message: "* 请输入银行卡号", trigger: "change"}
          ],
          real_name: [
            {required: true, message: "* 请输入真实姓名", trigger: "change"}
          ]
        },
        webRechargeAmount: 0,//平台充值金额
        couponLockAmount: 0, //优惠锁定金额
        artificialWithdrawalAmount: 0,//超过6个月需人工提现金额
        hasUnFinishedOrder: 0,//是否有未完成订单
      };
    },
    created() {
      this.getTableDataList();
    },
    methods: {
      getTableDataList() {
        this.listLoading = true;
        this.modelObj.page = this.currentPage;
        this.$api.customerMoney(this.modelObj).then(data => {
          this.listLoading = false;
          if (data.code == 1) {
            this.balance = data.data.balance;
            this.charge_amount = data.data.charge_amount;
            this.consume_amount = data.data.consume_amount;
            this.reflect_amount = data.data.reflect_amount;
            this.refund_amount = data.data.refund_amount;
            this.tableData = data.data.records.list;
            this.currentPage = data.data.records.current_page;
            this.page_count = data.data.records.page_total;
            this.webRechargeAmount = data.data.webRechargeAmount;//平台充值金额
            this.couponLockAmount = data.data.couponLockAmount; //优惠锁定金额
            this.artificialWithdrawalAmount = data.data.artificialWithdrawalAmount;//超过6个月需人工提现金额
            this.hasUnFinishedOrder = data.data.hasUnFinishedOrder;//是否有未完成订单
          }
        });
      },
      searchStation() {
        this.currentPage = 1;
        this.tableData = [];
        this.getTableDataList();
      },
      resetSearch() {
        this.modelObj.start = "";
        this.modelObj.end = "";
        this.modelObj.type = "0";
        this.currentPage = 1;
        this.page_count = 1;
        this.tableData = [];
        this.getTableDataList();
      },
      // 点击分页触发
      handleCurrentChange(page) {
        this.currentPage = page;
        this.getTableDataList();
      },

      // 发起提现
      saveAdminWithdrawInfo() {
        // if(this.state){
        //     return false;
        // }
        // this.state = true;
        var that = this
        this.$refs["adminWithdrawInfo"].validate(valid => {
          if (valid) {
            this.$api.addAdminWithdraw(this.adminWithdrawInfo).then(res => {
              if (res.code == 100) {
                that.showAdminWithdrawModel = false;
                this.$sfNotify({
                  message: "成功"
                });
                setTimeout(this.getAdminCashList, 1500)
              } else {
                this.state = true;
                this.$sfNotify({
                  duration: 0,
                  type: "error",
                  message: res.message,
                });
              }
            });
          } else {
            console.log("error submit!!");
            this.state = true;
            return false;
          }
        });
      },
    }
  };
</script>
<style lang="scss" scoped>
  @import "../../assets/css/user/amount.scss";
</style>