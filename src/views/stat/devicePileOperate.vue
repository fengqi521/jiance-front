<template>
    <section>
        <div class="section-title">
            <router-link :to="`/stat/device/pile?title=${title}&operator_id=${operator_id}`">充电桩管理</router-link>
            > 充电桩详情
        </div>
        <p class="section-name">{{ pile_detail_name }}</p>
        <div class="section-container">
            <div class="section-item-router">
                <router-link :to="`/stat/device/pile/detail/${id}?title=${title}&operator_id=${operator_id}`">基本信息</router-link>
                <router-link :to="`/stat/device/pile/operate/${id}?title=${title}&operator_id=${operator_id}`" class="section-act">运营信息</router-link>
            </div>
            <el-form :model="modelInfo" ref="modelInfo" :rules="dataRules">
                <!-- 运营信息 -->
                <div class="section-info" v-loading="loadingInfo">
                    <div class="info-content clearfix">
                        <div class="info-left">
                            <!-- 桩来源 -->
                            <div class="info-item">
                                <div class="info-item-left">桩来源</div>
                                <div class="info-item-right">
                                    <el-form-item prop="source_name">
                                        <el-input disabled v-model="modelInfo.source_name" placeholder="桩来源" />
                                    </el-form-item>
                                </div>
                            </div>
                            <!-- 所属拥有者 -->
                            <div class="info-item">
                                <div class="info-item-left">所属拥有者</div>
                                <div class="info-item-right">
                                    <el-form-item prop="account">
                                        <el-input v-if="modelInfo.account" disabled v-model="modelInfo.account" placeholder="所属拥有者" />
                                        <el-input v-else disabled value="暂无" />
                                    </el-form-item>
                                </div>
                            </div>
                            <!-- 关联充电站 -->
                            <div class="info-item">
                                <div class="info-item-left">关联充电站</div>
                                <div class="info-item-right">
                                    <el-form-item prop="station_name">
                                        <el-input disabled v-model="modelInfo.station_name" placeholder="填写关联充电站" />
                                        <span v-if="modelInfo.source !== '2'" class="btn_succ operate-btn" @click="showAddStation = true">选择充电站</span>
                                    </el-form-item>
                                </div>
                            </div>
                            <!-- 充电桩充电功能控制 -->
                            <div class="info-item">
                                <div class="info-item-left show-app">充电桩充电功能控制</div>
                                <div class="info-item-right">
                                    <div class="user-form">
                                        <div class="radio-outer">
                                            <el-radio v-model="modelInfo.user_flag" label="1">所有用户</el-radio>
                                            <el-radio v-model="modelInfo.user_flag" label="2">名单用户</el-radio>
                                        </div>
                                        <div v-if="modelInfo.user_flag == 2" class="open-listUser">
                                            <div class="listUser-main">
                                                <el-form-item prop="_user">
                                                    <el-input type="hidden" v-model="modelInfo._user"></el-input>
                                                    <div class="listUser-content scrollBar clearfix">
                                                        <div class="listUser-item" v-for="(item, _index) in modelInfo.users" :key="_index">
                                                            <span>{{ getUsersById(item, 'nick_name') }}</span>
                                                            <i class="clear-icon" @click="deleteUserById(item)"></i>
                                                        </div>
                                                    </div>
                                                </el-form-item>

                                                <span class="btn_succ operate-btn listUser-btn" @click="showAddUser = true">选择用户</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 提交 -->
                </div>
            </el-form>
        </div>
        <!-- 选择充电站 -->
        <div v-if="modelInfo.source" is="addStationModel" :station_id.sync="modelInfo.station_id" :station_name.sync="modelInfo.station_name" :showModel.sync="showAddStation" :source="modelInfo.source"></div>
        <!-- 选择用户 -->
        <div is="addUserModel" :users="userArr" :searchUser.sync="searchUser" :choosedUser.sync="modelInfo.users" :showModel.sync="showAddUser"></div>
    </section>
