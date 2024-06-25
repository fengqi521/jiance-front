<template>
  <section>
    <div class="section-title">
      <router-link :to='`/trad/cash`'>提现管理</router-link> > 人工提现
    </div>
    <div class="section-header">
      <div class="section-item-header clearfix">
        <span>筛选查询</span>
      </div>
      <div class="header-content clearfix">
        <div class="content-item">
          <el-select class="search-type" v-model="modelObj.search_type">
            <el-option label="提现单号" value="1" />
            <el-option label="提现账号" value="3" />
          </el-select>
          <el-input
                  class="search-input"
                  v-model="modelObj.search_content"
                  placeholder="关键字搜索"
          />
        </div>
        <div class="content-item">
          <div class="header-left">申请时间</div>
          <div class="header-right">
            <el-date-picker
                    v-model="modelObj.start_time"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择开始日期"
            ></el-date-picker>
            <el-date-picker
                    class="end-time"
                    v-model="modelObj.end_time"
                    value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="选择结束日期"
            ></el-date-picker>
          </div>
        </div>

        <div class="content-item">
          <div class="btn_succ" @click="getAdminCashList">查询</div>
          <div class="btn_cancel" @click="resetSearch">重置</div>
        </div>
      </div>
    </div>
    <div class="section-container">
      <div class="section-item-header clearfix">
        <span>提现列表</span>
        <div class="btn_recovery export-btn" @click="cashExport">
          <i class="export-icon"></i>导出
        </div>
        <div
                class="btn_succ recharge-btn"
                @click="showAdminWithdrawModel = true"
        >
          <i class="export-icon"></i>发起人工提现
        </div>
      </div>
      <div class="section-main">
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td">提现单号</div>
            <div class="table-td">提现账号</div>
            <div class="table-td">提现金额（元）</div>
            <div class="table-td">提现时间</div>
            <div class="table-td">银行卡号</div>
          </div>
          <div class="table-body" v-loading="listLoading">
            <div
                    class="table-tr"
                    v-show="tableData && tableData.length > 0"
                    v-for="(item, index) in tableData"
                    :key="index"
            >
              <div class="table-td">
                <div class="td-item">
                  {{ item.transfer_id ? item.transfer_id : "暂无" }}
                </div>
              </div>
              <div class="table-td">
                <div class="td-item" v-if="item.logout_user_tel">
                  {{ item.user_tel ? item.user_tel : "暂无" }}(已注销)
                </div>
                <div class="td-item" v-else>
                  {{ item.user_tel ? item.user_tel : "暂无" }}
                </div>
              </div>
              <div class="table-td">
                <div class="td-item">{{ item.refund_amount }}</div>
              </div>
              <div class="table-td">
                <div class="td-item td-time">{{ item.create_time }}</div>
              </div>
              <div class="table-td">
                <div class="td-item td-time">--</div>
              </div>
            </div>
            <div
                    v-if="!tableData || tableData.length == 0"
                    class="table-tr unData"
            >
              <img :src="require('assets/img/unData.png')" />
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
        ENV: process.env.NODE_ENV == "development" ? "/api" : "",
        modelObj: {
          search_type: "3",
          search_content: "",
          start_time: "",
          end_time: "",
        },
        pay_type: 2,
        currentPage: 1,
        page_count: 1,
        tableData: [],
        showCashModel: false,
        apply_money: "",
        apply_time: "",
        refund_id: "",
        listLoading: false,
        is_export: 0,
        showAdminWithdrawModel: false,
        adminWithdrawInfo: {
          account: "",
          refund_amount: "",
          card_number: "",
          real_name: "",
        },
        dataRules: {
          account: [
            { required: true, message: "* 请输入提现账号", trigger: "change" },
          ],
          refund_amount: [
            { required: true, message: "* 请输入提现金额", trigger: "change" },
            // { type: 'money', message: '提现金额必须为数字值',trigger: "change"}
          ],
          card_number: [
            { required: true, message: "* 请输入银行卡号", trigger: "change" },
          ],
          real_name: [
            { required: true, message: "* 请输入真实姓名", trigger: "change" },
          ],
        },
      };
    },
    created() {
      this.getAdminCashList();
    },
    methods: {
      // 点击分页触发
      handleCurrentChange(page) {
        this.currentPage = page;
        this.getAdminCashList();
      },
      handleCash(item) {
        let { transfer_id } = item;
        let routeUrl = this.$router.resolve({
          path: "/trad/cash/detail",
          query: {
            id: JSON.stringify(transfer_id),
          },
        });
        window.open(routeUrl.href, "_blank");
      },

      // 发起提现
      saveAdminWithdrawInfo() {
        // if(this.state){
        //   return false;
        // }
        // this.state = true;
        var that = this;
        this.$refs["adminWithdrawInfo"].validate((valid) => {
          if (valid) {
            this.$api.addAdminWithdraw(this.adminWithdrawInfo).then((res) => {
              if (res.code == 100) {
                that.showAdminWithdrawModel = false;
                this.$sfNotify({
                  message: "成功",
                });
                setTimeout(this.getAdminCashList, 1500);
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

      /*
       获取提现列表
       */
      getAdminCashList() {
        var that = this;
        that.listLoading = true;
        this.modelObj.page = this.currentPage;
        this.$api.adminCashList(this.modelObj).then((res) => {
          that.listLoading = false;
          if (res.code == 1) {
            that.page_count = Math.ceil(res.data.total_count / 10);
            that.currentPage = res.data.current_page;
            that.tableData = res.data.list;
            that.is_export = res.data.is_export;
          }
        });
      },

      cashExport() {
        if (this.is_export) {
          window.location.href = `${this.ENV}/refund/import-admin-withdraw-list?start_time=${this.modelObj.start_time}&end_time=${this.modelObj.end_time}&search_type=${this.modelObj.search_type}&search_content=${this.modelObj.search_content}`;
        } else {
          this.$sfMessage.error("抱歉，当前用户没有操作权限");
        }
      },
      resetSearch() {
        this.modelObj = {
          search_type: "1",
          search_content: "",
          start_time: "",
          end_time: "",
        };
        this.currentPage = 1;
        this.getAdminCashList();
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import "../../assets/css/trad/adminCash.scss";
</style>
