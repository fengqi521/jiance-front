<template>
  <section>
    <div class="section-title">
      <router-link to="/activity/machine">车辆优惠管理</router-link> > 车辆优惠详情
    </div>
    <div class="section-header">
      <div class="section-item-header">
        <a style="cursor: default">车辆优惠信息</a>
      </div>
      <div class="header-content clearfix">
        <div class="content-top">
          <div class="top-item">
            <div class="top-item-title">创建时间</div>
            <div
              class="top-item-text ellipsis"
              :style="{fontSize:'18px',color:parseFloat(balance)?'#666666':'#666666'}"
            >
              {{ parseFloat(couponAcTop.create_time) ? couponAcTop.create_time : 0 }}
            </div>
          </div>
          <div class="top-item">
            <div class="top-item-title">总参与数量</div>
            <div
              class="top-item-text ellipsis"
              :style="{fontSize:'18px',color:parseFloat(couponAcTop.total_count)?'#666666':'#666666'}"
            >
              {{ parseFloat(couponAcTop.total_count) ? couponAcTop.total_count : 0 }}
            </div>
          </div>
          <div class="top-item">
            <div class="top-item-title">正在参与数量</div>
            <div
              class="top-item-text ellipsis"
              :style="{fontSize:'18px',color:parseFloat(couponAcTop.onging_count)?'#666666':'#666666'}"
            >
              {{ parseFloat(couponAcTop.onging_count) ? couponAcTop.onging_count : 0 }}
            </div>
          </div>
        </div>
        <div class="content-bottom clearfix" v-loading="loading">
          <div class="bottom-list">
            <div class="bottom-item">
              <div class="bottom-item-left">活动名称：</div>
              <div class="bottom-item-right">{{ couponAcTop.title }}</div>
            </div>
          </div>
          <div class="bottom-list">
            <div class="bottom-item">
              <div class="bottom-item-left">优惠明细：</div>
              <div class="bottom-item-right">服务费 {{ couponAcTop.service_discount }} 折，电费 {{ couponAcTop.elec_discount }} 折</div>
            </div>
            <!-- <div class="bottom-item" v-if="user_type == 3">
              <div class="bottom-item-left">关联充电桩：</div>
              <el-popover placement="right-start" width="610" trigger="click">
                <div class="table connect-pile-outer">
                  <div class="table-th clearfix">
                    <div class="table-td">桩运行编码</div>
                    <div class="table-td">桩名称</div>
                    <div class="table-td">所属充电站</div>
                  </div>
                  <div class="table-body scrollBar">
                    <div
                      class="table-tr"
                      v-show="user_piles && user_piles.length > 0"
                      v-for="(pile, i) in user_piles"
                      :key="i"
                    >
                      <div class="table-td">{{pile.pile_sn}}</div>
                      <div class="table-td">{{pile.pile_name}}</div>
                      <div class="table-td">{{pile.station_name}}</div>
                    </div>
                  </div>
                </div>
                <div slot="reference" class="bottom-item-right bottom-operate">查看</div>
              </el-popover>
            </div> -->
          </div>
          <div class="bottom-list">
            <div class="bottom-item">
              <div class="bottom-item-left bottom-item-left-weektime">优惠周期：</div>
              <div class="bottom-item-right bottom-item-right-weektime"><p>{{ couponAcTop.start_time }} 至 {{ couponAcTop.end_time }}</p></div>
            </div>
          </div>
          <div class="bottom-list">
            <div class="bottom-item">
              <div class="bottom-item-left">享受优惠对象：</div>
              <div class="bottom-item-right" v-if="couponAcTop.type == 1">{{ couponAcTop.group_title }}</div>
              <div class="bottom-item-right" v-else-if="couponAcTop.type == 2">{{ couponAcTop.company_name }}</div>
            </div>
          </div>
          <div class="bottom-list">
            <div class="bottom-item">
              <div class="bottom-item-left bottom-item-canusestation">可用充电站：</div>
              <div class="bottom-item-right"><p>{{ couponAcTop.limit_station_type == '1' ? '全部可用' : couponAcTop.station_name }}</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="section-container">
      <div class="section-item-header">
        <span>正在参与优惠车辆管理</span>
      </div>
      <div class="section-main">
        <div class="header-content header-content-bottom clearfix">
          <!-- <div class="content-item">
            <div class="header-left">用户账号</div>
            <div class="header-right">
              <el-input
                class="search-input"
                v-model="modelObj.search"
                placeholder="请输入用户账号"
              />
            </div>
          </div> -->
          <div class="content-item">
            <div class="header-left">车辆类型</div>
            <div class="header-right">
              <el-select v-model="modelObj.type">
                <el-option label="全部" value="all" />
                <el-option label="运营车辆" value="1" />
                <el-option label="个人车辆" value="2" />
              </el-select>
            </div>
          </div>
          <div class="content-item">
            <div class="header-left">状态</div>
            <div class="header-right">
              <el-select v-model="modelObj.status">
                <el-option label="全部" value="all" />
                <el-option label="开启" value="1" />
                <el-option label="关闭" value="2" />
              </el-select>
            </div>
          </div>
          <div class="content-item">
            <div class="btn_succ" @click="searchStation()">查询</div>
            <div class="btn_cancel" @click="resetSearch()">重置</div>
          </div>
          <div class="add-coupon">
            <div>
              <span
                class="btn_succ add-coupon"
                @click="showAddUser = true"
              > <i class="add-station"></i>添加车辆</span>
              <span
                class="btn_recovery send-btn"
                @click="showOpen = true"
              >一键开启</span>
              <span
                class="btn_delete send-btn"
                @click="showColse = true"
              >一键关闭</span>
            </div>
          </div>
        </div>
        <div class="table">
          <div class="table-th clearfix">
            <!-- <div class="table-td">用户账号</div> -->
            <div class="table-td">车牌号</div>
            <div class="table-td">车架号</div>
            <!-- <div class="table-td">所属方</div> -->
            <!-- <div class="table-td">企业名称</div> -->
            <div class="table-td">车辆类型</div>
            <div class="table-td">使用状态</div>
          </div>
          <div class="table-body" v-loading="listLoading">
            <div
              class="table-tr"
              v-show="couponAcBottom && couponAcBottom.length"
              v-for="(vehicle_list, index) in couponAcBottom"
              :key="index"
            >
              <!-- <div class="table-td">
                <div class="td-item">{{ vehicle_list.tel }}</div>
              </div> -->
              <div class="table-td">
                <div class="td-item">{{ vehicle_list.license_plate }}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{ vehicle_list.car_frame }}</div>
              </div>
              <!-- <div class="table-td">
                <div class="td-item">{{ vehicle_list.bind_type == '1' ? '个人' : '企业' }}</div>
              </div>
              <div class="table-td">
                <div class="td-item">
                  {{ vehicle_list.bind_name ? vehicle_list.bind_name : '--' }}
                </div>
              </div> -->
              <div class="table-td">
                <div class="td-item">{{ vehicle_list.car_type == '1' ? '运营车辆' : '个人车辆' }}</div>
              </div>
              <div class="table-td">
                <div
                  :class="['knob', vehicle_list.status == 1 ? 'started' : '']"
                  @click="changeStatus(vehicle_list)"
                ></div>
                <div class="knob-text">
                  {{ vehicle_list.status == 1 ? "开启" : "关闭" }}
                </div>
              </div>
            </div>
            <div
              class="table-tr unData"
              v-if="!couponAcBottom || couponAcBottom.length === 0"
            >
              <img :src="require('assets/img/unData.png')" />
              <span>暂无数据</span>
            </div>
          </div>
          <!-- 分页 -->
          <sf-pagination
            v-if="couponAcBottom && couponAcBottom.length > 0"
            :currentPage="currentPage"
            :page-count="page_count"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
    <!-- 一键开启 -->
    <sf-modelBox
      :showModel.sync="showOpen"
      title="一键开启"
      type="succ"
      @change="changeStatus('open')"
    >
      <p>开启后所有车辆均可参加活动，确定要开启吗？</p>
    </sf-modelBox>
    <!-- 一键关闭 -->
    <sf-modelBox
      :showModel.sync="showColse"
      title="一键关闭"
      type="delete"
      @change="changeStatus('close')"
    >
      <p>关闭后所有车辆都不可以参加活动，确定要关闭吗？</p>
    </sf-modelBox>
    <!-- 选择个人用户 -->
    <div
      is="addCouponAcDetail"
      :users="userArr"
      :searchUser.sync="searchVehicleAdd"
      :searchOwnUser.sync="searchVehicleOwnAdd"
      :choosedUser.sync="modelInfo.users"
      :fromSure.sync="fromSure"
      :resultChoose.sync="resultChoose"
      :showModel.sync="showAddUser"
      :userCurrentPage.sync="userPage"
      :userPageCount.sync="userPageCount"
    ></div>
  </section>
