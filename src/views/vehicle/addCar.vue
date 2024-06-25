<template>
  <section>
    <div class="section-title">
      <span class="section-title section-title-act" @click="handleBackAc()">车辆管理</span>
      <span class="section-title">></span>
      <span class="section-title" v-if="isShowWriteWord == 0 ? true : false">添加车辆</span>
      <span class="section-title" v-if="isShowWriteWord == 0 ? false : true">编辑车辆</span>
    </div>
    <!-- 添加编辑页面  车辆 -->
    <div class="section-container activity-box">
      <div class="section-item-header clearfix">
        <span class="manager-span">
          <div class="section-header">
            <div class="section-item-header">
              <span>{{currentItem.id == 0 ? '添加车辆' : '编辑车辆'}}</span>
            </div>
          </div>
        </span>
      </div>
      <div
        class="box-outer activity-box activity-box-car"
        :title="currentItem.id == 0 ? '添加车辆' : '编辑车辆'"
      >
        <el-form :model="carInfo" ref="carInfo" :rules="dataRules">
          <div class="section-list">
            <div class="section-left">用户账号</div>
            <div class="section-right">
              <el-form-item prop="tel">
                <el-input
                  type="number"
                  maxlength="11"
                  onkeypress="if(value.length>10)value=value.slice(0,10)"
                  v-model="carInfo.tel"
                  placeholder="请填写手机号"
                />
              </el-form-item>
            </div>
          </div>
          <div class="section-list">
            <div class="section-left">车型</div>
            <div class="section-right">
              <el-form-item>
                <el-input
                  maxlength="36"
                  :disabled="true"
                  type="textarea"
                  v-model="carTypeModel"
                  placeholder
                />
              </el-form-item>
              <div class="btn_succ choose-car-type" @click="chooseCarType()">选择车型</div>
            </div>
          </div>
          <div class="section-list">
            <div class="section-left">车牌号</div>
            <div class="section-right">
              <el-form-item prop="license_plate">
                <el-input
                  maxlength="12"
                  type="textarea"
                  v-model="carInfo.license_plate"
                  placeholder="请输入车牌号"
                />
              </el-form-item>
            </div>
          </div>
          <div class="section-list">
            <div class="section-left">车架号</div>
            <div class="section-right">
              <el-form-item prop="car_frame">
                <el-input
                  maxlength="36"
                  type="textarea"
                  v-model="carInfo.car_frame"
                  placeholder="请输入车架号"
                />
              </el-form-item>
            </div>
          </div>
          <div class="section-list">
            <div class="section-left">车辆类型</div>
            <div class="section-right">
              <el-form-item class="radio-outer" prop="status">
                <el-radio v-model="carInfo.car_type" label="2">私家车</el-radio>
                <el-radio v-model="carInfo.car_type" label="1">运营车</el-radio>
              </el-form-item>
            </div>
          </div>
          <div class="section-list">
            <div class="section-left">所属方</div>
            <div class="section-right">
              <el-form-item class="radio-outer" prop="status">
                <el-radio v-model="carInfo.bind_type" label="1" value>个人</el-radio>
                <el-radio v-model="carInfo.bind_type" label="2">企业</el-radio>
              </el-form-item>
            </div>
          </div>
          <div class="section-list" v-if="carInfo.bind_type == '2'">
            <div class="section-left">企业名称</div>
            <div class="section-right">
              <!-- <el-form-item prop="company_name">
                <el-input
                  maxlength="36"
                  type="textarea"
                  v-model="companyname"
                  placeholder="请输入企业名称"
                />
              </el-form-item> -->
              <el-select 
                class="car_company_name_common"
                v-model="companyname" 
                  filterable
                  remote
                  allow-create 
                  default-first-option
                  @focus="showCompanyname"
                  :remote-method="remoteMethod"
                  :loading="loading"
                  placeholder="请输入或选择企业名称">
                  <el-option
                    v-for="(item, index) in company_name"
                    :key="index"
                    :label="item.bind_name"
                    :value="item.bind_name"
                  />
              </el-select>
            </div>
          </div>
        </el-form>
      </div>
      <div class="section-item-header section-item-header-acsubmit"></div>
      <div
        class="box-bottom clearfix"
        style="display: flex;justify-content: center;margin-top:20px;"
      >
        <div class="btn_succ" @click="saveActivitySure(currentItem.id)">提交</div>
      </div>
    </div>
    <div
      is="addCarModel"
      :showModel.sync="showAddUser"
      :activeWordName.sync="carTypeModel"
      @activeWordName="getactiveWordName"
    ></div>
  </section>
</template>

