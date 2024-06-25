<template>
    <section>
        <div class="section-title">充值管理</div>
        <div class="section-header">
            <div class="section-item-header clearfix">
                <span>筛选查询</span>
            </div>
            <div class="header-content clearfix">
                <div class="content-item">
                    <el-select class="search-type" v-model="modelObj.search_type">
                        <el-option label="充值账号" value="2" />
                    </el-select>
                    <el-input class="search-input" v-model="modelObj.search_content" placeholder="关键字搜索" />
                </div>
                <div class="content-item">
                    <div class="header-left">充值时间</div>
                    <div class="header-right">
                        <el-date-picker v-model="modelObj.start_time" type="date" value-format="yyyy-MM-dd" placeholder="选择开始日期"></el-date-picker>
                        <el-date-picker class="end-time" v-model="modelObj.end_time" type="date" value-format="yyyy-MM-dd" placeholder="选择结束日期"></el-date-picker>
                    </div>
                </div>
                <div class="content-item">
                    <div class="header-left">充值类型</div>
                    <div class="header-right">
                        <el-select v-model="modelObj.charge_type">
                            <el-option label="全部" value="all" />
                            <el-option label="微信" value="1" />
                            <el-option label="支付宝" value="2" />
                            <el-option label="平台" value="3" />
                        </el-select>
                    </div>
                </div>
                <div class="content-item">
                    <div class="btn_succ" @click="handleSearch">查询</div>
                    <div class="btn_cancel" @click="resetSearch">重置</div>
                </div>
            </div>
        </div>
        <div class="section-container">
            <div class="section-item-header clearfix">
                <span>充值列表</span>
                <div class="btn_recovery export-btn" @click="rechargeExport">
                    <i class="export-icon"></i>
                    导出
                </div>
                <div class="btn_succ recharge-btn" @click="handleRechargeModel">
                    <i class="export-icon"></i>
                    充值
                </div>
            </div>
            <div class="section-main">
                <div class="table" v-loading="loadingFlag">
                    <div class="table-th clearfix">
                        <div class="table-td">充值编号</div>
                        <div class="table-td">充值账号</div>
                        <div class="table-td">支付账号</div>
                        <div class="table-td">充值时间</div>
                        <div class="table-td">充值金额（元）</div>
                        <div class="table-td table-operate table-column__1">充值方式</div>
                    </div>
                    <div class="table-body">
                        <div class="table-tr" v-show="tableData && tableData.length > 0" v-for="(item, index) in tableData" :key="index">
                            <div class="table-td">
                                <div class="td-item">{{ item.recharge_id }}</div>
                            </div>
                            <div class="table-td">
                                <div class="td-item" v-if="item.logout_user_tel">{{ item.to_user_account ? item.to_user_account : '暂无' }}(已注销)</div>
                                <div class="td-item" v-else>{{ item.to_user_account ? item.to_user_account : '暂无' }}</div>
                            </div>
                            <!--<div class="table-td">-->
                            <!--<div class="td-item">{{item.from_user_id?item.from_user_id:'暂无'}}</div>-->
                            <!--</div>-->
                            <div class="table-td">
                                <div class="td-item" v-if="item.logout_pay_tel">{{ item.from_user_account ? item.from_user_account : '暂无' }}(已注销)</div>
                                <div class="td-item" v-else>{{ item.from_user_account ? item.from_user_account : '暂无' }}</div>
                            </div>
                            <div class="table-td">
                                <div class="td-item">{{ item.create_time }}</div>
                            </div>
                            <div class="table-td">
                                <div class="td-item">{{ item.recharge_amount }}</div>
                            </div>
                            <div class="table-td table-operate table-column__1" v-if="item.third_recharge_platform == 3">
                                <span class="td-item td-platform-pay"></span>
                                <span class="td-item">平台</span>
                                <span v-if="item.bonus_id">（活动）</span>
                            </div>
                            <div class="table-td table-operate table-column__1" v-else-if="item.third_recharge_platform == 2">
                                <span class="td-item td-ali-pay"></span>
                                <span>支付宝</span>
                                <span v-if="item.bonus_id">（活动）</span>
                            </div>
                            <div class="table-td table-operate table-column__1" v-else>
                                <span class="td-item td-wechat-pay"></span>
                                <span>微信</span>
                                <span v-if="item.bonus_id">（活动）</span>
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
        <!-- 充值 -->
        <sf-modelBox class="recharge-box" title="充值" :showModel.sync="showRechargeModel" @change="saveChargeInfo">
            <el-form :model="chargeInfo" ref="chargeInfo" :rules="dataRules">
                <div class="box-list">
                    <div class="box-left">充值账号</div>
                    <div class="box-right">
                        <el-form-item prop="account">
                            <el-input v-model="chargeInfo.account" placeholder="请输入充值账号" />
                        </el-form-item>
                    </div>
                </div>
                <!--<div class="box-list">-->
                <!--<div class="box-left">充值账号</div>-->
                <!--<div class="box-right">-->
                <!--<el-input-->
                <!--disabled-->
                <!--v-model="chargeInfo.account"-->
                <!--/>-->
                <!--</div>-->
                <!--</div>-->
                <div class="box-list">
                    <div class="box-left">充值金额</div>
                    <div class="box-right">
                        <el-form-item prop="amount">
                            <el-input class="account-input" v-model.number="chargeInfo.amount" placeholder="请输入充值金额" />
                            <span class="unit">元</span>
                        </el-form-item>
                    </div>
                </div>
            </el-form>
        </sf-modelBox>
    </section>
