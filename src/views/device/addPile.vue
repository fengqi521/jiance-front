<template>
  <section>
    <div class="section-title">
      <router-link to="/device/pile">充电桩管理</router-link>> 添加充电桩
    </div>
    <div class="section-container">
      <div class="section-item-header clearfix">
        <span>充电桩信息</span>
      </div>
      <el-form :model="modelInfo" ref="modelInfo" :rules="dataRules">
        <!-- 基本信息 -->
        <div class="section-info">
          <div class="info-main">
            <div class="info-title">基本信息</div>
            <div class="info-content clearfix">
              <div class="info-left">
                <!-- 名称 -->
                <div class="info-item">
                  <div class="info-item-left"><i>*</i>名称</div>
                  <div class="info-item-right">
                    <el-form-item prop="pile_name">
                      <el-input
                        v-model="modelInfo.pile_name"
                        placeholder="请输入名称"
                      />
                    </el-form-item>
                  </div>
                </div>
                <!-- 所属厂家 -->
                <div class="info-item">
                  <div class="info-item-left"><i>*</i>所属厂家</div>
                  <div class="info-item-right">
                    <el-form-item prop="manufacture_name">
                      <el-input
                        v-model="modelInfo.manufacture_name"
                        placeholder="请输入所属厂家"
                      />
                    </el-form-item>
                  </div>
                </div>
                <!-- 充电桩类型 -->
                <div class="info-item">
                  <div class="info-item-left"><i>*</i>充电桩类型</div>
                  <div class="info-item-right">
                    <el-form-item prop="pile_type">
                      <el-select
                        v-model="modelInfo.pile_type"
                        placeholder="请选择充电桩类型"
                      >
                        <el-option label="直流设备" value="1" />
                        <el-option label="交流设备" value="2" />
                      </el-select>
                    </el-form-item>
                  </div>
                </div>
                <!-- 额定电压 -->
                <div class="info-item">
                  <div class="info-item-left"><i>*</i>额定电压</div>
                  <div class="info-item-right voltage-outer">
                    <div class="voltage-item">
                      <el-form-item prop="voltage_upper">
                        <el-input
                          v-model="modelInfo.voltage_upper"
                          placeholder="上限"
                        />
                        <span class="voltage-unit">V</span>
                      </el-form-item>
                    </div>
                    <div class="voltage-item">
                      <el-input
                        v-model="modelInfo.voltage_lower"
                        placeholder="下限"
                      />
                      <span class="voltage-unit">V</span>
                    </div>
                  </div>
                </div>
                <!-- 充电口数量  -->
                <div class="info-item">
                  <div class="info-item-left"><i>*</i>充电口数量</div>
                  <div class="info-item-right">
                    <el-form-item prop="charging_ports">
                      <el-input
                        v-model.number="modelInfo.charging_ports"
                        placeholder="请输入充电口数量"
                      />
                    </el-form-item>
                  </div>
                </div>
                <!-- 是否支持即插即充 -->
                <div class="info-item">
                  <div class="info-item-left show-app">是否支持即插即充</div>
                  <div class="info-item-right">
                    <div class="radio-outer" prop="status">
                      <el-radio v-model="modelInfo.plug_status" label="1"
                        >是</el-radio
                      >
                      <el-radio v-model="modelInfo.plug_status" label="0"
                        >否</el-radio
                      >
                    </div>
                  </div>
                </div>
                <!-- 充电枪类型 -->
                <div class="info-item">
                  <div class="info-item-left"><i>*</i>充电枪类型</div>
                  <div class="info-item-right">
                    <el-form-item prop="gun_type">
                    <el-select
                      v-model="modelInfo.gun_type"
                      placeholder="请选择充电枪类型"
                    >
                      <el-option label="家用插座" value="1" />
                      <el-option label="交流接口插座" value="2" />
                      <el-option label="交流接口插头" value="3" />
                      <el-option label="直流接口枪头" value="4" />
                      <el-option label="无线充电座" value="5" />
                      <el-option label="其它" value="6" />
                    </el-select>
                    </el-form-item>
                  </div>
                </div>
                <!-- SIM卡号 -->
                <div class="info-item">
                  <div class="info-item-left">SIM卡号</div>
                  <div class="info-item-right">
                    <el-input
                      v-model="modelInfo.sim_card"
                      placeholder="请输入SIM卡号"
                    />
                  </div>
                </div>
              </div>
              <div class="info-right">
                <!-- 运行编码 -->
                <div class="info-item">
                  <div class="info-item-left"><i>*</i>充电桩编号</div>
                  <div class="info-item-right">
                    <el-form-item prop="pile_sn">
                      <el-input
                        v-model="modelInfo.pile_sn"
                        placeholder="请输入充电桩编号"
                      />
                    </el-form-item>
                  </div>
                </div>
                <!-- 型号 -->
                <div class="info-item">
                  <div class="info-item-left">型号</div>
                  <div class="info-item-right">
                    <el-input
                      v-model="modelInfo.model"
                      placeholder="请输入型号"
                    />
                  </div>
                </div>
                <!-- 额定功率 -->
                <div class="info-item">
                  <div class="info-item-left"><i>*</i>额定功率</div>
                  <div class="info-item-right voltage-outer">
                    <div class="voltage-item">
                      <el-form-item prop="power_upper">
                        <el-input
                          v-model="modelInfo.power_upper"
                          placeholder="上限"
                        />
                        <span class="voltage-unit">KW</span>
                      </el-form-item>
                    </div>
                    <div class="voltage-item">
                      <el-input
                        v-model="modelInfo.power_lower"
                        placeholder="下限"
                      />
                      <span class="voltage-unit">KW</span>
                    </div>
                  </div>
                </div>
                <!-- 额定电流 -->
                <div class="info-item">
                  <div class="info-item-left"><i>*</i>额定电流</div>
                  <div class="info-item-right">
                    <el-form-item prop="electric">
                      <el-input
                        v-model="modelInfo.electric"
                        placeholder="请输入额定电流"
                      />
                      <span class="voltage-unit">A</span>
                    </el-form-item>
                  </div>
                </div>
                <!-- 充电口编号 -->
                <div class="info-item">
                  <div class="info-item-left">充电口编号</div>
                  <div class="info-item-right">
                    <el-input disabled v-model="modelInfo.charging_port_sn" />
                  </div>
                </div>
                <!-- 通讯模块MAC -->
                <div class="info-item">
                  <div class="info-item-left">通讯模块MAC</div>
                  <div class="info-item-right">
                    <el-input
                      v-model="modelInfo.communication_mac"
                      placeholder="请输入通讯模块MAC"
                    />
                  </div>
                </div>
                <!-- 桩蓝牙MAC -->
                <div class="info-item">
                  <div class="info-item-left">桩蓝牙MAC</div>
                  <div class="info-item-right">
                    <el-input
                      v-model="modelInfo.bluetooth_mac"
                      placeholder="请输入桩蓝牙MAC"
                    />
                  </div>
                </div>
                <!-- 桩验收时间 -->
                <div class="info-item">
                  <div class="info-item-left"><i>*</i>桩验收时间</div>
                  <div class="info-item-right input-150">
                    <el-form-item prop="oper_date">
                      <el-date-picker v-model="modelInfo.oper_date" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
                    </el-form-item>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 运营信息 -->
        <div class="section-info">
          <div class="info-main">
            <div class="info-title">运营信息</div>
            <div class="info-content clearfix">
              <div class="info-left" style="padding: 24px 0 0 14px">
                <!-- 关联充电站 -->
                <div class="info-item">
                  <div class="info-item-left">关联充电站</div>
                  <div class="info-item-right">
                    <el-form-item prop="station_name">
                      <el-input
                        v-model="modelInfo.station_name"
                        disabled
                        placeholder="填写关联充电站"
                      />
                      <span
                        class="btn_succ operate-btn"
                        @click="showAddStation = true"
                        >选择充电站</span
                      >
                    </el-form-item>
                  </div>
                </div>
                <!-- 充电桩充电功能控制 -->
                <div class="info-item">
                  <div class="info-item-left show-app">充电桩充电功能控制</div>
                  <div class="info-item-right">
                    <div class="radio-outer">
                      <el-radio v-model="modelInfo.user_flag" label="1"
                        >所有用户</el-radio
                      >
                      <el-radio v-model="modelInfo.user_flag" label="2"
                        >名单用户</el-radio
                      >
                    </div>
                    <div v-if="modelInfo.user_flag == 2" class="open-listUser">
                      <div class="listUser-main">
                        <el-form-item prop="_users">
                          <el-input
                            type="hidden"
                            v-model="modelInfo._users"
                          ></el-input>
                          <div class="listUser-content scrollBar clearfix">
                            <div
                              class="listUser-item"
                              v-for="(item, index) in modelInfo.users"
                              :key="index"
                            >
                              <span>{{ getUsersById(item, "nick_name") }}</span>
                              <i
                                class="clear-icon"
                                @click="deleteUserById(item)"
                              ></i>
                            </div>
                          </div>
                        </el-form-item>
                        <span
                          class="btn_succ operate-btn listUser-btn"
                          @click="showAddUser = true"
                          >选择用户</span
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 提交 -->
        <div class="btn_succ section-bottom" @click="saveDeviceInfo">提交</div>
      </el-form>
    </div>
    <!-- 选择充电站 -->
    <div
      is="addStationModel"
      :station_id.sync="modelInfo.station_id"
      :station_name.sync="modelInfo.station_name"
      :showModel.sync="showAddStation"
      source="1"
    ></div>
    <!-- 选择个人用户 -->
    <div
      is="addUserModel"
      :users="userArr"
      :searchUser.sync="searchUser"
      :choosedUser.sync="modelInfo.users"
      :showModel.sync="showAddUser"
    ></div>
  </section>
