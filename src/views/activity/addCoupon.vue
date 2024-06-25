<template>
  <section>
    <div class="section-title">
      <router-link to="/activity/coupon">优惠管理</router-link> >
      <span v-if="currentId ? false : true">新增优惠券</span>
      <span v-if="currentId ? true : false">编辑优惠券</span>
    </div>
    <div class="section-container">
      <div class="section-item-header clearfix">
        <span>优惠券信息</span>
      </div>
      <div class="section-content">
        <el-form :model="modelInfo" ref="modelInfo" :rules="dataRules">
          <div class="section-list">
            <div class="section-left">发券方式</div>
            <div class="section-right">
              <el-form-item prop="type">
                <el-select v-model="modelInfo.type">
                  <el-option label="邀请新用户" value="1" />
                  <el-option label="充值" value="2" />
                  <el-option label="商业合作" value="4" />
                  <el-option label="按照账号手动发放" value="5" />
                </el-select>
              </el-form-item>
            </div>
          </div>
          <div class="section-list">
            <div class="section-left">获得条件</div>
            <div class="section-right" v-if="modelInfo.type == '1' ? true : false">
              <span class="type-2">新用户消费后送</span>
            </div>
            <div class="section-right" v-if="modelInfo.type == '2' ? true : false">
              <el-form-item prop="min_amount">
                <span class="unit">一次性充值</span>
                <el-input
                  oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')"
                  type="number" class="amount-input" v-model.number="modelInfo.min_amount" placeholder="请输入充值金额" />
                <span class="unit">元时送</span>
              </el-form-item>
            </div>
            <div class="section-right" v-if="modelInfo.type == '4' ? true : false">
              <span class="type-2">输入兑换码兑换优惠券</span>
            </div>
            <div class="section-right" v-if="modelInfo.type == '5' ? true : false">
              <el-form-item prop="money">
                <el-input oninput="if(value.length>11)value=value.slice(0,11)" type="number"
                  v-model.number="modelInfo.tel" placeholder="请输入用户账号" />
              </el-form-item>
            </div>
          </div>
          <div class="section-list">
            <div class="section-left">优惠券类型</div>
            <div class="section-right">
              <el-select v-model="modelInfo.coupon_type" placeholder="请选择享受优惠的群组名称">
                <el-option v-for="(item, index) in enjoy_group" :key="index" :label="item.title" :value="item.id" />
              </el-select>
              <span class="conpou-type" v-if="modelInfo.coupon_type == 1">（账单享受优惠）</span>
              <span class="conpou-type" v-if="modelInfo.coupon_type == 2">（仅服务费享受优惠）</span>
              <span class="conpou-type" v-if="modelInfo.coupon_type == 3">（仅电费享受优惠）</span>
            </div>
          </div>
          <div class="section-list">
            <div class="section-left">优惠明细</div>
            <div class="section-right">
              <el-form-item prop="money" v-if="modelInfo.coupon_type == '1'">
                <el-input class="amount-input" v-model="modelInfo.money"
                  oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')"
                  placeholder="请输入优惠金额" />
                <span class="unit">元</span>
              </el-form-item>
              <el-form-item prop="money" v-if="modelInfo.coupon_type == '2'">
                <el-input
                  oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d).*$/, '$1$2.$3').replace(/^\./g, '');if(parseFloat(value)>=10)value=10"
                  class="amount-input" v-model="modelInfo.money" placeholder="请输入优惠折扣" />
                <span class="unit">折</span>
              </el-form-item>
              <el-form-item prop="money" v-if="modelInfo.coupon_type == '3'">
                <el-input
                  oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^\./g, '')"
                  class="amount-input" v-model="modelInfo.money" placeholder="请输入优惠度数" :maxlength="6" />
                <span class="unit">度</span>
              </el-form-item>
            </div>
          </div>
          <div class="section-list">
            <div class="section-left">使用条件</div>
            <div class="section-right">
              <el-form-item prop="min_good_amount">
                <span class="unit" v-if="modelInfo.coupon_type == '1'">应付金额满</span>
                <span class="unit" v-if="modelInfo.coupon_type == '2'">服务费金额满</span>
                <span class="unit" v-if="modelInfo.coupon_type == '3'">充电度数满</span>
                <el-input
                  oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')"
                  type="number" class="amount-input condition-input" v-model="modelInfo.min_good_amount"
                  placeholder="请输入额度" />
                <span class="unit" v-if="modelInfo.coupon_type != '3'">元可用</span>
                <span class="unit" v-if="modelInfo.coupon_type == '3'">度可用</span>
              </el-form-item>
            </div>
          </div>
          <div class="section-list">
            <div class="section-left">数量</div>
            <div class="section-right">
              <el-form-item prop="count">
                <el-input oninput="if(value.length>11)value=value.slice(0,11)" type="number" class="amount-input"
                  v-model.number="modelInfo.count" placeholder="请输入优惠券数量" />
                <span class="unit">张</span>
              </el-form-item>
            </div>
          </div>
          <div class="section-list">
            <div class="section-left">有效期</div>
            <div class="section-right">
              <el-form-item prop="exp">
                <el-input oninput="if(value.length>11)value=value.slice(0,11)" type="number" class="amount-input"
                  v-model.number="modelInfo.exp" placeholder="请输入有效天数" />
                <span class="unit">天</span>
                <span class="conpou-type">（有效期从用户收到优惠券的时间开始计算）</span>
              </el-form-item>
            </div>
          </div>
          <div class="section-list">
            <div class="section-left">可用充电站</div>
            <!-- <div class="section-right">
              <div class="checkbox-item checkbox-all">
                <span class="checkbox-icon" :class="{'checkbox-act-icon':checkbox_all}"  @click="handleCheckedAll"></span>全选
              </div>
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
            </div> -->
            <div class="section-right coupon-connect-btn">
              <el-form-item class="radio-outer" prop="status">
                <el-radio v-model="modelInfo.station_status" label="1">全部可用</el-radio>
                <el-radio v-model="modelInfo.station_status" label="2">部分可用</el-radio>
              </el-form-item>
              <div class="if-radio-box" v-if="modelInfo.station_status == '1' ? false : true">
                <el-form-item prop="title" style="width: 400px">
                  <div class="listUser-content scrollBar clearfix">
                    <div class="listUser-item" v-for="(item, index) in can_use_station.rules" :key="index">
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
        </el-form>
      </div>
      <div class="btn_succ" @click="saveCouponSure">提交</div>
    </div>
    <!-- 控制显示隐藏的isChoosePiles；把接口请求到的数据stationData传过去；剩下的时候传过来的数据 -->
    <sf-pileStation class="veh-coupon-box" :isChoosePiles="isChoosePiles" @updateuserarr="userArr11"
      @updatemodelinfo="modelInfo11" :stationData="stationData"></sf-pileStation>
  </section>
