<template>
    <section>
        <div class="section-title">运营主体信息</div>
        <div class="section-list section-company clearfix">
            <div class="section-header">
                <div class="section-item-router">
                    <router-link :to="`/auth/opinfo`">基本信息</router-link>
                    <router-link :to="`/auth/opinfo/invoice`" class="section-act"
                    >电子发票对接配置</router-link
                    >
                    <router-link :to="`/auth/opinfo/transfer`"
                    >运营商转账配置</router-link
                    >
                </div>
            </div>
            <div class="section-main clearfix" v-loading="loadingInfo">
                <div class="main-right">
                    <el-form
                            class="clearfix"
                            :model="modelInfo"
                            ref="modelInfo"
                            :rules="companyRules"
                    >
                        <div class="company-left">
                            <div class="main-right-list">
                                <div class="list-left long-desc">是否对接电子发票</div>
                                <div class="list-right">
                                    <el-radio-group
                                            class="radio-outer"
                                            v-model="modelInfo.status"
                                            @change="removeValidate"
                                    >
                                        <el-radio v-model="modelInfo.status" label="1"
                                        >是
                                        </el-radio>
                                        <el-radio v-model="modelInfo.status" label="0"
                                        >否
                                        </el-radio>
                                    </el-radio-group>
                                </div>
                            </div>
                            <div class="main-right-list">
                                <div class="list-left">
                                    <i v-if="modelInfo.status == 1">*</i>AES密钥
                                </div>
                                <div class="list-right">
                                    <el-form-item prop="aes_key">
                                        <el-input
                                                maxlength="35"
                                                :disabled="modelInfo.status != 1"
                                                v-model="modelInfo.aes_key"
                                                placeholder="请输入AES密钥，可在对接平台上获取"
                                        />
                                    </el-form-item>
                                </div>
                            </div>
                            <div class="main-right-list">
                                <div class="list-left">
                                    <i v-if="modelInfo.status == 1">*</i>纳税人识别号
                                </div>
                                <div class="list-right operate-list-right">
                                    <el-form-item prop="taxpayer_identification_number">
                                        <el-input
                                                :disabled="modelInfo.status != 1"
                                                v-model="modelInfo.taxpayer_identification_number"
                                                placeholder="请输入纳税人识别号"
                                        />
                                    </el-form-item>
                                </div>
                            </div>
                            <div class="main-right-list">
                                <div class="list-left">
                                    <i v-if="modelInfo.status == 1">*</i>销货方地址
                                </div>
                                <div class="list-right">
                                    <el-form-item prop="seller_address">
                                        <el-input
                                                :disabled="modelInfo.status != 1"
                                                type="textarea"
                                                class="operator_url"
                                                v-model="modelInfo.seller_address"
                                                placeholder="请入如开票方公司地址"
                                        />
                                    </el-form-item>
                                </div>
                            </div>
                            <div class="main-right-list">
                                <div class="list-left">
                                    <i v-if="modelInfo.status == 1">*</i>货物名称
                                </div>
                                <div class="list-right operate-list-right">
                                    <el-form-item prop="goods_name">
                                        <el-input
                                                :disabled="modelInfo.status != 1"
                                                v-model="modelInfo.goods_name"
                                                placeholder="请输入货物名称"
                                        />
                                    </el-form-item>
                                </div>
                            </div>
                            <div class="main-right-list">
                                <div class="list-left">复核人</div>
                                <div class="list-right operate-list-right">
                                    <el-form-item prop="reviewer_name">
                                        <el-input
                                                :disabled="modelInfo.status != 1"
                                                v-model="modelInfo.reviewer_name"
                                                placeholder="请输入复核人名称"
                                        />
                                    </el-form-item>
                                </div>
                            </div>
                        </div>
                        <div class="company-right">
                            <div class="main-right-list">
                                <div class="list-left long-desc">
                                    <i v-if="modelInfo.status == 1">*</i>对接发票平台名称
                                </div>
                                <div class="list-right operate-list-right">
                                    <el-select
                                            :disabled="modelInfo.status != 1"
                                            v-model="modelInfo.platform"
                                            placeholder="运营商类型"
                                    >
                                        <el-option label="51平台" value="1" />
                                    </el-select>
                                </div>
                            </div>
                            <div class="main-right-list">
                                <div class="list-left">
                                    <i v-if="modelInfo.status == 1">*</i>签名密钥
                                </div>
                                <div class="list-right">
                                    <el-form-item prop="signature_key">
                                        <el-input
                                                :disabled="modelInfo.status != 1"
                                                maxlength="55"
                                                v-model="modelInfo.signature_key"
                                                placeholder="请输入签名密钥，可在对接平台上获取"
                                        />
                                    </el-form-item>
                                </div>
                            </div>
                            <div class="main-right-list">
                                <div class="list-left">
                                    <i v-if="modelInfo.status == 1">*</i>开票方名称
                                </div>
                                <div class="list-right operate-list-right">
                                    <el-form-item prop="invoice_party_name">
                                        <el-input
                                                :disabled="modelInfo.status != 1"
                                                v-model="modelInfo.invoice_party_name"
                                                placeholder="请输入开票方公司名称"
                                        />
                                    </el-form-item>
                                </div>
                            </div>
                            <div class="main-right-list">
                                <div class="list-left long-desc">
                                    <i v-if="modelInfo.status == 1">*</i>销货方银行账号
                                </div>
                                <div class="list-right operate-list-right">
                                    <el-form-item prop="seller_bank_account">
                                        <el-input
                                                :disabled="modelInfo.status != 1"
                                                v-model="modelInfo.seller_bank_account"
                                                placeholder="请输入开票方银行账号"
                                        />
                                    </el-form-item>
                                </div>
                            </div>
                            <div class="main-right-list">
                                <div class="list-left">
                                    <i v-if="modelInfo.status == 1">*</i>销货方电话
                                </div>
                                <div class="list-right operate-list-right">
                                    <el-form-item prop="seller_tel">
                                        <el-input
                                                :disabled="modelInfo.status != 1"
                                                v-model="modelInfo.seller_tel"
                                                placeholder="请输入开票方银行账号"
                                        />
                                    </el-form-item>
                                </div>
                            </div>
                            <div class="main-right-list">
                                <div class="list-left">
                                    <i v-if="modelInfo.status == 1">*</i>开票员
                                </div>
                                <div class="list-right operate-list-right">
                                    <el-form-item prop="drawer_name">
                                        <el-input
                                                :disabled="modelInfo.status != 1"
                                                v-model="modelInfo.drawer_name"
                                                placeholder="请输入开票员名称"
                                        />
                                    </el-form-item>
                                </div>
                            </div>
                            <div class="main-right-list">
                                <div class="list-left">收款员</div>
                                <div class="list-right operate-list-right">
                                    <el-form-item prop="cashier_name">
                                        <el-input
                                                :disabled="modelInfo.status != 1"
                                                v-model="modelInfo.cashier_name"
                                                placeholder="请输入收款员名称"
                                        />
                                    </el-form-item>
                                </div>
                            </div>
                        </div>
                    </el-form>
                    <div class="main-right-bottom clearfix">
                        <div class="btn_succ" @click="checkPassword">提交</div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 删除 -->
        <sf-modelBox
                :showModel.sync="showUpdateInfo"
                title="修改确认"
                type="delete"
                @change="updateSure"
        >
            <p style="margin-bottom: 16px">
                信息更新后对已申请发票未出票的客户有影响，请谨慎操作。
            </p>
            <el-form>
                <div class="box-list">
                    <div class="box-left">密码</div>
                    <div class="box-right">
                        <el-form-item prop="password">
                            <el-input
                                    type="password"
                                    v-model="modelInfo.check_password"
                                    placeholder="请输入登录密码"
                            />
                        </el-form-item>
                    </div>
                </div>
            </el-form>
        </sf-modelBox>
    </section>
