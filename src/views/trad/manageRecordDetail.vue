<template>
  <section class="coupon-ac-ma">
    <div class="section-title">
      <router-link to="/trad/manage">分润管理</router-link> 
      <router-link to="/trad/manage/record"> > 分润记录</router-link>
       > 分润详情
    </div>
     <div class="section-amount" v-loading="top_loading">
      <div class="amount-right">
        <div class="amount-item-inner clearfix">
          <div class="amount-item">
            <div class="amount-item-title">分润时间</div>
            <p class="amount-item-text">
              <span>{{top_info.create_time}}</span>
            </p>
          </div>
          <div class="amount-item">
            <div class="amount-item-title">分润总金额（元）</div>
            <p class="amount-item-text">
              <span>{{top_info.profit_money}}</span>
            </p>
          </div>
          <div class="amount-item amount-item-specical">
            <div class="amount-item-special-title">
              <span>电费分润费率</span>
              <span>服务费分润费率</span>
            </div>
            <div
              class="amount-item-text amount-item-special-title"
              style="margin-left: 12px"
            >
              <span>{{ top_info.profit_rate_elec || "--" }}%</span>
              <span>{{ top_info.profit_rate_service || "--" }}%</span>
            </div>
            <div class="amount-rule" @click="handleRule"> 查看分润规则</div>
          </div>
        </div>
      </div>
    </div>
    <div class="section-container">
      <div class="section-item-header clearfix">
            <span>分润详情列表</span>
        <div class="btn_recovery export-btn" @click="generateCheck()">
          <i class="export-icon"></i>导出对账
        </div>
      </div>
      <div class="section-main">
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td">账单编号</div>
            <div class="table-td">所属充电站</div>
            <div class="table-td">支付金额（元）</div>
            <div class="table-td">电费（元）</div>
            <div class="table-td">服务费（元）</div>
            <div class="table-td">分润总金额（元）</div>
          </div>
          <div
            class="table-body"
            v-loading="listLoading"
          >
            <div
              class="table-tr"
              v-show="tableData && tableData.length > 0"
              v-for="(preferential_info, index) in tableData"
              :key="index"
            >
            <div class="table-td">
                <div class="td-item">{{preferential_info.out_trade_id}}</div>
              </div>
              <div class="table-td">
                <el-tooltip
                  :content="preferential_info.station_name"
                  :disabled="preferential_info.station_name ? false : true"
                  placement="top"
                >
                  <div
                    class="td-item"
                    style="max-height: 110px; overflow: hidden"
                  >
                    {{ preferential_info.station_name | ellipsis }}
                  </div>
                </el-tooltip>
              </div>
              <div class="table-td">
                <div class="td-item">{{preferential_info.real_amount}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{preferential_info.elec_amount}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{preferential_info.service_amount}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{preferential_info.profit_money}}</div>
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
      title="分润规则"
    >
      <div class="box-main">
        <div class="list">
            <div class="left">分润时间：</div>
            <div class="right">T+1  11：00    </div>
        </div>
        <div class="list">
            <div class="left">分润费率：</div>
          <div class="right">
            <div>
              <span>电费 :</span>
              <span>{{ top_info.profit_rate_elec }}%</span>
            </div>
            <div>
              <span>服务费 :</span>
              <span>{{ top_info.profit_rate_service }}%</span>
            </div>
          </div>
        </div>
        <div class="list">
            <div class="left">分润站点：</div>
          <div class="right">
            {{ top_info.stations_str ? top_info.stations_str : "--" }}
          </div>
        </div>
        <div class="list">
            <div class="left">分润周期：</div>
            <div class="right">{{top_info.start_time}} 至 {{top_info.end_time}}  </div>
        </div>
      </div>
    </sf-messageBox>
  </section>
</template>

<script>
export default {
  data() {
    return {
      top_loading:false,
      top_info:{
        create_time:'',
        profit_money:'',
        profit_rate:'',
        stations_str:'',
        start_time:'',
        end_time: '',
        profit_rate_elec: '',
        profit_rate_service: ''
      },
      is_export: 1,
      showPermission: false,
      modelObj: {
        id : this.$route.query.id
      },
      ENV: process.env.NODE_ENV == "development" ? "/api" : "",
      currentPage: 1,
      page_count: 1,
      tableData: [],
      listLoading: false,

    };
  },
  filters: {
    ellipsis (value) {
      if (!value) return '--'
      if (value.length > 40) {
        return value.slice(0,44) + '...'
      }
      return value
    },
  },
  created() {
    this.getDetailTop()
    this.getTableDataList();
  },
  methods: {
    getDetailTop(){
      this.top_loading = true;
      this.$api.profitRecordDetailTop({id:this.modelObj.id}).then(data =>{
        this.top_loading = false;
        if(data.code == 1){
          this.top_info.create_time = data.data.create_time
          this.top_info.profit_money = data.data.profit_money
          this.top_info.profit_rate = data.data.profit_rate
          this.top_info.stations_str = data.data.station_name
          this.top_info.start_time = data.data.start_time
          this.top_info.end_time = data.data.end_time;
          this.top_info.profit_rate_elec = data.data.profit_rate_elec;
          this.top_info.profit_rate_service = data.data.profit_rate_service
        }
      })
    },
    getTableDataList() {
      this.listLoading = true;
      this.modelObj.page = this.currentPage;
      this.$api.profitRecordDetailList(this.modelObj).then(data => {
        this.listLoading = false;
        if (data.code == 1) {
          this.tableData = data.data.list;
          this.currentPage = data.data.current_page;
          this.page_count = data.data.page_total;
          // this.is_export = data.data.is_export;
        }
      });
    },
     generateCheck() {
      if (this.is_export) {
        if (this.tableData.length  == 0) {
          this.$sfNotify({
            type: "error",
            message: "暂无可生成的对账单"
          });
          return false;
        }
        window.location.href = `${this.ENV}/profit/export-agent?id=${this.modelObj.id}`;
      } else {
        this.$sfMessage.error("抱歉，当前用户没有操作权限");
      }
    },
    handleRule(){
        this.showPermission = true;
    },
    // 点击分页触发
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getTableDataList();
    },
   
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/trad/manageRecordDetail.scss";
</style>
