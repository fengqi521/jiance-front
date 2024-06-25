<template>
  <section>
    <div class="section-title">
      <router-link to="/activity/coupon">优惠券管理</router-link> > 已发优惠券
    </div>
    <div class="section-container">
      <div class="section-item-header clearfix">
        <span>已发优惠券列表</span>
      </div>
      <div class="section-main">
        <div class="header-content clearfix">
          <div class="content-item">
            <div class="header-left">用户账号</div>
            <div class="header-right">
              <el-input
                class="search-input"
                v-model="modelObj.search_content"
                placeholder="关键字搜索"
              />
            </div>
          </div>
          <div class="content-item">
            <div class="header-left">发券方式</div>
            <div class="header-right">
              <el-select v-model="modelObj.type">
                <el-option label="全部" value="all" />
                <el-option label="邀请新用户" value="1" />
                <el-option label="充值" value="2" />
                <el-option label="商业合作" value="4" />
                <el-option label="按照账户发放" value="5" />
                <el-option label="组队活动发放" value="6" />
                <el-option label="会员权益" value="7" />
                <el-option label="积分兑换" value="8" />
              </el-select>
            </div>
          </div>
          <div class="content-item">
            <div class="header-left">优惠券状态</div>
            <div class="header-right">
              <el-select v-model="modelObj.status">
                <el-option label="全部" value="all" />
                <el-option label="未使用" value="0" />
                <el-option label="已使用" value="1" />
                <el-option label="已过期" value="2" />
              </el-select>
            </div>
          </div>
          <div class="content-item">
            <div class="header-left">优惠券类型</div>
            <div class="header-right">
              <el-select v-model="modelObj.coupon_type">
                <el-option label="全部" value="all" />
                <el-option label="现金券" value="1" />
                <el-option label="折扣券" value="2" />
                <el-option label="电度券" value="3" />
              </el-select>
            </div>
          </div>
          <div class="content-item">
            <div class="header-left">发券日期</div>
            <div class="header-right">
              <el-date-picker
                v-model="modelObj.start_time"
                type="date"
                placeholder="选择开始日期"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
              <el-date-picker
                class="end-time"
                v-model="modelObj.end_time"
                type="date"
                placeholder="选择结束日期"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </div>
          </div>
          <div class="content-item">
            <div class="btn_succ" @click="searchPile()">查询</div>
            <div class="btn_cancel" @click="resetSearch()">重置</div>
          </div>
        </div>
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td">优惠券ID</div>
            <div class="table-td">用户账号</div>
            <div class="table-td">发券方式</div>
            <div class="table-td">发券时间</div>
            <div class="table-td">到期时间</div>
            <div class="table-td">优惠券类型</div>
            <div class="table-td">状态</div>
            <div class="table-td">操作</div>
          </div>
          <div class="table-body" v-loading="listLoading">
            <div
              class="table-tr"
              v-show="tableData && tableData.length > 0"
              v-for="(send_info, index) in tableData"
              :key="index"
            >
              <div class="table-td">
                <div class="td-item">{{ send_info.id }}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{ send_info.user_tel }}</div>
              </div>
              <div class="table-td">
                <div class="td-item">
                  {{ bonus_type_array[send_info.bonus_type] }}
                </div>
              </div>
              <div class="table-td">
                <div class="td-item">{{ send_info.create_time }}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{ send_info.exp_time }}</div>
              </div>
              <div class="table-td">
                <div class="td-item">
                  {{ coupon_type_array[send_info.coupon_type] }}
                </div>
              </div>
              <div class="table-td table-status">
                <div
                  class="td-item success-color"
                  v-if="send_info.status == 0"
                >
                  {{ status_array[send_info.status] }}
                </div>
                <div class="td-item" v-else>
                  {{ status_array[send_info.status] }}
                </div>
              </div>
              <div class="table-td table-operate">
                <el-tooltip content="查看" placement="top">
                  <div
                    class="td-item see-icon"
                    @click="showStations(send_info)"
                  ></div>
                </el-tooltip>
              </div>
            </div>
            <div
              v-if="!tableData || tableData.length === 0"
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
    <!-- 查看权限 -->
    <sf-messageBox
      class="permission-box"
      :showModel.sync="showPermission"
      title="优惠券详情"
    >
      <!-- <div class="box-name">以下充电站可用：</div> -->
      <div class="box-main scrollBar">
        <!-- {{available_stations}} -->
        <div class="permission-top">
          <div class="permission-left">
            <div class="permission-list">
              <span>获取条件 ：</span>
              <span v-if="available_stations.bonus_type == '1'">新用户消费后送</span>
              <span v-if="available_stations.bonus_type == '2'">一次性充值{{ available_stations.min_amount}}元</span>
              <span v-if="available_stations.bonus_type == '4'">输入兑换码兑换优惠券</span>
              <span v-if="available_stations.bonus_type == '5'">按照账号手动发放</span>
              <span v-if="available_stations.bonus_type == '6'">团队成员支付总额满{{available_stations.bonus_money}}元</span>
              <span v-if="available_stations.bonus_type == '7'">会员权益</span>
              <span v-if="available_stations.bonus_type == '8'">积分兑换</span>
            </div>
            <div class="permission-list">
              <span>面值 ：</span>
              <span v-if="available_stations.coupon_type == '1'">{{ available_stations.bonus_money}} 元</span>
              <span v-if="available_stations.coupon_type == '2'">{{ available_stations.discount}} 折</span>
              <span v-if="available_stations.coupon_type == '3'">{{ available_stations.bonus_money}} 度</span>
            </div>
            <div class="permission-list">
              <span>发券方式 ：</span
              ><span>{{
                bonus_type_array[available_stations.bonus_type]
              }}</span>
            </div>
          </div>
          <div class="permission-right">
            <div class="permission-list">
              <span>优惠类型 ：</span>
              <span>{{
                coupon_type_array[available_stations.coupon_type]
              }}</span>
            </div>
            <div class="permission-list">
              <span>使用条件 ：</span>
              <span v-if="available_stations.coupon_type == '1'">应付金额满 {{ available_stations.min_good_amount }} 元可用</span>
              <span v-if="available_stations.coupon_type == '2'">服务费金额满 {{ available_stations.min_good_amount}} 元可用</span>
              <span v-if="available_stations.coupon_type == '3'">充电度数满 {{ available_stations.min_good_amount }} 度可用</span>
            </div>
            <div class="permission-list">
              <span>有效期 ：</span
              ><span>领取后 {{ available_stations.exp }} 日内</span>
            </div>
          </div>
        </div>
        <div class="permission-bottom">
          <span class="permission-canuse-station">可用充电站 ：</span>
          <span class="permission-user-word" v-if="available_stations.limit_stations_type == 1">全部可用</span>
          <span class="permission-user-word" v-else>{{
              available_stations.station_name ? available_stations.station_name : '--'
            }}</span>
        </div>
      </div>
    </sf-messageBox>
  </section>
