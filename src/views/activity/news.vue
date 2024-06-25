<template>
  <section>
    <div class="section-title">活动广告管理</div>
    <div class="section-container">
      <div class="section-item-router">
        <router-link
          to="/activity/news"
          style="cursor: pointer"
          class="section-act"
          @click="changeAdmanager(1)"
          >活动管理</router-link
        >
        <router-link
          to="/activity/news/admanager"
          style="cursor: pointer"
          @click="changeAdmanager(2)"
          >轮播广告管理</router-link
        >
        <router-link
          to="/activity/news/popupmanager"
          style="cursor: pointer"
          @click="changeAdmanager(2)"
          >弹窗广告管理</router-link
        >
      </div>
      <div class="section-main">
        <div class="header-content clearfix">
          <div class="content-item">
            <div class="header-left">关键字</div>
            <div class="header-right">
              <el-input
                class="search-input"
                v-model="managerAc.keyword"
                placeholder="请输入活动名称"
              />
            </div>
          </div>
          <div class="content-item">
            <div class="header-left">状态</div>
            <div class="header-right">
              <el-select v-model="managerAc.status">
                <el-option label="全部" value="0" />
                <el-option label="未发布" value="1" />
                <el-option label="已发布" value="2" />
              </el-select>
            </div>
          </div>
          <div class="content-item">
            <div class="btn_succ" @click="searchResultAc">查询</div>
            <div class="btn_cancel" @click="searchReset">重置</div>
          </div>
          <div class="btn_succ add-coupon" @click="handleChangeAc()">
            <i class="add-station"></i>添加活动
          </div>
        </div>
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td">活动名称</div>
            <div class="table-td" style="min-width: 270px">活动图片</div>
            <div class="table-td table-column__2">活动链接</div>
            <div class="table-td">活动时间</div>
            <!-- <div class="table-td">首页展示弹窗</div>
            <div class="table-td">关联充电站</div> -->
            <div class="table-td">状态</div>
            <div class="table-td">操作</div>
          </div>
          <div class="table-body" v-loading="listLoading">
            <div
              class="table-tr"
              v-show="tableData && tableData.length > 0"
              v-for="(activity, index) in tableData"
              :key="index"
            >
              <div class="table-td">
                <el-tooltip :content="activity.title" placement="top">
                  <div
                    class="td-item"
                    style="max-height: 110px; overflow: hidden"
                  >
                    {{ activity.title | ellipsis }}
                  </div>
                </el-tooltip>
              </div>
              <div class="table-td table-img">
                <div class="td-item">
                  <img
                    style="height: 96px"
                    class="td-item news-img"
                    :src="`${ENV}${activity.img_url}`"
                  />
                </div>
              </div>
              <div class="table-td table-link table-column__2">
                <div
                  class="td-item"
                  style="max-height: 120px; overflow: hidden"
                >
                  <el-tooltip :content="activity.url" placement="top">
                    <span class="item-text scrollBar">{{
                      activity.url | ellipsis
                    }}</span>
                  </el-tooltip>
                </div>
              </div>
              <div class="table-td">
                <div class="td-item td-time">
                  {{ activity.start_time }}
                  <br />
                  {{ activity.end_time }}
                  <br />
                  <span
                    class="section-no-begin"
                    v-if="activity.status == 0 ? true : false"
                    >未开始</span
                  >
                  <span
                    class="section-running"
                    v-if="activity.status == 1 ? true : false"
                    >进行中...</span
                  >
                  <span
                    class="section-end"
                    v-if="activity.status == 2 ? true : false"
                    >已结束</span
                  >
                </div>
              </div>
              <div class="table-td table-status">
                <div class="td-item">
                  <div
                    style="
                      width: 72px;
                      height: 30px;
                      border-radius: 3px;
                      line-height: 0px;
                      font-size: 12px;
                    "
                    :class="[
                      'td-item',
                      activity.publish == 2 ? 'btn_already' : 'btn_unfinish',
                    ]"
                    @click="changeActStatus(activity, index)"
                  >
                    {{ activity.publish == 2 ? "已发布" : "未发布" }}
                  </div>
                </div>
              </div>
              <div class="table-td table-operate" @click="deleteData(activity)">
                <el-tooltip content="复制" placement="top">
                  <div
                    class="td-item copy-icon"
                    @click="copActivity(activity.id)"
                  ></div>
                </el-tooltip>
                <el-tooltip
                  v-if="activity.publish == 2 ? false : true"
                  content="编辑"
                  placement="top"
                >
                  <div
                    class="td-item edit-icon"
                    @click="handleAdd(activity.id)"
                  ></div>
                </el-tooltip>
                <el-tooltip content="删除" placement="top">
                  <div
                    class="td-item delete-icon"
                    @click="delActivity(activity.id)"
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
    <!-- 添加/编辑 活动 模态框-->
    <!-- 删除 -->
    <sf-modelBox
      :showModel.sync="showDelete"
      title="删除确认"
      type="delete"
      @change="saveDeleteSure"
    >
      <p class="delete-common" v-if="delete_adPosition == null ? true : false">
        是否确定删除此活动？
      </p>
      <p class="delete-common" v-if="delete_adPosition == null ? false : true">
        <span class="delete-style">“{{ delete_title }}”</span
        >的活动现在关联着<span class="delete-style"
          >“广告位{{ delete_adPosition }}”</span
        >删除后将同时删除广告，确认是否删除？
      </p>
    </sf-modelBox>
  </section>
