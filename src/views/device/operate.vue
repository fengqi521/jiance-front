<template>
  <section>
    <div class="section-title">
      <router-link to="/device/station">充电站管理</router-link>
      > 充电站详情
    </div>
    <p class="section-name">{{ station_name }}</p>
    <div class="section-container">
      <div class="section-item-router">
        <router-link :to="`/device/station/detail/${stationInfo.station_id}`">基本信息</router-link>
        <router-link :to="`/device/station/operate/${stationInfo.station_id}`" class="section-act">运营信息</router-link>
        <router-link :to="`/device/station/park/${stationInfo.station_id}`">有序充电配置</router-link>
      </div>
      <el-form :model="stationInfo" ref="stationInfo" :rules="dataRules" v-loading="loadingInfo">
        <!-- 运营信息 -->
        <div class="section-info">
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
                <!-- 关联运营商 -->
                <div class="info-item">
                  <div class="info-item-left">
                    <i>*</i>
                    关联运营商
                  </div>
                  <div class="info-item-right">
                    <el-form-item prop="operator_type">
                      <el-select v-model="stationInfo.operator_type" placeholder="运营商类型">
                        <el-option label="自营" value="1" />
                        <el-option label="第三方运营商" value="2" />
                      </el-select>
                    </el-form-item>
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
                              <el-input class="input-val" v-model="stationInfo.support_order_frequency" type="number" />
                            </el-form-item>
                            <span class="frequency_world">次未发起实际充电，用户将在</span>
                            <el-form-item class="frequency_first" prop="support_order_limit_date">
                              <el-input v-model="stationInfo.support_order_limit_date" type="number" />
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
                      <el-radio v-model="stationInfo.is_free_park" label="1">是</el-radio>
                      <el-radio v-model="stationInfo.is_free_park" label="0">否</el-radio>
                    </el-form-item>
                  </div>
                </div>
                <!-- 关联停车场 -->
                <div class="info-item" v-if="stationInfo.is_free_park === '0'">
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
                <div class="info-item" v-if="stationInfo.is_free_park === '0'">
                  <div class="info-item-left show-app">app显示描述</div>
                  <div class="info-item-right">
                    <el-input v-model="stationInfo.parking_discount_desc" placeholder="填写app显示描述" :maxlength="20" />
                  </div>
                </div>
                <!-- 标签 -->
                <div class="info-item">
                  <div class="info-item-left show-app">app显示标签</div>
                  <div class="info-item-right">
                    <tag v-model="stationInfo.app_tag" />
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
            <div class="rate-container" v-if="stationInfo.operator_type === '1'">
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
                      <span class="rate-arrow" :class="{ 'rate-arrow-open': peakShowFlag }"
                        @click="peakShowFlag = !peakShowFlag"></span>
                    </div>
                    <div v-if="peakShowFlag" class="info-content">
                      <!-- 充电价/充电服务费 -->
                      <div class="chargeRate-header clearfix">
                        <div class="header-item">
                          <div class="header-item-left">充电价</div>
                          <div class="header-item-right">
                            <el-input v-model="stationInfo.peak_m"
                              oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{4,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/, '$1$2.$3').replace(/^\./g, '');if(parseFloat(value)>=5){value=5}" />
                            <div class="unit">元/kWh</div>
                          </div>
                        </div>
                        <div class="header-item last-child">
                          <div class="header-item-left">充电服务费</div>
                          <div class="header-item-right">
                            <el-input v-model="stationInfo.peak_ser_m"
                              oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{4,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/, '$1$2.$3').replace(/^\./g, '');if(parseFloat(value)>=5){value=5}" />
                            <div class="unit">元/kWh</div>
                          </div>
                        </div>
                        <div class="interval-btn">
                          <div v-if="stationInfo._peak_time.length == 0" class="btn_succ add-interval"
                            @click="addTimeInterval('_peak_time')">添加时段</div>
                        </div>
                      </div>
                      <!-- 时段设置 -->
                      <div v-if="stationInfo._peak_time.length > 0" class="chargeRate-content">
                        <div class="chargeRate-content-left">时段</div>
                        <div class="chargeRate-content-right">
                          <div class="chargeRate-list" v-for="(item, index) in stationInfo._peak_time" :key="index">
                            <div class="interval-list">
                              <div class="interval-item">
                                <el-select v-model="item['s']['h']">
                                  <el-option v-for="(item, index) in hour_arr" :key="index" :label="item"
                                    :value="item" />
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
                                  <el-option v-for="(item, index) in hour_arr" :key="index" :label="item"
                                    :value="item" />
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
                      <span class="rate-arrow" :class="{ 'rate-arrow-open': highShowFlag }"
                        @click="highShowFlag = !highShowFlag"></span>
                    </div>
                    <div v-if="highShowFlag" class="info-content">
                      <!-- 充电价/充电服务费 -->
                      <div class="chargeRate-header clearfix">
                        <div class="header-item">
                          <div class="header-item-left">充电价</div>
                          <div class="header-item-right">
                            <el-input v-model="stationInfo.high_m"
                              oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{4,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/, '$1$2.$3').replace(/^\./g, '');if(parseFloat(value)>=5){value=5}" />
                            <div class="unit">元/kWh</div>
                          </div>
                        </div>
                        <div class="header-item last-child">
                          <div class="header-item-left">充电服务费</div>
                          <div class="header-item-right">
                            <el-input v-model="stationInfo.high_ser_m"
                              oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{4,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/, '$1$2.$3').replace(/^\./g, '');if(parseFloat(value)>=5){value=5}" />
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
                                  <el-option v-for="(item, index) in hour_arr" :key="index" :label="item"
                                    :value="item" />
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
                                  <el-option v-for="(item, index) in hour_arr" :key="index" :label="item"
                                    :value="item" />
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
                      <span class="rate-arrow" :class="{ 'rate-arrow-open': valleyShowFlag }"
                        @click="valleyShowFlag = !valleyShowFlag"></span>
                    </div>
                    <div v-if="valleyShowFlag" class="info-content">
                      <!-- 充电价/充电服务费 -->
                      <div class="chargeRate-header clearfix">
                        <div class="header-item">
                          <div class="header-item-left">充电价</div>
                          <div class="header-item-right">
                            <el-input v-model="stationInfo.valley_m"
                              oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{4,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/, '$1$2.$3').replace(/^\./g, '');if(parseFloat(value)>=5){value=5}" />
                            <div class="unit">元/kWh</div>
                          </div>
                        </div>
                        <div class="header-item last-child">
                          <div class="header-item-left">充电服务费</div>
                          <div class="header-item-right">
                            <el-input v-model="stationInfo.valley_ser_m"
                              oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{4,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/, '$1$2.$3').replace(/^\./g, '');if(parseFloat(value)>=5){value=5}" />
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
                                  <el-option v-for="(item, index) in hour_arr" :key="index" :label="item"
                                    :value="item" />
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
                                  <el-option v-for="(item, index) in hour_arr" :key="index" :label="item"
                                    :value="item" />
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
                  </div>
                  <!-- 平时段设置 -->
                  <div class="chargeRate-main">
                    <div class="info-title">
                      <span>平时段设置</span>
                      <span class="rate-arrow" :class="{ 'rate-arrow-open': normalShowFlag }"
                        @click="normalShowFlag = !normalShowFlag"></span>
                    </div>
                    <div v-if="normalShowFlag" class="info-content">
                      <!-- 充电价/充电服务费 -->
                      <div class="chargeRate-header clearfix">
                        <div class="header-item">
                          <div class="header-item-left">充电价</div>
                          <div class="header-item-right">
                            <el-input v-model="stationInfo.normal_m"
                              oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{4,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/, '$1$2.$3').replace(/^\./g, '');if(parseFloat(value)>=5){value=5}" />
                            <div class="unit">元/kWh</div>
                          </div>
                        </div>
                        <div class="header-item last-child">
                          <div class="header-item-left">充电服务费</div>
                          <div class="header-item-right">
                            <el-input v-model="stationInfo.normal_ser_m"
                              oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{4,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/, '$1$2.$3').replace(/^\./g, '');if(parseFloat(value)>=5){value=5}" />
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
                                  <el-option v-for="(item, index) in hour_arr" :key="index" :label="item"
                                    :value="item" />
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
                                  <el-option v-for="(item, index) in hour_arr" :key="index" :label="item"
                                    :value="item" />
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
                  </div>
                </div>
                <div class="chargeRate-container" v-show="stationInfo.price_type === '1'">
                  <!-- 尖时段设置 -->
                  <div class="chargeRate-main">
                    <div class="info-title">
                      <span>尖时段设置</span>
                      <span class="rate-arrow" :class="{ 'rate-arrow-open': new_peak }"
                        @click="new_peak = !new_peak"></span>
                    </div>
                    <div v-if="new_peak" class="charge-wrapper">
                      <div v-if="!stationInfo.charging_cost.peak.length" class="btn_succ add-interval empty-btn"
                        @click="newAddTimeInterval('peak', '1')">添加时段</div>
                      <div class="info-content" v-for="(peakList, index) in stationInfo.charging_cost.peak"
                        :key="index">
                        <div class="chargeRate-header clearfix">
                          <div class="header-item">
                            <div class="header-item-left">充电价</div>
                            <el-form-item class="header-item-right"
                              :prop="'charging_cost.peak.' + index + '.charging_price'"
                              :rules="dataRules.charging_price">
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
                            <div v-if="index === stationInfo.charging_cost.peak.length - 1"
                              class="btn_succ add-interval" @click="newAddTimeInterval('peak', '1')">添加时段</div>
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
                      <span class="rate-arrow" :class="{ 'rate-arrow-open': new_high }"
                        @click="new_high = !new_high"></span>
                    </div>
                    <div class="charge-wrapper" v-if="new_high">
                      <div v-if="!stationInfo.charging_cost.high.length" class="btn_succ add-interval empty-btn"
                        @click="newAddTimeInterval('high', '2')">添加时段</div>
                      <div class="info-content" v-for="(highList, index) in stationInfo.charging_cost.high"
                        :key="index">
                        <!-- 充电价/充电服务费 -->
                        <div class="chargeRate-header clearfix">
                          <div class="header-item">
                            <div class="header-item-left">充电价</div>
                            <el-form-item class="header-item-right"
                              :prop="'charging_cost.high.' + index + '.charging_price'"
                              :rules="dataRules.charging_price">
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
                            <div v-if="index === stationInfo.charging_cost.high.length - 1"
                              class="btn_succ add-interval" @click="newAddTimeInterval('high', '2')">添加时段</div>
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
                      <span class="rate-arrow" :class="{ 'rate-arrow-open': new_valley }"
                        @click="new_valley = !new_valley"></span>
                    </div>
                    <div class="charge-wrapper" v-if="new_valley">
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
                              :prop="'charging_cost.valley.' + index + '.service_price'"
                              :rules="dataRules.service_price">
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
                      <span class="rate-arrow" :class="{ 'rate-arrow-open': new_normal }"
                        @click="new_normal = !new_normal"></span>
                    </div>
                    <div class="charge-wrapper" v-if="new_normal">
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
                              :prop="'charging_cost.normal.' + index + '.service_price'"
                              :rules="dataRules.service_price">
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
            <div class="table info-table" v-if="stationInfo.operator_type === '2'">
              <div class="table-th clearfix">
                <div class="table-td">序号</div>
                <div class="table-td">时间段</div>
                <div class="table-td">电费（元/kWh）</div>
                <div class="table-td">服务费（元/kWh）</div>
              </div>
              <div class="table-body">
                <div class="table-tr" v-show="tableData && tableData.length" v-for="(item, index) in tableData"
                  :key="index">
                  <div class="table-td">
                    <div class="td-item">{{ index + 1 }}</div>
                  </div>
                  <div class="table-td">
                    <div class="td-item">{{ item.time || '--' }}</div>
                  </div>
                  <div class="table-td">
                    <div class="td-item">{{ item.elec_price || '--' }}</div>
                  </div>
                  <div class="table-td">
                    <div class="td-item">{{ item.price || '--' }}</div>
                  </div>
                </div>
                <div class="table-tr unData" v-if="!tableData || tableData.length === 0">
                  <img :src="require('assets/img/unData.png')" />
                  <span>暂无数据</span>
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
import { cloneDeep } from 'lodash'
import { hour_arr, minute_interval_arr, minute_arr } from 'global/global'
const attrs = ['peak', 'high', 'normal', 'valley']
const parkArr = [
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
]

