module.exports = {
  NODE_ENV: '"production"',
  CLOUD_WS: '"wss://iiotapi.qinglianyun.com:7703/cloudapi/dev/data/ws/"',
  CLOUD_ID: '"16"',
  CLOUD_TOKEN: '"300ab180-70ef-4d9e-a7a6-d5a5875f9407"',
  THEME: JSON.stringify(process.env.THEME_TYPE) || '"qinglianyun"',
  // SCREEN_PATH: '"https://manage.leisn.cn:8105"', //测试地址
  // SCREEN_API_PATH: '"https://apimanage.leisn.cn"'
  SCREEN_PATH: '"https://manage-test.leisn.cn:8105"', //正式地址
  SCREEN_API_PATH: '"https://apianchong.leisn.cn"'
}
