<template>
  <section>
    <div class="section-title">
      <router-link to="/activity/coupon">优惠券管理</router-link> > 编辑优惠券
    </div>
    <div class="section-container">
      <div class="section-item-header clearfix">
        <span>优惠券信息</span>
      </div>
      <div class="section-content">
        <el-form
          :model="modelInfo"
          ref="modelInfo"
          :rules="dataRules"
        >
          <div class="section-list">
            <div class="section-left">发券方式</div>
            <div class="section-right">
              <el-form-item prop="type">
                <el-select v-model="modelInfo.type">
                  <el-option
                    label="邀请新用户"
                    value="1"
                  />
                  <el-option
                    label="充值"
                    value="2"
                  />
                </el-select>
              </el-form-item>
            </div>
          </div>
          <div class="section-list">
            <div class="section-left">获得条件</div>
            <div class="section-right">
              <template v-if="modelInfo.type == 1">
                <el-input
                   v-model="modelInfo.min_amount"
                   disabled
                />
              </template>
              <template v-else>
                <el-form-item prop="condition">
                  <span class="unit">一次性充值</span>
                  <el-input
                     class="amount-input condition-input"
                     v-model="modelInfo.condition"
                     placeholder="输入金额"
                  />
                  <span class="unit">元</span>
                </el-form-item>
              </template>
            </div>
          </div>
          <div class="section-list">
            <div class="section-left">面值</div>
            <div class="section-right">
              <el-form-item prop="money">
                <el-input
                  class="amount-input"
                  v-model.number="modelInfo.money"
                  placeholder="输入优惠券面值"
                />
                <span class="unit">元</span>
              </el-form-item>
            </div>
          </div>
          <div class="section-list">
            <div class="section-left">使用条件</div>
            <div class="section-right">
              <el-form-item prop="min_good_amount">
                <span class="unit">满</span>
                <el-input
                  class="amount-input condition-input"
                  v-model="modelInfo.min_good_amount"
                  placeholder="输入金额"
                />
                <span class="unit">元可用</span>
              </el-form-item>
            </div>
          </div>
          <div class="section-list">
            <div class="section-left">数量</div>
            <div class="section-right">
              <el-form-item prop="count">
                <el-input
                  class="amount-input"
                  v-model.number="modelInfo.count"
                  placeholder="输入优惠券数量"
                />
                <span class="unit">张</span>
              </el-form-item>
            </div>
          </div>
          <div class="section-list">
            <div class="section-left">有效期</div>
            <div class="section-right">
              <el-form-item prop="exp">
                <el-input
                  class="amount-input"
                  v-model.number="modelInfo.exp"
                  placeholder="领取后到期天数"
                />
                <span class="unit">天</span>
              </el-form-item>
            </div>
          </div>
          <div class="section-list">
            <div class="section-left">使用权限</div>
            <div class="section-right">
              <div class="checkbox-item checkbox-all">
                <span class="checkbox-icon" :class="{'checkbox-act-icon':checkbox_all}"  @click="handleCheckedAll"></span>全选
              </div>
              <!-- 权限列表 -->
              <div class="auth-outer scrollBar">
                <div class="checkbox-item"
                     v-for="(station, index) in station_arr"
                     :key="index"
                >
                  <span class="checkbox-icon"
                        :class="{'checkbox-act-icon': modelInfo.station_list.indexOf(station.station_id) != -1}"
                        @click="handleChecked(station.station_id)"
                  ></span>{{station.station_name}}
                </div>
              </div>
            </div>
          </div>
        </el-form>
      </div>
      <div
        class="btn_succ"
        @click="saveCouponSure"
      >提交</div>
    </div>

  </section>
</template>

<script>
export default {
  name: "",
  components: {},
  data() {
    var validateCondition = (rule, value, callback) => {
      if (this.modelInfo.type == 2 && value === '') {
        callback(new Error('请输入充值金额'));
      } else {
        callback();
      }
    };

    return {
      id: this.$route.params.id,
      modelInfo: {
        type: "1",
        min_amount: "新用户消费后",
        condition:'',
        money: "",
        min_good_amount: "",
        count: "",
        exp: "",
        station_list:[],
      },
      checkbox_all:false,
      station_arr:[],
      station_ids: [],
      dataRules: {
        condition: [
          { validator: validateCondition, trigger: 'blur' }
        ],
        money: [
          { required: true, message: "* 请输入优惠券面值", trigger: "change" },
          {
            type: "number",
            message: "优惠券面值必须为数字值",
            trigger: "change"
          }
        ],

        min_good_amount: [{ required: true, message: "* 请输入金额", trigger: "change" }],
        count: [
          { required: true, message: "* 请输入优惠券数量", trigger: "change" }
        ],
        exp: [
          {
            required: true,
            message: "* 请输入领取后到期天数",
            trigger: "change"
          }
        ]
      },
    };
  },
  created() {
    this.getCouponInfo();
    this.getAvailableStations();
  },
  methods: {
    getCouponInfo() {
      let that = this;
      this.$api.bonusInfo({id: this.id}).then(data => {
        if (data.code == 1) {
          let info = data.data;
          this.modelInfo.type = info.type;
          if (info.type == 2) {
            this.modelInfo.condition = info.min_amount/100;
          }
          this.modelInfo.money = parseInt(info.money)/100;
          this.modelInfo.min_good_amount = info.min_good_amount/100;
          this.modelInfo.count = info.count;
          this.modelInfo.exp = info.exp;
          if (info.stations.length > 0) {
            info.stations.forEach(function (e) {
              that.modelInfo.station_list.push(e.station_id);
            })
          }
        }
      });
    },
    getAvailableStations() {
      let that = this;
      this.$api.bonusGetStation().then(data => {
        if (data.code == 1) {
          let list = data.data.list;
          this.station_arr = list;
          list.forEach(function (e) {
            that.station_ids.push(e.station_id);
          })
        }
      });
    },
    handleCheckedAll(){
      this.modelInfo.station_list = this.checkbox_all ? []: JSON.parse(JSON.stringify(this.station_ids));
      this.checkbox_all = !this.checkbox_all;
    },

    handleChecked(id){
      var arr = this.modelInfo.station_list;
      if(arr.indexOf(id) != -1){
        arr.splice(arr.indexOf(id),1);
      }else{
        arr.push(id);
      }
      this.checkbox_all = arr.length == this.station_arr.length ? true:false;
    },
    saveCouponSure() {
      this.$refs["modelInfo"].validate(valid => {
        if (valid) {
          let params = {
            id: this.id,
            type: this.modelInfo.type,
            min_amount: this.modelInfo.type == 1 ? '0' : this.modelInfo.condition,
            money: this.modelInfo.money,
            min_good_amount: this.modelInfo.min_good_amount,
            count: this.modelInfo.count,
            exp: this.modelInfo.exp,
            station_list: this.modelInfo.station_list,
          };
          this.$api.bonusEdit(params).then(data => {
            if (data.code == 1) {
              this.$sfNotify({
                message: "成功"
              });
            } else {
              this.$sfNotify({
                duration: 0,
                type: "error",
                message: "失败"
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  }
};
</script>

<style scoped lang="scss">
@import "../../assets/css/activity/addCoupon.scss";
</style>
