// import Vue from 'vue';
// import Router from 'vue-router';

import invoiceDetail from '../views/trad/invoiceDetail'

const _import = require('./_import_' + process.env.NODE_ENV)
// in development env not use Lazy Loading,because Lazy Loading large page will cause webpack hot update too slow
// 所以只在生产中使用延迟加载

// 第三方运营商统计
import LayoutStat from '../views/layout/LayoutStat'
// 数据分析
const StatOperation = _import('stat/dataOperation')
const StatMaintenanceChargingPile = _import('stat/dataChargingPile')
// 设备管理
const StatDeviceStation = _import('stat/deviceStation')
const StatStationDetail = _import('stat/deviceStationDetail')
const StatStationOperate = _import('stat/deviceStationOperate')
const StatStationPark = _import('stat/deviceStationPark')
const StatPile = _import('stat/devicePile')
const StatPileDetail = _import('stat/devicePileDetail')
const StatPileOperate = _import('stat/devicePileOperate')
const StatChargeLog = _import('stat/deviceCharge')
const StatLog = _import('stat/deviceLog')
// 交易中心
const StatTradBill = _import('stat/tradBill')
const StatTradBillDetail = _import('stat/tradBillDetail')
const StatTradService = _import('stat/tradService')
const StatTradServiceDetail = _import('stat/tradServiceDetail')

import Layout from '../views/layout/Layout'

const Login = _import('login/index')
const Err404 = _import('error/404')
const Err401 = _import('error/401')

// 概览
const Operation = _import('data/operation')
const MaintenanceVehicle = _import('data/maintenanceVehicle')
const MaintenanceVehicleBattery = _import('data/maintenanceVehicleBattery')
const MaintenanceChargingPile = _import('data/maintenanceChargingPile')
const DataHistory = _import('data/history')
const DataHistoryDetail = _import('data/historyDetail')

// 平台管理
const Account = _import('info/index')
const DevInfo = _import('info/dev')
const OpInfo = _import('info/op')
const ElectronicInvoice = _import('info/invoice')
const TransferInfo = _import('info/transfer')

// 设备管理
const DeviceStation = _import('device/station')
const StationDetail = _import('device/detail')
const StationOperate = _import('device/operate')
const StationDiscount = _import('device/discount')
const AddDeviceStation = _import('device/addStation')
const StationPark = _import('device/park')
const DevicePile = _import('device/pile')
const PileDetail = _import('device/pileDetail')
const PileOperate = _import('device/pileOperate')
const AddDevicePile = _import('device/addPile')
const DeviceMaintain = _import('device/maintain')
const FaultMaintain = _import('device/faultmaintain')
const DeviceAsset = _import('device/asset')
const PileEnterprise = _import('device/pileEnterprise')
const ChargeLog = _import('device/charge')
const OtaManangement = _import('device/otaManagement')
const OtaManageRecord = _import('device/otaManageRecord')
const OtaManageUpdate = _import('device/otaManageUpdate')

// 用户管理
const AppUser = _import('user/index')
const UserDetail = _import('user/detail')
const UserAmount = _import('user/amount')
const UserRecord = _import('user/record')
const UserCharge = _import('user/charge')
const UserClass = _import('user/gradeClass')
const UserClassAdd = _import('user/gradeClassAdd')
const UserScore = _import('user/gradeScore')
const UserChange = _import('user/gradeChange')
const UserChangeAdd = _import('user/gradeChangeAdd')
const UserEquity = _import('user/gradeEquity')
const UserEquityAdd = _import('user/gradeEquityAdd')
const UserClassInstructe = _import('user/gradeClassInstructe')
const UserScoreInstructe = _import('user/gradeScoreInstructe')
const UserLevel = _import('user/level')

//车辆管理
const CarManager = _import('vehicle/carManager')
const CarTypeManager = _import('vehicle/carTypeManager')
const AddCar = _import('vehicle/addCar')
const CarBrand = _import('vehicle/carBrandManager')
const GroupManager = _import('vehicle/groupManager')
const AddGroup = _import('vehicle/addGroup')
const GroupDetail = _import('vehicle/groupDetail')

