<template>
  <section>
    <div class="section-title">
      <router-link to="/platform/agent">代理商管理</router-link> > 代理商详情
    </div>
    <div class="section-header">
      <div class="section-item-header clearfix">
        <span>基本信息</span>
      </div>
      <div class="header-content clearfix">
        <div class="header-content-inner clearfix">
          <div class="content-item">
            <div class="content-left">成员账号：</div>
            <div class="content-right ellipsis">{{account?account:'--'}}</div>
          </div>
          <div class="content-item">
            <div class="content-left">联系人：</div>
            <div class="content-right ellipsis">{{user_name?user_name:"--"}}</div>
          </div>
          <div class="content-item">
            <div class="content-left">联系电话：</div>
            <div class="content-right ellipsis">{{tel?tel:'--'}}</div>
          </div>
          <div class="content-item">
            <div class="content-left">联系邮箱：</div>
            <div class="content-right ellipsis">{{email?email:'--'}}</div>
          </div>
          <div class="content-item">
            <div class="content-left">成员角色：</div>
            <div class="content-right ellipsis">{{role_name?role_name:'--'}}</div>
          </div>
          <div class="content-item">
            <div class="content-left">类型：</div>
            <div class="content-right ellipsis">{{type_array[type]}}</div>
          </div>
          <div class="content-item">
            <div class="content-left">企业名称：</div>
            <div class="content-right ellipsis">{{company_name?company_name:'--'}}</div>
          </div>
          <div class="content-item">
            <div class="content-left">创建时间：</div>
            <div class="content-right ellipsis">{{create_time?create_time:'--'}}</div>
          </div>
          <div class="content-item">
            <div class="content-left">联系地址：</div>
            <div class="content-right ellipsis">{{address?address:'--'}}</div>
          </div>
        </div>

      </div>
    </div>
    <div class="section-container">
      <div class="section-item-header clearfix">
        <span>关联信息</span>
      </div>
      <div class="section-main">
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td">桩运行编码</div>
            <div class="table-td">桩名称</div>
            <div class="table-td">所属充电站</div>
            <div class="table-td">桩类型</div>
            <div class="table-td">桩在线状态</div>
            <!--<div class="table-td">桩运营状态</div>-->
          </div>
          <div
            class="table-body"
            v-loading="listLoading"
          >
            <div
              class="table-tr"
              v-show="tableData &&tableData.length > 0"
              v-for="(pile_info, index) in tableData"
              :key="index"
            >
              <div class="table-td">
                <div class="td-item">{{pile_info.pile_sn}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{pile_info.pile_name}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{pile_info.station_name}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{pile_type_array[pile_info.pile_type]}}</div>
              </div>
              <div class="table-td table-status">
                <div :class="['td-item',{'td-onlinesection-running':pile_info.online_status == 1}]">
                  <i></i>{{pile_info.online_status == 1?'在线':'离线'}}
                </div>
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
      id: this.$route.params.id,
      currentPage: 1,
      page_count: 10,
      tableData: [],
      listLoading: false,
      account: "",
      user_name: "",
      tel: "",
      email: "",
      role_name: "",
      type: "",
      company_name: "",
      create_time: "",
      address: "",
      pile_type_array: {
        "1": "直流",
        "2": "交流"
      },
      run_status_array: {
        "0": "空闲",
        "1": "准备充电",
        "2": "充电中",
        "3": "充电结束",
        "4": "故障",
        "5": "预约"
      },
      type_array: {
        "1": "个人",
        "2": "国有企业",
        "3": "集体企业",
        "4": "私营企业",
        "5": "其它企业",
        "6": "集团客户"
      }
    };
  },
  created() {
    this.getTableDataList();
  },
  methods: {
    getTableDataList() {
      this.listLoading = true;
      let param = {
        id: this.id,
        page: this.currentPage
      };
      this.$api.roleAgentDetail(param).then(data => {
        this.listLoading = false;
        if (data.code == 1) {
          this.account = data.data.user.account;
          this.user_name = data.data.user.user_name;
          this.tel = data.data.user.tel;
          this.email = data.data.user.email;
          this.role_name = data.data.user.role_name;
          this.type = data.data.user.type;
          this.company_name = data.data.user.company_name;
          this.create_time = data.data.user.create_time;
          this.address = data.data.user.address;
          this.tableData = data.data.pile.list;
          this.currentPage = data.data.pile.current_page;
          this.page_count = data.data.pile.page_total;
        }
      });
    },
    // 点击分页触发
    handleCurrentChange(page) {
      this.currentPage = page;
      this.tableData = [];
      this.getTableDataList();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/platform/ownerDetail.scss";
</style>
