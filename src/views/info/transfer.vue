<template>
    <section>
        <div class="section-title">运营主体信息</div>
        <div class="section-list section-company clearfix">
            <div class="section-header">
                <div class="section-item-router">
                    <router-link :to="`/auth/opinfo`">基本信息</router-link>
                    <router-link :to="`/auth/opinfo/invoice`">电子发票对接配置</router-link>
                    <router-link :to="`/auth/opinfo/transfer`" class="section-act">运营商转账配置</router-link>
                </div>
            </div>
            <div class="section-main clearfix" v-loading="loadingInfo">
                <div class="main-right">
                    <el-form class="clearfix" :model="modelInfo" ref="modelInfo" :rules="companyRules">
                        <div class="main-right-list">
                            <div class="list-left">
                                <i>*</i>
                                账户类型
                            </div>
                            <div class="list-right radio-different">
                                <el-radio-group class="radio-outer" v-model="modelInfo.payment_type"
                                    @change="removeValidate">
                                    <el-radio v-model="modelInfo.payment_type" label="2">
                                        <img class="radio-img" :src="require('assets/img/alipay.png')" />
                                    </el-radio>
                                    <el-radio class="radio-disabled" v-model="modelInfo.payment_type" label="1">
                                        <img class="radio-img" :src="require('assets/img/wechat.png')" />
                                    </el-radio>

                                    <el-radio class="radio-disabled" v-model="modelInfo.payment_type" label="3">
                                        <img class="radio-img" :src="require('assets/img/bankcard.png')" />
                                    </el-radio>
                                </el-radio-group>
                            </div>
                        </div>
                        <div class="main-right-list" v-if="modelInfo.payment_type == 1">
                            <div class="list-left"></div>
                            <div class="list-right account-type-1">
                                <div class="radio-content-2">
                                    <img :src="require('assets/img/arrow-top.png')" />
                                    <div class="content">
                                        <div>需要开通“商家转账到零钱”功能，商户登录微信支付【商户平台—>产品中心—>商家转账到零钱】，点击开通进入开通流程</div>
                                        <!-- <div class="title">使用条件：</div> -->
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="main-right-list" v-if="modelInfo.payment_type == 2">
                            <div class="list-left"></div>
                            <div class="list-right account-type-2">
                                <div class="radio-content-1">
                                    <img :src="require('assets/img/arrow-top.png')" />
                                    <div class="content">
                                        <div>需要完成“转账到支付宝账户”协议签约本能力才会生效，在“支付宝 开放平台控制台”完成签约，功能的状态会变成 已生效，即可使用转账到支付宝账户功能。</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="main-right-list">
                            <div class="list-left long-desc">是否开通线上转账</div>
                            <div class="list-right" style="height: 36px">
                                <div class="header-knob"
                                    style="display: flex; flex-direction: row; align-items: center; margin-top: 18px">
                                    <div :class="['knob', modelInfo.status == '1' ? 'started' : '']"
                                        @click="changeStatus(modelInfo.status)"></div>
                                    <div class="knob-text">
                                        {{ modelInfo.status == '1' ? '开启' : '关闭' }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="main-right-list" v-if="modelInfo.payment_type == 2">
                            <div class="list-left">
                                <i>*</i>
                                app_id
                            </div>
                            <div class="list-right">
                                <el-form-item prop="app_id">
                                    <el-input maxlength="35" v-model="modelInfo.app_id" placeholder="请输入app_id，可在支付宝平台获取" />
                                </el-form-item>
                            </div>
                        </div>
                        <div class="main-right-list" v-if="modelInfo.payment_type == 2">
                            <div class="list-left">
                                <i>*</i>
                                私钥
                            </div>
                            <div class="list-right">
                                <el-form-item prop="private_key">
                                    <el-input type="textarea" class="operator_url scrollBar" v-model="modelInfo.private_key"
                                        placeholder="请输入私钥，可在支付宝平台获取" />
                                </el-form-item>
                            </div>
                        </div>
                        <div class="main-right-list" v-if="modelInfo.payment_type == 2">
                            <div class="list-left">
                                <i>*</i>
                                公钥
                            </div>
                            <div class="list-right">
                                <el-form-item prop="public_key">
                                    <el-input type="textarea" class="operator_url scrollBar" v-model="modelInfo.public_key"
                                        placeholder="请输入公钥，可在支付宝平台获取" />
                                </el-form-item>
                            </div>
                        </div>
                        <!-- 上传证书 -->
                        <div v-if="modelInfo.payment_type == 2">
                            <upload-file v-for="(item, index) in fileUploadLists" :key="index" :title="item.title"
                                :fileList="modelInfo[item.filed]" :changeValue.sync="modelInfo[item.filed]">
                                <el-button size="small" type="primary">上传证书...</el-button>
                                <template v-slot:prompt>
                                    <div class="el-upload__tip">* 上传{{ item.title }}，可在{{ '支付宝' }}平台获取。</div>
                                </template>
                            </upload-file>
                        </div>
                        <!-- 微信提交开始 -->
                        <div class="main-right-list" v-if="modelInfo.payment_type == 1">
                            <div class="list-left">
                                <i>*</i>
                                微信支付app_id
                            </div>
                            <div class="list-right">
                                <el-form-item prop="app_id">
                                    <el-input maxlength="35" v-model="modelInfo.app_id" placeholder="请输入app_id，可在微信平台获取" />
                                </el-form-item>
                            </div>
                        </div>
                        <div class="main-right-list" v-if="modelInfo.payment_type == 1">
                            <div class="list-left">
                                <i>*</i>
                                公众号app_id
                            </div>
                            <div class="list-right">
                                <el-form-item prop="public_app_id">
                                    <el-input maxlength="35" v-model="modelInfo.public_app_id"
                                        placeholder="请输入app_id，可在微信公众号平台获取" />
                                </el-form-item>
                            </div>
                        </div>
                        <div class="main-right-list" v-if="modelInfo.payment_type == 1">
                            <div class="list-left">
                                <i>*</i>
                                公众号app_secre
                            </div>
                            <div class="list-right">
                                <el-form-item prop="public_app_secret">
                                    <el-input maxlength="35" v-model="modelInfo.public_app_secret"
                                        placeholder="请输入app_secre，可在微信公众号平台获取" />
                                </el-form-item>
                            </div>
                        </div>
                        <div class="main-right-list" v-if="modelInfo.payment_type == 1">
                            <div class="list-left">
                                <i>*</i>
                                微信商户号
                            </div>
                            <div class="list-right">
                                <el-form-item prop="mch_id">
                                    <el-input maxlength="35" v-model="modelInfo.mch_id"
                                        placeholder="请输入微信商户号，可在微信公众号平台获取" />
                                </el-form-item>
                            </div>
                        </div>
                        <div class="main-right-list" v-if="modelInfo.payment_type == 1">
                            <div class="list-left">
                                <i>*</i>
                                微信平台支付证书序列号
                            </div>
                            <div class="list-right">
                                <el-form-item prop="wechat_pay_serialno">
                                    <el-input maxlength="50" v-model="modelInfo.wechat_pay_serialno"
                                        placeholder="请输入证书序列号，可在微信公众号平台获取" />
                                </el-form-item>
                            </div>
                        </div>
                        <div class="main-right-list" v-if="modelInfo.payment_type == 1">
                            <div class="list-left">
                                <i>*</i>
                                微信公钥证书序列号
                            </div>
                            <div class="list-right">
                                <el-form-item prop="public_key_serialno">
                                    <el-input maxlength="50" v-model="modelInfo.public_key_serialno"
                                        placeholder="请输入证书序列号，可在微信公众号平台获取" />
                                </el-form-item>
                            </div>
                        </div>
                        <!-- 微信-上传证书 -->
                        <div v-if="modelInfo.payment_type == 1">
                            <upload-file v-for="(item, index) in wechatfileUploadLists" :key="index" :title="item.title"
                                :fileList="modelInfo[item.filed]" :changeValue.sync="modelInfo[item.filed]">
                                <el-button size="small" type="primary">上传证书...</el-button>
                                <template v-slot:prompt>
                                    <div class="el-upload__tip">* 上传{{ item.title }}，可在"微信"平台获取。</div>
                                </template>
                            </upload-file>
                        </div>
                        <!-- 银行卡设置 -->
                        <div class="card-form" v-if="modelInfo.payment_type === '3'">
                            <div class="card-form-list">
                                <p class="card-form-label">*<span>用户公钥</span></p>
                                <el-form-item prop="public_key"
                                    :rules="[{ required: true, message: '* 请输入用户公钥', trigger: 'blur' }]">
                                    <el-input type="textarea" class="scrollBar" v-model="modelInfo.public_key"
                                        placeholder="请输入用户公钥,可以在招行平台获取" />
                                </el-form-item>
                            </div>
                            <div class="card-form-list">
                                <p class="card-form-label">*<span>用户私钥</span></p>
                                <el-form-item prop="private_key"
                                    :rules="[{ required: true, message: '* 请输入用户私钥', trigger: 'blur' }]">
                                    <el-input type="textarea" class="scrollBar" v-model="modelInfo.private_key"
                                        placeholder="请输入用户私钥,可以在招行平台获取" />
                                </el-form-item>
                            </div>
                            <div class="card-form-list">
                                <p class="card-form-label">*<span>用户对称秘钥</span></p>
                                <el-form-item prop="user_symmetric_key">
                                    <el-input type="textarea" class="scrollBar" v-model="modelInfo.user_symmetric_key"
                                        placeholder="请输入用户对称秘钥,可以在招行平台获取" />
                                </el-form-item>
                            </div>
                            <div class="card-form-list">
                                <p class="card-form-label">*<span>加密后对称秘钥</span></p>
                                <el-form-item prop="encrypted_symmetric_key">
                                    <el-input type="textarea" class="scrollBar" v-model="modelInfo.encrypted_symmetric_key"
                                        placeholder="请输入加密后对称秘钥,可以在招行平台获取" />
                                </el-form-item>
                            </div>
                            <div class="card-form-list">
                                <p class="card-form-label">*<span>银行公钥</span></p>
                                <el-form-item prop="bank_public_key">
                                    <el-input type="textarea" class="scrollBar" v-model="modelInfo.bank_public_key"
                                        placeholder="请输入银行公钥,可以在招行平台获取" />
                                </el-form-item>
                            </div>
                            <div class="card-form-list">
                                <p class="card-form-label">*<span>招行UID</span></p>
                                <el-form-item prop="bank_mch_id">
                                    <el-input v-model="modelInfo.bank_mch_id" :maxlength="10"
                                        placeholder="请输入招行UID,可以在招行平台获取" />
                                </el-form-item>
                            </div>
                            <div class="card-form-list">
                                <p class="card-form-label">*<span>转出帐号</span></p>
                                <el-form-item prop="out_account">
                                    <el-input v-model="modelInfo.out_account" placeholder="请输入转出帐号" />
                                </el-form-item>
                            </div>
                        </div>
                        <!-- 费率设置-公共 -->
                        <div class="main-right-list main-right-different" v-if="modelInfo.payment_type !== '3'">
                            <div class="list-left long-desc">
                                <i style="position: absolute">*</i>
                                手续费费率设置
                            </div>
                            <div class="list-right list-right-short">
                                <el-form-item prop="service_fee" class="only-short">
                                    <el-input v-model="modelInfo.service_fee" placeholder="0.00-100"
                                        @input="limitInputRange($event)" type="number" />
                                </el-form-item>
                                <span class="unit">
                                    %
                                    <el-tooltip content="1、费率为0时不收手续费； 2、费率不为0时,将会判断最低、最高手续费进行收取" placement="top">
                                        <div class="tips-icon"></div>
                                    </el-tooltip>
                                </span>
                                <span class="discount">手续费最低扣款</span>
                                <el-form-item prop="min_service" class="only-short">
                                    <el-input v-model="modelInfo.min_service" placeholder="请输入"
                                        @input="limitInputMin($event)" type="number" />
                                </el-form-item>
                                <span class="unit">
                                    元
                                    <el-tooltip content="1、最低扣款为0时,没有最低限制； 2、最低扣款不为0,根据费率计算后需要校验最低扣款值" placement="top">
                                        <div class="tips-icon"></div>
                                    </el-tooltip>
                                </span>
                                <span class="discount">手续费最高扣款</span>
                                <el-form-item prop="max_service">
                                    <el-input v-model="modelInfo.max_service" placeholder="请输入"
                                        @input="limitInputMax($event)" type="number" />
                                </el-form-item>
                                <span class="unit">
                                    元
                                    <el-tooltip content="1、最高扣款为0时,没有最高限制； 2、最低扣款不为0,根据费率计算后需要校验最高扣款值" placement="top">
                                        <div class="tips-icon"></div>
                                    </el-tooltip>
                                </span>
                                <i class="only-i">* 运营商转账如需支付手续费，可在此设置费率或实际费用从代理商账户扣除。</i>
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
        <sf-modelBox :showModel.sync="showUpdateInfo" title="提交确认" @change="updateSure">
            <p style="margin-bottom: 16px; color: #ff6632">信息更新会直接替换，请谨慎操作。</p>
            <el-form>
                <div class="box-list">
                    <div class="box-left">密码</div>
                    <div class="box-right">
                        <el-form-item prop="password">
                            <el-input type="password" v-model="modelInfo.check_password" placeholder="请输入登录密码进行确认" />
                        </el-form-item>
                    </div>
                </div>
            </el-form>
        </sf-modelBox>
    </section>
</template>

<script>
import uploadFile from './components/uploadFile'

import { validateCMBCard, validateUID } from '@/utils/validate'
export default {
    components: {uploadFile},
    data () {
        this.fileUploadLists = [
            { title: '应用公钥证书', filed: 'ali_app_cert_file' },
            { title: '支付宝公钥证书', filed: 'ali_public_cert_file' },
            { title: '支付宝CA根证书', filed: 'ali_ca_cert_file' },
        ]
        this.wechatfileUploadLists = [
            { title: '微信平台支付证书', filed: 'wx_ca_cert_file' },
            { title: '微信商户私钥证书', filed: 'wx_private_key_file' },
        ]
        //验证招商卡号
        const validateCard = (rule, value, callback) => {
            if (!validateCMBCard(value)) callback(new Error('* 目前只支持招商卡'))
            else callback()
        }


        // 验证招行uid
        const validateBankUid = (rule, value, callback) => {
            if (!validateUID(value)) callback(new Error('* 格式错误'))
            else callback()
        }

        return {
            ENV: process.env.NODE_ENV == 'development' ? '/api' : '',
            modelInfo: {
                status: '0',
                payment_type: '1',
                app_id: '',
                mch_id: '',
                private_key: '',
                public_key: '',
                service_fee: '',
                max_service: '',
                min_service: '',
                password: '',
                ali_app_cert_file: [],
                ali_public_cert_file: [],
                ali_ca_cert_file: [],

                public_app_id: '',
                public_app_secret: '',
                wechat_pay_serialno: '',
                public_key_serialno: '',
                wx_ca_cert_file: [],
                wx_private_key_file: [],

                bank_mch_id: '',
                user_symmetric_key: '',
                encrypted_symmetric_key: '',
                bank_public_key: '',
                out_account: '',
                ratio_json: [],  //费率
            },
            user_type: '',
            check_password: '',

            showUpdateInfo: false,
            showPasswordModel: false,
            loadingInfo: false,
            companyRules: {
                app_id: [{ required: true, message: '* 请输入app_id', trigger: 'blur' }],
                mch_id: [{ required: true, message: '* 请输入商户id', trigger: 'blur' }],
                private_key: [{ required: true, message: '* 请输入私钥', trigger: 'blur' }],
                public_key: [{ required: true, message: '* 请输入微信密钥或支付宝公钥', trigger: 'blur' }],
                service_fee: [{ required: true, message: '* 请输入转账费率', trigger: 'blur' }],
                max_service: [{ required: true, message: '* 请输入最高扣款', trigger: 'blur' }],
                min_service: [{ required: true, message: '* 请输入最低扣款', trigger: 'blur' }],

                public_app_id: [{ required: true, message: '* 请输入公众号app_id', trigger: 'blur' }],
                public_app_secret: [{ required: true, message: '* 请输入公众号app_secre', trigger: 'blur' }],
                wechat_pay_serialno: [{ required: true, message: '* 请输入微信平台支付证书序列号', trigger: 'blur' }],
                public_key_serialno: [{ required: true, message: '* 请输入微信公钥证书序列号', trigger: 'blur' }],


                user_symmetric_key: [{ required: true, message: '* 请输入用户对称秘钥', trigger: 'blur' }],
                encrypted_symmetric_key: [{ required: true, message: '* 请输入加密后对称秘钥', trigger: 'blur' }],
                bank_public_key: [{ required: true, message: '* 请输入银行公钥', trigger: 'blur' }],
                bank_mch_id: [
                    { required: true, message: '* 请输入招行UID', trigger: 'blur' },
                    { validator: validateBankUid, trigger: 'blur' }
                ],
                out_account: [
                    { required: true, message: '* 请输入转出帐号', trigger: 'blur' },
                    { validator: validateCard, trigger: 'blur' }
                ]
              
            },
        }
    },
    watch: {
        'modelInfo.payment_type' (newValue, oldValue) {
            if (oldValue !== newValue) {
                this.$refs['modelInfo'].resetFields()
                this.modelInfo = {
                    status: '0',
                    payment_type: newValue,
                    app_id: '',
                    mch_id: '',
                    private_key: '',
                    public_key: '',
                    service_fee: '',
                    max_service: '',
                    min_service: '',
                    password: '',
                    ali_app_cert_file: [],
                    ali_public_cert_file: [],
                    ali_ca_cert_file: [],

                    public_app_id: '',
                    public_app_secret: '',
                    wechat_pay_serialno: '',
                    public_key_serialno: '',
                    wx_ca_cert_file: [],
                    wx_private_key_file: [],

                    bank_mch_id: '',
                    user_symmetric_key: '',
                    encrypted_symmetric_key: '',
                    bank_public_key: '',
                    out_account: '',

                }
            }

        },
    },
    created () {
        this.getTableDataList()
    },
    methods: {
        limitInputRange (value) {
            let val = (value && value.split('')) || []
            let reg1 = /\d/
            let reg2 = /\./
            // 第一个字符不能为小数点
            if (val[0] == '.') {
                this.modelInfo.service_fee = ''
                return
            }
            // 过滤掉除数字和小数点外的字符
            val = val.filter(e => reg1.test(e) || reg2.test(e))
            // 匹配小数点后只能有两位小数
            // 解释一下这个match正则规格
            // ^\d* 是指以数字开头，后面允许输入0到多位数字
            // (\.?) 是指只允许一个小数点
            // \d{0,2} 是指只允许0到2位小数

            this.modelInfo.service_fee = val.join('').match(/^\d*(\.?\d{0,2})/g)[0] || null

            if (this.modelInfo.service_fee > 100) {
                this.modelInfo.service_fee = 100
            }
        },
        limitInputMin (value) {
            let val = (value && value.split('')) || []
            let reg1 = /\d/
            let reg2 = /\./
            // 第一个字符不能为小数点
            if (val[0] == '.') {
                this.modelInfo.min_service = ''
                return
            }
            // 过滤掉除数字和小数点外的字符
            val = val.filter(e => reg1.test(e) || reg2.test(e))
            // 匹配小数点后只能有两位小数
            // 解释一下这个match正则规格
            // ^\d* 是指以数字开头，后面允许输入0到多位数字
            // (\.?) 是指只允许一个小数点
            // \d{0,2} 是指只允许0到2位小数
            this.modelInfo.min_service = val.join('').match(/^\d*(\.?\d{0,2})/g)[0] || null
        },
        limitInputMax (value) {
            let val = (value && value.split('')) || []
            let reg1 = /\d/
            let reg2 = /\./
            // 第一个字符不能为小数点
            if (val[0] == '.') {
                this.modelInfo.max_service = ''
                return
            }
            // 过滤掉除数字和小数点外的字符
            val = val.filter(e => reg1.test(e) || reg2.test(e))
            // 匹配小数点后只能有两位小数
            // 解释一下这个match正则规格
            // ^\d* 是指以数字开头，后面允许输入0到多位数字
            // (\.?) 是指只允许一个小数点
            // \d{0,2} 是指只允许0到2位小数
            this.modelInfo.max_service = val.join('').match(/^\d*(\.?\d{0,2})/g)[0] || null
        },
        changeStatus (val) {
            let status = val == '1' ? '0' : '1'
            this.modelInfo.status = status
        },
        getTableDataList () {
            this.loadingInfo = true
            this.$api.getOperatorTransfer({ payment_type: this.modelInfo.payment_type }).then(data => {
                this.loadingInfo = false
                if (data.code == 1) {
                    if (data.data.id) {
                        this.modelInfo.status = data.data.status
                        this.modelInfo.payment_type = data.data.payment_type

                        // 银行卡
                        if (data.data.payment_type === '3') {
                            this.modelInfo.private_key = data.data.private_key
                            this.modelInfo.public_key = data.data.public_key
                            this.modelInfo.user_symmetric_key = data.data.user_symmetric_key
                            this.modelInfo.encrypted_symmetric_key = data.data.encrypted_symmetric_key
                            this.modelInfo.bank_public_key = data.data.bank_public_key
                            this.modelInfo.out_account = data.data.out_account || ''
                            this.modelInfo.bank_mch_id = data.data.mch_id
                            return;
                        }
                        this.modelInfo.app_id = data.data.app_id
                        this.modelInfo.mch_id = data.data.mch_id
                        this.modelInfo.service_fee = data.data.service_fee
                        this.modelInfo.max_service = data.data.max_service
                        this.modelInfo.min_service = data.data.min_service

                        // 支付宝
                        if (data.data.payment_type == '2') {
                            this.modelInfo.private_key = data.data.private_key
                            this.modelInfo.public_key = data.data.public_key
                            this.modelInfo.ali_app_cert_file = data.data.app_cert_path
                            this.modelInfo.ali_public_cert_file = data.data.alipay_public_cert_path
                            this.modelInfo.ali_ca_cert_file = data.data.root_cert_path
                        } else {
                            //微信
                            this.modelInfo.public_app_id = data.data.public_app_id
                            this.modelInfo.public_app_secret = data.data.public_app_secret
                            this.modelInfo.wechat_pay_serialno = data.data.wechat_pay_serialno
                            this.modelInfo.public_key_serialno = data.data.public_key_serialno
                            this.modelInfo.wx_ca_cert_file = data.data.root_cert_path
                            this.modelInfo.wx_private_key_file = data.data.private_key
                        }
                    }
                }
            })
        },

        async checkPassword () {
            const valid = await this.$refs['modelInfo'].validate().catch(err => err)
            if (!valid) return
            this.check_password = ''
            this.showUpdateInfo = true
        },
        updateSure () {
            if (!this.modelInfo.check_password) {
                this.$sfNotify({
                    duration: 0,
                    type: 'error',
                    message: '密码不能为空',
                })
                return false
            }

            // 支付宝
            if (this.modelInfo.payment_type == '2') {
                if (!this.modelInfo.ali_app_cert_file) {
                    this.$sfNotify({
                        duration: 0,
                        type: 'error',
                        message: '应用公钥证书不能为空',
                    })
                    return false
                }
                if (!this.modelInfo.ali_public_cert_file) {
                    this.$sfNotify({
                        duration: 0,
                        type: 'error',
                        message: '支付宝公钥证书不能为空',
                    })
                    return false
                }
                if (!this.modelInfo.ali_ca_cert_file) {
                    this.$sfNotify({
                        duration: 0,
                        type: 'error',
                        message: '支付宝CA根证书不能为空',
                    })
                    return false
                }
            }

            // 微信
            if (this.modelInfo.payment_type == '1') {
                if (!this.modelInfo.wx_ca_cert_file) {
                    this.$sfNotify({
                        duration: 0,
                        type: 'error',
                        message: '微信平台支付证书不能为空',
                    })
                    return false
                }
                if (!this.modelInfo.wx_private_key_file) {
                    this.$sfNotify({
                        duration: 0,
                        type: 'error',
                        message: '微信商户私钥证书不能为空',
                    })
                    return false
                }
            }

            let params = { ...this.modelInfo }
            if (this.modelInfo.payment_type === '3') {
                const { bank_mch_id } = this.modelInfo;
                params = { ...params, mch_id: bank_mch_id }
            }
            this.$api.saveOperatorTransfer(params).then(res => {
                if (res.code == 1) {
                    this.$sfNotify({
                        message: '修改成功',
                    })
                    this.loadingInfo = true
                    this.showUpdateInfo = false
                    this.getTableDataList()
                } else {
                    this.$sfNotify({
                        type: 'error',
                        message: res.message,
                    })
                }
            })
        },
        removeValidate () {
            this.getTableDataList()
            // if (this.modelInfo.status != 1) {
            //   this.$refs["modelInfo"].clearValidate();
            // }
        },
    },
}
</script>
<style lang="scss" scoped>
@import '../../assets/css/data/transfer.scss';
</style>