</template>

<script>
import addCouponAcDetail from "./components/addCouponAcDetail";
export default {
  components: {
    addCouponAcDetail
  },
  data() {
    return {
      userPage:'1',
      userPageCount:'1',
      modelInfo:{
        users:[],
        _users:'',
      },
      userArr: [],
      showAddUser: false,
      searchVehicleAdd: "",
      searchVehicleOwnAdd: 'all',
      resultChoose:'',
      //弹框列表

      showColse : false,
      showOpen : false,

      fromSure:"",

      couponAcTop:{},
      couponAcBottom:{},
      //改变状态
      couponAcChangeStatus:{
        type:'2',
        status:'1',
        preferential_id: this.$route.query.id,
        change_id :'' //当类型为全部修改时，不需要传值
      },
      //获取优惠活动下车辆的列表
      modelObj: {
        id: this.$route.query.id,
        search: '',
        type: "all",
        status:'all'
      },
      //获取单独添加车辆列表
      modeltVehicleAdd:{
        type: '',
        search :'',
        page:"",
        preferential_id : this.$route.query.id,
      },
      currentPage: 1,
      page_count: 1,
      listLoading: false,
      loading:false,
      balance: "",
      charge_amount: "",
      vehicle_list_amount: "",
      reflect_amount: "",
      refund_amount: "",
      tableData: [],
    };
  },
  created() {
    this.getVehicleAddList();
    this.getTableDataListTop();
    this.getTableDataListBottom();
  },
  watch:{
    //分页如果有改变，重新加载
    "userPage":{
      handler: function (newItem) {
        this.getVehicleAddList()
      },
      deep: true,
    },
    "showAddUser":{
      handler: function (newItem) {
        if(newItem == false){
          this.searchVehicleAdd = '';
          this.searchVehicleOwnAdd = 'all';
          this.getVehicleAddList();
        }
      },
      deep: true,
    },
    "searchVehicleAdd":{
      handler: function (newItem) {
      },
      deep: true,
    },
    "fromSure":{
      handler: function (newItem) {
        if(newItem == '1'){
          this.fromSure = '0';
          this.searchVehicleOwnAdd = 'all'
          this.AddVehicleAddList();
          this.getVehicleAddList();
        }
      },
      deep: true,
    },
  },
  methods: {
    getTableDataListTop() {
      this.loading = true;
      this.$api.preferentialAcGetDetail({id : this.$route.query.id}).then((data) => {
        this.loading = false;
        if (data.code == 1) {
          this.couponAcTop = data.data
        }
      });
    },
    getTableDataListBottom() {
      this.listLoading = true;
      this.modelObj.page = this.currentPage;
      this.$api.preferentialAcGetVehicleDetail(this.modelObj).then((data) => {
        this.listLoading = false;
        if (data.code == 1) {
          this.couponAcBottom = data.data.list
          this.currentPage = data.data.current_page;
          this.page_count = data.data.page_total;
        }
      });
    },
    changeStatus(item) {
      //判断是否是一键开启
      if(item == 'open'){
        this.showOpen = false;
        this.couponAcChangeStatus.type = '1';
        this.couponAcChangeStatus.status = '1';
      }
      //判断是否是一键关闭
      if(item == 'close'){
        this.showColse = false;
        this.couponAcChangeStatus.type = '1';
        this.couponAcChangeStatus.status = '2';
      }
      //如果不是一键操作
      if(item.status){
        this.couponAcChangeStatus.type = '2';
        let status = item.status == 1 ? 2 : 1;
        this.couponAcChangeStatus.status = status;
        this.couponAcChangeStatus.change_id = item.id;
      }
      this.$api
        .preferentialAcChangeStatus(this.couponAcChangeStatus)
        .then((data) => {
          if (data.code == 1) {
            this.$sfNotify({
              message: "成功",
            });
            // this.tableData[index].status = status;
            this.getTableDataListBottom();
          } else {
            this.$sfNotify({
              duration: 0,
              type: "error",
              message: "失败",
            });
          }
        });
    },
    getVehicleAddList() {
      this.modeltVehicleAdd.search = this.searchVehicleAdd;
      this.modeltVehicleAdd.type = this.searchVehicleOwnAdd;
      this.modeltVehicleAdd.page = this.userPage;
      this.$api.preferentialAcGetVehicleAdd(this.modeltVehicleAdd).then((data) => {
        if (data.code == 1) {
          this.userArr = data.data.list;
          this.userPage = data.data.current_page;
          this.userPageCount = data.data.page_total;
        }
      });
    },
    AddVehicleAddList() {
      var param = {
        preferential_id : this.$route.query.id,
        vehicle_list : this.modelInfo.users
      }
      this.$api.preferentialAcAddVehice(param).then((data) => {
        if (data.code == 1) {
          this.$sfNotify({
            message: '成功',
          });
          this.getTableDataListBottom();
        }else{
          this.$sfNotify({
            duration: 0,
            type: "error",
            message: data.message,
          });
        }
      });
    },
    searchStation() {
      this.currentPage = 1;
      this.couponAcBottom = [];
      this.getTableDataListBottom();
    },
    resetSearch() {
      this.modelObj = {
        id: this.$route.query.id,
        search: '',
        type: "all",
        status:'all'
      };
      this.currentPage = 1;
      this.page_count = 1;
      this.couponAcBottom = [];
      this.getTableDataListBottom();
    },
    // 点击分页触发
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getTableDataListBottom();
    },
  },
  destroyed() {
    document.documentElement.style.minWidth = "1300px";
  },
};
</script>
<style lang="scss" scoped>
@import "../../assets/css/activity/checkCouponAc.scss";
</style>
