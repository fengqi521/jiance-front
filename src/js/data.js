export const chartData = {
  //近7天充电启动方式百分比数据映射
  seven_startup_type: {
      s_app_charging: { name: 'APP充电', color: '#80ADFF' },
      s_card_charging: { name: '刷卡充电', color: '#BFD6FF' },
      s_vin_charging: { name: 'VIN充电', color: '#8B93F0' },
      s_account_charging: { name: '账号密码充电', color: '#FFCC76' },
      s_other_charging: { name: '其他', color: '#FFE0D6' },
  },

  //车辆电池类型总数分布数据映射
  battery_type_distribution: {
      lead_battery_num: { name: '铅酸电池', color: '#38B487' },
      iron_phosphate_battery_num: { name: '磷酸铁锂电池', color: '#B3ECD8' },
      hydrogen_battery_num: { name: '氢电池', color: '#80ADFF' },
      lithium_manganate_battery_num: { name: '锰酸锂电池', color: '#BFD6FF' },
      lithium_cobalt_acid_battery_num: { name: '钴酸锂电池', color: '#8B93F0' },
      ternary_material_battery_num: { name: '三元材料电池', color: '#87D1E9' },
      polymer_ion_battery_num: { name: '聚合物离子电池', color: '#FAD346' },
      lithium_titanate_battery_num: { name: '钛酸锂电池', color: '#FFA98C' },
      other_battery_num: { name: '其他', color: '#FFD9CC' },
  },

  //故障恢复时长
  charging_pile_data: {
      today_fault_recovery: { name: '今日故障', color: '#80ADFF' },
      seven_fault_recovery: { name: '近7日故障', color: '#BFD6FF' },
  },

  //今日故障类型
  today_fault_type: {
      car_faults_number: { name: '车辆故障', color: '#5082FF' },
      power_faults_number: { name: '电源故障', color: '#80ADFF' },
      device_faults_number: { name: '设备故障', color: '#BFD6FF' },
      unknown_faults_number: { name: '未知故障', color: '#E6EFFF' },
  },

  //七天故障类型
  seven_fault_type: {
      car_faults_number: { name: '车辆故障', color: '#38B487' },
      power_faults_number: { name: '电源故障', color: '#72CAAA' },
      device_faults_number: { name: '设备故障', color: '#B3ECD8' },
      unknown_faults_number: { name: '未知故障', color: '#E1F4ED' },
  },

  //故障发生时间段分布
  fault_time_distribution: {
      today_fault_occurrence: { name: '今日故障', icon: 'blue_icon', areaStyleColor: 'rgba(128, 173, 255, 0.2)', color: '#80ADFF' },
      seven_fault_occurrence: { name: '近7日故障', icon: 'green_icon', areaStyleColor: 'rgba(56, 180, 135, 0.2)', color: '#38b487' },
  },

  //七天运行数据
  seven_run_data: {
      s_pile_total: { name: '充电桩数量', icon: 'blue_icon', areaStyleColor: 'rgba(128, 173, 255, 0.2)', color: '#80ADFF' },
      s_pile_time: { name: '平均充电时长', icon: 'yellow_icon', areaStyleColor: 'rgba(255, 183, 60, 0.2)', color: '#FFB73C' },
  },

  //七天使用率
  seven_use_data: {
      s_pile_rate: { name: '桩使用率', icon: 'blue_icon', areaStyleColor: 'rgba(128, 173, 255, 0.2)', color: '#80ADFF' },
  },

  //充电实时运行状态
  charging_real_status: {
      s_charging_pile_total: { name: '充电中', color: '#38B487' },
      s_idle_pile_total: { name: '空闲', color: '#B3ECD8' },
      s_book_pile_total: { name: '预约', color: '#80ADFF' },
      s_ready_pile_total: { name: '准备中', color: '#FAD346' },
      s_offline_pile_total: { name: '离线', color: '#FFD9CC' },
      s_fault_pile_total: { name: '故障', color: '#FF6632' },
  },

  //七天营收分析
  seven_revenu_data: {
      s_user_total: { name: '用户量', icon: 'green_icon', color: '#38b487', areaStyleColor: 'rgba(56, 180, 135, 0.2)' },
      s_amount_total: { name: '营收额', icon: 'blue_icon', color: '#80ADFF', areaStyleColor: 'rgba(128, 173, 255, 0.2)' },
  },

  //七天订单数据
  seven_order_data: {
      s_order_total: { name: '订单量', icon: 'orange_icon', color: '#FF6632', areaStyleColor: 'rgba(255, 102, 50, 0.2)' },
      s_amount_total: { name: '营收额', icon: 'blue_icon', color: '#80ADFF', areaStyleColor: 'rgba(128, 173, 255, 0.2)' },
  },
  //七天电量数据
  seven_electic_data: {
      s_quantity_total: { name: '电量', icon: 'yellow_icon', color: '#FFB73C', areaStyleColor: 'rgba(255, 183, 60, 0.2)' },
      s_amount_total: { name: '营收额', icon: 'blue_icon', color: '#80ADFF', areaStyleColor: 'rgba(128, 173, 255, 0.2)' },
  },

  //运营商统计
  operator_stat_status: {
    'charging': { name: '充电中', color: '#38B487' },
    'free': { name: '空闲', color: '#B3ECD8' },
    'appointment': { name: '预约', color: '#80ADFF' },
    'occupy': { name: '准备中', color: '#FAD346' },
    'offline': { name: '离线', color: '#FFD9CC' },
    'error': { name: '故障', color: '#FF6632' },
  },
}
