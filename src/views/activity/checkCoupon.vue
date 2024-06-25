<template>
  <section>
    <div class="section-title">
      <router-link to="/activity/coupon">优惠券管理</router-link> > 优惠券详情
    </div>
    <div class="section-header">
      <div class="section-item-header">
        <a style="cursor:default">优惠券信息</a>
      </div>
      <div class="header-content clearfix"  v-loading="loading">
        <div class="content-top">
          <div class="top-item">
            <div class="top-item-title">创建时间</div>
            <div
              :style="{ fontSize:'18px',color:businessPartner.id ? '#666666' : '#666666'}"
              class="top-item-text ellipsis"
            >{{checkModelInfo.create_time}}</div>
          </div>
          <div class="top-item">
            <div class="top-item-title">已发放数量（张）</div>
            <div
              class="top-item-text ellipsis"
              :style="{fontSize:'18px',color:businessPartner.id ? '#666666' : '#666666'}"
            >{{parseFloat(checkModelInfo.total_bonus) ? checkModelInfo.total_bonus : 0}}</div>
          </div> 
          <div class="top-item">
            <div class="top-item-title">已使用数量（张）</div>
            <div
              class="top-item-text ellipsis"
              :style="{fontSize:'18px',color:businessPartner.id ? '#666666' : '#666666'}"
            >{{parseFloat(checkModelInfo.used_bonus) ? checkModelInfo.used_bonus : 0}}</div>
          </div>
        </div>
        <div class="content-bottom clearfix">
          <div class="bottom-list">
            <div class="bottom-item">
              <div class="bottom-item-left">发券方式：</div>
              <div class="bottom-item-right">
                {{bonus_type_array[checkModelInfo.type]}}
              </div>
            </div>
            <!-- <div class="bottom-item" v-if="user_type == 3">
              <div class="bottom-item-left">特权优惠：</div>
              <div class="bottom-item-right">{{user_discount*10}} 折</div>
            </div> -->
          </div>
          <div class="bottom-list">
            <div class="bottom-item">
              <div class="bottom-item-left">获取条件：</div>
              <div class="bottom-item-right">
                <span v-if="checkModelInfo.type == '1'">新用户消费后送</span>
                <span v-if="checkModelInfo.type == '2'">一次性充值 {{ checkModelInfo.min_amount}} 元</span>
                <span v-if="checkModelInfo.type == '4'">输入兑换码兑换优惠券</span>
                <span v-if="checkModelInfo.type == '5'">按照账号 {{checkModelInfo.tel}} 手动发放</span>
              </div>
            </div>
            <!-- <div class="bottom-item" v-if="user_type == 3">
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
            </div> -->
          </div>
          <div class="bottom-list">
            <div class="bottom-item">
              <div class="bottom-item-left">优惠券类型：</div>
              <div class="bottom-item-right">
                {{coupon_type_array[checkModelInfo.coupon_type]}}
              </div>
            </div>
            <!-- <div class="bottom-item" v-if="user_type == 3">
              <div class="bottom-item-left">操作：</div>
              <div class="bottom-item-right bottom-operate" @click="editUser">修改</div>
            </div> -->
          </div>
          <div class="bottom-list">
            <div class="bottom-item">
              <div class="bottom-item-left">面值：</div>
              <div class="bottom-item-right">
                <span v-if="checkModelInfo.coupon_type == '1'">{{ checkModelInfo.money }} 元</span>
                <span v-if="checkModelInfo.coupon_type == '2'">{{ checkModelInfo.discount}} 折</span>
                <span v-if="checkModelInfo.coupon_type == '3'">{{ checkModelInfo.money}} 度</span>
              </div>
            </div>
          </div>
          <div class="bottom-list">
            <div class="bottom-item">
              <div class="bottom-item-left">数量（张）：</div>
              <div class="bottom-item-right">{{checkModelInfo.count}}</div>
            </div>
          </div>
          <div class="bottom-list">
            <div class="bottom-item">
              <div class="bottom-item-left">使用条件：</div>
              <div class="bottom-item-right">
                <span v-if="checkModelInfo.coupon_type == '1'">应付金额满 {{ checkModelInfo.min_good_amount }} 元可用</span>
                <span v-if="checkModelInfo.coupon_type == '2'">服务费金额满 {{ checkModelInfo.min_good_amount }} 元可用</span>
                <span v-if="checkModelInfo.coupon_type == '3'">充电度数满 {{ checkModelInfo.min_good_amount }} 度可用</span>
              </div>
            </div>
          </div>
          <div class="bottom-list">
            <div class="bottom-item">
              <div class="bottom-item-left">有效期：</div>
              <div class="bottom-item-right">
                <span>领取后 {{ checkModelInfo.exp }} 日内</span>
              </div>
            </div>
          </div>
          <div class="bottom-list bottom-list-station">
            <div class="bottom-item">
              <div class="bottom-item-left bottom-item-left-ac-canuse-station">可用充电站：</div>
              <div class="bottom-item-right"><p>{{checkModelInfo.station_status == '1' ? '全部可用' : checkModelInfo.station_name}}</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="section-container" v-if="IsCouponList"> 
      <div class="section-item-header clearfix">
        <span>已发优惠券列表</span>
      </div>
      <div class="section-main">
        <div class="header-content clearfix header-content-bottom">
          <div class="content-item">
            <div class="header-left">用户账号</div>
            <div class="header-right">
                <el-input class="search-input" v-model="businessPartner.search" placeholder="请输入用户账号" />
            </div>
          </div>
          <div class="content-item">
            <div class="header-left">发券时间</div>
            <div class="header-right">
              <el-date-picker
                v-model="businessPartner.start_time"
                type="date"
                placeholder="选择开始日期"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
              <el-date-picker
                class="end_time"
                v-model="businessPartner.end_time"
                type="date"
                placeholder="选择结束日期"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </div>
          </div>
          <div class="content-item">
            <div class="header-left">使用状态</div>
            <div class="header-right">
              <el-select v-model="businessPartner.status">
                <el-option
                  label="全部"
                  value="all"
                />
                <el-option
                  label="未使用"
                  value="0"
                />
                <el-option
                  label="已使用"
                  value="1"
                />
                <el-option
                  label="已过期"
                  value="2"
                />
                <el-option
                  label="未兑换"
                  value="3"
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
          <div
            class="btn_recovery export-btn"
            @click="billExport"
          ><i class="export-icon"></i>导出兑换码</div>
        </div>
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td">优惠券ID</div>
            <div class="table-td">优惠券兑换码</div>
            <div class="table-td">用户账号</div>
            <div class="table-td">发券时间</div>
            <div class="table-td">到期时间</div>
            <div class="table-td">使用状态</div>
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
              <div class="table-td">
                <div class="td-item">{{consume.id}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{consume.exchange_code}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{consume.user_tel ? consume.user_tel : '--'}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{consume.create_time ? consume.create_time : '--' }}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{consume.exp_time ? consume.exp_time : '--'}}</div>
              </div>
              <div class="table-td table-status" v-if="consume.user_tel == ''">
                <div
                  class="td-item section-no-begin"
                >
                  未兑换
                </div>
              </div>
              <div class="table-td table-status" v-if="consume.user_tel != ''">
                <div
                  class="td-item section-running"
                  v-if="consume.status == 0"
                >
                  {{ status_array[consume.status] }}
                </div>
                <div class="td-item" v-else>
                  {{ status_array[consume.status] }}
                </div>
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
  </section>
