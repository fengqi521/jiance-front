<template>
    <section>
        <div class="section-title">设备授权数管理</div>
        <div class="section-amount">
            <div class="amount-left">
                <i class="basic-icon"></i>
                <p class="version-text">{{ type == '0' ? '基础版' : '高级版本' }}</p>
                <p class="version-number">版本号：{{ version }}</p>
            </div>
            <div class="amount-right">
                <div class="amount-item-inner clearfix">
                    <div class="amount-item">
                        <div class="amount-item-title">最大授权设备数量</div>
                        <p class="amount-item-text">
                            <span class="section-running">{{ maxdev_count }}</span>台
                        </p>
                    </div>
                    <div class="amount-item">
                        <div class="amount-item-title">现有启用设备数量</div>
                        <p class="amount-item-text">
                            <span>{{ curdev_count }}</span>台
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="section-container">
            <div class="section-item-header clearfix">
                <span>授权列表</span>
            </div>
            <div class="section-main">
                <div class="table">
                    <div class="table-th clearfix">
                        <div class="table-td table-column__1">授权码</div>
                        <div class="table-td table-column__1">过期时间</div>
                        <div class="table-td table-column__2" style="min-width:200px;">授权数量</div>
                        <div class="table-td table-column__2">使用时间</div>
                        <div class="table-td table-column__2">使用状态</div>
                    </div>
                    <div class="table-body" v-loading="listLoading">
                        <div class="table-tr" v-show="tableData && tableData.length" v-for="(asset, index) in tableData"
                            :key="index">
                            <div class="table-td table-column__1">
                                <sf-tooltip v-if="asset.code" popperClass="code-popper" :content="asset.code"
                                    placement="top" :line="3" :maxHeight="71">
                                    <div class="td-item mul_ellipsis_3">{{ asset.code }}</div>
                                </sf-tooltip>
                                <div class="td-item" v-else>初始赠送</div>
                            </div>
                            <div class="table-td table-column__1">
                                <div class="td-item">{{ asset.end_time ? asset.end_time : '--' }}</div>
                            </div>
                            <div class="table-td table-column__2" style="min-width:200px;">
                                <div class="td-item td-time">
                                    {{ asset.count ? asset.count : '--' }}
                                </div>
                            </div>
                            <div class="table-td table-column__2">
                                <div class="td-item td-time">{{ asset.status == 1 ? asset.active_time : '--' }}</div>
                            </div>
                            <div class="table-td table-column__2">
                                <div class="td-item td-time" v-if="asset.status == 1">已使用</div>
                                <div style="width: 68px; height: 30px; border-radius: 3px; line-height: 30px; font-size: 12px;"
                                    @click="changeExpand(asset.code, asset.expire)"
                                    :class="['td-item ', asset.expire == 1 ? 'td-expire btn_already' : 'td-expire-no btn_unfinish']"
                                    v-else>
                                    <el-tooltip v-if="asset.expire == 1" content="授权码已过期" placement="top">
                                        <div> 扩容</div>
                                    </el-tooltip>
                                    <div v-else>扩容</div>
                                </div>
                            </div>
                        </div>
                        <div class="table-tr unData" v-if="!tableData || tableData.length === 0">
                            <img :src="require('assets/img/unData.png')" />
                            <span>暂无数据</span>
                        </div>
                    </div>
                    <!-- 分页 -->
                    <sf-pagination v-show="tableData && tableData.length" :currentPage="currentPage"
                        :page-count="page_count" @current-change="handleCurrentChange" />
                </div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    data () {
        return {
            maxdev_count: "0",
            curdev_count: "0",
            version: "0",
            type: '',
            modelObj: {},
            currentPage: 1,
            page_count: 1,
            listLoading: false,
            tableData: [],
        };
    },
    created () {
        this.getBasicInfo();
        this.getTableDataList();
    },
    methods: {
        //获取头部基础信息
        getBasicInfo () {
            this.$api.getSystemInfo().then((data) => {
                if (data.code == 1) {
                    this.maxdev_count = data.data.detail.maxdev_count;
                    this.curdev_count = data.data.detail.curdev_count;
                    this.version = data.data.detail.version;
                    this.type = data.data.detail.type;
                }
            });
        },
        //获取列表
        getTableDataList () {
            this.listLoading = true;
            this.modelObj.page = this.currentPage;
            this.$api.getSystemList(this.modelObj).then((data) => {
                this.listLoading = false;
                if (data.code == 1) {
                    this.tableData = data.data.list;
                    this.currentPage = data.data.current_page;
                    this.page_count = data.data.page_total;
                }
            });
        },
        //扩容
        changeExpand (code, expire) {
            if (expire == 1) return;
            this.$api
                .updateSystemAuth({ code })
                .then((data) => {
                    if (data.code == 1) {
                        this.$sfNotify({
                            message: "成功",
                        });
                        this.getBasicInfo();
                        this.getTableDataList()
                    } else {
                        this.$sfNotify({
                            duration: 0,
                            type: "error",
                            message: data.message,
                        });
                    }
                });
        },
        // 点击分页触发
        handleCurrentChange (page) {
            this.currentPage = page;
            this.getTableDataList();
        },
    },
};
</script>
<style lang="scss">
.code-popper.is-dark {
    max-width: 500px;
}
</style>
<style ref="stylesheet/scss" lang="scss" scoped>
@import "../../assets/css/device/asset.scss";
@import "../../assets/css/platform/dev.scss";
</style>
