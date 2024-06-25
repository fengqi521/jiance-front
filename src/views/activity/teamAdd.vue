<template>
  <section>
    <div class="section-title">
      <span
        class="section-title section-title-act"
        @click="handleBackAc()"
        >组队活动管理</span
      >
      <span class="section-title">></span>
      <span class="section-title" v-if="isShowWriteWord == 0 ? true : false"
        >添加组队活动</span
      >
      <span class="section-title" v-if="isShowWriteWord == 0 ? false : true"
        >编辑组队活动</span
      >
    </div>
    <!-- 添加编辑页面  组队 -->
    <div class="section-container team-box">
      <div class="section-item-header clearfix">
        <span class="manager-span">
          <div class="section-header">
            <div class="section-item-header">
              <span>{{
                currentItem.id == 0 ? "组队活动信息" : "组队活动信息"
              }}</span>
            </div>
          </div>
        </span>
      </div>
      <div
        class="box-outer"
      >
        <!-- :title="currentItem.id == 0 ? '添加组队活动信息' : '编辑组队活动信息'" -->
        <el-form :model="teamInfo" ref="teamInfo" :rules="teamDataRules">
          <div class="section-list">
            <div class="section-left"><span class="team-left-blod">组队活动名称</span></div>
            <div class="section-right">
              <el-form-item prop="title">
                <el-input
                  maxlength="36"
                  v-model="teamInfo.title"
                  placeholder="请输入活动名称"
                />
              </el-form-item>
            </div>
          </div>
          <div class="section-list">
            <div class="section-left">活动周期</div>
            <div class="section-right time-outer">
              <el-form-item prop="start_time">
                <el-date-picker
                  v-model="teamInfo.start_time"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm"
                  format="yyyy-MM-dd HH:mm"
                  placeholder="请选择开始日期"
                >
                </el-date-picker>
              </el-form-item>
              <span class="time-text">至</span>
              <el-form-item prop="end_time">
                <el-date-picker
                  class="end-time"
                  v-model="teamInfo.end_time"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm"
                  format="yyyy-MM-dd HH:mm"
                  placeholder="请选择结束日期"
                >
                </el-date-picker>
              </el-form-item>
            </div>
          </div>
           <div class="section-list">
              <div class="section-left">可用充电站</div>
              <div class="section-right coupon-connect-btn">
                  <el-form-item class="radio-outer">
                      <el-radio v-model="teamInfo.station_status" label="1"
                      >全部可用</el-radio
                      >
                      <el-radio v-model="teamInfo.station_status" label="2"
                      >部分可用</el-radio
                      >
                  </el-form-item>
                  <div
                  class="if-radio-box"
                  v-if="teamInfo.station_status == '1' ? false : true"
                  >
                      <el-form-item style="width: 400px">
                          <div class="listUser-content scrollBar clearfix">
                              <div
                              class="listUser-item"
                              v-for="(item, index) in can_use_station.rules"
                              :key="index"
                              >
                                  <span>{{ getUsersById(item) }}</span>
                                  <i class="clear-icon" @click="deleteUserById(item)"></i>
                              </div>
                          </div>
                      </el-form-item>
                      <div class="btn_succ pop-chosse-pile" @click="choosePiles()">
                          选择充电站
                      </div>
                  </div>
              </div>
          </div>
          <div class="section-list section-list-24">
            <div class="section-left"><span class="team-left-blod"> 活动条件</span></div>
            <div class="section-right">
              <div class="team-pay">
                <span class="team-ac-enjoy">团队最多</span>
                <el-form-item prop="people_number">
                  <el-input
                    class="input-144"
                    onkeypress="if(value.length>10)value=value.slice(0,10)"
                    oninput="if(value<0)value=1"
                    type="number"
                    v-model="teamInfo.people_number"
                    placeholder="请输入人数"
                  />
                </el-form-item>
                <span class="team-ac-enjoy">人，在</span>
                <el-form-item prop="expire_day" class="only-i-bottom">
                  <el-input
                    class="input-144"
                    onkeypress="if(value.length>10)value=value.slice(0,10)"
                    oninput="if(value<0)value=1"
                    type="number"
                    v-model="teamInfo.expire_day"
                    placeholder="请输入有效天数"
                  />
                  <i class="only-i-spe">*有效期从发起组队开始计算</i>
                </el-form-item>
                <span class="team-ac-enjoy">天，支付总额满</span>
                <el-form-item prop="total_amount">
                  <el-input
                    class="input-160"
                    onkeypress="if(value.length>10)value=value.slice(0,10)"
                    oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')"
                    type="number"
                    v-model="teamInfo.total_amount"
                    placeholder="请输入金额"
                  />
                  
                </el-form-item>
                <span class="team-ac-enjoy">元</span>
              </div>
            </div>
          </div>
          <div class="section-list">
            <div class="section-left"><span class="team-left-blod"> 活动优惠</span></div>
            <div class="section-right">
              <div class="team-pay">
                <span class="team-ac-enjoy">赠送团队成员每人</span>
                <el-form-item prop="number">
                  <el-input
                    class="input-144"
                    type="number"
                    onkeypress="if(value.length>10)value=value.slice(0,10)"
                    oninput="if(value<0)value=1"
                    v-model="teamInfo.number"
                    placeholder="请输入优惠券数量"
                  />
                </el-form-item>
                <span class="team-ac-enjoy">张</span>
                <el-form-item prop="discount">
                  <el-input
                    class="input-160"
                    type="number"
                    oninput="if(value>10)value=10"
                    onkeypress="if(value.length>11)value=value.slice(0,2)"
                    @input="input"
                    v-model="teamInfo.discount"
                    placeholder="请输入优惠折扣1.0-10.0"
                  />
                </el-form-item>
                <span class="team-ac-enjoy">折优惠券，服务金额满</span>
                <el-form-item prop="min_good_amount"  class="only-i-bottom">
                  <el-input
                    class="input-144"
                    type="number"
                    onkeypress="if(value.length>10)value=value.slice(0,10)"
                    oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')"
                    v-model="teamInfo.min_good_amount"
                    placeholder="请输入金额"
                  />
                  <i class="only-i">*仅服务费享受优惠</i>
                </el-form-item>
                <span class="team-ac-enjoy">元时可以使用，</span>
                <div class="zhe-hang">
                  <span class="team-ac-enjoy">有效期</span>
                  <el-form-item prop="bonus_expire"  class="only-i-bottom">
                  <el-input
                    class="input-144"
                    type="number" 
                    onkeypress="if(value.length>10)value=value.slice(0,10)"
                    oninput="if(value<0)value=1"
                    v-model="teamInfo.bonus_expire"
                    placeholder="请输入有效天数"
                  />
                  <i class="only-i">*从发券后开始计算</i>
                  <span class="team-unit">天</span>
                </el-form-item>
                </div>
              </div>
            </div>
          </div>
          <div class="section-list">
            <div class="section-left"><span>活动规则</span></div>
            <div class="section-right">
              <el-form-item>
                <el-input
                  class="input-640 scrollBar"
                  maxlength="500"
                  type="textarea"
                  v-model="teamInfo.rule_describe"
                  placeholder="活动规则将展示在APP上，用户直接阅读，添加规则时请考虑全面，写明详细情况。"
                />
                
              </el-form-item>
              <el-tooltip
                      class="item-pop"
                      content=""
                      placement="right"
              >
                <div slot="content" class="slot-content" style="line-height:18px;">
                  <div class="pop-blod">活动规则添加规则：</div>
                  1、活动规则将会展示在APP上，编辑是需要严谨。
                  <br />2、可以将活动的具体详情列出。
                  <br /> 3、组队有效期到了后队伍解散，解散1小时内发放优惠券。
                  <div class="pop-blod pop-blod-top">* 例如</div>
                  活动详情介绍：
                   <br />1. 可在活动充电站内充电，支付后算入金额。 
                   <br />2. 用户充电满足当前支付总额后，组队有效期到了后队伍解散，解散 1 小时内发放优惠券。 
                   <br />3. 如有其他疑问可拨打客服热线。
                </div>
                <div class="tips-icon"></div>
              </el-tooltip>
            </div>
          </div>
        </el-form>
      </div>
      <div class="section-item-header team-header"></div>
      <div
        class="box-bottom clearfix"
        style="display: flex; justify-content: center; margin-top: 20px"
      >
        <div class="btn_succ" @click="saveActivitySure(currentItem.id)">
          提交
        </div>
      </div>
    </div>
    <!-- 控制显示隐藏的isChoosePiles；把接口请求到的数据stationData传过去；剩下的时候传过来的数据 -->
    <sf-pileStation
    class="veh-couponac-box"
    :isChoosePiles="isChoosePiles"
    @updateuserarr="userArr11"
    @updatemodelinfo="modelInfo11"
    :stationData="stationData"
    ></sf-pileStation>
  </section>
