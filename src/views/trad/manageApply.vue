<template>
    <section>
        <div class="section-title">
            <span class="section-title section-title-act"><router-link to="/trad/manage">分润管理</router-link></span>
            <span class="section-title">></span>
            <span class="section-title">申请提现</span>
        </div>
        <!-- 添加编辑页面  车辆 -->
        <div class="section-container activity-box">
            <div class="section-item-header clearfix">
                <span>提现账户信息</span>
            </div>
            <div class="box-outer activity-box-car">
                <div class="section-tips">
                    <i class="warning-icon"></i>
                    <div class="tips-box">
                        <span class="tips-text">1、提现前可在上一页面设置提现账户；</span>
                        <span class="tips-text">2、提现金额和提现次数可能有限制，此限制取决于第三方转账商户平台；</span>
                        <span class="tips-text">3、提现存在手续费，手续费收取取决于第三方转账商户平台；</span>
                        <span class="tips-text">4、银行卡提现，根据配置可能存在一次提现，向多个账户转账行为，对应是多个提现记录；</span>
                        <span class="tips-text">5、提现提交后无法变更，请谨慎填写；</span>
                        <span class="tips-text">6、发起提现申请后，提现到账可能有延迟，到账时间取决于第三方转账商户平台。</span>
                    </div>
                </div>
                <div class="section-account">
                    <div class="box-left" v-loading="detailLoading">
                        <div class="title">提现账户信息确认</div>
                        <div class="notice">
                            注意：信息不正确或需更换账户请<span v-if="config.withdrawl_type === '3'">联系运营方添加或修改提现银行卡信息</span>
                            <span v-else>
                                退回从
                                “
                                <router-link
                                    :to="{ path: '/trad/manage/set', query: { isAlipay: `${isAlipay}`, isWxpay: `${isWxpay}` } }">设置提现账户</router-link>
                                ”
                                重新设置。
                            </span>

                        </div>
                        <div class="list img">
                            <div class="left">提现方式：</div>
                            <div class="right" v-if="config.withdrawl_type == 2">
                                <img :src="require('assets/img/alipay.png')" />
                            </div>
                            <div class="right" v-if="config.withdrawl_type == 1">
                                <img :src="require('assets/img/wechat.png')" />
                            </div>
                            <div class="right" v-if="config.withdrawl_type == 3">
                                <img :src="require('assets/img/bankcard.png')" />
                            </div>
                        </div>
                        <div class="list" v-if="config.withdrawl_type !== '3'">
                            <div class="left">提现账户类型：</div>
                            <div class="right" v-if="config.account">
                                {{ config.account_type == 1 ? '个人' : '企业' }}
                            </div>
                            <div class="right" v-else>--</div>
                        </div>
                        <div class="list" v-if="config.withdrawl_type !== '3'">
                            <div class="left">{{ config.withdrawl_type == 2 ? '提现账户：' : '提现账户认证id：' }}</div>
                            <div class="right">{{ config.account || '--' }}</div>
                        </div>
                        <div class="list" v-if="config.withdrawl_type !== '3'">
                            <div class="left">账户名称：</div>
                            <div class="right">
                                {{ config.account_name ? config.account_name : '--' }}
                            </div>
                        </div>
                        <div class="list" v-if="config.withdrawl_type !== '3'">
                            <div class="left">联系电话：</div>
                            <div class="right">{{ config.tel ? config.tel : '--' }}</div>
                        </div>
                        <!-- <div class="withdrawl-table table" v-if="config.withdrawl_type === '3'">
                            <div class="table-th clearfix">
                                <div class="table-td table-column__1">收方户名</div>
                                <div class="table-td">收方账户</div>
                                <div class="table-td">开户行名称</div>
                                <div class="table-td">收方手机号</div>
                                <div class="table-td">提现比率</div>
                            </div>
                            <div class="table-body scrollBar">
                                <div class="table-tr" v-for="(list, index) in cardData" :key="index">
                                    <div class="table-td">
                                        <div class="td-item">{{ list.recipient_name }}</div>
                                    </div>
                                    <div class="table-td">
                                        <div class="td-item">{{ list.recipient_account }}</div>
                                    </div>
                                    <div class="table-td">
                                        <div class="td-item">{{ list.bank_name }}</div>
                                    </div>
                                    <div class="table-td">
                                        <div class="td-item">{{ list.recipient_phone }}</div>
                                    </div>
                                    <div class="table-td">
                                        <div class="td-item">{{ list.withdrawal_ratio }}</div>
                                    </div>
                                </div>
                            </div>
                        </div> -->
                        <ul class="cash-container scrollBar" v-if="config.withdrawl_type === '3'">
                            <li v-for="(item, index) in cardData" :key="index" class="cash-item">
                                <div class="cash-item-box">
                                    <span class="cash-item-label">收方户名：</span>
                                    <span class="cash-item-value">{{ item.recipient_name }}</span>
                                </div>
                                <div class="cash-item-box">
                                    <span class="cash-item-label">收方账号：</span>
                                    <span class="cash-item-value">{{ item.recipient_account }}</span>
                                </div>
                                <div class="cash-item-box">
                                    <span class="cash-item-label">开户行名称：</span>
                                    <span class="cash-item-value">{{ item.bank_name }}</span>
                                </div>
                                <div class="cash-item-box">
                                    <span class="cash-item-label">收方手机号：</span>
                                    <span class="cash-item-value">{{ item.recipient_phone }}</span>
                                </div>
                                <div class="cash-item-box">
                                    <span class="cash-item-label">提现比率：</span>
                                    <span class="cash-item-value">{{ item.withdrawal_ratio }}%</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="box-right" v-loading="withdrawLoading">
                        <el-form>
                            <div class="list list-first">
                                <div class="left">可提现金额</div>
                                <div class="right list-right-first">
                                    <div style="display: flex">
                                        <span class="green">{{ no_withdrawl }}</span>
                                        元
                                    </div>
                                    <div class="rigth-tip" v-if="is_widthdrawMoney">
                                        <span>
                                            * 本次有
                                            <span>{{ widthdrawMoney }}</span>
                                            元正在提现中，提现成功后将扣除提现金额
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="list">
                                <div class="left">提现方式</div>
                                <div class="right">
                                    <div class="account-type">
                                        <el-form-item class="radio-outer" prop="status">
                                            <el-radio class="type" v-model="config.withdrawl_type" label="2"
                                                v-if="isAlipay == 1">
                                                <img :src="require('assets/img/alipay.png')" />
                                                <span>支付宝</span>
                                            </el-radio>

                                            <el-radio class="type" v-model="config.withdrawl_type" label="1"
                                                v-if="isWxpay == 1">
                                                <img :src="require('assets/img/wechat.png')" />
                                                <span>微信</span>
                                            </el-radio>

                                            <el-radio class="type" v-model="config.withdrawl_type" label="3">
                                                <img :src="require('assets/img/bankcard.png')" />
                                                <span>银行卡</span>
                                            </el-radio>
                                        </el-form-item>
                                    </div>
                                </div>
                            </div>

                            <div class="list">
                                <div class="left">申请现金额</div>
                                <div class="right">
                                    <el-form-item prop="widthdrawMoney">
                                        <el-input class="input-weight" @input.native="changeServiceAmount"
                                            v-model="widthdrawMoney" placeholder="请输入申请提现金额" />
                                    </el-form-item>
                                    <span class="unit">元</span>
                                    <div class="notice-cash">* 单笔最低转账金额{{ config.withdrawl_type === '3' ? `必须大于${minFee}` :
                                        '扣掉手续费不得低于0.1'
                                    }}元</div>
                                </div>
                            </div>
                            <div class="list">
                                <div class="left withdraw-tips">
                                    提现手续费
                                    <el-tooltip popper-class="card-tip" placement="top" :visible-arrow="false">
                                        <div slot="content"><card-table :bank_rate="bank_rate"
                                                :separation_rate="separation_rate" /></div>
                                        <span class="tips-icon" v-show="config.withdrawl_type === '3'"></span>
                                    </el-tooltip>

                                </div>
                                <div class="right">
                                    <div class="weight">{{ deduction_service_amount }}</div>
                                    <span class="unit">元</span>
                                </div>
                            </div>
                        </el-form>
                    </div>
                </div>
            </div>
            <div class="box-bottom clearfix" style="display: flex; justify-content: center; margin-top: 24px">
                <div class="btn_succ" @click="saveActivitySure()">提交</div>
            </div>
        </div>
    </section>
