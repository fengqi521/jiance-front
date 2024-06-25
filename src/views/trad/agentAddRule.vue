<template>
  <section>
    <div class="section-title">
      <router-link to="/trad/agent">代理商分润管理</router-link> >
      <span v-if="currentId ? false : true">新增规则</span>
      <span v-if="currentId ? true : false">编辑规则</span>
    </div>
    <div class="section-container">
      <div class="section-item-header clearfix">
        <span>分润规则设置</span>
      </div>
      <div class="section-content" v-loading="listLoading">
        <el-form :model="modelInfo" ref="modelInfo" :rules="dataRules">
          <div class="section-list">
            <div class="section-left">代理商账号</div>
            <div class="section-right">
              <el-select v-model="modelInfo.user_id" placeholder="请选择代理商">
                <el-option
                  v-for="(item, index) in dropList"
                  :key="index"
                  :label="item.account"
                  :value="item.id"
                />
              </el-select>
            </div>
          </div>
          <div class="section-list">
            <div class="section-left">分润时间</div>
            <div class="section-right count-time">T+1 11:00点结算分润</div>
          </div>
          <div class="section-list only-i">
            <div class="section-left">分润费率</div>
            <div class="section-right section-rate">
              <div style="margin-right: 40px">
                <div class="section-rate-title">
                  <span>电费分润费率</span>
                </div>
                <el-form-item prop="separation_rate_elec" class="input-error">
                  <el-input
                    class="amount-input"
                    oninput="if(value>100)value=100"
                    onkeypress="if(value.length>3)value=value.slice(0,3)"
                    type="number"
                    v-model="modelInfo.separation_rate_elec"
                    placeholder="0-100"
                    :min="0"
                    max="100"
                  />
                  <span class="unit">%</span>
                </el-form-item>
              </div>
              <div>
                <div class="section-rate-title">
                  <span>服务费分润费率</span>
                </div>
                <el-form-item
                  prop="separation_rate_service"
                  class="input-error"
                >
                  <el-input
                    class="amount-input"
                    oninput="if(value>100)value=100"
                    onkeypress="if(value.length>3)value=value.slice(0,3)"
                    type="number"
                    v-model="modelInfo.separation_rate_service"
                    placeholder="0-100"
                  />
                  <span class="unit">%</span>
                </el-form-item>
              </div>
            </div>

            <i class="service-rate-tip"
              >实际分润费用=实际所收电费*费率+实际所收服务费*费率</i
            >
          </div>
          <div class="section-list">
            <div class="section-left">分润站点</div>
            <div class="section-right coupon-connect-btn">
              <div class="if-radio-box">
                <el-form-item prop="station_list" style="width: 304px">
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
                <div
                  class="btn_succ pop-chosse-pile"
                  :class="{ 'no-can-touch': !modelInfo.user_id }"
                  @click="choosePiles(modelInfo.user_id)"
                >
                  选择充电站
                </div>
              </div>
            </div>
          </div>
          <div class="section-list only-i">
            <div class="section-left">分润周期</div>
            <div class="section-right time-outer">
              <el-form-item prop="start_time" class="input-error">
                <el-date-picker
                  v-model="modelInfo.start_time"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm"
                  format="yyyy-MM-dd HH:mm"
                  placeholder="请选择开始日期"
                  :picker-options="pickerOptions"
                ></el-date-picker>
              </el-form-item>
              <span class="time-text">至</span>
              <el-form-item prop="end_time" class="input-error">
                <el-date-picker
                  class="end-time"
                  v-model="modelInfo.end_time"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm"
                  format="yyyy-MM-dd HH:mm"
                  placeholder="请选择结束日期"
                  :picker-options="pickerOptions"
                ></el-date-picker>
              </el-form-item>
            </div>
            <i>设置分润周期，在周期内站点产生的账单才会进行分润。</i>
          </div>
        </el-form>
      </div>
      <div class="btn_succ" @click="saveCouponSure">提交</div>
    </div>
    <!-- 控制显示隐藏的isChoosePiles；把接口请求到的数据stationData传过去；剩下的时候传过来的数据 -->
    <sf-pileStation
      class="station-box"
      :isChoosePiles="isChoosePiles"
      @updateuserarr="userArr11"
      @updatemodelinfo="modelInfo11"
      :stationData="stationData"
    ></sf-pileStation>
  </section>
</template>

