<template>
  <section>
    <div class="section-title">组队活动管理</div>
    <div class="section-header header-content-team">
      <div class="section-item-header clearfix">
        <span>筛选查询</span>
      </div>
      <div class="header-content clearfix">
        <div class="content-item">
          <div class="header-left">创建时间</div>
          <div class="header-right">
            <el-date-picker
              class="end-time"
              v-model="modelObj.start_time"
              type="datetime"
              placeholder="选择开始日期"
              value-format="yyyy-MM-dd HH:mm"
              format="yyyy-MM-dd HH:mm"
            >
            </el-date-picker>
            <el-date-picker
              class="end-time"
              v-model="modelObj.end_time"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm"
              format="yyyy-MM-dd HH:mm"
              placeholder="选择结束日期"
            >
            </el-date-picker>
          </div>
        </div>
        <div class="content-item">
          <div class="header-left">活动名称</div>
          <div class="header-right">
            <el-input
              class="search-input"
              v-model="modelObj.search"
              placeholder="关键字搜索"
            />
          </div>
        </div>
        <div class="content-item">
          <div class="header-left">状态</div>
          <div class="header-right">
            <el-select v-model="modelObj.status">
              <el-option label="全部" value="all" />
              <el-option label="未开始" value="1" />
              <el-option label="进行中" value="2" />
              <el-option label="已结束" value="3" />
            </el-select>
          </div>
        </div>
        <div class="content-item">
          <div class="btn_succ" @click="searchVehicle()">查询</div>
          <div class="btn_cancel" @click="resetSearch()">重置</div>
        </div>
      </div>
    </div>
    <div class="section-container">
      <div class="section-item-header clearfix">
        <span>组队活动列表</span>
        <router-link
          to="/activity/team/addteam"
          class="btn_succ add-coupon"
          style="margin-left: 24px"
        >
          <i class="add-station"></i>添加组队活动
        </router-link>
      </div>
      <div class="section-main">
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td">创建时间</div>
            <div class="table-td">活动名称</div>
            <div class="table-td">活动周期</div>
            <div class="table-td">状态
              <el-tooltip content="" placement="top">
                  <div slot="content" style="line-height: 18px;width:200px;">
                      状态根据活动周期自动更改
                  </div>
                  <div class="tips-icon" style="position:static;"></div>
              </el-tooltip>
            </div>
            <!-- <div class="table-td">活动规则</div> -->
            <div class="table-td">开启/关闭
              <el-tooltip content="" placement="top">
                  <div slot="content" style="line-height: 18px;width:200px;">
                      切换状态，关闭后活动不在 <br />APP展示
                  </div>
                  <div class="tips-icon" style="position:static;"></div>
              </el-tooltip>
            </div>
            <div class="table-td">操作</div>
          </div>
          <div class="table-body" v-loading="listLoading">
            <div
              class="table-tr"
              v-show="tableData && tableData.length > 0"
              v-for="(team_info, index) in tableData"
              :key="index"
            >
              <div class="table-td">
                <div class="td-item">
                  {{ team_info.create_time }}
                </div>
              </div>
              <div class="table-td">
                <div class="td-item">
                  {{ team_info.title ? team_info.title : "--" }}
                </div>
              </div>
              <div class="table-td">
                <div class="td-item">{{ team_info.start_time }} <br/> {{ team_info.end_time }}</div>
              </div>
              <div class="table-td">
                <div
                  class="td-item"
                  :class="{ 
                    'section-no-begin': team_info.progress == 1,
                    'section-running': team_info.progress == 2,
                    'section-end': team_info.progress == 3
                   }"
                >
                  {{ progress_array[team_info.progress] }}
                </div>
              </div>
              <!-- <div class="table-td table-status">
                <div class="td-item">
                  <div
                    style="
                      width: 72px;
                      height: 30px;
                      border-radius: 3px;
                      line-height: 30px;
                      font-size: 12px;
                      color: white;
                    "
                    class="td-item btn_unfinish"
                    @click="handleCheckRule(team_info.rule_describe)"
                  >
                    查看规则
                  </div>
                </div>
              </div> -->
              <div class="table-td" style="min-width: 98px">
                <div
                  :class="['knob', team_info.status == 1 ? 'started' : '']"
                  @click="changeStatus(team_info)"
                ></div>
                <div class="knob-text">
                  {{ team_info.status == 1 ? "开启" : "关闭" }}
                </div>
              </div>
              <div class="table-td table-operate">
                <el-tooltip content="查看" placement="top">
                  <div
                    class="td-item see-icon"
                    @click="checkTeam(team_info.id)"
                  ></div>
                </el-tooltip>
                <el-tooltip
                  :class="[
                    'td-item edit-icon',
                    team_info.progress == '1' ? '' : 'edit-icon-disable',
                  ]"
                  :content="
                    team_info.progress == '1' ? '编辑' : (team_info.progress == '2' ? '进行中的活动不可编辑' : '已结束的活动不可编辑')
                  "
                  placement="top"
                >
                  <router-link
                    :to="
                      team_info.progress == '1'
                        ? {
                            path: '/activity/team/addteam',
                            query: { id: `${team_info.id}` },
                          }
                        : ''
                    "
                    :class="[
                      'td-item edit-icon',
                      team_info.progress == '1' ? '' : 'team-not-edit',
                    ]"
                  ></router-link>
                </el-tooltip>
                <el-tooltip
                  :content="
                    team_info.progress == '3'
                      ? '已结束的活动不可删除'
                      : team_info.progress == '2'
                      ? '进行中的活动不可删除'
                      : '删除'
                  "
                  placement="top"
                >
                  <div
                    :class="[
                      'td-item',
                      team_info.progress == '3'
                        ? 'delete-disabled-icon'
                        : team_info.progress == '2'
                        ? 'delete-disabled-icon'
                        : 'delete-icon',
                    ]"
                    @click="delItem(team_info.id, team_info.progress)"
                  >
                    <!-- {{
                      team_info.progress == "2"
                        ? "--"
                        : team_info.progress == "1"
                        ? "--"
                        : ""
                    }} -->
                  </div>
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
    <!-- 删除 -->
    <sf-modelBox
      :showModel.sync="showDelete"
      title="删除确认"
      type="delete"
      @change="saveDeleteSure"
    >
      <p>删除组队活动后，活动将不再失效，确认要删除吗？</p>
    </sf-modelBox>
    <!-- 不可以删除 -->
    <sf-messageBox class="team-no-del" :showModel.sync="isDelete">
      <div class="team-content">
        <div class="team-img-error">
          <img :src="require('assets/img/del-error.png')" alt="" />
        </div>
        <div class="team-content-error">删除失败</div>
        <div class="team-no-error">
          有用户参与本组队活动，组队活动不可删除！
        </div>
        <div class="team-error-border"></div>
        <div class="btn_succ team-btn-error" @click="delFail">确认</div>
      </div>
    </sf-messageBox>
    <!-- 查看规则 -->
    <sf-messageBox class="team-rule" :showModel.sync="isRule" title="活动规则">
      <div class="team-content">
        <span>{{ rule_content }}</span>
      </div>
    </sf-messageBox>
  </section>
