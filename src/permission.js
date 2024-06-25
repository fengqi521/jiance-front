import router from './router'
import store from './store'
import NProgress from 'nprogress'

import 'nprogress/nprogress.css'

// 不重定向白名单
const whiteList = [
  '/login',
  '/index',
  '/reset',
  '/sendpwd',
  '/401',
  '404',
  '/sharescreen',
  '/sharepwd',
  '/screen/share',
  '/invite',
  '/downloadx',
  '/open/app',
  '/download',
  '/desc/deal',
  '/newuser/question',
  '/newuser/guide',
  '/app/desc'
]

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (store.getters.uid) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else if (to.path == '/401') {
      next()
    } else if (to.path == '/404') {
      next()
    } else {
      next()
    }
  } else {
    var flag = false
    for (const key in whiteList) {
      var item = whiteList[key]
      if (to.path.indexOf(item) > -1) {
        flag = true
        break
      }
    }
    if (flag) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
  NProgress.done()
})

router.afterEach(() => {
  NProgress.done()
})
