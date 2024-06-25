<template>
  <section>
    <div class="section-title">活动广告管理</div>
    <div class="section-container">
      <div class="section-item-router">
        <router-link
          to="/activity/news"
          style="cursor: pointer"
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
          class="section-act"
          @click="changeAdmanager(2)"
          >弹窗广告管理</router-link
        >
      </div>
      <div class="section-main">
        <div class="ad_manager">
          <div>
            * 弹窗广告是用户每次进入APP后展示的宣传图（按用户附近站点精准推送）
          </div>
          <div
            class="btn_succ add-coupon btn_popupmanager"
            @click="handleChangeAc()"
          >
            <i class="add-station"></i>添加弹窗广告
          </div>
        </div>
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td">创建时间</div>
            <div class="table-td">首页展示弹窗</div>
            <div class="table-td">关联活动名称</div>
            <div class="table-td">关联充电站</div>
            <div class="table-td">操作</div>
          </div>
          <div class="table-body" v-loading="listLoading">
            <div
              class="table-tr"
              v-show="tableData && tableData.length > 0"
              v-for="(pop, index) in tableData"
              :key="index"
            >
              <div class="table-td">
                <div class="td-item td-time">
                  {{ pop.create_time }}
                </div>
              </div>
              <div class="table-td">
                <div class="td-item">
                  <img
                    style="width: 72px; height: 96px"
                    class="news-img"
                    :src="`${ENV}${pop.img_url}`"
                  />
                </div>
              </div>
              <div class="table-td">
                <el-tooltip :content="pop.title" placement="top">
                  <div
                    class="td-item"
                    style="max-height: 110px; overflow: hidden"
                  >
                    {{ pop.title | ellipsis }}
                  </div>
                </el-tooltip>
              </div>

              <div class="table-td">
                <div
                  class="td-item"
                  v-if="pop.stations_str == '' ? false : true"
                >
                  <el-tooltip
                    :content="pop.stations_str == '' ? '--' : pop.stations_str"
                    placement="top"
                  >
                    <div class="td-item td-time">
                      {{ pop.stations_str | stationsellipsis }}
                    </div>
                  </el-tooltip>
                </div>
                <div
                  class="td-item"
                  v-if="pop.stations_str == '' ? true : false"
                >
                  {{ pop.stations_str | stationsellipsis }}
                </div>
              </div>
              <div class="table-td table-operate" @click="deleteData(pop)">
                <el-tooltip
                  v-if="pop.publish == 2 ? false : true"
                  content="编辑"
                  placement="top"
                >
                  <div
                    class="td-item edit-icon"
                    @click="handleAdd(pop.activity_id)"
                  ></div>
                </el-tooltip>
                <el-tooltip content="删除" placement="top">
                  <div
                    class="td-item delete-icon"
                    @click="delActivity(pop.activity_id)"
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
      <p v-if="delete_adPosition == null ? true : false">
        是否确定删除此弹窗活动？
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
    stationsellipsis(value) {
      if (!value) return "--";
      if (value.length > 38) {
        return value.slice(0, 30) + "...";
      }
      return value;
    },
  },
  methods: {
    deleteData(activity) {
      console.log("bianji", activity);
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
    // searchResultAc() {
    //   this.$api
    //     .activityActivities({
    //       search: this.managerAc.keyword,
    //       status: this.managerAc.status,
    //     })
    //     .then((data) => {
    //       this.listLoading = false;
    //       if (data.code == 1) {
    //         this.tableData = data.data.list;
    //         this.currentPage = data.data.current_page;
    //         this.page_count = data.data.page_total;
    //       }
    //     });
    // },
    handleChangeAc() {
      this.$router.push({ path: "/activity/news/addpopup" });
    },
    getTableDataList() {
      this.listLoading = true;
      this.$api.popList({ page: this.currentPage }).then((data) => {
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
        // 编辑
        this.$api.activityDetail({ id: id }).then((data) => {
          if (data.code == 1) {
            //判断是否是从广告管理界面进来的
            this.$router.push({
              path: "/activity/news/addpopup",
              query: {
                id: id,
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
      this.$api.deletePop({ id: this.delete_id }).then((data) => {
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
@import "../../assets/css/activity/pop.scss";
</style>
