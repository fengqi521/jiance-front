<template>
    <section>
        <div class="section-title">
            <router-link :to="`/stat/device/station?title=${title}&operator_id=${operator_id}`">充电站管理</router-link>
            > 充电站详情
        </div>
        <p class="section-name">{{ station_name }}</p>
        <div class="section-container">
            <div class="section-item-router">
                <router-link :to="`/stat/device/station/detail/${stationInfo.station_id}?title=${title}&operator_id=${operator_id}`">基本信息</router-link>
                <router-link :to="`/stat/device/station/operate/${stationInfo.station_id}?title=${title}&operator_id=${operator_id}`">运营信息</router-link>
                <router-link :to="`/stat/device/station/park/${stationInfo.station_id}?title=${title}&operator_id=${operator_id}`" class="section-act">有序充电配置</router-link>
            </div>
            <el-form :model="stationInfo" ref="stationInfo">
                <!-- 运营信息 -->
                <div class="section-info" v-loading="loadingInfo">
                    <div class="info-main">
                        <div class="info-title">【注意】可以不配置。总功率只做记录不会运用在业务场景中。如果配置了某个时段的阈值功率，这个时段内正在充电的枪的“功率和”超过阈值功率后，下一辆车将不可充电。</div>
                        <div class="info-content clearfix">
                            <div class="info-left">
                                <!-- 是否有序充电 -->
                                <div class="info-item">
                                    <div class="info-item-left show-app">是否有序充电</div>
                                    <div class="info-item-right">
                                        <el-form-item class="radio-outer">
                                            <el-radio v-model="stationInfo.is_limit_charge" label="1">是</el-radio>
                                            <el-radio v-model="stationInfo.is_limit_charge" label="0">否</el-radio>
                                        </el-form-item>
                                    </div>
                                </div>
                                <!-- 总功率 -->
                                <div class="info-item">
                                    <div class="info-item-left">总功率</div>
                                    <div class="info-item-right">
                                        <el-form-item>
                                            <el-input :disabled="stationInfo.is_limit_charge != 1" v-model="stationInfo.total_power" placeholder="填写正整数" />
                                            <span class="power-unit">KW</span>
                                        </el-form-item>
                                    </div>
                                </div>
                                <!-- 备注 -->
                                <div class="info-item">
                                    <div class="info-item-left">备注</div>
                                    <div class="info-item-right">
                                        <el-form-item>
                                            <el-input :disabled="stationInfo.is_limit_charge != 1" type="textarea" v-model="stationInfo.limit_charge_note" maxlength="200" placeholder="填写备注信息，填写后可展示在APP内，字数不超过200字。" />
                                        </el-form-item>
                                    </div>
                                </div>
                                <!-- 备注 -->
                                <div class="info-item">
                                    <div class="info-item-left">
                                        <i v-if="stationInfo.is_limit_charge == '1'">*</i>
                                        时段
                                    </div>
                                    <div class="info-item-right">
                                        <!-- 时段设置 -->
                                        <div v-if="stationInfo._peak_time.length > 0" class="chargeRate-content">
                                            <div class="chargeRate-content-right">
                                                <div class="chargeRate-list" v-for="(item, index) in stationInfo._peak_time" :key="index">
                                                    <div class="interval-list">
                                                        <div class="interval-item">
                                                            <el-select v-model="item['s']['h']" :disabled="stationInfo.is_limit_charge != 1">
                                                                <el-option v-for="(item, index) in hour_arr" :key="index" :label="item" :value="item" :disabled="stationInfo.is_limit_charge != 1" />
                                                            </el-select>
                                                            <span class="unit">时</span>
                                                        </div>
                                                    </div>
                                                    <div class="interval-list interval-text">至</div>
                                                    <div class="interval-list">
                                                        <div class="interval-item">
                                                            <el-select v-model="item['e']['h']" :disabled="stationInfo.is_limit_charge != 1">
                                                                <el-option v-for="(item, index) in hour_arr" :key="index" :label="item" :value="item" />
                                                            </el-select>
                                                            <span class="unit">时</span>
                                                        </div>
                                                    </div>
                                                    <div class="interval-list interval-text threshold-text">阈值功率</div>
                                                    <el-input v-model="item['limit_power']" type="number" min="1" placeholder="填写正整数" class="threshold-power" :disabled="stationInfo.is_limit_charge != 1" />
                                                    <span class="time-power-unit">KW</span>
                                                    <div class="interval-btn" v-if="stationInfo.is_limit_charge == 1">
                                                        <div v-if="index == stationInfo._peak_time.length - 1" class="btn_succ add-interval" @click="addTimeInterval('_peak_time')">添加时段</div>
                                                        <div v-if="index != stationInfo._peak_time.length - 1" class="btn_cancel del-interval" @click="delTimeInterval('_peak_time', index)">删除</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="dividing-line"></div>
                <!-- 提交 -->
            </el-form>
        </div>
    </section>