export default {
  components: { Tag },
  data() {
    const selfValidateRule = (message) => {
      return (rule, value, callback) => {
        if (this.stationInfo.price_type === '1' && !value) {
          callback(new Error(message))
          return
        }
        callback()
      }
    }
    return {
      loadingInfo: false,
      hour_arr: hour_arr,
      minute_interval_arr: minute_interval_arr,
      minute_arr: minute_arr,
      station_id: this.$route.params.id ? this.$route.params.id : '',
      stationInfo: {
        station_id: this.$route.params.id ? this.$route.params.id : '',
        payment_type: '', // 充电计费方式
        service_tel: '', // 服务电话
        station_tel: '', // 站点电话
        operator_type: '', // 运营商类型
        is_open: '0', // 是否开放
        busine_hours: '', // 服务时间
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
        is_free_park: '0', //是否免费停车 0代表不免费 1代表免费
        parking_discount_desc: '',
        park_note: '', //收费停车的说明

        app_tag: [],
        price_type: '0',
        charging_cost: {
          peak: [
            // 尖时段
          ],
          high: [
            // 峰时段
          ],
          valley: [
            //谷时段
          ],
          normal: [
            //平时段
          ]
        }
      },
      busine_hours_arr: [
        { hour: '00', minute: '00' },
        { hour: '01', minute: '00' }
      ],
      peakShowFlag: false, // 尖时段费率展示
      highShowFlag: false, // 峰时段费率展示
      valleyShowFlag: false, // 谷时段费率展示
      normalShowFlag: false, // 平时段费率展示
      new_peak: false,
      new_high: false,
      new_valley: false,
      new_normal: false,
      dataRules: {
        payment_type: [
          { required: true, message: '* 请选择充电计费方式', trigger: 'change' }
        ],
        service_tel: [
          { required: true, message: '* 请输入服务电话', trigger: 'change' }
        ],
        operator_type: [
          { required: true, message: '* 请选择运营商', trigger: 'change' }
        ],

        charging_price: [
          {
            required: true,
            validator: selfValidateRule('* 充电价必填'),
            trigger: 'blur'
          }
        ],

        service_price: [
          {
            required: true,
            validator: selfValidateRule('* 充电服务费必填'),
            trigger: 'blur'
          }
        ]
      },
      station_name: '',
      tableData: [],
      park_id: '',
      parkLists: []
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
    }
  },
  created() {
    this.getStationOperation()
    this.getParkLists()
  },
  computed: {
    peakTime() {
      return this.getTimeFormat('_peak_time')
    },
    highTime() {
      return this.getTimeFormat('_high_time')
    },
    valleyTime() {
      return this.getTimeFormat('_valley_time')
    },
    normalTime() {
      return this.getTimeFormat('_normal_time')
    }
  },
  methods: {
    handleChange() {
      this.$forceUpdate()
      const list = []
      this.stationInfo.park_info.map((item, index) => {
        list.push('park_info.' + index + '.min_minute')
        list.push('park_info.' + index + '.bonus_minute')
      })
      this.$refs['stationInfo'].clearValidate(list)
      this.$set(this.stationInfo, 'park_info', cloneDeep(parkArr))
    },
    // 获取停车场
    getParkLists() {
      this.$api.getParkLists({ station_id: this.station_id }).then((res) => {
        if (res.code === 1) {
          this.parkLists = res.data
        }
      })
    },

    getTimeFormat(type) {
      var newTime = []
      this.stationInfo[type].forEach((ele) => {
        newTime.push({
          s: ele.s.h + ':' + ele.s.m,
          e: ele.e.h + ':' + ele.e.m
        })
      })
      return newTime
    },
    getStationOperation() {
      var id = this.stationInfo.station_id
      var params = {
        id: id
      }
      this.loadingInfo = true
      this.$api.getStationOperation(params).then((res) => {
        if (res.code == 1) {
          this.station_name = res.data.station_name
          res.data._peak_time = []
          res.data._high_time = []
          res.data._valley_time = []
          res.data._normal_time = []
          res.data.peak_m = ''
          res.data.peak_ser_m = ''
          res.data.high_m = ''
          res.data.high_ser_m = ''
          res.data.valley_m = ''
          res.data.valley_ser_m = ''
          res.data.normal_m = ''
          res.data.normal_ser_m = ''
          var format_time = res.data.format_time
          const { app_tag = '', new_price_rates, ...others } = res.data
          this.stationInfo = others
          if (
            res.data.operator_type === '2' &&
            res.data.format_time &&
            res.data.format_time.normal
          ) {
            res.data.format_time.normal.forEach((item) => {
              item.time = item.s + ' - ' + item.e
            })
            this.tableData = res.data.format_time.normal
          }

          for (const key in format_time) {
            var item = format_time[key]
            var tempItem = []
            item.map(function (item) {
              var sArr = item.s.split(':')
              var eArr = item.e.split(':')
              tempItem.push({
                s: { h: sArr[0], m: sArr[1] },
                e: { h: eArr[0], m: eArr[1] }
              })
            })
            if (item.length > 0) {
              //时段不为空， 则展开对应的时段
              this[key + 'ShowFlag'] = true
            }
            this.stationInfo['_' + key + '_time'] = tempItem
          }
          this.stationInfo.price_type = res.data.price_type
          this.stationInfo.peak_m = res.data.e_peak_m
          this.stationInfo.peak_ser_m = res.data.v_peak_m
          this.stationInfo.high_m = res.data.e_high_m
          this.stationInfo.high_ser_m = res.data.v_high_m
          this.stationInfo.valley_m = res.data.e_valley_m
          this.stationInfo.valley_ser_m = res.data.v_valley_m
          this.stationInfo.normal_m = res.data.e_normal_m
          this.stationInfo.normal_ser_m = res.data.v_normal_m

          //开放时间
          var busine_hours = res.data.busine_hours
          var startAndEnd = busine_hours.split('-')
          if (startAndEnd.length > 1) {
            var start = startAndEnd[0]
            var end = startAndEnd[1]
            var startArr = start.split(':')
            var endArr = end.split(':')

            if (startArr.length > 1) {
              this.busine_hours_arr[0].hour = startArr[0]
              this.busine_hours_arr[0].minute = startArr[1]
            }
            if (endArr.length > 1) {
              this.busine_hours_arr[1].hour = endArr[0]
              this.busine_hours_arr[1].minute = endArr[1]
            }
          }

          //停车场数据
          if (res.data.park_info) {
            if (!res.data.park_info.length) {
              this.$set(this.stationInfo, 'park_info', cloneDeep(parkArr))
            } else {
              this.park_id = this.stationInfo.park_info[0].park_id
            }
          } else {
            this.$set(this.stationInfo, 'park_info', cloneDeep(parkArr))
          }

          // app标签
          try {
            this.$set(this.stationInfo, 'app_tag', JSON.parse(app_tag))
          } catch (err) {
            console.log(err)
          }

          // 新费率
          const lists = attrs.reduce((prev, item, index) => {
            let curData = [
              ...new_price_rates.filter(
                ({ time_period }) => `${index + 1}` === time_period
              )
            ]
            if (curData.length) {
              this[`new_${item}`] = true
              curData = curData.map((item) => {
                const {
                  charging_price,
                  time_period,
                  service_price,
                  ...others
                } = item
                const startTime = others.start_time.split(':')
                const endTime = others.end_time.split(':')
                const start_time_h = startTime[0]
                const start_time_m = startTime[1]
                const end_time_h = endTime[0]
                const end_time_m = endTime[1]
                return {
                  charging_price,
                  time_period,
                  service_price,
                  period: { start_time_h, start_time_m, end_time_h, end_time_m }
                }
              })
            }

            prev[item] = curData
            return prev
          }, {})
          this.$set(this.stationInfo, 'charging_cost', lists)
        }

        this.loadingInfo = false
      })
    },

    addTimeInterval(type) {
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
    newAddTimeInterval(type, time_period) {
      const _length = attrs.reduce(
        (prev, cur) => prev + this.stationInfo.charging_cost[cur].length,
        0
      )
      if (_length >= 47) {
        this.$sfNotify({
          duration: 0,
          type: 'error',
          message: '最多可创建48个时段'
        })
        return
      }

      this.stationInfo.charging_cost[type].push({
        charging_price: '', // 充电价
        service_price: '', //服务费
        time_period,
        period: {
          start_time_h: '00',
          start_time_m: '00',
          end_time_h: '24',
          end_time_m: '00'
        }
      })

      this.$forceUpdate()
    },

    // 删除时间段
    delTimeInterval(type, ind) {
      this.stationInfo[type] = this.stationInfo[type].filter(
        (item, index) => ind != index
      )
    },
    // 新版删除
    newDelTimeInterval(type, ind) {
      this.stationInfo.charging_cost[type] = this.stationInfo.charging_cost[
        type
      ].filter((item, index) => ind != index)
      this.$forceUpdate()
    },
    async saveStationInfo() {
      const valid = await this.$refs['stationInfo']
        .validate()
        .catch((err) => err)
      if (!valid) return
      this.stationInfo.id = this.station_id
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
        let charging_lists = Object.values(charging_cost).reduce(
          (prev, item) =>
            prev.concat(
              item.map((list) => ({
                ...list,
                period: {
                  start_time: `${list.period.start_time_h}:${list.period.start_time_m}`,
                  end_time: `${list.period.end_time_h}:${list.period.end_time_m}`
                }
              }))
            ),
          []
        )
        charging_lists = charging_lists.filter(
          (item) => item.charging_price && item.service_price
        )
        if (price_type === '1' && !charging_lists.length) {
          this.$sfNotify({
            duration: 0,
            type: 'error',
            message: '充电费率，必须配置一个以上的时段'
          })
          return
        }
        params.charging_cost = JSON.stringify(charging_lists)
      } catch (err) {
        console.log(err)
      }

      if (this.park_id) {
        this.stationInfo.park_info.map((item) => {
          item.park_id = this.park_id
        })
      } else {
        this.stationInfo.park_info.map((item) => {
          item.bonus_minute = ''
          item.min_minute = ''
          item.park_id = ''
        })
      }
      params = {
        ...params,
        park_info: JSON.stringify(this.stationInfo.park_info),
        app_tag: JSON.stringify(this.stationInfo.app_tag)
      }

      this.$api.editStationOperation(params).then((res) => {
        if (res.code == 1) {
          this.$sfNotify({
            message: '修改成功'
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
<style lang="scss" scoped>
@import '../../assets/css/device/operate.scss';
</style>
