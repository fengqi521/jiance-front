<template>
  <section>
    <div class="section-title">电桩资产管理</div>
    <div class="section-tips">
      <i class="warning-icon"></i>
      <span class="tips-text">注意：本模块所展示的是所有接入平台的设备资产数据</span>
    </div>
    <div class="section-amount">
      <div class="amount-left">
        <i class="basic-icon"></i>
        <p class="version-text">基础版</p>
      </div>
      <div class="amount-right">
        <div class="amount-item-inner clearfix">
          <div class="amount-item">
            <div class="amount-item-title">最大授权设备数量</div>
            <p class="amount-item-text">
              <span class="section-running">{{max_amount}}</span>台
            </p>
          </div>
          <div class="amount-item">
            <div class="amount-item-title">现有启用设备数量</div>
            <p class="amount-item-text">
              <span class="amount-item-number">{{current_amount}}</span>台
            </p>
          </div>
          <div class="amount-item">
            <div class="amount-item-title">接入平台的设备数量</div>
            <p class="amount-item-text">
              <span class="section-end">{{already_amount}}</span>台
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="section-header">
      <div class="section-item-header clearfix">
        <span>筛选查询</span>
      </div>
      <div class="header-content clearfix">
        <div class="content-item">
          <div class="header-left">运行编码</div>
          <div class="header-right">
            <el-input class="search-input" v-model="modelObj.pile_sn" placeholder="输入运行编码" />
          </div>
        </div>
        <div class="content-item">
          <div class="header-left">设备状态</div>
          <div class="header-right">
            <el-select v-model="modelObj.status">
              <el-option label="全部" value="0" />
              <el-option label="在线" value="1" />
              <el-option label="离线" value="2" />
            </el-select>
          </div>
        </div>
        <div class="content-item">
          <div class="header-left">启用/停用</div>
          <div class="header-right">
            <el-select v-model="modelObj.using">
              <el-option label="全部" value />
              <el-option label="启用" value="1" />
              <el-option label="停用" value="0" />
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
        <span>资产列表</span>
      </div>
      <div class="section-main">
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td table-column__1">运行编码</div>
            <div class="table-td table-column__1">接入ID</div>
            <div class="table-td table-column__2">激活时间</div>
            <div class="table-td">类型</div>
            <div class="table-td table-column__2">最新上线时间</div>
            <div class="table-td">设备状态</div>
            <div class="table-td">运行状态</div>
            <div class="table-td table-column__1">在线时长</div>
            <div class="table-td">充电口数</div>
            <div class="table-td table-column__2">启用/停用</div>
            <div class="table-td table-column__3">操作</div>
          </div>
          <div class="table-body" v-loading="listLoading">
            <div
              class="table-tr"
              v-show="tableData && tableData.length"
              v-for="(asset, index) in tableData"
              :key="index"
            >
              <div class="table-td table-column__1">
                <div class="td-item">{{asset.pile_sn}}</div>
              </div>
              <div class="table-td table-column__1">
                <div class="td-item">{{asset.authid?asset.authid:'--'}}</div>
              </div>
              <div class="table-td table-column__2">
                <div class="td-item td-time">{{asset.activetime?asset.activetime:'--'}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{type_array[asset.type]}}</div>
              </div>
              <div class="table-td table-column__2">
                <div class="td-item td-time">{{asset.go_online?asset.go_online:'--'}}</div>
              </div>
              <div class="table-td table-status">
                <div class="td-item section-running" v-if="asset.device_status == 1">
                  <i></i>
                  {{device_status_array[asset.device_status]}}
                </div>
                <div class="td-item section-end" v-else>
                  <i></i>
                  {{device_status_array[asset.device_status]}}
                </div>
              </div>
              <div class="table-td table-status">
                <div
                  class="td-item td-fault"
                  v-if="asset.run_status == 4"
                >{{run_status_array[asset.run_status]}}</div>
                <div class="td-item" v-else>{{run_status_array[asset.run_status]}}</div>
              </div>
              <div class="table-td table-column__1">
                <div class="td-item">{{asset.online_time?asset.online_time:'--'}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{asset.gun_num?asset.gun_num:'--'}}</div>
              </div>
              <div class="table-td table-column__2">
                <div
                  :class="['knob', asset.is_run == 1 ? 'started' : '']"
                  @click="changeStatus(asset, index)"
                ></div>
                <div class="knob-text">{{asset.is_run == 1 ? '启用' : '停用'}}</div>
              </div>
              <div class="table-td table-column__3 table-operate">
                <div class="td-item">
                  <el-tooltip :content="asset.desc" placement="top">
                    <span class="td-item-text ellipsis">{{asset.desc}}</span>
                  </el-tooltip>
                  <el-tooltip content="编辑" placement="top">
                    <span class="edit-icon" @click="handleEditDesc(asset, index)"></span>
                  </el-tooltip>
                </div>
              </div>
            </div>
            <div class="table-tr unData" v-if="!tableData || tableData.length === 0">
              <img :src="require('assets/img/unData.png')" />
              <span>暂无数据</span>
            </div>
          </div>
          <!-- 分页 -->
          <sf-pagination
            v-show="tableData && tableData.length"
            :currentPage="currentPage"
            :page-count="page_count"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
    <!-- 编辑备注信息 -->
    <sf-modelBox class="editTextarea" :showModel.sync="showDescSure" title="编辑备注信息" @change="sureEditDesc">
      <el-form :model="currItembj" ref="currItembj" :rules="currItembjRules">
        <div class="box-list">
          <div class="box-left">备注</div>
          <div class="box-right">
            <el-form-item prop="desc">
              <el-input
                type="textarea"
                v-model="currItembj.desc"
                placeholder="填写备注信息"

              />
            </el-form-item>
          </div>
        </div>
      </el-form>
    </sf-modelBox>
    <!-- 启用确认 -->
    <sf-modelBox :showModel.sync="showStartSure" title="启用确认" @change="saveStopPile">
      <p>是否确定启用此电桩？</p>
    </sf-modelBox>
    <!-- 停用确认 -->
    <sf-modelBox type="delete" :showModel.sync="showStopSure" title="停用确认" @change="saveStopPile">
      <p>是否确定停用此电桩？</p>
    </sf-modelBox>
  </section>