</template>

<script>
export default {
  data() {
    return {
      modelObj: {
        search_type: "1",
        search_content: "",
        start_time: "",
        end_time: "",
        type: "all",
        status: "all",
        coupon_type:'all'
      },
      pay_type: 2,
      currentPage: 1,
      page_count: 10,
      tableData: [],
      listLoading: false,
      showPermission: false,
      bonus_type_array: {
        1: "邀请新用户",
        2: "充值",
        4: "商业合作",
        5: "按照账户发放",
        6: "组队活动发放",
        7: "会员权益",
        8: "积分兑换"
      },
      coupon_type_array: {
        1: "现金券",
        2: "折扣券",
        3: "电度券",
      },
      status_array: {
        0: "未使用",
        1: "已使用",
        2: "已过期",
      },
      available_stations: {
        create_time: "",
        bonus_type: "",
        min_amount: "",
        coupon_type: "",
        bonus_money: "",
        min_good_amount: "",

        exp: "",
        station_name: "",
      },
    };
  },
  created() {
    this.getTableDataList();
  },
  methods: {
    getTableDataList() {
      this.listLoading = true;
      this.modelObj.page = this.currentPage;
      this.$api.bonusGetBonus(this.modelObj).then((data) => {
        this.listLoading = false;
        if (data.code == 1) {
          this.tableData = data.data.list;
          this.currentPage = data.data.current_page;
          this.page_count = data.data.page_total;
        }
      });
    },
    // 点击分页触发
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getTableDataList();
    },
    searchPile() {
      this.currentPage = 1;
      this.getTableDataList();
    },
    resetSearch() {
      this.modelObj.search_type = "1";
      this.modelObj.search_content = "";
      this.modelObj.start_time = "";
      this.modelObj.end_time = "";
      this.modelObj.type = "";
      this.modelObj.status = "all";
      this.modelObj.coupon_type = 'all';
      this.currentPage = 1;
      this.page_count = 1;
      this.tableData = [];
      this.getTableDataList();
    },
    showStations(value) {
      this.available_stations = value;
      this.showPermission = true;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/activity/send.scss";
</style>
