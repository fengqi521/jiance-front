<template>
  <section>
    <div class="section-title">
      <router-link to="/device/pile">充电桩管理</router-link> > 充电桩运维
    </div>
    <p class="section-name">充电桩名称：{{ pile_name }}</p>
    <div class="section-container">
      <div class="section-item-router">
        <router-link
          :to="`/device/pile/maintain?pile_id=${pile_id}&pile_sn=${pile_sn}&source=${source}`"
          class="section-act"
          >设备运维</router-link
        >
        <router-link
          :to="`/device/pile/fault?pile_id=${pile_id}&pile_sn=${pile_sn}&source=${source}`"
          >故障运维</router-link
        >
      </div>
      <div class="header-bottom clearfix">
        <span v-if="source == 1" class="btn_delete reset-pile" @click="handleRestart"
          >重启充电桩</span
        >
        <el-tooltip content="不允许修改第三方充电桩" placement="top">
            <span 
              v-if="source != 1"
              style="cursor: not-allowed;"
              class="btn_delete reset-pile"
              >重启充电桩</span
            >
        </el-tooltip>
        
      </div>
      <div class="section-main">
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td">充电枪编号</div>
            <div class="table-td">运行状态</div>
            <div class="table-td">当前电压</div>
            <div class="table-td">当前电流</div>
            <div class="table-td">输出功率</div>
            <div class="table-td">充电开始时间</div>
            <div class="table-td">操作</div>
          </div>
          <div class="table-body" v-loading="listLoading">
            <div
              class="table-tr"
              v-show="tableData && tableData.length"
              v-for="(gun, index) in tableData"
              :key="index"
            >
              <div class="table-td">
                <div class="td-item">{{ gun.gun_sn }}</div>
              </div>
              <div class="table-td table-status">
                <div class="td-item td-online" v-if="gun.run_status == '2'">
                  {{ gun_run_status[gun.run_status] }}
                </div>
                <div class="td-item" v-else>
                  {{
                    gun_run_status[gun.run_status]
                      ? gun_run_status[gun.run_status]
                      : "离线"
                  }}
                </div>
              </div>
              <div class="table-td">
                <div class="td-item">
                  {{ gun.run_status == 2 ? gun.current_voltage + "V" : "--" }}
                </div>
              </div>
              <div class="table-td">
                <div class="td-item">
                  {{ gun.run_status == 2 ? gun.current_electric + "A" : "--" }}
                </div>
              </div>
              <div class="table-td">
                <div class="td-item">
                  {{ gun.run_status == 2 ? gun.power + "KW" : "--" }}
                </div>
              </div>
              <div class="table-td">
                <div class="td-item">
                  {{ gun.run_status == 2 ? gun.charge_time : "--" }}
                </div>
              </div>
              <div class="table-td table-operate">
                <!-- 自营 -->
                <el-tooltip content="停止" placement="top">
                  <div
                    v-if="source == 1"
                    class="td-item stop-icon"
                    @click="gunStopNotice(gun.gun_sn)"
                  ></div>
                </el-tooltip>

                <el-tooltip content="二维码" placement="top">
                  <div
                    v-if="source == 1"
                    class="td-item qrcode-icon"
                    @click="showQRcodeImg(gun.gun_sn)"
                  ></div>
                </el-tooltip>
                <el-tooltip
                  content="解锁"
                  placement="top"
                  v-if="(gun.run_status != '2') &&  (source == 1)"
                >
                  <div
                    class="td-item unlock-icon"
                    @click="setUnlock(gun.gun_sn)"
                  ></div>
                </el-tooltip>

                <!-- 非自营  第三方接入 -->
                <el-tooltip content="不允许修改第三方充电桩" placement="top">
                  <div
                    style="cursor: not-allowed;"
                    v-if="source != 1"
                    class="td-item stop-icon"
                  ></div>
                </el-tooltip>

                <el-tooltip content="不允许修改第三方充电桩" placement="top">
                  <div
                    style="cursor: not-allowed;"
                    v-if="source != 1"
                    class="td-item qrcode-icon"
                  ></div>
                </el-tooltip>
                <el-tooltip
                  content="不允许修改第三方充电桩"
                  placement="top"
                  v-if="source != 1"
                >
                  <div
                    style="cursor: not-allowed;"
                    class="td-item unlock-icon"
                  ></div>
                </el-tooltip>

              </div>
            </div>
            <div
              class="table-tr unData"
              v-if="!tableData || tableData.length === 0"
            >
              <img :src="require('assets/img/unData.png')" />
              <span>暂无数据</span>
            </div>
          </div>
          <!-- 分页 -->
          <sf-pagination
            v-if="tableData && tableData.length > 0"
            :currentPage="currentPage"
            :page-count="page_count"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>

    <!-- 重启 -->
    <sf-modelBox
      type="delete"
      :showModel.sync="showRestart"
      @change="restartConform"
      title="重启确认"
    >
      <p>
        正在向充电桩
        <span style="font-weight: bold">{{ pile_sn }}</span>
        下发
        <span style="font-weight: bold">重启</span> 命令，是否确认该操作？
      </p>
    </sf-modelBox>
    <!-- 停止确认 -->
    <sf-modelBox
      type="delete"
      :showModel.sync="showStopSure"
      title="停止确认"
      @change="gunStop"
    >
      <!--      <p>强行停止操作仅用作不可避免的特殊情况，停止后本次充电生成的账单不是实际账单，账单金额为“0”元。会造成一定亏损，请核对无误后点击确认。</p>-->
      <p>强行停止操作仅用作不可避免的特殊情况，确定强行停止吗？</p>
    </sf-modelBox>
    <!-- 二维码 -->
    <sf-messageBox :showModel.sync="showQRcode" title="二维码">
      <div class="qrCode-img">
        <img :src="code_img_url" />
      </div>
      <div class="qrCode-text">充电枪编号：{{ code_gun_sn }}</div>
    </sf-messageBox>
  </section>
