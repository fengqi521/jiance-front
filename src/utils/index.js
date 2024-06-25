import crypto from 'crypto'

export function formatDate(date, format) {
  if (!date) return
  if (!format) format = 'yyyy-MM-dd HH:ss:mm'
  switch (typeof date) {
    case 'string':
      date = new Date(date.replace(/-/g, '/'))
      break
    case 'number':
      date = new Date(date)
      break
  }
  if (!date instanceof Date) return
  var dict = {
    yyyy: date.getFullYear(),
    M: date.getMonth() + 1,
    d: date.getDate(),
    H: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds(),
    MM: ('' + (date.getMonth() + 101)).substr(1),
    dd: ('' + (date.getDate() + 100)).substr(1),
    HH: ('' + (date.getHours() + 100)).substr(1),
    mm: ('' + (date.getMinutes() + 100)).substr(1),
    ss: ('' + (date.getSeconds() + 100)).substr(1)
  }
  return format.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g, function () {
    return dict[arguments[0]]
  })
}

export function genId() {
  var time = new Date().getTime()
  var str = time + '' + Math.random()
  var md5 = crypto.createHash('md5')
  md5.update(str)
  var md5Str = md5.digest('hex')
  return '_id_' + md5Str.slice(8, 24)
}
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time == 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(parseInt(time))
  }

  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }

  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}

/**
 * 地址栏参数
 * @param {string} url
 * @returns {object}
 */
export function getQueryObject(url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 *get getByteLen
 * @param {Sting} val
 * @returns {number}
 */
export function getByteLen(val) {
  let len = 0
  for (let i = 0; i < val.length; i++) {
    if (val[i].match(/[^\x00-\xff]/gi) != null) {
      len += 1
    } else {
      len += 0.5
    }
  }
  return Math.floor(len)
}

export function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

export function param(json) {
  if (!json) return ''
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return ''
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
    })
  ).join('&')
}

export function param2Obj(url) {
  const search = url.split('?')[1]
  return JSON.parse(
    '{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}'
  )
}

export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

export function objectMerge(target, source) {
  /* Merges two  objects,
     giving the last one precedence */

  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  for (const property in source) {
    if (source.hasOwnProperty(property)) {
      const sourceProperty = source[property]
      if (typeof sourceProperty === 'object') {
        target[property] = objectMerge(target[property], sourceProperty)
        continue
      }
      target[property] = sourceProperty
    }
  }
  return target
}

export function scrollTo(element, to, duration) {
  if (duration <= 0) return
  const difference = to - element.scrollTop
  const perTick = (difference / duration) * 10
  setTimeout(() => {
    console.log(new Date())
    element.scrollTop = element.scrollTop + perTick
    if (element.scrollTop === to) return
    scrollTo(element, to, duration - 10)
  }, 10)
}

export function toggleClass(element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString = classString.substr(0, nameIndex) + classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

export const pickerOptions = [
  {
    text: '今天',
    onClick(picker) {
      const end = new Date()
      const start = new Date(new Date().toDateString())
      end.setTime(start.getTime())
      picker.$emit('pick', [start, end])
    }
  },
  {
    text: '最近一周',
    onClick(picker) {
      const end = new Date(new Date().toDateString())
      const start = new Date()
      start.setTime(end.getTime() - 3600 * 1000 * 24 * 7)
      picker.$emit('pick', [start, end])
    }
  },
  {
    text: '最近一个月',
    onClick(picker) {
      const end = new Date(new Date().toDateString())
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      picker.$emit('pick', [start, end])
    }
  },
  {
    text: '最近三个月',
    onClick(picker) {
      const end = new Date(new Date().toDateString())
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      picker.$emit('pick', [start, end])
    }
  }
]

export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

export function objCopy(item) {
  return JSON.parse(JSON.stringify(item))
}

export function delArrItem(arr, index) {
  return arr.splice(index, 1)
}

export function removeArrByKey(arr, key) {
  var _index = -1
  for (const index in arr) {
    var item = arr[index]
    if (item == key) {
      _index == index
    }
  }
  return arr.splice(_index, 1)
}

export function getArrayItem(arr, key, val) {
  for (const index in arr) {
    var item = arr[index]
    if (item[key] == val) {
      return JSON.parse(JSON.stringify(item))
    }
  }
  return null
}

/* istanbul ignore next */
export function hasClass(el, cls) {
  if (!el || !cls) return false
  if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.')
  if (el.classList) {
    return el.classList.contains(cls)
  } else {
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1
  }
}

/* istanbul ignore next */
export function addClass(el, cls) {
  if (!el) return
  var curClass = el.className
  var classes = (cls || '').split(' ')

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i]
    if (!clsName) continue

    if (el.classList) {
      el.classList.add(clsName)
    } else if (!hasClass(el, clsName)) {
      curClass += ' ' + clsName
    }
  }
  if (!el.classList) {
    el.className = curClass
  }
}