</template>

<script>
export default {
    data() {
        return {
            ENV: process.env.NODE_ENV == 'development' ? '/api' : '',
            loadingFlag: false,
            modelObj: {
                search_type: '2',
                search_content: '',
                start_time: '',
                end_time: '',
                charge_type: 'all',
            },
            pay_type: 2,
            currentPage: 1,
            page_count: 1,
            showRechargeModel: false,
            chargeInfo: {
                account: '',
                amount: '',
            },
            dataRules: {
                account: [{ required: true, message: '* 请输入用户账号', trigger: 'change' }],
                amount: [
                    { required: true, message: '* 请输入充值金额', trigger: 'change' },
                    { type: 'number', message: '充值金额必须为数字值', trigger: 'change' },
                ],
            },
            tableData: [],
            is_export: 0,
        }
    },
    created() {
        this.getRechargeList()
    },
    methods: {
        // 点击分页触发
        handleCurrentChange(page) {
            this.currentPage = page
            this.getRechargeList()
        },
        handleRechargeModel() {
            this.chargeInfo = {
                account: '',
                amount: '',
            }
            this.showRechargeModel = true
        },
        // 充值金额
        saveChargeInfo() {
            var that = this
            this.$refs['chargeInfo'].validate(valid => {
                if (valid) {
                    this.$api.rechargeRemainBalance(this.chargeInfo).then(res => {
                        if (res.code == 1) {
                            that.showRechargeModel = false
                            this.$sfNotify({
                                message: '成功',
                            })
                            setTimeout(this.getRechargeList, 1500)
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
        getRechargeList() {
            var that = this
            that.loadingFlag = true
            this.modelObj.page = this.currentPage
            this.$api.rechargeList(this.modelObj).then(res => {
                that.loadingFlag = false
                if (res.code == 1) {
                    that.page_count = Math.ceil(res.data.total_count / 10)
                    that.currentPage = res.data.current_page
                    that.tableData = res.data.list
                    this.is_export = res.data.is_export
                }
            })
        },
        /*
     重置搜索条件
     */
        resetSearch() {
            this.modelObj.search_type = '2'
            this.modelObj.search_content = ''
            this.modelObj.start_time = ''
            this.modelObj.end_time = ''
            this.modelObj.charge_type = 'all'
            this.currentPage = 1
            this.getRechargeList()
        },
        /*
     导出账单列表
     */
        rechargeExport() {
            if (this.is_export) {
                window.location.href = `${this.ENV}/recharge/export-list?start_time=${this.modelObj.start_time}&end_time=${this.modelObj.end_time}&search_type=${this.modelObj.search_type}&search_content=${this.modelObj.search_content}&charge_type=${this.modelObj.charge_type}`
            } else {
                this.$sfMessage.error('抱歉，当前用户没有操作权限')
            }
        },
        handleSearch() {
            this.currentPage = 1
            this.getRechargeList()
        },
    },
}
</script>

<style lang="scss" scoped>
@import '../../assets/css/trad/recharge.scss';
</style>
