<template>
  <section class="coupon-ac-ma">
    <div class="section-title">车辆优惠管理</div>
    <div class="section-container">
      <div class="section-item-header">
        <!-- <router-link
          to="/activity/coupon"
        >优惠券管理</router-link> -->
        <router-link to="/activity/machine">车辆优惠管理</router-link>
      </div>
      <!-- <div class="section-item-header clearfix">
        <span>筛选查询</span>
      </div> -->
      <div class="header-content clearfix">
        <div class="content-item">
            <div class="header-left">活动名称</div>
            <div class="header-right">
                <el-input class="search-input" v-model="modelObj.search" placeholder="关键字搜索" />
            </div>
          </div>
        <div class="content-item">
          <div class="header-left">创建时间</div>
          <div class="header-right">
            <el-date-picker
              class="end-time"
              v-model="modelObj.start_time"
              type="date"
              placeholder="选择开始日期"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
            <el-date-picker
              class="end-time"
              v-model="modelObj.end_time"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择结束日期"
            >
            </el-date-picker>
          </div>
        </div>
        <div class="content-item">
          <div class="header-left">状态</div>
          <div class="header-right">
            <el-select v-model="modelObj.status">
              <el-option
                label="全部"
                value="all"
              />
              <el-option
                label="未开始"
                value="1"
              />
              <el-option
                label="进行中"
                value="2"
              />
              <el-option
                label="已结束"
                value="3"
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
        <div class="add-coupon">
        <router-link
          to="/activity/machine/addcouponac"
          class="btn_succ add-coupon"
        >
          <i class="add-station"></i>添加优惠活动
        </router-link>
        <!-- <router-link
          to="/activity/coupon/send"
          class="btn_recovery send-btn"
        >已发优惠券</router-link> -->
      </div>
      </div>
      
      <div class="section-main">
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td">创建时间</div>
            <div class="table-td">活动名称</div>
            <div class="table-td">活动周期</div>
            <div class="table-td">总参与数量
              <el-tooltip content="" placement="top">
                <div class="hover-green" slot="content" style="line-height: 18px;width:200px;">
                  <!-- <a :href="`${ENV}/vhm/demo.xls`"
                    >点击下载导入事例</a
                  > -->
                  截至到昨天 <br />参与本活动的车辆总数量
                </div>
                <div class="tips-icon"></div>
              </el-tooltip>
            </div>
            <div class="table-td">正在参与数量
              <el-tooltip content="" placement="top">
                <div class="hover-green" slot="content" style="line-height: 18px;width:200px;">
                  <!-- <a :href="`${ENV}/vhm/demo.xls`"
                    >点击下载导入事例</a
                  > -->
                  截至到昨天 <br />正在参与活动的车辆数量
                </div>
                <div class="tips-icon"></div>
              </el-tooltip>
            </div>
            <div class="table-td">状态</div>
            <div class="table-td">操作</div>
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
                <div class="td-item">{{preferential_info.create_time}}</div>
              </div>
              <div class="table-td">
                <!-- <div class="td-item">{{bonus_type_array[preferential_info.type]}}</div> -->
                <div class="td-item">{{preferential_info.title}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{preferential_info.start_time}}<br/>{{preferential_info.end_time}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{preferential_info.total_count}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{preferential_info.onging_count}}</div>
              </div>
              <div class="table-td">
                <div
                  class="td-item section-no-begin"
                  v-if="preferential_info.status == '1'"
                >
                  {{ status_array[preferential_info.status] }}
                </div>
                <div
                  class="td-item section-running"
                  v-if="preferential_info.status == '2'"
                >
                  {{ status_array[preferential_info.status] }}
                </div>
                <div class="td-item" v-if="preferential_info.status == '3'">
                  {{ status_array[preferential_info.status] }}
                </div>
              </div>
              <div class="table-td table-operate">
                <el-tooltip
                  content="查看"
                  placement="top"
                >
                  <div
                    class="td-item see-icon"
                    @click="checkCouponAc(preferential_info.id)"
                  ></div>
                </el-tooltip>
                <el-tooltip content="编辑" placement="top" v-if="preferential_info.status == '2' ? false : true">
                  <div
                    class="td-item edit-icon"
                    @click="editCoupon(preferential_info.id)"
                  ></div>
                </el-tooltip>
                <el-tooltip
                  v-if="preferential_info.status == '2' ? false : true"
                  content="删除"
                  placement="top"
                >
                  <div
                    class="td-item delete-icon"
                    @click="delItem(preferential_info.id, index)"
                  ></div>
                </el-tooltip>
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
    <!-- 删除 -->
    <sf-modelBox
      :showModel.sync="showDelete"
      title="删除优惠活动"
      type="delete"
      @change="saveDeleteSure"
    >
      <p>删除优惠活动后，优惠活动不再生效，确定要删除吗？</p>
    </sf-modelBox>
    <!-- 查看权限 -->
    <sf-messageBox
      class="permission-box"
      :showModel.sync="showPermission"
      title="优惠券使用权限"
    >
      <div class="box-name">可用充电站：</div>
      <div class="box-main scrollBar">
        {{available_stations}}
      </div>
    </sf-messageBox>
  </section>
</template>

<script>
export default {
  data() {
    return {
      couponUserId:'',
      modelObj: {
        search:'',
        status: "all",
        start_time:'',
        end_time:''
      },
      currentPage: 1,
      page_count: 1,
      tableData: [],
      listLoading: false,
      showDelete: false,
      showPermission: false,
      bonus_type_array: {
        "1": "邀请新用户",
        "2": "充值",
        "3": "累计消费"
      },
      status_array: {
        1: "未开始",
        2: "进行中...",
        3: "已结束",
      },
      available_stations: "",
      delete_id: "",
    };
  },
  created() {
    this.getTableDataList();
  },
  methods: {
    getTableDataList() {
      this.listLoading = true;
      this.modelObj.page = this.currentPage;
      this.$api.preferentialAcGetList(this.modelObj).then(data => {
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
    delItem(id, index) {
      this.delete_id = id;
      this.showDelete = true;
    },
    searchPile() {
      this.currentPage = 1;
      this.getTableDataList();
    },
    resetSearch() {
      this.modelObj = {
        search:'',
        status: "all",
        start_time:'',
        end_time:''
      };
      this.currentPage = 1;
      this.page_count = 1;
      this.tableData = [];
      this.getTableDataList();
    },
    saveDeleteSure() {
      this.$api.preferentialAcDelete({ id: this.delete_id }).then(data => {
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
            message: "失败"
          });
        }
      });
    },
    checkCouponAc(id) {
      this.available_stations = "";
      // this.available_stations = stations;
      // this.showPermission = true;
      this.$router.push({path:'/activity/machine/checkcouponac',query:{id : id}})
    },
    editCoupon(id){
      this.$router.push({ path: "/activity/machine/addcouponac", query: { id: id} });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/activity/couponActivityManager.scss";
</style>
