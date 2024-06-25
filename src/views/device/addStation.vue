<template>
  <section>
    <div class="section-title">
      <router-link to="/device/station">充电站管理</router-link>
      > 添加充电站
    </div>
    <div class="section-container">
      <div class="section-item-header clearfix">
        <span>充电站信息</span>
      </div>
      <el-form :model="stationInfo" ref="stationInfo" :rules="dataRules">
        <!-- 基本信息 -->
        <div class="section-info">
          <div class="info-header linear-gradient-btn">基本信息</div>
          <div class="info-main">
            <div class="info-title">基本信息</div>
            <div class="info-content clearfix">
              <div class="info-left">
                <!-- 名称 -->
                <div class="info-item">
                  <div class="info-item-left">
                    <i>*</i>
                    名称
                  </div>
                  <div class="info-item-right">
                    <el-form-item prop="station_name">
                      <el-input v-model="stationInfo.station_name" placeholder="请输入名称" />
                    </el-form-item>
                  </div>
                </div>
                <!-- 站点类型 -->
                <div class="info-item">
                  <div class="info-item-left">
                    <i>*</i>
                    站点类型
                  </div>
                  <div class="info-item-right">
                    <el-form-item prop="station_type">
                      <el-select v-model="stationInfo.station_type" placeholder="请选择站点类型">
                        <el-option label="公共" value="1" />
                        <el-option label="个人" value="50" />
                        <el-option label="公交（专用）" value="100" />
                        <el-option label="环卫（专用）" value="101" />
                        <el-option label="物流（专用）" value="102" />
                        <el-option label="出租车（专用）" value="103" />
                        <el-option label="其他" value="255" />
                      </el-select>
                    </el-form-item>
                  </div>
                </div>
                <!-- 运营状态 -->
                <div class="info-item">
                  <div class="info-item-left">
                    <i>*</i>
                    运营状态
                  </div>
                  <div class="info-item-right">
                    <el-form-item prop="station_status">
                      <el-select v-model="stationInfo.station_status" placeholder="请选择运营状态">
                        <el-option label="未知" value="0" />
                        <el-option label="建设中" value="1" />
                        <el-option label="关闭下线" value="5" />
                        <el-option label="维护中" value="6" />
                        <el-option label="正常使用" value="50" />
                      </el-select>
                    </el-form-item>
                  </div>
                </div>
                <!-- 是否显示在APP -->
                <div class="info-item">
                  <div class="info-item-left show-app">
                    <i>*</i>
                    是否显示在APP
                  </div>
                  <div class="info-item-right">
                    <el-form-item class="radio-outer" prop="is_app">
                      <el-radio v-model="stationInfo.is_app" label="1">是</el-radio>
                      <el-radio v-model="stationInfo.is_app" label="0">否</el-radio>
                    </el-form-item>
                  </div>
                </div>
                <!-- 是否是在小区的充电站 -->
                <div class="info-item">
                  <div class="info-item-left show-app">
                    <i>*</i>
                    是否是小区充电桩
                  </div>
                  <div class="info-item-right">
                    <el-form-item class="radio-outer" prop="is_community">
                      <el-radio v-model="stationInfo.is_community" label="1">是</el-radio>
                      <el-radio v-model="stationInfo.is_community" label="0">否</el-radio>
                    </el-form-item>
                  </div>
                </div>
                <!-- 所属行政区-->
                <div class="info-item">
                  <div class="info-item-left">
                    <i>*</i>
                    所属行政区
                  </div>
                  <div class="info-item-right">
                    <el-form-item prop="address_code" class="four-select-input" @outside="clickOutSide">
                      <el-select @click.native="clickfourselect" :popper-append-to-body="false" v-model="connectLabel"
                        placeholder="请选择所属行政区（ 精确到街道 ）"></el-select>
                    </el-form-item>
                    <el-form-item v-if="fourSelect == '1'">
                      <el-select ref="fourselect" class="four-select-box" :popper-append-to-body="false"
                        v-model="stationInfo.province_code" placeholder="所属行政省" @change="changeProvinceSelect">
                        <div class="four-select">
                          <div :class="{ 'select-checked': fourSelect == 1 }" @click="changeFourSelect('1')">省</div>
                          <div :class="{ 'select-checked': fourSelect == 2 }" @click="changeFourSelect('2')">市</div>
                          <div :class="{ 'select-checked': fourSelect == 3 }" @click="changeFourSelect('3')">区</div>
                          <div :class="{ 'select-checked': fourSelect == 4 }" @click="changeFourSelect('4')">街道</div>
                        </div>
                        <el-option class="province-option" v-for="(item, index) in provinceList" :key="index"
                          :label="item.name" :value="item.code" />
                      </el-select>
                    </el-form-item>
                    <el-form-item v-if="fourSelect == '2'">
                      <el-select ref="fourselect" class="four-select-box" :popper-append-to-body="false"
                        v-model="stationInfo.city_code" placeholder="所属行政市" @change="changeCitySelect">
                        <div class="four-select">
                          <div :class="{ 'select-checked': fourSelect == 1 }" @click="changeFourSelect('1')">省</div>
                          <div :class="{ 'select-checked': fourSelect == 2 }" @click="changeFourSelect('2')">市</div>
                          <div :class="{ 'select-checked': fourSelect == 3 }" @click="changeFourSelect('3')">区</div>
                          <div :class="{ 'select-checked': fourSelect == 4 }" @click="changeFourSelect('4')">街道</div>
                        </div>
                        <el-option class="province-option" v-for="(item, index) in cityList" :key="index"
                          :label="item.name" :value="item.code" />
                      </el-select>
                    </el-form-item>
                    <el-form-item v-if="fourSelect == '3'">
                      <el-select ref="fourselect" class="four-select-box" :popper-append-to-body="false"
                        v-model="stationInfo.area_code" placeholder="所属行政区" @change="changeAreaSelect">
                        <div class="four-select">
                          <div :class="{ 'select-checked': fourSelect == 1 }" @click="changeFourSelect('1')">省</div>
                          <div :class="{ 'select-checked': fourSelect == 2 }" @click="changeFourSelect('2')">市</div>
                          <div :class="{ 'select-checked': fourSelect == 3 }" @click="changeFourSelect('3')">区</div>
                          <div :class="{ 'select-checked': fourSelect == 4 }" @click="changeFourSelect('4')">街道</div>
                        </div>
                        <el-option class="province-option" v-for="(item, index) in areaList" :key="index"
                          :label="item.name" :value="item.code" />
                      </el-select>
                    </el-form-item>
                    <el-form-item prop="town_code" v-if="fourSelect == '4'">
                      <el-select ref="fourselect" class="four-select-box" :popper-append-to-body="false"
                        v-model="stationInfo.town_code" placeholder="街道" @change="changeTownSelect">
                        <div class="four-select">
                          <div :class="{ 'select-checked': fourSelect == 1 }" @click="changeFourSelect('1')">省</div>
                          <div :class="{ 'select-checked': fourSelect == 2 }" @click="changeFourSelect('2')">市</div>
                          <div :class="{ 'select-checked': fourSelect == 3 }" @click="changeFourSelect('3')">区</div>
                          <div :class="{ 'select-checked': fourSelect == 4 }" @click="changeFourSelect('4')">街道</div>
                        </div>
                        <el-option class="province-option" v-for="(item, index) in townList" :key="index"
                          :label="item.name" :value="item.code" />
                      </el-select>
                    </el-form-item>
                  </div>
                </div>
                <!-- 所属功能区 -->
                <div class="info-item">
                  <div class="info-item-left">
                    <i>*</i>
                    所属功能区
                  </div>
                  <div class="info-item-right">
                    <el-form-item prop="construction">
                      <el-select v-model="stationInfo.construction" placeholder="请选择所属功能区">
                        <el-option label="居民区" value="1" />
                        <el-option label="公共机构" value="2" />
                        <el-option label="企事业单位" value="3" />
                        <el-option label="写字楼" value="4" />
                        <el-option label="工业园区" value="5" />
                        <el-option label="交通枢纽" value="6" />
                        <el-option label="大型文体设施" value="7" />
                        <el-option label="城市绿地" value="8" />
                        <el-option label="停车场" value="9" />
                        <el-option label="路边停车位" value="10" />
                        <el-option label="城际高速服务区" value="11" />
                        <el-option label="其他" value="255" />
                      </el-select>
                    </el-form-item>
                  </div>
                </div>
                <!-- 经纬度 -->
                <div class="info-item">
                  <div class="info-item-left">
                    <i>*</i>
                    经纬度
                  </div>
                  <div class="info-item-right">
                    <el-form-item prop="position">
                      <el-input class="station-position" v-model="stationInfo.position" placeholder="请输入经纬度" />
                      <button class="station-position-button"><a
                          href="http://api.map.baidu.com/lbsapi/getpoint/index.html" target="_blank">获取经纬度</a></button>
                    </el-form-item>
                  </div>
                </div>
                <!-- 电站描述 -->
                <div class="info-item">
                  <div class="info-item-left">电站描述</div>
                  <div class="info-item-right">
                    <el-input v-model="stationInfo.description" placeholder="请输入描述" />
                  </div>
                </div>
              </div>
              <div class="info-right">
                <!-- 详细地址 -->
                <div class="info-item">
                  <div class="info-item-left">
                    <i>*</i>
                    详细地址
                  </div>
                  <div class="info-item-right">
                    <el-form-item prop="address">
                      <el-input type="textarea" v-model="stationInfo.address" placeholder="请输入详细地址" />
                    </el-form-item>
                  </div>
                </div>
                <!-- 上传封面图 -->
                <div class="info-item">
                  <div class="info-item-left">上传封面图</div>
                  <div class="info-item-right">
                    <el-upload class="cover-uploader" :action="`${ENV}/activity/upload`" :show-file-list="false"
                      :on-success="uploadCoverImageSuccess">
                      <div v-if="stationInfo.img_url" class="uploader-main">
                        <img :src="real_img_cover_url" class="coverImg" />
                        <div class="edit-uploader">更换图片…</div>
                      </div>
                      <div v-else class="uploader-main__1">
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
                    <el-upload class="nav-uploader" :action="`${ENV}/activity/upload`" :show-file-list="false"
                      :on-success="uploadNavImageSuccess">
                      <div v-if="stationInfo.nav_url" class="uploader-main">
                        <img :src="real_img_nav_url" class="coverImg" />
                        <div class="edit-uploader">更换图片…</div>
                      </div>
                      <div v-else class="uploader-main__1">
                        <div class="uploader-icon"></div>
                      </div>
                    </el-upload>
                  </div>
                  <div class="uploader-detail">* 建议尺寸750*388px</div>
                  <div class="uploader-tips">（只能上传jpg/png格式文件，文件不能超过500kb）</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 运营信息 -->
        <div class="section-info">
          <div class="info-header linear-gradient-btn">运营信息</div>
          <div class="info-main">
            <div class="info-title">运营信息</div>
            <div class="info-content clearfix">
              <div class="info-left">
                <!-- 充电计费方式 -->
                <div class="info-item">
                  <div class="info-item-left show-app">
                    <i>*</i>
                    充电计费方式
                  </div>
                  <div class="info-item-right">
                    <el-form-item prop="payment_type">
                      <el-select v-model="stationInfo.payment_type" placeholder="请选择充电计费方式">
                        <el-option label="现金" value="1" />
                        <el-option label="在线" value="2" />
                      </el-select>
                    </el-form-item>
                  </div>
                </div>
                <!-- 服务电话 -->
                <div class="info-item">
                  <div class="info-item-left">
                    <i>*</i>
                    服务电话
                  </div>
                  <div class="info-item-right">
                    <el-form-item prop="service_tel">
                      <el-input v-model="stationInfo.service_tel" placeholder="填写400电话" />
                    </el-form-item>
                  </div>
                </div>
                <!-- 站点电话 -->
                <div class="info-item">
                  <div class="info-item-left">站点电话</div>
                  <div class="info-item-right">
                    <el-input v-model="stationInfo.station_tel" placeholder="填写站点电话" />
                  </div>
                </div>
                <!-- 是否开放 -->
                <div class="info-item">
                  <div class="info-item-left">
                    <i>*</i>
                    是否开放
                  </div>
                  <div class="info-item-right">
                    <el-form-item class="radio-outer" prop="is_open">
                      <el-radio v-model="stationInfo.is_open" label="1">是</el-radio>
                      <el-radio v-model="stationInfo.is_open" label="0">否</el-radio>
                    </el-form-item>
                    <div v-if="stationInfo.is_open == 1" class="open-interval">
                      <div class="interval-main main-first">
                        <div class="interval-list">
                          <div class="interval-item">
                            <el-select v-model="busine_hours_arr[0].hour">
                              <el-option v-for="(item, index) in hour_arr" :key="index" :label="item" :value="item" />
                            </el-select>
                            <span class="unit">时</span>
                          </div>
                          <div class="interval-item">
                            <el-select v-model="busine_hours_arr[0].minute">
                              <el-option v-for="(item, index) in minute_interval_arr" :key="index" :label="item"
                                :value="item" />
                            </el-select>
                            <span class="unit">分</span>
                          </div>
                        </div>
                        <div class="interval-list interval-text">至</div>
                        <div class="interval-list">
                          <div class="interval-item">
                            <el-select v-model="busine_hours_arr[1].hour">
                              <el-option v-for="(item, index) in hour_arr" :key="index" :label="item" :value="item" />
                            </el-select>
                            <span class="unit">时</span>
                          </div>
                          <div class="interval-item">
                            <el-select v-model="busine_hours_arr[1].minute">
                              <el-option v-for="(item, index) in minute_interval_arr" :key="index" :label="item"
                                :value="item" />
                            </el-select>
                            <span class="unit">分</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 是否允许预约充电桩 -->
                <div class="info-item">
                  <div class="info-item-left show-app">
                    <i>*</i>
                    是否允许预约充电桩
                  </div>
                  <div class="info-item-right">
                    <el-form-item class="radio-outer" prop="support_order">
                      <el-radio v-model="stationInfo.support_order" label="1">是</el-radio>
                      <el-radio v-model="stationInfo.support_order" label="0">否</el-radio>
                    </el-form-item>
                    <div v-if="stationInfo.support_order == 1" class="open-interval">
                      <div class="interval-main">
                        <div class="interval-list">
                          <div class="interval-item">
                            <el-select v-model="stationInfo.support_order_time">
                              <el-option v-for="(item, index) in minute_interval_arr" :key="index" :label="item"
                                :value="item" />
                            </el-select>
                            <span class="unit">分</span>
                          </div>
                          <div class="support_order_frequency">
                            <span class="frequency_world">用户连续预约</span>
                            <el-form-item class="frequency_first" prop="support_order_frequency">
                              <el-input type="text"
                                @input="stationInfo.support_order_frequency = stationInfo.support_order_frequency.replace(/[^\d]/g, '')"
                                class="input-val" v-model.trim="stationInfo.support_order_frequency" />
                            </el-form-item>
                            <span class="frequency_world">次未发起实际充电，用户将在</span>
                            <el-form-item class="frequency_first" prop="support_order_limit_date">
                              <el-input type="text"
                                @input="stationInfo.support_order_limit_date = stationInfo.support_order_limit_date.replace(/[^\d]/g, '')"
                                v-model="stationInfo.support_order_limit_date" />
                            </el-form-item>
                            <span class="frequency_world">天内不可发起预约</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 是否免费停车 -->
                <div class="info-item">
                  <div class="info-item-left show-app">
                    <i>*</i>
                    是否免费停车
                  </div>
                  <div class="info-item-right">
                    <el-form-item class="radio-outer" prop="is_free">
                      <el-radio v-model="stationInfo.is_free" label="1">是</el-radio>
                      <el-radio v-model="stationInfo.is_free" label="0">否</el-radio>
                    </el-form-item>
                  </div>
                </div>
                <div class="info-item" v-if="stationInfo.is_free === '0'">
                  <div class="info-item-left">
                    <i v-if="park_id">*</i>
                    关联停车场
                  </div>
                  <div class="info-item-right">
                    <el-select v-model="park_id" @change="handleChange">
                      <el-option label="无" value="" />
                      <el-option v-for="(option, index) in parkLists" :key="index" :label="option.park_name"
                        :value="option.park_id" />
                    </el-select>
                    <div class="interval-main park-main">
                      <div v-if="park_id">
                        <div class="park-item" v-for="(parkList, index) in stationInfo.park_info" :key="index">
                          <span>{{ parkList.pile_type === '1' ? '直流桩' : '交流桩' }}：</span>
                          充电满
                          <el-form-item :prop="'park_info.' + index + '.min_minute'"
                            :rules="{ required: true, message: '请输入', trigger: 'blur' }">
                            <el-input v-model="parkList.min_minute" placeholder="请输入"
                              oninput="value=value.replace(/^(0+)|[^\d]+/g,'')" />
                          </el-form-item>
                          分钟，可延长减免
                          <el-form-item :prop="'park_info.' + index + '.bonus_minute'"
                            :rules="{ required: true, message: '请输入', trigger: 'blur' }">
                            <el-input v-model="parkList.bonus_minute" placeholder="请输入"
                              oninput="value=value.replace(/^(0+)|[^\d]+/g,'')" />
                          </el-form-item>
                          分钟停车费。
                        </div>
                      </div>
                      <el-input class='park-textarea' type="textarea" v-model="stationInfo.park_note" maxlength="200"
                        placeholder="填写备注信息，填写后可展示在APP内，字数不超过200字。" />
                    </div>
                  </div>
                </div>
                <!-- app显示描述 -->
                <div class="info-item" v-if="stationInfo.is_free === '0'">
                  <div class="info-item-left show-app">app显示描述</div>
                  <div class="info-item-right">
                    <el-input v-model="stationInfo.parking_discount_desc" placeholder="填写app显示描述" :maxlength="20" />
                  </div>
                </div>
                <!-- 标签 -->
                <div class="info-item">
                  <div class="info-item-left show-app">app显示标签</div>
                  <div class="info-item-right">
                    <tag v-model="stationInfo.app_tag"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 充电费率 -->
        <div class="section-info">
          <div class="info-main">
            <div class="info-title">充电费率</div>

            <div class="rate-container">
              <div class="rate-radio">
                <span class="rate-radio-label">选择费率版本</span>
                <el-radio v-model="stationInfo.price_type" label="0">旧版</el-radio>
                <el-radio v-model="stationInfo.price_type" label="1">新版</el-radio>
              </div>
              <div class="chargeRate-tips">
                <div class="chargeRate-tips-left">
                  <div class="warning-icon"></div>
                </div>
                <div class="chargeRate-tips-right">
                  <p>
                    <span>1、</span>“分时费率标准”必须符合24小时制，即“尖峰谷平”四个时段设置的总长为24小时（00:00-24:00），时间格式为HH:mm，否则保存不成功；
                  </p>
                  <p>
                    <span>2、</span>
                    必须有一个以上的时段；
                  </p>
                  <p>
                    <span>3、</span>
                    添加时段，必须连续，最多可创建48个时段，如：10:00-12:00,12:00-13:00，13:00-14:00等...以此类推。
                  </p>
                </div>
              </div>
              <div class="charge-form">
                <div class="chargeRate-container" v-show="stationInfo.price_type === '0'">
                  <!-- 尖时段设置 -->
                  <div class="chargeRate-main">
                    <div class="info-title">
                      <span>尖时段设置</span>
                      <span class="rate-arrow" :class="{ 'rate-arrow-open': chargeRate_1 }"
                        @click="chargeRate_1 = !chargeRate_1"></span>
                    </div>
                    <div v-if="chargeRate_1" class="info-content">
                      <!-- 充电价/充电服务费 -->
                      <div class="chargeRate-header clearfix">
                        <div class="header-item">
                          <div class="header-item-left">充电价</div>
                          <div class="header-item-right">
                            <el-input
                              oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{4,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/, '$1$2.$3').replace(/^\./g, '');if(parseFloat(value)>=5){value=5}"
                              v-model="stationInfo.peak_m" />
                            <div class="unit">元/kWh</div>
                          </div>
                        </div>
                        <div class="header-item last-child">
                          <div class="header-item-left">充电服务费</div>
                          <div class="header-item-right">
                            <el-input
                              oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{4,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/, '$1$2.$3').replace(/^\./g, '');if(parseFloat(value)>=5){value=5}"
                              v-model="stationInfo.peak_ser_m" />
                            <div class="unit">元/kWh</div>
                          </div>
                        </div>
                        <div class="interval-btn">
                          <div v-if="stationInfo._peak_time.length == 0" class="btn_succ add-interval"
                            @click="addTimeInterval('_peak_time')">添加时段</div>
                        </div>
                      </div>
                      <div v-if="stationInfo._peak_time.length > 0" class="chargeRate-content">
                        <div class="chargeRate-content-left">时段</div>
                        <div class="chargeRate-content-right">
                          <div class="chargeRate-list" v-for="(item, index) in stationInfo._peak_time" :key="index">
                            <div class="interval-list">
                              <div class="interval-item">
                                <el-select v-model="item['s']['h']">
                                  <el-option v-for="(item, index) in hour_arr" :key="index" :label="item" :value="item" />
                                </el-select>
                                <span class="unit">时</span>
                              </div>
                              <div class="interval-item">
                                <el-select v-model="item['s']['m']">
                                  <el-option v-for="(item, index) in minute_arr" :key="index" :label="item"
                                    :value="item" />
                                </el-select>
                                <span class="unit">分</span>
                              </div>
                            </div>
                            <div class="interval-list interval-text">至</div>
                            <div class="interval-list">
                              <div class="interval-item">
                                <el-select v-model="item['e']['h']">
                                  <el-option v-for="(item, index) in hour_arr" :key="index" :label="item" :value="item" />
                                </el-select>
                                <span class="unit">时</span>
                              </div>
                              <div class="interval-item">
                                <el-select v-model="item['e']['m']">
                                  <el-option v-for="(item, index) in minute_arr" :key="index" :label="item"
                                    :value="item" />
                                </el-select>
                                <span class="unit">分</span>
                              </div>
                            </div>
                            <div class="interval-btn">
                              <div v-if="index == stationInfo._peak_time.length - 1" class="btn_succ add-interval"
                                @click="addTimeInterval('_peak_time')">添加时段</div>
                              <div class="btn_cancel del-interval" @click="delTimeInterval('_peak_time', index)">删除
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                  <!-- 峰时段设置 -->
                  <div class="chargeRate-main">
                    <div class="info-title">
                      <span>峰时段设置</span>
                      <span class="rate-arrow" :class="{ 'rate-arrow-open': chargeRate_2 }"
                        @click="chargeRate_2 = !chargeRate_2"></span>
                    </div>
                    <div v-if="chargeRate_2" class="info-content">
                      <!-- 充电价/充电服务费 -->
                      <div class="chargeRate-header clearfix">
                        <div class="header-item">
                          <div class="header-item-left">充电价</div>
                          <div class="header-item-right">
                            <el-input
                              oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{4,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/, '$1$2.$3').replace(/^\./g, '');if(parseFloat(value)>=5){value=5}"
                              v-model="stationInfo.high_m" />
                            <div class="unit">元/kWh</div>
                          </div>
                        </div>
                        <div class="header-item last-child">
                          <div class="header-item-left">充电服务费</div>
                          <div class="header-item-right">
                            <el-input
                              oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{4,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/, '$1$2.$3').replace(/^\./g, '');if(parseFloat(value)>=5){value=5}"
                              v-model="stationInfo.high_ser_m" />
                            <div class="unit">元/kWh</div>
                          </div>
                        </div>
                        <div class="interval-btn">
                          <div v-if="stationInfo._high_time.length == 0" class="btn_succ add-interval"
                            @click="addTimeInterval('_high_time')">添加时段</div>
                        </div>
                      </div>
                      <!-- 时段设置 -->
                      <div v-if="stationInfo._high_time.length > 0" class="chargeRate-content">
                        <div class="chargeRate-content-left">时段</div>
                        <div class="chargeRate-content-right">
                          <div class="chargeRate-list" v-for="(item, index) in stationInfo._high_time" :key="index">
                            <div class="interval-list">
                              <div class="interval-item">
                                <el-select v-model="item['s']['h']">
                                  <el-option v-for="(item, index) in hour_arr" :key="index" :label="item" :value="item" />
                                </el-select>
                                <span class="unit">时</span>
                              </div>
                              <div class="interval-item">
                                <el-select v-model="item['s']['m']">
                                  <el-option v-for="(item, index) in minute_arr" :key="index" :label="item"
                                    :value="item" />
                                </el-select>
                                <span class="unit">分</span>
                              </div>
                            </div>
                            <div class="interval-list interval-text">至</div>
                            <div class="interval-list">
                              <div class="interval-item">
                                <el-select v-model="item['e']['h']">
                                  <el-option v-for="(item, index) in hour_arr" :key="index" :label="item" :value="item" />
                                </el-select>
                                <span class="unit">时</span>
                              </div>
                              <div class="interval-item">
                                <el-select v-model="item['e']['m']">
                                  <el-option v-for="(item, index) in minute_arr" :key="index" :label="item"
                                    :value="item" />
                                </el-select>
                                <span class="unit">分</span>
                              </div>
                            </div>
                            <div class="interval-btn">
                              <div v-if="index == stationInfo._high_time.length - 1" class="btn_succ add-interval"
                                @click="addTimeInterval('_high_time')">添加时段</div>
                              <div class="btn_cancel del-interval" @click="delTimeInterval('_high_time', index)">删除
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- 谷时段设置 -->
                  <div class="chargeRate-main">
                    <div class="info-title">
                      <span>谷时段设置</span>
                      <span class="rate-arrow" :class="{ 'rate-arrow-open': chargeRate_3 }"
                        @click="chargeRate_3 = !chargeRate_3"></span>
                    </div>
                    <!-- <sf-collapse-transition> -->
                    <div v-if="chargeRate_3" class="info-content">
                      <!-- 充电价/充电服务费 -->
                      <div class="chargeRate-header clearfix">
                        <div class="header-item">
                          <div class="header-item-left">充电价</div>
                          <div class="header-item-right">
                            <el-input
                              oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{4,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/, '$1$2.$3').replace(/^\./g, '');if(parseFloat(value)>=5){value=5}"
                              v-model="stationInfo.valley_m" />
                            <div class="unit">元/kWh</div>
                          </div>
                        </div>
                        <div class="header-item last-child">
                          <div class="header-item-left">充电服务费</div>
                          <div class="header-item-right">
                            <el-input
                              oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{4,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/, '$1$2.$3').replace(/^\./g, '');if(parseFloat(value)>=5){value=5}"
                              v-model="stationInfo.valley_ser_m" />
                            <div class="unit">元/kWh</div>
                          </div>
                        </div>
                        <div class="interval-btn">
                          <div v-if="stationInfo._valley_time.length == 0" class="btn_succ add-interval"
                            @click="addTimeInterval('_valley_time')">添加时段</div>
                        </div>
                      </div>
                      <!-- 时段设置 -->
                      <div v-if="stationInfo._valley_time.length > 0" class="chargeRate-content">
                        <div class="chargeRate-content-left">时段</div>
                        <div class="chargeRate-content-right">
                          <div class="chargeRate-list" v-for="(item, index) in stationInfo._valley_time" :key="index">
                            <div class="interval-list">
                              <div class="interval-item">
                                <el-select v-model="item['s']['h']">
                                  <el-option v-for="(item, index) in hour_arr" :key="index" :label="item" :value="item" />
                                </el-select>
                                <span class="unit">时</span>
                              </div>
                              <div class="interval-item">
                                <el-select v-model="item['s']['m']">
                                  <el-option v-for="(item, index) in minute_arr" :key="index" :label="item"
                                    :value="item" />
                                </el-select>
                                <span class="unit">分</span>
                              </div>
                            </div>
                            <div class="interval-list interval-text">至</div>
                            <div class="interval-list">
                              <div class="interval-item">
                                <el-select v-model="item['e']['h']">
                                  <el-option v-for="(item, index) in hour_arr" :key="index" :label="item" :value="item" />
                                </el-select>
                                <span class="unit">时</span>
                              </div>
                              <div class="interval-item">
                                <el-select v-model="item['e']['m']">
                                  <el-option v-for="(item, index) in minute_arr" :key="index" :label="item"
                                    :value="item" />
                                </el-select>
                                <span class="unit">分</span>
                              </div>
                            </div>
                            <div class="interval-btn">
                              <div v-if="index == stationInfo._valley_time.length - 1" class="btn_succ add-interval"
                                @click="addTimeInterval('_valley_time')">添加时段</div>
                              <div class="btn_cancel del-interval" @click="delTimeInterval('_valley_time', index)">删除
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- </sf-collapse-transition> -->
                  </div>
                  <!-- 平时段设置 -->
                  <div class="chargeRate-main">
                    <div class="info-title">
                      <span>平时段设置</span>
                      <span class="rate-arrow" :class="{ 'rate-arrow-open': chargeRate_4 }"
                        @click="chargeRate_4 = !chargeRate_4"></span>
                    </div>
                    <!-- <sf-collapse-transition> -->
                    <div v-if="chargeRate_4" class="info-content">
                      <!-- 充电价/充电服务费 -->
                      <div class="chargeRate-header clearfix">
                        <div class="header-item">
                          <div class="header-item-left">充电价</div>
                          <div class="header-item-right">
                            <el-input
                              oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{4,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/, '$1$2.$3').replace(/^\./g, '');if(parseFloat(value)>=5){value=5}"
                              v-model="stationInfo.normal_m" />
                            <div class="unit">元/kWh</div>
                          </div>
                        </div>
                        <div class="header-item last-child">
                          <div class="header-item-left">充电服务费</div>
                          <div class="header-item-right">
                            <el-input
                              oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{4,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/, '$1$2.$3').replace(/^\./g, '');if(parseFloat(value)>=5){value=5}"
                              v-model="stationInfo.normal_ser_m" />
                            <div class="unit">元/kWh</div>
                          </div>
                        </div>
                        <div class="interval-btn">
                          <div v-if="stationInfo._normal_time.length == 0" class="btn_succ add-interval"
                            @click="addTimeInterval('_normal_time')">添加时段</div>
                        </div>
                      </div>
                      <!-- 时段设置 -->
                      <div v-if="stationInfo._normal_time.length > 0" class="chargeRate-content">
                        <div class="chargeRate-content-left">时段</div>
                        <div class="chargeRate-content-right">
                          <div class="chargeRate-list" v-for="(item, index) in stationInfo._normal_time" :key="index">
                            <div class="interval-list">
                              <div class="interval-item">
                                <el-select v-model="item['s']['h']">
                                  <el-option v-for="(item, index) in hour_arr" :key="index" :label="item" :value="item" />
                                </el-select>
                                <span class="unit">时</span>
                              </div>
                              <div class="interval-item">
                                <el-select v-model="item['s']['m']">
                                  <el-option v-for="(item, index) in minute_arr" :key="index" :label="item"
                                    :value="item" />
                                </el-select>
                                <span class="unit">分</span>
                              </div>
                            </div>
                            <div class="interval-list interval-text">至</div>
                            <div class="interval-list">
                              <div class="interval-item">
                                <el-select v-model="item['e']['h']">
                                  <el-option v-for="(item, index) in hour_arr" :key="index" :label="item" :value="item" />
                                </el-select>
                                <span class="unit">时</span>
                              </div>
                              <div class="interval-item">
                                <el-select v-model="item['e']['m']">
                                  <el-option v-for="(item, index) in minute_arr" :key="index" :label="item"
                                    :value="item" />
                                </el-select>
                                <span class="unit">分</span>
                              </div>
                            </div>
                            <div class="interval-btn">
                              <div v-if="index == stationInfo._normal_time.length - 1" class="btn_succ add-interval"
                                @click="addTimeInterval('_normal_time')">添加时段</div>
                              <div class="btn_cancel del-interval" @click="delTimeInterval('_normal_time', index)">删除
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- </sf-collapse-transition> -->
                  </div>
                </div>
                <div class="chargeRate-container" v-show="stationInfo.price_type === '1'">
                  <!-- 尖时段设置 -->
                  <div class="chargeRate-main">
                    <div class="info-title">
                      <span>尖时段设置</span>
                      <span class="rate-arrow" :class="{ 'rate-arrow-open': newPeak }" @click="newPeak = !newPeak"></span>
                    </div>
                    <div v-if="newPeak" class="charge-wrapper">
                      <div v-if="!stationInfo.charging_cost.peak.length" class="btn_succ add-interval empty-btn"
                        @click="newAddTimeInterval('peak', '1')">添加时段</div>

                      <div class="info-content" v-for="(peakList, index) in stationInfo.charging_cost.peak" :key="index">
                        <!-- 充电价/充电服务费 -->
                        <div class="chargeRate-header clearfix">
                          <div class="header-item">
                            <div class="header-item-left">充电价</div>
                            <el-form-item class="header-item-right"
                              :prop="'charging_cost.peak.' + index + '.charging_price'" :rules="dataRules.charging_price">
                              <el-input
                                oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{4,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/, '$1$2.$3').replace(/^\./g, '');if(parseFloat(value)>=5){value=5}"
                                v-model="peakList.charging_price" />
                              <div class="unit">元/kWh</div>
                            </el-form-item>
                          </div>
                          <div class="header-item last-child">
                            <div class="header-item-left">充电服务费</div>
                            <el-form-item class="header-item-right"
                              :prop="'charging_cost.peak.' + index + '.service_price'" :rules="dataRules.service_price">
                              <el-input
                                oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{4,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/, '$1$2.$3').replace(/^\./g, '');if(parseFloat(value)>=5){value=5}"
                                v-model="peakList.service_price" />
                              <div class="unit">元/kWh</div>
                            </el-form-item>
                          </div>
                          <div class="interval-btn">
                            <div v-if="index === stationInfo.charging_cost.peak.length - 1" class="btn_succ add-interval"
                              @click="newAddTimeInterval('peak', '1')">添加时段</div>
                            <div class="btn_cancel del-interval" @click="newDelTimeInterval('peak', index)">删除
                            </div>
                          </div>
                        </div>
                        <!-- 时段设置 -->
                        <div class="chargeRate-content">
                          <div class="chargeRate-content-left">时段</div>
                          <div class="chargeRate-content-right">
                            <div class="chargeRate-list">
                              <div class="interval-list">
                                <div class="interval-item">
                                  <el-select v-model="peakList.period.start_time_h">
                                    <el-option v-for="(item, index) in hour_arr" :key="index" :label="item"
                                      :value="item" />
                                  </el-select>
                                  <span class="unit">时</span>
                                </div>
                                <div class="interval-item">
                                  <el-select v-model="peakList.period.start_time_m">
                                    <el-option v-for="(item, index) in minute_arr" :key="index" :label="item"
                                      :value="item" />
                                  </el-select>
                                  <span class="unit">分</span>
                                </div>
                              </div>
                              <div class="interval-list interval-text">至</div>
                              <div class="interval-list">
                                <div class="interval-item">
                                  <el-select v-model="peakList.period.end_time_h">
                                    <el-option v-for="(item, index) in hour_arr" :key="index" :label="item"
                                      :value="item" />
                                  </el-select>
                                  <span class="unit">时</span>
                                </div>
                                <div class="interval-item">
                                  <el-select v-model="peakList.period.end_time_m">
                                    <el-option v-for="(item, index) in minute_arr" :key="index" :label="item"
                                      :value="item" />
                                  </el-select>
                                  <span class="unit">分</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- 峰时段设置 -->
                  <div class="chargeRate-main">
                    <div class="info-title">
                      <span>峰时段设置</span>
                      <span class="rate-arrow" :class="{ 'rate-arrow-open': newHigh }" @click="newHigh = !newHigh"></span>
                    </div>
                    <div class="charge-wrapper" v-if="newHigh">
                      <div v-if="!stationInfo.charging_cost.high.length" class="btn_succ add-interval empty-btn"
                        @click="newAddTimeInterval('high', '2')">添加时段</div>
                      <div class="info-content" v-for="(highList, index) in stationInfo.charging_cost.high" :key="index">
                        <!-- 充电价/充电服务费 -->
                        <div class="chargeRate-header clearfix">
                          <div class="header-item">
                            <div class="header-item-left">充电价</div>
                            <el-form-item class="header-item-right"
                              :prop="'charging_cost.high.' + index + '.charging_price'" :rules="dataRules.charging_price">
                              <el-input
                                oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{4,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/, '$1$2.$3').replace(/^\./g, '');if(parseFloat(value)>=5){value=5}"
                                v-model="highList.charging_price" />
                              <div class="unit">元/kWh</div>
                            </el-form-item>
                          </div>
                          <div class="header-item last-child">
                            <div class="header-item-left">充电服务费</div>
                            <el-form-item class="header-item-right"
                              :prop="'charging_cost.high.' + index + '.service_price'" :rules="dataRules.service_price">
                              <el-input
                                oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{4,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/, '$1$2.$3').replace(/^\./g, '');if(parseFloat(value)>=5){value=5}"
                                v-model="highList.service_price" />
                              <div class="unit">元/kWh</div>
                            </el-form-item>
                          </div>
                          <div class="interval-btn">
                            <div v-if="index === stationInfo.charging_cost.high.length - 1" class="btn_succ add-interval"
                              @click="newAddTimeInterval('high', '2')">添加时段</div>
                            <div class="btn_cancel del-interval" @click="newDelTimeInterval('high', index)">删除
                            </div>
                          </div>
                        </div>
                        <!-- 时段设置 -->
                        <div class="chargeRate-content">
                          <div class="chargeRate-content-left">时段</div>
                          <div class="chargeRate-content-right">
                            <div class="chargeRate-list">
                              <div class="interval-list">
                                <div class="interval-item">
                                  <el-select v-model="highList.period.start_time_h">
                                    <el-option v-for="(item, index) in hour_arr" :key="index" :label="item"
                                      :value="item" />
                                  </el-select>
                                  <span class="unit">时</span>
                                </div>
                                <div class="interval-item">
                                  <el-select v-model="highList.period.start_time_m">
                                    <el-option v-for="(item, index) in minute_arr" :key="index" :label="item"
                                      :value="item" />
                                  </el-select>
                                  <span class="unit">分</span>
                                </div>
                              </div>
                              <div class="interval-list interval-text">至</div>
                              <div class="interval-list">
                                <div class="interval-item">
                                  <el-select v-model="highList.period.end_time_h">
                                    <el-option v-for="(item, index) in hour_arr" :key="index" :label="item"
                                      :value="item" />
                                  </el-select>
                                  <span class="unit">时</span>
                                </div>
                                <div class="interval-item">
                                  <el-select v-model="highList.period.end_time_m">
                                    <el-option v-for="(item, index) in minute_arr" :key="index" :label="item"
                                      :value="item" />
                                  </el-select>
                                  <span class="unit">分</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- 谷时段设置 -->
                  <div class="chargeRate-main">
                    <div class="info-title">
                      <span>谷时段设置</span>
                      <span class="rate-arrow" :class="{ 'rate-arrow-open': newValley }"
                        @click="newValley = !newValley"></span>
                    </div>
                    <div class="charge-wrapper" v-if="newValley">
                      <div v-if="!stationInfo.charging_cost.valley.length" class="btn_succ add-interval empty-btn"
                        @click="newAddTimeInterval('valley', '4')">添加时段</div>
                      <div class="info-content" v-for="(valleyList, index) in stationInfo.charging_cost.valley"
                        :key="index">
                        <!-- 充电价/充电服务费 -->
                        <div class="chargeRate-header clearfix">
                          <div class="header-item">
                            <div class="header-item-left">充电价</div>
                            <el-form-item class="header-item-right"
                              :prop="'charging_cost.valley.' + index + '.charging_price'"
                              :rules="dataRules.charging_price">
                              <el-input
                                oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{4,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/, '$1$2.$3').replace(/^\./g, '');if(parseFloat(value)>=5){value=5}"
                                v-model="valleyList.charging_price" />
                              <div class="unit">元/kWh</div>
                            </el-form-item>
                          </div>
                          <div class="header-item last-child">
                            <div class="header-item-left">充电服务费</div>
                            <el-form-item class="header-item-right"
                              :prop="'charging_cost.valley.' + index + '.service_price'" :rules="dataRules.service_price">
                              <el-input
                                oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{4,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/, '$1$2.$3').replace(/^\./g, '');if(parseFloat(value)>=5){value=5}"
                                v-model="valleyList.service_price" />
                              <div class="unit">元/kWh</div>
                            </el-form-item>
                          </div>
                          <div class="interval-btn">
                            <div v-if="index === stationInfo.charging_cost.valley.length - 1"
                              class="btn_succ add-interval" @click="newAddTimeInterval('valley', '4')">添加时段</div>
                            <div class="btn_cancel del-interval" @click="newDelTimeInterval('valley', index)">删除
                            </div>
                          </div>
                        </div>
                        <!-- 时段设置 -->
                        <div class="chargeRate-content">
                          <div class="chargeRate-content-left">时段</div>
                          <div class="chargeRate-content-right">
                            <div class="chargeRate-list">
                              <div class="interval-list">
                                <div class="interval-item">
                                  <el-select v-model="valleyList.period.start_time_h">
                                    <el-option v-for="(item, index) in hour_arr" :key="index" :label="item"
                                      :value="item" />
                                  </el-select>
                                  <span class="unit">时</span>
                                </div>
                                <div class="interval-item">
                                  <el-select v-model="valleyList.period.start_time_m">
                                    <el-option v-for="(item, index) in minute_arr" :key="index" :label="item"
                                      :value="item" />
                                  </el-select>
                                  <span class="unit">分</span>
                                </div>
                              </div>
                              <div class="interval-list interval-text">至</div>
                              <div class="interval-list">
                                <div class="interval-item">
                                  <el-select v-model="valleyList.period.end_time_h">
                                    <el-option v-for="(item, index) in hour_arr" :key="index" :label="item"
                                      :value="item" />
                                  </el-select>
                                  <span class="unit">时</span>
                                </div>
                                <div class="interval-item">
                                  <el-select v-model="valleyList.period.end_time_m">
                                    <el-option v-for="(item, index) in minute_arr" :key="index" :label="item"
                                      :value="item" />
                                  </el-select>
                                  <span class="unit">分</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                  <!-- 平时段设置 -->
                  <div class="chargeRate-main">
                    <div class="info-title">
                      <span>平时段设置</span>
                      <span class="rate-arrow" :class="{ 'rate-arrow-open': newNormal }"
                        @click="newNormal = !newNormal"></span>
                    </div>
                    <div class="charge-wrapper" v-if="newNormal">
                      <div v-if="!stationInfo.charging_cost.normal.length" class="btn_succ add-interval empty-btn"
                        @click="newAddTimeInterval('normal', '3')">添加时段</div>
                      <div class="info-content" v-for="(normalList, index) in stationInfo.charging_cost.normal"
                        :key="index">
                        <!-- 充电价/充电服务费 -->
                        <div class="chargeRate-header clearfix">
                          <div class="header-item">
                            <div class="header-item-left">充电价</div>
                            <el-form-item class="header-item-right"
                              :prop="'charging_cost.normal.' + index + '.charging_price'"
                              :rules="dataRules.charging_price">
                              <el-input
                                oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{4,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/, '$1$2.$3').replace(/^\./g, '');if(parseFloat(value)>=5){value=5}"
                                v-model="normalList.charging_price" />
                              <div class="unit">元/kWh</div>
                            </el-form-item>
                          </div>
                          <div class="header-item last-child">
                            <div class="header-item-left">充电服务费</div>
                            <el-form-item class="header-item-right"
                              :prop="'charging_cost.normal.' + index + '.service_price'" :rules="dataRules.service_price">
                              <el-input
                                oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{4,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/, '$1$2.$3').replace(/^\./g, '');if(parseFloat(value)>=5){value=5}"
                                v-model="normalList.service_price" />
                              <div class="unit">元/kWh</div>
                            </el-form-item>
                          </div>
                          <div class="interval-btn">
                            <div v-if="index === stationInfo.charging_cost.normal.length - 1"
                              class="btn_succ add-interval" @click="newAddTimeInterval('normal', '3')">添加时段</div>
                            <div class="btn_cancel del-interval" @click="newDelTimeInterval('normal', index)">删除
                            </div>
                          </div>
                        </div>
                        <!-- 时段设置 -->
                        <div class="chargeRate-content">
                          <div class="chargeRate-content-left">时段</div>
                          <div class="chargeRate-content-right">
                            <div class="chargeRate-list">
                              <div class="interval-list">
                                <div class="interval-item">
                                  <el-select v-model="normalList.period.start_time_h">
                                    <el-option v-for="(item, index) in hour_arr" :key="index" :label="item"
                                      :value="item" />
                                  </el-select>
                                  <span class="unit">时</span>
                                </div>
                                <div class="interval-item">
                                  <el-select v-model="normalList.period.start_time_m">
                                    <el-option v-for="(item, index) in minute_arr" :key="index" :label="item"
                                      :value="item" />
                                  </el-select>
                                  <span class="unit">分</span>
                                </div>
                              </div>
                              <div class="interval-list interval-text">至</div>
                              <div class="interval-list">
                                <div class="interval-item">
                                  <el-select v-model="normalList.period.end_time_h">
                                    <el-option v-for="(item, index) in hour_arr" :key="index" :label="item"
                                      :value="item" />
                                  </el-select>
                                  <span class="unit">时</span>
                                </div>
                                <div class="interval-item">
                                  <el-select v-model="normalList.period.end_time_m">
                                    <el-option v-for="(item, index) in minute_arr" :key="index" :label="item"
                                      :value="item" />
                                  </el-select>
                                  <span class="unit">分</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 提交 -->
        <div class="btn_succ section-bottom" @click="saveStationInfo">提交</div>
      </el-form>
    </div>
  </section>
