/**
 * Created by
 */

/* 是否邮箱*/
export function isEmail(str) {
  const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
  return reg.test(str.trim())
}

/* 合法手机号*/
export function isPhone(str) {
  const reg = /^1\d{10}$/
  return reg.test(str.trim())
}

/* 合法用户名*/
export function checkNick(nick, min_len, max_len) {
  if (!nick) return
  nick = (nick + '').trim()
  var min_len = min_len || 8
  var max_len = max_len || 16
  var reg1 = /^[\u4e00-\u9fa5]$/
  var reg2 = /^[a-zA-Z0-9]$/
  var len = 0
  for (var i = 0; i < nick.length; i++) {
    if (reg1.test(nick[i])) {
      len++
    } else if (reg2.test(nick[i])) {
      len++
    } else {
      len = 0
      break
    }
  }
  if (len === 0 || len > max_len || len < min_len) {
    return false
  }
  return true
}

export function checkName(nick, max_len) {
  if (!nick) return
  nick = (nick + '').trim()
  var max_len = max_len || 16
  var reg1 = /^[\u4e00-\u9fa5]$/
  var reg2 = /^[a-zA-Z0-9]$/
  var len = 0
  for (var i = 0; i < nick.length; i++) {
    if (reg1.test(nick[i])) {
      len++
    } else if (reg2.test(nick[i])) {
      len++
    } else {
      len = 0
      break
    }
  }

  if (len === 0 || len > max_len) {
    return false
  }
  return true
}

export function countNameLen(nick) {
  if (!nick) return
  nick = (nick + '').trim()
  var reg1 = /^[\u4e00-\u9fa5]$/
  var reg2 = /^[a-zA-Z0-9]$/
  var len = 0
  for (var i = 0; i < nick.length; i++) {
    if (reg1.test(nick[i])) {
      len += 2
    } else if (reg2.test(nick[i])) {
      len++
    }
  }

  return len
}

/* 合法密码*/
export function checkPassword(nick, min_len, max_len) {
  if (!nick) return
  nick = (nick + '').trim()
  var min_len = min_len || 6
  var max_len = max_len || 18
  var reg = /^\w$/
  var len = 0
  for (var i = 0; i < nick.length; i++) {
    if (reg.test(nick[i])) {
      len++
    } else {
      len = 0
      break
    }
  }
  if (len === 0 || len > max_len || len < min_len) {
    return false
  }
  return true
}

/* 合法uri*/
export function validateURL(textval) {
  const urlregex =
    /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 验证key*/
// export function validateKey(str) {
//     var reg = /^[a-z_\-:]+$/;
//     return reg.test(str);
// }

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * 招商银行卡验证
 */

export function validateCMBCard(val) {
  const reges = [
    /^(402658|410062|468203|512425|524011|622580|622588|622598|622609|621286|621483|621485|621486|621299)\d{10}$/g,
    /^75591\d{10}$/g,
    /^(95555)\d{11}$/g,
    /^(690755)\d{9}$/g,
    /^(690755)\d{12}$/g,
    /^(356885|356886|356887|356888|356890|439188|439227|479228|479229|521302|356889|545620|545621|545947|545948|552534|552587|622575|622576|622577|622578|622579|545619|622581|622582|545623|628290|439225|518710|518718|628362|439226|628262|625802|625803)\d{10}$/g,
    /^(370285|370286|370287|370289)\d{9}$/g,
    /^(620520)\d{13}$/g
  ]
  return reges.some(reg => reg.test(val))
}

/**
 * @param val {string}
 * @return {boolean}
 *
 */

export function validateUID(val) {
  const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,10}$/
  return reg.test(val)
}
