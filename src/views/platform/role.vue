<template>
  <section>
    <div class="section-title">角色管理</div>
    <div class="section-header">
      <div class="section-item-header clearfix">
        <span>筛选查询</span>
      </div>
      <div class="header-content clearfix">
        <div class="content-item">
          <div class="header-left">角色名称</div>
          <div class="header-right">
            <el-input
              class="search-input"
              v-model="search_input"
              placeholder="输入角色名称"
            />
          </div>
        </div>
        <div class="content-item">
          <div class="header-left">角色类型</div>
          <div class="header-right">
            <el-select v-model="role_status">
              <el-option
                label="全部"
                value=""
              />
              <el-option
                      label="运营成员"
                      value="1"
              />
              <el-option
                      label="大客户"
                      value="2"
              />
              <el-option
                      label="业主"
                      value="3"
              />
              <el-option
                      label="代理商"
                      value="4"
              />
              <el-option
                      label="运维成员"
                      value="5"
              />
            </el-select>
          </div>
        </div>
        <div class="content-item">
          <div
            class="btn_succ"
            @click="searchRole()"
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
        <span>角色列表</span>
        <span class="btn_succ add-station" @click="handleAdd(0)">
          <img :src="require('assets/img/add-station.png')">
          添加角色</span>
      </div>
      <div class="section-main">
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td">角色名称</div>
            <div class="table-td">角色类型</div>
            <div class="table-td">创建时间</div>
            <div class="table-td">最近修改时间</div>
            <div class="table-td">操作</div>
          </div>
          <div
            class="table-body"
            v-loading="listLoading"
          >
            <div
              v-show="role_list && role_list.length"
              class="table-tr"
              v-for="(role,index) in role_list"
              :key="index"
            >
              <div class="table-td table-name">
                <div class="td-item">{{ role.role_name }}</div>
              </div>
              <div class="table-td table-name">
                <div class="td-item">{{ role.c_type }}</div>
              </div>
              <div class="table-td table-name">
                <div class="td-item">{{ role.c_time }}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{ role.u_time }}</div>
              </div>
              <div class="table-td table-operate">
                <el-tooltip
                  content="查看"
                  placement="top"
                >
                  <div class="td-item see-icon" @click="handleDetail(role.id)"></div>
                </el-tooltip>
                <el-tooltip
                  content="删除"
                  placement="top"
                >
                  <div class="td-item delete-icon"
                       @click="delRole(role.id)"
                  ></div>
                </el-tooltip>

              </div>
            </div>
            <div
              v-if="!role_list || role_list.length == 0"
              class="table-tr unData"
            >
              <img :src="require('assets/img/unData.png')">
              <span>暂无数据</span>
            </div>
          </div>
          <!-- 分页 -->
          <sf-pagination
            v-if="role_list && role_list.length"
            :currentPage="currentPage"
            :page-count="page_count"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>

    <!-- 删除 -->
    <sf-modelBox
      :showModel.sync="showDelete"
      title="删除确认"
      type="delete"
      @change="saveDeleteSure"
    >
      <p>是否确定删除此角色？</p>
    </sf-modelBox>
  </section>
</template>

<script>
export default {
  data() {
    return {
      search_input: "",
      role_status: "",
      currentPage: 1,
      page_count: 1,
      limit: 10,
      listLoading: false,
      role_list: [],
      showDelete: false,
      delete_id: "",
    };
  },
  created() {
    this.getConfig();
  },
  methods: {
    delRole(id) {
      this.showDelete = true;
      this.delete_id = id;
    },
    // 确认删除
    saveDeleteSure() {
      this.$api.roleDelete({id: this.delete_id}).then(data => {
        this.delete_id = "";
        this.showDelete = false;
        if (data.code == 1) {
          this.$sfNotify({
            message: "成功"
          });
          setTimeout(this.getConfig, 1500);
        } else {
          this.$sfNotify({
            duration: 0,
            type: "error",
            message: data.message,
          });
        }
      });
    },
    getConfig() {
      this.listLoading = true;
      let pars = {
        page: this.currentPage,
        limit: this.limit,
        type: this.role_status,
        role_name: this.search_input
      };
      this.$api.roleList(pars).then(data => {
        this.listLoading = false;
        if (data.code == 1) {
          this.role_list = data.data.list;
          this.currentPage = data.data.current_page;
          this.page_count = data.data.page_total;
        }
      });
    },
    searchRole() {
      this.currentPage = 1;
      this.getConfig();
    },
    resetSearch() {
      this.search_input = "";
      this.role_status = "";
      this.currentPage = 1;
      this.page_count = 1;
      this.role_list = [];
      this.getConfig();
    },
    // 点击分页触发
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getConfig();
    },
    handleAdd(){
      this.$router.push(`/platform/role/add`)
    },
    handleDetail(id){
      this.$router.push(`/platform/role/detail/${id}`)
    }
  }
};
</script>

<style scoped lang="scss" scoped>
@import "../../assets/css/platform/role.scss";
</style>