</template>

<script>
import Tag from './components/Tag'
import { hour_arr, minute_interval_arr, minute_arr } from 'global/global'
// 待优化 封装选择时分组件为一个组件; 费率拆分为单独的form组件
export default {
  components: { Tag },
  data () {
    const onlyDateInt = async (rule, value, callback) => {
      if (this.stationInfo.support_order == 1) {
        if (value == '' || value == null) {
          return callback(new Error('*不能为空'))
        }
        const boolean = parseInt(value) < 3 ? true : false
        if (boolean) {
          return callback(new Error('*最小为3'))
        }
      }
    }
    const onlyDateDint = async (rule, value, callback) => {
      if (this.stationInfo.support_order == 1) {
        if (value == '' || value == null) {
          return callback(new Error('*不能为空'))
        }
        const boolean = parseInt(value) < 0 ? true : false
        if (boolean) {
          return callback(new Error('*最小为0'))
        }
      }
    }
    const onlyAddressCode = async (rule, value, callback) => {
      if (
        !this.stationInfo.province_code ||
        !this.stationInfo.city_code ||
        !this.stationInfo.area_code ||
        !this.stationInfo.town_code
      ) {
        return callback(new Error('*省、市、区、街道均为必填'))
      }
    }

    const selfValidateRule = (message) => {
      return (rule, value, callback) => {
        if (this.stationInfo.price_type === '1' && !value) {
          callback(new Error(message))
          return;
        }
        callback()
      }
    }
    return {
      connectLabel: '',
      provinceLabel: '',
      cityLabel: '',
      areaLabel: '',
      townLabel: '',
      fourSelect: '1',
      ENV: process.env.NODE_ENV == 'development' ? '/api' : '',
      hour_arr: hour_arr,
      minute_interval_arr: minute_interval_arr,
      minute_arr: minute_arr,
      stationInfo: {
        station_name: '',
        station_type: '',
        station_status: '',
        is_app: '1',
        is_community: '0',
        province_code: '',
        city_code: '',
        area_code: '',
        town_code: '',
        construction: '',
        position: '',
        description: '',
        address: '',
        img_url: '',
        nav_url: '',
        payment_type: '', // 充电计费方式
        service_tel: '', // 服务电话
        station_tel: '', // 站点电话
        is_open: '0', // 是否开放
        busine_hours: '00:00-24:00', // 服务时间
        support_order: '0', // 是否允许预约充电桩
        support_order_time: '00', // 预约充电时间
        support_order_frequency: '',
        support_order_limit_date: '',

        peak_m: '', // 尖时刻电费
        peak_ser_m: '', // 尖时刻服务费
        high_m: '', // 峰时刻电费
        high_ser_m: '', // 峰时刻服务费
        valley_m: '', // 谷时刻电费
        valley_ser_m: '', // 谷时刻服务费
        normal_m: '', // 平时刻电费
        normal_ser_m: '', // 平时刻服务费
        _peak_time: [],
        _high_time: [],
        _valley_time: [],
        _normal_time: [],
        app_tag: [],

        charging_cost: {
          peak: [   // 尖时段
          ],
          high: [     // 峰时段
          ],
          valley: [  //谷时段
          ],
          normal: [  //平时段
          ]
        },
        is_free: '0', //是否免费停车 0代表不免费 1代表免费
        park_note: '', //收费停车的说明
        parking_discount_desc: '',
        park_info: [
          {
            bonus_minute: '',
            min_minute: '',
            park_id: '',
            pile_type: '1'
          },
          {
            bonus_minute: '',
            min_minute: '',
            park_id: '',
            pile_type: '2'
          }
        ],
        price_type: '0'
      },
      busine_hours_arr: [
        { hour: '00', minute: '00' },
        { hour: '24', minute: '00' }
      ],
      chargeRate_1: false, // 尖时段费率展示
      chargeRate_2: false, // 峰时段费率展示
      chargeRate_3: false, // 谷时段费率展示
      chargeRate_4: false, // 平时段费率展示

      newPeak: false,
      newHigh: false,
      newValley: false,
      newNormal: false,

      provinceList: [],
      cityList: [],
      areaList: [],
      townList: [],
      real_img_cover_url: '',
      real_img_nav_url: '',
      parkLists: [],
      park_id: '',

      dataRules: {
        station_name: [
          { required: true, message: '* 请输入名称', trigger: 'blur' }
        ],
        station_type: [
          { required: true, message: '* 请选择站点类型', trigger: 'change' }
        ],
        station_status: [
          { required: true, message: '* 请选择运营状态', trigger: 'change' }
        ],
        address_code: [{ validator: onlyAddressCode, trigger: 'blur' }],

        town_code: [
          { required: true, message: '* 请选择街道', trigger: 'blur' }
        ],
        construction: [
          { required: true, message: '* 请选择所属功能区', trigger: 'change' }
        ],
        position: [
          { required: true, message: '* 请输入经纬度', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '* 请输入详细地址', trigger: 'blur' }
        ],
        payment_type: [
          { required: true, message: '* 请选择充电计费方式', trigger: 'change' }
        ],
        service_tel: [
          { required: true, message: '* 请输入服务电话', trigger: 'blur' }
        ],
        support_order_frequency: [{ validator: onlyDateInt, trigger: 'blur' }],
        support_order_limit_date: [{ validator: onlyDateDint, trigger: 'blur' }],
        charging_price: [{ required: true, validator: selfValidateRule('* 充电价必填'), trigger: 'blur' }],
        service_price: [{ required: true, validator: selfValidateRule("* 充电服务费必填"), trigger: 'blur' }]

      },
    }
  },
  computed: {
    peakTime: {
      get: function () {
        return this.getTimeFormat('_peak_time')
      }
    },
    highTime: {
      get: function () {
        return this.getTimeFormat('_high_time')
      }
    },
    valleyTime: {
      get: function () {
        return this.getTimeFormat('_valley_time')
      }
    },
    normalTime: {
      get: function () {
        return this.getTimeFormat('_normal_time')
      }
    }
  },
  watch: {
    busine_hours_arr: {
      handler: function (newItem) {
        var start = newItem[0]['hour'] + ':' + newItem[0]['minute']
        var end = newItem[1]['hour'] + ':' + newItem[1]['minute']
        this.stationInfo.busine_hours = start + '-' + end
      },
      deep: true
    },
    'stationInfo.is_open': {
      handler: function (newItem) {
        if (newItem == '0') {
          this.stationInfo.busine_hours = ''
        } else {
          this.stationInfo.busine_hours = '00:00-24:00'
        }
      },
      deep: true
    },
    fourSelect: {
      handler: function (newItem) {
        // this.changeProvinceSelect()
        if (newItem == '1') {
          this.getProvinceList()
        }
        if (newItem == '2') {
          this.getCityList()
        }
        if (newItem == '3') {
          this.getAreaList()
        }
        if (newItem == '4') {
          this.getTownList()
        }
      },
      deep: true
    }
  },
  created () {
    this.getProvinceList()
    this.getParkLists()
  },
  methods: {
    handleChange () {
      this.$forceUpdate()
      const list = []
      this.stationInfo.park_info.map((item, index) => {
        list.push('park_info.' + index + '.min_minute')
        list.push('park_info.' + index + '.bonus_minute')
      })
      this.$refs['stationInfo'].clearValidate(list)
      this.$set(this.stationInfo, 'park_info', [
        {
          bonus_minute: '',
          min_minute: '',
          park_id: '',
          pile_type: '1'
        },
        {
          bonus_minute: '',
          min_minute: '',
          park_id: '',
          pile_type: '2'
        }
      ])
    },
    //上传图片成功回调
    uploadCoverImageSuccess (res, file) {
      if (res.code == 1) {
        this.stationInfo.img_url = res.url
        this.real_img_cover_url = `${this.ENV}` + res.url
      }
    },
    uploadNavImageSuccess (res, file) {
      if (res.code == 1) {
        this.stationInfo.nav_url = res.url
        this.real_img_nav_url = `${this.ENV}` + res.url
      }
    },
    clickOutSide () {
      this.$refs['fourselect'].blur()
    },
    clickfourselect (e) {
      // 为了让下拉框能够收起和下拉
      var box = e.currentTarget.querySelector('.is-focus')
      if (!box) {
        this.$refs['fourselect'].blur()
        return false
      }
      this.$nextTick((_) => {
        this.$refs['fourselect'].toggleMenu()
      })
    },
    changeFourSelect (val) {
      this.fourSelect = val
    },
    getProvinceList () {
      this.$api.getProvinceList().then((res) => {
        if (res.code == 1) {
          this.provinceList = res.data
        }
      })
    },
    getCityList () {
      var _this = this
      var params = {
        province_code: _this.stationInfo.province_code
      }
      this.$api.getCityList(params).then((res) => {
        if (res.code == 1) {
          this.cityList = res.data
        }
      })
    },
    getAreaList () {
      var _this = this
      var params = {
        city_code: _this.stationInfo.city_code
      }
      this.$api.getStationAreaList(params).then((res) => {
        if (res.code == 1) {
          this.areaList = res.data
        }
      })
    },
    getTownList () {
      var _this = this
      var params = {
        area_code: _this.stationInfo.area_code
      }
      this.$api.getTownList(params).then((res) => {
        if (res.code == 1) {
          this.townList = res.data
        }
      })
    },
    // 获取停车场
    getParkLists () {
      this.$api.getParkLists().then((res) => {
        if (res.code === 1) {
          this.parkLists = res.data
        }
      })
    },

    changeProvinceSelect (val) {
      this.$nextTick((_) => {
        this.$refs['fourselect'].toggleMenu()
      })
      let obj = {}
      obj = this.provinceList.find((item) => {
        return item.code === val //比如：选项2
      })
      //判断是否有选择，如果用户没有选择，但是删除了上一个选择内容，避免控制台报错，需要做一个判断
      if (obj != '' && obj != undefined) {
        this.provinceLabel = obj.name
      }
      this.getCityList()
      this.stationInfo.city_code = ''
      this.stationInfo.area_code = ''
      this.stationInfo.town_code = ''
      this.cityLabel = ''
      this.areaLabel = ''
      this.townLabel = ''

      let address = []
      if (this.provinceLabel) {
        address.push(this.provinceLabel)
        if (this.cityLabel) {
          address.push(this.cityLabel)
          if (this.areaLabel) {
            address.push(this.areaLabel)
            if (this.townLabel) {
              address.push(this.townLabel)
            }
          }
        }
      }
      this.connectLabel = address.join('/')
    },
    changeCitySelect (val) {
      this.$nextTick((_) => {
        this.$refs['fourselect'].toggleMenu()
      })
      let obj = {}
      obj = this.cityList.find((item) => {
        return item.code === val //比如：选项2
      })
      //判断是否有选择，如果用户没有选择，但是删除了上一个选择内容，避免控制台报错，需要做一个判断
      if (obj != '' && obj != undefined) {
        this.cityLabel = obj.name
      }
      this.getAreaList()
      this.stationInfo.area_code = ''
      this.stationInfo.town_code = ''
      this.areaLabel = ''
      this.townLabel = ''

      let address = []
      if (this.provinceLabel) {
        address.push(this.provinceLabel)
        if (this.cityLabel) {
          address.push(this.cityLabel)
          if (this.areaLabel) {
            address.push(this.areaLabel)
            if (this.townLabel) {
              address.push(this.townLabel)
            }
          }
        }
      }
      this.connectLabel = address.join('/')
    },
    changeAreaSelect (val) {
      this.$nextTick((_) => {
        this.$refs['fourselect'].toggleMenu()
      })
      let obj = {}
      obj = this.areaList.find((item) => {
        return item.code === val //比如：选项2
      })
      //判断是否有选择，如果用户没有选择，但是删除了上一个选择内容，避免控制台报错，需要做一个判断
      if (obj != '' && obj != undefined) {
        this.areaLabel = obj.name
      }
      this.getTownList()
      this.stationInfo.town_code = ''
      this.townLabel = ''

      let address = []
      if (this.provinceLabel) {
        address.push(this.provinceLabel)
        if (this.cityLabel) {
          address.push(this.cityLabel)
          if (this.areaLabel) {
            address.push(this.areaLabel)
            if (this.townLabel) {
              address.push(this.townLabel)
            }
          }
        }
      }
      this.connectLabel = address.join('/')
    },
    changeTownSelect (val) {
      let obj = {}
      obj = this.townList.find((item) => {
        return item.code === val //比如：选项2
      })
      //判断是否有选择，如果用户没有选择，但是删除了上一个选择内容，避免控制台报错，需要做一个判断
      if (obj != '' && obj != undefined) {
        this.townLabel = obj.name
      }

      let address = []
      if (this.provinceLabel) {
        address.push(this.provinceLabel)
        if (this.cityLabel) {
          address.push(this.cityLabel)
          if (this.areaLabel) {
            address.push(this.areaLabel)
            if (this.townLabel) {
              address.push(this.townLabel)
            }
          }
        }
      }
      this.connectLabel = address.join('/')
    },
    getTimeFormat (type) {
      var newTime = []
      this.stationInfo[type].forEach((ele) => {
        newTime.push({
          s: ele.s.h + ':' + ele.s.m,
          e: ele.e.h + ':' + ele.e.m
        })
      })
      return newTime
    },
    addTimeInterval (type) {
      var totalTimeInterval =
        this.stationInfo['_peak_time'].length +
        this.stationInfo['_high_time'].length +
        this.stationInfo['_valley_time'].length +
        this.stationInfo['_normal_time'].length
      if (totalTimeInterval >= 48)
        this.$sfNotify({
          duration: 0,
          type: 'error',
          message: '最多可创建48个时段'
        })
      this.stationInfo[type].push({
        s: {
          h: '00',
          m: '00'
        },
        e: {
          h: '24',
          m: '00'
        }
      })
    },
    // 新版添加
    newAddTimeInterval (type, time_period) {
      const attrs = ['peak', 'high', 'normal', 'valley'];
      const _length = attrs.reduce((prev, cur) => (prev + this.stationInfo.charging_cost[cur].length), 0)
      if (_length >= 47) {
        this.$sfNotify({
          duration: 0,
          type: 'error',
          message: '最多可创建48个时段'
        })
        return
      }

      this.stationInfo.charging_cost[type].push({
        charging_price: '',// 充电价
        service_price: '',//服务费
        time_period,
        period: { start_time_h: "00", start_time_m: "00", end_time_h: "24", end_time_m: '00' }
      })
    },

    // 删除
    delTimeInterval (type, ind) {
      this.stationInfo[type] = this.stationInfo[type].filter((item, index) => (ind != index)
      )
    },

    // 新版删除
    newDelTimeInterval (type, ind) {
      this.stationInfo.charging_cost[type] = this.stationInfo.charging_cost[type].filter((item, index) => (ind != index)
      )

    },
    async saveStationInfo () {
      const valid = await this.$refs['stationInfo'].validate().catch(err => err)
      if (!valid) return;

      if (this.stationInfo.price_type === '0') {
        this.stationInfo.peak_time =
          this.peakTime.length > 0 ? this.peakTime : []
        this.stationInfo.high_time =
          this.highTime.length > 0 ? this.highTime : []
        this.stationInfo.valley_time =
          this.valleyTime.length > 0 ? this.valleyTime : []
        this.stationInfo.normal_time =
          this.normalTime.length > 0 ? this.normalTime : []
        if (
          this.peakTime.length == 0 &&
          this.highTime.length == 0 &&
          this.valleyTime.length == 0 &&
          this.normalTime.length == 0
        ) {
          this.$sfNotify({
            duration: 0,
            type: 'error',
            message: '充电费率，必须配置一个以上的时段'
          })
        }

        if (this.peakTime.length > 0) {
          if (
            this.stationInfo.peak_m == '' ||
            this.stationInfo.peak_ser_m == ''
          ) {
            this.$sfNotify({
              duration: 0,
              type: 'error',
              message: '尖时段未设置充电价或服务费'
            })
          }
        }
        if (this.highTime.length > 0) {
          if (
            this.stationInfo.high_m == '' ||
            this.stationInfo.high_ser_m == ''
          ) {
            this.$sfNotify({
              duration: 0,
              type: 'error',
              message: '峰时段未设置充电价或服务费'
            })
          }
        }
        if (this.valleyTime.length > 0) {
          if (
            this.stationInfo.valley_m == '' ||
            this.stationInfo.valley_ser_m == ''
          ) {
            this.$sfNotify({
              duration: 0,
              type: 'error',
              message: '谷时段未设置充电价或服务费'
            })
          }
        }
        if (this.normalTime.length > 0) {
          if (
            this.stationInfo.normal_m == '' ||
            this.stationInfo.normal_ser_m == ''
          ) {
            this.$sfNotify({
              duration: 0,
              type: 'error',
              message: '平时段未设置充电价或服务费'
            })
          }
        }

      }
      const { price_type, charging_cost, ...others } = this.stationInfo
      let params = { price_type, ...others }

      try {
        let charging_lists = Object.values(charging_cost).reduce((prev, item) => prev.concat(item.map(list => ({ ...list, period: { start_time: `${list.period.start_time_h}:${list.period.start_time_m}`, end_time: `${list.period.end_time_h}:${list.period.end_time_m}` } }))), [])
        charging_lists = charging_lists.filter(item => item.charging_price && item.service_price)
        if (price_type === '1' && !charging_lists.length) {
          this.$sfNotify({
            duration: 0,
            type: 'error',
            message: '充电费率，必须配置一个以上的时段'
          })
          return;
        }
        params.charging_cost = JSON.stringify(charging_lists)
      } catch (err) {
        console.log(err)
      }

      if (this.park_id) {
        this.stationInfo.park_info.map((item) => {
          item.park_id = this.park_id
        })
      }
      params = {
        ...params,
        park_info: JSON.stringify(this.stationInfo.park_info),
        app_tag: JSON.stringify(this.stationInfo.app_tag),
      }

      this.$api.createStations(params).then((res) => {
        if (res.code == 1) {
          this.$sfNotify({
            message: '添加成功'
          })
          this.$router.push('/device/station')
        } else {
          this.$sfNotify({
            duration: 0,
            type: 'error',
            message: res.message
          })
        }
      })

    }
  }
}
</script>
<style scoped lang="scss">
@import '../../assets/css/device/addStation.scss';
</style>
