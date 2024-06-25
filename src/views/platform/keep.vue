<template>
  <section>
    <div class="section-title">运维成员</div>
    <div class="section-tips">
        <i class="warning-icon"></i>
        <span class="tips-text">注意：主要管理相关联的充电站的所有枪，可直接远程操作枪的启停。</span>
    </div>
    <div class="section-header">
      <div class="section-item-header clearfix">
        <span>筛选查询</span>
      </div>
      <div class="header-content clearfix">
        <div class="content-item">
          <div class="header-left">成员账号</div>
          <div class="header-right">
            <el-input
              class="search-input"
              v-model="modelObj.account"
              placeholder="输入成员账号"
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
          <i class="add-station"></i>添加成员
        </div>
      </div>
      <div class="section-main">
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td">成员账号</div>
            <div class="table-td">联系邮箱</div>
            <div class="table-td">联系人</div>
            <div class="table-td">联系电话</div>
            <div class="table-td">角色名称</div>
            <div class="table-td">创建时间</div>
            <div class="table-td">操作</div>
          </div>
          <div
            class="table-body"
            v-loading="listLoading"
          >
            <div
              class="table-tr"
              v-show="tableData && tableData.length > 0"
              v-for="(item, i) in tableData"
              :key="i"
            >
              <div class="table-td">
                <div class="td-item">{{item.account?item.account:'--'}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{item.email?item.email:'--'}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{item.user_name?item.user_name:'--'}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{item.tel?item.tel:'--'}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{item.role_name?item.role_name:'--'}}</div>
              </div>
              <div class="table-td">
                <div class="td-item td-time">{{item.create_time?item.create_time:'--'}}</div>
              </div>
              <div class="table-td table-operate">
                <!--<el-tooltip-->
                <!--content="查看"-->
                <!--placement="top"-->
                <!--&gt;-->
                  <!--<div-->
                  <!--class="td-item see-icon"-->
                  <!--@click="showStations(item.station_name)"-->
                  <!--&gt;</div>-->
                <!--</el-tooltip>-->
                <el-tooltip
                  content="编辑"
                  placement="top"
                >
                  <div
                    class="td-item edit-icon"
                    @click="handleAdd(item.id)"
                  ></div>
                </el-tooltip>
                <el-tooltip
                  content="删除"
                  placement="top"
                >
                  <div
                    class="td-item delete-icon"
                    @click="delItem(item.id)"
                  ></div>
                </el-tooltip>
                <el-tooltip
                content="关联"
                placement="top"
                >
                  <router-link
                  class="td-item connect-icon"
                  :to="`/platform/keep/assign/${item.id}/${item.account}`"
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
      :title="currentItem.id == 0 ? '添加成员' : '编辑成员'"
      @change="saveUserSure(currentItem.id)"
    >
      <el-form
        :model="modelInfo"
        ref="modelInfo"
        :rules="dataRules"
      >
        <div class="box-list">
          <div class="box-left"><i>*</i>成员账号</div>
          <div class="box-right">
            <el-form-item prop="account">
              <el-input
                v-model="modelInfo.account"
                :disabled="currentItem.id == 0 ? false : true"
                placeholder="请输入成员账号"
              />
            </el-form-item>
          </div>
        </div>
        <div class="box-list">
          <div
            class="box-left"
            v-if="currentItem.id == 0"
          ><i>*</i>登录密码</div>
          <div
            class="box-left"
            v-else
          ><i></i>登录密码</div>
          <div class="box-right">
            <el-form-item
              prop="pass"
              v-if="currentItem.id == 0"
            >
              <el-input
                :type="password"
                @focus="password = 'password'"
                v-model="modelInfo.pass"
                placeholder="请输入登录密码"
                auto-complete="new-password"
              />
            </el-form-item>
            <el-form-item
              prop="pass_edit"
              v-else
            >
              <el-input
                :type="password"
                @focus="password = 'password'"
                v-model="modelInfo.pass_edit"
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
                  style="width:250px;height:36px;line-height:34px"
                  :label="add_role.role_name"
                  :value="add_role.id"
                />
              </el-select>
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
        <div class="box-list">
          <div class="box-left"><i>*</i>联系方式</div>
          <div class="box-right">
            <el-form-item prop="phone">
              <el-input
                v-model="modelInfo.phone"
                placeholder="请输入联系电话"
              />
            </el-form-item>
          </div>
        </div>
        <div class="box-list">
          <div class="box-left">联系人</div>
          <div class="box-right">
            <el-input
              v-model="modelInfo.user_name"
              placeholder="请输入成员姓名"
            />
          </div>
        </div>
      </el-form>
    </sf-modelBox>

    <!-- 删除 -->
    <sf-modelBox
      :showModel.sync="showDelete"
      title="删除确认"
      type="delete"
      @change="saveDeleteSure"
    >
      <p>是否确定删除成员？</p>
    </sf-modelBox>
    <!-- 查看权限 -->
    <sf-messageBox
    class="permission-box"
    :showModel.sync="showPermission"
    title="运营站点"
    >
      <div class="box-main scrollBar">
        {{available_stations}}
      </div>
    </sf-messageBox>
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
    const onlyEmail = async (rule, value, callback) => {
      console.log(value);
      if (value != "" && value != null) {
        const boolean = new RegExp(
          "^[a-z0-9]+([._\\\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"
        ).test(value);
        if (!boolean) {
          return callback(new Error("* 邮箱格式不正确"));
        }
      }
    };
    return {
      modelObj: {
        account: "",
        role_id: ""
      },
      currentItem: {
        id: 0
      },
      password: "text",
      currentPage: 1,
      page_count: 1,
      tableData: [],
      listLoading: false,
      role_names: [{ role_name: "全部", id: "" }],
      role_names_add: [],
      showAddUser: false,
      modelInfo: {
        account: "",
        pass: "",
        role_id: "",
        email: "",
        phone: "",
        user_name: "",
        pass_edit: ""
      },
      dataRules: {
        account: [
          { required: true, message: "* 请输入成员账号", trigger: "blur" }
        ],
        pass: [
          { required: true, message: "* 请输入登录密码", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "* 联系方式将用于运维管理时消息通知", trigger: "blur" },
          { validator: onlyPhone, trigger: "blur" }
        ],
        email: [{ validator: onlyEmail, trigger: "blur" }]
      },
      showDelete: false,
      delete_id: "",
      available_stations: "",
      showPermission: false,
    };
  },
  created() {
    this.getAllRoleName();
    this.getTableDataList();
  },
  methods: {
    delItem(id) {
      this.showDelete = true;
      this.delete_id = id;
    },
    // 确认删除
    saveDeleteSure() {
      this.$api.roleDelRunningUser({ id: this.delete_id }).then(data => {
        this.delete_id = "";
        this.showDelete = false;
        if (data.code == 1) {
          this.$sfNotify({
            message: "成功"
          });
          setTimeout(this.getTableDataList, 1500);
        } else {
          this.$sfNotify({
            duration: 0,
            type: "error",
            message: "失败"
          });
        }
      });
    },
    getAllRoleName() {
      this.$api.roleRoleName({ type: 5}).then(data => {
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
      this.$api.roleRunnings(this.modelObj).then(data => {
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
        // 编辑
        this.$api.roleAccount({ id: id }).then(data => {
          if (data.code == 1) {
            this.modelInfo.account = data.data.account;
            this.modelInfo.pass = "";
            this.modelInfo.pass_edit = "";
            this.modelInfo.role_id = data.data.role_id;
            this.modelInfo.email = data.data.email;
            this.modelInfo.phone = data.data.tel;
            this.modelInfo.user_name = data.data.user_name;
            this.showAddUser = true;
          }
        });
      } else {
        // 添加
        this.modelInfo.account = "";
        this.modelInfo.pass = "";
        this.modelInfo.pass_edit = "";
         this.modelInfo.role_id = "";
        this.modelInfo.email = "";
        this.modelInfo.phone = "";
        this.modelInfo.user_name = "";
        this.showAddUser = true;
      }
    },
    saveUserSure(id) {
      if (id == 0) {
        // 添加
        this.$refs["modelInfo"].validate(valid => {
          if (valid) {
            delete this.modelInfo.pass_edit;
            this.$api.roleRunningUser(this.modelInfo).then(data => {
              this.showAddUser = false;
              this.modelInfo.account = "";
              this.modelInfo.pass = "";
              this.modelInfo.role_id = "";
              this.modelInfo.email = "";
              this.modelInfo.phone = "";
              this.modelInfo.user_name = "";
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
            this.$api.roleEditRunningUser(this.modelInfo).then(data => {
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
    showStations(stations) {
        this.available_stations = "";
        this.available_stations = stations;
        this.showPermission = true;
    },
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/platform/system.scss";
@import "../../assets/css/platform/keep.scss";
</style>
