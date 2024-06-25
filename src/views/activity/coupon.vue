<template>
  <section>
    <div class="section-title">优惠券管理</div>
    <div class="section-container">
      <div class="section-item-header">
        <router-link to="/activity/coupon"
          >优惠券管理</router-link
        >
        <!-- <router-link to="/activity/couponac">车辆优惠管理</router-link> -->
      </div>
      <div class="header-content clearfix">
        <div class="content-item">
          <div class="header-left">发券方式</div>
          <div class="header-right">
            <el-select v-model="modelObj.type">
              <el-option label="全部" value="all" />
              <el-option label="邀请新用户" value="1" />
              <el-option label="充值" value="2" />
              <el-option label="商业合作" value="4" />
              <el-option label="按照账户发放" value="5" />
            </el-select>
          </div>
        </div>
        <div class="content-item">
          <div class="header-left">状态</div>
          <div class="header-right">
            <el-select v-model="modelObj.status">
              <el-option label="全部" value="all" />
              <el-option label="启用" value="1" />
              <el-option label="停用" value="2" />
            </el-select>
          </div>
        </div>
        <div class="content-item">
          <div class="header-left">优惠券类型</div>
          <div class="header-right">
            <el-select v-model="modelObj.coupon_type">
              <el-option label="全部" value="all" />
              <el-option label="现金券" value="1" />
              <el-option label="折扣券" value="2" />
              <el-option label="电度券" value="3" />
            </el-select>
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
        <div class="content-item btn-padding">
          <div class="btn_succ" @click="searchPile()">查询</div>
          <div class="btn_cancel" @click="resetSearch()">重置</div>
        </div>
        <div class="add-coupon">
          <router-link to="/activity/coupon/add" class="btn_succ add-coupon">
            <i class="add-station"></i>添加优惠券
          </router-link>
          <router-link
          to="/activity/coupon/send"
          class="btn_recovery send-btn"
        >已发优惠券>></router-link>
        </div>
      </div>

      <div class="section-main">
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td">创建时间</div>
            <div class="table-td">发券方式</div>
            <div class="table-td">优惠券类型</div>
            <div class="table-td">获取条件</div>
            <div class="table-td">使用条件</div>
            <div class="table-td">状态</div>
            <div class="table-td">操作</div>
          </div>
          <div class="table-body" v-loading="listLoading">
            <div
              class="table-tr"
              v-show="tableData && tableData.length > 0"
              v-for="(bonus_info, index) in tableData"
              :key="index"
            >
              <div class="table-td">
                <div class="td-item">{{ bonus_info.create_time }}</div>
              </div>
              <div class="table-td">
                <div class="td-item">
                  {{ bonus_type_array[bonus_info.type] }}
                  <br />
                  {{ bonus_info.type == '5' ? bonus_info.tel : ''}}
                </div>
              </div>
              <div class="table-td">
                <div class="td-item">
                  {{ bonus_coupon_type_array[bonus_info.coupon_type] }}
                </div>
              </div>
              <div class="table-td">
                <div class="td-item" v-if="bonus_info.type == 1">邀请新用户</div>
                <div class="td-item" v-else-if="bonus_info.type == 2">一次性充值{{bonus_info.min_amount}}元</div>
                <div class="td-item" v-else-if="bonus_info.type == 4">输入兑换码兑换优惠券</div>
                <div class="td-item" v-else-if="bonus_info.type == 5">按照账号{{bonus_info.tel}}手动发放</div>
              </div>
              <div class="table-td">
                <div class="td-item" v-if="bonus_info.coupon_type == 1">应付金额满{{bonus_info.min_good_amount}}元可用</div>
                <div class="td-item" v-else-if="bonus_info.coupon_type == 2">服务费金额满{{bonus_info.min_good_amount}}元可用</div>
                <div class="td-item" v-else-if="bonus_info.coupon_type == 3">充电度数满{{bonus_info.min_good_amount}}度可用</div>
              </div>
              <div class="table-td">
                <div
                  :class="['knob', bonus_info.status == 1 ? 'started' : '' , bonus_info.type == 5? 'btn_disable_started' : '']"
                  @click="changeStatus(bonus_info, index)"
                ></div>
                <div class="knob-text">
                  {{ bonus_info.status == 1 ? "启用" : "停用" }}
                </div>
              </div>
              <div class="table-td table-operate">
                <el-tooltip content="查看" placement="top">
                  <div
                    class="td-item see-icon"
                    @click="checkCoupon(bonus_info.id,bonus_info.type)"
                  ></div>
                </el-tooltip>
                <el-tooltip content="编辑" placement="top"  v-if="bonus_info.type == '4' ? false : (bonus_info.type == '5' ? false : true)">
                  <div
                    class="td-item edit-icon"
                    @click="editCoupon(bonus_info.id)"
                  ></div>
                </el-tooltip>
                <el-tooltip content="删除" placement="top"  v-if="!(bonus_info.type === '4'||bonus_info.type==='5')">
                  <div
                    class="td-item delete-icon"
                    @click="delItem(bonus_info.id, index)"
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
    <!-- 删除 -->
    <sf-modelBox
      :showModel.sync="showDelete"
      title="删除确认"
      type="delete"
      @change="saveDeleteSure"
    >
      <p>是否确定删除此优惠券？</p>
    </sf-modelBox>
    <!-- 查看权限 -->
    <sf-messageBox
      class="permission-box"
      :showModel.sync="showPermission"
      title="优惠券使用权限"
    >
      <div class="box-name">可用充电站：</div>
      <div class="box-main scrollBar">
        {{ available_stations }}
      </div>
    </sf-messageBox>
  </section>
</template>

<script>
export default {
  data() {
    return {
      modelObj: {
        type: "all",
        status: "all",
        start_time : '',
        end_time : "",
        coupon_type : 'all'
      },
      currentPage: 1,
      page_count: 1,
      tableData: [],
      listLoading: false,
      showDelete: false,
      showPermission: false,
      bonus_type_array: {
        1: "邀请新用户",
        2: "充值",
        4: "商业合作",
        5: "按照账户发放",
      },
      bonus_coupon_type_array:{
        1: "现金券",
        2: "折扣券",
        3: "电度券"
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
      this.$api.bonusGetList(this.modelObj).then((data) => {
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
    changeStatus(item, index) {
      if(item.type == '5'){
        this.$sfNotify({
            type: "error",
            message: '发券方式为“按照账户发放”时，不可修改状态!',
          });
        return;
      }
      let status = item.status == 1 ? 2 : 1;
      this.$api
        .bonusChangeStatus({ id: item.id, status: status })
        .then((data) => {
          if (data.code == 1) {
            this.$sfNotify({
              message: "成功",
            });
            this.tableData[index].status = status;
          } else {
            this.$sfNotify({
              duration: 0,
              type: "error",
              message: "失败",
            });
          }
        });
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
        type: "all",
        status: "all",
        start_time : '',
        end_time : "",
        coupon_type : 'all'
      },
      this.currentPage = 1;
      this.page_count = 1;
      this.tableData = [];
      this.getTableDataList();
    },
    saveDeleteSure() {
      this.$api.bonusDelBonus({ id: this.delete_id }).then((data) => {
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
    checkCoupon(id,type) {
      this.available_stations = "";
      // this.available_stations = stations;
      this.$router.push({ path: "/activity/coupon/checkcoupon", query: { id: id  , type : type} });
      // this.showPermission = true;
    },
    editCoupon(id){
      this.$router.push({ path: "/activity/coupon/add", query: { id: id} });
    }
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/activity/coupon.scss";
</style>
