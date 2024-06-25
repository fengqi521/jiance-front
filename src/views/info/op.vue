<template>
    <section>
        <div class="section-title">运营主体信息</div>
        <div class="section-list section-company clearfix">
            <div class="section-header">
                <div class="section-item-router">
                    <router-link :to="`/auth/opinfo`" class="section-act">基本信息</router-link>
                    <router-link :to="`/auth/opinfo/invoice`">电子发票对接配置</router-link>
                    <router-link :to="`/auth/opinfo/transfer`">运营商转账配置</router-link>
                </div>
            </div>
            <div class="section-main clearfix">
                <div class="main-right">
                    <el-form class="clearfix" :model="companyInfo" ref="companyInfo" :rules="companyRules">
                        <div class="company-left">
                            <div class="main-right-list">
                                <div class="list-left">运营主体名称</div>
                                <div class="list-right">
                                    <el-form-item prop="title">
                                        <el-input v-model="companyInfo.title" placeholder="请输入运营主体名称" disabled />
                                    </el-form-item>
                                </div>
                            </div>
                            <div class="main-right-list">
                                <div class="list-left">平台名称</div>
                                <div class="list-right operate-list-right">
                                    <el-form-item prop="operator_name">
                                        <el-input v-model="companyInfo.operator_name" placeholder="请输入平台名称" />
                                    </el-form-item>
                                </div>
                            </div>
                            <div class="main-right-list">
                                <div class="list-left">联系人</div>
                                <div class="list-right operate-list-right">
                                    <el-form-item prop="operator_people">
                                        <el-input v-model="companyInfo.operator_people" placeholder="请输入联系人姓名" />
                                    </el-form-item>
                                </div>
                            </div>

                            <div class="main-right-list">
                                <div class="list-left">运营商注册地址</div>
                                <div class="list-right">
                                    <el-form-item prop="operator_reg_address">
                                        <el-input type="textarea" class="operator_url"
                                            v-model="companyInfo.operator_reg_address" placeholder="请输入运营商注册地址" />
                                    </el-form-item>
                                </div>
                            </div>

                            <div class="main-right-list">
                                <div class="list-left">支付宝收款商户号</div>
                                <div class="list-right operate-list-right">
                                    <el-form-item prop="operator_people">
                                        <el-input disabled v-model="alipay" placeholder="请输入支付宝收款商户号" />
                                    </el-form-item>
                                </div>
                            </div>

                        </div>
                        <div class="company-right">
                            <div class="main-right-list">
                                <div class="list-left">公司简称</div>
                                <div class="list-right operate-list-right">
                                    <el-form-item prop="operator_note">
                                        <el-input v-model="companyInfo.operator_note" placeholder="请输入公司简称" />
                                    </el-form-item>
                                </div>
                            </div>
                            <div class="main-right-list">
                                <div class="list-left">组织机构代码</div>
                                <div class="list-right">
                                    <el-form-item prop="operator_id">
                                        <el-input v-model="companyInfo.operator_id" placeholder="请输入组织机构代码" disabled
                                            @change="changeUrl" />
                                    </el-form-item>
                                </div>
                            </div>
                            <div class="main-right-list">
                                <div class="list-left">联系电话</div>
                                <div class="list-right operate-list-right">
                                    <el-form-item prop="operator_tel">
                                        <el-input v-model="companyInfo.operator_tel" placeholder="请输入联系电话" />
                                    </el-form-item>
                                </div>
                            </div>
                            <div class="main-right-list">
                                <div class="list-left">卡管理方式</div>
                                <div class="list-right">
                                    <el-form-item>
                                        <el-input v-model="data_sources" placeholder="" disabled />
                                    </el-form-item>
                                </div>
                            </div>
                            <div class="main-right-list">
                                <div class="list-left">微信收款商户号</div>
                                <div class="list-right operate-list-right">
                                    <el-form-item prop="operator_people">
                                        <el-input disabled v-model="wechat" placeholder="请输入微信收款商户号" />
                                    </el-form-item>
                                </div>
                            </div>
                            <div class="main-right-list">
                                <div class="list-left">招商银行商户号</div>
                                <div class="list-right operate-list-right">
                                    <el-form-item prop="operator_people">
                                        <el-input disabled v-model="bank_mch_id" />
                                    </el-form-item>
                                </div>
                            </div>
                        </div>
                    </el-form>
                    <div class="main-right-bottom clearfix">
                        <div class="btn_succ" @click="saveCompanyInfo">提交</div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 修改登录密码 -->
        <div is="editPasswordModel" :showModel.sync="showPasswordModel"></div>
        <!-- 删除 -->
        <sf-modelBox :showModel.sync="showUpdateInfo" title="修改确认" type="delete" @change="updateSure">
            <p style="margin-bottom: 16px">
                注意：组织机构代码信息将用在互联互通功能，修改会影响互联互通
            </p>
            <el-form :model="companyInfo" ref="resetInfo" :rules="updateRules">
                <div class="box-list">
                    <div class="box-left">密码</div>
                    <div class="box-right">
                        <el-form-item prop="password">
                            <el-input type="password" v-model="companyInfo.password" placeholder="请输入登录密码" />
                        </el-form-item>
                    </div>
                </div>
            </el-form>
        </sf-modelBox>
    </section>