</template>

<script>
export default {
  data() {
    return {
      currentPage: 1,
      page_count: 10,
      listLoading: false,
      tableData: [],
      pile_sn: this.$route.query.pile_sn ? this.$route.query.pile_sn : "",
      pile_id: this.$route.query.pile_id ? this.$route.query.pile_id : "",
      source: this.$route.query.source ? this.$route.query.source : "",
      pile_name: "",
      gun_run_status: {
        0: "空闲",
        1: "准备充电",
        2: "充电中",
        3: "充电结束",
        4: "故障",
        5: "预约",
        6: "离线",
      },
      showRestart: false,
      showStopSure: false,
      showQRcode: false,
      currentPileId: -1,
      currentGunId: "",
      code_img_url: "",
      code_gun_sn: "",
      ENV: process.env.NODE_ENV == "development" ? "/api" : "",
    };
  },
  created() {
    this.getTableDataList();
  },
  methods: {
    setUnlock(gun_sn) {
      var params = {
        pile_sn: this.pile_sn,
        gun_sn: gun_sn,
      };
      this.$api.pileGunUnLock(params).then((res) => {
        this.showStopSure = false;
        if (res.code == 1) {
          this.$sfNotify({
            message: "解锁成功",
          });
          this.getTableDataList();
        } else {
          this.$sfNotify({
            type: "error",
            message: res.message,
          });
        }
      });
    },

    showQRcodeImg(gun_sn) {
      this.code_img_url = "";
      this.code_img_url =
        `${this.ENV}/pile/code?serialNumber=` +
        this.pile_sn +
        gun_sn +
        "&pileId=" +
        this.pile_id;
      this.code_gun_sn = gun_sn;
      this.showQRcode = true;
    },
    gunStopNotice(id) {
      this.currentPileId = "";
      this.currentGunId = id;
      this.showStopSure = true;
    },
    gunStop() {
      var params = {
        pile_sn: this.pile_sn,
        gun_sn: this.currentGunId,
      };
      this.$api.pileGunStop(params).then((res) => {
        this.showStopSure = false;
        if (res.code == 1) {
          this.$sfNotify({
            message: "停止成功",
          });
          this.getTableDataList();
        } else {
          this.$sfNotify({
            type: "error",
            message: res.message,
          });
        }
      });
    },
    getTableDataList() {
      this.listLoading = true;
      let param = {
        pile_sn: this.pile_sn,
        page: this.currentPage,
      };
      this.$api.pileDevice(param).then((data) => {
        this.listLoading = false;
        if (data.code == 1) {
          this.pile_name = data.data.pile.pile_name;
          this.tableData = data.data.list;
          this.currentPage = data.data.current_page;
          this.page_count = data.data.page_total;
        }
      });
    },
    // 点击分页触发
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getTableDataList();
    },
    // 重启
    handleRestart() {
      this.showRestart = true;
    },
    //重启确认
    restartConform() {
      var _this = this;
      var params = {
        pile_sn: _this.pile_sn,
      };
      this.$api.pileRestart(params).then((res) => {
        this.showRestart = false;
        if (res.code == 1) {
          this.$sfNotify({
            message: "成功",
          });
          setTimeout(this.getTableDataList, 1500);
        } else {
          this.$sfNotify({
            type: "error",
            message: res.message,
          });
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../assets/css/device/maintain.scss";
</style>
