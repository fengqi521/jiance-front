<template>
  <section class="section-ota-update">
    <div class="section-title">
      <router-link to="/device/ota">OTA管理</router-link> > 升级
    </div>
    <!-- 搜索条件 -->
    <div class="section-search">
      <div class="section-item-header clearfix"><span>筛选查询</span></div>
      <div class="header-content clearfix">
        <div class="content-item">
          <div class="header-left">充电桩编号</div>
          <div class="header-right">
            <el-input
                    class="search-input"
                    v-model="searchData.pile_sn"
                    placeholder="输入充电桩编号"
            />
          </div>
        </div>
        <div class="content-item">
          <div class="header-left">充电桩类型</div>
          <div class="header-right">
            <el-select v-model="searchData.pile_type">
              <el-option label="全部" value="0" />
              <el-option label="直流" value="1" />
              <el-option label="交流" value="2" />
            </el-select>
          </div>
        </div>
        <div class="content-item">
          <div class="header-left">所属充电站：</div>
          <div class="header-right">
            <el-select v-model="searchData.station_id">
              <el-option
                      v-for="(item, index) in all_stations"
                      :key="index"
                      style="width: 148px"
                      :label="item.station_name"
                      :value="item.station_id"
              />
            </el-select>
          </div>
        </div>
        <div class="content-item">
          <div class="header-left">在线状态</div>
          <div class="header-right">
            <el-select v-model="searchData.online_status">
              <el-option label="全部" value="" />
              <el-option label="在线" value="1" />
              <el-option label="离线" value="2" />
            </el-select>
          </div>
        </div>
        <div class="content-item">
          <div class="btn_succ" @click="getUpdateLists(1)">查询</div>
          <div class="btn_cancel" @click="resetSearchData()">重置</div>
        </div>
      </div>
    </div>
    <!-- table表格 -->
    <div class="section-container">
      <div class="section-item-header clearfix">
        <span>升级列表</span>
        <div class="btn_recovery update-equipment" @click="changeModel()">
          一键升级选中的设备
        </div>
      </div>
      <div class="section-main">
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td">
              <span
                      class="checkbox-icon"
                      :class="{ 'checkbox-act-icon': checkboxAll }"
                      @click="handleCheckedAll"
              ></span>
            </div>
            <div class="table-td">充电桩名称</div>
            <div class="table-td">充电桩编号</div>
            <div class="table-td">在线状态</div>
            <div class="table-td">最近升级时间</div>
            <div class="table-td">充电桩类型</div>
            <div class="table-td">所属充电站</div>
            <div class="table-td">升级状态</div>
            <div class="table-td">固件名称</div>
            <div class="table-td">固件版本</div>
            <div class="table-td">升级设备</div>
          </div>
          <div class="table-body" v-loading="listLoading">
            <div
                    class="table-tr"
                    :class="{
                offline: fault.online_status === pileStatus['offline_status'],
              }"
                    v-show="updateLists && updateLists.length"
                    v-for="(fault, index) in updateLists"
                    :key="index"
            >
              <div class="table-td">
                <i
                        class="checkbox-icon"
                        :class="{
                    'checkbox-disabled-icon':
                      fault.ota_status != pileStatus['isnot_ota_status'] ||
                      fault.online_status === pileStatus['offline_status'] ||
                      fault.is_recharge === pileStatus['is_recharge'],
                    'checkbox-act-icon':
                      choiceLists.indexOf(fault.pile_sn) > -1,
                  }"
                        @click="handleChecked(fault.pile_sn)"
                ></i>
              </div>
              <div class="table-td">
                <div class="td-item">
                  {{ fault.pile_name ? fault.pile_name : "--" }}
                </div>
              </div>
              <div class="table-td">
                <div class="td-item">
                  {{ fault.pile_sn ? fault.pile_sn : "--" }}
                </div>
              </div>
              <div class="table-td ">
                <div
                        class="td-item"
                        :class="
                  (fault.online_status == pileStatus['online_status'])
                ? 'section-running'
                : 'offline'"
                >
                  {{
                  (fault.online_status == pileStatus["online_status"])
                  ? "在线"
                  : "离线"
                  }}
                </div>
              </div>
              <div class="table-td">
                <div class="td-item td-time">
                  {{ fault.ota_update_time ? fault.ota_update_time : "--" }}
                </div>
              </div>
              <div class="table-td">
                <div class="td-item td-time">
                  {{ fault.pile_type_text ? fault.pile_type_text : "--" }}
                </div>
              </div>
              <div class="table-td">
                <div class="td-item td-time">
                  {{ fault.station_text ? fault.station_text : "--" }}
                </div>
              </div>
              <div class="table-td">
                <div
                        class="td-item"
                        :class="{
                    'section-no-begin': fault.ota_status_text === '失败',
                    'offline-error':
                      fault.ota_status_text === '失败' &&
                      fault.online_status === pileStatus['offline_status'],
                    'section-running': fault.ota_status == pileStatus['ota_status'],
                  }"
                >
                  {{ fault.ota_status_text ? fault.ota_status_text : "--" }}
                </div>
              </div>
              <div class="table-td">
                <div class="td-item">
                  {{ fault.pkgname ? fault.pkgname : "--" }}
                </div>
              </div>
              <div class="table-td">
                <div class="td-item">
                  {{ fault.ota_bin_ver ? fault.ota_bin_ver : "--" }}
                </div>
              </div>
              <div class="table-td">
                <el-tooltip
                        :content="
                    (fault.ota_status != pileStatus['isnot_ota_status'] &&
                      '该设备升级中') ||
                    (fault.online_status === pileStatus['offline_status'] &&
                      '该设备离线') ||
                    (fault.is_recharge === pileStatus['is_recharge'] &&
                      '该设备正在充电中')
                  "
                        placement="top"
                        v-if="
                    fault.ota_status != pileStatus['isnot_ota_status'] ||
                    fault.online_status === pileStatus['offline_status'] ||
                    fault.is_recharge === pileStatus['is_recharge']
                  "
                >
                  <div
                          class="td-item btn_already "
                          style="width: 72px; height: 30px; border-radius: 3px; line-height: 30px; font-size: 12px;"
                  >升级</div>
                </el-tooltip>
                <div
                        v-else
                        class="td-item  btn_unfinish "
                        style="width: 72px; height: 30px; border-radius: 3px; line-height: 30px; font-size: 12px;"
                        @click="changeModel(fault.pile_sn)"
                >
                  升级
                </div>
              </div>
            </div>
            <div
                    class="table-tr unData"
                    v-if="!updateLists || updateLists.length === 0"
            >
              <img :src="require('assets/img/unData.png')" />
              <span>暂无数据</span>
            </div>
          </div>
          <!-- 分页 -->
          <sf-pagination
                  v-show="updateLists && updateLists.length"
                  :currentPage="currentPage"
                  :page-count="pageTotal"
                  @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
    <!-- 弹框 -->
    <sf-modelBox
            :showModel.sync="showUpdateModel"
            title="确认升级"
            @change="updateList"
    >
      <p>是否确认升级{{ (type && "该") || "选中的" }}设备？</p>
    </sf-modelBox>
  </section>
