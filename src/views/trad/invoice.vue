<template>
  <section>
    <div class="section-title">发票管理</div>
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
              label="用户账号"
              value="2"
            />
            <el-option
              label="发票抬头"
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
          <div class="header-left">申请时间</div>
          <div class="header-right">
            <el-date-picker
              v-model="modelObj.start"
              type="date"
              placeholder="选择开始日期"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
            <el-date-picker
              class="end-time"
              v-model="modelObj.end"
              type="date"
              placeholder="选择结束日期"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </div>
        </div>
        <div class="content-item">
          <div class="header-left">发票状态</div>
          <div class="header-right">
            <el-select v-model="modelObj.is_finish">
              <el-option
                label="全部"
                value=""
              />
              <el-option
                label="待开票"
                value="1"
              />
              <el-option
                label="已开票"
                value="2"
              />
              <el-option
                label="开票失败"
                value="-1"
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
        <span>发票列表</span>
      </div>
      <div class="section-main">
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td">申请时间</div>
            <div class="table-td">用户ID</div>
            <div class="table-td">用户账号</div>
            <div class="table-td">抬头类型</div>
            <div class="table-td">发票抬头</div>
            <div class="table-td">发票金额（元）</div>
            <div class="table-td">操作者</div>
            <div class="table-td">开票时间</div>
            <div class="table-td">操作</div>
          </div>
          <div
            class="table-body"
            v-loading="listLoading"
          >
            <div
              class="table-tr"
              v-show="tableData &&tableData.length > 0"
              v-for="(invoice, index) in tableData"
              :key="index"
            >
              <div class="table-td">
                <div class="td-item hover-green"><router-link :to="`/trad/invoice/detail/${invoice.id}`">{{invoice.create_time}}</router-link></div>
                </div>
              <div class="table-td">
                <div class="td-item">{{invoice.user_id}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{invoice.account?invoice.account:'--'}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{title_type_array[invoice.title_type]}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{invoice.invoice_title}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{invoice.invoice_amount}}</div>
              </div>
              <div class="table-td">
                <div class="td-item" v-if="invoice.status == 1">--</div>
                <div class="td-item" v-else>{{invoice.operator}}</div>
              </div>
              <div class="table-td">
                <div class="td-item td-time" v-if="invoice.status == 2">{{invoice.invoiced_time}}</div>
                <div class="td-item td-time" v-else>--</div>
              </div>
              <div class="table-td table-status" v-if="invoice.invoice_type == 1">
                <div
                  class="td-item btn_unfinish"
                  v-if="invoice.status == 1"
                  @click="sendInvoice(invoice.id, index)"
                >待开票</div>
                <div
                  class="td-item btn_already"
                  v-else-if="invoice.status == 2"
                >已开票</div>
                <div
                  class="td-item btn_already"
                  v-else
                >开票失败</div>
              </div>
              <div class="table-td table-status" v-else>
                <div
                        class="td-item btn_already"
                        v-if="invoice.status == 1"
                >待开票</div>
                <div
                        class="td-item btn_already"
                        v-else-if="invoice.status == 2"
                >已开票</div>
                <div
                        class="td-item btn_already"
                        v-else
                >开票失败</div>
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
  </section>
</template>

<script>
export default {
  data() {
    return {
      modelObj: {
        sea_type: "2",
        search: "",
        start: "",
        end: "",
        is_finish: ""
      },
      pay_type: 2,
      currentPage: 1,
      page_count: 1,
      tableData: [],
      listLoading: false,
      title_type_array: {
        "1": "企业",
        "2": "个人"
      },
      sendLoading: false,
    };
  },
  created() {
    this.getTableDataList();
  },
  methods: {
    getTableDataList() {
      this.listLoading = true;
      this.modelObj.page = this.currentPage;
      this.$api.invoiceInvoices(this.modelObj).then(data => {
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
      this.modelObj.sea_type = "1";
      this.modelObj.search = "";
      this.modelObj.start = "";
      this.modelObj.end = "";
      this.modelObj.is_finish = "";
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
    sendInvoice(id, index) {
      this.listLoading = true;
      this.$api.invoiceSend({ id: id }).then(data => {
        this.listLoading = false;
        if (data.code == 1) {
          this.$sfNotify({
            message: "成功"
          });
          this.currentPage = 1;
          this.getTableDataList();
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
@import "../../assets/css/trad/invoice.scss";
</style>