</template>

<script>
import { hour_arr, minute_interval_arr, minute_arr } from 'global'
export default {
    data() {
        this.title = (this.$route.query && this.$route.query.title) || ''
        const operator_id = (this.$route.query && this.$route.query.operator_id) || ''
        return {
            operator_id,
            loadingInfo: false,
            hour_arr: hour_arr,
            minute_interval_arr: minute_interval_arr,
            minute_arr: minute_arr,
            station_id: this.$route.params.id ? this.$route.params.id : '',
            stationInfo: {
                station_id: this.$route.params.id ? this.$route.params.id : '',
                is_limit_charge: '0', // 是否有序充电 0代表不开启 1代表开启
                limit_charge_note: '', //有序充电备注
                total_power: '', //总功率
                _peak_time: [],
            },
            station_name: '',
        }
    },
    created() {
        this.getStationOperation()
    },
    computed: {
        peakTime: {
            get: function () {
                return this.getTimeFormat('_peak_time')
            },
        },
    },
    methods: {
        getTimeFormat(type) {
            var newTime = []
            this.stationInfo[type].forEach(ele => {
                newTime.push({
                    s: ele.s.h + ':' + ele.s.m,
                    e: ele.e.h + ':' + ele.e.m,
                })
            })
            return newTime
        },
        getStationOperation() {
            var id = this.stationInfo.station_id
            var params = {
                id: id,
                operator_id: this.operator_id,
            }
            this.loadingInfo = true
            this.$api.getStationLimitCharge(params).then(res => {
                if (res.code == 1) {
                    this.station_name = res.data.station_name
                    res.data._peak_time = []
                    this.stationInfo.is_limit_charge = res.data.is_limit_charge
                    this.stationInfo.limit_charge_note = res.data.limit_charge_note
                    this.stationInfo.total_power = res.data.total_power
                    var format_time = res.data.format_time
                    if (format_time.length) {
                        var tempItem = []
                        for (const key in format_time) {
                            var item = format_time[key]
                            tempItem.push(item)
                        }
                        this.stationInfo._peak_time = tempItem
                    } else {
                        this.stationInfo._peak_time = [
                            {
                                s: { h: '00' },
                                e: { h: '24' },
                                limit_power: '',
                            },
                        ]
                    }
                    this.stationInfo.is_limit_charge = res.data.is_limit_charge
                    this.stationInfo.limit_charge_note = res.data.limit_charge_note
                    this.stationInfo.total_power = res.data.total_power
                }
                this.loadingInfo = false
            })
        },
        addTimeInterval(type) {
            var totalTimeInterval = this.stationInfo['_peak_time'].length
            if (totalTimeInterval >= 24)
                this.$sfNotify({
                    duration: 0,
                    type: 'error',
                    message: '最多可创建24个时段',
                })
            this.stationInfo[type].push({
                s: {
                    h: '00',
                },
                e: {
                    h: '24',
                },
                limit_power: '',
            })
        },
        delTimeInterval(type, ind) {
            this.stationInfo[type] = this.stationInfo[type].filter((item, index) => ind != index)
            console.log(this.stationInfo._peak_time)
        },
        saveStationInfo() {
            var pattern = /^[1-9]\d*$/
            //判断是否有序充电
            if (this.stationInfo.is_limit_charge == 1) {
                if (!this.stationInfo._peak_time.length) {
                    this.$sfNotify({
                        duration: 0,
                        type: 'error',
                        message: '请填写有序充电时间段',
                    })
                    return false
                }
                //验证时间段的阈值
                var peak_time = this.stationInfo._peak_time
                var check_flag = true
                peak_time.forEach((item, index) => {
                    if (!item.limit_power || !pattern.test(item.limit_power)) {
                        this.$sfNotify({
                            duration: 0,
                            type: 'error',
                            message: '阈值功率为正整数',
                        })
                        check_flag = false
                        return false
                    }
                })
                if (!check_flag) {
                    return false
                }
            }

            //验证总功率
            if (this.stationInfo.total_power) {
                if (!pattern.test(this.stationInfo.total_power)) {
                    this.$sfNotify({
                        duration: 0,
                        type: 'error',
                        message: '总功率为正整数',
                    })
                    return false
                }
            }
            this.$api.editStationLimitCharge(this.stationInfo).then(res => {
                if (res.code == 1) {
                    this.$sfNotify({
                        message: '修改成功',
                    })
                    this.getStationOperation()
                } else {
                    this.$sfNotify({
                        duration: 0,
                        type: 'error',
                        message: res.message,
                    })
                }
            })
        },
    },
}
</script>
<style lang="scss" scoped>
@import '../../assets/css/device/park.scss';
</style>
