import App from './App'
import router from './router'
import store from './store'
import Components from '@/components'

// 插件
import VueClipboard from 'vue-clipboard2'
import Message from 'src/plugins/message.js'
import Notification from 'src/plugins/notification.js'

// 变量
import * as filters from './filters'
import * as utils from './utils'
import * as validate from './utils/validate'
import { server } from '@/api'
import { cmptConfig } from './js/cmptConfig'

import 'normalize.css/normalize.css'
import 'assets/css/index.scss'

// 权限
import '@/permission'

// 获取主题色的地址
const theme_dir = process.env.THEME
require('../static/theme/' + theme_dir + '/common.scss')

Vue.config.productionTip = false

Vue.prototype.$api = server
Vue.prototype.$utils = utils
Vue.prototype.$validate = validate
Vue.prototype.$cmptConfig = cmptConfig
Vue.prototype.$sfMessage = Message
Vue.prototype.$sfNotify = Notification

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.use(Components)
Vue.use(VueClipboard)
Vue.use(ELEMENT, { size: 'small', zIndex: 3000 })
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
