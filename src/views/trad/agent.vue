<template>
  <section>
    <div class="section-title">代理商分润管理</div>
    <div class="section-header">
      <div class="section-item-router">
        <router-link to="/trad/agent" class="section-act">分润规则</router-link>
        <router-link to="/trad/agent/check">分润信息</router-link>
      </div>
      <div class="section-item-header clearfix">
        <span>筛选查询</span>
      </div>
      <div class="header-content clearfix">
        <div class="content-item">
          <div class="header-left">代理商账号</div>
          <div class="header-right">
            <el-select
              v-model="modelObj.user_id"
              filterable
              placeholder="请选择"
            >
              <el-option label="全部" value="all" />
              <el-option
                v-for="(item, index) in dropList"
                :key="index"
                style="width: 148px"
                :label="item.account"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="content-item">
          <div class="header-left">状态</div>
          <div class="header-right">
            <el-select v-model="modelObj.status">
              <el-option label="全部" value="all" />
              <el-option label="关闭" value="0" />
              <el-option label="开启" value="1" />
            </el-select>
          </div>
        </div>
        <div class="content-item">
          <div class="btn_succ" @click="search()">查询</div>
          <div class="btn_cancel" @click="resetSearch()">重置</div>
        </div>
      </div>
    </div>
    <div class="section-container">
      <div class="section-item-header clearfix">
        <span>分润规则列表</span>
        <div class="btn_succ add-btn" @click="addRule()"><i></i>添加规则</div>
        <!-- <div
          class="btn_recovery export-btn"
          @click="generateCheck()"
        ><i class="export-icon"></i>生成对账单</div> -->
      </div>
      <div class="section-main">
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td">代理商账号</div>
            <div class="table-td">分润时间</div>
            <div class="table-td">电费分润费率</div>
            <div class="table-td">服务费分润费率</div>
            <div class="table-td">分润周期</div>
            <div class="table-td table-column__1">分润站点</div>
            <div class="table-td">
              状态
              <el-tooltip content="" placement="top">
                <div slot="content" style="line-height: 18px; width: 200px">
                  开启后将按照规则定时分润<br />关闭后规则失效
                </div>
                <div class="tips-icon" style="position: static"></div>
              </el-tooltip>
            </div>
            <div class="table-td">操作</div>
          </div>
          <div class="table-body" v-loading="listLoading">
            <div
              class="table-tr"
              v-show="tableData && tableData.length > 0"
              v-for="(profit, index) in tableData"
              :key="index"
            >
              <div class="table-td">
                <div class="td-item">{{ profit.account }}</div>
              </div>
              <div class="table-td">
                <div class="td-item">T+{{ profit.separation_time }} 11:00</div>
              </div>
              <div class="table-td">
                <div class="td-item">
                  {{
                    profit.separation_rate_elec
                      ? profit.separation_rate_elec
                      : "--"
                  }}%
                </div>
              </div>
              <div class="table-td">
                <div class="td-item td-time">
                  {{
                    profit.separation_rate_service
                      ? profit.separation_rate_service
                      : "--"
                  }}%
                </div>
              </div>
              <div class="table-td">
                <div class="td-item td-time">
                  {{ profit.start_time }}<br />{{ profit.end_time }}
                </div>
              </div>
              <div class="table-td table-column__1">
                <el-tooltip
                  :content="profit.stations_str"
                  :disabled="profit.stations_str ? false : true"
                  placement="top"
                >
                  <div
                    class="td-item"
                    style="max-height: 110px; overflow: hidden"
                  >
                    {{ profit.stations_str | ellipsis }}
                  </div>
                </el-tooltip>
              </div>
              <div class="table-td" style="min-width: 98px">
                <div
                  :class="['knob', profit.status == 1 ? 'started' : '']"
                  @click="sureOpenStatus(profit)"
                ></div>
                <div class="knob-text" style="margin-left: 8px">
                  {{ profit.status == 1 ? "开启" : "关闭" }}
                </div>
              </div>
              <div class="table-td table-operate">
                <el-tooltip
                  :class="[
                    'td-item edit-icon',
                    profit.status == '0' ? '' : 'edit-icon-disable',
                  ]"
                  :content="
                    profit.status == '0' ? '编辑' : '开启状态下不可编辑'
                  "
                  placement="top"
                >
                  <router-link
                    :to="
                      profit.status == '0'
                        ? {
                            path: '/trad/agent/add',
                            query: { id: `${profit.id}` },
                          }
                        : ''
                    "
                    :class="[
                      'td-item edit-icon',
                      profit.status == '0' ? '' : 'team-not-edit',
                    ]"
                  ></router-link>
                </el-tooltip>
                <el-tooltip
                  :class="[
                    'td-item edit-icon',
                    profit.status == '0' ? '' : 'edit-icon-disable',
                  ]"
                  :content="
                    profit.status == '0' ? '删除' : '开启状态下不可删除'
                  "
                  placement="top"
                >
                  <div
                    :class="[
                      'td-item delete-icon',
                      profit.status == '0' ? '' : 'delete-disabled-icon',
                    ]"
                    @click="delItem(profit.id, profit.status)"
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
    <!-- 状态开启确认 -->
    <sf-modelBox
      :showModel.sync="openStatus"
      title="状态开启确认"
      @change="changeStatus"
    >
      <p>确认要开启此账号分润规则吗？开启后将按规则执行。</p>
    </sf-modelBox>
    <!-- 状态关闭确认 -->
    <sf-modelBox
      :showModel.sync="closeStatus"
      title="状态关闭确认"
      @change="changeStatus"
    >
      <p>确认要关闭此分润规则吗？关闭后此条规则不再执行。</p>
    </sf-modelBox>
    <!-- 删除 -->
    <sf-modelBox
      :showModel.sync="showDelete"
      title="删除确认"
      type="delete"
      @change="saveDeleteSure"
    >
      <p>确认要删除此分润规则吗？删除后此条规则不再执行。</p>
    </sf-modelBox>
    <!-- 不可以删除 -->
  </section>
