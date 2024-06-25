<template>
    <section>
        <div class="section-title">售后管理</div>
        <div class="section-header">
            <div class="section-item-header clearfix">
                <span>筛选查询</span>
            </div>
            <div class="header-content clearfix">
                <div class="content-item">
                    <el-select class="search-type" v-model="modelObj.search_type">
                        <el-option label="账单编号" value="1" />
                        <el-option label="用户账号" value="2" />
                    </el-select>
                    <el-input class="search-input" v-model="modelObj.search_content" placeholder="关键字搜索" />
                </div>

                <div class="content-item">
                    <div class="header-left">账单支付时间</div>
                    <div class="header-right">
                        <el-date-picker v-model="modelObj.start_time" type="date" placeholder="选择开始日期" value-format="yyyy-MM-dd" @change="changeStartDate"></el-date-picker>
                        <el-date-picker class="end-time" v-model="modelObj.end_time" type="date" placeholder="选择结束日期" value-format="yyyy-MM-dd" @change="changeEndDate"></el-date-picker>
                    </div>
                </div>
                <div class="content-item">
                    <div class="header-left">退款状态</div>
                    <div class="header-right">
                        <el-select v-model="modelObj.status">
                            <el-option label="全部" value="all" />
                            <el-option label="待处理" value="1" />
                            <el-option label="退款成功" value="2" />
                            <el-option label="已拒绝" value="3" />
                        </el-select>
                    </div>
                </div>
                <div class="content-item">
                    <div class="btn_succ" @click="contentSearch">查询</div>
                    <div class="btn_cancel" @click="handleReset">重置</div>
                </div>
            </div>
        </div>
        <div class="section-container">
            <div class="section-item-header clearfix">
                <span>退款列表</span>
                <div class="btn_recovery export-btn" @click="downloadDetail">
                    <i class="export-icon"></i>
                    导出
                </div>
            </div>
            <div class="section-main">
                <div class="table" v-loading="listLoading">
                    <div class="table-th clearfix">
                        <div class="table-td">账单单号</div>
                        <div class="table-td">账单支付时间</div>
                        <div class="table-td">用户账号</div>
                        <div class="table-td">用户类型</div>
                        <div class="table-td table-column__1">账单金额（元）</div>
                        <div class="table-td table-column__1">申请退款金额（元）</div>
                        <div class="table-td table-column__1">实际退款金额（元）</div>
                        <div class="table-td">退款状态</div>
                        <div class="table-td">操作人</div>
                        <div class="table-td">操作时间</div>
                        <div class="table-td">操作</div>
                    </div>
                    <div class="table-body">
                        <div class="table-tr" v-show="tableData && tableData.length > 0" v-for="(item, index) in tableData" :key="index">
                            <div class="table-td">
                                <div class="td-item">
                                    {{ item.out_trade_id ? item.out_trade_id : '--' }}
                                </div>
                            </div>
                            <div class="table-td">
                                <div class="td-item td-time">
                                    {{ item.payment_time ? item.payment_time : '--' }}
                                </div>
                            </div>
                            <div class="table-td">
                                <div class="td-item">{{ item.tel ? item.tel : '--' }}</div>
                            </div>
                            <div class="table-td">
                                <div class="td-item" v-if="(item.order_type == 1 || item.order_type == 4 || item.order_type == 5 || item.order_type == 7) && item.user_type == 1">APP-个人</div>
                                <div class="td-item" v-else-if="(item.order_type == 1 || item.order_type == 4 || item.order_type == 5 || item.order_type == 7) && item.user_type == 2">APP-企业主用户</div>
                                <div class="td-item" v-else-if="(item.order_type == 1 || item.order_type == 4 || item.order_type == 5 || item.order_type == 7) && item.user_type == 3">APP-特权用户</div>
                                <div class="td-item" v-else-if="(item.order_type == 1 || item.order_type == 4 || item.order_type == 5 || item.order_type == 7) && item.user_type == 4">APP-企业子用户</div>
                                <div class="td-item" v-else-if="item.order_type == 2">IC卡</div>
                                <div class="td-item" v-else-if="item.order_type == 3">第三方运营商</div>
                                <div class="td-item" v-else>其他</div>
                            </div>
                            <div class="table-td table-column__1">
                                <div class="td-item">{{ item.real_amount }}</div>
                            </div>
                            <div class="table-td table-column__1">
                                <div class="td-item">{{ item.service_amount }}</div>
                            </div>
                            <div class="table-td table-column__1">
                                <div class="td-item">{{ item.handle_amount }}</div>
                            </div>
                            <div class="table-td">
                                <div :class="['td-item', item.service_status == 1 ? 'section-no-begin' : '']">
                                    {{ item.service_status == 1 ? '待处理' : item.handle_status == 0 ? '已拒绝' : '退款成功' }}
                                </div>
                            </div>
                            <div class="table-td">
                                <div class="td-item">
                                    {{ item.operator ? item.operator : '--' }}
                                </div>
                            </div>
                            <div class="table-td">
                                <div class="td-item td-time">
                                    {{ item.handle_time ? item.handle_time : '--' }}
                                </div>
                            </div>
                            <div class="table-td table-operate">
                                <el-tooltip content="查看" placement="top">
                                    <router-link target="_blank" :to="`/stat/trad/service/detail?out_trade_id=${item.out_trade_id}&month=${modelObj.start_time}&title=${title}&operator_id=${operator_id}`" class="td-item see-icon"></router-link>
                                </el-tooltip>
                                <el-tooltip v-if="item.service_status == 1" content="退款处理" placement="top">
                                    <div class="td-item cash-icon" @click="handleRefund(item)"></div>
                                </el-tooltip>
                                <el-tooltip v-else content="此提现已处理完成，不能再次操作" placement="top">
                                    <div class="td-item cash-disabled-icon"></div>
                                </el-tooltip>
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
        <!-- 退款处理 -->
        <sf-modelBox class="service-box" title="退款处理" :showModel.sync="showServiceResult" @change="saveServiceResult">
            <el-form :model="serviceInfo" ref="serviceInfo" :rules="dataRules">
                <div class="box-list">
                    <div class="box-left">申请金额</div>
                    <div class="box-right">
                        <span class="box-right-text">{{ apply_money }}</span>
                    </div>
                </div>
                <div class="box-list">
                    <div class="box-left">申请时间</div>
                    <div class="box-right">
                        <span class="box-right-text">{{ apply_time }}</span>
                    </div>
                </div>
                <div class="box-list">
                    <div class="box-left">申请原因</div>
                    <div class="box-right">
                        <span class="box-right-text">{{ apply_reason }}</span>
                    </div>
                </div>
                <div class="box-list">
                    <div class="box-left">退款操作</div>
                    <div class="box-right">
                        <div class="radio-outer">
                            <el-radio v-model="serviceInfo.status" label="1">同意退款</el-radio>
                            <el-radio v-model="serviceInfo.status" label="0">拒绝退款</el-radio>
                        </div>
                        <div v-if="serviceInfo.status == 1" class="box-list-inner">
                            <div class="box-left">退款金额</div>
                            <div class="box-right">
                                <el-form-item prop="account">
                                    <el-input
                                        class="account-input"
                                        oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{4,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/, '$1$2.$3').replace(/^\./g, '')"
                                        type="number"
                                        v-model="serviceInfo.account"
                                        placeholder="填写金额小于等于申请金额"
                                    />
                                    <span class="unit">元</span>
                                </el-form-item>
                                <span v-show="is_show_money">*可修改,最多{{ apply_money }}元</span>
                            </div>
                        </div>
                        <div class="box-list-inner">
                            <div class="box-left">处理原因</div>
                            <div class="box-right">
                                <el-form-item prop="content">
                                    <el-input type="textarea" v-model="serviceInfo.content" maxlength="100" placeholder="请输入处理理由，最多不超过100个字" />
                                </el-form-item>
                            </div>
                        </div>
                    </div>
                </div>
            </el-form>
        </sf-modelBox>
    </section>