</template>

<script>
//import addOwnerModel from "./components/addOwnerModel";
import addStationModel from "./components/addStationModel";
import addUserModel from "./components/addUserModel";
export default {
  components: {
    //    addOwnerModel,
    addStationModel,
    addUserModel,
  },
  data() {
    return {
      SaveInfoModelUsers: [], //不用边点击边选择

      showAddOwner: false,
      showAddStation: false,
      showAddUser: false,

      modelInfo: {
        oper_date: '',
        plug_status: '0',
        pile_name: "",
        pile_sn: "",
        manufacture_name: "",
        model: "",
        pile_type: "",
        voltage_upper: "",
        voltage_lower: "",
        charging_ports: "",
        gun_type: "",
        sim_card: "",
        power_upper: "",
        power_lower: "",
        electric: "",
        charging_port_sn: "",
        communication_mac: "",
        bluetooth_mac: "",

        user_flag: "1",
        owner_id: "",
        station_id: "",
        users: [],
        //表单验证冗余字段
        _users: "",
        owner_name: "",
        station_name: "",
      },
      dataRules: {
        pile_name: [
          { required: true, message: "* 请输入名称", trigger: "change" },
        ],
        manufacture_name: [
          { required: true, message: "* 请输入所属厂家", trigger: "change" },
        ],
        pile_type: [
          { required: true, message: "* 请选择充电桩类型", trigger: "change" },
        ],
        voltage_upper: [
          {
            required: true,
            message: "* 请输入电压上限",
            trigger: "change",
          },
        ],
        charging_ports: [
          {
            required: true,
            message: "* 请输入充电口数量",
            trigger: "change",
          },
          {
            type: "number",
            min: 1,
            max: 255,
            message: "* 充电口数量为1~255的整数",
            trigger: "change",
          },
        ],
        gun_type: [
          {
            required: true,
            message: "* 请选择充电枪类型",
            trigger: "change",
          },
        ],
        pile_sn: [
          {
            required: true,
            message: "* 请输入运行编码",
            trigger: "change",
          },
        ],
        power_upper: [
          {
            required: true,
            message: "* 请输入功率上限",
            trigger: "change",
          },
        ],
        electric: [
          {
            required: true,
            message: "* 请输入额定电流",
            trigger: "change",
          },
        ],
        oper_date: [
          {
            required: true,
            message: "* 请输入桩验收时间",
            trigger: "change",
          },
        ],
        owner_name: [],
        station_name: [
          {
            required: true,
            message: "* 请选择关联充电站",
            trigger: "change",
          },
        ],
        _users: [
          {
            required: true,
            message: "* 请选择最少一个用户",
            trigger: "change",
          },
        ],
      },
      userArr: [],
      searchUser: "",
    };
  },
  watch: {
    "showAddUser": {
      handler: function (newItem) {
        if (newItem == false) {
          this.searchUser = '';
          this.getPileUsers();
          //拓展运算符，为了防止指针指向同一个地址，双向绑定
          //防止边点击，输入框边填进去数据
          this.SaveInfoModelUsers = [...this.modelInfo.users]
        }
      },
      deep: true,
    },
    "modelInfo.users": {
      handler: function (newItem) {
        if (newItem.length > 0 || this.modelInfo.user_flag == 1) {
          this.modelInfo._users = "111";
        } else {
          this.modelInfo._users = "";
        }
        //防止边点击，输入框边填进去数据
        //只要弹窗打开，左边填框里面的数据，都等于上次确认的数据
        if (this.showAddUser) {
          this.modelInfo.users = this.SaveInfoModelUsers
        }
      },
      deep: true,
    },
    "modelInfo.user_flag": {
      handler: function (newItem) {
        if (newItem.length > 0 || this.modelInfo.user_flag == 1) {
          this.modelInfo._users = "111";
        } else {
          this.modelInfo._users = "";
        }
      },
      deep: true,
    },
    "modelInfo.charging_ports": {
      handler: function (newItem) {
        var num = isNaN(parseInt(newItem)) ? 0 : parseInt(newItem);
        var portArr = [];
        for (var i = 1; i <= num; i++) {
          portArr.push(i);
        }
        this.modelInfo.charging_port_sn = portArr.join(",");
      },
      deep: true,
    },
  },
  created() {
    this.getPileUsers();
  },
  methods: {
    deleteUserById(id) {
      var index = this.modelInfo.users.indexOf(id);
      if (index > -1) {
        this.modelInfo.users.splice(index, 1);
      }
    },
    //获取用户
    getUsersById(id, key) {
      if (this.userArr.length == 0) return "";
      var user = this.$utils.getArrayItem(this.userArr, "id", id);
      return user && user[key] ? user[key] : "";
    },
    getPileUsers() {
      var _this = this;
      var params = {
        search: _this.searchUser,
      };
      this.$api.pileUsers(params).then((res) => {
        if (res.code == 1) {
          this.userArr = res.data;
        }
      });
    },
    saveDeviceInfo() {
      this.$refs["modelInfo"].validate((valid) => {
        if (valid) {
          this.$api.createPile(this.modelInfo).then((res) => {
            if (res.code == 1) {
              this.$sfNotify({
                message: "成功",
              });
              this.$router.go(-1);
            } else {
              this.$sfNotify({
                duration: 0,
                type: "error",
                message: res.message,
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>
<style scoped lang="scss">
@import "../../assets/css/device/addPile.scss";
</style>
