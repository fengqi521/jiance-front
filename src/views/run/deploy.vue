<template>
  <section>
    <div class="section-title">告警配置</div>
    <div class="section-container">
      <div class="section-item-header clearfix">
        <span>告警配置列表</span>
        <div class="btn_succ add-coupon" @click="addOrEditAlarm(0)">
          <i class="add-station"></i>添加告警
        </div>
      </div>
      <div class="section-main">
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td table-column__1">告警标题</div>
            <div class="table-td">告警方式</div>
            <div class="table-td">联系人</div>
            <div class="table-td  table-column__2">关联充电站</div>
            <div class="table-td">操作</div>
          </div>
          <div
            class="table-body"
            v-loading="listLoading"
          >
            <div
              class="table-tr"
              v-show="tableData &&tableData.length > 0"
              v-for="(alarm, index) in tableData"
              :key="index"
            >
              <div class="table-td table-column__1">
                <el-tooltip :content="alarm.title" placement="top">
                  <div
                    class="td-item"
                  >{{alarm.title | ellipsisTitle}}</div>
                </el-tooltip>
                <!-- <div class="td-item">{{alarm.title}}</div> -->
              </div>
              <div class="table-td">
                <div class="td-item">{{alarm_type_array[alarm.type]}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{alarm.contact}}</div>
              </div>
              <div class="table-td  table-column__2">
                <el-tooltip :content="alarm.stations_str" placement="top">
                  <div class="td-item" >{{alarm.stations_str | ellipsis}}</div>
                </el-tooltip>
<!--                <div class="td-item">{{alarm.stations_str?alarm.stations_str:'暂无'}}</div>-->
              </div>
              <div class="table-td table-operate">
                <el-tooltip
                  content="编辑"
                  placement="top"
                >
                  <div class="td-item edit-icon" @click="addOrEditAlarm(alarm.id)"></div>
                </el-tooltip>
                <el-tooltip
                  content="删除"
                  placement="top"
                >
                  <div class="td-item delete-icon" @click="delAlarm(alarm.id)"></div>
                </el-tooltip>
              </div>
            </div>
            <div
              v-if="!tableData || tableData.length == 0"
              class="table-tr unData"
            >
              <img :src="require('assets/img/unData.png')">
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
    <!-- 添加/修改告警 -->
    <sf-modelBox
      class="alarm-box"
      :showModel.sync="showAlarmInfo"
      :title="currentItem.id== 0 ? '添加告警' : '修改告警'"
      @change="saveAlarmInfo(currentItem.id)"
    >
      <el-form
        :model="alarmInfo"
        ref="alarmInfo"
        :rules="dataRules"
      >
        <div class="box-list">
          <div class="box-left">告警标题</div>
          <div class="box-right">
            <el-form-item prop="title">
              <el-input
                class="el-input-falut"
                :disabled="currentItem.id == 0 ?false : true"
                v-model="alarmInfo.title"
                placeholder="请输入告警标题"
              />
            </el-form-item>
          </div>
        </div>
        <div class="box-list">
          <div class="box-left">告警方式</div>
          <div class="box-right box-search">
            <el-select
              class="search-type search-message"
              v-model="alarmInfo.type"
            >
              <el-option
                label="短信"
                value="1"
              />
              <el-option
                label="邮箱"
                value="2"
              />
            </el-select>
            <el-form-item
              class="search-input"
              prop="contact"
            >
              <el-input
                v-model="alarmInfo.contact"
                :placeholder="`请输入${alarmInfo.type == 1 ? '手机号' : '邮箱'}`"
              />
            </el-form-item>
          </div>
        </div>
        <div class="box-list">
          <div class="box-left">告警内容</div>
          <div class="box-right">
            <el-form-item prop="content">
              <el-input
                type="textarea"
                v-model="alarmInfo.content"
                :disabled="true"
              />
            </el-form-item>
          </div>
        </div>
        <div class="box-list">
          <div class="box-left">故障类型</div>
          <div class="box-right">
            <el-form-item prop="fault_type">
              <el-select class="el-input-falut" v-model="alarmInfo.fault_type">
                <el-option
                  label="设备故障"
                  value="1"
                />
                <el-option
                  label="电源故障"
                  value="2"
                />
                <el-option
                  label="车辆故障"
                  value="3"
                />
              </el-select>
            </el-form-item>
          </div>
        </div>
        <div class="box-list">
          <div class="box-left">告警充电站</div>
          <div class="box-right">
            <div class="checkbox-item checkbox-all">
              <span class="checkbox-icon" :class="{'checkbox-act-icon':checkbox_all}" @click="handleCheckedAll"></span>全选
            </div>
            <!-- 权限列表 -->
            <div class="auth-outer scrollBar" v-if="station_arr && station_arr.length != 0">
              <div class="checkbox-item"
                 v-for="(station, index) in station_arr"
                 :key="index"
              >
                <span class="checkbox-icon"
                  :class="{'checkbox-act-icon': alarmInfo.stations.indexOf(station.station_id) != -1}"
                  @click="handleChecked(station.station_id)"
                ></span>{{station.station_name}}
              </div>
            </div>
            <div
              v-if="!station_arr || station_arr.length == 0"
              class="table-tr unData auth-outer team-add-no-station"
            >
              <img :src="require('assets/img/unData.png')" />
              <span>暂无数据</span>
            </div>
          </div>
        </div>
      </el-form>
    </sf-modelBox>
    <!-- 删除确认 -->
    <sf-modelBox
      :showModel.sync="showDelete"
      title="删除确认"
      type="delete"
      @change="saveDeleteSure"
    >
      <p>是否确定删除告警？</p>
    </sf-modelBox>
  </section>