// 充点卡管理
const CardMessage = _import('card/message')
const CardMessageDetail = _import('card/messageDetail')
const CardMessageAccount = _import('card/messageAccount')
const CardMessageAccountTrad = _import('card/messageAccountTrad')

// 交易中心
const TradBill = _import('trad/bill')
const TradBillDetail = _import('trad/billDetail')
const CashDetail = _import('trad/cashDetail')
//  业主分润
const TradProfit = _import('trad/profit')
const TradProfitDetail = _import('trad/profitDetail')
const TradCheck = _import('trad/check')
const TradCheckDetail = _import('trad/checkDetail')
//  代理商分润
const TradAgent = _import('trad/agent')
const TradAgentAdd = _import('trad/agentAddRule')
const TradAgentDetail = _import('trad/agentDetail')
const TradAgentCheck = _import('trad/agentCheck')
const TradAgentCheckRecord = _import('trad/agentCheckRecord')
const TradAgentCheckDetail = _import('trad/agentCheckDetail')
const TradAgentCheckCash = _import('trad/agentCheckCash')
const TradManage = _import('trad/manage')
const TradManageSet = _import('trad/manageSetAccount')
const TradManageRecord = _import('trad/manageRecord')
const TradManageRecordDetail = _import('trad/manageRecordDetail')
const TradManageCash = _import('trad/manageCash')
const TradManageApply = _import('trad/manageApply')
const TradRecharge = _import('trad/recharge')
const TradCash = _import('trad/cash')
const TradService = _import('trad/service')
const TradServiceDetail = _import('trad/serviceDetail')
const TradInvoice = _import('trad/invoice')
const InvoiceDetail = _import('trad/invoiceDetail')
const AdminCash = _import('trad/adminCash')
// 活动平台
const ActivitCoupon = _import('activity/coupon')
const CheckCoupon = _import('activity/checkCoupon')
const CheckCouponAc = _import('activity/checkCouponAc')
const ActivitCouponManager = _import('activity/couponActivityManager')
const AddCouponAc = _import('activity/addCouponAc')
const ActivitAddCoupon = _import('activity/addCoupon')
const ActivitCouponDetail = _import('activity/couponDetail')
const ActivitSend = _import('activity/send')
const ActivitNews = _import('activity/news')
const ActivitStart = _import('activity/start')
const ActivitAddMessage = _import('activity/addMessage')
const AddActivity = _import('activity/addActivity')
const CopActivity = _import('activity/copActivity')
const AdManager = _import('activity/adManager')
const PopUpManager = _import('activity/popUpManager')
const AddPopUp = _import('activity/addPopUp')
const Team = _import('activity/team')
const AddTeam = _import('activity/teamAdd')
const CheckTeam = _import('activity/teamCheck')
const CheckTeamDetail = _import('activity/teamCheckDetail')
// 平台对接管理
const Connect = _import('connect/index')
const ConnectAdd = _import('connect/add')
const ConnectDetail = _import('connect/detail')
const ConnectOperatorAuth = _import('connect/operatorAuth')
const ConnectCao = _import('connect/caocao')
const ConnectStat = _import('connect/stat')

// 平台成员管理
const PlatSystem = _import('platform/system')
// 运维成员管理
const PlatKeep = _import('platform/keep')
const PlatKeepAuth = _import('platform/keepAuth')
//  业主
const PlatOwner = _import('platform/owner')
const PlatOwnerEdit = _import('platform/ownerEdit')
const PlatOwnerChange = _import('platform/ownerChange')
const PlatOwnerDetail = _import('platform/ownerDetail')
const OwnerAuth = _import('platform/ownerAuth')
//  代理商
const PlatAgent = _import('platform/agent')
const PlatAgentCard = _import('platform/agentCard')
const PlatAgentEdit = _import('platform/agentEdit')
const PlatAgentDetail = _import('platform/agentDetail')
const PlatAgentConfig = _import('platform/agentConfig')
const AgentAuth = _import('platform/agentAuth')

