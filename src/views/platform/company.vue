<template>
  <section>
    <div class="section-title">大客户</div>
    <div class="section-header">
      <div class="section-item-header clearfix">
        <span>筛选查询</span>
      </div>
      <div class="header-content clearfix">
        <div class="content-item">
          <div class="header-left">客户账号</div>
          <div class="header-right">
            <el-input
              class="search-input"
              v-model="modelObj.account"
              placeholder="输入客户账号"
            />
          </div>
        </div>
        <div class="content-item">
          <div class="header-left">角色名称</div>
          <div class="header-right">
            <el-select v-model="modelObj.role_id">
              <el-option
                v-for="(role, index) in role_names"
                :key="index"
                style="width:148px;"
                :label="role.role_name"
                :value="role.id"
              />
            </el-select>
          </div>
        </div>
        <div class="content-item">
          <div
            class="btn_succ"
            @click="searchPile()"
          >查询</div>
          <div
            class="btn_cancel"
            @click="resetSearch()"
          >重置</div>
        </div>
      </div>
    </div>
    <div class="section-container">
      <div class="section-item-header clearfix">
        <span>成员列表</span>
        <div
          class="btn_succ add-coupon"
          @click="handleAdd(0)"
        >
          <i class="add-station"></i>添加客户
        </div>
      </div>
      <div class="section-main">
        <div
          class="table"
          v-loading="listLoading"
        >
          <div class="table-th clearfix">
            <div class="table-td">客户账号</div>
            <div class="table-td">客户邮箱</div>
            <div class="table-td">联系人</div>
            <div class="table-td">联系电话</div>
            <div class="table-td">角色名称</div>
            <div class="table-td">创建时间</div>
            <div class="table-td">状态</div>
            <div class="table-td">一号多充限额 (元)</div>
            <div class="table-td"  style="min-width: 140px">操作</div>
          </div>
          <div class="table-body">
            <div
              class="table-tr"
              v-show="tableData &&tableData.length > 0"
              v-for="(company, i) in tableData"
              :key="i"
            >
              <div class="table-td">
                <div class="td-item">{{company.account}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{company.email?company.email:'--'}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{company.user_name}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{company.tel}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{company.role_name}}</div>
              </div>
              <div class="table-td">
                <div class="td-item td-time">{{company.create_time}}</div>
              </div>
              <div class="table-td">
                <div
                  :class="['knob', company.user_status == 1 ? 'started' : '']"
                  @click="changeStatus(company, i)"
                >
                </div>
                <div class="knob-text">{{company.user_status == 1 ? '启用' : '停用'}}</div>
              </div>
              <div class="table-td">
                <div class="td-item td-time">{{company.limit_amount}}</div>
              </div>
              <div class="table-td table-operate">
                <el-tooltip
                  content="查看"
                  placement="top"
                >
                  <router-link
                    :to="`/platform/company/detail/${company.id}`"
                    class="td-item see-icon"
                  ></router-link>
                </el-tooltip>
                <el-tooltip
                  content="编辑"
                  placement="top"
                >
                  <div
                    class="td-item edit-icon"
                    @click="handleAdd(company.id)"
                  ></div>
                </el-tooltip>
                <el-tooltip
                  content="充值"
                  placement="top"
                >
                  <div
                    class="td-item recharge-icon"
                    @click="rechargeMoney(company.id)"
                  ></div>
                </el-tooltip>
                <el-tooltip
                        content="关联"
                        placement="top"
                >
                  <router-link
                          class="td-item connect-icon"
                          :to="`/company/account/stationassign?id=${company.personal_id}&title=企业主账户
                          `"
                  ></router-link>
                </el-tooltip>
              </div>
            </div>
            <div
              v-if="!tableData || tableData.length === 0"
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
    <!-- 添加/编辑 成员 -->
    <sf-modelBox
      class="user-box"
      :showModel.sync="showAddUser"
      :title="currentItem.id == 0 ? '添加客户' : '编辑客户'"
      @change="saveUserSure(currentItem.id)"
    >
      <el-form
        :model="modelInfo"
        ref="modelInfo"
        :rules="dataRules"
      >
        <div class="box-list">
          <div class="box-left"><i>*</i>客户账号</div>
          <div class="box-right">
            <el-form-item prop="account">
              <el-input
                v-model="modelInfo.account"
                :disabled="currentItem.id == 0 ? false : true"
                placeholder="请输入客户账号"
              />
            </el-form-item>
          </div>
        </div>
        <div
          class="box-list"
          v-if="currentItem.id == 0"
        >
          <div class="box-left"><i>*</i>登录密码</div>
          <div class="box-right">
            <el-form-item prop="pass">
              <el-input
                :type="password"
                @focus="password = 'password'"
                v-model="modelInfo.pass"
                placeholder="请输入登录密码"
                auto-complete="new-password"
              />
            </el-form-item>
          </div>
        </div>
        <div class="box-list">
          <div class="box-left"><i>*</i>角色名称</div>
          <div class="box-right">
            <el-form-item prop="role_id">
              <el-select
                v-model="modelInfo.role_id"
                placeholder="请选择成员角色"
              >
                <el-option
                  v-for="(add_role, add_index) in  role_names_add"
                  :key="add_index"
                  class="box-option"
                  :label="add_role.role_name"
                  :value="add_role.id"
                />
              </el-select>
            </el-form-item>
          </div>
        </div>
        <div class="box-list">
          <div class="box-left"><i>*</i>联系人</div>
          <div class="box-right">
            <el-form-item prop="user_name">
              <el-input
                v-model="modelInfo.user_name"
                placeholder="请输入成员姓名"
              />
            </el-form-item>
          </div>
        </div>
        <div class="box-list">
          <div class="box-left"><i>*</i>联系方式</div>
          <div class="box-right">
            <el-form-item prop="phone">
              <el-input
                v-model="modelInfo.phone"
                :disabled="currentItem.id == 0 ? false : true"
                placeholder="请输入联系电话"
              />
            </el-form-item>
          </div>
        </div>
        <div class="box-list">
          <div class="box-left"><i>*</i>一号多充限额</div>
          <div class="box-right">
            <el-form-item prop="limit_amount">
              <el-input
                      v-model="modelInfo.limit_amount"
                      placeholder="请输入一号多充限额"
              /> 
            <span class="unit">元</span>
            </el-form-item>
          </div>
        </div>
        <div class="box-list">
          <div class="box-left">联系邮箱</div>
          <div class="box-right">
            <el-form-item prop="email">
              <el-input
                v-model="modelInfo.email"
                placeholder="请输入联系邮箱"
              />
            </el-form-item>
          </div>
        </div>

      </el-form>
    </sf-modelBox>
    <!-- 充值 -->
    <sf-modelBox
      class="recharge-box"
      title="充值"
      :showModel.sync="showRechargeModel"
      @change="saveChargeInfo"
    >
      <el-form
        :model="chargeInfo"
        ref="chargeInfo"
        :rules="chargeRules"
      >
        <div class="box-list">
          <div class="box-left">企业账号</div>
          <div class="box-right">
            <div class="box-right-text">{{charge_account}}</div>
          </div>
        </div>
        <div class="box-list">
          <div class="box-left">当前余额</div>
          <div class="box-right">
            <div class="box-right-text">{{charge_balance}} <span class="unit">元</span></div>
          </div>
        </div>
        <div class="box-list">
          <div class="box-left">充值金额</div>
          <div class="box-right">
            <el-form-item prop="amount">
              <el-input
                class="account-input"
                v-model.number="chargeInfo.amount"
                placeholder="请输入充值金额"
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
    const onlyInteger = async (rule, value, callback) => {
      const boolean = new RegExp("^[1-9][0-9]*$").test(value);
      if (!boolean) {
        return callback(new Error("* 金额只能为正整数"));
      }
    };
    const onlyPhone = async (rule, value, callback) => {
      const boolean = new RegExp("^1(3|4|5|6|7|8|9)\\d{9}$").test(value);
      if (!boolean) {
        return callback(new Error("* 手机号格式不正确"));
      }
    };
    const onlyEmail = async (rule, value, callback) => {

      if (value) {
        const boolean = new RegExp(
          "^[a-z0-9]+([._\\\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"
        ).test(value);
        if (!boolean) {
          return callback(new Error("* 邮箱格式不正确"));
        }
      }
    };
    return {
      password:'text',
      modelObj: {
        account: "",
        role_id: ""
      },
      currentPage: 1,
      page_count: 1,
      tableData: [],
      role_names: [{ role_name: "全部", id: "" }],
      listLoading: false,
      status_array: {
        "0": "不可用",
        "1": "可用"
      },
      showAddUser: false,
      showRechargeModel: false,
      charge_account: "",
      charge_balance: "",
      modelInfo: {
        account: "",
        pass: "",
        role_id: "",
        email: "",
        phone: "",
        user_name: "",
        limit_amount:''
      },
      chargeInfo: {
        amount: ""
      },
      dataRules: {
        account: [
          { required: true, message: "* 请输入企业账号", trigger: "blur" }
        ],
        pass: [{ required: true, message: "* 请输入密码", trigger: "blur" }],
        user_name: [
          { required: true, message: "* 请输入联系人姓名", trigger: "blur" }
        ],
        limit_amount: [
          { required: true, message: "* 请输入一号多充限额", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "* 请输入联系电话", trigger: "blur" },
          { validator: onlyPhone, trigger: "blur" }
        ],
        email: [{ validator: onlyEmail, trigger: "blur" }]
      },
      chargeRules: {
        amount: [
          { required: true, message: "* 请输入充值金额", trigger: "blur" },
          { type: 'number', message: '充值金额必须为数字值',trigger: "change"},
        ]
      },
      currentItem: {
        id: 0
      },
      role_names_add: [],
      charge_id: ""
    };
  },
  created() {
    this.getAllRoleName();
    this.getTableDataList();
  },
  methods: {
    rechargeMoney(id) {
      this.chargeInfo.amount = "";
      this.$api.roleDepositInfo({ id: id }).then(data => {
        if (data.code == 1) {
          this.charge_account = data.data.account;
          this.charge_balance = data.data.remaining_balance;
          this.charge_id = id;
          this.showRechargeModel = true;
        }
      });
    },
    saveChargeInfo() {
      this.$refs["chargeInfo"].validate(valid => {
        if (valid) {
          this.chargeInfo.id = this.charge_id;
          this.$api.roleDeposit(this.chargeInfo).then(data => {
            if (data.code == 1) {
              this.showRechargeModel = false;
              this.$sfNotify({
                message: "成功"
              });
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
    },
    getAllRoleName() {
      this.$api.roleRoleName({ type: 2 }).then(data => {
        if (data.code == 1) {
          let _data = data.data;
          this.role_names = this.role_names.concat(_data);
          this.role_names_add = _data;
        }
      });
    },
    getTableDataList() {
      this.listLoading = true;
      this.modelObj.page = this.currentPage;
      this.$api.roleCompanies(this.modelObj).then(data => {
        this.listLoading = false;
        if (data.code == 1) {
          this.tableData = data.data.list;
          this.currentPage = data.data.current_page;
          this.page_count = data.data.page_total;
        }
      });
    },
    searchPile() {
      this.currentPage = 1;
      this.tableData = [];
      this.getTableDataList();
    },
    resetSearch() {
      this.modelObj.account = "";
      this.modelObj.role_id = "";
      this.currentPage = 1;
      this.page_count = 1;
      this.tableData = [];
      this.getTableDataList();
    },
    // 点击分页触发
    handleCurrentChange(page) {
      this.currentPage = page;
      this.tableData = [];
      this.getTableDataList();
    },
    handleAdd(id) {
      this.currentItem.id = id;
      if (id != 0) {
        this.modelInfo.account = "";
        this.modelInfo.pass = "";
        this.modelInfo.role_id = "";
        this.modelInfo.email = "";
        this.modelInfo.phone = "";
        this.modelInfo.user_name = "";
        this.modelInfo.limit_amount = '';
        // 编辑
        this.$api.roleAccount({ id: id }).then(data => {
          if (data.code == 1) {
            this.modelInfo.account = data.data.account;
            this.modelInfo.pass = "";
            this.modelInfo.role_id = data.data.role_id;
            this.modelInfo.email = data.data.email;
            this.modelInfo.phone = data.data.tel;
            this.modelInfo.user_name = data.data.user_name;
            this.modelInfo.limit_amount = data.data.limit_amount
            this.showAddUser = true;
          }
        });
      } else {
        // 添加
        this.modelInfo.account = "";
        this.modelInfo.pass = "";
        this.modelInfo.role_id = "";
        this.modelInfo.email = "";
        this.modelInfo.phone = "";
        this.modelInfo.user_name = "";
        this.modelInfo.limit_amount = '';
        this.showAddUser = true;
      }
    },
    saveUserSure(id) {
      if (id == 0) {
        // 添加
        this.$refs["modelInfo"].validate(valid => {
          if (valid) {
            this.$api.roleCreateCompany(this.modelInfo).then(data => {
              this.showAddUser = false;
              if (data.code == 1) {
                this.$sfNotify({
                  message: "成功"
                });
                setTimeout(this.getTableDataList, 2000);
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
      } else {
        this.$refs["modelInfo"].validate(valid => {
          if (valid) {
            this.modelInfo.id = id;
            delete this.modelInfo.pass;
            this.$api.roleEditCompany(this.modelInfo).then(data => {
              this.showAddUser = false;
              if (data.code == 1) {
                this.$sfNotify({
                  message: "成功"
                });
                setTimeout(this.getTableDataList, 2000);
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
      }
    },
    changeStatus(item, index) {
      let status = item.user_status == 1 ? 0 : 1;
      this.$api.roleChangeStatus({ id: item.id, status: status }).then(data => {
        if (data.code == 1) {
          this.$sfNotify({
            message: "成功"
          });
          this.tableData[index].user_status = status;
        } else {
          this.$sfNotify({
            duration: 0,
            type: "error",
            message: "失败"
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/platform/compony.scss";
</style>
