<template>
    <section>
        <div class="section-title">
            <router-link to="/data/history">历史数据</router-link>
            > 充电桩详情
        </div>
        <div class="section-name">
            <p>当前充电桩：{{ pile_name }}</p>
            <p>充电桩编号：{{ pile_sn }}</p>
        </div>
        <div class="section-container" style="margin-top: 0px">
            <div class="section-item-header clearfix">
                <span>每日充电数据</span>
            </div>
            <div>
                <div class="header-content clearfix">
                    <div class="content-item">
                        <div class="header-left">选择日期</div>
                        <div class="header-right time-month">
                            <el-date-picker v-model="date" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" @change="changeDate"></el-date-picker>
                        </div>
                    </div>
                    <div class="content-item">
                        <div class="header-left">选择时间段</div>
                        <div class="header-right time-second">
                            <el-time-picker is-range style="width: 172px" v-model="time" range-separator="至" placeholder="请选择时间" start-placeholder="开始时间" end-placeholder="结束时间" value-format="HH:mm" format="HH:mm" @change="changeTime"></el-time-picker>
                        </div>
                    </div>
                    <div class="content-item">
                        <div class="header-left">选择充电枪</div>
                        <div class="header-right">
                            <el-select v-model="modelObj.gun_id" @change="changeSelectGun">
                                <el-option v-for="(item, index) in selectGunList" :key="index" style="width: 148px" :label="'充电枪' + item.gun_sn" :value="item.gun_sn"></el-option>
                            </el-select>
                        </div>
                    </div>
                </div>
                <div class="history-chart">
                    <div is="historyELecChart" ref="historyELecChart" style="width: 100%; height: 400px; border-bottom: 1px solid #f0f0f0"></div>
                </div>
            </div>
            <div class="section-item-header" style="display: flex; justify-content: space-between">
                <div class="header-content clearfix">
                    <div class="content-item">
                        <div class="header-left">选择数据点</div>
                        <div class="header-right">
                            <el-select v-model="modelObj.data_key" @change="changeSelectPoint">
                                <el-option v-for="(item, index) in selectList" :key="index" style="width: 148px" :label="item.title" :value="item.value"></el-option>
                            </el-select>
                        </div>
                    </div>
                </div>
                <div class="btn_recovery export-btn" @click="elecExport">
                    <i class="export-icon"></i>
                    导出
                </div>
            </div>
            <div class="section-main">
                <div class="table">
                    <div class="table-th clearfix">
                        <div class="table-td">数据点名称</div>
                        <div class="table-td">
                            {{ modelObj.data_key !== 'gun_status' ? '时间' : '开始充电时间' }}
                        </div>
                        <div class="table-td">
                            {{ modelObj.data_key !== 'gun_status' ? '数值' : '结束充电时间' }}
                        </div>
                    </div>
                    <div class="table-body" v-loading="listLoading">
                        <div class="table-tr" v-show="tableData && tableData.length > 0" v-for="(item, index) in tableData" :key="index">
                            <div class="table-td">
                                <div class="td-item">
                                    {{ selectList_array[modelObj.data_key] | showTitle }}
                                </div>
                            </div>
                            <div class="table-td">
                                <div class="td-item">{{ item.dt }}</div>
                            </div>
                            <div class="table-td">
                                <div class="td-item">
                                    {{ item[modelObj.data_key] }}
                                </div>
                            </div>
                        </div>
                        <div v-if="!tableData || tableData.length == 0" class="table-tr unData">
                            <img :src="require('assets/img/unData.png')" />
                            <span>暂无数据</span>
                        </div>
                    </div>
                    <!-- 分页 -->
                    <sf-pagination v-if="tableData && tableData.length > 0" :currentPage="currentPage" :page-count="page_count" @current-change="handleCurrentChange" />
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import historyELecChart from './components/historyELecChart'

