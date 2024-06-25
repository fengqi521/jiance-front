<template>
    <section>
        <div class="section-title">充电记录管理</div>
        <div class="section-header">
            <div class="section-item-header clearfix">
                <span>筛选查询</span>
            </div>
            <div class="header-content clearfix">
                <div class="content-item">
                    <el-select class="search-type" v-model="modelObj.sea_type">
                        <el-option label="账单编号" value="1" />
                        <el-option label="用户账号" value="2" />
                        <el-option label="刷卡账号" value="3" />
                        <el-option label="充电桩编号" value="4" />
                        <el-option label="车架号" value="5" />
                    </el-select>
                    <el-input class="search-input" v-model="modelObj.search" placeholder="关键字搜索" />
                </div>
                <div class="content-item">
                    <div class="btn_succ" @click="searchStation()">查询</div>
                    <div class="btn_cancel" @click="resetSearch()">重置</div>
                </div>
            </div>
        </div>
        <div class="section-container">
            <div class="section-item-header clearfix">
                <span>账单列表</span>
            </div>
            <div class="section-main">
                <div class="table">
                    <div class="table-th clearfix">
                        <div class="table-td">账单编号</div>
                        <div class="table-td">账户/卡号</div>
                        <div class="table-td">充电站名称</div>
                        <div class="table-td">充电桩充电枪编号</div>
                        <div class="table-td">停止充电验证码</div>
                        <div class="table-td">车架号</div>
                        <div class="table-td">开始充电时间</div>
                        <div class="table-td">记录更新时间</div>
                        <div class="table-td">电费(元)</div>
                        <div class="table-td">服务费(元)</div>
                        <div class="table-td">总费用(元)</div>
                        <div class="table-td">状态</div>
                        <div class="table-td">操作</div>
                    </div>
                    <div class="table-body" v-loading="listLoading">
                        <div class="table-tr" v-show="tableData && tableData.length" v-for="(item, index) in tableData" :key="index">
                            <div class="table-td">
                                <div class="td-item">{{ item.out_trade_id }}</div>
                            </div>
                            <div class="table-td">
                                <div class="td-item">{{ item.account }}</div>
                            </div>
                            <div class="table-td">
                                <div class="td-item">{{ item.station_id }}</div>
                            </div>
                            <div class="table-td">
                                <div class="td-item">
                                    {{ item.pile_sn + '-' + item.gun_sn }}
                                </div>
                            </div>
                            <div class="table-td">
                                <div class="td-item">{{ item.veri_code }}</div>
                            </div>
                            <div class="table-td">
                                <div class="td-item">{{ item.vin }}</div>
                            </div>
                            <div class="table-td">
                                <div class="td-item">{{ item.create_time }}</div>
                            </div>
                            <div class="table-td">
                                <div class="td-item">{{ item.bill_update_time }}</div>
                            </div>
                            <div class="table-td">
                                <div class="td-item">{{ item.energy_amount }}</div>
                            </div>
                            <div class="table-td">
                                <div class="td-item">{{ item.service_amount }}</div>
                            </div>
                            <div class="table-td">
                                <div class="td-item">{{ item.total_amount }}</div>
                            </div>

                            <div class="table-td">
                                <div class="td-item">{{ item.charge_status_text }}</div>
                            </div>
                            <div class="table-td table-operate">
                                <div class="td-item btn_delete" style="cursor: pointer" v-if="item.charge_status == 0 || item.charge_status == 1 || item.charge_status == 3" @click="stopChargeHandler(item.out_trade_id, item.charge_status)">取消</div>
                                <div class="td-item btn_delete" style="cursor: pointer" v-else-if="item.charge_status == 2" @click="stopChargeHandler(item.out_trade_id, item.charge_status)">停止</div>
                                <div class="td-item" v-else>--</div>
                            </div>
                        </div>
                    </div>
                    <div v-if="!tableData || tableData.length == 0" class="table-tr unData">
                        <img :src="require('assets/img/unData.png')" />
                        <span>暂无数据</span>
                    </div>
                </div>
                <!-- 分页 -->
                <sf-pagination v-if="tableData && tableData.length" :currentPage="currentPage" :page-count="page_count" @current-change="handleCurrentChange" />
            </div>
        </div>
        <!-- 弹框 -->
        <sf-modelBox :showModel.sync="showStop" :title="title" type="delete" @change="saveStopSure">
            <p>{{ content }}</p>
        </sf-modelBox>
    </section>
</template>

<script>
export default {
    data() {
        const operator_id = (this.$route.query && this.$route.query.operator_id) || ''
        return {
            operator_id,
            showStop: false,
            user_id: this.$route.params.id,
            password: 'text',
            modelObj: {
                sea_type: '2',
                search: '',
                user_id: this.$route.params.id,
                operator_id,
            },

            title: '',
            title_arr: {
                0: '取消预约',
                1: '取消启动',
                2: '停止充电',
                3: '取消停止',
            },
            content: '',
            content_arr: {
                0: '是否确定取消预约?',
                1: '是否确定取消启动?',
                2: '确定停止并结算相关费用?',
                3: '是否确定取消停止中??',
            },
            stopChargeParam: {
                out_trade_id: '',
            },
            currentPage: 1,
            page_count: 1,
            listLoading: false,
            tableData: [],
        }
    },
    created() {
        this.getTableDataList()
    },
    methods: {
        getTableDataList() {
            this.listLoading = true
            this.modelObj.page = this.currentPage
            this.$api.ChargeList(this.modelObj).then(data => {
                this.listLoading = false
                if (data.code == 1) {
                    this.tableData = data.data.list
                    this.currentPage = data.data.current_page
                    this.page_count = data.data.page_total
                }
            })
        },
        searchStation() {
            this.currentPage = 1
            this.tableData = []
            this.getTableDataList()
        },
        resetSearch() {
            this.modelObj.sea_type = '1'
            this.modelObj.search = ''
            this.currentPage = 1
            this.page_count = 1
            this.tableData = []
            this.getTableDataList()
        },
        // 点击分页触发
        handleCurrentChange(page) {
            this.currentPage = page
            this.getTableDataList()
        },
        //停止充电弹框
        stopChargeHandler(out_trade_id, status) {
            this.showStop = true
            this.title = this.title_arr[status]
            this.content = this.content_arr[status]
            this.currentChargeOn = out_trade_id
        },
        //停止充电按钮
        saveStopSure() {
            //发送请求
            this.showStop = false
            this.listLoading = true
            this.stopChargeParam.out_trade_id = this.currentChargeOn
            this.stopChargeParam.operator_id = this.operator_id
            this.$api.StopCharge(this.stopChargeParam).then(data => {
                this.listLoading = false

                if (data.code == 1) {
                    this.$sfNotify({
                        message: '成功',
                    })
                    this.getTableDataList()
                } else {
                    this.$sfNotify({
                        duration: 0,
                        type: 'error',
                        message: data.message,
                    })
                }
            })
        },
    },
}
</script>

<style lang="scss" scoped>
@import '../../assets/css/user/index.scss';
@import '../../assets/css/device/charge.scss';
</style>
