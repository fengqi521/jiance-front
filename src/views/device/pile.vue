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
              <el-option v-for="(item, index) in all_stations" :key="index" style="width: 148px"
                :label="item.station_name" :value="item.station_id" />
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

        <router-link to="/device/pile/add" class="btn_succ add-station" style="margin-left: 24px">
          <img :src="require('assets/img/add-station.png')" />
          添加充电桩</router-link>
        <div class="btn_recovery send-btn send-btn-car">
          <i class="add-station-out"></i>
          <!-- 批量导入 -->
          <el-upload class="upload-demo" ref="upload" :action="`${ENV}/pile/save-charging-pile`"
            :before-upload="beforeUpload" :on-progress="progressUpload" :on-success="importVhm" :show-file-list="false">
            批量导入
          </el-upload>
          <el-tooltip content="点击下载导入示例" placement="top">
            <div class="hover-green" slot="content" style="line-height: 18px">
              <a :href="`${ENV}/pile/demo.xls`">点击下载导入示例</a>
              <br />第一行：充电桩名称 <br />第二行：充电桩编号
              <br />第三行：所属厂家 <br />第四行：充电桩类型 (1直流 2交流)
              <br />
              第五行：额定功率(KW)(最低，最高) <br />
              第六行：额定电压(V)(最低，最高) <br />
              第七行：额定电流（A） <br />
              第八行：充电口数量<br />
              第九行：是否支持即插即充(1 是 0 否)<br />
              第十行：充电站id<br />
              第十一行：充电桩型号<br />
              第十一行：充电桩型号<br />
              第十二行:充电枪类型(1家用插座2交流接口插座3交流接口插头4直流接口枪头5无线充电座6其它)<br />
              第十三行：桩验收时间<br />
            </div>
            <div class="tips-icon"></div>
          </el-tooltip>
        </div>
        <div class="btn_recovery send-btn send-btn-car">

          <i class="add-station-out"></i>
          <!-- 批量修改 -->
          <el-upload class="upload-demo" ref="upload" :action="`${ENV}/pile/save-charging-update-pile`"
            :before-upload="beforeUpload" :on-progress="progressUpload" :on-success="importVhm" :show-file-list="false">
            批量修改
          </el-upload>
          <el-tooltip content="点击下载导入示例" placement="top">
            <div class="hover-green" slot="content" style="line-height: 18px">
              <a :href="`${ENV}/pile/updatedemo.xls`">点击下载导入示例</a>
              <br />第一行：充电桩名称
              <br />第二行：充电桩编号
              <br />第三行：所属厂家
              <br />第四行：充电桩类型 (1直流 2交流)
              <br />第五行：充电枪类型 (1家用插座 2交流接口插座 3交流接口插头 4直流接口枪头 5无线充电座 6其它)
              <br />第六行：SIM卡号
              <br />第七行：通讯模块MAC
              <br />第八行：桩蓝牙MAC
              <br />第九行：桩验收时间
            </div>
            <div class="tips-icon"></div>
          </el-tooltip>
        </div>
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
                  {{ pile.plug_status == "1" ? "是" : "否" }}
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
                  <i></i>{{ online_status_array[pile.online_status] }}
                </div>
                <div class="td-item td-online" v-if="pile.online_status == 1">
                  <i></i>{{ online_status_array[pile.online_status] }}
                </div>
              </div>
              <div class="table-td">
                <div class="td-item">{{ pile.real_total }}</div>
              </div>
              <div class="table-td table-operate">
                <el-tooltip content="查看" placement="top">
                  <router-link target="_blank" :to="`/device/pile/detail/${pile.id}`"
                    class="td-item see-icon"></router-link>
                </el-tooltip>
                <el-tooltip content="运维" placement="top">
                  <router-link target="_blank"
                    :to="`/device/pile/maintain?pile_id=${pile.id}&pile_sn=${pile.pile_sn}&source=${pile.source}`"
                    class="td-item maintain-icon"></router-link>
                </el-tooltip>
              </div>
            </div>
            <div class="table-tr unData" v-if="!tableData || tableData.length === 0">
              <img :src="require('assets/img/unData.png')" />
              <span>暂无数据</span>
            </div>
          </div>
          <!-- 分页 -->
          <sf-pagination v-show="tableData && tableData.length" :currentPage="currentPage" :page-count="page_count"
            @current-change="handleCurrentChange" />
        </div>
      </div>
    </div>

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
        <span v-if="importWordFail != 0" class="import-word section-no-begin">&nbsp;{{ importWordFail }}&nbsp;</span>
        <span v-if="importWordFail != 0" class="import-common-word">条</span>
      </div>
      <div v-if="importWordFail != 0" class="import-error">
        <a :href="`${this.ENV}/pile/get-error`">点击查看详细信息 ></a>
      </div>
      <div class="box-bottom clearfix import-sure">
        <div class="btn_succ" @click="importSure">确认</div>
      </div>
    </sf-messageBox>
  </section>
</template>