</template>

<script>
import logVue from "../device/log.vue";
export default {
  data() {
    return {
      progress_array: {
        1: "未开始",
        2: "进行中...",
        3: "已结束",
      },
      modelObj: {
        page: "",
        limit: "10",
        start_time: "",
        end_time: "",
        status: "all",
        search: "",
      },
      currentPage: 1,
      page_count: 1,
      tableData: [],
      listLoading: false,
      showDelete: false,
      delete_id: "",
      isRule: false, //查看规则
      rule_content: "",
      isDelete: false,
    };
  },
  created() {
    this.getTableDataList();
  },
  methods: {
    delFail() {
      this.isDelete = false;
    },
    handleCheckRule(value) {
      this.isRule = true;
      this.rule_content = value;
    },
    changeStatus(item) {
      let status = item.status == 1 ? 0 : 1;
      this.$api
        .changetTeamStatus({ id: item.id, status: status })
        .then((data) => {
          if (data.code == 1) {
            this.$sfNotify({
              message: "成功",
            });
            this.getTableDataList();
          } else {
            this.$sfNotify({
              duration: 0,
              type: "error",
              message: "失败",
            });
          }
        });
    },
    getTableDataList() {
      this.listLoading = true;
      this.modelObj.page = String(this.currentPage);
      this.$api.teamList(this.modelObj).then((data) => {
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
    checkTeam(id) {
      this.$router.push({
        path: "/activity/team/checkteam",
        query: { id: id },
      });
    },
    delItem(id, del) {
      this.delete_id = id;
      console.log('00',del);
      if (del != 1) {
        // this.isDelete = true;
      } else {
        this.showDelete = true;
      }
    },
    searchVehicle() {
      this.currentPage = 1;
      this.getTableDataList();
    },
    resetSearch() {
      (this.modelObj = {
        page: "",
        limit: "10",
        status: "all",
      }),
        (this.currentPage = 1);
      this.page_count = 1;
      this.getTableDataList();
    },
    saveDeleteSure() {
      this.$api.teamDelete({ id: this.delete_id }).then((data) => {
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
  },
};
</script>
<style lang="scss">
.el-tooltip__popper.is-dark {
  max-width:160px;
}
</style>
<style lang="scss" scoped>
@import "../../assets/css/vehicle/carManager.scss";
@import "../../assets/css/activity/team.scss";
</style>