</template>

<script>
export default {
    data() {
        this.title = (this.$route.query && this.$route.query.title) || ''
        this.operator_id = (this.$route.query && this.$route.query.operator_id) || ''
        const onlyInteger = async (rule, value, callback) => {
            if (parseFloat(value) > parseFloat(this.apply_money)) {
                this.is_show_money = false
                return callback(new Error('退款金额应小于申请金额'))
            }
            this.is_show_money = true
        }
        return {
            ENV: process.env.NODE_ENV == 'development' ? '/api' : '',
            modelObj: {
                page: 1,
                limit: 10,
                search_type: '2',
                search_content: '',
                start_time: '',
                end_time: '',
                status: 'all',
                owner_id: '',
                operator_id: this.operator_id,
            },
            is_show_money: true,
            user_type_arr: ['', 'APP用户', '企业用户', '特权用户'],
            currentPage: 1,
            page_count: 1,
            tableData: [{}],
            showServiceResult: false,
            serviceInfo: {
                account: '', // 退款金额
                content: '', // 退款描述
                status: '1',
            },
            dataRules: {
                account: [
                    { required: true, message: '* 请输入退款金额', trigger: 'blur' },
                    { validator: onlyInteger, trigger: 'blur' },
                ],
                content: [{ required: true, message: '* 请输入退款原因', trigger: 'blur' }],
            },
            listLoading: false,
            apply_money: '',
            apply_time: '',
            apply_reason: '',
            refund_id: '',
            is_export: 0,
            ownerList: [{ id: '', account: '全部' }],
            operationList: [{ operator_id: '', title: '全部' }],
        }
    },
    filters: {
        ellipsis(value) {
            if (!value) return '--'
            if (value.length > 20) {
                return value.slice(0, 20) + '...'
            }
            return value
        },
    },
    mounted() {
        // this.getTableData();
    },
    created() {
        this.getMonthDay()
        this.getOwnersList()
        this.getOperation()
        this.getTableDataList()
    },
    methods: {
        getOwnersList() {
            var _this = this
            var params = {
                search: _this.words,
                operator_id: this.operator_id,
            }
            this.$api.pileOwners(params).then(res => {
                if (res.code == 1) {
                    this.ownerList = this.ownerList.concat(res.data)
                }
            })
        },
        getOperation() {
            this.$api.pileOperations({ type: 2, operator_id: this.operator_id }).then(res => {
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
        getTableDataList() {
            this.listLoading = true
            this.modelObj.page = this.currentPage
            this.$api.getServiceLists(this.modelObj).then(res => {
                this.listLoading = false
                if (res.code == 1) {
                    this.tableData = res.data.list
                    this.currentPage = res.data.current_page
                    this.page_count = res.data.page_total
                    this.is_export = res.data.is_export
                }
            })
        },
        contentSearch() {
            this.currentPage = 1
            this.getTableDataList()
        },
        // 点击分页触发
        handleCurrentChange(page) {
            this.currentPage = page
            this.getTableDataList()
        },
        // 重置
        handleReset() {
            this.modelObj = {
                page: 1,
                limit: 10,
                search_type: '1',
                search_content: '',
                start_time: '',
                end_time: '',
                status: 'all',
                owner_id: '',
                operator_id: '',
            }
            this.getMonthDay()
            this.getTableDataList()
        },
        // 导出
        downloadDetail(serial) {
        if (this.is_export) {
            var params = "";
            for (var key in this.modelObj) {
            params += `&${key}=${this.modelObj[key]}`;
            }
            window.location.href = `${this.ENV}/service/import-list?is_third_platform=1&${params.substr(
                    1
            )}`;
        } else {
            this.$sfMessage.error("抱歉，当前用户没有操作权限");
        }
        },
        getMonthLastDate(_date) {
            var splitDate = _date.split('-')
            var date = new Date(splitDate[0], splitDate[1], 0)
            return date.getDate()
        },
        getTableDataList() {
            this.listLoading = true
            this.modelObj.page = this.currentPage
            this.$api.getServiceLists(this.modelObj).then(res => {
                this.listLoading = false
                if (res.code == 1) {
                    this.tableData = res.data.list
                    this.currentPage = res.data.current_page
                    this.page_count = res.data.page_total
                    this.is_export = res.data.is_export
                }
            })
        },
        contentSearch() {
            this.currentPage = 1
            this.getTableDataList()
        },
        // 点击分页触发
        handleCurrentChange(page) {
            this.currentPage = page
            this.getTableDataList()
        },
        // 重置
        handleReset() {
            this.modelObj = {
                page: 1,
                limit: 10,
                search_type: '1',
                search_content: '',
                start_time: '',
                end_time: '',
                status: 'all',
                owner_id: '',
                operator_id: this.operator_id,
            }
            this.getMonthDay()
            this.getTableDataList()
        },
        // 退款处理
        handleRefund(item) {
            this.apply_money = ''
            this.apply_time = ''
            this.apply_reason = ''
            this.refund_id = item.out_trade_id
            this.$api.serviceRefundDetail({ out_trade_id: item.out_trade_id, operator_id: this.operator_id }).then(res => {
                if (res.code == 1) {
                    this.apply_money = res.data.service_amount
                    this.serviceInfo.account = res.data.service_amount
                    this.apply_time = res.data.service_time
                    this.apply_reason = res.data.service_content
                    this.showServiceResult = true
                }
            })
        },
        saveServiceResult() {
            this.$refs['serviceInfo'].validate(valid => {
                if (valid) {
                    this.serviceInfo.id = this.refund_id
                    this.serviceInfo.operator_id = this.operator_id
                    this.$api.serviceHandle(this.serviceInfo).then(data => {
                        if (data.code == 1) {
                            this.showServiceResult = false
                            this.$sfNotify({
                                message: '成功',
                            })
                            setTimeout(this.getTableDataList, 2000)
                        } else {
                            this.$sfNotify({
                                duration: 0,
                                type: 'error',
                                message: '失败',
                            })
                        }
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        getMonthDay() {
            var date = new Date()
            var end_date = this.$utils.formatDate(date, 'yyyy-MM-dd')
            this.modelObj.end_time = end_date
            date.setDate(1)
            var _date = this.$utils.formatDate(date, 'yyyy-MM-dd')
            this.modelObj.start_time = _date
        },
    },
}
</script>

<style lang="scss" scoped>
@import '../../assets/css/trad/service.scss';
</style>