</template>
<script>
  export default {
    data() {
      this.pileStatus = {
        ota_status: 0, //设备升级中
        isnot_ota_status: 1, //设备非升级中
        online_status: "1", //设备在线
        offline_status: "2", //设备离线
        isnot_recharge: 0, //空闲
        is_recharge: 1, //充电中
      };
      return {
        searchData: {
          //搜索条件
          pile_sn: "",
          online_status: "",
          pile_type: "0",
          station_id: "0",
        },
        all_stations: [{ station_name: "全部", station_id: "0" }],
        showUpdateModel: false,
        checkboxAll: false,
        listLoading: false,
        choiceLists: [], //选中的数据
        updateLists: [], //升级列表
        currentPage: 1, //当前页
        pageTotal: 1, //总页数
        ota_name: this.$route.query.ota_name ? this.$route.query.ota_name : "",
        timer: null,
        type: "",
      };
    },
    created() {
      this.getAllStation();
      this.getUpdateLists();
    },
    watch: {
      type: function () {
        if (this.choiceLists.length > 1) return "";
      },
    },
    methods: {
      // 所属充电站列表
      getAllStation() {
        this.$api.pileAgentStation({source: 1}).then((data) => {
          if (data.code == 1) {
            this.all_stations = this.all_stations.concat(data.data);
          }
        });
      },
      //获取升级列表
      getUpdateLists: function (page) {
        this.listLoading = true;
        this.choiceLists = [];
        this.checkboxAll = false;
        if (page) this.currentPage = page;
        const params = Object.assign({}, this.searchData, {
          page: this.currentPage,
          ota_name: this.ota_name,
        });
        this.$api
                .getUpdateListData(params)
                .then((res) => {
                  this.listLoading = false;
                  if (res.code === 1) {
                    if (this.timer) clearInterval(this.timer);
                    let {
                      data: { current_page, list = [], page_total },
                    } = res;
                    this.updateLists = list;
                    this.currentPage = current_page;
                    this.pageTotal = page_total;
                    const omitList = list.filter(
                            (item) => item.ota_status == this.pileStatus["ota_status"]
                    );
                    if (omitList.length) this.getUpdateStatus();
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
                  this.listLoading = false;
                });
      },

      //轮询获取桩升级状态
      getUpdateStatus: function () {
        const updateData = this.updateLists;
        this.timer = setInterval(() => {
          const omitList = updateData.filter(
                  (item) => item.ota_status == this.pileStatus["ota_status"]
          );
          const pile_sns = omitList.map((list) => list.pile_sn);
          if (!pile_sns.length) {
            clearInterval(this.timer);
            return;
          }
          this.$api
                  .getUpdateStatusData({ pile_sns: pile_sns && pile_sns.join(",") })
                  .then((res) => {
                    const { code, data = [] } = res;
                    if (code === 1) {
                      updateData.forEach((item) => {
                        const list = data.filter(
                                (resItem) => item.pile_sn === resItem.pile_sn
                        );
                        if (list && list.length) {
                          item.ota_status = list[0].ota_status;
                          item.ota_status_text = list[0].ota_status_text;
                          item.end_desc = list[0].end_desc;
                          item.ota_update_time = list[0].ota_update_time;
                        }
                      });
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
                  });
        }, 4000);
        this.$once("hook:beforeDestroy", () => {
          clearInterval(this.timer);
        });
      },

      //重置搜索条件
      resetSearchData: function () {
        this.searchData = {
          //搜索条件
          pile_sn: "",
          online_status: "",
          pile_type: "0",
          station_id: "0",
        };
        this.currentPage = 1;
        this.pageTotal = 1;
        this.choiceLists = [];
        this.checkboxAll = false;
        this.getUpdateLists();
      },

      //弹窗显示隐藏
      changeModel: function (type) {
        if (type) {
          this.choiceLists = [type];
          const _updateLists = this.updateLists.filter(
                  (list) =>
                          list.ota_status == this.pileStatus["isnot_ota_status"] &&
                          list.online_status === this.pileStatus["online_status"] &&
                          list.is_recharge === this.pileStatus["isnot_recharge"]
          );
          if (_updateLists.length < 2) {
            this.checkboxAll = true;
          } else {
            this.checkboxAll = false;
          }
          this.type = type;
        } else {
          this.type = "";
        }
        if (this.choiceLists.length > 0) this.showUpdateModel = true;
      },

      //数据升级
      updateList: function () {
        const _updateLists = this.updateLists;
        const pile_sns = this.choiceLists.join(",");
        _updateLists.forEach((item) => {
          const { pile_sn } = item;
          if (this.choiceLists.indexOf(pile_sn) > -1) {
            item.ota_status_text = "0%";
            item.ota_status = "0";
          }
        });

        this.$api
                .updatePileData({ pile_sns, ota_name: this.ota_name })
                .then((res) => {
                  if (res.code === 1) {
                    this.$sfNotify({
                      message: "成功",
                    });
                    this.getUpdateLists();
                    this.currentPage = 1;
                    this.choiceLists = [];
                    this.checkboxAll = false;
                    this.showUpdateModel = false;
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
                });
      },

      //全选
      handleCheckedAll: function () {
        const lists = this.choiceLists;
        this.type = "";
        const _updateLists = this.updateLists.filter(
                (list) =>
                        list.ota_status == this.pileStatus["isnot_ota_status"] &&
                        list.online_status === this.pileStatus["online_status"] &&
                        list.is_recharge === this.pileStatus["isnot_recharge"]
        );
        if (lists.length === _updateLists.length) {
          this.choiceLists = [];
          this.checkboxAll = false;
        } else {
          const pileSns =
                  _updateLists && _updateLists.map((list) => list.pile_sn);
          if (pileSns && pileSns.length) {
            this.choiceLists = pileSns;
            this.checkboxAll = true;
          }
        }
      },

      //单条选中
      handleChecked: function (code) {
        const lists = this.choiceLists;
        const index = lists.indexOf(code);
        const _updateLists = this.updateLists.filter(
                (list) =>
                        list.ota_status == this.pileStatus["isnot_ota_status"] &&
                        list.online_status === this.pileStatus["online_status"] &&
                        list.is_recharge === this.pileStatus["isnot_recharge"]
        );
        if (index > -1) {
          lists.splice(index, 1);
        } else {
          lists.push(code);
        }
        this.checkboxAll = lists.length == _updateLists.length || false;
      },

      //分页切换
      handleCurrentChange: function (page) {
        this.currentPage = page;
        this.checkboxAll = false;
        this.choiceLists = [];
        this.getUpdateLists();
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import "../../assets/css/device/otaManageUpdate.scss";
</style>