</template>

<script>
import CardTable from './components/CardTable'
import isArray from 'lodash/isArray'
export default {
    components: { CardTable },
    data () {
        return {
            flag: false,
            isAlipay: '1',
            isWxpay: '1',
            isCard: '1',
            withdrawl_type: {
                1: '微信',
                2: '支付宝',
                3: '银行卡',
            },
            config: {
                account_type: '',
                account_name: '',
                account: '',
                tel: '',
                withdrawl_type: '',
            },
            cardData: [],
            no_withdrawl: '0',
            separation_rate: '0',
            deduction_service_amount: '0',
            widthdrawMoney: '',
            detailLoading: false,
            withdrawLoading: false,
            min_service: '0',
            max_service: '0',
            is_widthdrawMoney: 0,
            is_can_widthdrawMoney: false,
            cardTableShow: false,
            bank_rate: []
        }
    },
    watch: {
        'config.withdrawl_type' (val, oldVal) {
            if (val === '3') {
                this.scaleMinFee()
            }
            if (this.isCard !== '1' && val === '3') {
                this.config.withdrawl_type = oldVal
                this.$sfNotify.warning({ message: '请联系运营方添加提现银行卡信息', duration: 0 })
                return;
            }
            this.getDetail().then(() => {
                this.getWithdrawMoney()
            })
        },

        widthdrawMoney (val) {
            if (!val) this.deduction_service_amount = '0'
        },
    },
    created () {
        if (this.$route.query) {
            this.isAlipay = this.$route.query.isAlipay
            this.isWxpay = this.$route.query.isWxpay
            this.isCard = this.$route.query.isCard;
            if (this.isCard === '1') this.config.withdrawl_type = '3'
            if (this.isAlipay == 1) {
                this.config.withdrawl_type = '2'
            } else if (this.isWxpay == 1) {
                this.config.withdrawl_type = '1'
            } else if (this.isAlipay == 1 && this.isWxpay == 1) {
                this.config.withdrawl_type = '2'
            }
        }
    },
    methods: {
        getDetail () {
            this.detailLoading = true
            return new Promise((resolve, reject) => {
                this.$api.getWithdrawConfig({ withdrawl_type: this.config.withdrawl_type }).then(res => {
                    this.detailLoading = false
                    resolve(res)
                    if (res.code == 1) {
                        if (isArray(res.data)) {
                            this.cardData = res.data;
                            return;
                        }
                        this.config.withdrawl_type = res.data.withdrawl_type
                        this.config.account_type = res.data.account_type
                        this.config.account_name = res.data.account_name
                        this.config.account = res.data.account
                        this.config.check_account = res.data.account
                        this.config.tel = res.data.tel
                        this.origin_tel = res.data.tel
                    }
                })

            })
        },
        //获取可提现金额
        getWithdrawMoney () {
            this.withdrawLoading = true
            this.$api.getAgentWithdrawMoney({ withdrawl_type: this.config.withdrawl_type }).then(data => {
                this.withdrawLoading = false
                if (data.code == 1) {
                    this.no_withdrawl = data.data.no_withdrawl
                    this.separation_rate = this.config.withdrawl_type === '3' ? (data.data.separation_rate && (Number(data.data.separation_rate) / 100).toString() || '0') : data.data.separation_rate
                    this.min_service = data.data.min_service
                    this.max_service = data.data.max_service
                    this.bank_rate = data.data.bank_rate;
                    if (this.widthdrawMoney) {
                        this.changeServiceAmount({ target: { value: this.widthdrawMoney } })
                    } else {
                        this.changeServiceAmount({ target: { value: '0' } })
                    }
                }
            })
        },
        changeServiceAmount (e) {
            let val = e.target.value;
            this.is_widthdrawMoney = false
            this.is_can_widthdrawMoney = false
            const value = val.replace(/[^\d.]/g, '').replace(/\.{4,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/, '$1$2.$3').replace(/^\./g, '');
            e.target.value = value;
            this.widthdrawMoney = value
            const realValue = Number(val)
            if (isNaN(realValue)) return
            if (realValue > Number(this.no_withdrawl)) {
                this.widthdrawMoney = this.no_withdrawl
            }

            if (realValue <= 0 || Number(this.no_withdrawl) <= 0) {
                this.deduction_service_amount = '0'
                return
            }
            // 银行卡提现
            if (this.config.withdrawl_type === '3') {
                this.isLess = false;
                const bank_fee = this.cardData.reduce((prev, { withdrawal_ratio }) => {
                    // 每张卡得金额
                    const itemCardFee = Number((realValue * (Number(withdrawal_ratio) / 100)).toFixed(2));
                    // 每张卡得手续费
                    const fee = this.setHandleFee(itemCardFee)
                    //每张卡金额不能小于1
                    if ((0 < itemCardFee && itemCardFee <= 1) && ((itemCardFee * 100000 - fee * 100000) / 100000 <= 0)) this.isLess = true;
                    return Number(((prev * 100000 + fee * 100000) / 100000).toFixed(2))
                }, 0)
                const mount = (bank_fee * 100 + Number((val * this.separation_rate).toFixed(2)) * 100) / 100
                this.deduction_service_amount = Number(mount.toFixed(2))
                this.is_can_widthdrawMoney = true
                return;
            }

            // 微信支付宝
            if (parseFloat(val) > 50000) {
                this.$sfNotify({
                    duration: 0,
                    type: 'error',
                    message: '个人用户转账不能超过50000',
                })
                return
            }

            var temp_service = (this.widthdrawMoney * this.separation_rate).toFixed(2)
            if (temp_service < this.min_service) {
                this.deduction_service_amount = this.min_service
            } else if (temp_service > this.max_service) {
                this.deduction_service_amount = this.max_service
            } else {
                this.deduction_service_amount = temp_service
            }
            this.is_can_widthdrawMoney = true
        },
        saveActivitySure () {

            // if (this.flag) return;

            // this.flag = true;

            if (!this.is_can_widthdrawMoney) {
                return
            }

            if (!this.config.account && this.config.withdrawl_type !== '3') {
                this.$sfNotify({
                    duration: 0,
                    type: 'error',
                    message: '请配置提现账号',
                })
                return false
            }


            if (!this.widthdrawMoney) {
                this.$sfNotify({
                    duration: 0,
                    type: 'error',
                    message: '请输入提现金额',
                })
                return false
            }

            if (this.isLess) {
                this.$sfNotify({
                    duration: 0,
                    type: 'error',
                    message: `单笔最低转账金额必须大于${this.minFee}元`,
                })
                return;
            }

            if (this.config.withdrawl_type === '3' && this.deduction_service_amount > this.widthdrawMoney) {
                this.$sfNotify({
                    duration: 0,
                    type: 'error',
                    message: '转账金额必须大于提现手续费',
                })
                return;
            }
            this.$api.agentWithdrawMoney({ withdraw_money: this.widthdrawMoney, withdrawl_type: this.config.withdrawl_type }).then(res => {
                if (res.code == 100) {
                    this.is_widthdrawMoney = true
                    this.$sfNotify({
                        message: res.message,
                        duration: 15000,
                    })
                    this.getWithdrawMoney()
                } else {
                    this.is_widthdrawMoney = false
                    this.$sfNotify({
                        duration: 0,
                        type: 'error',
                        message: res.message,
                    })
                }
                // this.flag = false;
            })
        },

        // 初始计算最低手续费
        scaleMinFee () {
            if (!this.bank_rate.length) {
                this.minFee = 0
                return;
            }
            const list = this.bank_rate.map(item => {
                let { start_amount, end_amount, type, ratio, each_amount, each_max_amount } = item;
                start_amount = Number(start_amount)
                end_amount = Number(end_amount)
                each_amount = Number(each_amount)
                each_max_amount = Number(each_max_amount)
                ratio = Number(ratio)
                if (type === '1') {
                    return each_amount
                }
                const mount = Number((ratio / 100 * start_amount).toFixed(6))
                return mount > each_max_amount ? each_max_amount : mount

            })
            const count = Math.min(...list);
            this.minFee = count < 1 ? 1 : count
        },

        // 计算提现手续费
        setHandleFee (val) {
            if (!val) return 0;
            if (!this.bank_rate.length) return 0;
            try {
                const list = this.bank_rate.find(item => {
                    let { start_amount, end_amount } = item;
                    start_amount = Number(start_amount)
                    end_amount = Number(end_amount)
                    if ((start_amount < val && end_amount >= val) || (!end_amount && val > start_amount)) return item;
                })

                if (list.type === '1') return Number(list.each_amount)

                if (list.type !== '1') {
                    let { ratio, each_max_amount } = list;
                    ratio = Number(ratio)
                    each_max_amount = Number(each_max_amount)
                    const mount = Number((val * ratio / 100).toFixed(6))
                    return mount > each_max_amount ? each_max_amount : mount
                }
            } catch (err) {
                console.log(err)
            }

        }

    }
}
</script>
<style lang="scss">
.card-tip.is-dark {
    background: transparent
}
</style>
<style lang="scss" scoped>
@import '../../assets/css/trad/manageApply.scss';
</style>
