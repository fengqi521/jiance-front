import Qs from 'qs'
import store from '../store'
import router from '@/router'
import sfMessage from '../plugins/message.js'
//项目地址的配置
const url = '/'
let ROOT
if (process.env.NODE_ENV === 'development') {
  ROOT = '/api'
} else {
  //生产环境下的地址
  ROOT = url
}
axios.defaults.baseURL = ROOT
axios.defaults.timeout = 20000

// 请求拦截器
axios.interceptors.request.use(
  config => {
    config.data = Qs.stringify(config.data)
    config.headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
    return config
  },
  error => {
    return Promise.reject(err)
  }
)

// 响应拦截器
axios.interceptors.response.use(
  response => {
    return response
  },
  err => {
    if (err && err.response) {
      switch (err.response.status) {
        case 402:
          sfMessage.error('抱歉，当前用户没有操作权限')
          return false
        case 401:
          Cookies.remove('SuserId')
          store.commit('SET_UID', '')
          router.push({
            path: '/login'
          })
          break
        case 403:
          console.log('拒绝访问')
          break
        case 404:
          console.log('请求错误,未找到该资源')
          // router.push({
          //   path: '/404'
          // })
          break
        case 405:
          console.log('请求方法未允许')
          break
        case 408:
          console.log('请求超时')
          break
        case 500:
          console.log('服务器端出错')
          break
        case 501:
          console.log('网络未实现')
          break
        case 502:
          console.log('网络错误')
          break
        case 503:
          console.log('服务不可用')
          break
        case 504:
          console.log('网络超时')
          break
        case 505:
          console.log('http版本不支持该请求')
          break
        default:
          console.log(`连接错误${err.response.status}`)
      }
    } else {
      console.log('连接到服务器失败')
    }
    return Promise.resolve(err.response)
  }
)

function get(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params
      })
      .then(response => {
        resolve(response.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

function post(url, data) {
  return new Promise((resolve, reject) => {
    axios.post(url, data).then(
      response => {
        resolve(response.data)
      },
      err => {
        reject(err)
      }
    )
  })
}

export { get, post }