</template>

<script>
import addOwnerModel from './components/addOwnerModel'
import addStationModel from './components/addStationModel'
import addUserModel from './components/addUserModel'
export default {
    components: {
        addOwnerModel,
        addStationModel,
        addUserModel,
    },
    data() {
        this.title = (this.$route.query && this.$route.query.title) || ''
        const operator_id = (this.$route.query && this.$route.query.operator_id) || ''
        return {
            operator_id,
            pile_detail_name: '',
            loadingInfo: false,
            searchUser: '',
            showAddOwner: false,
            showAddStation: false,
            showAddUser: false,
            id: this.$route.params.id ? this.$route.params.id : '',
            modelInfo: {
                id: this.$route.params.id ? this.$route.params.id : '',
                source_name: '',
                source: '',
                user_flag: '2',
                owner_id: '',
                station_id: '',
                users: [],
                account: '',

                //表单验证冗余字段
                _user: '',
                station_name: '',
            },
            dataRules: {
                account: [],
                station_name: [
                    {
                        required: true,
                        message: '* 请选择关联充电站',
                        trigger: 'change',
                    },
                ],
                _user: [
                    {
                        required: true,
                        message: '* 请选择最少一个用户',
                        trigger: 'change',
                    },
                ],
            },
            userArr: [],
        }
    },
    watch: {
        'modelInfo.users': {
            handler: function (newItem) {
                if (newItem.length > 0 || this.modelInfo.user_flag == 1) {
                    this.modelInfo._user = '111'
                } else {
                    this.modelInfo._user = ''
                }
            },
            deep: true,
        },
        'modelInfo.user_flag': {
            handler: function (newItem) {
                if (newItem.length > 0 || this.modelInfo.user_flag == 1) {
                    this.modelInfo._user = '111'
                } else {
                    this.modelInfo._user = ''
                }
            },
            deep: true,
        },
    },
    created() {
        this.getPileUsers()
        this.getPileDetail()
    },
    methods: {
        deleteUserById(id) {
            const index = this.modelInfo.users.indexOf(id)
            if (index > -1) {
                this.modelInfo.users.splice(index, 1)
            }
        },
        //获取用户
        getUsersById(id, key) {
            if (this.userArr.length == 0) return ''
            var user = this.$utils.getArrayItem(this.userArr, 'id', id)
            return user && user[key] ? user[key] : ''
        },
        getPileUsers() {
            var _this = this
            var params = {
                search: _this.searchUser,
                operator_id: this.operator_id,
            }
            this.$api.pileUsers(params).then(res => {
                if (res.code == 1) {
                    this.userArr = res.data
                }
            })
        },
        getPileDetail() {
            var _this = this
            var params = {
                id: _this.modelInfo.id,
                operator_id: this.operator_id,
            }
            this.loadingInfo = true
            this.$api.pileOperationDetail(params).then(res => {
                if (res.code == 1) {
                    res.data.users = []
                    this.modelInfo = res.data
                    this.pile_detail_name = res.data.pile_name

                    this.modelInfo.source_name = res.data.source == 1 ? '自营' : '第三方'
                    var tempUsers = []
                    this.modelInfo.user.forEach(ele => {
                        tempUsers.push(ele.user_id)
                    })
                    this.modelInfo.id = this.id
                    this.modelInfo.users = tempUsers
                    this.modelInfo._user = ''
                }
                this.loadingInfo = false
            })
        },
        saveDeviceInfo() {
            console.log('pileOp')
            this.$refs['modelInfo'].validate(valid => {
                if (valid) {
                    this.$api.pileOperationEdit(this.modelInfo).then(res => {
                        if (res.code == 1) {
                            this.$sfNotify({
                                message: '保存成功',
                            })
                            this.$router.push('/device/pile')
                        } else {
                            this.$sfNotify({
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
    },
}
</script>
<style lang="scss" scoped>
@import '../../assets/css/device/pileOperate.scss';
</style>
