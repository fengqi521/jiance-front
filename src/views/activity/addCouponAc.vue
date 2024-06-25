<template>
    <section>
        <div class="section-title">
            <router-link to="/activity/machine">车辆优惠管理</router-link> >
            <span v-if="currentId ? false : true">新增优惠活动</span>
            <span v-if="currentId ? true : false">编辑优惠活动</span>
        </div>
        <div class="section-container">
            <div class="section-item-header clearfix">
                <span>优惠活动信息</span>
            </div>
            <div class="section-content">
                <el-form
                :model="modelInfo"
                ref="modelInfo"
                :rules="dataRules"
                >
                    <div class="section-list">
                        <div class="section-left">优惠活动名称</div>
                        <div class="section-right">
                            <el-form-item prop="type">
                                <el-input
                                v-model.number="modelInfo.title"
                                placeholder="请输入活动名称"
                                />
                            </el-form-item>
                        </div>
                    </div>
                    <div class="section-list">
                        <div class="section-left">优惠明细</div>
                        <div class="section-right">
                            <el-form-item prop="money">
                                <span class="unit">服务费</span>
                                <el-input
                                class="amount-input"
                                oninput="if(value>10)value=10"
                                onkeypress="if(value.length>11)value=value.slice(0,2)"
                                type="number"
                                v-model="modelInfo.service_discount"
                                placeholder="0.0-10.0"
                                />
                                <span class="unit">折，电费</span>
                                <el-input
                                class="amount-input"
                                oninput="if(value>10)value=10"
                                onkeypress="if(value.length>11)value=value.slice(0,2)"
                                type="number"
                                v-model="modelInfo.elec_discount"
                                placeholder="0.0-10.0"
                                />
                                <span class="unit">折</span>
                            </el-form-item>
                        </div>
                    </div>
                    <div class="section-list">
                        <div class="section-left">优惠周期</div>
                        <div class="section-right time-outer">
                            <el-form-item prop="start_time">
                                <el-date-picker
                                v-model="modelInfo.start_time"
                                type="datetime"
                                value-format="yyyy-MM-dd HH:mm"
                                format="yyyy-MM-dd HH:mm"
                                placeholder="选择开始日期"
                                ></el-date-picker>
                            </el-form-item>
                            <span class="time-text">至</span>
                            <el-form-item prop="end_time">
                                <el-date-picker
                                class="end-time"
                                v-model="modelInfo.end_time"
                                type="datetime"
                                value-format="yyyy-MM-dd HH:mm"
                                format="yyyy-MM-dd HH:mm"
                                placeholder="选择结束日期"
                                ></el-date-picker>
                            </el-form-item>
                        </div>
                    </div>
                    <div class="section-list" style="padding-bottom:8px;">
                        <div class="section-left">优惠对象</div>
                        <div class="section-right">
                            <el-form-item class="radio-outer" prop="status" >
                                <el-radio v-model="modelInfo.type" label="2">企业</el-radio>
                                <el-radio v-model="modelInfo.type" label="1">个人群组</el-radio>
                            </el-form-item>
                        </div>
                    </div>
                    <div class="section-list">
                        <div class="section-left"></div>
                        <div class="section-right">
                            <el-select
                            v-model="preferential_object"
                            placeholder="请选择">
                                <el-option
                                v-for="(item, index) in drop_list"
                                :key="index"
                                :label="item.title"
                                :value="item.title"
                                />
                            </el-select>
                        </div>
                    </div>
                    <div class="section-list">
                        <div class="section-left">可用充电站</div>
                        <div class="section-right coupon-connect-btn">
                            <el-form-item class="radio-outer" prop="status">
                                <el-radio v-model="modelInfo.limit_station_type" label="1"
                                >全部可用</el-radio
                                >
                                <el-radio v-model="modelInfo.limit_station_type" label="2"
                                >部分可用</el-radio
                                >
                            </el-form-item>
                            <div
                            class="if-radio-box"
                            v-if="modelInfo.limit_station_type == '1' ? false : true"
                            >
                                <el-form-item prop="title" style="width: 400px">
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
                </el-form>
            </div>
            <div
            class="btn_succ"
            @click="saveCouponSure"
            >提交</div>
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
                enjoy_group:[],
                enjoy_company_group:[],
                drop_list:[],
                currentId: this.$route.query.id,
                preferential_object:'', //享受优惠群组id
                temp_preferential_object:'',
                default_type:'1',
                modelInfo: {
                    title: "",
                    start_time:'',
                    end_time:'',
                    type: this.default_type,//群组类型
                    service_discount:'',//服务费折扣
                    elec_discount:'',//电费折扣

                    station_list:[],

                    limit_station_type:'1'//充电站的类型 1代表全部可用 2代表部分可用
                },
                dataRules: {
                    // condition: [
                    //   { validator: validateCondition, trigger: 'blur' }
                    // ],
                    // money: [
                    //   { required: true, message: "* 请输入优惠券面值", trigger: "change" },
                    //   {
                    //     type: "number",
                    //     message: "优惠券面值必须为数字值",
                    //     trigger: "change"
                    //   }
                    // ],

                    // min_good_amount: [{ required: true, message: "* 请输入金额", trigger: "change" }],
                    // count: [
                    //   { required: true, message: "* 请输入优惠券数量", trigger: "change" }
                    // ],
                    // exp: [
                    //   {
                    //     required: true,
                    //     message: "* 请输入领取后到期天数",
                    //     trigger: "change"
                    //   }
                    // ]
                },
            };
        },
        created() {
            this.getEnjoyGetCompanyAdd(this.modelInfo.type)
            this.getAvailableStations();
            if(this.$route.query.id){
                this.getPreferentialInfo()
            }else{
                //为watch的undefined做准备
                this.modelInfo.type = this.default_type
            }
        },
       watch:{
           "modelInfo.type":{
               handler: function (newItem,oldItem) {
                   this.getEnjoyGetCompanyAdd(this.modelInfo.type)

                    //目的：为了防止编辑的时候，清空默认值
                   //刚开始路由过来的时候，可能与我的默认值不一样，就会触发watch；
                   //this.temp_preferential_object就会和this.preferential_object不相等，清空编辑传过来的默认值，变成空值
                   if(this.$route.query.id){
                       if(oldItem == undefined){
                            return ;
                        }
                        //目的：保证每次切换的时候默认值消失(有路由的时候)
                        //路由来的时候，设置唯一的标识；
                        //保证每次切换下面的this.temp_preferential_object和this.preferential_object一直不想等
                        //type切换就清空
                        this.temp_preferential_object= 'different'
                   }

                    if(this.temp_preferential_object != this.preferential_object){
                        this.preferential_object = '';
                    }
               },
               deep: true,
           },
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
            //*******一定不要忘，下面返现有个重新获取充电站id的 getStationList  {id ： id}*/
            //*************以上方法是充电站列表需要的
            getEnjoyGetCompanyAdd(type) {
                let that = this;
                this.$api.preferentialAcGetCompanyAdd({type: type}).then(data => {
                    if (data.code == 1) {
                        let list = data.data;
                        this.drop_list = list;
                    }
                });
            },
            //获取充电站列表
            getAvailableStations() {
                let that = this;
                this.$api.stationAcGetList({ id: this.currentId }).then((data) => {
                    if (data.code == 1) {
                        let list = data.data;
                        this.stationData = list;
                    }
                });
            },
            //编辑
            getPreferentialInfo() {
                let that = this;
                this.$api.preferentialInfo({id: this.$route.query.id}).then(data => {
                    if (data.code == 1) {
                        that.modelInfo = data.data
                        that.modelInfo.station_list = data.data.stations
                        this.modelInfo.type = data.data.type
                        that.getEnjoyGetCompanyAdd(data.data.type)
                        if(data.data.type ==2){
                            that.preferential_object = data.data.company_name;
                        }else{
                            that.preferential_object = data.data.group_title;
                        }
                    }
                });
            },
            saveCouponSure() {
                this.modelInfo.preferential_object = this.preferential_object
                if(this.$route.query.id){
                    this.modelInfo.station_list = this.modelInfo.limit_station_type == "1"
                        ? []
                        : this.can_use_station.rules, //部分可用列表
                        //编辑

                        this.$refs["modelInfo"].validate((valid) => {
                            if (valid) {
                                this.$api.preferentialAcEdit(this.modelInfo).then((data) => {
                                    if (data.code == 1) {
                                        this.$sfNotify({
                                            message: "成功",
                                        });
                                        this.$router.push({ path: "/activity/machine" });
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
                }else{
                    // 添加
                    this.$refs["modelInfo"].validate((valid) => {
                        if (valid) {
                            this.modelInfo.station_list = this.modelInfo.limit_station_type == "1"
                                ? []
                                : this.can_use_station.rules, //部分可用列表
                                this.$api.preferentialAcCreate(this.modelInfo).then((data) => {
                                    if (data.code == 1) {
                                        this.$sfNotify({
                                            message: "成功",
                                        });
                                        this.$router.push({ path: "/activity/machine" });
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
        }
    };
</script>

<style scoped lang="scss">
    @import "../../assets/css/activity/addCouponAc.scss";
</style>
