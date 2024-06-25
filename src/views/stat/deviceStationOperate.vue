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
                <router-link :to="`/stat/device/station/operate/${stationInfo.station_id}?title=${title}&operator_id=${operator_id}`" class="section-act">运营信息</router-link>
                <router-link :to="`/stat/device/station/park/${stationInfo.station_id}?title=${title}&operator_id=${operator_id}`">有序充电配置</router-link>
            </div>
            <el-form :model="stationInfo" ref="stationInfo" :rules="dataRules">
                <!-- 运营信息 -->
                <div class="section-info" v-loading="loadingInfo">
                    <div class="info-main">
                        <div class="info-title">运营信息</div>
                        <div class="info-content clearfix">
                            <div class="info-left">
                                <!-- 充电计费方式 -->
                                <div class="info-item">
                                    <div class="info-item-left show-app">
                                        <i>*</i>
                                        充电计费方式
                                    </div>
                                    <div class="info-item-right">
                                        <el-form-item prop="payment_type">
                                            <el-select v-model="stationInfo.payment_type" placeholder="请选择充电计费方式">
                                                <el-option label="现金" value="1" />
                                                <el-option label="在线" value="2" />
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                </div>
                                <!-- 服务电话 -->
                                <div class="info-item">
                                    <div class="info-item-left">
                                        <i>*</i>
                                        服务电话
                                    </div>
                                    <div class="info-item-right">
                                        <el-form-item prop="service_tel">
                                            <el-input v-model="stationInfo.service_tel" placeholder="填写400电话" />
                                        </el-form-item>
                                    </div>
                                </div>
                                <!-- 站点电话 -->
                                <div class="info-item">
                                    <div class="info-item-left">站点电话</div>
                                    <div class="info-item-right">
                                        <el-input v-model="stationInfo.station_tel" placeholder="填写站点电话" />
                                    </div>
                                </div>
                                <!-- 关联运营商 -->
                                <div class="info-item">
                                    <div class="info-item-left">
                                        <i>*</i>
                                        关联运营商
                                    </div>
                                    <div class="info-item-right">
                                        <el-form-item prop="operator_type">
                                            <el-select v-model="stationInfo.operator_type" placeholder="运营商类型">
                                                <el-option label="自营" value="1" />
                                                <el-option label="第三方运营商" value="2" />
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                </div>
                                <!-- 是否开放 -->
                                <div class="info-item">
                                    <div class="info-item-left">
                                        <i>*</i>
                                        是否开放
                                    </div>
                                    <div class="info-item-right">
                                        <el-form-item class="radio-outer" prop="is_open">
                                            <el-radio v-model="stationInfo.is_open" label="1">是</el-radio>
                                            <el-radio v-model="stationInfo.is_open" label="0">否</el-radio>
                                        </el-form-item>
                                        <div v-if="stationInfo.is_open == 1" class="open-interval">
                                            <div class="interval-main main-first">
                                                <div class="interval-list">
                                                    <div class="interval-item">
                                                        <el-select v-model="busine_hours_arr[0].hour">
                                                            <el-option v-for="(item, index) in hour_arr" :key="index" :label="item" :value="item" />
                                                        </el-select>
                                                        <span class="unit">时</span>
                                                    </div>
                                                    <div class="interval-item">
                                                        <el-select v-model="busine_hours_arr[0].minute">
                                                            <el-option v-for="(item, index) in minute_interval_arr" :key="index" :label="item" :value="item" />
                                                        </el-select>
                                                        <span class="unit">分</span>
                                                    </div>
                                                </div>
                                                <div class="interval-list interval-text">至</div>
                                                <div class="interval-list">
                                                    <div class="interval-item">
                                                        <el-select v-model="busine_hours_arr[1].hour">
                                                            <el-option v-for="(item, index) in hour_arr" :key="index" :label="item" :value="item" />
                                                        </el-select>
                                                        <span class="unit">时</span>
                                                    </div>
                                                    <div class="interval-item">
                                                        <el-select v-model="busine_hours_arr[1].minute">
                                                            <el-option v-for="(item, index) in minute_interval_arr" :key="index" :label="item" :value="item" />
                                                        </el-select>
                                                        <span class="unit">分</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- 是否允许预约充电桩 -->
                                <div class="info-item">
                                    <div class="info-item-left show-app">
                                        <i>*</i>
                                        是否允许预约充电桩
                                    </div>
                                    <div class="info-item-right">
                                        <el-form-item class="radio-outer" prop="support_order">
                                            <el-radio v-model="stationInfo.support_order" label="1">是</el-radio>
                                            <el-radio v-model="stationInfo.support_order" label="0">否</el-radio>
                                        </el-form-item>
                                        <div v-if="stationInfo.support_order == 1" class="open-interval">
                                            <div class="interval-main">
                                                <div class="interval-list">
                                                    <div class="interval-item">
                                                        <el-select v-model="stationInfo.support_order_time">
                                                            <el-option v-for="(item, index) in minute_interval_arr" :key="index" :label="item" :value="item" />
                                                        </el-select>
                                                        <span class="unit">分</span>
                                                    </div>
                                                    <div class="support_order_frequency">
                                                        <span class="frequency_world">用户连续预约</span>
                                                        <el-form-item class="frequency_first" prop="support_order_frequency">
                                                            <el-input class="input-val" v-model="stationInfo.support_order_frequency" type="number" />
                                                        </el-form-item>
                                                        <span class="frequency_world">次未发起实际充电，用户将在</span>
                                                        <el-form-item class="frequency_first" prop="support_order_limit_date">
                                                            <el-input v-model="stationInfo.support_order_limit_date" type="number" />
                                                        </el-form-item>
                                                        <span class="frequency_world">天内不可发起预约</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- 是否免费停车 -->
                                <div class="info-item">
                                    <div class="info-item-left show-app">
                                        <i>*</i>
                                        是否免费停车
                                    </div>
                                    <div class="info-item-right">
                                        <el-form-item class="radio-outer" prop="is_free">
                                            <el-radio v-model="stationInfo.is_free_park" label="1">是</el-radio>
                                            <el-radio v-model="stationInfo.is_free_park" label="0">否</el-radio>
                                        </el-form-item>
                                        <div v-if="stationInfo.is_free_park != 1" class="open-interval">
                                            <div class="interval-main free_park">
                                                <div class="interval-list">
                                                    <el-input type="textarea" v-model="stationInfo.park_note" maxlength="200" placeholder="填写备注信息，填写后可展示在APP内，字数不超过200字。" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 充电费率 -->
                <div class="section-info">
                    <div class="info-main">
                        <div class="info-title">充电费率</div>
                        <div class="info-content clearfix">
                            <div class="chargeRate-container">
                                <div class="chargeRate-tips">
                                    <div class="chargeRate-tips-left">
                                        <div class="warning-icon"></div>
                                    </div>
                                    <div class="chargeRate-tips-right">
                                        <p>
                                            <span>1、</span>
                                            “分时费率标准”必须符合24小时制，即“尖峰谷平”四个时段设置的总长为24小时（00:00-24:00），时间格式为HH:mm，否则保存不成功；
                                        </p>
                                        <p>
                                            <span>2、</span>
                                            必须有一个以上的时段；
                                        </p>
                                        <p>
                                            <span>3、</span>
                                            添加时段，必须连续，最多可创建48个时段，如：10:00-12:00,12:00-13:00，13:00-14:00等...以此类推。
                                        </p>
                                    </div>
                                </div>
                                <!-- 尖时段设置 -->
                                <div class="chargeRate-main clearfix">
                                    <div class="info-title">
                                        <span>尖时段设置</span>
                                        <span class="rate-arrow" :class="{ 'rate-arrow-open': peakShowFlag }" @click="peakShowFlag = !peakShowFlag"></span>
                                    </div>
                                    <!-- <sf-collapse-transition> -->
                                    <div v-if="peakShowFlag" class="info-content">
                                        <!-- 充电价/充电服务费 -->
                                        <div class="chargeRate-header clearfix">
                                            <div class="header-item">
                                                <div class="header-item-left">充电价</div>
                                                <div class="header-item-right">
                                                    <el-input v-model="stationInfo.peak_m" />
                                                    <div class="unit">元/kWh</div>
                                                </div>
                                            </div>
                                            <div class="header-item last-child">
                                                <div class="header-item-left">充电服务费</div>
                                                <div class="header-item-right">
                                                    <el-input v-model="stationInfo.peak_ser_m" />
                                                    <div class="unit">元/kWh</div>
                                                </div>
                                            </div>
                                            <div class="interval-btn">
                                                <div v-if="stationInfo._peak_time.length == 0" class="btn_succ add-interval" @click="addTimeInterval('_peak_time')">添加时段</div>
                                            </div>
                                        </div>
                                        <!-- 时段设置 -->
                                        <div v-if="stationInfo._peak_time.length > 0" class="chargeRate-content">
                                            <div class="chargeRate-content-left">时段</div>
                                            <div class="chargeRate-content-right">
                                                <div class="chargeRate-list" v-for="(item, index) in stationInfo._peak_time" :key="index">
                                                    <div class="interval-list">
                                                        <div class="interval-item">
                                                            <el-select v-model="item['s']['h']">
                                                                <el-option v-for="(item, index) in hour_arr" :key="index" :label="item" :value="item" />
                                                            </el-select>
                                                            <span class="unit">时</span>
                                                        </div>
                                                        <div class="interval-item">
                                                            <el-select v-model="item['s']['m']">
                                                                <el-option v-for="(item, index) in minute_arr" :key="index" :label="item" :value="item" />
                                                            </el-select>
                                                            <span class="unit">分</span>
                                                        </div>
                                                    </div>
                                                    <div class="interval-list interval-text">至</div>
                                                    <div class="interval-list">
                                                        <div class="interval-item">
                                                            <el-select v-model="item['e']['h']">
                                                                <el-option v-for="(item, index) in hour_arr" :key="index" :label="item" :value="item" />
                                                            </el-select>
                                                            <span class="unit">时</span>
                                                        </div>
                                                        <div class="interval-item">
                                                            <el-select v-model="item['e']['m']">
                                                                <el-option v-for="(item, index) in minute_arr" :key="index" :label="item" :value="item" />
                                                            </el-select>
                                                            <span class="unit">分</span>
                                                        </div>
                                                    </div>
                                                    <div class="interval-btn">
                                                        <div v-if="index == stationInfo._peak_time.length - 1" class="btn_succ add-interval" @click="addTimeInterval('_peak_time')">添加时段</div>
                                                        <div class="btn_cancel del-interval" @click="delTimeInterval('_peak_time', index)">删除</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- </sf-collapse-transition> -->
                                </div>
                                <!-- 峰时段设置 -->
                                <div class="chargeRate-main clearfix">
                                    <div class="info-title">
                                        <span>峰时段设置</span>
                                        <span class="rate-arrow" :class="{ 'rate-arrow-open': highShowFlag }" @click="highShowFlag = !highShowFlag"></span>
                                    </div>
                                    <!-- <sf-collapse-transition> -->
                                    <div v-if="highShowFlag" class="info-content">
                                        <!-- 充电价/充电服务费 -->
                                        <div class="chargeRate-header clearfix">
                                            <div class="header-item">
                                                <div class="header-item-left">充电价</div>
                                                <div class="header-item-right">
                                                    <el-input v-model="stationInfo.high_m" />
                                                    <div class="unit">元/kWh</div>
                                                </div>
                                            </div>
                                            <div class="header-item last-child">
                                                <div class="header-item-left">充电服务费</div>
                                                <div class="header-item-right">
                                                    <el-input v-model="stationInfo.high_ser_m" />
                                                    <div class="unit">元/kWh</div>
                                                </div>
                                            </div>
                                            <div class="interval-btn">
                                                <div v-if="stationInfo._high_time.length == 0" class="btn_succ add-interval" @click="addTimeInterval('_high_time')">添加时段</div>
                                            </div>
                                        </div>
                                        <!-- 时段设置 -->
                                        <div v-if="stationInfo._high_time.length > 0" class="chargeRate-content">
                                            <div class="chargeRate-content-left">时段</div>
                                            <div class="chargeRate-content-right">
                                                <div class="chargeRate-list" v-for="(item, index) in stationInfo._high_time" :key="index">
                                                    <div class="interval-list">
                                                        <div class="interval-item">
                                                            <el-select v-model="item['s']['h']">
                                                                <el-option v-for="(item, index) in hour_arr" :key="index" :label="item" :value="item" />
                                                            </el-select>
                                                            <span class="unit">时</span>
                                                        </div>
                                                        <div class="interval-item">
                                                            <el-select v-model="item['s']['m']">
                                                                <el-option v-for="(item, index) in minute_arr" :key="index" :label="item" :value="item" />
                                                            </el-select>
                                                            <span class="unit">分</span>
                                                        </div>
                                                    </div>
                                                    <div class="interval-list interval-text">至</div>
                                                    <div class="interval-list">
                                                        <div class="interval-item">
                                                            <el-select v-model="item['e']['h']">
                                                                <el-option v-for="(item, index) in hour_arr" :key="index" :label="item" :value="item" />
                                                            </el-select>
                                                            <span class="unit">时</span>
                                                        </div>
                                                        <div class="interval-item">
                                                            <el-select v-model="item['e']['m']">
                                                                <el-option v-for="(item, index) in minute_arr" :key="index" :label="item" :value="item" />
                                                            </el-select>
                                                            <span class="unit">分</span>
                                                        </div>
                                                    </div>
                                                    <div class="interval-btn">
                                                        <div v-if="index == stationInfo._high_time.length - 1" class="btn_succ add-interval" @click="addTimeInterval('_high_time')">添加时段</div>
                                                        <div class="btn_cancel del-interval" @click="delTimeInterval('_high_time', index)">删除</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- </sf-collapse-transition> -->
                                </div>
                                <!-- 谷时段设置 -->
                                <div class="chargeRate-main clearfix">
                                    <div class="info-title">
                                        <span>谷时段设置</span>
                                        <span class="rate-arrow" :class="{ 'rate-arrow-open': valleyShowFlag }" @click="valleyShowFlag = !valleyShowFlag"></span>
                                    </div>
                                    <!-- <sf-collapse-transition> -->
                                    <div v-if="valleyShowFlag" class="info-content">
                                        <!-- 充电价/充电服务费 -->
                                        <div class="chargeRate-header clearfix">
                                            <div class="header-item">
                                                <div class="header-item-left">充电价</div>
                                                <div class="header-item-right">
                                                    <el-input v-model="stationInfo.valley_m" />
                                                    <div class="unit">元/kWh</div>
                                                </div>
                                            </div>
                                            <div class="header-item last-child">
                                                <div class="header-item-left">充电服务费</div>
                                                <div class="header-item-right">
                                                    <el-input v-model="stationInfo.valley_ser_m" />
                                                    <div class="unit">元/kWh</div>
                                                </div>
                                            </div>
                                            <div class="interval-btn">
                                                <div v-if="stationInfo._valley_time.length == 0" class="btn_succ add-interval" @click="addTimeInterval('_valley_time')">添加时段</div>
                                            </div>
                                        </div>
                                        <!-- 时段设置 -->
                                        <div v-if="stationInfo._valley_time.length > 0" class="chargeRate-content">
                                            <div class="chargeRate-content-left">时段</div>
                                            <div class="chargeRate-content-right">
                                                <div class="chargeRate-list" v-for="(item, index) in stationInfo._valley_time" :key="index">
                                                    <div class="interval-list">
                                                        <div class="interval-item">
                                                            <el-select v-model="item['s']['h']">
                                                                <el-option v-for="(item, index) in hour_arr" :key="index" :label="item" :value="item" />
                                                            </el-select>
                                                            <span class="unit">时</span>
                                                        </div>
                                                        <div class="interval-item">
                                                            <el-select v-model="item['s']['m']">
                                                                <el-option v-for="(item, index) in minute_arr" :key="index" :label="item" :value="item" />
                                                            </el-select>
                                                            <span class="unit">分</span>
                                                        </div>
                                                    </div>
                                                    <div class="interval-list interval-text">至</div>
                                                    <div class="interval-list">
                                                        <div class="interval-item">
                                                            <el-select v-model="item['e']['h']">
                                                                <el-option v-for="(item, index) in hour_arr" :key="index" :label="item" :value="item" />
                                                            </el-select>
                                                            <span class="unit">时</span>
                                                        </div>
                                                        <div class="interval-item">
                                                            <el-select v-model="item['e']['m']">
                                                                <el-option v-for="(item, index) in minute_arr" :key="index" :label="item" :value="item" />
                                                            </el-select>
                                                            <span class="unit">分</span>
                                                        </div>
                                                    </div>
                                                    <div class="interval-btn">
                                                        <div v-if="index == stationInfo._valley_time.length - 1" class="btn_succ add-interval" @click="addTimeInterval('_valley_time')">添加时段</div>
                                                        <div class="btn_cancel del-interval" @click="delTimeInterval('_valley_time', index)">删除</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- </sf-collapse-transition> -->
                                </div>
                                <!-- 平时段设置 -->
                                <div class="chargeRate-main clearfix">
                                    <div class="info-title">
                                        <span>平时段设置</span>
                                        <span class="rate-arrow" :class="{ 'rate-arrow-open': normalShowFlag }" @click="normalShowFlag = !normalShowFlag"></span>
                                    </div>
                                    <!-- <sf-collapse-transition> -->
                                    <div v-if="normalShowFlag" class="info-content">
                                        <!-- 充电价/充电服务费 -->
                                        <div class="chargeRate-header clearfix">
                                            <div class="header-item">
                                                <div class="header-item-left">充电价</div>
                                                <div class="header-item-right">
                                                    <el-input v-model="stationInfo.normal_m" />
                                                    <div class="unit">元/kWh</div>
                                                </div>
                                            </div>
                                            <div class="header-item last-child">
                                                <div class="header-item-left">充电服务费</div>
                                                <div class="header-item-right">
                                                    <el-input v-model="stationInfo.normal_ser_m" />
                                                    <div class="unit">元/kWh</div>
                                                </div>
                                            </div>
                                            <div class="interval-btn">
                                                <div v-if="stationInfo._normal_time.length == 0" class="btn_succ add-interval" @click="addTimeInterval('_normal_time')">添加时段</div>
                                            </div>
                                        </div>
                                        <!-- 时段设置 -->
                                        <div v-if="stationInfo._normal_time.length > 0" class="chargeRate-content">
                                            <div class="chargeRate-content-left">时段</div>
                                            <div class="chargeRate-content-right">
                                                <div class="chargeRate-list" v-for="(item, index) in stationInfo._normal_time" :key="index">
                                                    <div class="interval-list">
                                                        <div class="interval-item">
                                                            <el-select v-model="item['s']['h']">
                                                                <el-option v-for="(item, index) in hour_arr" :key="index" :label="item" :value="item" />
                                                            </el-select>
                                                            <span class="unit">时</span>
                                                        </div>
                                                        <div class="interval-item">
                                                            <el-select v-model="item['s']['m']">
                                                                <el-option v-for="(item, index) in minute_arr" :key="index" :label="item" :value="item" />
                                                            </el-select>
                                                            <span class="unit">分</span>
                                                        </div>
                                                    </div>
                                                    <div class="interval-list interval-text">至</div>
                                                    <div class="interval-list">
                                                        <div class="interval-item">
                                                            <el-select v-model="item['e']['h']">
                                                                <el-option v-for="(item, index) in hour_arr" :key="index" :label="item" :value="item" />
                                                            </el-select>
                                                            <span class="unit">时</span>
                                                        </div>
                                                        <div class="interval-item">
                                                            <el-select v-model="item['e']['m']">
                                                                <el-option v-for="(item, index) in minute_arr" :key="index" :label="item" :value="item" />
                                                            </el-select>
                                                            <span class="unit">分</span>
                                                        </div>
                                                    </div>
                                                    <div class="interval-btn">
                                                        <div v-if="index == stationInfo._normal_time.length - 1" class="btn_succ add-interval" @click="addTimeInterval('_normal_time')">添加时段</div>
                                                        <div class="btn_cancel del-interval" @click="delTimeInterval('_normal_time', index)">删除</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- </sf-collapse-transition> -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
                payment_type: '', // 充电计费方式
                service_tel: '', // 服务电话
                station_tel: '', // 站点电话
                operator_type: '', // 运营商类型
                is_open: '0', // 是否开放
                busine_hours: '', // 服务时间
                support_order: '0', // 是否允许预约充电桩
                support_order_time: '00', // 预约充电时间
                support_order_frequency: '',
                support_order_limit_date: '',

                peak_m: '', // 尖时刻电费
                peak_ser_m: '', // 尖时刻服务费
                high_m: '', // 峰时刻电费
                high_ser_m: '', // 峰时刻服务费
                valley_m: '', // 谷时刻电费
                valley_ser_m: '', // 谷时刻服务费
                normal_m: '', // 平时刻电费
                normal_ser_m: '', // 平时刻服务费

                _peak_time: [],
                _high_time: [],
                _valley_time: [],
                _normal_time: [],
                is_free_park: '0', //是否免费停车 0代表不免费 1代表免费
                park_note: '', //收费停车的说明
            },
            busine_hours_arr: [
                { hour: '00', minute: '00' },
                { hour: '01', minute: '00' },
            ],
            peakShowFlag: false, // 尖时段费率展示
            highShowFlag: false, // 峰时段费率展示
            valleyShowFlag: false, // 谷时段费率展示
            normalShowFlag: false, // 平时段费率展示
            dataRules: {
                payment_type: [{ required: true, message: '* 请选择充电计费方式', trigger: 'change' }],
                service_tel: [{ required: true, message: '* 请输入服务电话', trigger: 'change' }],
                operator_type: [{ required: true, message: '* 请选择运营商', trigger: 'change' }],
            },
            station_name: '',
        }
    },
    watch: {
        busine_hours_arr: {
            handler: function (newItem) {
                var start = newItem[0]['hour'] + ':' + newItem[0]['minute']
                var end = newItem[1]['hour'] + ':' + newItem[1]['minute']
                this.stationInfo.busine_hours = start + '-' + end
            },
            deep: true,
        },
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
        highTime: {
            get: function () {
                return this.getTimeFormat('_high_time')
            },
        },
        valleyTime: {
            get: function () {
                return this.getTimeFormat('_valley_time')
            },
        },
        normalTime: {
            get: function () {
                return this.getTimeFormat('_normal_time')
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
            this.$api.getStationOperation(params).then(res => {
                if (res.code == 1) {
                    this.station_name = res.data.station_name
                    res.data._peak_time = []
                    res.data._high_time = []
                    res.data._valley_time = []
                    res.data._normal_time = []
                    res.data.peak_m = ''
                    res.data.peak_ser_m = ''
                    res.data.high_m = ''
                    res.data.high_ser_m = ''
                    res.data.valley_m = ''
                    res.data.valley_ser_m = ''
                    res.data.normal_m = ''
                    res.data.normal_ser_m = ''
                    this.stationInfo = res.data
                    var format_time = res.data.format_time
                    for (const key in format_time) {
                        var item = format_time[key]
                        var tempItem = []
                        item.map(function (item) {
                            var sArr = item.s.split(':')
                            var eArr = item.e.split(':')
                            tempItem.push({
                                s: { h: sArr[0], m: sArr[1] },
                                e: { h: eArr[0], m: eArr[1] },
                            })
                        })
                        if (item.length > 0) {
                            //时段不为空， 则展开对应的时段
                            this[key + 'ShowFlag'] = true
                        }
                        this.stationInfo['_' + key + '_time'] = tempItem
                    }

                    this.stationInfo.peak_m = res.data.e_peak_m
                    this.stationInfo.peak_ser_m = res.data.v_peak_m
                    this.stationInfo.high_m = res.data.e_high_m
                    this.stationInfo.high_ser_m = res.data.v_high_m
                    this.stationInfo.valley_m = res.data.e_valley_m
                    this.stationInfo.valley_ser_m = res.data.v_valley_m
                    this.stationInfo.normal_m = res.data.e_normal_m
                    this.stationInfo.normal_ser_m = res.data.v_normal_m

                    //开放时间
                    var busine_hours = res.data.busine_hours
                    var startAndEnd = busine_hours.split('-')
                    if (startAndEnd.length > 1) {
                        var start = startAndEnd[0]
                        var end = startAndEnd[1]
                        var startArr = start.split(':')
                        var endArr = end.split(':')

                        if (startArr.length > 1) {
                            this.busine_hours_arr[0].hour = startArr[0]
                            this.busine_hours_arr[0].minute = startArr[1]
                        }
                        if (endArr.length > 1) {
                            this.busine_hours_arr[1].hour = endArr[0]
                            this.busine_hours_arr[1].minute = endArr[1]
                        }
                    }
                }
                this.loadingInfo = false
            })
        },
        addTimeInterval(type) {
            var totalTimeInterval = this.stationInfo['_peak_time'].length + this.stationInfo['_high_time'].length + this.stationInfo['_valley_time'].length + this.stationInfo['_normal_time'].length
            if (totalTimeInterval >= 48)
                this.$sfNotify({
                    duration: 0,
                    type: 'error',
                    message: '最多可创建48个时段',
                })
            this.stationInfo[type].push({
                s: {
                    h: '00',
                    m: '00',
                },
                e: {
                    h: '24',
                    m: '00',
                },
            })
        },
        delTimeInterval(type, ind) {
            this.stationInfo[type] = this.stationInfo[type].filter((item, index) => ind != index)
        },
        saveStationInfo() {
            this.$refs['stationInfo'].validate(valid => {
                if (valid) {
                    this.stationInfo.peak_time = this.peakTime.length > 0 ? this.peakTime : []
                    this.stationInfo.high_time = this.highTime.length > 0 ? this.highTime : []
                    this.stationInfo.valley_time = this.valleyTime.length > 0 ? this.valleyTime : []
                    this.stationInfo.normal_time = this.normalTime.length > 0 ? this.normalTime : []
                    if (this.peakTime.length == 0 && this.highTime.length == 0 && this.valleyTime.length == 0 && this.normalTime.length == 0) {
                        this.$sfNotify({
                            duration: 0,
                            type: 'error',
                            message: '充电费率，必须配置一个以上的时段',
                        })
                    }

                    if (this.peakTime.length > 0) {
                        if (this.stationInfo.peak_m == '' || this.stationInfo.peak_ser_m == '') {
                            this.$sfNotify({
                                duration: 0,
                                type: 'error',
                                message: '尖时段未设置充电价或服务费',
                            })
                        }
                    }
                    if (this.highTime.length > 0) {
                        if (this.stationInfo.high_m == '' || this.stationInfo.high_ser_m == '') {
                            this.$sfNotify({
                                duration: 0,
                                type: 'error',
                                message: '峰时段未设置充电价或服务费',
                            })
                        }
                    }
                    if (this.valleyTime.length > 0) {
                        if (this.stationInfo.valley_m == '' || this.stationInfo.valley_ser_m == '') {
                            this.$sfNotify({
                                duration: 0,
                                type: 'error',
                                message: '谷时段未设置充电价或服务费',
                            })
                        }
                    }
                    if (this.normalTime.length > 0) {
                        if (this.stationInfo.normal_m == '' || this.stationInfo.normal_ser_m == '') {
                            this.$sfNotify({
                                duration: 0,
                                type: 'error',
                                message: '平时段未设置充电价或服务费',
                            })
                        }
                    }
                    this.stationInfo.id = this.station_id
                    this.$api.editStationOperation(this.stationInfo).then(res => {
                        if (res.code == 1) {
                            this.$router.push('/device/station')
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
@import '../../assets/css/device/operate.scss';
</style>
