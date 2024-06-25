<template>
    <section>
        <div class="section-title">
            <router-link :to="`/stat/device/pile?title=${title}&operator_id=${operator_id}`">充电桩管理</router-link>
            > 充电桩详情
        </div>
        <p class="section-name">充电桩名称：{{ pile_detail_name }}</p>
        <div class="section-container">
            <div class="section-item-router">
                <router-link :to="`/stat/device/pile/detail/${modelInfo.id}?title=${title}&operator_id=${operator_id}`" class="section-act">基本信息</router-link>
                <router-link :to="`/stat/device/pile/operate/${modelInfo.id}?title=${title}&operator_id=${operator_id}`">运营信息</router-link>
            </div>
            <el-form :model="modelInfo" ref="modelInfo" :rules="dataRules">
                <!-- 基本信息 -->
                <div class="section-info" v-loading="loadingInfo">
                    <div class="info-content clearfix">
                        <div class="info-left">
                            <!-- 名称 -->
                            <div class="info-item">
                                <div class="info-item-left">
                                    <i>*</i>
                                    名称
                                </div>
                                <div class="info-item-right">
                                    <el-form-item prop="pile_name">
                                        <el-input v-model="modelInfo.pile_name" placeholder="请输入名称" />
                                    </el-form-item>
                                </div>
                            </div>
                            <!-- 所属厂家 -->
                            <div class="info-item">
                                <div class="info-item-left">
                                    <i>*</i>
                                    所属厂家
                                </div>
                                <div class="info-item-right">
                                    <el-form-item prop="manufacture_name">
                                        <el-input v-model="modelInfo.manufacture_name" placeholder="请输入所属厂家" />
                                    </el-form-item>
                                </div>
                            </div>
                            <!-- 充电桩类型 -->
                            <div class="info-item">
                                <div class="info-item-left">
                                    <i>*</i>
                                    充电桩类型
                                </div>
                                <div class="info-item-right">
                                    <el-form-item prop="pile_type">
                                        <el-select v-model="modelInfo.pile_type" placeholder="请选择充电桩类型">
                                            <el-option label="直流设备" value="1" />
                                            <el-option label="交流设备" value="2" />
                                            <!--                      <el-option-->
                                            <!--                        label="交直流一体设备"-->
                                            <!--                        value="3"-->
                                            <!--                      />-->
                                            <!--                      <el-option-->
                                            <!--                        label="无线设备"-->
                                            <!--                        value="4"-->
                                            <!--                      />-->
                                            <!--                      <el-option-->
                                            <!--                        label="其它"-->
                                            <!--                        value="5"-->
                                            <!--                      />-->
                                        </el-select>
                                    </el-form-item>
                                </div>
                            </div>
                            <!-- 额定电压 -->
                            <div class="info-item">
                                <div class="info-item-left">
                                    <i>*</i>
                                    额定电压
                                </div>
                                <div class="info-item-right voltage-outer">
                                    <div class="voltage-item">
                                        <el-form-item prop="voltage_upper">
                                            <el-input v-model="modelInfo.voltage_upper" placeholder="上限" />
                                            <span class="voltage-unit">V</span>
                                        </el-form-item>
                                    </div>
                                    <div class="voltage-item">
                                        <el-input v-model="modelInfo.voltage_lower" placeholder="下限" />
                                        <span class="voltage-unit">V</span>
                                    </div>
                                </div>
                            </div>
                            <!-- 充电口数量  -->
                            <div class="info-item">
                                <div class="info-item-left">
                                    <i>*</i>
                                    充电口数量
                                </div>
                                <div class="info-item-right">
                                    <el-form-item prop="charging_ports">
                                        <el-input v-model="modelInfo.charging_ports" placeholder="请输入充电口数量" />
                                    </el-form-item>
                                </div>
                            </div>
                            <!-- 是否支持即插即充 -->
                            <div class="info-item is-c-c">
                                <div class="info-item-left show-app">是否支持即插即充</div>
                                <div class="info-item-right">
                                    <div class="radio-outer" prop="status">
                                        <el-radio v-model="modelInfo.plug_status" label="1">是</el-radio>
                                        <el-radio v-model="modelInfo.plug_status" label="0">否</el-radio>
                                    </div>
                                </div>
                            </div>
                            <!-- 充电枪类型 -->
                            <div class="info-item">
                                <div class="info-item-left">
                                    <i>*</i>
                                    充电枪类型
                                </div>
                                <div class="info-item-right">
                                    <el-form-item prop="gun_type">
                                        <el-select v-model="modelInfo.gun_type" placeholder="请选择充电枪类型">
                                            <el-option label="家用插座" value="1" />
                                            <el-option label="交流接口插座" value="2" />
                                            <el-option label="交流接口插头" value="3" />
                                            <el-option label="直流接口枪头" value="4" />
                                            <el-option label="无线充电座" value="5" />
                                            <el-option label="其它" value="6" />
                                        </el-select>
                                    </el-form-item>
                                </div>
                            </div>
                            <!-- SIM卡号 -->
                            <div class="info-item">
                                <div class="info-item-left">SIM卡号</div>
                                <div class="info-item-right">
                                    <el-input v-model="modelInfo.sim_card" placeholder="请输入SIM卡号" />
                                </div>
                            </div>
                        </div>
                        <div class="info-right">
                            <!-- 运行编码 -->
                            <div class="info-item">
                                <div class="info-item-left">
                                    <i>*</i>
                                    充电桩编号
                                </div>
                                <div class="info-item-right">
                                    <el-form-item prop="pile_sn">
                                        <el-input v-model="modelInfo.pile_sn" placeholder="请输入充电桩编号" disabled />
                                    </el-form-item>
                                </div>
                            </div>
                            <!-- 型号 -->
                            <div class="info-item">
                                <div class="info-item-left">型号</div>
                                <div class="info-item-right">
                                    <el-input v-model="modelInfo.model" placeholder="请输入型号" />
                                </div>
                            </div>
                            <!-- 额定功率 -->
                            <div class="info-item">
                                <div class="info-item-left">
                                    <i>*</i>
                                    额定功率
                                </div>
                                <div class="info-item-right voltage-outer">
                                    <div class="voltage-item">
                                        <el-form-item prop="power_upper">
                                            <el-input v-model="modelInfo.power_upper" placeholder="上限" />
                                            <span class="voltage-unit">KW</span>
                                        </el-form-item>
                                    </div>
                                    <div class="voltage-item">
                                        <el-input v-model="modelInfo.power_lower" placeholder="下限" />
                                        <span class="voltage-unit">KW</span>
                                    </div>
                                </div>
                            </div>
                            <!-- 额定电流 -->
                            <div class="info-item">
                                <div class="info-item-left">
                                    <i>*</i>
                                    额定电流
                                </div>
                                <div class="info-item-right">
                                    <el-form-item prop="electric">
                                        <el-input v-model="modelInfo.electric" placeholder="请输入额定电流" />
                                        <span class="voltage-unit">A</span>
                                    </el-form-item>
                                </div>
                            </div>
                            <!-- 充电口编号 -->
                            <div class="info-item">
                                <div class="info-item-left">充电口编号</div>
                                <div class="info-item-right">
                                    <el-input disabled v-model="modelInfo.charging_port_sn" />
                                </div>
                            </div>
                            <!-- 通讯模块MAC -->
                            <div class="info-item">
                                <div class="info-item-left">通讯模块MAC</div>
                                <div class="info-item-right">
                                    <el-input v-model="modelInfo.communication_mac" placeholder="请输入通讯模块MAC" />
                                </div>
                            </div>
                            <!-- 桩蓝牙MAC -->
                            <div class="info-item">
                                <div class="info-item-left">桩蓝牙MAC</div>
                                <div class="info-item-right">
                                    <el-input v-model="modelInfo.bluetooth_mac" placeholder="请输入桩蓝牙MAC" />
                                </div>
                            </div>
                            <!-- 桩验收时间 -->
                            <div class="info-item">
                                <div class="info-item-left"><i>*</i>桩验收时间</div>
                                <div class="info-item-right input-150">
                                <el-form-item prop="oper_date">
                                    <el-date-picker v-model="modelInfo.oper_date" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
                                </el-form-item>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 提交 -->
                </div>
            </el-form>
        </div>
    </section>