export default {
    components: {
        historyELecChart,
    },
    data() {
        const typeFlag = this.$route.params.pile_type === '2' ? true : false
        let selectList = [
            { title: '输出电压（V）', value: 'out_voltage' },
            { title: '输出电流（A）', value: 'out_electric' },
        ]
        let selectList_array = {
            out_voltage: {
                title: '输出电压',
                color: '#FF6632',
                icon: 'history_6',
                unit: 'V',
            },
            out_electric: {
                title: '输出电流',
                color: '#6AC2E5',
                icon: 'history_7',
                unit: 'A',
            },
        }
        if (!typeFlag) {
            selectList = [
                { title: 'BCL-电压需求（V）', value: 'bcl_voltage' },
                { title: 'BCL-电流需求（A）', value: 'bcl_electric' },
                { title: 'BCS-充电电压测量值（V）', value: 'bcs_voltage' },
                { title: 'BCS-充电电流测量值（A）', value: 'bcs_electric' },
                { title: '枪线温度（°C）', value: 'gun_temperature' },
                ...selectList,
                { title: '电池组最高温度（°C）', value: 'max_temperature' },
                { title: 'SOC（％）', value: 'soc' },
            ]
            selectList_array = {
                bcl_voltage: {
                    title: 'BCL-电压需求',
                    color: '#5B8FF9',
                    icon: 'history_1',
                    unit: 'V',
                },
                bcl_electric: {
                    title: 'BCL-电流需求',
                    color: '#E76497',
                    icon: 'history_2',
                    unit: 'A',
                },
                bcs_voltage: {
                    title: 'BCS-充电电压测量值',
                    color: '#57DC7C',
                    icon: 'history_3',
                    unit: 'V',
                },
                bcs_electric: {
                    title: 'BCS-充电电流测量值',
                    color: '#8B93F0',
                    icon: 'history_4',
                    unit: 'A',
                },
                gun_temperature: {
                    title: '枪线温度',
                    color: '#F6BD16',
                    icon: 'history_5',
                    unit: '°C',
                },
                ...selectList_array,
                max_temperature: {
                    title: '电池组最高温度',
                    color: '#9270CA',
                    icon: 'history_8',
                    unit: '°C',
                },
                soc: {
                    title: 'SOC',
                    color: '#E58C45',
                    icon: 'history_9',
                    unit: '％',
                },
            }
        }

        selectList = [...selectList, { title: '累计充电时间（min）', value: 'total_time' }, { title: '充电总度数（kWh）', value: 'total_power' }, { title: '账单金额（元）', value: 'total_money' }, { title: '充电桩启停', value: 'gun_status' }]

        selectList_array = {
            ...selectList_array,
            total_time: {
                title: '累计充电时间',
                color: '#38B487',
                icon: 'history_10',
                unit: 'min',
            },
            total_power: {
                title: '充电总度数',
                color: '#FFA98C',
                icon: 'history_11',
                unit: 'kWh',
            },
            total_money: {
                title: '账单金额',
                color: '#504DFC',
                icon: 'history_12',
                unit: '元',
            },
            gun_status: {
                title: '充电枪启停',
                color: '#E8E9FC',
                icon: 'history_13',
            },
        }

        return {
            ENV: process.env.NODE_ENV == 'development' ? '/api' : '',
            currentPage: 1,
            page_count: 1,
            tableData: [],
            listLoading: false,
            pile_name: this.$route.params.pile_name,
            pile_sn: this.$route.params.pile_sn,
            date: this.getDateTime('date'),
            time: this.getDateTime('time'),
            modelObj: {
                pile_sn: this.$route.params.pile_sn,
                date: '',
                start_time: '',
                end_time: '',
                gun_id: '1',
                data_key: !typeFlag ? 'bcl_voltage' : 'out_voltage',
            },
            is_export: 0,
            selectGunList: [],
            selectList,
            selectList_array,
        }
    },
    created() {
        this.getSelectPileGunList()
        this.firstLoadingData()
        this.getTableDataList()
        this.getHistoryElecChart()
    },
    filters: {
        noteNllipsis(value) {
            if (!value) return '--'
            if (value.length > 38) {
                return value.slice(0, 38) + '...'
            }
            return value
        },
        showTitle(titleObj) {
            const { title } = titleObj
            if (title) return title
        },
    },
    watch: {
        time: {
            handler: function (newItem) {
                if (newItem) localStorage.setItem('time', JSON.stringify(newItem))
            },
            deep: true,
        },
        date: {
            handler: function (value) {
                if (value) localStorage.setItem('date', value)
            },
        },
    },
    methods: {
        //获取默认时间
        getDateTime(type) {
            if (type === 'time') {
                const localTime = localStorage.getItem('time')
                if (localTime) return JSON.parse(localTime)
                return [new Date(0, 0, 0, 0, 0), new Date(0, 0, 0, new Date().getHours(), new Date().getMinutes())]
            }

            if (type === 'date') {
                const localDate = localStorage.getItem('date')
                if (localDate) return localDate
                return new Date(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate(), 0, 0)
            }
        },

        //初次加载数据赋值
        firstLoadingData() {
            if (this.date.toString().indexOf('+') != -1) {
                let year = new Date().getFullYear()
                let month = new Date().getMonth() + 1
                let day = new Date().getDate()
                if (new Date().getMonth() + 1 < 10) {
                    month = '0' + (new Date().getMonth() + 1)
                }

                if (new Date().getDate() < 10) {
                    day = '0' + new Date().getDate()
                }

                this.date = year + '-' + month + '-' + day
                this.modelObj.date = year + '-' + month + '-' + day
            } else if (typeof this.date === 'string') {
                this.modelObj.date = this.date
            }
            if (this.time[0].toString().indexOf('+') != -1) {
                this.modelObj.start_time = '00:00'
                let hour = new Date().getHours();
                let minute = new Date().getMinutes();
                if (hour < 10) {
                    hour = '0'+hour
                }

                if (minute < 10) {
                    minute = '0' + minute
                }
                this.modelObj.end_time = (hour + ':' + minute).toString()
            } else if (typeof this.time[0] === 'string' && typeof this.time[1] === 'string') {
                this.modelObj.start_time = this.time[0]
                this.modelObj.end_time = this.time[1]
            }
        },
        //选择日期
        changeDate() {
            this.currentPage = 1
            this.modelObj.page = this.currentPage
            this.modelObj.date = this.date
            this.getLoadData()
        },
        //切换时间
        changeTime() {
            this.currentPage = 1
            this.modelObj.page = this.currentPage
            if (this.time[0] == this.time[1]) {
                this.$sfNotify({
                    duration: 0,
                    type: 'error',
                    message: '开始时间和结束时间不能一样！',
                })
            } else {
                this.modelObj.start_time = this.time[0]
                this.modelObj.end_time = this.time[1]
                this.getLoadData()
            }
        },
        //选择充电枪
        changeSelectGun() {
            this.currentPage = 1
            this.modelObj.page = this.currentPage
            this.getLoadData()
        },

        //选择数据点
        changeSelectPoint () {
            this.currentPage = 1
            this.modelObj.page = this.currentPage
            this.getTableDataList()
        },
        //加载数据
        getLoadData() {
            this.getHistoryElecChart()
            this.getTableDataList()
        },
        //图表显示
        getHistoryElecChart() {
            this.$api.getHistoryDetailChartList(this.modelObj).then(res => {
                if (res.code === 1) {
                    const historyELecChart = this.$refs.historyELecChart
                    historyELecChart &&
                        historyELecChart.showEcharts({
                            mapList: this.selectList_array,
                            chartData: res.data,
                        })
                }
            })
        },

        //选择充电枪表
        getSelectPileGunList() {
            this.$api.getHistoryDetailSelectGunList({ pile_sn: this.$route.params.pile_sn }).then(res => {
                if (res.code == 1) {
                    this.selectGunList = res.data
                }
            })
        },
        //数据点列表
        getTableDataList() {
            this.listLoading = true
            this.modelObj.page = this.currentPage
            this.$api.getHistoryDetailList({ ...this.modelObj, limit: 30 }).then(res => {
                this.listLoading = false
                if (res.code == 1) {
                    this.tableData = res.data.list
                    this.currentPage = res.data.current_page
                    this.page_count = res.data.page_total
                    this.is_export = res.data.is_export
                }
            })
        },
        // 点击分页触发
        handleCurrentChange(page) {
            this.currentPage = page
            this.getTableDataList()
        },
        /*
    导出账单列表
    */
        elecExport() {
            if (this.is_export) {
                window.location.href = `${this.ENV}/history/export?pile_sn=${this.modelObj.pile_sn}&date=${this.modelObj.date}&start_time=${this.modelObj.start_time}&end_time=${this.modelObj.end_time}&gun_id=${this.modelObj.gun_id}&data_key=${this.modelObj.data_key}`
            } else {
                this.$sfMessage.error('抱歉，当前用户没有操作权限')
            }
        },
    },
}
</script>

<style lang="scss" scoped>
@import '../../assets/css/data/historyDetail.scss';
.is-plug-status {
    color: #ff6632;
}
</style>