</template>

<script>
export default {
  data() {
    return {
      showDescSure: false,
      showStartSure: false,
      showStopSure: false,
      currItembj: {
        desc: "",
      },
      currItembjRules: {
        desc: [
          { required: true, message: "* 请输入描述信息", trigger: "blur" },
        ],
      },
      modelObj: {
        pile_sn: "",
        status: "0",
        using: "",
      },
      currentPage: 1,
      page_count: 1,
      max_amount: "0",
      current_amount: "0",
      already_amount: "0",
      listLoading: false,
      tableData: [],
      type_array: {
        0: "直流",
        1: "交流",
      },
      device_status_array: {
        1: "在线",
        2: "离线",
      },
      run_status_array: {
        0: "空闲",
        1: "准备充电",
        2: "充电中",
        3: "充电结束",
        4: "故障",
        5: "预约",
      },
      current_pile: "",
      current_pile_index: "",
      pile_sn: "",
      pile_sn_status: "",
      pile_sn_edit: "",
      pile_sn_edit_index: "",
    };
  },
  created() {
    this.getBasicInfo();
    this.getTableDataList();
  },
  methods: {
    getBasicInfo() {
      this.$api.assetBasic().then((data) => {
        if (data.code == 1) {
          this.max_amount = data.data.max_num;
          this.current_amount = data.data.cur_num;
          this.already_amount = data.data.in_num;
        }
      });
    },
    getTableDataList() {
      this.listLoading = true;
      this.modelObj.page = this.currentPage;
      this.$api.assetsAssets(this.modelObj).then((data) => {
        console.log(this.modelObj);
        this.listLoading = false;
        if (data.code == 1) {
          this.tableData = data.data.list;
          this.currentPage = data.data.current_page;
          this.page_count = data.data.page_total;
        }
      });
    },
    searchPile() {
      this.currentPage = 1;
      this.tableData = [];
      this.getTableDataList();
    },
    resetSearch() {
      this.modelObj.pile_sn = "";
      this.modelObj.status = "0";
      this.modelObj.using = "";
      this.currentPage = 1;
      this.page_count = 1;
      this.tableData = [];
      this.getTableDataList();
    },
    // 点击分页触发
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getTableDataList();
    },
    handleEditDesc(item, index) {
      this.currItembj.desc = item.desc;
      this.pile_sn_edit = item.pile_sn;
      this.pile_sn_edit_index = index;
      this.showDescSure = true;
    },
    changeStatus(item, index) {
      let is_run_now = item.is_run;
      this.current_pile = item;
      this.current_pile_index = index;
      if (is_run_now == 1) {
        this.pile_sn = item.pile_sn;
        this.pile_sn_status = 0;
        this.showStopSure = true;
      }
      if (is_run_now == 0) {
        this.pile_sn = item.pile_sn;
        this.pile_sn_status = 1;
        this.showStartSure = true;
      }
    },
    saveStopPile() {
      this.showStartSure = false;
      this.showStopSure = false;
      this.$api
        .assetsStatus({ pile_sn: this.pile_sn, status: this.pile_sn_status })
        .then((data) => {
          if (data.code == 1) {
            this.$sfNotify({
              message: "成功",
            });
            this.tableData[
              this.current_pile_index
            ].is_run = this.pile_sn_status;
            if (this.pile_sn_status == 1) {
              this.current_amount = parseInt(this.current_amount) + 1;
            }
            if (this.pile_sn_status == 0) {
              this.current_amount = parseInt(this.current_amount) - 1;
            }
          } else {
            this.$sfNotify({
              duration: 0,
              type: "error",
              message: data.message,
            });
          }
        });
    },
    sureEditDesc() {
      if(this.showDescSure){
        this.$api
        .assetsDescription({
          pile_sn: this.pile_sn_edit,
          desc: this.currItembj.desc,
        })
        .then((data) => {
          if (data.code == 1) {
            this.$sfNotify({
              message: "成功",
            });
            this.tableData[this.pile_sn_edit_index].desc = this.currItembj.desc;
          } else {
            this.$sfNotify({
              duration: 0,
              type: "error",
              message: "失败",
            });
          }
        });
      }
      this.showDescSure = false;
    },
  },
};
</script>
<style ref="stylesheet/scss" lang="scss" scoped>
@import "../../assets/css/device/asset.scss";
</style>
