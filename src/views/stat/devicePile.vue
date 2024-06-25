<template>
    <section>
        <div class="section-title">充电桩管理</div>
        <div class="section-header">
            <div class="section-item-header clearfix">
                <span>筛选查询</span>
            </div>
            <div class="header-content clearfix">
                <div class="content-item">
                    <div class="header-left">充电桩编号</div>
                    <div class="header-right">
                        <el-input class="search-input" v-model="modelObj.pile_sn" placeholder="输入充电桩编号" />
                    </div>
                </div>
                <div class="content-item">
                    <div class="header-left">充电桩类型</div>
                    <div class="header-right">
                        <el-select v-model="modelObj.pile_type">
                            <el-option label="全部" value="0" />
                            <el-option label="直流桩" value="1" />
                            <el-option label="交流桩" value="2" />
                        </el-select>
                    </div>
                </div>
                <div class="content-item">
                    <div class="header-left">所属充电站：</div>
                    <div class="header-right">
                        <el-select v-model="modelObj.station_id">
                            <el-option v-for="(item, index) in all_stations" :key="index" style="width: 148px" :label="item.station_name" :value="item.station_id" />
                        </el-select>
                    </div>
                </div>
                <div class="content-item">
                    <div class="header-left">在线状态：</div>
                    <div class="header-right">
                        <el-select v-model="modelObj.online_status">
                            <el-option label="全部" value="0" />
                            <el-option label="在线" value="1" />
                            <el-option label="离线" value="2" />
                        </el-select>
                    </div>
                </div>
                <div class="content-item">
                    <div class="btn_succ" @click="searchPile()">查询</div>
                    <div class="btn_cancel" @click="resetSearch()">重置</div>
                </div>
            </div>
        </div>
        <div class="section-container">
            <div class="section-item-header clearfix">
                <span>充电桩列表</span>
            </div>

            <div class="section-main">
                <div class="table">
                    <div class="table-th clearfix">
                        <div class="table-td table-name">充电桩名称</div>
                        <div class="table-td table-name">充电桩编号</div>
                        <div class="table-td">充电桩类型</div>
                        <div class="table-td">充电口数量</div>
                        <div class="table-td">是否支持即插即充</div>
                        <div class="table-td table-name">所属充电站</div>
                        <div class="table-td">在线状态</div>
                        <div class="table-td">
                            营收（元）
                            <el-tooltip content="实际营收：截止到10分钟前" placement="top">
                                <div class="tips-icon"></div>
                            </el-tooltip>
                        </div>
                        <div class="table-td">操作</div>
                    </div>
                    <div class="table-body" v-loading="listLoading">
                        <div class="table-tr" v-show="tableData && tableData.length" v-for="(pile, index) in tableData" :key="index">
                            <div class="table-td table-name">
                                <el-tooltip :content="pile.pile_name" placement="top">
                                    <div class="td-item">
                                        {{ pile.pile_name | ellipsis }}
                                    </div>
                                </el-tooltip>
                            </div>
                            <div class="table-td table-name">
                                <div class="td-item">{{ pile.pile_sn }}</div>
                            </div>

                            <div class="table-td">
                                <div class="td-item">{{ pile_type_array[pile.pile_type] }}</div>
                            </div>
                            <div class="table-td">
                                <div class="td-item">{{ pile.charging_ports }}</div>
                            </div>
                            <div class="table-td">
                                <div class="td-item" :class="{ 'section-no-begin': pile.plug_status != '1' }">
                                    {{ pile.plug_status == '1' ? '是' : '否' }}
                                </div>
                            </div>
                            <div class="table-td table-name">
                                <el-tooltip :content="pile.station_name" placement="top">
                                    <div class="td-item">
                                        {{ pile.station_name | ellipsis }}
                                    </div>
                                </el-tooltip>
                            </div>
                            <div class="table-td table-status">
                                <div class="td-item" v-if="pile.online_status == 2">
                                    <i></i>
                                    {{ online_status_array[pile.online_status] }}
                                </div>
                                <div class="td-item td-online" v-if="pile.online_status == 1">
                                    <i></i>
                                    {{ online_status_array[pile.online_status] }}
                                </div>
                            </div>
                            <div class="table-td">
                                <div class="td-item">{{ pile.real_total }}</div>
                            </div>
                            <!--
              <div class="table-td table-status">
                <div
                  class="td-item td-fault"
                  v-if="pile.run_status == 4"
                >{{ run_status_array[pile.run_status] }}</div>
                <div
                  class="td-item"
                  v-else
                >{{ run_status_array[pile.run_status] }}</div>
              </div>
              -->
                            <div class="table-td table-operate">
                                <el-tooltip content="查看" placement="top">
                                    <router-link target="_blank" :to="`/stat/device/pile/detail/${pile.id}?title=${title}&operator_id=${operator_id}`" class="td-item see-icon"></router-link>
                                </el-tooltip>
                            </div>
                        </div>
                        <div class="table-tr unData" v-if="!tableData || tableData.length === 0">
                            <img :src="require('assets/img/unData.png')" />
                            <span>暂无数据</span>
                        </div>
                    </div>
                    <!-- 分页 -->
                    <sf-pagination v-show="tableData && tableData.length" :currentPage="currentPage" :page-count="page_count" @current-change="handleCurrentChange" />
                </div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    data() {
        this.title = (this.$route.query && this.$route.query.title) || ''
        const operator_id = (this.$route.query && this.$route.query.operator_id) || ''
        return {
            operator_id,
            modelObj: {
                pile_sn: '',
                pile_type: '0',
                station_id: '0',
                online_status: '0',
                run_status: '-1',
                operator_id,
            },
            currentPage: 1,
            page_count: 1,
            listLoading: false,
            tableData: [],
            pile_type_array: {
                1: '直流',
                2: '交流',
                3: '交直流一体',
                4: '无线设备',
                5: '其它',
            },
            online_status_array: {
                1: '在线',
                2: '离线',
            },
            run_status_array: {
                0: '空闲',
                1: '准备充电',
                2: '充电中',
                3: '充电结束',
                4: '故障',
                5: '预约',
            },
            all_stations: [{ station_name: '全部', station_id: '0' }],
            //上传文件的名称
            upload_file_origin_name: '',
            upload_file_save_name: '',

            ENV: process.env.NODE_ENV == 'development' ? '/api' : '',
        }
    },
    created() {
        this.getAllStation()
        this.getTableDataList()
    },
    filters: {
        ellipsis(value) {
            if (!value) return '--'
            if (value.length > 22) {
                return value.slice(0, 21) + '...'
            }
            return value
        },
    },
    methods: {
        getAllStation() {
            this.$api.pileAgentStation({ operator_id: this.operator_id }).then(data => {
                if (data.code == 1) {
                    this.all_stations = this.all_stations.concat(data.data)
                }
            })
        },
        getTableDataList() {
            this.listLoading = true
            this.modelObj.page = this.currentPage
            this.$api.piles(this.modelObj).then(data => {
                this.listLoading = false
                if (data.code == 1) {
                    this.tableData = data.data.list
                    this.currentPage = data.data.current_page
                    this.page_count = data.data.page_total
                }
            })
        },
        searchPile() {
            this.currentPage = 1
            this.tableData = []
            this.getTableDataList()
        },
        resetSearch() {
            this.modelObj.pile_sn = ''
            this.modelObj.pile_type = '0'
            this.modelObj.station_id = '0'
            this.modelObj.online_status = '0'
            this.modelObj.run_status = '-1'
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

        // //导入充电桩的按钮
        // importChargingPile(){
        //   console.log(this.import_flag);
        //   this.showImportWhite = true;
        //   this.upload_file_save_name = "";
        //   this.upload_file_origin_name = "";
        // },
    },
}
</script>
<style lang="scss" scoped>
@import '../../assets/css/device/pile.scss';
</style>
