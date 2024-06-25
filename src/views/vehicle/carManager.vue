<template>
    <section>
        <div class="section-title">车辆管理</div>
        <div class="section-header">
            <div class="section-item-header clearfix">
                <span>筛选查询</span>
            </div>
            <div class="header-content clearfix">
                <div class="content-item user-only">
                    <el-select class="search-type" v-model="modelObj.search_type">
                        <el-option label="用户账号" value="1" />
                        <el-option label="车牌号" value="2" />
                        <el-option label="车架号" value="3" />
                    </el-select>
                    <el-input class="search-input" v-model="search_content" placeholder="关键字搜索" />
                    <!-- <div class="header-left" style="padding-right: 24px !important">
            <div class="header-left">用户账户</div>
          </div>
          <div class="header-right">
            <el-input
              class="search-input"
              v-model="search_content"
              placeholder="关键字搜索"
            />
          </div> -->
                </div>
                <div class="content-item">
                    <div class="header-left">所属方</div>
                    <div class="header-right">
                        <el-select v-model="modelObj.bind_type">
                            <el-option label="全部" value="all" />
                            <el-option label="个人" value="1" />
                            <el-option label="企业" value="2" />
                        </el-select>
                    </div>
                </div>
                <div class="content-item" v-if="modelObj.bind_type == '2'">
                    <div class="header-left">企业名称</div>
                    <div class="header-right">
                        <el-select v-model="modelObj.company_id">
                            <el-option v-for="list in companyList" :key="list.bind_name" :label="list.bind_name" :value="list.id" />
                        </el-select>
                    </div>
                </div>
                <div class="content-item">
                    <div class="header-left">车辆类型</div>
                    <div class="header-right">
                        <el-select v-model="modelObj.car_type">
                            <el-option label="全部" value="all" />
                            <el-option label="运营车" value="1" />
                            <el-option label="私家车" value="2" />
                        </el-select>
                    </div>
                </div>
                <div class="content-item">
                    <div class="header-left">状态</div>
                    <div class="header-right">
                        <el-select v-model="modelObj.status">
                            <el-option label="全部" value="all" />
                            <el-option label="未审核" value="1" />
                            <el-option label="已审核" value="2" />
                        </el-select>
                    </div>
                </div>
                <div class="content-item">
                    <div class="btn_succ" @click="searchVehicle()">查询</div>
                    <div class="btn_cancel" @click="resetSearch()">重置</div>
                </div>
            </div>
        </div>
        <div class="section-container">
            <div class="section-item-header clearfix">
                <span>车辆列表</span>

                <router-link to="/vehicle/car/addcar" class="btn_succ add-coupon" style="margin-left: 24px; padding-left: 42px">
                    <i class="add-station"></i>
                    添加车辆
                </router-link>
                <span class="btn_recovery send-btn send-btn-car">
                    <i class="add-station-out"></i>
                    <!-- 批量导入 -->
                    <el-upload class="upload-demo" ref="upload" :action="`${ENV}/vhm/import-vhm`" :before-upload="beforeUpload" :on-progress="progressUpload" :on-success="importVhm" :show-file-list="false">
                     批量导入
                    </el-upload>
                    <el-tooltip content="点击下载导入示例" placement="top">
                        <div class="hover-green" slot="content" style="line-height: 18px">
                            <a :href="`${ENV}/vhm/demo.xls`">点击下载导入示例</a>
                            <br />
                            第一行：用户账号
                            <br />
                            第二行：车型
                            <br />
                            第三行：车牌号
                            <br />
                            第四行：车架号
                            <br />
                            第五行：所属方
                            <br />
                            第六行：企业名称
                            <br />
                            第七行：车辆类型
                        </div>
                        <div class="tips-icon"></div>
                    </el-tooltip>
                </span>
                <router-link to="/vehicle/car/cartype" class="btn_recovery send-btn">车型管理 >></router-link>
                <span class="btn_recovery add-coupon batch-close" @click="changeModel(0)">批量关闭即插即充</span>
                <span class="add-coupon btn_succ" @click="changeModel(1)">批量开启即插即充</span>
            </div>
            <div class="section-main">
                <div class="table">
                    <div class="table-th clearfix">
                        <div class="table-td table-column__1">
                            <span
                                class="checkbox-icon"
                                :class="{
                                    'checkbox-disabled-icon': role_type === '2' ? false : isShowAll,
                                    'checkbox-act-icon': checkboxAll,
                                }"
                                @click="handleCheckedAll"
                            ></span>
                        </div>

                        <div class="table-td">来源</div>
                        <div class="table-td">用户账号</div>
                        <div class="table-td">车型</div>
                        <div class="table-td">车牌号</div>
                        <div class="table-td">车架号</div>
                        <div class="table-td">所属方</div>
                        <div class="table-td">企业名称</div>
                        <div class="table-td">车辆类型</div>
                        <div class="table-td">
                            <span class="is-c-c">是否已开启即插即充</span>
                        </div>
                        <div class="table-td">审核状态</div>
                        <div class="table-td">操作</div>
                    </div>
                    <div class="table-body" v-loading="listLoading">
                        <div class="table-tr" v-show="tableData && tableData.length > 0" v-for="(carlist_info, index) in tableData" :key="index">
                            <div class="table-td table-column__1">
                                <i
                                    :class="{
                                        'checkbox-icon': true,
                                        'checkbox-disabled-icon': carlist_info.bind_type !== '2' && role_type !== '2',
                                        'checkbox-act-icon': choiceLists.indexOf(carlist_info.id) > -1,
                                    }"
                                    @click="handleChecked(carlist_info.id)"
                                ></i>
                            </div>
                            <div class="table-td">
                                <div class="td-item">
                                    {{ carlist_info.platform_type == '2' ? 'app端' : 'web端' }}
                                </div>
                            </div>
                            <div class="table-td">
                                <div class="td-item">{{ carlist_info.tel }}</div>
                            </div>
                            <div class="table-td">
                                <div class="td-item">
                                    <el-tooltip :content="carlist_info.car_type_name" placement="top">
                                        <span class="car-type-name">
                                            {{ carlist_info.car_type_name | ellipsis }}
                                        </span>
                                    </el-tooltip>
                                </div>
                            </div>
                            <div class="table-td">
                                <div class="td-item">
                                    <el-tooltip :content="carlist_info.license_plate" placement="top">
                                        <span class="car-type-name">
                                            {{ carlist_info.license_plate | ellipsis }}
                                        </span>
                                    </el-tooltip>
                                </div>
                            </div>
                            <div class="table-td">
                                <div class="td-item">
                                    <el-tooltip :content="carlist_info.car_frame" placement="top">
                                        <span class="car-type-name">
                                            {{ carlist_info.car_frame | ellipsisCarFrame }}
                                        </span>
                                    </el-tooltip>
                                </div>
                            </div>
                            <div class="table-td">
                                <div class="td-item">
                                    {{ carlist_info.bind_type == '1' ? '个人' : '企业' }}
                                </div>
                            </div>
                            <div class="table-td">
                                <div class="td-item">
                                    {{ carlist_info.bind_type == '2' ? carlist_info.bind_name : '--' }}
                                </div>
                            </div>
                            <div class="table-td">
                                <div class="td-item">
                                    {{ carlist_info.car_type == '1' ? '运营车' : '私家车' }}
                                </div>
                            </div>
                            <div class="table-td table-column__2">
                                <el-tooltip v-if="carlist_info.bind_type !== '2' && role_type !== '2'" content="个人车辆不可操作" placement="top">
                                    <div :class="['knob', 'knob-forbid']"></div>
                                </el-tooltip>
                                <div v-else :class="['knob', carlist_info.plug_status === '1' ? 'started' : '']" @click="updateStatus(carlist_info)"></div>
                                <div class="knob-text">
                                    {{ carlist_info.plug_status === '1' ? '开启' : '关闭' }}
                                </div>
                            </div>

                            <div class="table-td">
                                <div
                                    style="width: 72px; height: 30px; border-radius: 3px; line-height: 30px; font-size: 12px; color: white"
                                    :class="['td-item', carlist_info.status == '2' ? 'btn_already' : carlist_info.status == '1' ? 'btn_unfinish' : 'btn-word']"
                                    @click="changeStatus(carlist_info, index)"
                                >
                                    {{ carlist_info.status == '2' ? '已审核' : carlist_info.status == '1' ? '审核' : '--' }}
                                </div>
                            </div>
                            <div class="table-td table-operate">
                                <!-- 不能编辑的时候图标置灰 -->
                                <!-- :class="['td-item edit-icon',carlist_info.platform_type == '2' ? 'edit-icon-disable' : (carlist_info.plug_status == '1' ? 'edit-icon-disable' : '')]" -->
                                <el-tooltip v-if="carlist_info.platform_type == '2' ? false : carlist_info.plug_status == '1' ? false : true" :disabled="carlist_info.platform_type == '2' ? true : carlist_info.plug_status == '1' ? true : false" content="编辑" placement="top">
                                    <router-link
                                        :to="
                                            carlist_info.platform_type == '2'
                                                ? ''
                                                : carlist_info.plug_status == '1'
                                                ? ''
                                                : {
                                                      path: '/vehicle/car/addcar',
                                                      query: { id: `${carlist_info.id}` },
                                                  }
                                        "
                                        :class="['td-item', carlist_info.platform_type == '2' ? '' : carlist_info.plug_status == '1' ? '' : 'edit-icon']"
                                    >
                                        {{ carlist_info.platform_type == '2' ? '--' : carlist_info.plug_status == '1' ? '--' : '' }}
                                    </router-link>
                                </el-tooltip>
                                <!-- 不能删除的时候图标置灰 -->
                                <!-- :class="['td-item delete-icon',carlist_info.platform_type == '2' ? 'delete-icon-disable' : (carlist_info.plug_status == '1' ? 'delete-icon-disable' : '')]" -->
                                <el-tooltip v-if="carlist_info.platform_type == '2' ? false : carlist_info.plug_status == '1' ? false : true" :disabled="carlist_info.platform_type == '2' ? true : carlist_info.plug_status == '1' ? true : false" content="删除" placement="top">
                                    <div :class="['td-item', carlist_info.platform_type == '2' ? '' : carlist_info.plug_status == '1' ? '' : 'delete-icon']" @click="delItem(carlist_info.id, index, carlist_info.platform_type, carlist_info.plug_status)">
                                        {{ carlist_info.platform_type == '2' ? '--' : carlist_info.plug_status == '1' ? '--' : '' }}
                                    </div>
                                </el-tooltip>
                                <div class="td-item" v-if="carlist_info.platform_type == '2' ? true : carlist_info.plug_status == '1' ? true : false">--</div>
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
        <!-- 删除 -->
        <sf-modelBox :showModel.sync="showDelete" title="删除确认" type="delete" @change="saveDeleteSure">
            <p>确认要删除此车辆吗？</p>
        </sf-modelBox>
        <sf-messageBox :showModel.sync="showProcessImport" title="温馨提示">
            <div class="import-process">
                <el-progress :show-text="false" :percentage="percentage" :color="customColor"></el-progress>
            </div>
            <div class="import-word">列表正在导入，请稍等......</div>
        </sf-messageBox>
        <sf-messageBox :showModel.sync="showProcessImportSuccess">
            <div class="import-result-img">
                <div>
                    <img src="../../assets/img/user-import.png" alt />
                </div>
                <div>
                    <p>导入结束</p>
                </div>
            </div>
            <div class="import-result-word">
                <span class="import-common-word">导入数据</span>
                <span class="import-word">&nbsp;{{ importWord }}&nbsp;</span>
                <span class="import-common-word">条，导入成功</span>
                <span class="import-word">&nbsp;{{ importWordSuccess }}&nbsp;</span>
                <span class="import-common-word">条</span>
                <span class="import-common-word" v-if="importWordFail != 0">，导入失败</span>
                <span v-if="importWordFail != 0" class="import-word" style="color: #ff6632">&nbsp;{{ importWordFail }}&nbsp;</span>
                <span v-if="importWordFail != 0" class="import-common-word">条</span>
            </div>
            <div v-if="importWordFail != 0" class="import-error">
                <a :href="`${this.ENV}/vhm/get-error`">点击查看详细信息 ></a>
            </div>
            <div class="box-bottom clearfix import-sure">
                <div class="btn_succ" @click="importSure">确认</div>
            </div>
        </sf-messageBox>
        <!-- 查看权限 -->
        <!-- <sf-messageBox class="permission-box" :showModel.sync="showPermission" title="优惠券使用权限">
      <div class="box-name">可用充电站：</div>
      <div class="box-main scrollBar">{{available_stations}}</div>
    </sf-messageBox>-->
        <!-- 弹框 -->
        <sf-modelBox :type="btnType ? 'close' : 'succ'" :showModel.sync="showUpdateModel" :title="plugConfirmText" @change="updateList">
            <p :class="btnType && 'ele-red'">{{ plugStatusText }}</p>
        </sf-modelBox>
    </section>