<script>
export default {
  name: "",
  components: {},
  data() {
    const validateRate = async (rule, value, callback) => {
      if (
        !this.modelInfo.separation_rate_elec &&
        !this.modelInfo.separation_rate_service
      ) {
        return callback(
          new Error("* 电费分润费率和服务费分润费率至少填写一项")
        );
      }
      callback();
    };

    const validateServiceRate = async (rule, value, callback) => {
      if (
        !this.modelInfo.separation_rate_elec &&
        !this.modelInfo.separation_rate_service
      ) {
        return callback(new Error(" "));
      }

      callback();
    };
    return {
      listLoading: false,
      modelInfo: {
        user_id: "",
        start_time: "",
        end_time: "",
        separation_rate_elec: "",
        separation_rate_service: "",
        station_list: [],
      },
      dropList: [],
      default_user_id: "",

      // 设置只能选择当前日期及之后的日期
      pickerOptions: {
        disabledDate(time) {
          //如果没有后面的-8.64e7就是不可以选择今天的
          return time.getTime() < Date.now() - 8.64e7;
        },
      },

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

      currentId: this.$route.query.id,

      dataRules: {
        separation_rate_elec: [{ validator: validateRate, trigger: "change" }],
        separation_rate_service: [
          { validator: validateServiceRate, trigger: "change" },
        ],
        start_time: [
          { required: true, message: "* 请输入开始时间", trigger: "blur" },
        ],
        end_time: [
          { required: true, message: "* 请输入结束时间", trigger: "blur" },
        ],
      },
    };
  },
  watch: {
    "modelInfo.user_id": {
      handler: function (newItem, oldItem) {
        if (this.$route.query.id) {
          if (!oldItem) return false;
        }
        if (newItem != this.default_user_id) {
          this.modelInfo.station_list = [];
          this.modelInfo.user_id = newItem;
          this.can_use_station.rules = [];
          this.getAvailableStations();
        } else {
          this.getDetailInfo();
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.$nextTick(() => {
      document.documentElement.style.minWidth = "1200px";
    });
  },
  created() {
    this.getDropList();
    if (this.$route.query.id) {
      this.getDetailInfo();
    }
  },
  methods: {
    userArr11(val) {
      this.userArr = val;
    },
    modelInfo11(val) {
      this.can_use_station = val;
    },
    choosePiles(user_id) {
      if (!user_id) {
        return false;
      }
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
    //*******一定不要忘，下面返现有个重新获取充电站id的 getAvailableStations  {id ： id}*/
    //*************以上方法是充电站列表需要的
    getDropList() {
      var params = {
        type: "1",
      };
      if (this.$route.query.id) {
        params.id = this.$route.query.id;
      }
      this.$api.profitRulesdDrop(params).then((res) => {
        if (res.code == 1) {
          this.dropList = res.data;
          if (!this.$route.query.id) {
            if (this.dropList && this.dropList.length != 0) {
              this.modelInfo.user_id = this.dropList[0].id;
            }
          }
        }
      });
    },
    //获取充电站列表
    getAvailableStations() {
      this.$api
        .profitRulesdStation({
          id: this.currentId,
          user_id: this.modelInfo.user_id,
        })
        .then((data) => {
          if (data.code == 1) {
            let list = data.data;
            this.stationData = list;
          }
        });
    },
    //编辑 返显示
    getDetailInfo() {
      this.listLoading = true;
      let that = this;
      this.$api.profitEditDetail({ id: this.$route.query.id }).then((data) => {
        if (data.code == 1) {
          that.listLoading = false;
          that.default_user_id = data.data.user_id;
          that.modelInfo.user_id = data.data.user_id;
          that.modelInfo.start_time = data.data.start_time;
          that.modelInfo.end_time = data.data.end_time;
          that.modelInfo.separation_rate_elec = data.data.separation_rate_elec;
          this.modelInfo.separation_rate_service =
            data.data.separation_rate_service;
          that.modelInfo.station_list = data.data.stations;
          that.getAvailableStations();
        }
      });
    },
    saveCouponSure() {
      if (!this.modelInfo.station_list) {
        this.$sfNotify({
          duration: 0,
          type: "error",
          message: "请选择分润站点",
        });
        return false;
      }
      let params = {};
      if (!this.modelInfo.separation_rate_elec) {
        params.separation_rate_elec = "0";
      }
      if (!this.modelInfo.separation_rate_service) {
        params.separation_rate_service = "0";
      }
      if (this.$route.query.id) {
        this.modelInfo.id = this.$route.query.id;
        (this.modelInfo.station_list = this.can_use_station.rules), //部分可用列表
          //编辑

          this.$refs["modelInfo"].validate((valid) => {
            if (valid) {
              this.$api
                .profitEditList({ ...this.modelInfo, ...params })
                .then((data) => {
                  if (data.code == 1) {
                    this.$sfNotify({
                      message: "成功",
                    });
                    this.$router.push({ path: "/trad/agent" });
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
        // 添加
        this.$refs["modelInfo"].validate((valid) => {
          if (valid) {
            this.modelInfo.station_list = this.can_use_station.rules; //部分可用列表
            this.$api
              .profitAddList({ ...this.modelInfo, ...params })
              .then((data) => {
                if (data.code == 1) {
                  this.$sfNotify({
                    message: "成功",
                  });
                  this.$router.push({ path: "/trad/agent" });
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
    destroyed() {
      document.documentElement.style.minWidth = "1200px";
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../assets/css/trad/agentAddRule.scss";
</style>