/* istanbul ignore next */
export function removeClass(el, cls) {
  if (!el || !cls) return
  var classes = cls.split(' ')
  var curClass = ' ' + el.className + ' '

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i]
    if (!clsName) continue

    if (el.classList) {
      el.classList.remove(clsName)
    } else if (hasClass(el, clsName)) {
      curClass = curClass.replace(' ' + clsName + ' ', ' ')
    }
  }
  if (!el.classList) {
    el.className = trim(curClass)
  }
}

// export function checkFuncAuth(item) {
//     var auth = authList.list;
//     var auth_item = auth[item] ? auth[item] : '';
//     var auth_list = localStorage.getItem("USER_PERMISSIONS") ? localStorage.getItem("USER_PERMISSIONS") : '';
//     var auth_json = auth_list ? auth_list.split(",") : '';
//     for (const key in auth_json) {
//         var _item = auth_json[key]
//         if (_item == auth_item) {
//             return true;
//         }
//     }
//     console.log('checkFuncAuth fail', item, '--', auth_item, '--', auth_list)
//     return false;
// }

// export function getAuthMessage() {
//     return authList.note;
// }

export function getAuthSign() {
  var token = process.env.CLOUD_TOKEN
  var id = process.env.CLOUD_ID
  var tt = parseInt(new Date().getTime() / 1000) + ''
  var md5 = crypto.createHash('md5')
  var str = id + token + tt
  md5.update(str)
  var sign = md5.digest('hex')
  var op = 'auth'
  var authtype = 'md5sign'

  return { sign: sign, id: id, tt: tt, op: op, authtype: authtype }
}

// export function getFirstAuthUrl(permissions)
// {
//     if(permissions.length == 0) {
//         return "/#/info/index";
//     }
//     var menus = authList.menus;
//     for (const key in menus) {
//         if(permissions.indexOf(key) > -1) {
//             return menus[key]
//         }
//     }
//     return "/#/info/index";
// }

export function changeListSize() {
  var step = -1,
    docW = document.body.clientWidth,
    _content = document.getElementsByClassName('section-content')[0]
  if (!document.body.contains(_content)) return

  while (docW - 424 > 296 * ++step);
  _content.style.width = step * 296 + 'px'
}

export function checkCode(that, type) {
  var timer = null
  var second = Cookies.get(`${type}_second`)
  that[`${type}_again`] = false
  timer = setInterval(function () {
    second--
    if (second > 0) {
      that[`${type}_second`] = second
      Cookies.set(`${type}_second`, second)
    } else {
      that[`${type}_again`] = true
      that[`${type}_second`] = 60
      Cookies.set(`${type}_second`, 60)
      clearInterval(timer)
      timer = null
    }
  }, 1000)
}

export function handleKeydown(event) {
  if (!/\d/.test(event.key) && event.keyCode != 8) {
    event.preventDefault()
    event.returnValue = false
  }
}

export function paginateJump(that, page, cb) {
  switch (page) {
    case 1:
      that.currentPage = 1
      break
    case 2:
      if (that.currentPage > 1) {
        that.currentPage--
      } else {
        that.currentPage = 1
      }
      break
    case 3:
      if (that.currentPage < that.page_count) {
        that.currentPage++
      } else {
        that.currentPage = that.page_count
      }
      break
    case 4:
      that.currentPage = that.page_count
      break
  }

  cb(that.currentPage)
}

export function onKeyDownScreen(event) {
  if (event.keyCode == 69) {
    event.preventDefault()
    event.returnValue = false
  }
}

/**
 * 取值小数点后两位
 * @param {string|number} num
 * @returns {number}
 */

export function toFixedNumber(num) {
  const number = parseFloat(num)
  if (isNaN(number)) return 0
  if (!number) return number
  return number.toFixed(2)
}