const PlatCompany = _import('platform/company')
const PlatCompanyDetail = _import('platform/companyDetail')
const PlatRole = _import('platform/role')
const PlatRoleEdit = _import('platform/roleEdit')
const PlatRoleDetail = _import('platform/roleDetail')
const SystemAuth = _import('platform/systemAuth')
// 企业管理
const CompanyIndex = _import('company/index')
const CompanyAccount = _import('company/account')
const CompanyBill = _import('company/bill')
const CompanyBillDetail = _import('company/billDetail')
const CompanyCharge = _import('company/charge')
const CompanyAssign = _import('company/assign')
const CompanyStationAssign = _import('company/stationAssign')
// 授权
const AuthIndex = _import('auth/index')
//运维管理
const Monitor = _import('run/monitor')
const MonitorDetail = _import('run/monitorDetail')
const Counter = _import('run/counter')
const CounterDetail = _import('run/counterDetail')
const RunLog = _import('run/log')
// 告警管理
const RunDeploy = _import('run/deploy')
const RunFault = _import('run/fault')

//邀请好友
const InviteFriend = _import('h5/inviteFriend')
const DownloadApp = _import('h5/inviteApp')
const DownloadAppX = _import('h5/inviteIphoneX')
//打开app
const OpenApp = _import('h5/openApp')
//隐私协议
const Deal = _import('h5/deal')
//常见问题
const Question = _import('h5/question')
//引导页
const Guide = _import('h5/guide')
//app的描述
const AppDesc = _import('h5/desc')
//app下载页面的配置
const AppDownload = _import('auth/appDownload')
//pc配置用户使用协议
const AppAgreement = _import('auth/agreement')
//pc配置用户隐私政策
const AppPrivacy = _import('auth/privacy')
//pc配置常见问题
const AppQuestion = _import('auth/question')
//pc配置活动链接
const AppActivity = _import('auth/activity')
//pc配置邀请活动配置
const AppInvite = _import('auth/invite')
//短信管理
const SmsList = _import('auth/smsList')
/*
   模块化页面
 */
//单个tab携带搜索条件
const DemoList = _import('demo/list')
//多个tab携带搜索条件
const DemoTabList = _import('demo/tabList')
/**
 * icon : 菜单图标
 * hidden : true不显示在菜单栏
 * redirect : noredirect 为不重定向
 * noDropdown : true 不显示子菜单
 * meta : { role: ['admin'] }  will control the page role
 **/