<script>
export default {
  data () {
    return {
      modelObj: {
        pile_sn: "",
        pile_type: "0",
        station_id: "0",
        online_status: "0",
        run_status: "-1",
      },
      currentPage: 1,
      page_count: 1,
      listLoading: false,
      tableData: [],
      pile_type_array: {
        1: "直流",
        2: "交流",
        3: "交直流一体",
        4: "无线设备",
        5: "其它",
      },
      online_status_array: {
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
      all_stations: [{ station_name: "全部", station_id: "0" }],
      //上传文件的名称
      upload_file_origin_name: "",
      upload_file_save_name: "",

      ENV: process.env.NODE_ENV == "development" ? "/api" : "",
      //批量导入进度条
      showProcessImport: false, //是否显示进度条
      showProcessImportSuccess: false, //导入结束无失败
      importWord: "2",
      importWordSuccess: "1",
      importWordFail: "1",
      percentage: 0,
      customColor: this.$store.state.app.customColor,
      import_flag: 1,
      // showImportWhite: false,
      // //上传文件的名称
      // upload_file_origin_name: "",
      // upload_file_save_name: "",
      //
      //
    };
  },
  created () {
    this.getAllStation();
    this.getTableDataList();
  },
  filters: {
    ellipsis (value) {
      if (!value) return "--";
      if (value.length > 22) {
        return value.slice(0, 21) + "...";
      }
      return value;
    },
  },
  methods: {
    getAllStation () {
      this.$api.pileAgentStation().then((data) => {
        if (data.code == 1) {
          this.all_stations = this.all_stations.concat(data.data);
        }
      });
    },
    getTableDataList () {
      this.listLoading = true;
      this.modelObj.page = this.currentPage;
      this.$api.piles(this.modelObj).then((data) => {
        this.listLoading = false;
        if (data.code == 1) {
          this.tableData = data.data.list;
          this.currentPage = data.data.current_page;
          this.page_count = data.data.page_total;
        }
      });
    },
    searchPile () {
      this.currentPage = 1;
      this.tableData = [];
      this.getTableDataList();
    },
    resetSearch () {
      this.modelObj.pile_sn = "";
      this.modelObj.pile_type = "0";
      this.modelObj.station_id = "0";
      this.modelObj.online_status = "0";
      this.modelObj.run_status = "-1";
      this.currentPage = 1;
      this.page_count = 1;
      this.tableData = [];
      this.getTableDataList();
    },
    // 点击分页触发
    handleCurrentChange (page) {
      this.currentPage = page;
      this.getTableDataList();
    },

    // //导入充电桩的按钮
    // importChargingPile(){
    //   console.log(this.import_flag);
    //   this.showImportWhite = true;
    //   this.upload_file_save_name = "";
    //   this.upload_file_origin_name = "";
    // },
    importSure () {
      this.getTableDataList();
      this.showProcessImportSuccess = false;
    },
    importFile () { },
    beforeUpload (file) {
      if (this.import_flag != 1) {
        this.$sfMessage.error("抱歉，当前用户没有操作权限");
        return false;
      }
      this.showProcessImport = true;
      const extension = file.name.split(".")[1] === "xls";
      const extension2 = file.name.split(".")[1] === "xlsx";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!extension && !extension2) {
        this.$message.warning("上传模板只能是 xls、xlsx格式!");
        return;
      }
      if (!isLt2M) {
        this.$message.warning("上传模板大小不能超过 2M!");
        return;
      }
      return true; // 返回false不会自动上传
    },
    importVhm (res) {
      if (this.percentage == 100) {
        if (res.code == 1) {
          this.showProcessImport = false;
          this.showProcessImportSuccess = true;
          this.importWord = res.data.total;
          this.importWordSuccess = res.data.succ;
          this.importWordFail = res.data.fail;
        } else {
          this.$message.warning(res.message);
          this.showProcessImport = false;
        }
      }
    },
    //进度条导入进度
    format (percentage) {
      return percentage === 100 ? "满" : `${percentage}%`;
    },
    progressUpload (event) {
      this.percentage = event.percent;
      if (this.percentage >= 100) {
        this.percentage = 100;
        let a = setTimeout(() => {
          clearTimeout(a);
        }, 500);
      }
    },

    //保存批量充电桩
    saveBatchChargingPile () {
      if (!this.upload_file_save_name) {
        this.$sfNotify({
          duration: 0,
          type: "error",
          message: "请检查导入文件是否正确",
        });
        return false;
      }
      this.$api
        .importChargingPile({
          upload_save_name: this.upload_file_save_name,
        })
        .then((data) => {
          this.showImportWhite = false;
          //导入进度开始
          this.showProcessImport = true;
          this.progressUpload(data);
          console.log(data.code);
          if (data.code == 0) {
            this.showImportWhite = false;
            //导入进度开始
            this.showProcessImport = true;
            this.progressUpload(data);
          } else {
            this.$sfNotify({
              duration: 0,
              type: "error",
              message: data.message,
            });
          }
        });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../assets/css/device/pile.scss";
</style>