</template>

<script>
    export default {
        data () {
            return {
                showUpdateInfo: false,
                user_type: "",
                check_password: "",
                showPasswordModel: false,
                loadingInfo: true,
                companyRules: {
                    aes_key: [
                        { required: true, message: "* 请输入AES密钥", trigger: "blur" }
                    ],
                    signature_key: [
                        { required: true, message: "* 请输入签名密钥", trigger: "blur" }
                    ],
                    seller_tel: [
                        { required: true, message: "* 请输入联系电话", trigger: "blur" },
                    ],
                    taxpayer_identification_number: [
                        { required: true, message: "* 请输入纳税人识别号", trigger: "blur" }
                    ],
                    invoice_party_name: [
                        { required: true, message: "* 请输入开票方名称", trigger: "blur" }
                    ],
                    seller_address: [
                        { required: true, message: "* 请输入销货方地址", trigger: "blur" }
                    ],
                    seller_bank_account: [
                        { required: true, message: "* 请输入销货方银行账号", trigger: "blur" }
                    ],
                    goods_name: [
                        { required: true, message: "* 请输入货物名称", trigger: "blur" }
                    ],
                    drawer_name: [
                        { required: true, message: "* 请输入开票员名称", trigger: "blur" }
                    ]
                },
                modelInfo: {
                    status: '0', //是否对接电子发票
                    platform: '1',//对接平台 1代表51平台
                    aes_key: '',//AES密钥
                    signature_key: '',//签名密钥
                    taxpayer_identification_number: '',//纳税人识别号
                    invoice_party_name: '',//开票方名称
                    seller_address: '',//销货方地址
                    seller_bank_account: '',//销货方银行账号
                    goods_name: '',//货物名称
                    seller_tel: '',//销货方电话
                    drawer_name: '',//开票员
                    reviewer_name: '',//复核员 非必填
                    cashier_name: '',//收款员名称 非必填
                    check_password: ''//验证密码
                }
            };
        },
        created () {
            this.getCompanyInfo();
        },
        mounted () {
        },
        methods: {
            checkPassword () {
                var validate_flag = true;
                if (this.modelInfo.status == 1) {
                    this.$refs["modelInfo"].validate(valid => {
                        if (!valid) {
                            validate_flag = false;
                            return false;
                        }
                    });
                }
                if (!validate_flag) {
                    return false;
                }
                this.check_password = '';
                this.showUpdateInfo = true;
            },
            getCompanyInfo () {
                var that = this;
                this.$api.getCompanyInvoice({}).then(res => {
                    this.loadingInfo = false;
                    if (res.code == 1) {
                        if (res.data.status) {
                            that.modelInfo = res.data
                        } else {
                            that.modelInfo = {
                                status: '0', //是否对接电子发票
                                platform: '1',//对接平台 1代表51平台
                                aes_key: '',//AES密钥
                                signature_key: '',//签名密钥
                                taxpayer_identification_number: '',//纳税人识别号
                                invoice_party_name: '',//开票方名称
                                seller_address: '',//销货方地址
                                seller_bank_account: '',//销货方银行账号
                                goods_name: '',//货物名称
                                seller_tel: '',//销货方电话
                                drawer_name: '',//开票员
                                reviewer_name: '',//复核员 非必填
                                cashier_name: ''//收款员名称 非必填
                            }
                        }
                    }
                });
            },
            updateSure () {
                if (!this.modelInfo.check_password) {
                    this.$sfNotify({
                        duration: 0,
                        type: "error",
                        message: "密码不能为空"
                    });
                    return false;
                }
                var that = this;
                this.$api.saveCompanyInvoice(that.modelInfo).then(res => {
                    if (res.code == 1) {
                        this.$sfNotify({
                            message: "修改成功"
                        });
                        that.loadingInfo = true;
                        that.getCompanyInfo();
                        that.showUpdateInfo = false;
                    } else {
                        this.$sfNotify({
                            type: "error",
                            message: res.message
                        });
                    }
                });
            },
            removeValidate () {
                if (this.modelInfo.status != 1) {
                    this.$refs["modelInfo"].clearValidate()
                }
            }
        }
    };
</script>
<style lang="scss" scoped>
    @import "../../assets/css/data/invoice.scss";
</style>