const constantRouterMap = [
  {
    path: '/login',
    component: Login,
    hidden: true
  },
  {
    path: '/404',
    component: Err404,
    hidden: true
  }, //假地址时重定向
  {
    path: '/401',
    component: Err401,
    hidden: true
  }, //无权限时重定向
  // 运营商统计--第三方运营商---------开始
  {
    path: '/stat/data',
    component: LayoutStat,
    hidden: true,
    children: [
      {
        path: 'operation',
        component: StatOperation
      },
      {
        path: 'charging',
        component: StatMaintenanceChargingPile,
        name: '运维数据分析-充电桩数据'
      }
    ]
  },
  {
    path: '/stat/device',
    component: LayoutStat,
    hidden: true,
    children: [
      {
        path: 'station',
        component: StatDeviceStation
      },
      {
        path: 'station/detail/:id',
        component: StatStationDetail
      },
      {
        path: 'station/operate/:id',
        component: StatStationOperate
      },
      {
        path: 'station/park/:id',
        component: StatStationPark
      },
      {
        path: 'pile',
        component: StatPile
      },
      {
        path: 'pile/detail/:id',
        component: StatPileDetail
      },
      {
        path: 'pile/operate/:id',
        component: StatPileOperate
      },
      {
        path: 'charge',
        component: StatChargeLog
      },
      {
        path: 'log',
        component: StatLog
      }
    ]
  },
  {
    path: '/stat/trad',
    component: LayoutStat,
    hidden: true,
    children: [
      {
        name: '账单管理',
        path: 'bill',
        component: StatTradBill
      },
      {
        name: '账单详情',
        path: 'bill/detail/',
        component: StatTradBillDetail
      },
      {
        name: '售后管理',
        path: 'service',
        component: StatTradService
      },
      {
        name: '售后详情',
        path: 'service/detail',
        component: StatTradServiceDetail
      }
    ]
  },

  // 运营商统计--第三方运营商---------结束
  {
    path: '/',
    component: Layout,
    redirect: '/data/operation',
    hidden: true
  },
  {
    path: '/data',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'operation',
        component: Operation
      },
      {
        path: 'maintenance',
        component: MaintenanceVehicle,
        name: '运维数据分析-车辆数据'
      },
      {
        path: 'maintenance/battery',
        component: MaintenanceVehicleBattery,
        name: '运维数据分析-车辆数据-电池类型'
      },
      {
        path: 'maintenance/charging',
        component: MaintenanceChargingPile,
        name: '运维数据分析-充电桩数据'
      },
      {
        path: 'history',
        component: DataHistory,
        name: '历史数据'
      },
      {
        path: 'history/detail/:pile_name/:pile_sn/:pile_type',
        component: DataHistoryDetail,
        name: '历史数据详情'
      }
    ]
  },
  {
    path: '/info',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '',
        component: Account
      }
    ]
  },
  {
    path: '/device',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'station',
        component: DeviceStation
      },
      {
        path: 'station/detail/:id',
        component: StationDetail
      },
      {
        path: 'station/operate/:id',
        component: StationOperate
      },
      {
        path: 'station/park/:id',
        component: StationPark
      },
      {
        path: 'station/discount/:id',
        component: StationDiscount
      },
      {
        path: 'station/add',
        component: AddDeviceStation
      },
      {
        path: 'pile',
        component: DevicePile
      },
      {
        path: 'pile/add',
        component: AddDevicePile
      },
      {
        path: 'pile/detail/:id',
        component: PileDetail
      },
      {
        path: 'pile/operate/:id',
        component: PileOperate
      },
      {
        path: 'pile/maintain',
        component: DeviceMaintain
      },
      {
        path: 'pile/fault',
        component: FaultMaintain
      },
      {
        path: 'asset',
        component: DeviceAsset
      },
      {
        path: 'asset/enterprise',
        component: PileEnterprise
      },
      {
        path: 'charge',
        component: ChargeLog
      },
      {
        path: 'ota',
        component: OtaManangement
      },
      {
        path: 'ota/update',
        component: OtaManageUpdate
      },
      {
        path: 'ota/record',
        component: OtaManageRecord
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'users',
        component: AppUser
      },
      {
        path: 'users/detail/:id',
        component: UserDetail
      },
      {
        path: 'users/amount/:id',
        component: UserAmount
      },
      {
        path: 'users/level/:id',
        component: UserLevel
      },
      {
        path: 'users/record/:id',
        component: UserRecord
      },
      {
        path: 'users/charge/:id',
        component: UserCharge
      },
      {
        path: 'grade',
        component: UserClass
      },
      {
        path: 'grade/class',
        component: UserClass
      },
      {
        path: 'grade/addclass',
        component: UserClassAdd
      },
      {
        path: 'grade/score',
        component: UserScore
      },
      {
        path: 'grade/change',
        component: UserChange
      },
      {
        path: 'grade/addchange',
        component: UserChangeAdd
      },
      {
        path: 'grade/equity',
        component: UserEquity
      },
      {
        path: 'grade/addequity',
        component: UserEquityAdd
      },
      {
        path: 'grade/instructe',
        component: UserClassInstructe
      },
      {
        path: 'grade/score/instructe',
        component: UserScoreInstructe
      }
    ]
  },
  {
    path: '/vehicle',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'car',
        name: '车辆管理',
        component: CarManager
      },
      {
        path: 'car/cartype',
        name: '车型管理',
        component: CarTypeManager
      },
      {
        name: '添加车辆',
        path: 'car/addcar',
        component: AddCar
      },
      {
        name: '品牌管理',
        path: 'car/carbrand',
        component: CarBrand
      },
      {
        name: '群组管理',
        path: 'groupmanager',
        component: GroupManager
      },
      {
        name: '添加群组',
        path: 'groupmanager/addgroup',
        component: AddGroup
      },
      {
        name: '群组详情',
        path: 'groupmanager/groupdetail',
        component: GroupDetail
      }
    ]
  },
  {
    path: '/card',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'message',
        name: '卡信息管理',
        component: CardMessage
      },
      {
        path: 'message/detail/:id',
        name: '充值详情',
        component: CardMessageDetail
      },
      {
        path: 'message/account/:id',
        name: '消费金额',
        component: CardMessageAccount
      },
      {
        path: 'message/bill',
        name: '消费金额',
        component: CardMessageAccountTrad
      }
    ]
  },
  {
    path: '/trad',
    component: Layout,
    hidden: true,
    children: [
      {
        name: '账单管理',
        path: 'bill',
        component: TradBill
      },
      {
        name: '账单详情',
        path: 'bill/detail/',
        component: TradBillDetail
      },
      {
        name: '业主分润管理',
        path: 'profit',
        component: TradProfit
      },
      {
        name: '业主分润详情',
        path: 'profit/detail',
        component: TradProfitDetail
      },
      {
        name: '代理商分润规则',
        path: 'agent',
        component: TradAgent
      },
      {
        name: '代理商添加分润规则',
        path: 'agent/add',
        component: TradAgentAdd
      },
      {
        name: '代理商分润详情',
        path: 'agent/detail',
        component: TradAgentDetail
      },
      {
        name: '代理商分润信息',
        path: 'agent/check',
        component: TradAgentCheck
      },
      {
        name: '代理商分润信息分润记录',
        path: 'agent/check/record',
        component: TradAgentCheckRecord
      },
      {
        name: '代理商分润信息分润记录详情',
        path: 'agent/check/detail',
        component: TradAgentCheckDetail
      },
      {
        name: '代理商分润信息提现记录',
        path: 'agent/check/cash',
        component: TradAgentCheckCash
      },
      {
        name: '分润管理',
        path: 'manage',
        component: TradManage
      },
      {
        name: '分润管理设置提现账户',
        path: 'manage/set',
        component: TradManageSet
      },
      {
        name: '分润管理分润记录',
        path: 'manage/record',
        component: TradManageRecord
      },
      {
        name: '分润管理分润记录详情',
        path: 'manage/record/detail',
        component: TradManageRecordDetail
      },
      {
        name: '分润管理分润记录提现',
        path: 'manage/cash',
        component: TradManageCash
      },
      {
        name: '分润管理申请提现',
        path: 'manage/apply',
        component: TradManageApply
      },
      {
        name: '业主对账单',
        path: 'profit/check',
        component: TradCheck
      },
      {
        name: '业主对账单详情',
        path: 'profit/check/detail',
        component: TradCheckDetail
      },
      {
        name: '充值管理',
        path: 'recharge',
        component: TradRecharge
      },
      {
        name: '提现管理',
        path: 'cash',
        component: TradCash
      },
      {
        name: '人工提现',
        path: 'cash/admincash',
        component: AdminCash
      },
      {
        name: '退款详情',
        path: 'cash/detail',
        component: CashDetail
      },
      {
        name: '售后管理',
        path: 'service',
        component: TradService
      },
      {
        name: '售后详情',
        path: 'service/detail',
        component: TradServiceDetail
      },
      {
        name: '发票管理',
        path: 'invoice',
        component: TradInvoice
      },
      {
        name: '发票详情',
        path: 'invoice/detail/:id',
        component: InvoiceDetail
      }
    ]
  },
  {
    path: '/activity',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'coupon',
        component: ActivitCoupon,
        name: '优惠管理'
      },
      {
        path: 'coupon/checkcoupon',
        component: CheckCoupon,
        name: '查看优惠券管理列表详情'
      },
      {
        path: 'coupon/add',
        component: ActivitAddCoupon,
        name: '添加优惠券'
      },
      {
        path: 'machine',
        component: ActivitCouponManager,
        name: '车辆优惠管理'
      },
      {
        path: 'machine/checkcouponac',
        component: CheckCouponAc,
        name: '查看优惠活动管理列表详情'
      },
      {
        path: 'machine/addcouponac',
        component: AddCouponAc,
        name: '添加优惠活动管理'
      },
      {
        path: 'coupon/couponDetail/:id',
        component: ActivitCouponDetail,
        name: '编辑优惠券'
      },
      {
        path: 'coupon/send',
        component: ActivitSend,
        name: '已发送优惠券'
      },
      {
        path: 'news',
        component: ActivitNews,
        name: '活动广告管理'
      },
      {
        path: 'news/addac',
        component: AddActivity,
        name: '添加活动'
      },
      {
        path: 'news/copac',
        component: CopActivity,
        name: '添加活动'
      },
      {
        path: 'news/admanager',
        component: AdManager,
        name: '广告管理页面'
      },
      {
        path: 'news/popupmanager',
        component: PopUpManager,
        name: '弹窗广告管理'
      },
      {
        path: 'news/addpopup',
        component: AddPopUp,
        name: '添加弹窗广告'
      },
      {
        path: 'start',
        component: ActivitStart,
        name: '启动页管理'
      },
      {
        path: 'addmessage',
        component: ActivitAddMessage,
        name: '添加活动信息'
      },
      {
        path: 'team',
        component: Team,
        name: '组队活动管理'
      },
      {
        path: 'team/addteam',
        component: AddTeam,
        name: '添加组队活动管理'
      },
      {
        path: 'team/checkteam',
        component: CheckTeam,
        name: '组队活动详情'
      },
      {
        path: 'team/checkteam/detail',
        component: CheckTeamDetail,
        name: '组队队伍详情'
      }
    ]
  },
  {
    path: '/connect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'operator',
        component: Connect,
        name: '运营商授权'
      },
      {
        path: 'operator/add/:id',
        component: ConnectAdd,
        name: '增加运营商'
      },
      {
        path: 'operator/detail/:id',
        component: ConnectDetail,
        name: '运营商详情'
      },
      {
        path: 'operator/accept/:id',
        component: ConnectOperatorAuth,
        name: '运营商关联'
      },
      {
        path: 'operator/caocao',
        component: ConnectCao,
        name: '曹操出行配置'
      },
      {
        path: 'stat',
        component: ConnectStat,
        name: '运营商统计'
      }
    ]
  },
  {
    path: '/platform',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'system',
        component: PlatSystem,
        name: '系统成员'
      },
      {
        path: 'system/assign/:id/:account',
        component: SystemAuth,
        name: '系统成员关联充电站'
      },
      {
        path: 'keep',
        component: PlatKeep,
        name: '运维成员'
      },
      {
        path: 'keep/assign/:id/:account',
        component: PlatKeepAuth,
        name: '运维成员关联充电站'
      },
      {
        path: 'owner',
        component: PlatOwner,
        name: '业主管理'
      },
      {
        path: 'owner/add',
        component: PlatOwnerEdit,
        name: '添加业主'
      },
      {
        path: 'owner/edit/:id',
        component: PlatOwnerChange,
        name: '添加编辑'
      },
      {
        path: 'owner/detail/:id',
        component: PlatOwnerDetail,
        name: '业主详情'
      },
      {
        path: 'owner/assign/:id/:account',
        component: OwnerAuth,
        name: '业主管理'
      },
      {
        path: 'agent',
        component: PlatAgent,
        name: '代理商管理'
      },
      {
        path: 'agent/collect/:id',
        component: PlatAgentCard
      },
      {
        path: 'agent/add',
        component: PlatAgentEdit,
        name: '添加代理商'
      },
      {
        path: 'agent/edit/:id',
        component: PlatAgentEdit,
        name: '添加编辑'
      },
      {
        path: 'agent/detail/:id',
        component: PlatAgentDetail,
        name: '代理商详情'
      },
      {
        path: 'agent/config/:type/:id',
        component: PlatAgentConfig
      },
      {
        path: 'agent/assign/:id/:account',
        component: AgentAuth,
        name: '代理商管理'
      },
      {
        path: 'company',
        component: PlatCompany,
        name: '企业主管理'
      },
      {
        path: 'company/detail/:id',
        component: PlatCompanyDetail,
        name: '企业主详情'
      },
      {
        path: 'role',
        component: PlatRole,
        name: '角色管理'
      },
      {
        path: 'role/add',
        component: PlatRoleEdit,
        name: '角色管理'
      },
      {
        path: 'role/detail/:id',
        component: PlatRoleDetail,
        name: '角色管理'
      }
    ]
  },
  {
    path: '/company',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index',
        component: CompanyIndex,
        name: '企业信息'
      },
      {
        path: 'charge',
        component: CompanyCharge,
        name: '充值记录'
      },
      {
        path: 'assign',
        component: CompanyAssign,
        name: '分配记录'
      },
      {
        path: 'account',
        component: CompanyAccount,
        name: '子账号管理'
      },
      {
        path: 'bill',
        component: CompanyBill,
        name: '账单管理'
      },
      {
        path: 'bill/detail',
        component: CompanyBillDetail,
        name: '账单详情'
      },
      {
        path: 'account/stationassign',
        component: CompanyStationAssign,
        name: '子账户关联站点'
      }
    ]
  },
  {
    path: '/auth',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index',
        component: AuthIndex,
        name: '授权'
      },

      {
        path: 'devinfo',
        component: DevInfo
      },
      {
        path: 'opinfo',
        component: OpInfo
      },
      {
        path: 'sms',
        component: SmsList
      },
      {
        path: 'opinfo/invoice',
        component: ElectronicInvoice
      },
      {
        path: 'opinfo/transfer',
        component: TransferInfo
      },
      {
        path: 'index/download',
        component: AppDownload
      },
      {
        path: 'index/agreement',
        component: AppAgreement
      },
      {
        path: 'index/privacy',
        component: AppPrivacy
      },
      {
        path: 'index/question',
        component: AppQuestion
      },
      {
        path: 'index/exercise',
        component: AppActivity
      },
      {
        path: 'index/invite',
        component: AppInvite
      }
    ]
  },
  {
    path: '/run',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'monitor',
        component: Monitor,
        name: '设备监控'
      },
      {
        path: 'monitor/detail',
        component: MonitorDetail,
        name: '设备监控详情'
      },
      {
        path: 'counter',
        component: Counter,
        name: '远程充电账单'
      },
      {
        path: 'counter/detail',
        component: CounterDetail,
        name: '远程充电账单详情'
      },
      {
        path: 'log',
        component: RunLog
      },
      {
        path: 'deploy',
        component: RunDeploy,
        name: '告警配置'
      },
      {
        path: 'fault',
        component: RunFault,
        name: '告警列表'
      }
    ]
  },
  {
    path: '/demo',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'list',
        component: DemoList,
        name: '模块列表'
      },
      {
        path: 'list/tab',
        component: DemoTabList,
        name: '模块列表'
      }
    ]
  },
  {
    path: '/invite/:id',
    component: InviteFriend,
    hidden: true
  },
  {
    path: '/downloadx',
    component: DownloadAppX,
    hidden: true
  },
  {
    path: '/download/:group_id/:type',
    component: DownloadApp,
    hidden: true
  },
  {
    path: '/open/app/:group_id',
    component: OpenApp,
    hidden: true
  },
  {
    path: '/desc/deal/:group_id/:type',
    component: Deal,
    hidden: true
  },
  {
    path: '/app/desc/:id/:type',
    component: AppDesc,
    hidden: true
  },
  {
    path: '/newuser/question/:group_id',
    component: Question,
    hidden: true
  },
  {
    path: '/newuser/guide',
    component: Guide,
    hidden: true
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

export default new VueRouter({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})
