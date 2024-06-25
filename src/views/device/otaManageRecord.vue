<template>
  <section class="section-ota-record">
    <div class="section-title" v-if="ota_name">
      <router-link to="/device/ota">OTA管理</router-link> > 升级记录
    </div>
    <div class="section-title" v-else>
      <router-link to="/device/asset">资产管理</router-link> > 升级记录
    </div>
    <!-- table表格 -->
    <div class="section-container">
      <div class="section-item-header clearfix">
        <span>升级记录列表</span>
      </div>
      <div class="section-main">
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td table-column__1">升级时间</div>
            <div class="table-td">充电桩名称</div>
            <div class="table-td">充电桩编号</div>
            <div class="table-td">充电桩类型</div>
            <div class="table-td">所属充电站</div>
            <div class="table-td">固件名称</div>
            <div class="table-td">固件版本</div>
            <div class="table-td">升级结果</div>
            <div class="table-td">失败原因</div>
            <div class="table-td">操作人</div>
          </div>
          <div class="table-body" v-loading="recordLoading">
            <div
                    class="table-tr"
                    v-show="recordLists && recordLists.length"
                    v-for="(record, index) in recordLists"
                    :key="index"
            >
              <div class="table-td table-column__1">
                <div class="td-item">
                  {{ record.update_time ? record.update_time : "--" }}
                </div>
              </div>
              <div class="table-td">
                <div class="td-item">
                  {{ record.pile_name ? record.pile_name : "--" }}
                </div>
              </div>
              <div class="table-td">
                <div class="td-item">
                  {{ record.pile_sn ? record.pile_sn : "--" }}
                </div>
              </div>
              <div class="table-td">
                <div class="td-item td-time">
                  {{ record.pile_type_text ? record.pile_type_text : "--" }}
                </div>
              </div>
              <div class="table-td">
                <div class="td-item td-time">
                  {{ record.station_text ? record.station_text : "--" }}
                </div>
              </div>
              <div class="table-td">
                <div class="td-item td-time">
                  {{ record.ota_name ? record.ota_name : "--" }}
                </div>
              </div>
              <div class="table-td">
                <div class="td-item">
                  {{ record.ota_bin_ver ? record.ota_bin_ver : "--" }}
                </div>
              </div>
              <div class="table-td">
                <div class="td-item" :class="{
                'section-no-begin':record&&record.cur_status_text==='失败',
                'section-end':record&&record.cur_status_text==='成功'
                }">
                  {{ record.cur_status_text ? record.cur_status_text : "--" }}
                </div>
              </div>
              <div class="table-td">
                <div class="td-item">
                  {{
                  record.cur_status_text === "成功" ? "--" : record.end_desc
                  }}
                </div>
              </div>
              <div class="table-td">
                {{ record.operator_name ? record.operator_name : "--" }}
              </div>
            </div>
            <div
                    class="table-tr unData"
                    v-if="!recordLists || recordLists.length === 0"
            >
              <img :src="require('assets/img/unData.png')" />
              <span>暂无数据</span>
            </div>
          </div>
          <!-- 分页 -->
          <sf-pagination
                  v-show="recordLists && recordLists.length"
                  :currentPage="currentPage"
                  :page-count="pageTotal"
                  @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    data() {
      return {
        ota_name: this.$route.query.ota_name ? this.$route.query.ota_name : "",
        pile_sn: this.$route.query.pile_sn ? this.$route.query.pile_sn : "",
        recordLoading: false,
        recordLists: [], //记录列表
        currentPage: 1, //当前页
        pageTotal: 1, //总页数
      };
    },
    created() {
      this.getRecordLists();
    },
    methods: {
      //获取升级记录列表
      getRecordLists: function () {
        this.recordLoading = true;
        let params = {};
        if (this.ota_name) {
          params.ota_name = this.ota_name;
        }
        if (this.pile_sn) {
          params.pile_sn = this.pile_sn;
        }
        if (this.currentPage) {
          params.page = this.currentPage;
        }
        this.$api
                .getPileRecordData(params)
                .then((res) => {
                  this.recordLoading = false;
                  if (res.code === 1) {
                    let {
                      data: { current_page, list, page_total },
                    } = res;
                    this.recordLists = list;
                    this.currentPage = current_page;
                    this.pageTotal = page_total;
                  } else {
                    this.$sfNotify({
                      duration: 0,
                      type: "error",
                      message: res.message,
                    });
                  }
                })
                .catch((error) => {
                  console.error(error);
                  this.recordLoading = false;
                });
      },

      //分页切换
      handleCurrentChange: function (page) {
        this.currentPage = page;
        this.getRecordLists();
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import "../../assets/css/device/otaManageRecord.scss";

</style>