<script>
import addCarModel from "./components/addCarModel";
export default {
  components: {
    addCarModel,
  },
  data() {
    return {
      showAddUser: false, //弹框是否出现
      carTypeModel: "",
      carBrandModel:'',

      company_name:[],
      search_company_name:"",
      loading:false,

      isShowWriteWord: false, //显示‘编辑活动’或者‘添加活动’
      currentPage: 1,
      page_count: 1,
      listLoading: false,
      currentItem: {
        id: 0,
      },
      carInfo: {
        tel: "",
        car_brand_name: '',
        car_type_name: '',
        license_plate: "",
        car_frame: "",
        car_type: "2",
        bind_type: "1",
      },
      companyname:'',
      dataRules: {
        tel: [{ required: true, message: "* 请输入手机号",trigger: "blur" }],
        car_type_name: [
          { required: true, message: "* 请输入车型", trigger: "blur" },
        ],
        license_plate: [
          { required: true, message: "* 请输入车牌号", trigger: "blur" },
        ],
        car_frame: [
          { required: true, message: "* 请输入车架号", trigger: "blur" },
        ],
        // company_name: [
        //   { required: true, message: "* 请输入企业名称", trigger: "blur" },
        // ],
      },
    };
  },
  mounted() {
    this.$nextTick(() => {
      document.documentElement.style.minWidth = "1300px";
    });
  },
  created() {
    this.getVehicleCompanyNameList();
    //通过id,判断是从编辑页面过来才能填数据，保证刷新页面数据不丢失
    if (this.$route.query.id) {
      this.isShowWriteWord = true;
      this.$api
        .VehicleDetail({ id: JSON.parse(this.$route.query.id) })
        .then((data) => {
          this.carInfo = data.data;
          this.carTypeModel = this.carInfo.car_type_name;
          this.carBrandModel = this.carInfo.car_brand_name;
          if(this.carInfo.bind_type == '2'){
            this.companyname = this.carInfo.bind_name;
          }
        });
      this.currentItem.id = JSON.parse(this.$route.query.id);
    }
  },
  methods: {
    showCompanyname(){
      this.$api.getVehicleCompanyNameList({search: ''}).then(data => {
        if (data.code == 1) {
          let list = data.data;
          this.company_name = list;
        }
      });
    },
    remoteMethod(query) {
        this.companyname = query;
        this.getVehicleCompanyNameList();
    },
    getVehicleCompanyNameList() {
      let that = this;
      this.$api.getVehicleCompanyNameList({search: this.companyname}).then(data => {
        if (data.code == 1) {
          let list = data.data;
          this.company_name = list;
        }
      });
    },
    getactiveWordName(val1,val2) {
      this.carTypeModel = val1;
      this.carBrandModel = val2;
    },
    chooseCarType() {
      this.showAddUser = true;
    },
    handleBackAc(num) {
      this.$router.push({ path: "/vehicle/car" });
    },
    saveActivitySure(id) {
      this.carInfo.car_brand_name = this.carBrandModel;
      this.carInfo.car_type_name = this.carTypeModel;
      // 验证是否选择车型
      if (!this.carTypeModel) {
        this.$sfNotify({
          duration: 0,
          type: "error",
          message: "请选择车型",
        });
        return false;
      }
      var rule = /^(?=.*[0-9])(?=.*[a-zA-Z])(.{17,})$/
      if(!rule.test(this.carInfo.car_frame)){
          this.$sfNotify({
              duration: 0,
              type: "error",
              message: "车架号应该为17位字母数字组合",
          });
          return false;
      }
      var license_rule = /([京津晋冀蒙辽吉黑沪苏浙皖闽赣鲁豫鄂湘粤桂琼渝川贵云藏陕甘青宁新][ABCDEFGHJKLMNPQRSTUVWXY][1-9DF][1-9ABCDEFGHJKLMNPQRSTUVWXYZ]\d{3}[1-9DF]|[京津晋冀蒙辽吉黑沪苏浙皖闽赣鲁豫鄂湘粤桂琼渝川贵云藏陕甘青宁新][ABCDEFGHJKLMNPQRSTUVWXY][\dABCDEFGHJKLNMxPQRSTUVWXYZ]{5})/
      if(!license_rule.test(this.carInfo.license_plate)){
          this.$sfNotify({
              duration: 0,
              type: "error",
              message: "请输入正确车牌号",
          });
          return false;
      }
      var reg = /^1\d{10}$/;
      if(!reg.test(this.carInfo.tel.trim())){
          this.$sfNotify({
              duration: 0,
              type: "error",
              message: "请输入正确手机号",
          });
          return false;
      }
      if (id == 0) {
        // 添加
        if (this.carInfo.bind_type == "2") {
          this.carInfo.bind_name = this.companyname;
          if (!this.carInfo.bind_name) {
            this.$sfNotify({
              duration: 0,
              type: "error",
              message: "请填写企业名称!",
            });
            return false;
          }
        }
        this.$refs["carInfo"].validate((valid) => {
          if (valid) {
            this.$api.addVehicleList(this.carInfo).then((data) => {
              if (data.code == 1) {
                this.$sfNotify({
                  message: "成功",
                });
                setTimeout(this.getTableDataList, 2000);
                this.$router.push({ path: "/vehicle/car" });
              } else {
                this.$sfNotify({
                  duration: 0,
                  type: "error",
                  message: data.message,
                });
              }
            });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      } else {
        this.$refs["carInfo"].validate((valid) => {
          if (valid) {
            this.carInfo.id = id;
            this.carInfo.bind_name = this.companyname;
            this.carBrandModel = this.carInfo.car_brand_name;
            this.$api.editVehicleList(this.carInfo).then((data) => {
              if (data.code == 1) {
                this.$sfNotify({
                  message: "成功",
                });
                setTimeout(this.getTableDataList, 2000);
                this.$router.push({ path: "/vehicle/car" });
              } else {
                this.$sfNotify({
                  duration: 0,
                  type: "error",
                  message: data.message,
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
  },
  destroyed() {
    document.documentElement.style.minWidth = "1200px";
  },
};
</script>

<style lang="scss" scoped>
/* @import "../../assets/css/activity/news.scss"; */
@import "../../assets/css/vehicle/addCar.scss";
</style>
