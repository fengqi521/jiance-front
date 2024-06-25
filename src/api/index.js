import { get, post } from '@/utils/request'

export const server = {
  //用户相关的接口
  doLogin: function (paramObj) {
    return post('/user/login', paramObj)
  },
  //获取公司名称和备案号的接口
  getRecordNumber: function (paramObj) {
    return get('/user/record-number', paramObj)
  },
  doLogout: function (paramObj) {
    return post('/user/logout', paramObj)
  },
  roleList: function (paramObj) {
    return get('/role/roles', paramObj)
  },
  // ------------------  车辆管理  开始
  //获取车辆的列表
  getVehicleList: function (paramObj) {
    return get('/vhm/list', paramObj)
  },
  //删除车辆的列表
  deleteVehicleList: function (paramObj) {
    return post('/vhm/delete-vhm', paramObj)
  },
  //添加车辆的列表
  addVehicleList: function (paramObj) {
    return post('/vhm/create-vhm', paramObj)
  },
  //添加车辆 获取车辆的下拉列表
  getVehicleCompanyNameList: function (paramObj) {
    return get('/vhm/get-company-list', paramObj)
  },
  //修改车辆列表
  editVehicleList: function (paramObj) {
    return post('/vhm/update-vhm', paramObj)
  },
  //批量修改即插即充
  vehicleBarthUpdate: function (paramObj) {
    return post('/vhm/barth-update', paramObj)
  },
  //修改 -- 车辆详情
  VehicleDetail: function (paramObj) {
    return get('/vhm/detail', paramObj)
  },
  //获取企业名称的列表
  getCompanyList: function (paramObj) {
    return get('/vhm/get-company-list', paramObj)
  },
  //添加 -- 获取车品牌名称
  getVehicleChooseBrand: function (paramObj) {
    return get('/vhm/get-brand', paramObj)
  },
  //添加-- 搜索 -- 获取车品牌名称
  getVehicleSearchBrand: function (paramObj) {
    return get('/vhm/get-like-brand', paramObj)
  },
  //添加 -- 获取车型名称
  getVehicleChooseType: function (paramObj) {
    return get('/vhm/get-vehicle', paramObj)
  },
  //修改车辆状态
  editVehicleStatus: function (paramObj) {
    return post('/vhm/change-status', paramObj)
  },
  //获取车型的列表
  getVehicleType: function (paramObj) {
    return get('/vehicle/list', paramObj)
  },
  //添加车型
  addVehicleType: function (paramObj) {
    return post('/vehicle/create-vehicle', paramObj)
  },
  ///添加车型获取车品牌列表
  addVehicleBrandList: function (paramObj) {
    return get('/vehicle/drop-list', paramObj)
  },
  //修改车型
  editVehicleType: function (paramObj) {
    return post('/vehicle/update-vehicle', paramObj)
  },
  //获取车品牌的列表
  getVehicleBrand: function (paramObj) {
    return get('/vehicle/brand-list', paramObj)
  },
  //添加车品牌
  addVehicleBrand: function (paramObj) {
    return post('/vehicle/create-brand', paramObj)
  },
  //修改车品牌
  editVehicleBrand: function (paramObj) {
    return post('/vehicle/update-brand', paramObj)
  },
  // ---------------------车辆管理  结束
  //--------------------------卡信息管理  开始
  //卡信息列表
  getCardList: function (paramObj) {
    return get('/card/list', paramObj)
  },
  //卡详情 top列表
  getCardDetailTop: function (paramObj) {
    return get('/card/card-detail', paramObj)
  },
  //卡详情 充值详情列表
  getCardDetailList: function (paramObj) {
    return get('/card/card-recharge', paramObj)
  },
  //卡详情 消费金额列表
  getCardAccountList: function (paramObj) {
    return get('/card/card-bill', paramObj)
  },
  //卡详情 消费金额详情  卡账单列表
  getCardAccountTradList: function (paramObj) {
    return get('/card/bill-detail', paramObj)
  },
  //--------------------------卡信息管理  结束
  //----------------------用户管理  开始
  //获取群组的列表
  getGroupList: function (paramObj) {
    return get('/group/group/list', paramObj)
  },
  //添加群组列表
  addGroupList: function (paramObj) {
    return post('/group/group/create-group', paramObj)
  },
  //编辑-获取详情群组列表
  editGroupList: function (paramObj) {
    return get('/group/group/detail', paramObj)
  },
  //修改群组列表
  updateGroupList: function (paramObj) {
    return post('/group/group/update-group', paramObj)
  },
  //删除群组列表
  deleteGroupList: function (paramObj) {
    return post('/group/group/delete', paramObj)
  },
  //获取下拉企业名称
  getGroupCompanyTitle: function (paramObj) {
    return get('/group/group/get-drop-list', paramObj)
  },
  //获取企业名称列表  修改或添加时调用该接口
  getGroupCompanyName: function (paramObj) {
    return get('/group/group/get-company-list', paramObj)
  },
  //获取个人列表  修改或添加时调用该接口
  getGroupUserName: function (paramObj) {
    return get('/group/group/get-vehicle-list', paramObj)
  },
  //查看群组详情
  GroupDetail: function (paramObj) {
    return get('/group/group/get-info', paramObj)
  },
  //----------------------用户管理  结束
  // 站列表
  stations: function (paramObj) {
    return get('/station/stations', paramObj)
  },
  // 获取停车场列表
  getParkLists: function (paramObj) {
    return post('/station/park-list', paramObj)
  },

  // 添加充电站
  createStations: function (paramObj) {
    return post('/station/create', paramObj)
  },
  deleteStation: function (paramObj) {
    return post('/station/delete', paramObj)
  },
  // 添加充电站的省份代码
  getProvinceList: function (paramObj) {
    return get('/station/provinces', paramObj)
  },
  // 添加充电站的城市代码
  getCityList: function (paramObj) {
    return get('/station/cities', paramObj)
  },
  // 添加充电站的区代码
  getStationAreaList: function (paramObj) {
    return get('/station/district', paramObj)
  },
  // 添加充电站的街道代码
  getTownList: function (paramObj) {
    return get('/station/town', paramObj)
  },
  // 充电站基本信息
  getStationBasic: function (paramObj) {
    return get('/station/basic', paramObj)
  },
  // 充电站运营信息
  getStationOperation: function (paramObj) {
    return get('/station/operation', paramObj)
  },
  // 充电站有序充电配置
  getStationLimitCharge: function (paramObj) {
    return get('/station/get-limit-charge', paramObj)
  },
  // 保存充电站有序充电配置
  editStationLimitCharge: function (paramObj) {
    return post('/station/edit-limit-charge', paramObj)
  },
  // 查看优惠
  getDiscountList: function (paramObj) {
    return get('/station/discount', paramObj)
  },
  // 编辑充电站基本信息
  editStationBasic: function (paramObj) {
    return post('/station/edit-basic', paramObj)
  },
  // 编辑充电站运营信息
  editStationOperation: function (paramObj) {
    return post('/station/edit-operation', paramObj)
  },
  //-------------- 桩 开始--------------------
  // 桩列表
  piles: function (paramObj) {
    return get('/pile/piles', paramObj)
  },
  // 桩列表 站下拉框
  pilesStation: function () {
    return get('/station/get-stations')
  },
  // 代理商权限修改
  pileAgentStation: function (paramObj) {
    return get('/pile/get-station', paramObj)
  },
  // 桩 设备运维
  pileDevice: function (paramObj) {
    return get('/pile/device', paramObj)
  },
  // 桩 添加
  createPile: function (paramObj) {
    return post('/pile/create', paramObj)
  },
  // 桩 关联业主列表
  pileStations: function (paramObj) {
    return get('/pile/stations', paramObj)
  },
  // 桩 关联业主列表
  pileOwners: function (paramObj) {
    return get('/pile/owners', paramObj)
  },
  // 代理商列表
  pileAgent: function (paramObj) {
    return get('/pile/agent', paramObj)
  },
  // 桩 关联用户列表
  pileUsers: function (paramObj) {
    return get('/pile/users', paramObj)
  },
  // 桩 详情
  pileBasicDetail: function (paramObj) {
    return get('/pile/basic', paramObj)
  },
  // 桩 运营详情
  pileOperationDetail: function (paramObj) {
    return get('/pile/operation', paramObj)
  },
  // 桩 编辑基本信息
  pileBasicEdit: function (paramObj) {
    return post('/pile/edit-basic', paramObj)
  },
  // 桩 编辑运营信息
  pileOperationEdit: function (paramObj) {
    return post('/pile/edit-operation', paramObj)
  },
  // 充电枪解锁
  pileGunUnLock: function (paramObj) {
    return post('/pile/un-lock', paramObj)
  },
  // 桩 停止枪
  pileGunStop: function (paramObj) {
    return post('/pile/stop', paramObj)
  },
  // 桩 重启
  pileRestart: function (paramObj) {
    return post('/pile/restart', paramObj)
  },
  // 桩 故障运维
  pileFault: function (paramObj) {
    return get('/pile/fault', paramObj)
  },
  // 桩 故障恢复
  pileResume: function (paramObj) {
    return post('/pile/resume', paramObj)
  },
  //导入白名单资产
  importChargingPile: function (paramObj) {
    return post('/pile/save-charging-pile', paramObj)
  },

  //-------------- 桩 结束--------------------
  // 设备资产 基础信息
  assetBasic: function () {
    return get('/assets/basic')
  },
  // 设备资产列表
  assetsAssets: function (paramObj) {
    return get('/assets/assets', paramObj)
  },
  // 设置资产 停用、启用桩
  assetsStatus: function (paramObj) {
    return post('/assets/status', paramObj)
  },
  // 设置资产 编辑备注信息
  assetsDescription: function (paramObj) {
    return post('/assets/description', paramObj)
  },
  //获取资产管理下拉企业列表
  assetsEnterprise: function (paramObj) {
    return get('/assets/drop-enterprise-list', paramObj)
  },
  //获取桩企列表
  assetsEnterpriseList: function (paramObj) {
    return get('/assets/get-enterprise-list', paramObj)
  },
  //创建桩企
  createEnterprise: function (paramObj) {
    return post('/assets/create-enterprise', paramObj)
  },
  //创建白名单资产
  createWhiteDevice: function (paramObj) {
    return post('/assets/create-white-device', paramObj)
  },
  //导入白名单资产
  importWhiteDevice: function (paramObj) {
    return post('/assets/save-batch-white', paramObj)
  },
  //修改桩企
  editEnterprise: function (paramObj) {
    return post('/assets/edit-enterprise', paramObj)
  },
  // 故障列表
  malfunction: function (paramObj) {
    return get('/malfunction/malfunctions', paramObj)
  },
  // app 用户列表
  customerList: function (paramObj) {
    return get('/customer/list', paramObj)
  },
  // app 用户详情基本信息
  customerBasic: function (paramObj) {
    return get('/customer/basic', paramObj)
  },
  // app 用户绑定车辆基本信息
  customerBind: function (paramObj) {
    return get('/customer/bind-car', paramObj)
  },
  // app获取第三方账号
  customerThird: function (paramObj) {
    return get('/customer/get-third', paramObj)
  },
  // app获取邀请记录
  customerInvite: function (paramObj) {
    return get('/customer/get-invite', paramObj)
  },
  // app 用户金额明细
  customerMoney: function (paramObj) {
    return get('/customer/money', paramObj)
  },
  // app 用户添加特权用户
  customerCreate: function (paramObj) {
    return post('/customer/create', paramObj)
  },
  // app 用户修改特权用户
  customerEdit: function (paramObj) {
    return post('/customer/edit', paramObj)
  },
  // app 获取等级的基本信息
  customerLevel: function (paramObj) {
    return get('/customer/basic-level', paramObj)
  },
  // app 获取积分的详情
  IntegralList: function (paramObj) {
    return get('/customer/integral-record', paramObj)
  },
  // 等级管理列表
  integralList: function (paramObj) {
    return get('/integral/integral/list', paramObj)
  },
  //添加等级
  createIntegral: function (paramObj) {
    return post('/integral/integral/create-integral', paramObj)
  },
  //修改等级
  updateIntegral: function (paramObj) {
    return post('/integral/integral/update-integral', paramObj)
  },
  // 修改等级详情
  integralClassDetail: function (paramObj) {
    return get('/integral/integral/detail', paramObj)
  },
  //删除等级
  deleteIntegral: function (paramObj) {
    return post('/integral/integral/delete-integral', paramObj)
  },
  // 获取最高等级
  integralGetMaxLevel: function () {
    return get('/integral/integral/get-max-level')
  },
  // 获取权力下拉列表
  integralGetEquityType: function (paramObj) {
    return get('/integral/integral/get-equity', paramObj)
  },
  //积分列表
  gradeList: function (paramObj) {
    return get('/grade/grade/list', paramObj)
  },
  //获取积分的充电站列表
  gradeStationList: function (paramObj) {
    return get('/grade/grade/get-station-list', paramObj)
  },
  //创建积分
  createGrade: function (paramObj) {
    return post('/grade/grade/create-grade', paramObj)
  },
  //修改积分规则
  updateGrade: function (paramObj) {
    return post('/grade/grade/update-grade', paramObj)
  },
  //删除积分规则
  deleteGrade: function (paramObj) {
    return post('/grade/grade/delete-grade', paramObj)
  },
  // 获取积分兑换列表
  gradeChangeList: function (paramObj) {
    return get('/redeem/list', paramObj)
  },
  // 获取积分兑换列表
  gradeChangeTypeList: function (paramObj) {
    return get('/redeem/get-equity', paramObj)
  },
  //创建积分兑换
  createGradeChange: function (paramObj) {
    return post('/redeem/create', paramObj)
  },
  //修改积分兑换兑换
  editGradeChange: function (paramObj) {
    return post('/redeem/edit', paramObj)
  },
  // 详情修改积分兑换
  detailGradeChange: function (paramObj) {
    return get('/redeem/detail', paramObj)
  },
  //删除积分兑换
  deleteGradeChange: function (paramObj) {
    return post('/redeem/del', paramObj)
  },
  // 权益配置
  gradeEquityList: function (paramObj) {
    return get('/equity/list', paramObj)
  },
  //创建权益
  createEquity: function (paramObj) {
    return post('/equity/create', paramObj)
  },
  //修改权益
  editEquity: function (paramObj) {
    return post('/equity/edit', paramObj)
  },
  //删除权益
  delEquity: function (paramObj) {
    return post('/equity/del', paramObj)
  },
  // 详情权益配置
  detailEquity: function (paramObj) {
    return get('/equity/detail', paramObj)
  },
  //设备授权数管理  获取平台版本信息
  //获取授权码列表
  getSystemList: function (paramObj) {
    return get('/auth/get-auth', paramObj)
  },
  //获取系统信息
  getSystemInfo: function (paramObj) {
    return get('/auth/get-system', paramObj)
  },
  //扩容操作
  updateSystemAuth: function (paramObj) {
    return post('/auth/do-auth', paramObj)
  },

  // 运营商转账配置
  getTransferList: function (paramObj) {
    return get('/auth/transfer-detail', paramObj)
  },

  //短信管理
  getSmsList: function (paramObj) {
    return get('/auth/sms-list', paramObj)
  },
  //短信管理
  updateSmsStatus: function (paramObj) {
    return get('/auth/sms-edit', paramObj)
  },

  // 告警配置列表
  alarmConfigure: function (paramObj) {
    return get('/alarm/configure', paramObj)
  },
  // 告警删除
  alarmRemove: function (paramObj) {
    return post('/alarm/remove', paramObj)
  },
  // 添加告警选择充电站
  alarmStation: function (paramObj) {
    return get('/alarm/station', paramObj)
  },
  // 添加告警
  alarmCreate: function (paramObj) {
    return post('/alarm/create', paramObj)
  },
  // 添加编辑回显
  alarmEditInfo: function (paramObj) {
    return get('/alarm/info', paramObj)
  },
  // 编辑告警
  alarmEdit: function (paramObj) {
    return post('/alarm/edit', paramObj)
  },
  // 告警历史列表
  alarmHistory: function (paramObj) {
    return get('/alarm/history', paramObj)
  },
  // 系统成员列表
  roleSystems: function (paramObj) {
    return get('/role/systems', paramObj)
  },
  // 系统成员添加
  roleCreateUser: function (paramObj) {
    return post('/role/create-user', paramObj)
  },
  // 系统成员获取可分配充电站
  roleSystemAuth: function (paramObj) {
    return get('/role/system-auth', paramObj)
  },
  //添加和修改系统管理员的充电站权限
  roleAddSystemAuth: function (paramObj) {
    return post('/role/add-system-auth', paramObj)
  },

  // 系统成员编辑显示信息
  roleAccount: function (paramObj) {
    return get('/role/account', paramObj)
  },
  // 系统成员编辑
  roleEditUser: function (paramObj) {
    return post('/role/edit-user', paramObj)
  },
  // 系统成员删除
  roleDelUser: function (paramObj) {
    return post('/role/del-user', paramObj)
  },

  // 运维成员列表
  roleRunnings: function (paramObj) {
    return get('/role/operations', paramObj)
  },
  // 运维成员添加
  roleRunningUser: function (paramObj) {
    return post('/role/create-operation', paramObj)
  },

  // 运维成员编辑
  roleEditRunningUser: function (paramObj) {
    return post('/role/edit-operation', paramObj)
  },
  // 运维成员删除
  roleDelRunningUser: function (paramObj) {
    return post('/role/del-operation', paramObj)
  },
  // 运维成员获取可分配充电站
  roleRunningAuth: function (paramObj) {
    return get('/role/operation-auth', paramObj)
  },
  //添加和修改系统管理员的充电站权限
  roleAddRunningAuth: function (paramObj) {
    return post('/role/add-operation-auth', paramObj)
  },

  //设备监控 运维管理 批量充电
  getElecList: function (paramObj) {
    return get('/maintain/maintain/stations', paramObj)
  },
  // 获取充电枪的状态
  getElecStatus: function (paramObj) {
    return get('/maintain/maintain/gun-detail', paramObj)
  },
  //批量开始充电
  ElecStart: function (paramObj) {
    return post('/maintain/maintain/start-charging', paramObj)
  },
  //批量开始充电
  ElecStop: function (paramObj) {
    return post('/maintain/maintain/end-charging', paramObj)
  },

  //批量充电账单
  getElecStation: function (paramObj) {
    return get('/maintain/maintain/get-station', paramObj)
  },
  // 获取账单列表
  getElecBillList: function (paramObj) {
    return get('/maintain/maintain/bill-list', paramObj)
  },
  // 运维查看账单
  getElecBillDetail: function (paramObj) {
    return get('/maintain/maintain/detail', paramObj)
  },

  // 获取角色对应的权限
  roleTypeRule: function (paramObj) {
    return get('/role/type-rule', paramObj)
  },
  // 添加角色
  roleCreate: function (paramObj) {
    return post('/role/create', paramObj)
  },
  // 编辑角色
  roleEdit: function (paramObj) {
    return post('/role/edit', paramObj)
  },
  // 角色详情
  roleDetail: function (paramObj) {
    return get('/role/detail', paramObj)
  },
  // 角色删除
  roleDelete: function (paramObj) {
    return post('/role/delete', paramObj)
  },
  // 获取所有角色名称
  roleRoleName: function (paramObj) {
    return get('/role/role-name', paramObj)
  },
  // 业主列表
  roleOwners: function (paramObj) {
    return get('/role/owners', paramObj)
  },
  // 业主详情
  roleOwnerDetail: function (paramObj) {
    return get('/role/owner-detail', paramObj)
  },
  // 业主获取可分配充电桩
  roleOwnerAuth: function (paramObj) {
    return get('/role/owner-auth', paramObj)
  },
  // 业主分配充电桩
  roleAddOwnerAuth: function (paramObj) {
    return post('/role/add-owner-auth', paramObj)
  },
  // 业主添加
  roleCreateOwner: function (paramObj) {
    return post('/role/create-owner', paramObj)
  },
  // 业主编辑
  roleEditOwner: function (paramObj) {
    return post('/role/edit-owner', paramObj)
  },
  // 业主删除
  roleDelOwner: function (paramObj) {
    return post('/role/del-owner', paramObj)
  },
  // 代理商列表
  roleAgents: function (paramObj) {
    return get('/role/agents', paramObj)
  },
  // 代理商详情
  roleAgentDetail: function (paramObj) {
    return get('/role/agent-detail', paramObj)
  },
  // 代理商添加
  roleCreateAgent: function (paramObj) {
    return post('/role/create-agent', paramObj)
  },
  // 代理商编辑
  roleEditAgent: function (paramObj) {
    return post('/role/edit-agent', paramObj)
  },
  // 代理商删除
  roleDelAgent: function (paramObj) {
    return post('/role/del-agent', paramObj)
  },
  // 代理商获取可分配充电站
  roleAgentAuth: function (paramObj) {
    return get('/role/agent-auth', paramObj)
  },
  // 代理商分配充电站
  roleAddAgentAuth: function (paramObj) {
    return post('/role/add-agent-auth', paramObj)
  },

  //代理商-收款信息列表
  getAgentCollect: function (paramsObj) {
    return get('/role/agent-bank-list', paramsObj)
  },
  //代理商-添加收款信息
  addAgentCollectInfo: function (paramsObj) {
    return post('/role/agent-bank-add', paramsObj)
  },
  //代理商-添加收款信息
  editAgentCollectInfo: function (paramsObj) {
    return post('/role/agent-bank-edit', paramsObj)
  },

  //代理商-删除收款信息
  deleteAgentCollectInfo: function (paramsObj) {
    return post('/role/agent-bank-del', paramsObj)
  },

  // 代理商-添加编辑费率
  addServiceFee: function (paramsObj) {
    return post('/role/agent-rate-edit', paramsObj)
  },

  // 代理商-费率列表
  getServiceFeeList: function (paramsObj) {
    return get('/role/agent-rate-detail', paramsObj)
  },

  // 企业主列表
  roleCompanies: function (paramObj) {
    return get('/role/companies', paramObj)
  },
  // 企业主添加
  roleCreateCompany: function (paramObj) {
    return post('/role/create-company', paramObj)
  },
  // 企业主修改状态
  roleChangeStatus: function (paramObj) {
    return post('/role/change-status', paramObj)
  },
  // 企业主修改
  roleEditCompany: function (paramObj) {
    return post('/role/edit-company', paramObj)
  },
  // 企业主详情
  roleCompanyDetail: function (paramObj) {
    return get('/role/company-detail', paramObj)
  },
  // 企业主重置密码
  rolePassword: function (paramObj) {
    return post('/role/password', paramObj)
  },
  // 企业主充值信息
  roleDepositInfo: function (paramObj) {
    return get('/role/deposit-info', paramObj)
  },
  // 企业主执行充值
  roleDeposit: function (paramObj) {
    return post('/role/deposit', paramObj)
  },

  // 业主分润列表
  profitList: function (paramObj) {
    return get('/profit/list', paramObj)
  },
  // 业主分润详情
  profitDetail: function (paramObj) {
    return get('/profit/detail', paramObj)
  },
  // 业主生成对账单
  profitGenerate: function (paramObj) {
    return post('/profit/generate', paramObj)
  },
  // 业主对账单列表
  profitStatements: function (paramObj) {
    return get('/profit/statements', paramObj)
  },
  // 业主对账单详情
  profitStatement: function (paramObj) {
    return get('/profit/statement', paramObj)
  },
  // 业主对账单状态
  profitChangeSetStatus: function (paramObj) {
    return post('/profit/status', paramObj)
  },

  // 代理商 分润规则列表
  profitRules: function (paramObj) {
    return get('/profit/rules', paramObj)
  },
  // 代理商 分润规则列表 下拉列表
  profitListDrop: function (paramObj) {
    return get('/profit/drop-agent-list', paramObj)
  },
  // 代理商 分润规则列表 添加下拉列表
  profitRulesdDrop: function (paramObj) {
    return get('/profit/agent-list', paramObj)
  },
  // 代理商  分润规则列表 修改状态
  profitChangeStatus: function (paramObj) {
    return post('/profit/change-status', paramObj)
  },
  // 代理商  分润规则列表 删除列表
  profitDelList: function (paramObj) {
    return post('/profit/delete-rule', paramObj)
  },
  // 代理商  分润规则列表 添加列表
  profitAddList: function (paramObj) {
    return post('/profit/create-rule', paramObj)
  },
  // 代理商  分润规则列表  修改列表
  profitEditList: function (paramObj) {
    return post('/profit/update-rule', paramObj)
  },
  // 代理商 分润规则列表 添加 获取规则的充电站列表
  profitRulesdStation: function (paramObj) {
    return get('/profit/agent-station', paramObj)
  },
  // 代理商 分润规则列表 编辑 返显
  profitEditDetail: function (paramObj) {
    return get('/profit/rule-detail', paramObj)
  },
  // 代理商 分润信息列表
  profitMessList: function (paramObj) {
    return get('/profit/profit-operator', paramObj)
  },
  // 代理商 分润记录列表
  profitRecordList: function (paramObj) {
    return get('/profit/profit-history', paramObj)
  },
  // 代理商 分润记录头部 已分润金额
  profitRecordTop: function (paramObj) {
    return get('/profit/operator-detail', paramObj)
  },
  // 代理商 分润记录 分润详情列表
  profitRecordDetailList: function (paramObj) {
    return get('/profit/profit-detail', paramObj)
  },
  // 代理商 分润记录
  profitRecordDetailTop: function (paramObj) {
    return get('/profit/history-detail', paramObj)
  },
  // 代理商 提现记录列表
  profitApplyList: function (paramObj) {
    return get('/profit/withdrawl-list', paramObj)
  },

  // 代理商分润详情
  benefitDetail: function (paramObj) {
    return get('/benefit/detail', paramObj)
  },
  // 代理商生成对账单
  benefitGenerate: function (paramObj) {
    return post('/benefit/generate', paramObj)
  },

  // 发票列表
  invoiceInvoices: function (paramObj) {
    return get('/invoice/invoices', paramObj)
  },
  //发票详情
  invoiceDetail: function (paramObj) {
    return get('/invoice/invoice-detail', paramObj)
  },
  //发票账单
  invoiceBill: function (paramObj) {
    return get('/invoice/invoice-bill', paramObj)
  },
  // 发票更改状态
  invoiceSend: function (paramObj) {
    return post('/invoice/send', paramObj)
  },
  // 活动列表
  activityActivities: function (paramObj) {
    return get('/activity/activities', paramObj)
  },
  // 活动删除
  activityDelete: function (paramObj) {
    return post('/activity/delete', paramObj)
  },
  // 活动状态
  activityStatus: function (paramObj) {
    return post('/activity/status', paramObj)
  },
  // 添加活动
  activityCreate: function (paramObj) {
    return post('/activity/create', paramObj)
  },
  //关联充电站
  connectPile: function (paramObj) {
    return get('/activity/get-station-list', paramObj)
  },
  //广告列表
  adLists: function (paramObj) {
    return get('/advert/list', paramObj)
  },
  //获取广告关联活动
  advertActivity: function (paramObj) {
    return get('/advert/get-activity', paramObj)
  },
  //添加广告
  addAdvert: function (paramObj) {
    return post('/advert/create-advert', paramObj)
  },
  //修改广告
  editAdvert: function (paramObj) {
    return post('/advert/update-advert', paramObj)
  },
  //删除广告
  deleteAdvert: function (paramObj) {
    return post('/advert/delete-advert', paramObj)
  },
  //修改广告状态
  changeAdvertStatus: function (paramObj) {
    return post('/advert/change-status', paramObj)
  },

  // 编辑活动反显信息
  activityDetail: function (paramObj) {
    return get('/activity/detail', paramObj)
  },
  // 编辑活动
  activityEdit: function (paramObj) {
    return post('/activity/edit', paramObj)
  },
  //弹窗广告列表
  popList: function (paramObj) {
    return get('/pop/list', paramObj)
  },
  //弹窗获取充电站
  popGetStationList: function (paramObj) {
    return get('/pop/get-station-list', paramObj)
  },
  // 弹窗广告获取活动列表
  popGetActivityList: function (paramObj) {
    return get('/pop/get-activity', paramObj)
  },
  // 添加弹窗广告
  popCreate: function (paramObj) {
    return post('/pop/create', paramObj)
  },
  // 删除弹窗广告
  deletePop: function (paramObj) {
    return post('/pop/delete', paramObj)
  },
  // 获取弹窗广告详情
  getPopDetail: function (paramObj) {
    return get('/pop/detail', paramObj)
  },
  // 修改弹窗广告
  popEdit: function (paramObj) {
    return post('/pop/edit', paramObj)
  },
  //组队活动管理
  //获取组队活动管理
  teamList: function (paramObj) {
    return get('/team/team/list', paramObj)
  },
  //修改组队的开启和关闭状态
  changetTeamStatus: function (paramObj) {
    return post('/team/team/change-status', paramObj)
  },
  //获取积分配置的充电站
  teamStatusList: function (paramObj) {
    return get('/team/team/get-station-list', paramObj)
  },
  // 添加
  teamCreate: function (paramObj) {
    return post('/team/team/create-team', paramObj)
  },
  // 修改
  teamEdit: function (paramObj) {
    return post('/team/team/update-team', paramObj)
  },
  //编辑 详情
  teamDeatil: function (paramObj) {
    return get('/team/team/get-detail', paramObj)
  },
  //check 组队详情 的 组队列表
  checkteam: function (paramObj) {
    return get('/team/team/get-ranks-list', paramObj)
  },
  //check 组队详情 的 组队列表 的 上详情
  checkteamDeatilTop: function (paramObj) {
    return get('/team/team/get-ranks-header', paramObj)
  },
  //check 组队详情 的 组队列表 的 下详情
  checkteamDeatilBottom: function (paramObj) {
    return get('/team/team/get-ranks-detail', paramObj)
  },
  // 删除
  teamDelete: function (paramObj) {
    return post('/team/team/delete-team', paramObj)
  },

  // 启动页列表
  starterStarters: function (paramObj) {
    return get('/starter/starters', paramObj)
  },
  // 启动页状态
  starterStatus: function (paramObj) {
    return post('/starter/status', paramObj)
  },
  // 启动页删除
  starterDelete: function (paramObj) {
    return post('/starter/delete', paramObj)
  },
  // 启动页置顶
  starterRank: function (paramObj) {
    return post('/starter/rank', paramObj)
  },
  // 启动页添加
  starterCreate: function (paramObj) {
    return post('/starter/create', paramObj)
  },
  // 启动页编辑时反显
  starterDetail: function (paramObj) {
    return get('/starter/detail', paramObj)
  },
  // 启动页编辑
  starterEdit: function (paramObj) {
    return post('/starter/edit', paramObj)
  },
  // 优惠券列表
  bonusGetList: function (paramObj) {
    return get('/bonus/get-list', paramObj)
  },
  // 优惠券状态
  bonusChangeStatus: function (paramObj) {
    return post('/bonus/change-status', paramObj)
  },
  // 优惠券删除
  bonusDelBonus: function (paramObj) {
    return post('/bonus/del-bonus', paramObj)
  },
  // 已发放优惠券
  bonusGetBonus: function (paramObj) {
    return get('/bonus/get-bonus', paramObj)
  },
  // 添加优惠券 获取充电站
  bonusGetStation: function (paramObj) {
    return get('/bonus/get-station', paramObj)
  },
  // 编辑优惠券 显示信息
  bonusInfo: function (paramObj) {
    return get('/bonus/detail', paramObj)
  },
  // 查看信息详情
  bonusCheckInfo: function (paramObj) {
    return get('/bonus/get-info', paramObj)
  },
  //商业合作 查看信息详情
  bonusCheckCodeInfo: function (paramObj) {
    return get('/bonus/get-code-list', paramObj)
  },
  // 添加优惠券
  bonusCreate: function (paramObj) {
    return post('/bonus/create', paramObj)
  },
  // 编辑优惠券
  bonusEdit: function (paramObj) {
    return post('/bonus/edit', paramObj)
  },
  // 添加优惠活动
  preferentialAcCreate: function (paramObj) {
    return post('/preferential/preferential/create-preferential', paramObj)
  },
  // 编辑优惠券
  preferentialAcEdit: function (paramObj) {
    return post('/preferential/preferential/update-preferential', paramObj)
  },
  // 编辑优惠活动 显示信息
  preferentialInfo: function (paramObj) {
    return get('/preferential/preferential/detail', paramObj)
  },
  // 优惠券删除
  preferentialAcDelete: function (paramObj) {
    return post('/preferential/preferential/del-preferential', paramObj)
  },
  // 更改优惠券活动下车辆的状态
  preferentialAcChangeStatus: function (paramObj) {
    return post('/preferential/preferential/change-status', paramObj)
  },
  //优惠活动  获取优惠活动的列表
  preferentialAcGetList: function (paramObj) {
    return get('/preferential/preferential/list', paramObj)
  },
  //优惠活动  获取优惠活动的列表详情
  preferentialAcGetDetail: function (paramObj) {
    return get('/preferential/preferential/get-info', paramObj)
  },
  //优惠活动  获取优惠活动的列表详情 获取优惠活动下车辆的列表
  preferentialAcGetVehicleDetail: function (paramObj) {
    return get('/preferential/preferential/get-vehicle-list', paramObj)
  },
  //优惠活动  获取单独添加车辆的列表
  preferentialAcGetVehicleAdd: function (paramObj) {
    return get('/preferential/preferential/get-add-vehicle', paramObj)
  },
  //优惠活动  获取单独添加 获取企业的列表
  preferentialAcGetCompanyAdd: function (paramObj) {
    return get('/preferential/preferential/get-company-list', paramObj)
  },
  //优惠活动  单独添加优惠券活动的车辆
  preferentialAcAddVehice: function (paramObj) {
    return post('/preferential/preferential/add-vehicle', paramObj)
  },
  // //优惠活动 获取下拉 享受优惠群组的列表
  enjoyPreferentialAcGetList: function (paramObj) {
    return get('/preferential/preferential/get-group-list', paramObj)
  },
  //优惠活动 获取下拉 享受充电站的列表
  stationAcGetList: function (paramObj) {
    return get('/preferential/preferential/get-station', paramObj)
  },
  // -----
  // 账单的列表
  billList: function (paramObj) {
    return get('/bill/get-list', paramObj)
  },
  //提现管理
  cashList: function (paramObj) {
    return get('/refund/get-list', paramObj)
  },
  //提现-查看处理详情列表
  cashRefundList: function (paramObj) {
    return get('/refund/detail', paramObj)
  },
  //处理提现
  cashHandle: function (paramObj) {
    return post('/refund/handle', paramObj)
  },
  //人工提现列表
  adminCashList: function (paramObj) {
    return get('/refund/admin-withdraw-list', paramObj)
  },
  //人工提现
  addAdminWithdraw: function (paramObj) {
    return post('/refund/add-admin-withdraw', paramObj)
  },

  // 账单的详情
  billDetail: function (paramObj) {
    return get('/bill/detail', paramObj)
  },
  //获取充电站
  billStation: function (paramObj) {
    return get('/bill/get-station', paramObj)
  },
  //获取充值列表
  rechargeList: function (paramObj) {
    return get('/recharge/get-list', paramObj)
  },
  //进行充值操作
  rechargeRemainBalance: function (paramObj) {
    return post('/recharge/remain-balance', paramObj)
  },
  //获取用户信息
  platformDetail: function (paramObj) {
    return get('/user/detail', paramObj)
  },
  //修改用户信息
  saveUserInfo: function (paramObj) {
    return post('/user/edit', paramObj)
  },
  //修改用户密码
  saveUserPassword: function (paramObj) {
    return post('/user/edit-password', paramObj)
  },
  //获取运营商信息
  getCompanyInfo: function (paramObj) {
    return get('/auth/get-operator', paramObj)
  },
  //获取运营商发票配置
  getCompanyInvoice: function (paramObj) {
    return get('/auth/get-company-invoice', paramObj)
  },
  //保存运营商发票配置
  saveCompanyInvoice: function (paramObj) {
    return post('/auth/save-company-invoice', paramObj)
  },
  //修改运营商信息
  saveCompanyInfo: function (paramObj) {
    return post('/auth/edit-operator', paramObj)
  },
  //平台对接管理
  getConnectList: function (paramObj) {
    return get('/operator/get-list', paramObj)
  },
  //获取互联互通的详情
  getConnectDetail: function (paramObj) {
    return get('/operator/detail', paramObj)
  },
  //添加互联互通
  saveConnect: function (paramObj) {
    return post('/operator/create', paramObj)
  },
  //更新互联互通
  updateConnect: function (paramObj) {
    return post('/operator/edit', paramObj)
  },
  //互联互通运营商状态
  operatorStatus: function (paramObj) {
    return post('/operator/operator-status', paramObj)
  },
  //获取充电站的列表
  getConnecStationtList: function (paramObj) {
    return get('/operator/get-station', paramObj)
  },
  //提交关联充电站
  updateStationtList: function (paramObj) {
    return post('/operator/save-station', paramObj)
  },
  //互联互通-获取曹操出行配置
  getCaoCaoData: function (paramObj) {
    return post('/operator/get-cao-data', paramObj)
  },
  //互联互通-保存曹操出行配置
  saveCaoCaoData: function (paramObj) {
    return post('/operator/save-cao-data', paramObj)
  },
  // 运营商统计
  getStatList: function (paramObj) {
    return post('/thirdoperator/third-operator-list', paramObj)
  },
  changeStatColor: function (paramObj) {
    return post('/thirdoperator/set-color', paramObj)
  },

  //---------------------------------ota管理-------------------------

  //获取ota管理下的桩企下拉列表
  getPileListData: function (paramObj) {
    return get('/assets/drop-enterprise-list', paramObj)
  },

  //获取ota列表
  getFirmWareListData: function (paramObj) {
    return get('/ota/get-list', paramObj)
  },

  //上传固件信息
  saveFirmWareData: function (paramObj) {
    return post('/ota/create', paramObj)
  },

  //获取ota升级列表
  getUpdateListData: function (paramObj) {
    return get('/ota/pile-update-list', paramObj)
  },

  //获取桩升级状态
  getUpdateStatusData: function (paramObj) {
    return get('/ota/pileup-real-time-data', paramObj)
  },

  //桩升级
  updatePileData: function (paramObj) {
    return post('/ota/pile-update', paramObj)
  },

  //获取桩升级记录列表
  getPileRecordData: function (paramObj) {
    return get('/ota/pile-update-log', paramObj)
  },

  // ------------------------ 交易中心 start ---------------------------
  /**
   * 售后管理
   */
  getServiceLists: function (paramObj) {
    return get('/service/get-list', paramObj)
  },
  // 售后详情
  serviceDetail: function (paramObj) {
    return get('/service/detail', paramObj)
  },
  // 售后操作时 显示申请详细信息
  serviceRefundDetail: function (paramObj) {
    return get('/service/refund-detail', paramObj)
  },
  // 售后操作
  serviceHandle: function (paramObj) {
    return post('/service/handle', paramObj)
  },
  // 售后所属运营商
  pileOperations: function (paramObj) {
    return get('/pile/operations', paramObj)
  },

  // 授权管理列表
  authList: function (paramObj) {
    return get('/auth/list', paramObj)
  },
  // 停止充电验证码
  getAppStopCodeList: function (paramObj) {
    return get('/platform/save-stop-code', paramObj)
  },
  // 更改停止充电验证码状态
  changeAppStopCode: function (paramObj) {
    return post('/platform/save-stop-code', paramObj)
  },
  // 授权添加
  authCreate: function (paramObj) {
    return post('/auth/create', paramObj)
  },
  // 授权删除
  authDelete: function (paramObj) {
    return post('/auth/delete', paramObj)
  },
  // 获取第三方信息
  authThirdList: function (paramObj) {
    return get('/auth/get-third', paramObj)
  },
  // 确认提交第三方信息
  authThirdCreate: function (paramObj) {
    return post('/auth/save-third', paramObj)
  },
  /*
     企业管理
   */
  getCompanyDetail: function (paramObj) {
    return get('/company/detail', paramObj)
  },
  //获取子账号的列表
  getCompanyChildList: function (paramObj) {
    return get('/company/child-list', paramObj)
  },
  //添加子账号
  createChild: function (paramObj) {
    return post('/company/create', paramObj)
  },
  //修改子账号的信息
  updateChildInfo: function (paramObj) {
    return post('/company/change-info', paramObj)
  },
  //修改子账号的开启停用
  updateChildStatus: function (paramObj) {
    return post('/company/change-status', paramObj)
  },
  //修改子账号的余额
  updateChildBalance: function (paramObj) {
    return post('/company/change-balance', paramObj)
  },
  //企业主修改用户密码
  companyEditPassword: function (paramObj) {
    return post('/company/edit-password', paramObj)
  },
  // 获取当前登录用户的可分配余额
  getAvailable: function () {
    return get('/company/available')
  },
  //获取企业账号的账单列表
  getCompanyBill: function (paramObj) {
    return get('/company/bill-list', paramObj)
  },
  //导出账单列表
  companyExportBill: function () {
    return get('/company/export-bill')
  },
  //获取企业账号的充值记录
  getCompanyCharge: function (paramObj) {
    return get('/company/charge', paramObj)
  },
  //获取企业账号的分配记录
  getCompanyAssign: function (paramObj) {
    return get('/company/assign', paramObj)
  },
  //获取企业账单的详情
  getCompanyBillDetail: function (paramObj) {
    return get('/company/bill-detail', paramObj)
  },
  // 企业子账户获取可分配充电站
  getStationList: function (paramObj) {
    return get('/company/company-station-list', paramObj)
  },
  // 企业子账户分配充电站
  setCompanyStation: function (paramObj) {
    return post('/company/add-company-station', paramObj)
  },
  /**
   * 数据分析
   * @param {*} paramObj
   * @returns
   */
  /*************运营数据分析**************/
  //获取运营分析地域列表
  getAreaList: function (paramObj) {
    return get('/overview/area-list', paramObj)
  },
  //获取运营分析的头部信息
  getHeaderData: function (paramObj) {
    return post('/overview/statistics', paramObj)
  },
  //获取运营分析七天营收分析
  getSevenData: function (paramObj) {
    return post('/overview/charts', paramObj)
  },
  //获取运营分析活跃充电站和充电桩的实时数据图标
  getActive: function (paramObj) {
    return post('/overview/active', paramObj)
  },
  //获取运营分析设备实时运行状态
  getRealtimeStatus: function (paramObj) {
    return post('/overview/realtime-status', paramObj)
  },
  //获取运营分析充电站的营收
  getStationAmount: function (paramObj) {
    return post('/overview/station-amount', paramObj)
  },
  //获取运营分析活跃用户数
  getActiveUser: function (paramObj) {
    return post('/overview/active-user', paramObj)
  },

  //获取运营分析近7天充电启动方式百分比
  getOperationSevenChargingPercent: function (paramObj) {
    return post('/overview/charge-type', paramObj)
  },

  /************运维数据分析**************/
  //获取运维分析-车辆数据-电池类型
  getMaintenanceBatteryTypeData: function (paramObj) {
    return get('/operatorcardata/car-battery-type', paramObj)
  },
  //获取运维分析-车辆数据-电池列表
  getMaintenanceBatteryData: function (paramObj) {
    return get('/operatorcardata/get-vehicle-battery', paramObj)
  },
  //获取运维分析-充电桩数据-根据城市获取充电站
  getMaintenanceStationData: function (paramObj) {
    return get('/operatorcardata/area-station', paramObj)
  },
  //获取运维分析-充电桩数据-故障次数/设备数
  getMaintenanceChargingFaultData: function (paramObj) {
    return get('/operatorcardata/fault-num', paramObj)
  },
  //获取运维分析-充电桩数据-故障恢复时长分布
  getMaintenanceRestoreTimeData: function (paramObj) {
    return get('/operatorcardata/faults-recovery', paramObj)
  },
  //获取运维分析-充电桩数据-故障类型饼图
  getMaintenanceFaultTypeData: function (paramObj) {
    return get('/operatorcardata/faults-type', paramObj)
  },
  //获取运维分析-充电桩数据-故障类型饼图
  getMaintenanceFaultTimeData: function (paramObj) {
    return get('/operatorcardata/fault-occurrence', paramObj)
  },
  //获取运维分析-车辆电池类型-总数分布
  getMaintenanceBatteryVisualData: function (paramObj) {
    return get('/operatorcardata/get-battery-type-data', paramObj)
  },
  //获取运维分析-车辆电池类型-百分比数据
  getMaintenanceBatteryPercentData: function (paramObj) {
    return get('/operatorcardata/get-battery-type-percentage', paramObj)
  },
  /****************end****************/
  //邀请新用户获取验证码
  getInviteCode: function (paramObj) {
    return post('/newuser/send-code', paramObj)
  },
  //保存邀请信息
  InviteRegister: function (paramsObj) {
    return post('/newuser/register', paramsObj)
  },
  //保存说明
  EditPlatformDesc: function (paramObj) {
    return post('/platform/edit-desc', paramObj)
  },
  //获取说明
  getPlatformDesc: function (paramObj) {
    return get('/platform/get-desc', paramObj)
  },
  //app端获取说明
  getAppDesc: function (paramObj) {
    return get('/doc/get-desc', paramObj)
  },
  //获取常见问题
  getQuestion: function (paramObj) {
    return get('/doc/get-question', paramObj)
  },
  //获取隐私协议
  getAgreement: function (paramObj) {
    return get('/doc/get-platform-agreement', paramObj)
  },
  getAgreementCopy: function (paramObj) {
    return get('/doc/get-platform-agreement-copy', paramObj)
  },
  //获取平台的配置信息
  getPlatformConfig: function (paramObj) {
    return get('/doc/get-platform-config', paramObj)
  },
  //获取邀请新用户的配置信息
  getInviteConfig: function (paramObj) {
    return get('/doc/get-invite-config', paramObj)
  },
  //web平台获取可变配置
  getPcConfig: function (paramObj) {
    return get('/platform/platform-info', paramObj)
  },
  //保存下载页的配置信息
  saveDownloadConfig: function (paramObj) {
    return post('/platform/save-download-app', paramObj)
  },
  //获取隐私协议配置
  getPcAgreement: function (paramObj) {
    return get('/platform/get-platform-agreement', paramObj)
  },
  //保存隐私协议
  saveAgreement: function (paramObj) {
    return post('/platform/save-platform-agreement', paramObj)
  },
  //获取pc配置常见问题
  getPcQuestion: function (paramObj) {
    return get('/platform/get-desc', paramObj)
  },
  //保存活动的配置信息
  saveActivityConfig: function (paramObj) {
    return post('/platform/save-activity-info', paramObj)
  },
  //保存邀请的配置信息
  saveInviteConfig: function (paramObj) {
    return post('/platform/save-invite-info', paramObj)
  },
  //保存客服电话
  saveServicePhone: function (paramObj) {
    return post('/platform/save-service-phone', paramObj)
  },
  //保存常见问题
  saveQuestion: function (paramObj) {
    return post('/platform/save-question', paramObj)
  },
  //获取运营商转账的信息
  getOperatorTransfer: function (paramObj) {
    return post('/auth/transfer-detail', paramObj)
  },
  //保存运营商转账的信息
  saveOperatorTransfer: function (paramObj) {
    return post('/auth/update-transfer', paramObj)
  },

  // 数据分析-历史数据
  //用户充电记录
  getHistoryPileList: function (paramObj) {
    return get('/history/pile-list', paramObj)
  },
  getHistoryDetailList: function (paramObj) {
    return get('/history/table-data', paramObj)
  },
  getHistoryDetailSelectGunList: function (paramObj) {
    return get('/history/pile-gun', paramObj)
  },
  getHistoryDetailChartList: function (paramObj) {
    return get('/history/chart-data', paramObj)
  },

  // -----------分润管理
  //代理商登录获取提现配置
  getWithdrawOriginConfig: function (paramObj) {
    return get('/withdrawl/get-origin-config', paramObj)
  },
  //代理商登录后获取账户详情
  getAgentMoney: function (paramObj) {
    return get('/withdrawl/operator-info', paramObj)
  },
  //代理商修改提现配置获取提现信息
  getWithdrawConfig: function (paramObj) {
    return get('/withdrawl/get-config', paramObj)
  },
  //代理商登录后保存提现配置
  saveWithdrawConfig: function (paramObj) {
    return post('/withdrawl/change-config', paramObj)
  },
  //代理商登陆后获取分润历史
  getAgentProfitHistory: function (paramObj) {
    return get('/profit/agent-profit-history', paramObj)
  },
  //代理商登录后导出分润记录对账单
  exportAgentProfit: function (paramObj) {
    return get('/profit/export-agent', paramObj)
  },
  //代理商登录后获取用户的详情
  getAgentOperatorDetail: function (paramObj) {
    return get('/profit/agent-operator-detail', paramObj)
  },
  //代理商登录后获取提现的记录
  getAgentWithdrawList: function (paramObj) {
    return get('/profit/agent-withdrawl-list', paramObj)
  },
  //代理商登录后获取提现的金额信息
  getAgentWithdrawMoney: function (paramObj) {
    return get('/withdrawl/withdraw-money', paramObj)
  },
  //代理商登录后进行提现操作
  agentWithdrawMoney: function (paramObj) {
    return post('/withdrawl/do-withdraw', paramObj)
  },
  //代理商登录后修改提现账号信息获取验证码
  agentGetCheckCode: function (paramsObj) {
    return post('/withdrawl/get-code', paramsObj)
  },

  //用户充电记录
  userChargeList: function (paramObj) {
    return post('/user/charge-list', paramObj)
  },
  //用户停止充电
  setStopCharge: function (paramObj) {
    return post('/user/stop-charge', paramObj)
  },
  //充电记录
  ChargeList: function (paramObj) {
    return post('/chargelog/list', paramObj)
  },
  //停止充电
  StopCharge: function (paramObj) {
    return post('/chargelog/stop-charge', paramObj)
  }
}
