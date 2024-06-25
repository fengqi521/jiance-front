<template>
  <section>
    <div class="section-title">业主分润管理</div>
    <div class="section-header">
      <div class="section-item-router">
        <router-link to="/trad/profit">分润账单</router-link>
        <router-link class="section-act" to="/trad/profit/check">对账单</router-link>
      </div>
      <div class="section-item-header clearfix">
        <span>筛选查询</span>
      </div>
      <div class="header-content clearfix">
        <div class="content-item">
          <div class="header-left">所属业主</div>
          <div class="header-right">
            <el-select v-model="modelObj.owner_id" filterable :disabled="roleType == 3 ? true : false"
              placeholder="请选择">
              <el-option label="全部" value="" v-if="roleType != 3">
              </el-option>
              <el-option v-for="(item, index) in ownerList" :key="index" style="width:148px;" :label="item.account"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="content-item">
          <div class="header-left">生成时间</div>
          <div class="header-right">
            <el-date-picker v-model="modelObj.start" type="date" placeholder="选择开始日期" value-format="yyyy-MM-dd">
            </el-date-picker>
            <el-date-picker class="end-time" v-model="modelObj.end" type="date" placeholder="选择结束日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </div>
        </div>
        <div class="content-item">
          <div class="btn_succ" @click="searchPile()">查询</div>
          <div class="btn_cancel" @click="resetSearch()">重置</div>
        </div>
      </div>
    </div>
    <div class="section-container">
      <div class="section-item-header clearfix">
        <span>对账单列表</span>
        <div class="btn_recovery export-btn" @click="statementsExport">
          <i class="export-icon"></i>导出
        </div>
      </div>
      <div class="section-main">
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td">对账单流水号</div>
            <div class="table-td">所属业主</div>
            <div class="table-td">账单生成时间</div>
            <div class="table-td">对账单操作人</div>
            <div class="table-td">对账金额（元）</div>
            <div class="table-td">分润操作人</div>
            <div class="table-td">分润操作时间</div>
            <div class="table-td">分润状态</div>
            <div class="table-td">操作</div>
          </div>
          <div class="table-body" v-loading="listLoading">
            <div class="table-tr" v-show="tableData && tableData.length > 0" v-for="(check, index) in tableData"
              :key="index">
              <div class="table-td">
                <div class="td-item">{{check.statement_id}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{check.account?check.account:'--'}}</div>
              </div>
              <div class="table-td">
                <div class="td-item td-time">{{check.create_time}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{check.op_user || '--'}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{ check.total_amount }}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{check.check_user || '--'}}</div>
              </div>
              <div class="table-td">
                <div class="td-item td-time">{{check.operate_time || '--'}}</div>
              </div>
              <div class="table-td table-status">
                <div class="td-item btn_unfinish" v-if="check.status == 1" @click="changeBillStatus(check)">分润</div>
                <div class="td-item btn_already" v-else>已分润</div>
              </div>
              <div class="table-td table-operate">
                <el-tooltip content="查看" placement="top">
                  <router-link
                    :to="`/trad/profit/check/detail?serial=${check.statement_id}&start=${modelObj.start}&end=${modelObj.end}`"
                    class="td-item see-icon"></router-link>
                </el-tooltip>
                <el-tooltip content="导出" placement="top">
                  <div class="td-item export-icon" @click="downloadDetail(check.statement_id)"></div>
                </el-tooltip>
              </div>
            </div>
            <div v-if="!tableData || tableData.length === 0" class="table-tr unData">
              <img :src="require('assets/img/unData.png')">
              <span>暂无数据</span>
            </div>
          </div>
          <!-- 分页 -->
          <sf-pagination v-if="tableData && tableData.length > 0" :currentPage="currentPage" :page-count="page_count"
            @current-change="handleCurrentChange" />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      modelObj: {
        owner_id: '',
        start: '',
        end: ''
      },
      currentPage: 1,
      page_count: 1,
      tableData: [],
      listLoading: false,
      ENV: process.env.NODE_ENV == 'development' ? '/api' : '',
      ownerList: [],
      roleType: this.$store.state.user.roleType,
      is_export: 0
    }
  },
  created() {
    // this.getMonthDay();
    this.getTableDataList()
    this.getOwnersList()
  },
  methods: {
    getOwnersList() {
      var _this = this
      var params = {
        search: _this.words
      }
      this.$api.pileOwners(params).then((res) => {
        if (res.code == 1) {
          this.ownerList = res.data
          if (this.ownerList.length > 0 && this.roleType == 3) {
            this.modelObj.owner_id = this.ownerList[0].id
          }
        }
      })
    },
    getTableDataList() {
      this.listLoading = true
      this.modelObj.page = this.currentPage
      this.$api.profitStatements(this.modelObj).then((data) => {
        this.listLoading = false
        if (data.code == 1) {
          this.tableData = data.data.list
          this.currentPage = data.data.current_page
          this.page_count = data.data.page_total
          this.is_export = data.data.is_export
        }
      })
    },
    searchPile() {
      this.currentPage = 1
      this.tableData = []
      this.getTableDataList()
    },
    resetSearch() {
      this.modelObj.account = ''
      this.modelObj.start = ''
      this.modelObj.end = ''
      this.currentPage = 1
      this.page_count = 1
      this.tableData = []
      this.getTableDataList()
    },
    // 点击分页触发
    handleCurrentChange(page) {
      this.currentPage = page
      this.tableData = []
      this.getTableDataList()
    },
    downloadDetail(serial) {
      if (this.is_export) {
        window.location.href = `${this.ENV}/profit/export?serial=${serial}`
      } else {
        this.$sfMessage.error('抱歉，当前用户没有操作权限')
      }
    },
    // getMonthDay() {
    //   var date = new Date();
    //   var end_date = this.$utils.formatDate(date, "yyyy-MM-dd");
    //   this.modelObj.end = end_date;
    //   date.setDate(1);
    //   var _date = this.$utils.formatDate(date, "yyyy-MM-dd");
    //   this.modelObj.start = _date;
    // },
    changeBillStatus(item) {
      var params = {
        id: item.id
      }
      this.$api.profitChangeSetStatus(params).then((res) => {
        if (res.code == 1) {
          this.$sfNotify({
            message: '操作成功'
          })
          this.getTableDataList()
        } else {
          this.$sfNotify({
            type: 'error',
            message: '系统异常，请稍后重试'
          })
        }
      })
    },
    // 导出对账单
    statementsExport() {
      if (this.is_export) {
        if (!this.tableData.length) {
          this.$sfNotify({
            duration: 0,
            type: 'error',
            message: '没有可导出的对账单列表'
          })
          return false
        }
        window.location.href = `${this.ENV}/profit/statements?start=${this.modelObj.start}&end=${this.modelObj.end}&owner_id=${this.modelObj.owner_id}&export=1`
      } else {
        this.$sfMessage.error('抱歉，当前用户没有操作权限')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/css/trad/check.scss';
</style>