</template>

<script>
import editPasswordModel from "./components/editPasswordModel";

export default {
    components: {
        editPasswordModel
    },
    data () {
        const onlyPhone = async (rule, value, callback) => {
            const boolean = new RegExp("^1(3|4|5|6|7|8|9)\\d{9}$").test(value);
            if (!boolean) {
                return callback(new Error("* 手机号格式不正确"));
            }
        };
        return {
            alipay: '',
            wechat: '',
            bank_mch_id: '',
            showUpdateInfo: false,
            //结算方式
            data_sources_arr: {
                0: "离线鉴权",
                1: '在线鉴权-平台结算',
                2: '在线鉴权-第三方结算'
            },
            data_sources: "",
            companyInfo: {
                title: "",
                operator_note: "",
                operator_name: "",
                operator_id: "",
                operator_people: "",
                operator_tel: "",
                operator_reg_address: "",
                operator_url: "",
                password: "",
                id: ""
            },
            showPasswordModel: false,
            updateRules: {
                password: [
                    { required: true, message: "* 请输入登录密码", trigger: "blur" }
                ]
            },
            companyRules: {
                title: [{ required: true, message: "* 请输入名称", trigger: "blur" }],
                operator_name: [],
                operator_id: [
                    { required: true, message: "* 请输入组织机构代码", trigger: "blur" }
                ],
                operator_tel: [
                    { required: true, message: "* 请输入联系电话", trigger: "blur" },
                    { validator: onlyPhone, trigger: "blur" }
                ],
                operator_reg_address: [],
                operator_url: [
                    { required: true, message: "* 请输入url地址", trigger: "blur" }
                ]
            }
        };
    },
    created () {
        this.getCompanyInfo();
    },
    methods: {
        saveCompanyInfo () {
            this.companyInfo.password = "";
            this.updateSure()
        },
        getCompanyInfo () {
            var that = this;
            this.$api.getCompanyInfo({}).then(res => {
                if (res.code == 1) {
                    that.alipay = res.data.alipay;
                    that.wechat = res.data.wechat;
                    this.bank_mch_id = res.data.bank_mch_id || '';
                    that.companyInfo.id = res.data.detail.id;
                    that.companyInfo.title = res.data.detail.title;
                    that.companyInfo.operator_name = res.data.detail.operator_name;
                    that.companyInfo.operator_id = res.data.detail.operator_id;
                    that.companyInfo.operator_note = res.data.detail.operator_note;
                    that.companyInfo.operator_reg_address =
                        res.data.detail.operator_reg_address;
                    that.companyInfo.operator_people = res.data.detail.operator_people;
                    that.companyInfo.operator_tel = res.data.detail.operator_tel;
                    that.companyInfo.operator_url = res.data.detail.operator_url;
                    that.data_sources = that.data_sources_arr[res.data.detail.data_sources];

                }
            });
        },
        updateSure () {
            var that = this;
            this.$refs["companyInfo"].validate(valid => {
                if (valid) {
                    this.$api.saveCompanyInfo(that.companyInfo).then(res => {
                        if (res.code == 1) {
                            this.$sfNotify({
                                message: "修改成功"
                            });
                            that.getCompanyInfo();
                            that.showUpdateInfo = false;
                        } else {
                            this.$sfNotify({
                                type: "error",
                                message: res.message
                            });
                        }
                    });
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        changeUrl () {
            var url = this.companyInfo.operator_url
            var array = url.split('evcs')
            var start = array[1].indexOf('/') + 1
            var end = array[1].lastIndexOf('/') - 1
            var replace_url = array[1].substr(start, end)
            var str = url.replace(replace_url, this.companyInfo.operator_id)
            this.companyInfo.operator_url = str
        }
    }
};
</script>
<style scoped lang="scss" scoped>
@import "../../assets/css/data/info.scss";
</style>
