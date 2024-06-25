<template>
  <section>
    <div class="section-title">
      <router-link to="/device/station">充电站管理</router-link> > 充电站详情
    </div>
    <p class="section-name">{{station_name}}</p>
    <div class="section-container">
      <div class="section-item-router">
        <router-link
          :to="`/device/station/detail/${stationInfo.station_id}`"
          class="section-act"
        >基本信息</router-link>
        <router-link :to="`/device/station/operate/${stationInfo.station_id}`">运营信息</router-link>
        <router-link :to="`/device/station/park/${stationInfo.station_id}`">有序充电配置</router-link>
      </div>
      <el-form
        :model="stationInfo"
        ref="stationInfo"
        :rules="dataRules"
      >
        <!-- 基本信息 -->
        <div
          class="section-info"
          v-loading="loadingInfo"
        >
          <div class="info-content clearfix">
            <div class="info-left">
              <!-- 名称 -->
              <div class="info-item">
                <div class="info-item-left"><i>*</i>名称</div>
                <div class="info-item-right">
                  <el-form-item prop="station_name">
                    <el-input
                      v-model="stationInfo.station_name"
                      placeholder="请输入名称"
                    />
                  </el-form-item>
                </div>
              </div>
              <!-- 站点类型 -->
              <div class="info-item">
                <div class="info-item-left"><i>*</i>站点类型</div>
                <div class="info-item-right">
                  <el-form-item prop="station_type">
                    <el-select
                      v-model="stationInfo.station_type"
                      placeholder="请选择站点类型"
                    >
                      <el-option
                        label="公共"
                        value="1"
                      />
                      <el-option
                        label="个人"
                        value="50"
                      />
                      <el-option
                        label="公交（专用）"
                        value="100"
                      />
                      <el-option
                        label="环卫（专用）"
                        value="101"
                      />
                      <el-option
                        label="物流（专用）"
                        value="102"
                      />
                      <el-option
                        label="出租车（专用）"
                        value="103"
                      />
                      <el-option
                        label="其他"
                        value="255"
                      />
                    </el-select>
                  </el-form-item>
                </div>
              </div>
              <!-- 运营状态 -->
              <div class="info-item">
                <div class="info-item-left"><i>*</i>运营状态</div>
                <div class="info-item-right">
                  <el-form-item prop="station_status">
                    <el-select
                      v-model="stationInfo.station_status"
                      placeholder="请选择运营状态"
                    >
                      <el-option
                        label="未知"
                        value="0"
                      />
                      <el-option
                        label="建设中"
                        value="1"
                      />
                      <el-option
                        label="关闭下线"
                        value="5"
                      />
                      <el-option
                        label="维护中"
                        value="6"
                      />
                      <el-option
                        label="正常使用"
                        value="50"
                      />
                    </el-select>
                  </el-form-item>
                </div>
              </div>
              <!-- 是否显示在APP -->
              <div class="info-item">
                <div class="info-item-left show-app"><i>*</i>是否显示在APP</div>
                <div class="info-item-right">
                  <el-form-item
                    class="radio-outer"
                    prop="is_app"
                  >
                    <el-radio
                      v-model="stationInfo.is_app"
                      label="1"
                    >是</el-radio>
                    <el-radio
                      v-model="stationInfo.is_app"
                      label="0"
                    >否</el-radio>
                  </el-form-item>
                </div>
              </div>
              <!-- 是否是在小区的充电站 -->
              <div class="info-item">
                <div class="info-item-left show-app"><i>*</i>是否是小区充电桩</div>
                <div class="info-item-right">
                  <el-form-item
                          class="radio-outer"
                          prop="is_community"
                  >
                    <el-radio
                            v-model="stationInfo.is_community"
                            label="1"
                    >是</el-radio>
                    <el-radio
                            v-model="stationInfo.is_community"
                            label="0"
                    >否</el-radio>
                  </el-form-item>
                </div>
              </div>
              <!-- 所属行政省 -->
              <!-- <div class="info-item">
                <div class="info-item-left"><i>*</i>所属行政区</div>
                <div class="info-item-right province-item">
                  <el-form-item prop="province_code">
                    <el-select
                      v-model="stationInfo.province_code"
                      placeholder="所属行政省"
                      @change="changeProvinceSelect"
                    >
                      <el-option
                        class="province-option"
                        v-for="(item,index) in provinceList"
                        :key="index"
                        :label="item.name"
                        :value="item.code"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item prop="city_code">
                    <el-select
                      v-model="stationInfo.city_code"
                      placeholder="所属行政市"
                      @change="changeCitySelect"
                    >
                      <el-option
                        class="province-option"
                        v-for="(item,index) in cityList"
                        :key="index"
                        :label="item.name"
                        :value="item.code"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item prop="area_code">
                    <el-select
                      v-model="stationInfo.area_code"
                      placeholder="所属行政区"
                    >
                      <el-option
                        class="province-option"
                        v-for="(item,index) in areaList"
                        :key="index"
                        :label="item.name"
                        :value="item.code"
                      />
                    </el-select>
                  </el-form-item>
                </div>
              </div> -->
              <!-- 所属行政区 新-->
              <div class="info-item">
                <div class="info-item-left"><i>*</i>所属行政区</div>
                <div class="info-item-right">
                  <el-form-item prop="address_code" class="four-select-input" @outside="clickOutSide">
                    <el-select
                      @click.native="clickfourselect"
                      :popper-append-to-body="false"
                      v-model="connectLabel"
                      placeholder="请选择所属行政区（ 精确到街道 ）"
                    >
                    </el-select>
                  </el-form-item>
                  <el-form-item prop="province_code" v-if="fourSelect == '1'">
                    <el-select
                      ref="fourselect"
                      class="four-select-box"
                      :popper-append-to-body="false"
                      v-model="stationInfo.province_code"
                      placeholder="所属行政省"
                      @change="changeProvinceSelect"
                    >
                      <div class="four-select">
                        <div :class="{'select-checked' : fourSelect == 1}" @click="changeFourSelect('1')">省</div>
                        <div :class="{'select-checked' : fourSelect == 2}" @click="changeFourSelect('2')">市</div>
                        <div :class="{'select-checked' : fourSelect == 3}" @click="changeFourSelect('3')">区</div>
                        <div :class="{'select-checked' : fourSelect == 4}" @click="changeFourSelect('4')">街道</div>
                      </div>
                      <el-option
                        class="province-option"
                        v-for="(item, index) in provinceList"
                        :key="index"
                        :label="item.name"
                        :value="item.code"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item prop="city_code" v-if="fourSelect == '2'">
                    <el-select
                      ref="fourselect"
                      class="four-select-box"
                      :popper-append-to-body="false"
                      v-model="stationInfo.city_code"
                      placeholder="所属行政市"
                      @change="changeCitySelect"
                    >
                      <div class="four-select">
                        <div :class="{'select-checked' : fourSelect == 1}" @click="changeFourSelect('1')">省</div>
                        <div :class="{'select-checked' : fourSelect == 2}" @click="changeFourSelect('2')">市</div>
                        <div :class="{'select-checked' : fourSelect == 3}" @click="changeFourSelect('3')">区</div>
                        <div :class="{'select-checked' : fourSelect == 4}" @click="changeFourSelect('4')">街道</div>
                      </div>
                      <el-option
                        class="province-option"
                        v-for="(item, index) in cityList"
                        :key="index"
                        :label="item.name"
                        :value="item.code"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item prop="area_code" v-if="fourSelect == '3'">
                    <el-select
                      ref="fourselect"
                      class="four-select-box"
                      :popper-append-to-body="false"
                      v-model="stationInfo.area_code"
                      placeholder="所属行政区"
                      @change="changeAreaSelect"
                    >
                      <div class="four-select">
                        <div :class="{'select-checked' : fourSelect == 1}" @click="changeFourSelect('1')">省</div>
                        <div :class="{'select-checked' : fourSelect == 2}" @click="changeFourSelect('2')">市</div>
                        <div :class="{'select-checked' : fourSelect == 3}" @click="changeFourSelect('3')">区</div>
                        <div :class="{'select-checked' : fourSelect == 4}" @click="changeFourSelect('4')">街道</div>
                      </div>
                      <el-option
                        class="province-option"
                        v-for="(item, index) in areaList"
                        :key="index"
                        :label="item.name"
                        :value="item.code"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item prop="town_code"  v-if="fourSelect == '4'">
                    <el-select
                      ref="fourselect"
                      class="four-select-box"
                      :popper-append-to-body="false"
                      v-model="stationInfo.town_code"
                      placeholder="街道"
                      @change="changeTownSelect"
                    >
                      <div class="four-select">
                        <div :class="{'select-checked' : fourSelect == 1}" @click="changeFourSelect('1')">省</div>
                        <div :class="{'select-checked' : fourSelect == 2}" @click="changeFourSelect('2')">市</div>
                        <div :class="{'select-checked' : fourSelect == 3}" @click="changeFourSelect('3')">区</div>
                        <div :class="{'select-checked' : fourSelect == 4}" @click="changeFourSelect('4')">街道</div>
                      </div>
                      <el-option
                        class="province-option"
                        v-for="(item, index) in townList"
                        :key="index"
                        :label="item.name"
                        :value="item.code"
                      />
                    </el-select>
                  </el-form-item>
                </div>
              </div>
              <!-- 所属功能区 -->
              <div class="info-item">
                <div class="info-item-left"><i>*</i>所属功能区</div>
                <div class="info-item-right">
                  <el-form-item prop="construction">
                    <el-select
                      v-model="stationInfo.construction"
                      placeholder="请选择所属功能区"
                    >
                      <el-option
                        label="居民区"
                        value="1"
                      />
                      <el-option
                        label="公共机构"
                        value="2"
                      />
                      <el-option
                        label="企事业单位"
                        value="3"
                      />
                      <el-option
                        label="写字楼"
                        value="4"
                      />
                      <el-option
                        label="工业园区"
                        value="5"
                      />
                      <el-option
                        label="交通枢纽"
                        value="6"
                      />
                      <el-option
                        label="大型文体设施"
                        value="7"
                      />
                      <el-option
                        label="城市绿地"
                        value="8"
                      />
                      <el-option
                        label="停车场"
                        value="9"
                      />
                      <el-option
                        label="路边停车位"
                        value="10"
                      />
                      <el-option
                        label="城际高速服务区"
                        value="11"
                      />
                      <el-option
                        label="其他"
                        value="255"
                      />
                    </el-select>
                  </el-form-item>
                </div>
              </div>
              <!-- 经纬度 -->
              <div class="info-item">
                <div class="info-item-left"><i>*</i>经纬度</div>
                <div class="info-item-right">
                  <el-form-item prop="position">
                    <el-input
                      class="station-position"
                      v-model="stationInfo.position"
                      placeholder="请输入经纬度，如：116.400819,40.000106"
                    />
                    <button class="station-position-button"><a href="http://api.map.baidu.com/lbsapi/getpoint/index.html" target="_blank">获取经纬度</a></button>
                  </el-form-item>
                </div>
              </div>
              <!-- 电站描述 -->
              <div class="info-item">
                <div class="info-item-left">电站描述</div>
                <div class="info-item-right">
                  <el-input
                    v-model="stationInfo.description"
                    placeholder="请输入描述"
                  />
                </div>
              </div>
            </div>
            <div class="info-right">
              <!-- 详细地址 -->
              <div class="info-item">
                <div class="info-item-left"><i>*</i>详细地址</div>
                <div class="info-item-right">
                  <el-form-item prop="address">
                    <el-input
                      type="textarea"
                      v-model="stationInfo.address"
                      placeholder="请输入详细地址"
                    />
                  </el-form-item>
                </div>
              </div>
              <!-- 上传封面图 -->
              <div class="info-item">
                <div class="info-item-left">上传封面图</div>
                <div class="info-item-right">
                  <el-upload
                    class="cover-uploader"
                    :action="`${ENV}/activity/upload`"
                    :show-file-list="false"
                    :on-success="uploadCoverImageSuccess"
                  >
                    <div
                      v-if="stationInfo.img_url"
                      class="uploader-main"
                    >
                      <img
                        :src="real_img_cover_url"
                        class="coverImg"
                      >
                      <div
                      class="edit-uploader"
                      >更换图片…</div>
                    </div>
                    <div
                      v-else
                      class="uploader-main__1"
                    >
                      <div class="uploader-icon"></div>
                    </div>
                  </el-upload>
                </div>
                <div class="uploader-detail">* 建议尺寸750*750px</div>
                <div class="uploader-tips">（只能上传jpg/png格式文件，文件不能超过500kb）</div>
              </div>
              <!-- 上传导航图 -->
              <div class="info-item">
                <div class="info-item-left">上传导航图</div>
                <div class="info-item-right">
                  <el-upload
                    class="nav-uploader"
                    :action="`${ENV}/activity/upload`"
                    :show-file-list="false"
                    :on-success="uploadNavImageSuccess"
                  >
                    <div
                      v-if="stationInfo.nav_url"
                      class="uploader-main"
                    >
                      <img
                        :src="real_img_nav_url"
                        class="coverImg"
                      >
                      <div
                      class="edit-uploader"
                      >更换图片…</div>
                    </div>
                    <div
                      v-else
                      class="uploader-main__1"
                    >
                      <div class="uploader-icon"></div>
                    </div>
                  </el-upload>
                </div>
                <div class="uploader-detail">* 建议尺寸750*738px</div>
                <div class="uploader-tips">（只能上传jpg/png格式文件，文件不能超过500kb）</div>
              </div>
            </div>
          </div>
          <div
            class="btn_succ"
            @click="saveStationInfo"
          >提交</div>
        </div>
      </el-form>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    const onlyAddressCode = async (rule, value, callback) => {
      if (this.stationInfo.province_code&&this.stationInfo.city_code&&this.stationInfo.area_code&&this.stationInfo.town_code) {
      }else {
        return callback(new Error("*省、市、区、街道均为必填"));
      }
    };
    return {
      connectLabel: '',
      provinceLabel: '',
      cityLabel: '',
      areaLabel: '',
      townLabel: '',
      fourSelect: '1',
      ENV: process.env.NODE_ENV == "development" ? "/api" : "",
      real_img_nav_url: "",
      real_img_cover_url: "",
      loadingInfo: false,
      station_id: this.$route.params.id ? this.$route.params.id : "",
      stationInfo: {
        station_id: this.$route.params.id ? this.$route.params.id : "",
        station_name: "",
        station_type: "",
        station_status: "",
        is_app: "1",
        is_community: "0",
        province_code: "",
        city_code: "",
        area_code: "",
        town_code: "",
        construction: "",
        position: "",
        description: "",
        address: "",
        img_url: "",
        nav_url: "",
        station_lat: "",
        station_lng: ""
      },
      dataRules: {
        station_name: [
          { required: true, message: "* 请输入名称", trigger: "change" }
        ],
        station_type: [
          { required: true, message: "* 请选择站点类型", trigger: "change" }
        ],
        station_status: [
          { required: true, message: "* 请选择运营状态", trigger: "change" }
        ],
        address_code: [
          { validator: onlyAddressCode, trigger: "blur" }
        ],
        province_code: [
          { required: true, message: "* 请选择行政省", trigger: "blur" }
        ],
        city_code: [
          { required: true, message: "* 请选择行政市", trigger: "blur" }
        ],
        area_code: [
          { required: true, message: "* 请选择行政区", trigger: "blur" }
        ],
        construction: [
          { required: true, message: "* 请选择所属功能区", trigger: "change" }
        ],
        position: [
          { required: true, message: "* 请输入经纬度", trigger: "change" }
        ],
        address: [
          { required: true, message: "* 请输入详细地址", trigger: "change" }
        ]
      },

      provinceList: [],
      cityList: [],
      areaList: [],
      townList: [],
      station_name: "",
    };
  },
  watch: {
    "fourSelect": {
      handler: function (newItem) {
        // this.changeProvinceSelect()
        if(newItem == '1') {
          this.getProvinceList()
        }
        if(newItem == '2') {
          this.getCityList()
        }
        if(newItem == '3') {
          this.getAreaList()
        }
        if(newItem == '4') {
          this.getTownList()
        }
      },
      deep: true
    },
  },
  created() {
    this.getStationBasic();
    this.getProvinceList();
    // this.stationInfo.province_code = '350000'
  },
  methods: {
    uploadCoverImageSuccess(res, file) {
      if (res.code == 1) {
        this.stationInfo.img_url = res.url;
        this.real_img_cover_url = `${this.ENV}` + res.url;
      }
    },
    uploadNavImageSuccess(res, file) {
      if (res.code == 1) {
        this.stationInfo.nav_url = res.url;
        this.real_img_nav_url = `${this.ENV}` + res.url;
      }
    },
    clickSelectLabel() {
      
    },
    clickOutSide() {
      this.$refs['fourselect'].blur();
    },
    clickfourselect(e) {
      // 为了让下拉框能够收起和下拉
      var box = e.currentTarget.querySelector('.is-focus')
      if(!box) {
        this.$refs['fourselect'].blur();
        return false;
      }
      this.$nextTick(_ => { this.$refs['fourselect'].toggleMenu(); });
    },
    changeFourSelect(val) {
      this.fourSelect = val;
    },
    getProvinceList () {
      this.$api.getProvinceList().then(res => {
        if (res.code == 1) {
          this.provinceList = res.data;
        }
      });
    },
    getCityList () {
      var _this = this;
      var params = {
        province_code: _this.stationInfo.province_code
      };
      this.$api.getCityList(params).then(res => {
        if (res.code == 1) {
          this.cityList = res.data;
        }
      });
    },
    getAreaList () {
      var _this = this;
      var params = {
        city_code: _this.stationInfo.city_code
      };
      this.$api.getStationAreaList(params).then(res => {
        if (res.code == 1) {
          this.areaList = res.data;
        }
      });
    },
    getTownList () {
      var _this = this;
      var params = {
        area_code: _this.stationInfo.area_code
      };
      this.$api.getTownList(params).then(res => {
        if (res.code == 1) {
          this.townList = res.data;
        }
      });
    },
    changeProvinceSelect (val) {
      this.$nextTick(_ => { this.$refs['fourselect'].toggleMenu(); });
      let obj = {};
        obj = this.provinceList.find((item)=>{
          return item.code === val;//比如：选项2
        });
      //判断是否有选择，如果用户没有选择，但是删除了上一个选择内容，避免控制台报错，需要做一个判断
      if(obj!=""&&obj!=undefined){
        this.provinceLabel = obj.name;
      }
      this.getCityList();
      this.stationInfo.city_code = "";
      this.stationInfo.area_code = "";
      this.stationInfo.town_code = "";
      this.cityLabel = '';
      this.areaLabel = '';
      this.townLabel = '';

      let address = []
      if(this.provinceLabel) {
        address.push(this.provinceLabel)
        if(this.cityLabel) {
          address.push(this.cityLabel)
          if(this.areaLabel) {
            address.push(this.areaLabel)
            if(this.townLabel) {
              address.push(this.townLabel)
            }
          }
        }
      }
      this.connectLabel = address.join('/')

    },
    changeCitySelect (val) {
      this.$nextTick(_ => { this.$refs['fourselect'].toggleMenu(); });
      let obj = {};
        obj = this.cityList.find((item)=>{
          return item.code === val;//比如：选项2
        });
      //判断是否有选择，如果用户没有选择，但是删除了上一个选择内容，避免控制台报错，需要做一个判断
      if(obj!=""&&obj!=undefined){
        this.cityLabel = obj.name;
      }
      this.getAreaList();
      this.stationInfo.area_code = "";
      this.stationInfo.town_code = "";
      this.areaLabel = '';
      this.townLabel = '';

      let address = []
      if(this.provinceLabel) {
        address.push(this.provinceLabel)
        if(this.cityLabel) {
          address.push(this.cityLabel)
          if(this.areaLabel) {
            address.push(this.areaLabel)
            if(this.townLabel) {
              address.push(this.townLabel)
            }
          }
        }
      }
      this.connectLabel = address.join('/')
    },
    changeAreaSelect (val) {
      this.$nextTick(_ => { this.$refs['fourselect'].toggleMenu(); });
      let obj = {};
        obj = this.areaList.find((item)=>{
          return item.code === val;//比如：选项2
        });
      //判断是否有选择，如果用户没有选择，但是删除了上一个选择内容，避免控制台报错，需要做一个判断
      if(obj!=""&&obj!=undefined){
        this.areaLabel = obj.name;
      }
      this.getTownList();
      this.stationInfo.town_code = "";
      this.townLabel = '';

      let address = []
      if(this.provinceLabel) {
        address.push(this.provinceLabel)
        if(this.cityLabel) {
          address.push(this.cityLabel)
          if(this.areaLabel) {
            address.push(this.areaLabel)
            if(this.townLabel) {
              address.push(this.townLabel)
            }
          }
        }
      }
      this.connectLabel = address.join('/')
    },
    changeTownSelect (val) {
      let obj = {};
        obj = this.townList.find((item)=>{
          return item.code === val;//比如：选项2
        });
      //判断是否有选择，如果用户没有选择，但是删除了上一个选择内容，避免控制台报错，需要做一个判断
      if(obj!=""&&obj!=undefined){
        this.townLabel = obj.name;
      }

      let address = []
      if(this.provinceLabel) {
        address.push(this.provinceLabel)
        if(this.cityLabel) {
          address.push(this.cityLabel)
          if(this.areaLabel) {
            address.push(this.areaLabel)
            if(this.townLabel) {
              address.push(this.townLabel)
            }
          }
        }
      }
      this.connectLabel = address.join('/')
    },
    //获取充电站基本信息
    getStationBasic() {
      var id = this.stationInfo.station_id;
      var params = {
        id: id
      };
      this.loadingInfo = true;
      this.$api.getStationBasic(params).then(res => {
        if (res.code == 1) {
          res.data.position = "";
          this.stationInfo = res.data;
          var tempPostion = res.data.station_lng + "," + res.data.station_lat;
          this.stationInfo.position = tempPostion;
          this.stationInfo.province_code = res.data.p_code;
          this.stationInfo.city_code = res.data.c_code;
          this.stationInfo.area_code = res.data.area_code;
          this.stationInfo.town_code = res.data.t_code;
          this.real_img_cover_url = `${this.ENV}` + res.data.img_url;
          this.real_img_nav_url = `${this.ENV}` + res.data.nav_url;
          this.station_name = res.data.station_name;

          this.provinceLabel = res.data.p_name;
          this.cityLabel = res.data.c_name;
          this.areaLabel = res.data.a_name;
          this.townLabel = res.data.t_name;

          let address = []
          if(res.data.p_name) {
            address.push(res.data.p_name)
            if(res.data.c_name) {
              address.push(res.data.c_name)
              if(res.data.a_name) {
                address.push(res.data.a_name)
                if(res.data.t_name) {
                  address.push(res.data.t_name)
                }
              }
            }
          }
          this.connectLabel = address.join('/')

          this.getCityList();
          this.getAreaList();
        }
        this.loadingInfo = false;
      });
    },
    saveStationInfo() {
      this.$refs["stationInfo"].validate(valid => {
        if (valid) {
          this.stationInfo.id = this.station_id;
          this.$api.editStationBasic(this.stationInfo).then(res => {
            if (res.code == 1) {
              this.$sfNotify({
                message: "保存成功"
              });
              this.$router.push("/device/station");
            } else {
              this.$sfNotify({
                type: "error",
                message: res.message
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../assets/css/device/detail.scss";
</style>
