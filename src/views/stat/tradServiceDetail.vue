<template>
    <section>
        <div class="section-title">
            <router-link :to="`/stat/trad/service?title=${title}&operator_id=${operator_id}`">售后管理</router-link>
            > 退款详情
        </div>
        <div class="section-list">
            <div class="section-item-header clearfix">
                <span>账单信息</span>
            </div>
            <div class="header-main" v-loading="listLoading">
                <div class="header-amount">
                    <div class="top-item">
                        <div class="top-item-title">账单编号</div>
                        <div class="top-item-text ellipsis" :style="{ color: out_trade_id ? '#666' : '' }">{{ out_trade_id ? out_trade_id : '--' }}</div>
                    </div>
                    <div class="top-item">
                        <div class="top-item-tr">
                            <div class="top-item-title">退款状态</div>
                            <div :class="['top-item-text ellipsis', service_status == 2 && handle_status == 1 ? 'section-running' : 'section-no-begin']" style="fontsize: 16px">{{ service_status ? (service_status == 1 ? '待处理' : handle_status == 0 ? '退款失败' : '退款成功') : '--' }}</div>
                        </div>
                        <div class="top-item-tr">
                            <div class="top-item-title">处理时间</div>
                            <div class="top-item-text ellipsis" :style="{ color: handle_time ? '#666' : '' }">{{ handle_time ? handle_time : '--' }}</div>
                        </div>
                    </div>
                    <div class="top-item">
                        <div class="top-item-tr">
                            <div class="top-item-title">申请退款金额（元）</div>
                            <div class="top-item-text ellipsis" :style="{ color: parseFloat(service_amount_detail) ? '#666' : '' }">{{ service_amount_detail }} 元</div>
                        </div>
                        <div class="top-item-tr">
                            <div class="top-item-title">实际退款金额（元）</div>
                            <div class="top-item-text ellipsis" :style="{ color: parseFloat(handle_amount) ? '#666' : '' }">{{ handle_amount }} 元</div>
                        </div>
                    </div>
                </div>
                <div class="header-content clearfix">
                    <div class="content-item">
                        <span>开始充电时间：</span>
                        {{ charge_start_time }}
                    </div>
                    <div class="content-item">
                        <span>结束充电时间：</span>
                        {{ charge_finish_time }}
                    </div>
                    <div class="content-item">
                        <span>充电时长（分钟）：</span>
                        {{ charge_use_time }}
                    </div>
                    <div class="content-item">
                        <span>充电度数（度）：</span>
                        {{ charge_quantity }}
                    </div>
                    <div class="content-item">
                        <span>总费用（元）：</span>
                        {{ total_amount }}
                    </div>
                    <div class="content-item">
                        <span>实付（元）：</span>
                        {{ real_amount }}
                    </div>
                    <div class="content-item">
                        <span>优惠折扣（元）：</span>
                        {{ bonus_money }}
                    </div>
                    <div class="content-item">
                        <span>特权折扣抵扣（元）：</span>
                        {{ discount_money }}
                    </div>
                    <div class="content-item">
                        <span>总服务费（元）：</span>
                        {{ service_amount }}
                    </div>
                    <div class="content-item">
                        <span>电费（元）：</span>
                        {{ charge_amount }}
                    </div>
                </div>
                <div class="header-content header-content__1">
                    <div class="content-item">
                        <span>申请人（用户ID）：</span>
                        <span>{{ id ? id : '暂无' }}</span>
                    </div>
                    <div class="content-item">
                        <span>申请人退款原因：</span>
                        <span>{{ service_content }}</span>
                    </div>
                    <div class="content-item">
                        <span>退款操作人：</span>
                        <span>{{ operator }}</span>
                    </div>
                    <div class="content-item">
                        <span>同意/拒绝退款原因：</span>
                        <span>{{ handle_content ? handle_content : '--' }}</span>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: '',
    components: {},
    data() {
        this.title = (this.$route.query && this.$route.query.title) || ''
        this.operator_id = (this.$route.query && this.$route.query.operator_id) || ''
        return {
            listLoading: false,
            out_trade_id: this.$route.query.out_trade_id,
            month: this.$route.query.month,
            service_status: '',
            handle_status: '',
            handle_time: '',
            service_amount_detail: '',
            handle_amount: '',
            charge_start_time: '',
            charge_finish_time: '',
            charge_use_time: '',
            charge_quantity: '',
            real_amount: '',
            total_amount: '',
            bonus_money: '',
            discount_money: '',
            service_amount: '',
            charge_amount: '',
            id: '',
            service_content: '',
            operator: '',
            handle_content: '',
        }
    },
    created() {
        this.getDetail()
    },
    methods: {
        getDetail() {
            this.listLoading = true
            let params = {
                operator_id: this.operator_id,
                out_trade_id: this.out_trade_id,
                month: this.month,
            }
            this.$api.serviceDetail(params).then(res => {
                this.listLoading = false
                if (res.code == 1) {
                    let _detail = res.data.detail
                    let _service = res.data.service
                    this.service_status = _service.service_status
                    this.handle_status = _service.handle_status
                    this.handle_time = _service.handle_time
                    this.service_amount_detail = _service.service_amount
                    this.handle_amount = _service.handle_amount

                    this.charge_start_time = _detail.charge_start_time
                    this.charge_finish_time = _detail.charge_finish_time
                    this.charge_use_time = _detail.charge_use_time
                    this.charge_quantity = _detail.charge_quantity
                    this.total_amount = _detail.total_amount
                    this.real_amount = _detail.real_amount
                    this.bonus_money = _detail.bonus_money
                    this.discount_money = _detail.discount_money
                    this.service_amount = _detail.service_amount
                    this.charge_amount = _detail.charge_amount

                    this.id = parseInt(_service.user_id)
                    this.service_content = _service.service_content
                    this.operator = _service.operator ? _service.operator : '--'
                    this.handle_content = _service.handle_content
                }
            })
        },
    },
}
</script>
<style lang="scss" scoped>
@import '../../assets/css/trad/serviceDetail.scss';
</style>
