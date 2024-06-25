<template>
    <section>
        <div class="section-title">设备故障记录</div>
        <div class="section-header">
            <div class="section-item-header clearfix">
                <span>筛选查询</span>
            </div>
            <div class="header-content clearfix">
                <div class="content-item">
                    <el-select class="search-type" v-model="modelObj.sea_type">
                        <el-option label="名称" value="1" />
                        <el-option label="充电桩编号" value="2" />
                    </el-select>
                    <el-input class="search-input" v-model="modelObj.search" :placeholder="`请输入${placeholder_arr[modelObj.sea_type]}`" />
                </div>
                <div class="content-item">
                    <div class="header-left">发生时间</div>
                    <div class="header-right">
                        <el-date-picker v-model="modelObj.start_time" type="date" placeholder="选择开始日期" value-format="yyyy-MM-dd" :picker-options="pickerOptionsStart" @change="changeStartDate"></el-date-picker>
                        <el-date-picker class="end-time" v-model="modelObj.end_time" type="date" placeholder="选择结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptionsEnd" @change="changeEndDate"></el-date-picker>
                    </div>
                </div>
                <div class="content-item">
                    <div class="header-left">所属站点</div>
                    <div class="header-right">
                        <el-select v-model="modelObj.station_id">
                            <el-option v-for="(item, index) in all_stations" :key="index" style="width: 148px" :label="item.station_name" :value="item.station_id" />
                        </el-select>
                    </div>
                </div>
                <div class="content-item">
                    <div class="btn_succ" @click="searchPile()">查询</div>
                    <div class="btn_cancel" @click="resetSearch()">重置</div>
                </div>
            </div>
        </div>
        <div class="section-container">
            <div class="section-item-header clearfix">
                <span>故障列表</span>
                <div class="btn_recovery export-btn" @click="faultExport">
                    <i class="export-icon"></i>
                    导出
                </div>
            </div>
            <div class="section-main">
                <div class="table">
                    <div class="table-th clearfix">
                        <div class="table-td table-column__1">桩名称</div>
                        <div class="table-td">枪口号</div>
                        <div class="table-td">所属站点</div>
                        <div class="table-td">发生时间</div>
                    </div>
                    <div class="table-body" v-loading="listLoading">
                        <div class="table-tr" v-show="tableData && tableData.length" v-for="(fault, index) in tableData" :key="index">
                            <div class="table-td table-column__1">
                                <div class="td-item">{{ fault.pile_name }}</div>
                            </div>
                            <div class="table-td">
                                <div class="td-item">{{ fault.gun_index }}</div>
                            </div>
                            <div class="table-td">
                                <div class="td-item">{{ fault.station_name }}</div>
                            </div>
                            <div class="table-td">
                                <div class="td-item td-time">
                                    {{ fault.dt ? fault.dt : '--' }}
                                </div>
                            </div>
                        </div>
                        <div class="table-tr unData" v-if="!tableData || tableData.length === 0">
                            <img :src="require('assets/img/unData.png')" />
                            <span>暂无数据</span>
                        </div>
                    </div>
                    <!-- 分页 -->
                    <sf-pagination v-show="tableData && tableData.length" :currentPage="currentPage" :page-count="page_count" @current-change="handleCurrentChange" />
                </div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    data() {
        const operator_id = (this.$route.query && this.$route.query.operator_id) || ''
        return {
            operator_id,
            ENV: process.env.NODE_ENV == 'development' ? '/api' : '',
            placeholder_arr: ['', '名称', '充电桩编号'],
            modelObj: {
                sea_type: '1',
                search: '',
                ftype: '',
                etype: '',
                start_time: '',
                end_time: '',
                station_id: '',
                operator_id,
            },
            isImport: 0,
            currentPage: 1,
            page_count: 1,
            listLoading: false,
            all_stations: [{ station_name: '全部', station_id: '' }],
            tableData: [],
            etype_array: {
                0: '发生故障',
                1: '自动恢复故障',
                2: '手动恢复故障',
            },
            ftype_array: {
                1: '设备故障',
                2: '电源故障',
                3: '车辆故障',
                8: '未知故障',
            },
            pickerOptionsStart: {
                disabledDate(time) {
                    return false
                },
            },
            pickerOptionsEnd: {
                disabledDate(time) {
                    return false
                },
            },
        }
    },
    created() {
        this.getAllStation()
        this.getMonthDay()
        this.getTableDataList()
    },
    methods: {
        getAllStation() {
            this.$api.pileAgentStation({ operator_id: this.operator_id }).then(data => {
                if (data.code == 1) {
                    this.all_stations = this.all_stations.concat(data.data)
                }
            })
        },
        getTableDataList() {
            this.listLoading = true
            this.modelObj.page = this.currentPage
            this.$api.malfunction(this.modelObj).then(data => {
                this.listLoading = false
                if (data.code == 1) {
                    this.tableData = data.data.list
                    this.currentPage = data.data.current_page
                    this.page_count = data.data.page_total
                    this.isImport = data.data.is_import
                }
            })
        },
        searchPile() {
            this.currentPage = 1
            this.tableData = []
            this.getTableDataList()
        },
        resetSearch() {
            this.modelObj.sea_type = '1'
            this.modelObj.search = ''
            this.modelObj.ftype = ''
            this.modelObj.etype = ''
            this.modelObj.date = ''
            this.modelObj.station_id = ''
            this.currentPage = 1
            this.page_count = 1
            this.tableData = []
            this.getMonthDay()
            this.getTableDataList()
        },
        // 点击分页触发
        handleCurrentChange(page) {
            this.currentPage = page
            this.getTableDataList()
        },
        /*
        获取当月的第一天
         */
        getMonthDay() {
            var date = new Date()
            var toDay = this.$utils.formatDate(date, 'yyyy-MM-dd')
            this.modelObj.end_time = toDay
            date.setDate(1)
            var _date = this.$utils.formatDate(date, 'yyyy-MM-dd')
            this.modelObj.start_time = _date
        },
        changeStartDate() {
            var lastDate = this.getMonthLastDate(this.modelObj.start_time)
            var endDate = this.modelObj.end_time
            var startDate = this.modelObj.start_time
            var splitStartDate = startDate.split('-')
            var splitEndDate = endDate.split('-')

            if (splitStartDate[1] != splitEndDate[1] || splitStartDate[0] != splitEndDate[0]) {
                this.modelObj.end_time = splitStartDate[0] + '-' + splitStartDate[1] + '-' + lastDate
            }

            if (splitStartDate[2] > splitEndDate[2]) {
                this.modelObj.end_time = splitStartDate[0] + '-' + splitStartDate[1] + '-' + lastDate
            }
        },
        changeEndDate() {
            var endDate = this.modelObj.end_time
            var startDate = this.modelObj.start_time
            var splitStartDate = startDate.split('-')
            var splitEndDate = endDate.split('-')
            if (splitStartDate[1] != splitEndDate[1] || splitStartDate[0] != splitEndDate[0]) {
                this.modelObj.start_time = splitEndDate[0] + '-' + splitEndDate[1] + '-01'
            }

            if (splitStartDate[2] > splitEndDate[2]) {
                this.modelObj.start_time = splitEndDate[0] + '-' + splitEndDate[1] + '-01'
            }
        },
        getMonthLastDate(_date) {
            var splitDate = _date.split('-')
            var date = new Date(splitDate[0], splitDate[1], 0)
            return date.getDate()
        },
        /*
      导出故障列表
       */
        faultExport() {
            if (!this.isImport) {
                this.$sfMessage.error('抱歉，当前用户没有操作权限')
                return
            }
            window.location.href = `${this.ENV}/malfunction/export?operator_id=${this.modelObj.operator_id}&start_time=${this.modelObj.start_time}&end_time=${this.modelObj.end_time}&station_id=${this.modelObj.station_id}&sea_type=${this.modelObj.sea_type}&search=${this.modelObj.search}&ftype=${this.modelObj.ftype}&etype=${this.modelObj.etype}`
        },
    },
}
</script>
<style lang="scss" scoped>
@import '../../assets/css/run/log.scss';
</style>
