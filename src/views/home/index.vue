<template>
    <section>
        <div class="section-title">首页</div>
        <!-- 设备数据 -->
        <div class="section-device">
            <div class="device-item">
                <span class="device-img device-img-1"></span>
                <div class="device-content">
                    <p class="device-title">
                        设备数量（个）
                    </p>
                    <p class="device-detail device-detail-total ellipsis">
                        {{ header_info.s_service_total }}
                    </p>
                </div>
            </div>
            <div class="device-item">
                <span class="device-img device-img-2"></span>
                <div class="device-content">
                    <p class="device-title">
                        在线设备（个）
                    </p>
                    <p class="device-detail device-detail-inline ellipsis">
                        {{ header_info.s_preferential_total }}
                    </p>
                </div>
            </div>
            <div class="device-item">
                <span class="device-img device-img-3"></span>
                <div class="device-content">
                    <p class="device-title">
                        离线设备（个）
                    </p>
                    <p class="device-detail device-detail-off ellipsis">
                        {{ header_info.s_unpaid_total }}
                    </p>
                </div>
            </div>
        </div>
        <!-- 设备在线/离线数量统计 -->
        <div class="section-list section-useRate clearfix">
            <div class="section-item-header clearfix">
                <span>设备状态数量统计</span>
            </div>
            <div class="section-item-content">
                <div is="stackPercentChart" ref="stackPercentChart" label="device_status_count"></div>
            </div>
        </div>
    </section>
</template>

<script>
import stackPercentChart from './components/stackPercentChart'

export default {
    name: '',
    components: {
        stackPercentChart,
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
        this.loadingData()
    },
    methods: {

        // 获取设备信息
        getHeaderData: function () {
            var that = this
            this.$api.getHeaderData({ provinceCode: this.area_id, station_id: this.station_id }).then(res => {
                res = { "code": 1, "message": "", "data": { 
                    "s_order_total": "1772368",
                     "s_unpaid_total": 10, 
                     "s_quantity_total": "38773166.7485", 
                     "s_service_total": 50, 
                     "s_charge_total": 23010673.7176, 
                     "s_real_total": 32865141.1013,
                      "s_preferential_total": 40, 
                      "s_handle_total": 372.8838,
                       "s_station_count": "66", "s_user_count": "64859", "s_pile_total": "851" } }

                if (res.code == 1) {
                    that.header_info = res.data
                }
            })
        },

        // 获取详细在线离线设备
        getSevenChargingPercent: function () {
            const that = this
            this.$api
                .getOperationSevenChargingPercent({ provinceCode: this.area_id, station_id: this.station_id })
                .then(res => {
                    res = {
                        "code": 1, "message": "", "data": {
                            "inline": [10, 2, 4, 5, 2, 4, 1],
                            "offline": [3, 4, 2, 3, 1, 1, 0],
                            "date_x": ["水位计", "雨量计", "静力水准仪", "拉绳位移计", '旋转磁力仪', '无定向磁力仪', '超导磁力仪']
                        }
                    }

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
        //地域改变加载数据
        loadingData: function () {
            this.getHeaderData()
            this.getSevenChargingPercent()
        },
    },
}
</script>
<style lang="scss" scoped>
@import '../../assets/css/data/index.scss';
</style>