</template>

<script>
export default {
  data() {
    return {
      stationData: [], //需要传过去的res.data
      isConnectPiles: true, //关联充电站为空,显示暂无数据
      userArr: [],
      isChoosePiles: false,
      //----以上充电桩列表需要传过去的值

      rules: [],
      can_use_station: {
          rules: [],
      }, //已经选中的充电站id
      // 以上是充电站样式列表需要用到的值

      isShowWriteWord: false, //显示‘编辑活动’或者‘添加活动’
      currentPage: 1,
      page_count: 1,
      listLoading: false,
      currentItem: {
        id: 0,
      },
      detailId : this.$route.query.id,
      teamInfo: {
        title: '',
        start_time: '',
        end_time: '',
        people_number: "",
        expire_day: "",
        total_amount: "",
        number: "",
        discount: "",
        min_good_amount: "",
        bonus_expire:'',
        rule_describe: "",
        station_status: '2',
        stations: []
      },
      // 时间判断
      teamDataRules: {
        title: [{ required: true, message: "* 请填写活动名称", trigger: "blur" }],
        people_number: [{ required: true, message: "* 请填写组队人数", trigger: "blur" }],
        expire_day: [{ required: true, message: "* 请填写有效期", trigger: "blur" }],
        total_amount: [{ required: true, message: "* 请填写金额", trigger: "blur" }],
        
        number: [{ required: true, message: "* 请填写优惠券数量", trigger: "blur" }],
        discount: [{ required: true, message: "* 请填写优惠折扣", trigger: "blur" }],
        min_good_amount: [{ required: true, message: "* 请填写服务金额", trigger: "blur" }],
        bonus_expire: [{ required: true, message: "* 请填写优惠券有效期", trigger: "blur" }],
      },
    };
  },
  mounted() {
    this.$nextTick(() => {
      document.documentElement.style.minWidth = "1300px";
    });
  },
  created() {
    this.getAvailableStations();

    // 通过id,判断是从编辑页面过来才能填数据，保证刷新页面数据不丢失
    if (this.$route.query.id) {
      this.isShowWriteWord = true;
      this.getTeamDetail();
      this.currentItem.id = JSON.parse(this.$route.query.id);
    }
  },
  methods: {
    userArr11(val) {
        this.userArr = val;
    },
    modelInfo11(val) {
        this.can_use_station = val;
    },
    choosePiles() {
        this.isChoosePiles = !this.isChoosePiles;
    },
    //获取用户
    getUsersById(id) {
        if (this.userArr.length == 0) return "";
        let _item = null;
        _item = this.userArr.filter((item) => item.id == id);
        return _item[0].name;
    },
    deleteUserById(id) {
        var index = this.can_use_station.rules.indexOf(id);
        if (index > -1) {
            this.can_use_station.rules.splice(index, 1);
        }
    },
    input(e){
      e=(e.match(/^\d*(\.?\d{0,1})/g)[0]) || null
      this.teamInfo.discount = e
    },
    //获取充电站列表
    getAvailableStations() {
        let that = this;
        this.$api.teamStatusList({ id : this.detailId }).then((data) => {
            if (data.code == 1) {
                let list = data.data;
                this.stationData = list;
            }
        });
    },
    //*************以上方法是充电站列表需要的
    getTeamDetail() {
      this.$api.teamDeatil({id : this.detailId}).then(data => {
        if (data.code == 1) {
          this.teamInfo.title = data.data.title;
          this.teamInfo.start_time = data.data.start_time;
          this.teamInfo.end_time = data.data.end_time;
          this.teamInfo.people_number = data.data.people_number;
          this.teamInfo.expire_day = data.data.expire_day;
          this.teamInfo.total_amount = data.data.total_amount;
          this.teamInfo.number = data.data.number;
          this.teamInfo.discount = data.data.discount;
          this.teamInfo.min_good_amount = data.data.min_good_amount;
          this.teamInfo.bonus_expire = data.data.bonus_expire;
          this.teamInfo.rule_describe = data.data.rule_describe;
          this.teamInfo.station_status = data.data.station_status;
          this.teamInfo.stations = data.data.stations;
        }
      });
    },
    handleBackAc(num) {
      this.$router.push({ path: "/activity/team" });
    },
    saveActivitySure(id) {
      this.teamInfo.stations = this.teamInfo.station_status == "1"
                                ? []
                                : this.can_use_station.rules;//部分可用列表
      // 验证是否选择车型
      if (this.teamInfo.station_status == "2" && !this.teamInfo.stations) {
        this.$sfNotify({
          duration: 0,
          type: "error",
          message: "请选择充电站",
        });
        return false;
      }
      if(this.teamInfo.discount<1 ||this.teamInfo.discount>10 ){
        this.$sfNotify({
          duration: 0,
          type: "error",
          message: '优惠折扣范围为1.0~10.0',
        });
        return false;
      }
      if(new Date(this.teamInfo.end_time).getTime() <= new Date(this.teamInfo.start_time).getTime()){
        this.$sfNotify({
          duration: 0,
          type: "error",
          message: '结束时间应该大于开始时间',
        });
        return false;
      }
      if (id == 0) {
        // 添加
        this.$refs["teamInfo"].validate((valid) => {
          if (valid) {
            this.$api.teamCreate(this.teamInfo).then((data) => {
              if (data.code == 1) {
                this.$sfNotify({
                  message: "成功",
                });
                setTimeout(this.getTableDataList, 2000);
                this.$router.push({ path: "/activity/team" });
              } else {
                this.$sfNotify({
                  duration: 0,
                  type: "error",
                  message: data.message,
                });
              }
            });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      } else {
        this.$refs["teamInfo"].validate((valid) => {
          if (valid) {
            this.teamInfo.id = id;
            
            this.$api.teamEdit(this.teamInfo).then((data) => {
              if (data.code == 1) {
                this.$sfNotify({
                  message: "成功",
                });
                setTimeout(this.getTableDataList, 2000);
                this.$router.push({ path: "/activity/team" });
              } else {
                this.$sfNotify({
                  duration: 0,
                  type: "error",
                  message: data.message,
                });
              }
            });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }
    },

  },
  destroyed() {
    document.documentElement.style.minWidth = "1200px";
  },
};
</script>
<style lang="scss">
.el-tooltip__popper.is-dark {
  max-width:298px;
}
</style>
<style lang="scss" scoped>
@import "../../assets/css/activity/teamAdd.scss";
</style>