</template>

<script>
export default {
    data() {
        this.title = (this.$route.query && this.$route.query.title) || ''
        const operator_id = (this.$route.query && this.$route.query.operator_id) || ''
        return {
            operator_id,
            pile_detail_name: '',
            modelInfo: {
                oper_date: '',
                loadingInfo: false,
                id: this.$route.params.id ? this.$route.params.id : '',
                pile_name: '',
                manufacture_name: '',
                pile_type: '',
                voltage_upper: '',
                voltage_lower: '',
                charging_ports: '',
                gun_type: '',
                sim_card: '',
                pile_sn: '',
                model: '',
                power_upper: '',
                power_lower: '',
                electric: '',
                charging_port_sn: '1,2,3',
                communication_mac: '',
                bluetooth_mac: '',
            },
            dataRules: {
                pile_name: [{ required: true, message: '* 请输入名称', trigger: 'change' }],
                manufacture_name: [{ required: true, message: '* 请输入所属厂家', trigger: 'change' }],
                pile_type: [{ required: true, message: '* 请选择充电桩类型', trigger: 'change' }],
                voltage_upper: [
                    {
                        required: true,
                        message: '* 请输入电压上限',
                        trigger: 'change',
                    },
                ],
                charging_ports: [
                    {
                        required: true,
                        message: '* 请输入充电口数量',
                        trigger: 'change',
                    },
                ],
                gun_type: [
                    {
                        required: true,
                        message: '* 请选择充电枪类型',
                        trigger: 'change',
                    },
                ],
                pile_sn: [
                    {
                        required: true,
                        message: '* 请输入运行编码',
                        trigger: 'change',
                    },
                ],
                power_upper: [
                    {
                        required: true,
                        message: '* 请输入功率上限',
                        trigger: 'change',
                    },
                ],
                electric: [
                    {
                        required: true,
                        message: '* 请输入额定电流',
                        trigger: 'change',
                    },
                ],
                oper_date: [
                    {
                        required: true,
                        message: "* 请输入桩验收时间",
                        trigger: "change",
                    },
                ],
            },
        }
    },
    created() {
        this.getPileDetail()
    },
    methods: {
        getPileDetail() {
            var _this = this
            var params = {
                id: _this.modelInfo.id,
                operator_id: this.operator_id,
            }
            this.loadingInfo = true
            this.$api.pileBasicDetail(params).then(res => {
                if (res.code == 1) {
                    this.modelInfo = res.data
                    this.pile_detail_name = res.data.pile_name
                }
                this.loadingInfo = false
            })
        },
        saveDeviceInfo() {
            this.$refs['modelInfo'].validate(valid => {
                if (valid) {
                    this.$api.pileBasicEdit(this.modelInfo).then(res => {
                        if (res.code == 1) {
                            this.$sfNotify({
                                message: '保存成功',
                            })
                            this.$router.push('/device/pile')
                        } else {
                            this.$sfNotify({
                                duration: 0,
                                type: 'error',
                                message: res.message,
                            })
                        }
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
    },
}
</script>
<style lang="scss" scoped>
@import '../../assets/css/device/pileDetail.scss';
</style>