</template>
<script>
import logVue from "../device/log.vue";
export default {
  data() {
    return {
      delete_title: "",
      delete_adPosition: "",
      //活动管理编辑数据
      dataAc: [],
      chooseAd: true,
      //全选
      checkAll: false,
      //数据源
      checkedCities: [], //绑定默认选中
      isIndeterminate: false, //设置 indeterminate 状态，只负责样式控制
      // isContainer: 1, //添加活动显示隐藏
      managerAc: {
        keyword: "",
        status: "0",
      },
      ENV: process.env.NODE_ENV == "development" ? "/api" : "",
      currentPage: 1,
      page_count: 1,
      listLoading: false,
      tableData: [],
      currentItem: {
        id: 0,
      },
      showDelete: false,
      showActivity: false,
      activitInfo: {
        title: "",
        img_url: "",
        url: "",
        start_time: "",
        end_time: "",
        pop_up: "",
        connect_station: "",
        status: "1",
        publish: "1",
      },
      real_img_url: "",
      delete_id: "",
      dataRules: {
        title: [
          { required: true, message: "* 请输入活动名称", trigger: "blur" },
        ],
        img_url: [
          { required: true, message: "* 请上传活动图片", trigger: "change" },
        ],
        url: [{ required: true, message: "* 请输入活动链接", trigger: "blur" }],
        start_time: [
          {
            required: true,
            message: "请选择日期",
            trigger: "change",
          },
        ],
        end_time: [
          {
            required: true,
            message: "请选择时间",
            trigger: "change",
          },
        ],
      },
    };
  },
  mounted() {
    this.$nextTick(() => {
      document.documentElement.style.minWidth = "1300px";
    });
  },
  created() {
    this.getTableDataList();
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
  methods: {
    copActivity(id) {
      this.currentItem.id = id;
      this.isContainer = id;
      // 编辑
      this.$api.activityDetail({ id: id }).then((data) => {
        if (data.code == 1) {
          //判断是否是从广告管理界面进来的
          this.$router.push({
            path: "/activity/news/copac",
            query: {
              id: JSON.stringify(id),
            },
          });
        }
      });
    },
    deleteData(activity) {
      console.log("acccc", activity);
      this.delete_title = activity.title;
      this.delete_adPosition = activity.sequence;
    },
    searchReset() {
      (this.managerAc = {
        keyword: "",
        status: "0",
      }),
        this.getTableDataList();
    },
    searchResultAc() {
      this.$api
        .activityActivities({
          search: this.managerAc.keyword,
          status: this.managerAc.status,
        })
        .then((data) => {
          this.listLoading = false;
          if (data.code == 1) {
            this.tableData = data.data.list;
            this.currentPage = data.data.current_page;
            this.page_count = data.data.page_total;
          }
        });
    },
    handleChangeAc() {
      this.$router.push({ path: "/activity/news/addac" });
    },
    getTableDataList() {
      this.listLoading = true;
      this.$api
        .activityActivities({ search: this.keyword, page: this.currentPage })
        .then((data) => {
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
    handleAdd(id) {
      this.currentItem.id = id;
      this.isContainer = id;

      if (id != 0) {
        console.log("id", id);
        // 编辑
        this.$api.activityDetail({ id: id }).then((data) => {
          if (data.code == 1) {
            //判断是否是从广告管理界面进来的
            this.$router.push({
              path: "/activity/news/addac",
              query: {
                id: JSON.stringify(id),
              },
            });
          }
        });
      } else {
        this.real_img_url = "";
        this.activitInfo.title = "";
        this.activitInfo.img_url = "";
        this.activitInfo.url = "";
        this.activitInfo.start_time = "";
        this.activitInfo.end_time = "";
        this.activitInfo.status = "1";
        this.showActivity = true;
      }
    },
    // 确认删除
    saveDeleteSure() {
      this.$api.activityDelete({ id: this.delete_id }).then((data) => {
        this.delete_id = "";
        this.showDelete = false;
        if (data.code == 1) {
          this.$sfNotify({
            message: "成功",
          });
          this.delete_title = "";
          this.delete_adPosition = "";
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
    changeActStatus(item, index) {
      if (item.publish == "1") {
        var publish = item.publish == "1" ? "2" : "1";
        this.$api
          .activityStatus({ id: item.id, status: publish })
          .then((data) => {
            if (data.code == 1) {
              this.$sfNotify({
                message: "成功",
              });
              this.tableData[index].publish = publish;
              this.getTableDataList();
            } else {
              this.$sfNotify({
                duration: 0,
                type: "error",
                message: "失败",
              });
            }
          });
      }
    },
    delActivity(id) {
      this.showDelete = true;
      this.delete_id = id;
    },
  },
  destroyed() {
    document.documentElement.style.minWidth = "1200px";
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/activity/news.scss";
</style>
