<template>
    <section>
        <div class="section-title">首页</div>
        <div class="section-list section-statistic clearfix">
            <div class="statistic-top">
                <div class="statistic-item-outer">
                    <div class="statistic-item">
                        <span class="statistic-img statistic-img-1"></span>
                        <div class="statistic-content">
                            <p>
                                当前APP用户总数（个）
                                <el-tooltip class="item" content="截止到十分钟前" placement="right">
                                    <div class="tips-icon-1"></div>
                                </el-tooltip>
                            </p>
                            <div class="statistic-detail">
                                <span class="ellipsis" :class="{
                                    'detail-special': !parseFloat(header_info.s_user_count),
                                }">
                                    {{ parseFloat(header_info.s_user_count) ? header_info.s_user_count : 0 }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="statistic-item-outer">
                    <div class="statistic-item" style="background: #7f84c0">
                        <span class="statistic-img statistic-img-2"></span>
                        <div class="statistic-content">
                            <p>
                                当前总订单数（个）
                                <el-tooltip class="item" content="截止到十分钟前" placement="right">
                                    <div class="tips-icon-1"></div>
                                </el-tooltip>
                            </p>
                            <div class="statistic-detail">
                                <span class="ellipsis" :class="{
                                    'detail-special': !parseFloat(header_info.s_order_total),
                                }">
                                    {{ parseFloat(header_info.s_order_total) ? header_info.s_order_total : 0 }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="statistic-item-outer">
                    <div class="statistic-item" style="background: #ffb73c">
                        <span class="statistic-img statistic-img-3"></span>
                        <div class="statistic-content">
                            <p>
                                当前充电站数（个）
                                <el-tooltip class="item" content="截止到十分钟前" placement="right">
                                    <div class="tips-icon-1"></div>
                                </el-tooltip>
                            </p>
                            <div class="statistic-detail">
                                <span class="ellipsis" :class="{
                                    'detail-special': !parseFloat(header_info.s_station_count),
                                }">
                                    {{ parseFloat(header_info.s_station_count) ? header_info.s_station_count : 0 }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="statistic-item-outer">
                    <div class="statistic-item">
                        <span class="statistic-img statistic-img-4"></span>
                        <div class="statistic-content">
                            <p>
                                当前充电桩数（个）
                                <el-tooltip class="item" content="截止到十分钟前" placement="right">
                                    <div class="tips-icon-1"></div>
                                </el-tooltip>
                            </p>
                            <div class="statistic-detail">
                                <span class="ellipsis" :class="{
                                    'detail-special': !parseFloat(header_info.s_pile_total),
                                }">
                                    {{ parseFloat(header_info.s_pile_total) ? header_info.s_pile_total : 0 }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="statistic-item-outer">
                    <div class="statistic-item" style="background: #7f84c0">
                        <span class="statistic-img statistic-img-5"></span>
                        <div class="statistic-content">
                            <p>
                                充电总度数（度）
                                <el-tooltip class="item" content="截止到十分钟前" placement="right">
                                    <div class="tips-icon-1"></div>
                                </el-tooltip>
                            </p>
                            <div class="statistic-detail">
                                <span class="ellipsis" :class="{
                                    'detail-special': !parseFloat(header_info.s_quantity_total),
                                }">
                                    {{ parseFloat(header_info.s_quantity_total) ? header_info.s_quantity_total : 0 }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="statistic-bottom">
                <div class="section-amount">
                    <div class="statistic-item-outer section-amount-1">
                        <div class="statistic-item">
                            <span class="statistic-line"></span>
                            <span class="statistic-img amount-img-1"></span>
                            <div class="statistic-content">
                                <p>
                                    订单服务费总额（元）
                                    <el-tooltip class="item" content="截止到十分钟前" placement="right">
                                        <div class="tips-icon"></div>
                                    </el-tooltip>
                                </p>
                                <div class="statistic-detail">
                                    <span class="ellipsis" :style="{
                                        color: parseFloat(header_info.s_service_total) ? '#FFB73C' : '',
                                    }">
                                        {{ header_info.s_service_total }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="statistic-item-outer">
                        <div class="statistic-item">
                            <span class="statistic-img amount-img-2"></span>
                            <div class="statistic-content">
                                <p>
                                    订单优惠总额（元）
                                    <el-tooltip class="item" content="截止到十分钟前" placement="right">
                                        <div class="tips-icon"></div>
                                    </el-tooltip>
                                </p>
                                <div class="statistic-detail">
                                    <span class="ellipsis" :style="{
                                        color: parseFloat(header_info.s_preferential_total) ? '#80ADFF' : '',
                                    }">
                                        {{ header_info.s_preferential_total }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="statistic-item-outer">
                        <div class="statistic-item">
                            <span class="statistic-img amount-img-3"></span>
                            <div class="statistic-content">
                                <p>
                                    订单未支付总额（元）
                                    <el-tooltip class="item" content="截止到十分钟前" placement="right">
                                        <div class="tips-icon"></div>
                                    </el-tooltip>
                                </p>
                                <div class="statistic-detail">
                                    <span class="ellipsis" :style="{
                                        color: parseFloat(header_info.s_unpaid_total) ? '#80ADFF' : '',
                                    }">
                                        {{ header_info.s_unpaid_total }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="section-amount">
                    <div class="statistic-item-outer section-amount-1">
                        <div class="statistic-item">
                            <span class="statistic-line" style="background: #7f84c0"></span>
                            <span class="statistic-img amount-img-4"></span>
                            <div class="statistic-content">
                                <p>
                                    订单电费总额（元）
                                    <el-tooltip class="item" content="截止到十分钟前" placement="right">
                                        <div class="tips-icon"></div>
                                    </el-tooltip>
                                </p>
                                <div class="statistic-detail">
                                    <span class="ellipsis" :style="{
                                        color: parseFloat(header_info.s_charge_total) ? '#7F84C0' : '',
                                    }">
                                        {{ header_info.s_charge_total }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="statistic-item-outer">
                        <div class="statistic-item">
                            <span class="statistic-img amount-img-5"></span>
                            <div class="statistic-content">
                                <p>
                                    实际营收总额（元）
                                    <el-tooltip class="item" content="截止到十分钟前" placement="right">
                                        <div class="tips-icon"></div>
                                    </el-tooltip>
                                </p>
                                <div class="statistic-detail">
                                    <span class="ellipsis" :style="{
                                        color: parseFloat(header_info.s_real_total) ? '#FF6632' : '',
                                    }">
                                        {{ header_info.s_real_total }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="statistic-item-outer">
                        <div class="statistic-item">
                            <span class="statistic-img amount-img-6"></span>
                            <div class="statistic-content">
                                <p>
                                    售后退款总额（元）
                                    <el-tooltip class="item" content="截止到十分钟前" placement="right">
                                        <div class="tips-icon"></div>
                                    </el-tooltip>
                                </p>
                                <div class="statistic-detail">
                                    <span class="ellipsis" :style="{
                                        color: parseFloat(header_info.s_handle_total) ? '#7F84C0' : '',
                                    }">
                                        {{ header_info.s_handle_total }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="section-list section-analysis clearfix">
            <div class="section-item">
                <div class="section-item-header clearfix">
                    <span>近7天营收分析（用户量）</span>
                    <el-tooltip class="item" placement="right">
                        <div slot="content">
                            截止到昨天
                            <br />
                            当天产生订单用户量和当天订单总金额的对比
                            <br />
                            注意：
                            <br />
                            1. 数据汇总时间为下午14点 
                            <br />
                            2. 汇总方式以账单生成时间为依据
                        </div>
                        <div class="tips-icon"></div>
                    </el-tooltip>
                </div>
                <div class="section-item-content">
                    <div class="section-charts-title">
                        <span>用户（个）</span>
                        <span class="charts-title-right">金额（元）</span>
                    </div>
                    <div is="userProfitChart" ref="userProfitChart" label="seven_revenu_data"></div>
                </div>
            </div>
            <div class="section-item">
                <div class="section-item-header clearfix">
                    <span>近7天营收分析（订单数）</span>
                    <el-tooltip class="item" placement="right">
                        <div slot="content">
                            截止到昨天
                            <br />
                            当天产生订单量和当天订单总金额的对比
                            <br />
                            注意：
                            <br />
                            1. 数据汇总时间为下午14点 
                            <br />
                            2. 汇总方式以账单生成时间为依据
                        </div>
                        <div class="tips-icon"></div>
                    </el-tooltip>
                </div>
                <div class="section-item-content">
                    <div class="section-charts-title">
                        <span>订单（个）</span>
                        <span class="charts-title-right">金额（元）</span>
                    </div>
                    <div is="orderProfitChart" ref="orderProfitChart" label="seven_order_data"></div>
                </div>
            </div>
            <div class="section-item">
                <div class="section-item-header clearfix">
                    <span>近7天营收分析（电量）</span>
                    <el-tooltip class="item" placement="right">
                        <div slot="content">
                            截止到昨天
                            <br />
                            当天产生订单总用电量和当天订单总金额的对比
                            <br />
                            注意：
                            <br />
                            1. 数据汇总时间为下午14点 
                            <br />
                            2. 汇总方式以账单生成时间为依据
                        </div>
                        <div class="tips-icon"></div>
                    </el-tooltip>
                </div>
                <div class="section-item-content">
                    <div class="section-charts-title">
                        <span>电量（度）</span>
                        <span class="charts-title-right">金额（元）</span>
                    </div>
                    <div is="electricProfitChart" ref="electricProfitChart" label="seven_electic_data"></div>
                </div>
            </div>
        </div>
        <!-- 近7天充电启动方式百分比 -->
        <div class="section-list section-useRate clearfix">
            <div class="section-item section-left">
                <div class="section-item-header clearfix">
                    <span>近7天充电启动方式百分比</span>
                    <el-tooltip class="item" placement="right">
                        <div slot="content">截止到昨天</div>
                        <div class="tips-icon"></div>
                    </el-tooltip>
                </div>
                <div class="section-item-content">
                    <div is="stackPercentChart" ref="stackPercentChart" label="seven_startup_type"></div>
                </div>
            </div>
            <div class="section-right-outer">
                <div class="section-item">
                    <div class="section-item-header clearfix">
                        <span>7天内充电站营收金额</span>
                        <el-tooltip class="item" placement="right">
                            <div slot="content">截止到昨天</div>
                            <div class="tips-icon"></div>
                        </el-tooltip>
                    </div>
                    <div class="section-table-inner">
                        <div class="table section-table">
                            <div class="table-th">
                                <div class="table-td">
                                    <span class="td-item">排名</span>
                                </div>
                                <div class="table-td table-addr">
                                    <span class="td-item">充电站</span>
                                </div>
                                <div class="table-td">
                                    <span class="td-item">营收金额（元）</span>
                                </div>
                            </div>
                            <div class="table-body scrollBar">
                                <div v-show="tableData.length" v-for="(item, index) in tableData" :key="index"
                                    class="table-tr">
                                    <div class="table-td">
                                        <span class="td-item">
                                            <span class="item-text ellipsis">{{ parseInt(index) + 1 }}</span>
                                        </span>
                                    </div>
                                    <div class="table-td table-addr">
                                        <span class="td-item">
                                            <span class="item-text ellipsis" :title="item.station_name">{{ item.station_name
                                            }}</span>
                                        </span>
                                    </div>
                                    <div class="table-td">
                                        <span class="td-item">
                                            <span class="item-text ellipsis" :title="item.s_amount_total">{{
                                                item.s_amount_total }}</span>
                                        </span>
                                    </div>
                                </div>
                                <div v-show="!tableData.length" class="table-tr unData">
                                    <img :src="require('assets/img/unData.png')" />
                                    暂无数据
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="section-list section-online clearfix">
            <!-- 活跃充电用户 -->
            <div class="section-item">
                <div class="section-item-header clearfix">
                    <span>活跃充电用户</span>
                    <el-tooltip class="item" content="截止到十分钟前" placement="right">
                        <div class="tips-icon"></div>
                    </el-tooltip>
                </div>
                <div is="chargeUserOnline" ref="chargeUserOnline"></div>
            </div>
            <!-- 活跃充电站 -->
            <div class="section-item">
                <div class="section-item-header clearfix">
                    <span>活跃充电站</span>
                    <el-tooltip class="item" content="截止到十分钟前" placement="right">
                        <div class="tips-icon"></div>
                    </el-tooltip>
                </div>
                <div is="chargeStationOnline" ref="chargeStationOnline"></div>
            </div>
            <!-- 活跃充电桩 -->
            <div class="section-item">
                <div class="section-item-header clearfix">
                    <span>活跃充电桩</span>
                    <el-tooltip class="item" content="截止到十分钟前" placement="right">
                        <div class="tips-icon"></div>
                    </el-tooltip>
                </div>
                <div is="chargePileOnline" ref="chargePileOnline"></div>
            </div>
        </div>
    </section>
</template>

<script>
//用户营收
import userProfitChart from './components/userProfitChart'
import orderProfitChart from './components/orderProfitChart'
import electricProfitChart from './components/electricProfitChart'
import stackPercentChart from './components/stackPercentChart'
import chargeUserOnline from './components/chargeUserOnline'
import chargeStationOnline from './components/chargeStationOnline'
import chargePileOnline from './components/chargePileOnline'

export default {
    name: '',
    components: {
        userProfitChart,
        orderProfitChart,
        electricProfitChart,
        stackPercentChart,
        chargeUserOnline,
        chargeStationOnline,
        chargePileOnline,
    },
    data() {
        return {
            area_id: '',
            station_id: '',
            area_list: [],
            station_list: [],
            header_info: {
                s_order_total: 0,
                s_charge_total: 0,
                s_quantity_total: 0,
                s_service_total: 0,
                s_user_count: 0,
                s_station_count: 0,
            },
            tableData: [],
        }
    },
    created() {
        this.getAreaList()
        this.loadingData()
    },
    methods: {
        //获取全国的地域列表
        getAreaList: function () {
            var that = this
            this.$api.getAreaList({}).then(res => {
                that.area_list = res.data
            })
        },

        //获取充电站
        getStations(provinceCode) {
            this.station_id = ''
            this.$api.getMaintenanceStationData({ provinceCode }).then(res => {
                if (res.code === 1) {
                    const data = res.data || {}
                    this.station_list = Object.keys(data).map(param => {
                        return { id: param, name: data[param] }
                    })
                }
            })
        },

        //切换区域
        changeArea(provinceCode) {
            this.getStations(provinceCode)
            this.loadingData()
        },
        //切换站
        changStation(id) {
            this.station_id = id
            this.loadingData()
        },

        // 获取概览的头部信息
        getHeaderData: function () {
            var that = this
            this.$api.getHeaderData({ provinceCode: this.area_id, station_id: this.station_id }).then(res => {
                if (res.code == 1) {
                    that.header_info = res.data
                }
            })
        },
        //显示近七天营收分析
        getSevenUserCount: function () {
            var that = this
            this.$api.getSevenData({ provinceCode: this.area_id, station_id: this.station_id }).then(res => {
                const userProfitChart = that.$refs.userProfitChart
                const orderProfitChart = that.$refs.orderProfitChart
                const electricProfitChart = that.$refs.electricProfitChart
                //近7天营收分析（用户量）
                userProfitChart && userProfitChart.showUserProfitChart(res.data)
                //近7天营收分析（订单数）
                orderProfitChart && orderProfitChart.showOrderProfitChart(res.data)
                //近7天营收分析（电量）
                electricProfitChart && electricProfitChart.showElectricProfitChart(res.data)
            })
        },

        //显示近7天电启动方式百分比
        getSevenChargingPercent: function () {
            const that = this
            this.$api
                .getOperationSevenChargingPercent({ provinceCode: this.area_id, station_id: this.station_id })
                .then(res => {
                    const stackPercentChart = that.$refs.stackPercentChart
                    if (res.code === 1) {
                        stackPercentChart && stackPercentChart.showEcharts(res.data)
                    } else {
                        this.$sfNotify({
                            duration: 0,
                            type: 'error',
                            message: res.message,
                        })
                    }
                })
                .catch(err => {
                    console.error(err)
                })
        },
        //获取活跃充电桩和充电站的图表
        getActive: function () {
            var that = this
            this.$api.getActive({ provinceCode: this.area_id, station_id: this.station_id }).then(res => {
                var data = res.data
                const chargeStationOnline = that.$refs.chargeStationOnline
                const chargePileOnline = that.$refs.chargePileOnline
                chargeStationOnline &&
                    chargeStationOnline.showChargeStationOnline({
                        x: data.data_x,
                        y: data.s_active_station_total,
                        today_count: data.rate.active_station_count,
                        change_rate: data.rate.active_station_rate,
                        rate_flag: data.rate.active_station_rate_flag,
                    })
                chargePileOnline &&
                    chargePileOnline.showChargePileOnline({
                        x: data.data_x,
                        y: data.s_active_pile_total,
                        today_count: data.rate.active_pile_count,
                        change_rate: data.rate.active_pile_rate,
                        rate_flag: data.rate.active_pile_rate_flag,
                    })
            })
        },
        //获取充电站的营收
        getStationAmount: function () {
            var that = this
            this.$api.getStationAmount({ provinceCode: this.area_id, station_id: this.station_id }).then(res => {
                that.tableData = res.data.list
            })
        },
        //获取活跃的用户数据
        getActiveUser: function () {
            var that = this
            this.$api.getActiveUser({ provinceCode: this.area_id, station_id: this.station_id }).then(res => {
                var data = res.data
                const chargeUserOnline = that.$refs.chargeUserOnline
                chargeUserOnline &&
                    chargeUserOnline.showChargeUserOnline({
                        x: data.data_x,
                        y: data.active_user_total,
                        today_count: data.today_active_user,
                        change_rate: data.active_user_rate,
                        rate_flag: data.active_user_rate_flag,
                    })
            })
        },
        //地域改变加载数据
        loadingData: function () {
            this.getHeaderData()
            this.getSevenUserCount()
            this.getStationAmount()
            this.getActive()
            this.getActiveUser()
            this.getSevenChargingPercent()
        },
    },
}
</script>
<style lang="scss" scoped>
@import '../../assets/css/data/index.scss';
</style>
