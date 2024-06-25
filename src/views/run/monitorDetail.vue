<template>
  <section>
    <div class="section-title">
      <router-link to="/run/monitor">设备监控</router-link> > 充电站列表
    </div>
    <div class="section-header">
      <div class="section-item-header">
        <div>
          <a style="cursor: default">充电枪列表</a
          ><span>（ {{ station_name }} ）</span>
        </div>
        <div
          :class="[
            'refresh-status',
            isRefresh ? 'btn_recovery' : 'btn_cancel refresh-stop',
          ]"
          @click="refreshChange()"
        >
          <i class="add-station"></i>{{ isRefresh ? "开始刷新" : "停止刷新" }}
        </div>
      </div>
      <div class="header-content clearfix">
        <div class="elec-title">充电枪数量（个）</div>
        <div class="content-top">
          <div
            :class="['top-item', topItemClick == 9 ? 'top-item-clicK' : '']"
            @click="handleElecType(9)"
          >
            <div
              :class="[
                chargingListNumber.direct == 0
                  ? 'top-item-number'
                  : 'top-item-green',
              ]"
            >
              {{ chargingListNumber.direct }}
            </div>
            <div class="top-item-world">直流枪</div>
          </div>
          <div
            :class="['top-item', topItemClick == 10 ? 'top-item-clicK' : '']"
            @click="handleElecType(10)"
          >
            <div
              :class="[
                chargingListNumber.alternating_current == 0
                  ? 'top-item-number'
                  : 'top-item-green',
              ]"
            >
              {{ chargingListNumber.alternating_current }}
            </div>
            <div class="top-item-world">交流枪</div>
          </div>
          <div
            :class="['top-item', topItemClick == 11 ? 'top-item-clicK' : '']"
            @click="handleElecType(11)"
          >
            <div
              :class="[
                chargingListNumber.online == 0
                  ? 'top-item-number'
                  : 'top-item-green',
              ]"
            >
              {{ chargingListNumber.online }}
            </div>
            <div class="top-item-world">在线</div>
          </div>
          <div
            :class="['top-item', topItemClick == 12 ? 'top-item-clicK' : '']"
            @click="handleElecType(12)"
          >
            <div
              :class="[
                chargingListNumber.offline == 0
                  ? 'top-item-number'
                  : 'top-item-red',
              ]"
            >
              {{ chargingListNumber.offline }}
            </div>
            <div class="top-item-world">离线</div>
          </div>
          <div
            :class="['top-item', topItemClick == 4 ? 'top-item-clicK' : '']"
            @click="handleElecType(4)"
          >
            <div
              :class="[
                chargingListNumber.error == 0
                  ? 'top-item-number'
                  : 'top-item-red',
              ]"
            >
              {{ chargingListNumber.error }}
            </div>
            <div class="top-item-world">故障</div>
          </div>
          <div
            :class="['top-item', topItemClick == 0 ? 'top-item-clicK' : '']"
            @click="handleElecType(0)"
          >
            <div
              :class="[
                chargingListNumber.free == 0
                  ? 'top-item-number'
                  : 'top-item-green',
              ]"
            >
              {{ chargingListNumber.free }}
            </div>
            <div class="top-item-world">空闲</div>
          </div>
          <div
            :class="['top-item', topItemClick == 5 ? 'top-item-clicK' : '']"
            @click="handleElecType(5)"
          >
            <div
              :class="[
                chargingListNumber.appointment == 0
                  ? 'top-item-number'
                  : 'top-item-green',
              ]"
            >
              {{ chargingListNumber.appointment }}
            </div>
            <div class="top-item-world">预约中</div>
          </div>
          <div
            :class="['top-item', topItemClick == 1 ? 'top-item-clicK' : '']"
            @click="handleElecType(1)"
          >
            <div
              :class="[
                chargingListNumber.occupy == 0
                  ? 'top-item-number'
                  : 'top-item-green',
              ]"
            >
              {{ chargingListNumber.occupy }}
            </div>
            <div class="top-item-world">准备充电</div>
            <el-tooltip
              class="item"
              content="已插枪，等待充电"
              placement="right"
            >
              <div class="tips-icon"></div>
            </el-tooltip>
          </div>
          <div
            :class="['top-item', topItemClick == 2 ? 'top-item-clicK' : '']"
            @click="handleElecType(2)"
          >
            <div
              :class="[
                chargingListNumber.charging == 0
                  ? 'top-item-number'
                  : 'top-item-green',
              ]"
            >
              {{ chargingListNumber.charging }}
            </div>
            <div class="top-item-world">充电中</div>
          </div>
          <div
            :class="['top-item', topItemClick == 3 ? 'top-item-clicK' : '']"
            @click="handleElecType(3)"
          >
            <div
              :class="[
                chargingListNumber.charging_end == 0
                  ? 'top-item-number'
                  : 'top-item-green',
              ]"
            >
              {{ chargingListNumber.charging_end }}
            </div>
            <div class="top-item-world">充电结束</div>
            <el-tooltip
              class="item"
              content="已完成充电，等待拔枪"
              placement="right"
            >
              <div class="tips-icon"></div>
            </el-tooltip>
          </div>

          <!-- <div class="top-item temp_top" v-for="(i ,index) in 2" :key="i+index+'196'"></div> -->
        </div>
      </div>
    </div>
    <div class="section-container" v-loading="loading">
      <div class="section-main">
        <div class="header-content all-elec clearfix">
          <div class="checkbox-item checkbox-all">
            <span
              class="checkbox-icon"
              :class="{ 'checkbox-act-icon': checkbox_all }"
              @click="handleCheckedAll"
            ></span
            >全选
            <span
              >( *
              设备运维可以远程操作充电枪启/停，只有通过远程操作“开始充电”的枪才可以远程“停止充电”)
            </span>
          </div>
          <div class="btn_succ_different" @click="handleElecStartAll">
            开始充电
          </div>
          <div class="btn_del_different" @click="handleElecStopAll">
            停止充电
          </div>
        </div>
        <div class="elec-same">
          <div
            v-for="charging in chargingList"
            :key="charging.pile_sn + charging.gun_sn"
            :class="[
              'section-list',
              chargingChecked.indexOf(charging.pile_sn + charging.gun_sn) != -1
                ? 'section-list-back'
                : '',
            ]"
          >
            <div class="ele-list-top">
                <div>
                <span class="elec-top-left">充电桩名称：</span>
                <span class="elec-top-right elec-top-right-pile">{{
                  charging.pile_name||'--'
                }}</span>
              </div>
              <div>
                <span class="elec-top-left">充电桩编号：</span>
                <span class="elec-top-right">{{
                  charging.pile_sn
                }}</span>
              </div>
              <div>
                <span class="elec-top-left">充电枪编号：</span>
                <span class="elec-top-right">{{ charging.gun_sn }}</span>
              </div>
            </div>
            <div class="elec-list-center">
              <div class="elec-center-left">
                <div
                  :class="[
                    'elec-type',
                    charging.gun_type == '1'
                      ? 'elec-type-zhi'
                      : 'elec-type-jiao',
                  ]"
                >
                  {{ charging.gun_type == "1" ? "直流" : "交流" }}
                </div>
                <div>
                  <i
                    :class="
                      charging.data.soc
                        ? charging.data.soc == '100'
                          ? 'elec-100'
                          : 'elec-hover'
                        : 'elec'
                    "
                  ></i>
                  <!-- <img :src="require(`../../../static/theme/mailang/img/${charging.data.soc ? (charging.data.soc == '100' ? 'elec-100' : 'elec-hover') : 'elec'}.png`)" alt="" /> -->
                </div>

                <div
                  :class="[
                    'elec-percent',
                    charging.data.soc ? '' : 'elec-percent-0',
                  ]"
                  v-if ="charging.gun_type == 1"
                >

                  {{ charging.data.soc ? charging.data.soc : "0" }}%
                </div>
                <div
                        :class="[
                    'elec-percents',
                    charging.data.soc ? '' : 'elec-percent-0',
                  ]"
                        v-else = "charging.gun_type == 2"
                >
                  {{ charging.status == 2 ? 充电中 : "0%" }}

                </div>

              </div>
              <div class="elec-center-right">
                <div>
                  <span class="elec-center-word">充电电压：</span
                  ><span class="elec-center-content"
                    >{{
                      charging.online != "1"
                        ? "--"
                        : charging.status == "2"
                        ? charging.data.ov
                        : "--"
                    }}V</span
                  >
                </div>
                <div>
                  <span class="elec-center-word">充电电流：</span
                  ><span class="elec-center-content"
                    >{{
                      charging.online != "1"
                        ? "--"
                        : charging.status == "2"
                        ? charging.data.oa
                        : "--"
                    }}A</span
                  >
                </div>
                <div>
                  <span class="elec-center-word">充电时长：</span
                  ><span class="elec-center-content">{{
                    charging.online != "1"
                      ? "--"
                      : charging.status == "2"
                      ? charging.data.total_min
                      : "--"
                  }}</span>
                </div>
                <div>
                  <span class="elec-center-word">剩余充电时长：</span
                  ><span class="elec-center-content">{{
                    charging.online != "1"
                      ? "--"
                      : charging.status == "2"
                      ? charging.data.left_min
                      : "--"
                  }}</span>
                </div>
                <div>
                  <span class="elec-center-word">充电枪状态：</span
                  ><span
                    :class="
                      charging.online != '1'
                        ? 'elec-center-content-red'
                        : charging.status == '2'
                        ? 'elec-center-content-green'
                        : 'elec-center-content'
                    "
                    >{{
                      charging.online == "1"
                        ? chargingType[charging.status]
                        : charging.status == "4"
                        ? "故障"
                        : "离线"
                    }}</span
                  >
                </div>
                <div>
                  <span class="elec-center-word">充电用户：</span
                  ><span class="elec-center-content">{{
                    charging.online != "1"
                      ? "--"
                      : (charging.status == "2" || charging.status == "5" || charging.status == "3")
                      ? charging.charging_user
                      : "--"
                  }}</span>
                </div>
                <div>
                  <span class="elec-center-word">账单金额：</span
                  ><span class="elec-center-content">{{
                    charging.online != "1"
                      ? "--"
                      : (charging.status == "2" || charging.status == "5" || charging.status == "3")
                      ? charging.total_amount
                      : "--"
                  }}</span>
                </div>
              </div>
            </div>
            <div class="header-main ele-list-bottom">
              <div class="header-content clearfix">
                <div class="ele-center-bottom">
                  <div class="ele-bottom-left">
                    <!-- 权限列表 -->
                    <div class="auth-outer">
                      <div class="checkbox-item">
                        <span
                          class="checkbox-icon"
                          :class="{
                            'checkbox-act-icon':
                              chargingChecked.indexOf(
                                charging.pile_sn + charging.gun_sn
                              ) != -1,
                          }"
                          @click="handleChecked(charging)"
                        ></span>
                      </div>
                    </div>
                  </div>
                  <div
                    :class="[
                      'btn_succ_different btn_succ_list',
                      charging.online == '0'
                        ? 'succ_btn_disable'
                        : charging.status == '2'
                        ? 'btn_succ_list'
                        : '',
                    ]"
                    @click="handleElecStart(charging)"
                  >
                    开始充电
                  </div>
                  <div
                    :class="[
                      'btn_del_different btn_delete_list',
                      charging.online == '0'
                        ? 'del_btn_disable'
                        : charging.status == '2'
                        ? ''
                        : 'not_delete_list',
                    ]"
                    @click="handleElecStop(charging)"
                  >
                    停止充电
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 解决最后一行space-between的问题 -->
          <div
            class="section-list temp"
            v-for="(i, index) in 5"
            :key="i + index + '156'"
          ></div>
        </div>
        <div
          v-if="!chargingList || chargingList.length === 0"
          class="table-tr unData mintordetail-unData"
        >
          <img :src="require('assets/img/unData.png')" />
          <span>暂无数据</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      station_arr: [],
      station_ids: [],
      checkbox_all: false,
      elecInfo: {
        station_id: this.$route.query.id,
        gun_list: [], //时时获得最新的选中值
      },
      chargingListNumber: [],
      chargingList: [],
      chargingType: {
        0: "空闲",
        1: "准备充电",
        2: "充电中",
        3: "充电结束",
        4: "故障",
        5: "预约",
        9: "直流",
        10: "交流",
        11: "在线",
        12: "离线",
      },
      chargingChecked: [],

      loading: false,
      station_name: "",
      ElecStatusObj: {
        station_id: this.$route.query.id,
        type: "all",
      },
      topItemClick: "all",
      isRefresh: true,
      timer: "",
    };
  },
  filters: {
    ellipsis(value) {
      if (!value) return "--";
      if (value.length > 22) {
        return value.slice(0, 22) + "...";
      }
      return value;
    },
  },
  created() {
    if (this.$route.query.id) {
      this.station_name = this.$route.query.station_name;
      this.getElecStatusList();
    }
  },
  methods: {
    // 获取充电枪的状态
    getElecStatusList() {
      this.loading = true;
      this.$api.getElecStatus(this.ElecStatusObj).then((data) => {
        this.loading = false;
        if (data.code == 1) {
          this.chargingListNumber = data.data.header;
          this.chargingList = data.data.gun_detail;
          let a = data.data.gun_detail;
          if (this.chargingList && this.chargingList.length) {
            this.station_arr = a;
            this.chargingList.forEach((e) => {
              this.station_ids.push({
                pile_sn: e.pile_sn,
                gun_sn: e.gun_sn,
                operator_id: e.operator_id,
              });
            });
          }
        }
      });
    },
    handleCheckedAll() {
      this.chargingChecked = [];
      this.elecInfo.gun_list = this.checkbox_all
        ? []
        : JSON.parse(JSON.stringify(this.station_ids));

      //为了保证时刻变化的选中的值，和当然的值   显示蓝色对勾
      let a = JSON.parse(JSON.stringify(this.station_ids));
      let m = a.forEach((val) => {
        this.chargingChecked.push(val.pile_sn + val.gun_sn);
      });
      this.checkbox_all = !this.checkbox_all;
      if (!this.checkbox_all) {
        this.chargingChecked = [];
      }
    },
    handleChecked(val) {
      let id = {
        pile_sn: val.pile_sn,
        gun_sn: val.gun_sn,
        operator_id: val.operator_id,
      };
      if (this.chargingChecked.indexOf(id.pile_sn + id.gun_sn) != -1) {
        //找的到
        this.elecInfo.gun_list.splice(this.elecInfo.gun_list.indexOf(id), 1);
        this.chargingChecked.splice(
          this.chargingChecked.indexOf(id.pile_sn + id.gun_sn),
          1
        );
      } else {
        this.elecInfo.gun_list.push(id); //时时获得最新的选中值
        this.chargingChecked.push(id.pile_sn + id.gun_sn);
      }
      let arr = this.elecInfo.gun_list;
      this.elecInfo.gun_list = [...new Set(arr)];
      this.checkbox_all =
        this.elecInfo.gun_list.length == this.station_arr.length ? true : false;
    },
    //开始充电
    ElecStart(val) {
      if (!val) {
        this.$sfNotify({
          type: "error",
          message: "选择充电枪数量，不能为空!",
        });
        return;
      }
      this.elecInfo.gun_list = val;
      this.$api.ElecStart(this.elecInfo).then((data) => {
        if (data.code == 1) {
          this.$sfNotify({
            message: data.message,
          });
          this.handleElecType(this.topItemClick);
        } else {
          this.$sfNotify({
            duration: 0,
            type: "error",
            message: data.message,
          });
        }
        this.elecInfo.gun_list = [];
        this.chargingChecked = [];
      });
    },
    handleElecStartAll() {
      if (this.elecInfo.gun_list.length == 0) {
        this.$sfNotify({
          type: "error",
          message: "选择充电枪数量，不能为空!",
        });
        return;
      }
      this.ElecStart(this.elecInfo.gun_list);
    },
    handleElecStart(charging) {
      if (charging.online == 0) {
        this.$sfNotify({
          type: "error",
          message: "离线时，不可以点击充电!",
        });
        return;
      }
      if (charging.online == 1 && charging.status == 2) {
        this.$sfNotify({
          type: "error",
          message: "充电中时，不可以点击充电!",
        });
        return;
      }

      this.elecInfo.gun_list = [
        {
          pile_sn: charging.pile_sn,
          gun_sn: charging.gun_sn,
          operator_id: charging.operator_id,
        },
      ];
      this.ElecStart(this.elecInfo.gun_list);
    },
    //停止充电
    ElecStop(val) {
      if (!val) {
        this.$sfNotify({
          type: "error",
          message: "选择充电枪数量，不能为空!",
        });
        return;
      }
      this.elecInfo.gun_list = val;
      this.$api.ElecStop(this.elecInfo).then((data) => {
        if (data.code == 1) {
          this.$sfNotify({
            message: data.message,
          });
          this.handleElecType(this.topItemClick);
        } else {
          this.$sfNotify({
            duration: 0,
            type: "error",
            message: data.message,
          });
        }
        this.elecInfo.gun_list = [];
        this.chargingChecked = [];
      });
    },
    handleElecStopAll() {
      if (this.elecInfo.gun_list.length == 0) {
        this.$sfNotify({
          type: "error",
          message: "选择充电枪数量，不能为空!",
        });
        return;
      }
      this.ElecStop(this.elecInfo.gun_list);
    },
    handleElecStop(charging) {
      if (charging.online == 0) {
        this.$sfNotify({
          type: "error",
          message: "离线时，不可以点击停止充电!",
        });
        return;
      }
      if (charging.online == 1 && charging.status != 2) {
        this.$sfNotify({
          type: "error",
          message: "只有充电中时，才可以点击停止充电!",
        });
        return;
      }
      this.elecInfo.gun_list = [
        {
          pile_sn: charging.pile_sn,
          gun_sn: charging.gun_sn,
          operator_id: charging.operator_id,
        },
      ];
      this.ElecStop(this.elecInfo.gun_list);
    },
    handleElecType(val) {
      this.topItemClick = val;
      this.ElecStatusObj.type = val;
      this.getElecStatusList();
    },
    timerShaft() {
      this.timer = setInterval(() => {
        this.checkbox_all = false;
        this.elecInfo.gun_list = []; //时时获得最新的选中值
        this.chargingChecked = [];
        this.getElecStatusList();
        // 某些定时器操作
      }, 6000);
      // 通过$once来监听定时器，在beforeDestroy钩子可以被清除。
      this.$once("hook:beforeDestroy", () => {
        clearInterval(this.timer);
      });
    },
    refreshChange() {
      if (this.isRefresh) {
        clearInterval(this.timer);
        this.timerShaft();
      } else {
        clearInterval(this.timer);
      }
      this.isRefresh = !this.isRefresh;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../assets/css/run/monitorDetail.scss";
</style>