</template>

<script>
export default {
  data() {
    return {
      //商业合作
      businessPartner:{
        id:"",
        start_time:'',
        end_time:'',
        search:'',
        status:'',
        status:'all'
      },
      ENV: process.env.NODE_ENV == "development" ? "/api" : "",
      is_export: 0,
      IsCouponList: true,//是否显示 已发优惠券列表
      modelObj: {
        id: this.$route.params.id,
        start: "",
        end: "",
        type: "0"
      },
      bonus_type_array: {
        1: "邀请新用户",
        2: "充值",
        4: "商业合作",
        5: "按照账户发放",
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
      checkModelInfo: {
        type: "2",
        coupon_type: "1",
        min_amount: "0",
        condition: "",
        money: "",
        min_good_amount: "",
        count: "",
        exp: "",
        station_list: [],
        station_status: "2",
      },
      currentPage: 1,
      page_count: 1,
      listLoading: false,
      loading: false,
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
        "9": "充值(子账号)",
        "10": "余额消费(企业主)",
        "11": "消费(企业主)"
      },
      desc_array: {
        "1": "微信充值",
        "2": "支付宝充值",
        "3": "余额消费",
        "4": "账单退款",
        "5": "人工操作",
        "6": "余额分配",
        "7": "提现余额",
        "8": "提现余额失败"
      }
    };
  },
  created() {
    this.getCouponInfo()
    if(this.$route.query.type != '4'){
      this.IsCouponList = false
    }else{
      //商业合作 列表
      this.businessPartner.id = this.$route.query.id
      this.getCouponCodeInfo()
    }
  },
  methods: {
    /*
     导出账单列表
     */
    billExport() {
      if (this.is_export) {
        if (this.tableData.length === 0) {
          this.$sfNotify({
            duration: 0,
            type: "error",
            message: "没有可导出的账单列表"
          });
          return false;
        }
        window.location.href = `${this.ENV}/bonus/export-code?id=${this.businessPartner.id}`;
      } else {
        this.$sfMessage.error("抱歉，当前用户没有操作权限");
      }
    },
    //商业合作详情
    getCouponCodeInfo() {
      this.listLoading = true;
      let that = this;
      this.$api.bonusCheckCodeInfo(that.businessPartner).then(data => {
        this.listLoading = false;
        if (data.code == 1) {
          this.tableData = data.data.list
          that.is_export = data.data.is_export;
          this.checkModelInfo.station_list = data.data.stations
        }
      });
    },
    //编辑
    getCouponInfo() {
      this.listLoading = true;
      let that = this;
      this.$api.bonusCheckInfo({id: this.$route.query.id}).then(data => {
        this.listLoading = false;
        if (data.code == 1) {
          this.checkModelInfo = data.data
          that.is_export = data.is_export;
          this.checkModelInfo.station_list = data.data.stations
        }
      });
    },
    searchStation() {
      this.currentPage = 1;
      this.tableData = [];
      this.getCouponCodeInfo();
    },
    resetSearch() {
      this.businessPartner ={
        id: this.$route.query.id,
        start_time:'',
        end_time:'',
        search:'',
        status:''
      }
      this.currentPage = 1;
      this.page_count = 1;
      this.tableData = [];
      this.getCouponCodeInfo();

    },
    // 点击分页触发
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getCouponCodeInfo();
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../assets/css/activity/checkCoupon.scss";
</style>
