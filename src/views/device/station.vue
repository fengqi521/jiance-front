<template>
  <section>
    <div class="section-title">充电站管理</div>
    <div class="section-header">
      <div class="section-item-header clearfix">
        <span>筛选查询</span>
      </div>
      <div class="header-content clearfix">
        <div class="content-item">
          <el-select class="search-type" v-model="modelObj.search_type">
            <el-option label="充电站ID" value="1" />
            <el-option label="充电站名称" value="2" />
            <el-option label="所属运营商" value="3" />
          </el-select>
          <el-input
                  class="search-input"
                  v-model="modelObj.words"
                  placeholder="关键字搜索"
          />
        </div>
        <div class="content-item">
          <div class="header-left">运营状态</div>
          <div class="header-right">
            <el-select v-model="modelObj.station_status">
              <el-option label="全部" value="" />
              <el-option label="建设中" value="1" />
              <el-option label="关闭下线" value="5" />
              <el-option label="维护中" value="6" />
              <el-option label="正常使用" value="50" />
              <el-option label="未知" value="0" />
            </el-select>
          </div>
        </div>
        <div class="content-item">
          <div class="header-left">充电站类型</div>
          <div class="header-right">
            <el-select v-model="modelObj.station_type">
              <el-option label="全部" value="" />
              <el-option label="公共" value="1" />
              <el-option label="个人" value="50" />
              <el-option label="公交（专用）" value="100" />
              <el-option label="环卫（专用）" value="101" />
              <el-option label="物流（专用）" value="102" />
              <el-option label="出租车（专用）" value="103" />
              <el-option label="其他" value="255" />
            </el-select>
          </div>
        </div>
        <div class="content-item">
          <div class="btn_succ" @click="searchStation(false)">查询</div>
          <div class="btn_cancel" @click="searchStation(true)">重置</div>
        </div>
      </div>
    </div>
    <div class="section-container">
      <div class="section-item-header clearfix">
        <span>充电站列表</span>
        <router-link to="/device/station/add" class="btn_succ add-station">
          <img :src="require('assets/img/add-station.png')" />
          添加充电站</router-link
        >
      </div>
      <div class="section-main">
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td">充电站ID</div>
            <div class="table-td">充电站名称</div>
            <div class="table-td">所属区域</div>
            <div class="table-td">充电站类型</div>
            <div class="table-td">所属运营商</div>
            <div class="table-td">交流桩数</div>
            <div class="table-td">直流桩数</div>
            <div class="table-td">运营状态</div>
            <div class="table-td">
              营收（元）
              <el-tooltip content="实际营收：截止到10分钟前" placement="top">
                <div class="tips-icon"></div>
              </el-tooltip>
            </div>
            <div class="table-td">操作</div>
          </div>
          <div class="table-body" v-loading="listLoading">
            <div
                    class="table-tr"
                    v-show="tableData && tableData.length"
                    v-for="(station, index) in tableData"
                    :key="index"
            >
              <div class="table-td table-name">
                <div class="td-item">{{ station.station_id }}</div>
              </div>
              <div class="table-td table-name">
                <el-tooltip :content="station.station_name" placement="top">
                  <div
                          class="td-item"
                  >
                    {{ station.station_name | ellipsis }}
                  </div>
                </el-tooltip>
              </div>
              <div class="table-td table-name">
                <div class="td-item">
                  {{ station.p_name + station.c_name + station.a_name }}
                </div>
              </div>
              <div class="table-td">
                <div class="td-item">
                  {{ station_type_array[station.station_type] }}
                </div>
              </div>
              <div class="table-td table-name">
                <div class="td-item">{{ station.title }}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{ station.alternating }}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{ station.direct }}</div>
              </div>
              <div class="table-td">
                <div
                        :class="[
                    'td-item',
                    station.station_status != 0 && station.station_status != 50
                      ? 'section-no-begin'
                      : 'section-end',
                  ]"
                >
                  {{ run_status_array[station.station_status] }}
                </div>
              </div>
              <div class="table-td table-name">
                <div class="td-item">{{ station.real_total }}</div>
              </div>
              <div class="table-td table-operate">
                <el-tooltip content="查看" placement="top">
                  <router-link
                          target="_blank"
                          :to="`/device/station/detail/${station.station_id}`"
                          class="td-item see-icon"
                  ></router-link>
                </el-tooltip>
                <el-tooltip content="删除" placement="top">
                  <div
                          class="td-item delete-icon"
                          @click="deleteStationHandler(station)"
                  ></div>
                </el-tooltip>
              </div>
            </div>
            <div
                    v-if="!tableData || tableData.length === 0"
                    class="table-tr unData"
            >
              <img :src="require('assets/img/unData.png')" />
              <span>暂无数据</span>
            </div>
          </div>
          <!-- 分页 -->
          <sf-pagination
                  v-if="tableData && tableData.length"
                  :currentPage="currentPage"
                  :page-count="page_count"
                  @current-change="handleCurrentChange"
          />
        </div>
      </div>

      <!-- 删除 -->
      <sf-modelBox
              :showModel.sync="showDelete"
              title="删除确认"
              type="delete"
              @change="saveDeleteSure"
      >
        <p>是否确定删除此充电站？</p>
      </sf-modelBox>
    </div>
  </section>
</template>

<script>
  export default {
    data() {
      return {
        showDelete: false,
        modelObj: {
          search_type: "2",
          words: "",
          station_status: "",
          station_type: "",
        },
        currentPage: 1,
        page_count: 1,
        limit: 10,
        listLoading: false,
        tableData: [],
        station_type_array: {
          1: "公共",
          50: "个人",
          100: "公交（专用）",
          101: "环卫（专用）",
          102: "物流（专用）",
          103: "出租车（专用）",
          255: "其它",
        },
        run_status_array: {
          0: "未知",
          1: "建设中",
          5: "关闭下线",
          6: "维护中",
          50: "正常使用",
        },
      };
    },
    filters: {
      ellipsis(value) {
        if (!value) return "--";
        if (value.length > 18) {
          return value.slice(0, 17) + "...";
        }
        return value;
      },
    },
    created() {
      this.getConfig();
    },

    methods: {
      //删除充电站按钮
      deleteStationHandler(station) {
        this.showDelete = true;
        this.currentStation = station;
      },
      //删除充电站
      saveDeleteSure() {
        var currentStation = this.currentStation;
        var params = {
          id: currentStation.station_id,
        };
        this.$api.deleteStation(params).then((res) => {
          this.showDelete = false;
          if (res.code == 1) {
            this.$sfNotify({
              message: "成功",
            });
            this.getConfig();
          } else {
            this.$sfNotify({
              duration: 0,
              type: "error",
              message: res.message,
            });
          }
        });
      },
      getConfig() {
        this.listLoading = true;
        this.modelObj.page = this.currentPage;
        this.$api.stations(this.modelObj).then((data) => {
          this.listLoading = false;
          if (data.code == 1) {
            this.tableData = data.data.list;
            this.currentPage = data.data.current_page;
            this.page_count = data.data.page_total;
          }
        });
      },
      searchStation(reset) {
        if (reset) {
          this.modelObj = {
            search_type: "1",
            words: "",
            station_status: "",
            station_type: "",
          };
        }
        this.currentPage = 1;
        this.tableData = [];
        this.getConfig();
      },
      // 点击分页触发
      handleCurrentChange(page) {
        this.currentPage = page;
        this.getConfig();
      },
    },
  };
</script>
<style lang="scss" scoped>
  @import "../../assets/css/device/station.scss";
</style>