</template>

<script>
export default {
  data() {
    const validateContact = async(rule, value, callback) => {
      if (this.alarmInfo.type == 1) {
        if (value.trim() == "") {
          return callback(new Error('* 请输入手机号码'));
        }
        const boolean = new RegExp('^1(3|4|5|6|7|8|9)\\d{9}$').test(value);
        if (!boolean) {
          return callback(new Error('* 手机号格式不正确'));
        }
      } else {
        if (value.trim() == "") {
          return callback(new Error('* 请输入邮箱地址'));
        }
        const boolean = new RegExp('^[a-z0-9]+([._\\\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$').test(value);
        if (!boolean) {
          return callback(new Error('* 邮箱格式不正确'));
        }
      }
    };
    return {
      currentPage: 1,
      page_count: 1,
      tableData: [],
      listLoading: false,
      alarm_type_array: {
        "1": "手机号",
        "2": "邮件"
      },
      showAlarmInfo: false,
      showDelete: false,
      currentItem: {
        id: 0
      },
      alarmInfo: {
        title: "",
        type: "1",
        contact: "",
        content: "示例：您好，2020-05-10 12:12:01，电站“XXX充电站”电桩“XX号桩”发生了“设备故障”，具体故障为“电表数据异常”，请及时处理。",
        fault_type: "1",
        stations: []
      },
      dataRules: {
        title: [
          { required: true, message: "* 请输入告警标题", trigger: "blur" }
        ],
        contact: [
          { validator: validateContact, trigger: 'blur' }
        ],
        content: [
          { required: true, message: "* 请输入告警内容", trigger: "blur" }
        ],
      },
      del_alarm_id: "",
      station_arr: [],
      station_ids: [],
      checkbox_all:false,
    };
  },
  created() {
    this.getAvailableStations();
    this.getTableDataList();
  },
  filters: {
    ellipsis(value){
      if (!value) return '--'
      if (value.length > 38) {
        return value.slice(0,95) + '...'
      }
      return value
    },
    ellipsisTitle(value){
      if (!value) return '--'
      if (value.length > 38) {
        return value.slice(0,38) + '...'
      }
      return value
    }
  },
  methods: {
    addOrEditAlarm(id) {
      this.currentItem.id = id;
      if (id == 0) {
        // 添加
        this.checkbox_all = false;
        this.alarmInfo.title = "";
        this.alarmInfo.type = "1";
        this.alarmInfo.contact = "";
//        this.alarmInfo.content = "";
        this.alarmInfo.fault_type = "1";
        this.alarmInfo.stations = [];
        this.showAlarmInfo = true;
      } else {
        this.checkbox_all = false;
        this.alarmInfo.title = "";
        this.alarmInfo.type = "1";
        this.alarmInfo.contact = "";
//        this.alarmInfo.content = "";
        this.alarmInfo.fault_type = "1";
        this.alarmInfo.stations = [];
        this.showAlarmInfo = true;
        // 编辑
        this.$api.alarmEditInfo({id: id}).then(data => {
          if (data.code == 1) {
            let _data = data.data;
            let _station = _data.stations;
            this.alarmInfo.title = _data.title;
            this.alarmInfo.type = _data.type;
            this.alarmInfo.contact = _data.contact;
//            this.alarmInfo.content = _data.content;
            this.alarmInfo.fault_type = _data.fault_type;
            if (_station && _station.length > 0) {
              _station.forEach((item) => {
                if (item.checked == 1) {
                  this.alarmInfo.stations.push(item.station_id);
                }
              });
            }
            this.checkbox_all = this.alarmInfo.stations.length == _station.length ? true : false;
            this.showAlarmInfo = true;
          }
        });
      }
    },
    delAlarm(id) {
      this.del_alarm_id = id;
      this.showDelete = true;
    },
    getAvailableStations() {
      let that = this;
      this.$api.alarmStation().then(data => {
        if (data.code == 1) {
          let list = data.data;
          this.station_arr = list;
          list.forEach(function (e) {
            that.station_ids.push(e.station_id);
          })
        }
      });
    },
    handleCheckedAll(){
      this.alarmInfo.stations = this.checkbox_all ? []: JSON.parse(JSON.stringify(this.station_ids));
      this.checkbox_all = !this.checkbox_all;
    },
    handleChecked(id){
      let arr = this.alarmInfo.stations;
      if(arr.indexOf(id) != -1){
        arr.splice(arr.indexOf(id),1);
      }else{
        arr.push(id);
      }
      this.checkbox_all = arr.length == this.station_arr.length ? true:false;
    },
    getTableDataList() {
      this.listLoading = true;
      this.$api.alarmConfigure({ page: this.currentPage }).then(data => {
        this.listLoading = false;
        if (data.code == 1) {
          this.tableData = data.data.list;
          this.alarm_stations = "";
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
    saveAlarmInfo(id) {
      if (id == 0) {
        // 添加
        if (this.alarmInfo.stations.length <= 0) {
          this.$sfNotify({
            duration: 0,
            type: "error",
            message: "告警关联充电站不能为空"
          });
          return false;
        }
        this.$refs["alarmInfo"].validate(valid => {
          if (valid) {
            this.$api.alarmCreate(this.alarmInfo).then(data => {
              this.showAlarmInfo = false;
              if (data.code == 1) {
                this.$sfNotify({
                  message: "成功"
                });
                setTimeout(this.getTableDataList, 2000);
              } else {
                this.$sfNotify({
                  duration: 0,
                  type: "error",
                  message: "失败"
                });
              }
            });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      } else {
        this.$refs["alarmInfo"].validate(valid => {
          if (valid) {
            this.alarmInfo.id = id;
            this.$api.alarmEdit(this.alarmInfo).then(data => {
              this.showAlarmInfo = false;
              if (data.code == 1) {
                this.$sfNotify({
                  message: "成功"
                });
                setTimeout(this.getTableDataList, 2000);
              } else {
                this.$sfNotify({
                  duration: 0,
                  type: "error",
                  message: "失败"
                });
              }
            });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }
    },
    saveDeleteSure() {
      this.$api.alarmRemove({id: this.del_alarm_id}).then(data => {
        this.showDelete = false;
        if (data.code == 1) {
          this.$sfNotify({
            message: "成功"
          });
          setTimeout(this.getTableDataList, 2000);
        } else {
          this.$sfNotify({
            duration: 0,
            type: "error",
            message: "失败"
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/run/fault.scss";
</style>
