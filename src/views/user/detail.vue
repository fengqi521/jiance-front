<template>
  <section>
    <div class="section-title">
      <router-link to="/user/users">消费用户</router-link> > 用户详情
    </div>
    <p class="section-name">用户 {{user_id}} 详情</p>
    <div class="section-header">
      <div class="section-item-router">
        <router-link :to="`/user/users/detail/${user_id}`" class="section-act">基本信息</router-link>
        <router-link :to="`/user/users/amount/${user_id}`">金额明细</router-link>
        <router-link :to="`/user/users/level/${user_id}`">等级积分</router-link>
        <router-link :to="`/user/users/record/${user_id}`">邀请记录</router-link>
        <router-link :to="`/user/users/charge/${user_id}`">充电记录</router-link>
      </div>
      <div class="header-content">
        <div class="content-top">
          <div class="top-left">
            <div v-if="head_img" class="user-img">
              <img :src="head_img" >
            </div>
            <div class="user-img" v-else></div>
          </div>
          <div class="top-right clearfix">
            <div class="top-item">
              <div class="top-item-title">账户余额（元）</div>
              <div
                :class="['top-item-text ellipsis' , parseFloat(balance)?'section-running':'']"
              >{{parseFloat(balance) ? balance : 0}}</div>
            </div>
            <div class="top-item">
              <div class="top-item-title">充电次数（次）</div>
              <div
                class="top-item-text ellipsis"
                :style="{color:parseFloat(charging_num)?'#666':''}"
              >{{parseFloat(charging_num) ? charging_num : 0}}</div>
            </div>
            <div class="top-item">
              <div class="top-item-title">充电度数总计（度）</div>
              <div
                class="top-item-text ellipsis"
                :style="{color:parseFloat(charging_quantity)?'#666':''}"
              >{{parseFloat(charging_quantity) ? charging_quantity : 0}}</div>
            </div>
          </div>
        </div>
        <div class="content-bottom clearfix" v-loading="loading">
          <div class="bottom-list">
            <div class="bottom-item">
              <div class="bottom-item-left">用户名：</div>
              <div class="bottom-item-right">{{nick_name ? nick_name : '--'}}</div>
            </div>
            <div class="bottom-item" v-if="user_type == 3">
              <div class="bottom-item-left">特权优惠：</div>
              <div class="bottom-item-right">{{user_discount}} 折</div>
            </div>
          </div>
          <div class="bottom-list">
            <div class="bottom-item">
              <div class="bottom-item-left">账号：</div>
              <div class="bottom-item-right">{{tel}}</div>
            </div>
            <div class="bottom-item" v-if="user_type == 3">
              <div class="bottom-item-left">关联充电桩：</div>
              <el-popover placement="right-start" width="610" trigger="click">
                <div class="table connect-pile-outer">
                  <div class="table-th clearfix">
                    <div class="table-td">桩运行编码</div>
                    <div class="table-td">桩名称</div>
                    <div class="table-td">所属充电站</div>
                  </div>
                  <div class="table-body scrollBar">
                    <div
                      class="table-tr"
                      v-show="user_piles && user_piles.length > 0"
                      v-for="(pile, i) in user_piles"
                      :key="i"
                    >
                      <div class="table-td">{{pile.pile_sn}}</div>
                      <div class="table-td">{{pile.pile_name}}</div>
                      <div class="table-td">{{pile.station_name}}</div>
                    </div>
                  </div>
                </div>
                <div slot="reference" class="bottom-item-right bottom-operate">查看</div>
              </el-popover>
            </div>
          </div>
          <div class="bottom-list">
            <div class="bottom-item">
              <div class="bottom-item-left">用户类型：</div>
              <div class="bottom-item-right">{{user_type_word}}</div>
            </div>
            <div class="bottom-item" v-if="user_type == 3">
              <div class="bottom-item-left">操作：</div>
              <div class="bottom-item-right bottom-operate" @click="editUser">修改</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="section-container">
      <div class="section-item-header">
        <span>第三方账号</span>
      </div>
      <div class="table">
        <div class="table-th clearfix">
          <div class="table-td">账号类型</div>
          <div class="table-td">昵称</div>
        </div>
        <div class="table-body" v-loading="listLoading">
          <div
            class="table-tr"
            v-show="userData && userData.length"
            v-for="(invite, index) in userData"
            :key="index"
          >
            <div class="table-td table-operate">
              <div v-if="invite.third_recharge_platform == 3" class="td-item td-qq-pay"></div>
              <div v-else-if="invite.third_recharge_platform == 2" class="td-item td-apple-pay"></div>
              <div v-else class="td-item td-wechat-pay"></div>
            </div>
            <div class="table-td">
              <div class="td-item">{{invite.user_name}}</div>
            </div>
          </div>
          <div class="table-tr unData" v-if="!userData || userData.length === 0">
            <img :src="require('assets/img/unData.png')" />
            <span>暂无数据</span>
          </div>
        </div>
      </div>
    </div>
    <div class="section-container">
      <div class="section-item-header">
        <span>绑定车辆</span>
      </div>
      <div class="section-main">
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td">车型</div>
            <div class="table-td">车牌号</div>
            <div class="table-td">车架号</div>
            <div class="table-td table-column__1">所属方</div>
            <div class="table-td">企业名称</div>
            <div class="table-td ">车辆类型</div>
          </div>
          <div class="table-body" v-loading="listLoading">
            <div
              class="table-tr"
              v-show="tableData && tableData.length"
              v-for="(item, index) in tableData"
              :key="index"
            >
              <div class="table-td">
                <div class="td-item">{{item.car_type_name}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{item.license_plate}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{item.car_frame}}</div>
              </div>
              <div class="table-td table-column__1">
                <div class="td-item" v-if="item.bind_type == 1">个人</div>
                <div class="td-item" v-else>企业</div>
              </div>
              <div class="table-td">
                <div class="td-item" v-if="item.bind_type == 1">--</div>
                <div class="td-item" v-else>{{item.bind_name}}</div>
              </div>
              <div class="table-td table-status">
                <div
                  class="td-item td-fault"
                  v-if="item.car_type == 1"
                >运营车</div>
                <div class="td-item" v-else>私家车</div>
              </div>
            </div>
            <div class="table-tr unData" v-if="!tableData || tableData.length === 0">
              <img :src="require('assets/img/unData.png')" />
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
    <!-- 修改用户 -->
    <sf-modelBox
      class="addVipUser"
      :showModel.sync="showEditUser"
      title="修改用户"
      @change="saveUserInfo"
    >
      <el-form :model="userInfo" ref="userInfo" :rules="dataRules">
        <div class="box-list">
          <div class="box-left">用户名</div>
          <div class="box-right">
            <el-form-item prop="user_name">
              <el-input v-model="userInfo.user_name" placeholder="请输入用户名" />
            </el-form-item>
          </div>
        </div>
        <div class="box-list">
          <div class="box-left">登录账号</div>
          <div class="box-right">
            <el-form-item prop="account">
              <el-input disabled v-model="userInfo.account" placeholder="请输入登录账号" />
            </el-form-item>
          </div>
        </div>
        <div class="box-list">
          <div class="box-left">登录密码</div>
          <div class="box-right">
            <el-form-item prop="pass">
              <el-input type="password" v-model="userInfo.pass" placeholder="请输入登录密码" />
            </el-form-item>
          </div>
        </div>
        <div class="box-list">
          <div class="box-left">用户优惠</div>
          <div class="box-right">
            <el-form-item prop="discount">
              <el-input v-model="userInfo.discount" type="number" placeholder="请输入用户优惠" />
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
      userData: [],
      user_id: this.$route.params.id,
      currentPage: 1,
      page_count: 1,
      listLoading: false,
      loading: false,
      balance: "",
      head_img:'',
      charging_num: "",
      charging_quantity: "",
      nick_name: "",
      tel: "",
      user_type: "",
      user_type_word: "",
      user_type_array: {
        1: "APP用户",
        2: "企业主用户",
        3: "特权用户",
        4: "企业子用户"
      },
      invite_status: {
        1: "未注册",
        2: "已注册",
        3: "已消费",
      },
      user_discount: "",
      user_piles: [],
      tableData: [],
      showEditUser: false,
      userInfo: {
        user_name: "",
        account: "",
        pass: "",
        discount: "",
      },
      dataRules: {
        user_name: [
          { required: true, message: "* 请输入用户姓名", trigger: "change" },
        ],
        discount: [
          { required: true, message: "* 请输入用户优惠", trigger: "change" },
          { validator: onlyInteger, trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getBasicDetail();
    this.getBindList();
    this.getThird();
  },
  methods: {
    editUser() {
      this.showEditUser = true;
    },
    getBasicDetail() {
      this.listLoading = true;
      this.loading = true;
      let param = {
        id: this.user_id,
        page: this.currentPage,
      };
      this.$api.customerBasic(param).then((data) => {
        this.listLoading = false;
        this.loading = false;
        if (data.code == 1) {
          this.balance = data.data.remaining_balance;
          this.charging_num = data.data.charge_count;
          this.charging_quantity = data.data.charge_quantity_total;
          this.nick_name = data.data.nick_name;
          this.tel = data.data.tel;
          this.user_type = data.data.user_type;
          this.head_img = data.data.headimag
          this.user_type_word = this.user_type_array[data.data.user_type];
          if (data.data.user_type == 3) {
            this.user_discount = data.data.user_discount;
            this.user_piles = data.data.user_piles;

            // 编辑的时候需要的数据
            this.userInfo.user_name = data.data.nick_name;
            this.userInfo.account = data.data.tel;
            this.userInfo.user_name = data.data.nick_name;
            this.userInfo.discount = data.data.user_discount * 10;
          }
        }
      });
    },
    getBindList(){
        this.listLoading = true;
        this.loading = true;
        let param = {
            id: this.user_id,
            page: this.currentPage,
        };
        this.$api.customerBind(param).then((data) => {
            this.listLoading = false;
            this.loading = false;
            var that = this
            if (data.code == 1) {
                that.tableData = data.data.list;
                that.currentPage = data.data.current_page;
                that.page_count = data.data.page_total;
            }
        });
    },
    getThird(){
          let param = {
              id: this.user_id,
          };
          this.$api.customerThird(param).then((data) => {
              var that = this
              if (data.code == 1) {
                  that.userData = data.data;
              }
          });
      },
    // 点击分页触发
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getBindList();
    },
    saveUserInfo() {
      this.$refs["userInfo"].validate((valid) => {
        if (valid) {
          this.userInfo.user_id = this.user_id;
          this.$api.customerEdit(this.userInfo).then((data) => {
            if (data.code == 1) {
              this.showEditUser = false;
              this.$sfNotify({
                message: "成功",
              });
              this.nick_name = this.userInfo.user_name;
              this.user_discount = this.userInfo.discount / 10;
            } else {
              this.$sfNotify({
                duration: 0,
                type: "error",
                message: data.message,
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../assets/css/user/detail.scss";
</style>