</template>

<script>
export default {
    data() {
        return {
            search_content: '', //搜索的关键字
            ENV: process.env.NODE_ENV == 'development' ? '/api' : '',
            //批量导入进度条
            showProcessImport: false, //是否显示进度条
            showProcessImportSuccess: false, //导入结束无失败
            importWord: '2',
            importWordSuccess: '1',
            importWordFail: '1',
            percentage: 0,
            customColor: this.$store.state.app.customColor,
            showUpdateModel: false,
            checkboxAll: false,
            plugStatusText: '',
            plugConfirmText: '',
            btnType: 0,
            plug_status: '',
            choiceLists: [], //选中的数据
            companyList: [], //企业名称列表
            role_type: '', //角色类型，2=大客户
            modelObj: {
                search: '',
                bind_type: 'all',
                company_id: '',
                car_type: 'all',
                status: 'all',
                page: '',
                limit: '10',
                search_type: '1',
            },
            currentPage: 1,
            page_count: 1,
            tableData: [],
            listLoading: false,
            showDelete: false,
            showPermission: false,
            available_stations: '',
            delete_id: '',
            import_flag: 1,
        }
    },
    created() {
        this.getTableDataList()
        this.getCompanyDataList()
    },
    computed: {
        isShowAll() {
            const lists = this.tableData.filter(item => item.bind_type === '2')
            if (!lists.length) return true
            return false
        },
    },

    filters: {
        ellipsis(value) {
            if (!value) return '--'
            if (value.length > 10) {
                return value.slice(0, 10) + '...'
            }
            return value
        },
        ellipsisCarFrame(value) {
            if (!value) return '--'
            if (value.length > 10) {
                return value.slice(0, 18) + '...'
            }
            return value
        },
    },
    methods: {
        importSure() {
            this.showProcessImportSuccess = false
        },
        importFile() {},
        beforeUpload(file) {
            if (this.import_flag != 1) {
                this.$sfMessage.error('抱歉，当前用户没有操作权限')
                return false
            }
            this.showProcessImport = true
            const extension = file.name.split('.')[1] === 'xls'
            const extension2 = file.name.split('.')[1] === 'xlsx'
            const isLt2M = file.size / 1024 / 1024 < 2
            if (!extension && !extension2) {
                this.$message.warning('上传模板只能是 xls、xlsx格式!')
                return
            }
            if (!isLt2M) {
                this.$message.warning('上传模板大小不能超过 2M!')
                return
            }
            return true // 返回false不会自动上传
        },
        importVhm(res) {
            if (this.percentage == 100) {
                if (res.code == 1) {
                    this.showProcessImport = false
                    this.showProcessImportSuccess = true
                    this.importWord = res.data.total
                    this.importWordSuccess = res.data.succ
                    this.importWordFail = res.data.fail
                }
            }
        },
        //弹窗显示隐藏
        changeModel: function (plug_status) {
            this.plug_status = plug_status
            if (plug_status == 1) {
                this.plugStatusText = '是否开启所有选中车辆的即插即充功能? '
                this.plugConfirmText = '确认开启'
                this.btnType = 0
            } else {
                this.plugStatusText = '是否关闭所有选中车辆的即插即充功能? '
                this.plugConfirmText = '确认关闭'
                this.btnType = 1
            }
            if (this.choiceLists.length > 0) this.showUpdateModel = true
        },
        //全选
        handleCheckedAll: function () {
            if (this.checkboxAll) {
                this.choiceLists = []
                this.checkboxAll = false
            } else {
                let idSns = []
                if (this.role_type === '2') {
                    idSns = this.tableData.map(list => list.id)
                } else {
                    const isChoiceLists = this.tableData.filter(item => item.bind_type === '2')
                    idSns = isChoiceLists.map(list => list.id)
                }
                if (idSns && idSns.length) {
                    this.choiceLists = idSns
                    this.checkboxAll = true
                }
            }
        },

        //单条选中
        handleChecked: function (code) {
            const lists = this.choiceLists
            const index = lists.indexOf(code)
            let idSns = []
            if (this.role_type === '2') {
                idSns = this.tableData.map(list => list.id)
            } else {
                const findLists = this.tableData.filter(item => item.bind_type === '2')
                idSns = findLists.map(list => list.id)
            }
            if (index > -1) {
                lists.splice(index, 1)
            } else {
                lists.push(code)
            }

            this.checkboxAll = lists.length == idSns.length || false
        },

        //进度条导入进度
        format(percentage) {
            return percentage === 100 ? '满' : `${percentage}%`
        },
        progressUpload(event) {
            this.percentage = event.percent
            if (this.percentage >= 100) {
                this.percentage = 100
                let a = setTimeout(() => {
                    clearTimeout(a)
                }, 500)
            }
        },
        getTableDataList() {
            this.checkboxAll = false
            this.listLoading = true
            this.modelObj.search = this.search_content
            this.modelObj.page = String(this.currentPage)
            if (this.modelObj.bind_type != '2') {
                this.modelObj.company_id = ''
            }
            this.$api.getVehicleList(this.modelObj).then(data => {
                this.listLoading = false
                if (data.code == 1) {
                    this.import_flag = data.data.is_import
                    this.tableData = data.data.list
                    this.currentPage = data.data.current_page
                    this.page_count = data.data.page_total
                    this.role_type = data.data.role_type
                }
            })
        },

        //单个修改即插即充的状态
        updateStatus(item) {
            const id = item.id
            let plug_status = item.plug_status
            console.log('plug_status1:' + plug_status)
            if (plug_status == 1) {
                plug_status = 0
            } else {
                plug_status = 1
            }

            this.barthUpdate(id, plug_status)
        },
        //一键开启即插即充
        updateList: function () {
            const ids = this.choiceLists.join(',')
            this.barthUpdate(ids, this.plug_status)
        },
        barthUpdate: function (ids, plug_status) {
            if (!ids) {
                this.$sfNotify({
                    duration: 3000,
                    type: 'error',
                    message: '请选择后操作',
                })
                return
            }
            console.log(ids)
            this.$api
                .vehicleBarthUpdate({ ids: ids, plug_status: plug_status })
                .then(res => {
                    if (res.code === 1) {
                        this.$sfNotify({
                            message: '成功',
                        })
                        this.getTableDataList()
                        this.currentPage = 1
                        this.choiceLists = []
                        this.checkboxAll = false
                        this.showUpdateModel = false
                    } else {
                        this.$sfNotify({
                            duration: 0,
                            type: 'error',
                            message: res.message,
                        })
                    }
                })
                .catch(error => {
                    console.error(error)
                })
        },
        getCompanyDataList() {
            this.$api.getCompanyList().then(data => {
                this.listLoading = false
                if (data.code == 1) {
                    this.companyList = data.data
                }
            })
        },
        // 点击分页触发
        handleCurrentChange(page) {
            this.currentPage = page
            this.choiceLists = []
            this.getTableDataList()
        },
        changeStatus(item, index) {
            if (item.status == 1) {
                this.$api.editVehicleStatus({ id: item.id }).then(data => {
                    if (data.code == 1) {
                        this.$sfNotify({
                            message: '成功',
                        })
                        this.getTableDataList()
                    } else {
                        this.$sfNotify({
                            duration: 0,
                            type: 'error',
                            message: '失败',
                        })
                    }
                })
            }
        },

        delItem(id, index, status, plug_status) {
            if (status != '2' && plug_status != '1') {
                this.delete_id = id
                this.showDelete = true
            }
        },
        searchVehicle() {
            this.currentPage = 1
            this.getTableDataList()
        },
        resetSearch() {
            ;(this.modelObj = {
                search: '',
                bind_type: 'all',
                company_id: '',
                car_type: 'all',
                status: 'all',
                page: '',
                limit: '10',
            }),
                (this.currentPage = 1)
            this.search_content = ''
            this.page_count = 1
            this.checkboxAll = false
            this.choiceLists = []
            this.getTableDataList()
        },
        saveDeleteSure() {
            this.$api.deleteVehicleList({ id: this.delete_id }).then(data => {
                this.showDelete = false
                if (data.code == 1) {
                    this.$sfNotify({
                        message: '成功',
                    })
                    setTimeout(this.getTableDataList, 1500)
                } else {
                    this.$sfNotify({
                        duration: 0,
                        type: 'error',
                        message: '失败',
                    })
                }
            })
        },
    },
}
</script>

<style lang="scss" scoped>
@import '../../assets/css/vehicle/carManager.scss';
</style>