</template>

<script>
export default {
  data() {
    return {
      openStatus: false,
      closeStatus: false,
      valueStatus: {},

      showDelete: false,
      delete_id: "",

      search_account: "",
      modelObj: {
        user_id: "all",
        status: "all",
      },
      currentPage: 1,
      page_count: 1,
      tableData: [],
      listLoading: false,
      dropList: [],
      roleType: this.$store.state.user.roleType,
      is_export: 0,
    };
  },
  filters: {
    ellipsis(value) {
      if (!value) return "--";
      if (value.length > 40) {
        return value.slice(0, 44) + "...";
      }
      return value;
    },
  },
  created() {
    this.getDropList();
    this.getTableDataList();
  },
  methods: {
    addRule() {
      this.$router.push({ path: "/trad/agent/add" });
    },
    getDropList() {
      var params = {
        type: "1",
      };
      this.$api.profitListDrop(params).then((res) => {
        if (res.code == 1) {
          this.dropList = res.data;
        }
      });
    },

    getTableDataList() {
      this.listLoading = true;
      this.modelObj.page = this.currentPage;
      this.$api.profitRules(this.modelObj).then((data) => {
        this.listLoading = false;
        if (data.code == 1) {
          this.tableData = data.data.list;
          this.currentPage = data.data.current_page;
          this.page_count = data.data.page_total;
          // this.is_export = data.data.is_export;
        }
      });
    },

    sureOpenStatus(item) {
      this.valueStatus = item;
      if (item.status == 0) {
        this.openStatus = true;
      } else {
        this.closeStatus = true;
      }
    },

    changeStatus() {
      let status = this.valueStatus.status == 1 ? 0 : 1;
      this.$api
        .profitChangeStatus({ id: this.valueStatus.id, status: status })
        .then((data) => {
          if (data.code == 1) {
            this.$sfNotify({
              message: "成功",
            });
            this.openStatus = false;
            this.closeStatus = false;
            this.getTableDataList();
          } else {
            this.$sfNotify({
              duration: 0,
              type: "error",
              message: data.message,
            });
          }
        });
    },
    delItem(id, del) {
      this.delete_id = id;
      if (del != 1) {
        this.showDelete = true;
      }
    },
    saveDeleteSure() {
      this.$api.profitDelList({ id: this.delete_id }).then((data) => {
        this.showDelete = false;
        if (data.code == 1) {
          this.$sfNotify({
            message: "成功",
          });
          setTimeout(this.getTableDataList, 1500);
        } else {
          this.$sfNotify({
            duration: 0,
            type: "error",
            message: "失败",
          });
        }
      });
    },

    search() {
      this.search_account = this.modelObj.account;
      this.currentPage = 1;
      this.getTableDataList();
    },
    resetSearch() {
      this.search_account = "";
      this.modelObj = {
        user_id: "all",
        status: "all",
      };
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
    // generateCheck() {
    //   if (this.is_export) {
    //     if (this.tableData.length  == 0) {
    //       this.$sfNotify({
    //         type: "error",
    //         message: "暂无可生成的对账单"
    //       });
    //       return false;
    //     }
    //     this.modelObj.account = this.search_account;
    //     this.$api.benefitGenerate(this.modelObj).then(data => {
    //       if (data.code == 1) {
    //         // 成功
    //         this.$sfNotify({
    //           message: "成功"
    //         });
    //         this.getTableDataList();
    //       } else {
    //         this.$sfNotify({
    //           duration: 0,
    //           type: "error",
    //           message: "失败"
    //         });
    //       }
    //     });
    //   } else {
    //     this.$sfMessage.error("抱歉，当前用户没有操作权限");
    //   }
    // },
  },
};
</script>
<style lang="scss">
.el-tooltip__popper.is-dark {
  max-width: 160px;
}
</style>
<style lang="scss" scoped>
@import "../../assets/css/trad/agent.scss";
</style>
