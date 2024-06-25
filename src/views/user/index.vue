<template>
  <section>
    <div class="section-title">消费用户</div>
    <div class="section-header">
      <div class="section-item-header clearfix">
        <span>筛选查询</span>
      </div>
      <div class="header-content clearfix">
        <div class="content-item">
          <el-select
            class="search-type"
            v-model="modelObj.sea_type"
          >
            <el-option
              label="用户ID"
              value="1"
            />
            <el-option
              label="用户名"
              value="2"
            />
            <el-option
              label="账号"
              value="3"
            />
          </el-select>
          <el-input
            class="search-input"
            v-model="modelObj.search"
            placeholder="关键字搜索"
          />
        </div>
        <div class="content-item">
          <div class="header-left">用户类型</div>
          <div class="header-right">
            <el-select v-model="modelObj.type">
              <el-option
                label="全部"
                value=""
              />
              <el-option
                label="APP用户"
                value="1"
              />
              <el-option
                label="企业主用户"
                value="2"
              />
              <el-option
                label="特权用户"
                value="3"
              />
              <el-option
                label="企业子用户"
                value="4"
              />
            </el-select>
          </div>
        </div>
        <div class="content-item">
          <div
            class="btn_succ"
            @click="searchStation()"
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
        <span>用户列表</span>
        <span
          class="btn_succ add-station"
          @click="addSpecialUser"
        >
          <img :src="require('assets/img/add-station.png')">
          添加特权用户</span>
      </div>
      <div class="section-main">
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td">用户ID</div>
            <div class="table-td">用户名</div>
            <div class="table-td">账号</div>
            <div class="table-td">用户类型</div>
            <div class="table-td">用户等级</div>
            <div class="table-td">是否绑定车辆</div>
            <div class="table-td">
              充电次数<el-tooltip
                content="截止到昨天"
                placement="top"
              >
                <div
                  class="tips-icon"
                  style="margin-left:2px;"
                ></div>
              </el-tooltip>
            </div>
            <div class="table-td">
              充电度数总计 (度)<el-tooltip
                content="截止到昨天"
                placement="top"
              >
                <div
                  class="tips-icon"
                  style="margin-left:2px;"
                ></div>
              </el-tooltip>
            </div>
            <div class="table-td">账户余额（元）</div>
            <div class="table-td">操作</div>
          </div>
          <div
            class="table-body"
            v-loading="listLoading"
          >
            <div
              class="table-tr"
              v-show="tableData && tableData.length"
              v-for="(item, index) in tableData"
              :key="index"
            >
              <div class="table-td">
                <div class="td-item">{{item.id}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{item.nick_name ? item.nick_name : '--'}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{item.tel ? item.tel : '--'}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{user_type_array[item.user_type]?user_type_array[item.user_type]:'--'}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{changeLevel(item.level)}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{item.bind_flag}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{item.charge_count ? item.charge_count : 0}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{item.charge_quantity_total ? item.charge_quantity_total : 0}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{item.remaining_balance}}</div>
              </div>
              <div class="table-td table-operate">
                <el-tooltip
                  content="查看"
                  placement="top"
                >
                  <router-link
                    target="_blank"
                    :to="`/user/users/detail/${item.id}`"
                    class="td-item see-icon"
                  ></router-link>
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
            v-if="tableData && tableData.length"
            :currentPage="currentPage"
            :page-count="page_count"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
    <!-- 添加特权用户 -->
    <sf-modelBox
      class="addVipUser"
      :showModel.sync="showAddUser"
      title="添加特权用户"
      @change="saveUserInfo"
    >
      <el-form
        :model="userInfo"
        ref="userInfo"
        :rules="dataRules"
      >
        <div class="box-list">
          <div class="box-left"><i>*</i>用户名</div>
          <div class="box-right">
            <el-form-item prop="user_name">
              <el-input
                v-model="userInfo.user_name"
                placeholder="请输入用户名"
                auto-complete="new-password"
              />
            </el-form-item>
          </div>
        </div>
        <div class="box-list">
          <div class="box-left"><i>*</i>手机号码</div>
          <div class="box-right">
            <el-form-item prop="account">
              <el-input
                v-model="userInfo.account"
                placeholder="请输入手机号码"
                auto-complete="new-password"
              />
            </el-form-item>
          </div>
        </div>
        <div class="box-list">
          <div class="box-left"><i>*</i>登录密码</div>
          <div class="box-right">
            <el-form-item prop="pass">
              <el-input
                :type="password"
                @focus="password='password'"
                v-model="userInfo.pass"
                placeholder="请输入登录密码"
                auto-complete="new-password"
              />
            </el-form-item>
          </div>
        </div>
        <div class="box-list">
          <div class="box-left"><i>*</i>用户优惠</div>
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
    const onlyPhone = async (rule, value, callback) => {
      const boolean = new RegExp("^1(3|4|5|6|7|8|9)\\d{9}$").test(value);
      if (!boolean) {
        return callback(new Error("* 手机号格式不正确"));
      }
    };
    return {
      password: "text",
      modelObj: {
        sea_type: "3",
        search: "",
        type: ""
      },
      currentPage: 1,
      page_count: 1,
      listLoading: false,
      tableData: [],
      user_type_array: {
        "1": "APP用户",
        "2": "企业主用户",
        "3": "特权用户",
        "4": "企业子用户"
      },
      showAddUser: false,
      userInfo: {
        user_name: "",
        account: "",
        pass: "",
        discount: ""
      },
      dataRules: {
        user_name: [
          { required: true, message: "* 请输入用户姓名", trigger: "blur" }
        ],
        account: [
          { required: true, message: "* 请输入登录账号", trigger: "blur" },
          { validator: onlyPhone, trigger: "blur" }
        ],
        pass: [
          { required: true, message: "* 请输入登录密码", trigger: "blur" }
        ],
        discount: [
          { required: true, message: "* 请输入用户优惠", trigger: "blur" },
          { validator: onlyInteger, trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getTableDataList();
  },
  methods: {
    addSpecialUser() {
      this.userInfo.user_name = "";
      this.userInfo.account = "";
      this.userInfo.pass = "";
      this.userInfo.discount = "";
      this.showAddUser = true;
    },
    getTableDataList() {
      this.listLoading = true;
      this.modelObj.page = this.currentPage;
      this.$api.customerList(this.modelObj).then(data => {
        this.listLoading = false;
        if (data.code == 1) {
          this.tableData = data.data.list;
          this.currentPage = data.data.current_page;
          this.page_count = data.data.page_total;
        }
      });
    },
    searchStation() {
      this.currentPage = 1;
      this.tableData = [];
      this.getTableDataList();
    },
    resetSearch() {
      this.modelObj.sea_type = "1";
      this.modelObj.search = "";
      this.modelObj.type = "";
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
    saveUserInfo() {
      this.$refs["userInfo"].validate(valid => {
        if (valid) {
          this.$api.customerCreate(this.userInfo).then(data => {
            if (data.code == 1) {
              this.showAddUser = false;
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
    },
    changeLevel(level) {
      switch (parseInt(level)) {
        case 2:
          return '二级';
        case 3:
          return '三级';
        case 4:
          return '四级';
        case 5:
          return '五级';
        case 6:
          return '六级';
        case 7:
          return '七级';
        case 8:
          return '八级';
        default:
          return '一级';
      }
    },
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/user/index.scss";
</style>
