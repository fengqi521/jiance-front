<template>
  <section>
    <div class="section-title">代理商</div>
    <div class="section-tips">
      <i class="warning-icon"></i>
      <span class="tips-text">注意：代理商是站的拥有者，代理商账号可以登录运营平台，管理有权限的站，可自己添加站进行管理。</span>
    </div>
    <div class="section-header">
      <div class="section-item-header clearfix">
        <span>筛选查询</span>
      </div>
      <div class="header-content clearfix">
        <div class="content-item">
          <div class="header-left">代理商</div>
          <div class="header-right">
            <el-input class="search-input" v-model="modelObj.account" placeholder="输入成员账号" />
          </div>
        </div>
        <div class="content-item">
          <div class="header-left">角色名称</div>
          <div class="header-right">
            <el-select v-model="modelObj.role_id">
              <el-option v-for="(role, index) in role_names" :key="index" style="width:148px;" :label="role.role_name"
                :value="role.id" />
            </el-select>
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
        <span>成员列表</span>
        <div class="btn_succ add-coupon" @click="handleAdd">
          <i class="add-station"></i>添加代理商
        </div>
      </div>
      <div class="section-main">
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td">代理商账号</div>
            <div class="table-td">代理商类型</div>
            <div class="table-td">充值转账手续费费率（%）</div>
            <div class="table-td">联系人</div>
            <div class="table-td">联系电话</div>
            <div class="table-td">角色名称</div>
            <div class="table-td">创建时间</div>
            <div class="table-td" style="min-width:180px;">操作</div>
          </div>
          <div class="table-body" v-loading="listLoading">
            <div class="table-tr" v-show="tableData && tableData.length > 0" v-for="(owner, i) in tableData" :key="i">
              <div class="table-td">
                <div class="td-item">{{ owner.account }}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{ type_array[owner.type] }}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{ owner.ratio || '--' }}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{ owner.user_name }}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{ owner.tel }}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{ owner.role_name }}</div>
              </div>
              <div class="table-td">
                <div class="td-item td-time">{{ owner.create_time }}</div>
              </div>
              <div class="table-td table-operate" style="min-width:180px;">
                <el-tooltip content="查看" placement="top">
                  <router-link :to="`/platform/agent/detail/${owner.id}`" class="td-item see-icon"></router-link>
                </el-tooltip>
                <el-tooltip content="编辑" placement="top">
                  <router-link :to="`/platform/agent/edit/${owner.id}`" class="td-item edit-icon"></router-link>
                </el-tooltip>
                <el-tooltip content="关联站" placement="top">
                  <router-link class="td-item connect-icon"
                    :to="`/platform/agent/assign/${owner.id}/${owner.account}`"></router-link>
                </el-tooltip>
                <el-tooltip content="关联银行卡" placement="top">
                  <router-link class="td-item connect-icon" :to="`/platform/agent/collect/${owner.id}`"></router-link>
                </el-tooltip>
                <el-tooltip content="费率配置" placement="top">
                  <router-link class="td-item icon config-icon"
                    :to="`/platform/agent/config/${owner.ratio ? 'edit' : 'add'}/${owner.id}`"></router-link>
                </el-tooltip>
              </div>
            </div>
            <div v-if="!tableData || tableData.length == 0" class="table-tr unData">
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

    <!-- 删除 -->
    <sf-modelBox :showModel.sync="showDelete" title="删除确认" type="delete" @change="saveDeleteSure">
      <p>是否确定删除成员？</p>
    </sf-modelBox>
  </section>
</template>

<script>
export default {
  data () {
    return {
      modelObj: {
        account: "",
        role_id: ""
      },
      currentPage: 1,
      page_count: 1,
      tableData: [],
      role_names: [{ "role_name": "全部", "id": "" }],
      listLoading: false,
      type_array: {
        "1": "个人",
        "2": "国有企业",
        "3": "集体企业",
        "4": "私营企业",
        "5": "其它企业",
        "6": "集团客户",
      },
      showDelete: false,
      delete_id: "",
    };
  },
  created () {
    this.getAllRoleName();
    this.getTableDataList();
  },
  methods: {
    delItem (id) {
      this.showDelete = true;
      this.delete_id = id;
    },
    // 确认删除
    saveDeleteSure () {
      this.$api.roleDelAgent({ id: this.delete_id }).then(data => {
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
            message: data.message
          });
        }
      });
    },
    getAllRoleName () {
      this.$api.roleRoleName({ type: 4 }).then(data => {
        if (data.code == 1) {
          this.role_names = this.role_names.concat(data.data);
        }
      });
    },
    getTableDataList () {
      this.listLoading = true;
      this.modelObj.page = this.currentPage;
      this.$api.roleAgents(this.modelObj).then(data => {
        this.listLoading = false;
        if (data.code == 1) {
          this.tableData = data.data.list;
          this.currentPage = data.data.current_page;
          this.page_count = data.data.page_total;
        }
      });
    },
    searchPile () {
      this.currentPage = 1;
      this.tableData = [];
      this.getTableDataList();
    },
    resetSearch () {
      this.modelObj.account = "";
      this.modelObj.role_id = "";
      this.currentPage = 1;
      this.page_count = 1;
      this.tableData = [];
      this.getTableDataList();
    },
    // 点击分页触发
    handleCurrentChange (page) {
      this.currentPage = page;
      this.tableData = [];
      this.getTableDataList();
    },
    handleAdd () {
      this.$router.push(`/platform/agent/add`)
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/platform/owner.scss";
</style>
