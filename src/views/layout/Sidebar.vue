<template>
  <aside class="scrollBar">
    <div v-for="(item, index) in nav_list" :key="index">
      <div v-show="showNewMenus(item.name)" class="aside-list" :class="{
        'aside-act': $route.path.indexOf(item.path) != -1 || $route.path.indexOf(item.secondPath) != -1,
        'aside-hover-act': current_index == index,
      }">
        <div :class="`aside-top aside-top-${item.index}`" @click="handleOpenChild(index)">
          <i class="top-icon"></i>
          <span class="top-text">{{ item.name }}</span>
          <span class="top-arrow" :class="{ 'top-arrow-open': current_index == index }"></span>
        </div>
        <sf-collapse-transition>
          <div v-if="current_index == index">
            <div class="aside-main">
              <div v-for="(citem, cindex) in item.children" :key="cindex">
                <a class="aside-item" v-if="citem.aLink && showNewMenus(citem.name)" :href="citem.aLink" target="__blank">
                  {{ citem.name }}</a>
                <router-link v-else-if="!citem.alink && showNewMenus(citem.name)" :to="citem.path"
                  :target="citem.target ? '_blank' : '_self'" class="aside-item" :style="{
                    color: ($route.path.indexOf(citem.path) != -1 || $route.path.indexOf(citem.secondPath) != -1) ? '#fff' : '',
                  }">
                  {{ citem.name }}
                </router-link>
              </div>
            </div>
          </div>
        </sf-collapse-transition>
      </div>
    </div>
  </aside>
</template>

<script>
export default {
  name: '',
  components: {},
  data () {
    const info = Cookies.get('auth_info')
    let auth_id, auth_token
    if (info) {
      const infoObj = JSON.parse(info)
      auth_id = infoObj.auth_id
      auth_token = infoObj.auth_token
    }
    return {
      current_index: -1,
      nav_list: [
        {
          name: '数据分析',
          index: 1,
          path: 'data',
          children: [
            {
              name: '运营数据分析',
              path: '/data/operation'
            },
            {
              name: '运维数据分析',
              path: '/data/maintenance'
            },
            {
              name: '历史数据',
              path: '/data/history'
            },
            {
              name: '数字大屏',
              aLink: `${process.env.SCREEN_PATH
                }/#/stats-center?auth_id=${encodeURIComponent(
                  auth_id
                )}&auth_token=${encodeURIComponent(
                  auth_token
                )}&api_url=${encodeURIComponent(process.env.SCREEN_API_PATH)}`
            }
          ]
        },
        {
          name: '设备管理',
          path: 'device',
          index: 2,
          children: [
            {
              name: '充电站管理',
              path: '/device/station'
            },
            {
              name: '充电桩管理',
              path: '/device/pile'
            },
            {
              name: '资产管理',
              path: '/device/asset'
            },
            {
              name: '充电记录管理',
              path: '/device/charge'
            },
            {
              name: 'OTA管理',
              path: '/device/ota'
            }
          ]
        },
        {
          name: '交易中心',
          path: 'trad',
          index: 3,
          children: [
            {
              name: '账单管理',
              path: '/trad/bill'
            },
            {
              name: '业主分润',
              path: '/trad/profit'
            },
            {
              name: '代理商分润',
              path: '/trad/agent'
            },
            {
              name: '分润管理',
              path: '/trad/manage'
            },
            {
              name: '充值管理',
              path: '/trad/recharge'
            },
            {
              name: '提现管理',
              path: '/trad/cash'
            },
            {
              name: '售后管理',
              path: '/trad/service'
            },
            {
              name: '发票管理',
              path: '/trad/invoice'
            }
          ]
        },
        {
          name: '用户管理',
          path: 'user',
          index: 4,
          children: [
            {
              name: '消费用户',
              path: '/user/users'
            },
            {
              name: '等级管理',
              path: '/user/grade'
            }
          ]
        },
        {
          name: '车辆管理',
          path: 'vehicle',
          index: 5,
          children: [
            {
              name: '车辆管理',
              path: '/vehicle/car'
            },
            {
              name: '群组管理',
              path: '/vehicle/groupmanager'
            }
          ]
        },
        {
          name: '卡管理',
          path: 'card',
          index: 13,
          children: [
            {
              name: '卡信息',
              path: '/card/message'
            }
          ]
        },
        {
          name: '运营管理',
          path: 'activity',
          index: 6,
          children: [
            {
              name: '优惠券管理',
              path: '/activity/coupon'
            },
            {
              name: '车辆优惠管理',
              path: '/activity/machine'
            },
            {
              name: '活动广告管理',
              path: '/activity/news'
            },
            {
              name: '组队活动管理',
              path: '/activity/team'
            },
            {
              name: '启动页管理',
              path: '/activity/start'
            }
          ]
        },
        {
          name: '平台对接管理',
          path: 'connect',
          index: 7,
          children: [
            {
              name: '运营商授权',
              path: '/connect/operator'
            },
            {
              name: '运营商统计',
              path: '/connect/stat'
            }
          ]
        },
        {
          name: '平台管理',
          path: 'auth',
          index: 8,
          children: [
            {
              name: 'APP管理',
              path: '/auth/index'
            },
            {
              name: '运营主体信息',
              path: '/auth/opinfo'
            },
            {
              name: '设备授权数管理',
              path: '/auth/devinfo'
            },
            {
              name: '短信管理',
              path: '/auth/sms'
            }
          ]
        },
        {
          name: '企业管理',
          path: 'company',
          index: 10,
          children: [
            {
              name: '企业信息',
              path: '/company/index'
            },
            {
              name: '充值记录',
              path: '/company/charge'
            },
            {
              name: '分配记录',
              path: '/company/assign'
            },
            {
              name: '子账号管理',
              path: '/company/account'
            },
            {
              name: '账单管理（企业）',
              path: '/company/bill'
            },
            {
              name: '车辆管理（企业）',
              path: '/vehicle/car'
            }
          ]
        },
        {
          name: '平台成员管理',
          path: 'platform',
          index: 11,
          secondPath: 'company',
          children: [
            {
              name: '运营成员',
              path: '/platform/system'
            },
            {
              name: '运维成员',
              path: '/platform/keep'
            },
            {
              name: '业主',
              path: '/platform/owner'
            },
            {
              name: '代理商',
              path: '/platform/agent'
            },
            {
              name: '大客户',
              path: '/platform/company',
              secondPath: '/company/account'
            },
            {
              name: '角色管理',
              path: '/platform/role'
            }
          ]
        },
        {
          name: '运维管理',
          path: 'run',
          index: 12,
          children: [
            {
              name: '设备监控',
              path: '/run/monitor'
            },
            {
              name: '远程充电账单',
              path: '/run/counter'
            },
            {
              name: '设备故障记录',
              path: '/run/log'
            },
            {
              name: '告警配置',
              path: '/run/deploy'
            },
            {
              name: '告警列表',
              path: '/run/fault'
            }
          ]
        }
      ],
      menus: JSON.parse(this.$store.getters.menus)
    }
  },
  mounted () {
    this.nav_list.map((item, index) => {
      if (this.$route.path.indexOf(item.path) != -1) {
        this.current_index = index
      }
    })
  },
  methods: {
    showNewMenus (_menu) {
      let permissions = this.menus ? this.menus : []
      if (permissions.indexOf(_menu) > -1) {
        return true
      }
      return false
    },
    handleOpenChild (ind) {
      this.current_index = this.current_index == ind ? -1 : ind
    }
  }
}
</script>