</template>

<script>
import logVue from '../device/log.vue'
export default {
  name: '',
  components: {},
  data() {
    var validateCondition = (rule, value, callback) => {
      if (this.modelInfo.coupon_type == 2 && value === '') {
        callback(new Error('请输入充值金额'))
      } else {
        callback()
      }
    }

    return {
      stationData: [], //需要传过去的res.data
      isConnectPiles: true, //关联充电站为空,显示暂无数据
      userArr: [],
      isChoosePiles: false,
      //----以上充电桩列表需要传过去的值

      rules: [],
      // roleTypeRules: [],
      // all_rules_ids: [],
      // checkbox_all: false,
      can_use_station: {
        rules: []
      }, //已经选中的充电站id
      // pop_id: this.$route.query.id,
      // 以上是充电站样式列表需要用到的值

      enjoy_group: [
        {
          title: '现金券',
          id: '1'
        },
        {
          title: '折扣券',
          id: '2'
        },
        {
          title: '电度券',
          id: '3'
        }
      ],
      currentId: this.$route.query.id,
      modelInfo: {
        type: '2',
        coupon_type: '1',
        min_amount: '',
        condition: '',
        money: '',
        min_good_amount: '',
        count: '',
        exp: '',
        station_list: [],
        station_status: '2'
      },
      checkbox_all: false,
      // station_arr: [],
      // station_ids: [],
      dataRules: {
        condition: [{ validator: validateCondition, trigger: 'blur' }],
        money: [
          { required: true, message: '* 请输入优惠券面值', trigger: 'change' }
        ],

        min_good_amount: [
          { required: true, message: '* 请输入额度', trigger: 'change' }
        ],
        count: [
          { required: true, message: '* 请输入优惠券数量', trigger: 'change' }
        ],
        exp: [
          {
            required: true,
            message: '* 请输入领取后到期天数',
            trigger: 'change'
          }
        ]
      }
    }
  },
  created() {
    this.getAvailableStations()
    if (this.$route.query.id) {
      this.getCouponInfo()
    }
  },
  methods: {
    userArr11(val) {
      this.userArr = val
    },
    modelInfo11(val) {
      this.can_use_station = val
    },
    choosePiles() {
      this.isChoosePiles = !this.isChoosePiles
    },
    //获取用户
    getUsersById(id) {
      if (this.userArr.length == 0) return ''
      let _item = null
      _item = this.userArr.filter((item) => item.id == id)
      console.log('_item', _item)
      return _item[0].name
    },
    deleteUserById(id) {
      console.log('iddd', this.can_use_station.rules)
      var index = this.can_use_station.rules.indexOf(id)
      if (index > -1) {
        this.can_use_station.rules.splice(index, 1)
      }
    },
    //*******一定不要忘，下面返现有个重新获取充电站id的 getStationList  {id ： id}*/
    //*************以上方法是充电站列表需要的

    //编辑
    getCouponInfo() {
      let that = this
      this.$api.bonusInfo({ id: this.$route.query.id }).then((data) => {
        if (data.code == 1) {
          this.modelInfo = data.data
          if (data.data.coupon_type == '2') {
            const _length = data.data.discount.length
            this.modelInfo.money = data.data.discount.substr(0, _length - 1)
          }
          this.modelInfo.station_list = data.data.stations
        }
      })
    },

    getAvailableStations() {
      let that = this
      this.$api.bonusGetStation({ id: this.currentId }).then((data) => {
        if (data.code == 1) {
          let list = data.data
          // this.station_arr = list;
          this.stationData = list
          // list.forEach(function (e) {
          //   that.station_ids.push(e.station_id);
          // });
        }
      })
    },
    //------另一种形式的全选框
    // handleCheckedAll() {
    //   this.modelInfo.station_list = this.checkbox_all
    //     ? []
    //     : JSON.parse(JSON.stringify(this.station_ids));
    //   this.checkbox_all = !this.checkbox_all;
    // },
    // handleChecked(id) {
    //   var arr = this.modelInfo.station_list;
    //   if (arr.indexOf(id) != -1) {
    //     arr.splice(arr.indexOf(id), 1);
    //   } else {
    //     arr.push(id);
    //   }
    //   this.checkbox_all = arr.length == this.station_arr.length ? true : false;
    // },
    saveCouponSure() {
      if (this.$route.query.id) {
        this.$refs['modelInfo'].validate((valid) => {
          if (valid) {
            let params = {
              id: this.$route.query.id,
              type: this.modelInfo.type,
              coupon_type: this.modelInfo.coupon_type,
              min_amount:
                this.modelInfo.type == 1 ? '0' : this.modelInfo.min_amount,
              money: this.modelInfo.money,
              min_good_amount: this.modelInfo.min_good_amount,
              count: this.modelInfo.count,
              exp: this.modelInfo.exp,
              station_status: this.modelInfo.station_status,
              tel: this.modelInfo.type == '5' ? this.modelInfo.tel : '',
              station_list:
                this.modelInfo.station_status == '1'
                  ? []
                  : this.can_use_station.rules
            }
            this.$api.bonusEdit(params).then((data) => {
              if (data.code == 1) {
                this.$sfNotify({
                  message: '成功'
                })
                this.$router.push({ path: '/activity/coupon' })
              } else {
                this.$sfNotify({
                  duration: 0,
                  type: 'error',
                  message: data.message
                })
              }
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      } else {
        this.$refs['modelInfo'].validate((valid) => {
          if (valid) {
            let params = {
              type: this.modelInfo.type,
              coupon_type: this.modelInfo.coupon_type,
              min_amount:
                this.modelInfo.type == 1 ? '0' : this.modelInfo.min_amount,
              money: this.modelInfo.money,
              min_good_amount: this.modelInfo.min_good_amount,
              count: this.modelInfo.count,
              exp: this.modelInfo.exp,
              station_status: this.modelInfo.station_status,
              tel: this.modelInfo.type == '5' ? this.modelInfo.tel : '',
              station_list:
                this.modelInfo.station_status == '1'
                  ? []
                  : this.can_use_station.rules
            }
            this.$api.bonusCreate(params).then((data) => {
              if (data.code == 1) {
                this.$sfNotify({
                  message: '成功'
                })
                this.$router.push({ path: '/activity/coupon' })
              } else {
                this.$sfNotify({
                  duration: 0,
                  type: 'error',
                  message: data.message
                })
              }
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../assets/css/activity/addCoupon.scss';
</style>
