<template>
    <section>
        <div class="section-title">账单管理</div>
        <div class="section-header">
            <div class="section-item-header clearfix">
                <span>筛选查询</span>
            </div>
            <div class="header-content clearfix">
                <div class="content-item">
                    <el-select class="search-type" v-model="modelObj.search_type">
                        <el-option label="账单编号" value="1" />
                        <el-option label="用户账号" value="2" />
                        <el-option label="刷卡账号" value="4" />
                        <el-option label="充电桩编号" value="3" />
                        <el-option label="车架号" value="5" />
                    </el-select>
                    <el-input class="search-input" v-model="modelObj.search_content" placeholder="关键字搜索" />
                </div>
                <div class="content-item">
                    <div class="header-left">账单生成时间</div>
                    <div class="header-right">
                        <el-date-picker v-model="modelObj.start_time" type="date" placeholder="选择开始日期" value-format="yyyy-MM-dd" :picker-options="pickerOptionsStart" @change="changeStartDate"></el-date-picker>
                        <el-date-picker class="end-time" v-model="modelObj.end_time" type="date" placeholder="选择结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptionsEnd" @change="changeEndDate"></el-date-picker>
                    </div>
                </div>
                <div class="content-item">
                    <div class="header-left">账单类型</div>
                    <div class="header-right">
                        <el-select v-model="modelObj.user_type">
                            <el-option label="全部" value="all" />
                            <el-option label="App账单" value="1" />
                            <el-option label="刷卡账单" value="2" />
                            <el-option label="远程控制账单" value="3" />
                            <el-option label="其他" value="4" />
                        </el-select>
                    </div>
                </div>
                <div class="content-item">
                    <div class="header-left">订单状态</div>
                    <div class="header-right">
                        <el-select v-model="modelObj.status">
                            <el-option label="全部" value="all" />
                            <el-option label="已支付" value="1" />
                            <el-option label="未支付" value="0" />
                        </el-select>
                    </div>
                </div>
                <div class="content-item">
                    <div class="header-left">所属充电站</div>
                    <div class="header-right">
                        <el-select v-model="modelObj.station_id">
                            <el-option label="全部" value="all" />
                            <el-option v-for="(item, index) in station_list" :label="item.station_name" :key="index" style="width: 148px" :value="item.station_id"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="content-item">
                    <div class="btn_succ" @click="seachBill">查询</div>
                    <div class="btn_cancel" @click="resetSearch">重置</div>
                </div>
            </div>
        </div>
        <div class="section-container">
            <div class="section-item-header clearfix">
                <span>账单列表</span>
                <div class="btn_recovery export-btn" @click="billExport">
                    <i class="export-icon"></i>
                    导出
                </div>
            </div>
            <div class="section-main">
                <div class="table" v-loading="loadingFlag">
                    <div class="table-th clearfix">
                        <div class="table-td table-column__1">账单编号</div>
                        <div class="table-td">账单生成时间</div>
                        <div class="table-td">用户账号</div>
                        <div class="table-td">用户类型</div>
                        <div class="table-td">充电桩编号</div>
                        <div class="table-td">充电枪编号</div>
                        <div class="table-td">所属充电站</div>
                        <div class="table-td">车架号</div>
                        <div class="table-td">账单金额（元）</div>
                        <div class="table-td">账单状态</div>
                        <div class="table-td">操作</div>
                    </div>
                    <div class="table-body">
                        <div class="table-tr" v-show="tableData && tableData.length > 0" v-for="(item, index) in tableData" :key="index">
                            <div class="table-td table-column__1">
                                <div class="td-item">{{ item.out_trade_id }}</div>
                            </div>
                            <div class="table-td">
                                <div class="td-item td-time">{{ item.create_time }}</div>
                            </div>
                            <div class="table-td">
                                <div class="td-item" v-if="item.order_type == 1 || item.order_type == 4 || item.order_type == 5 || item.order_type == 7">
                                    {{ item.tel }}
                                </div>
                                <div class="td-item" v-else-if="item.order_type == 2 || item.order_type == 8">
                                    {{ item.user_id }}
                                </div>
                                <div class="td-item" v-else>--</div>
                            </div>
                            <div class="table-td">
                                <div class="td-item">
                                    {{ item.user_type_c ? item.user_type_c : '--' }}
                                </div>
                            </div>
                            <div class="table-td">
                                <div class="td-item">{{ item.pile_sn }}</div>
                            </div>
                            <div class="table-td">
                                <div class="td-item">{{ item.gun_sn }}</div>
                            </div>

                            <div class="table-td">
                                <div class="td-item">{{ item.station_name }}</div>
                            </div>
                            <div class="table-td">
                                <div class="td-item">{{ item.vin ? item.vin : '--' }}</div>
                            </div>
                            <div class="table-td">
                                <div class="td-item">{{ item.real_amount }}</div>
                            </div>
                            <div class="table-td">
                                <div class="td-item" v-if="item.payment_status == 1">已支付</div>
                                <div class="td-item section-no-begin" v-else>未支付</div>
                            </div>
                            <div class="table-td">
                                <el-tooltip content="查看" placement="top">
                                    <router-link target="_blank" :to="`/stat/trad/bill/detail?id=${item.out_trade_id}&month=${item.create_time.substring(0, 10)}&title=${title}&operator_id=${operator_id}`" class="td-item see-icon"></router-link>
                                </el-tooltip>
                            </div>
                        </div>
                        <div v-if="!tableData || tableData.length === 0" class="table-tr unData">
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
export default {
    data () {
        this.title = (this.$route.query && this.$route.query.title) || ''
        const operator_id = (this.$route.query && this.$route.query.operator_id) || ''
        return {
            operator_id,
            ENV: process.env.NODE_ENV == 'development' ? '/api' : '',
            loadingFlag: false,
            modelObj: {
                search_type: '2',
                search_content: '',
                start_time: '',
                end_time: '',
                user_type: 'all',
                operator_type: 'all',
                operator_id,
                status: 'all',
                station_id: 'all',
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
            station_list: [],
            currentPage: 1,
            page_count: 0,
            tableData: [],
            is_export: 0,
            operationList: [{ operator_id: '', title: '全部' }],
        }
    },
    created() {
        this.getBillList()
        this.getStationList()
        this.getMonthDay()
    },
    methods: {
        changeOperationSelect() {
            if (this.modelObj.operator_type === 'all') {
                this.operationList = [{ operator_id: '', title: '全部' }]
                this.modelObj.operator_id = ''
            } else {
                this.operationList = [{ operator_id: '', title: '全部' }]
                this.modelObj.operator_id = ''
                if (this.modelObj.operator_type == 3) {
                    this.getOperation(3)
                }
                if (this.modelObj.operator_type == 4) {
                    this.getOperation(2)
                }
            }
        },
        getOperation(type) {
            this.$api.pileOperations({ type: type, operator_id: this.operator_id }).then(res => {
                if (res.code == 1) {
                    this.operationList = this.operationList.concat(res.data)
                }
            })
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
        // 点击分页触发
        handleCurrentChange(page) {
            this.currentPage = page
            this.getBillList()
        },
        seachBill() {
            this.currentPage = 1
            this.getBillList()
        },
        /*
         获取账单列表
         */
        getBillList() {
            var that = this
            that.loadingFlag = true
            this.modelObj.page = this.currentPage
            this.$api.billList(this.modelObj).then(res => {
                that.loadingFlag = false
                if (res.code == 1) {
                    that.page_count = Math.ceil(res.data.total_count / 10)
                    that.currentPage = res.data.current_page
                    that.tableData = res.data.list
                    that.is_export = res.data.is_export
                }
            })
        },
        /*
         重置搜索条件
       */

        resetSearch() {
            this.modelObj.search_type = '1'
            this.currentPage = 1
            this.modelObj.search_content = ''
            this.modelObj.status = 'all'
            this.modelObj.user_type = 'all'
            this.modelObj.operator_type = 'all'
            this.modelObj.station_id = 'all'
            this.modelObj.status = 'all'

            this.getMonthDay()
            this.getBillList()
        },
        /*
        获取充电站的列表
       */
        getStationList() {
            var that = this
            this.$api.billStation({ operator_id: this.operator_id }).then(res => {
                if (res.code == 1) {
                    that.station_list = res.data.list
                }
            })
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
        /*
        导出账单列表
         */
        billExport() {
            if (this.is_export) {
                window.location.href = `${this.ENV}/bill/export?start_time=${this.modelObj.start_time}&end_time=${this.modelObj.end_time}&station_id=${this.modelObj.station_id}&status=${this.modelObj.status}&user_type=${this.modelObj.user_type}&operator_type=${this.modelObj.operator_type}&search_type=${this.modelObj.search_type}&search_content=${this.modelObj.search_content}&operator_id=${this.modelObj.operator_id}`
            } else {
                this.$sfMessage.error('抱歉，当前用户没有操作权限')
            }
        },
    },
}
</script>

<style lang="scss" scoped>
@import '../../assets/css/trad/bill.scss';
</style>
