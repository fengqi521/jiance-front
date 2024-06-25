<template>
  <section>
    <div class="section-title">
      <router-link to="/auth/index">APP管理</router-link>
      > APP下载
    </div>
    <div v-loading="listLoading">
      <div class="section-list">
        <div class="section-item-header clearfix">
          <span>APP下载页面</span>
        </div>
        <div class="header-main clearfix">
          <div class="left">
            <img class="left-top" src="./image/app_top.png" />
            <div class="left-bottom">
              <img :src="real_src" alt="" class="download-img" />
              <div class="android">
                <img src="./image/app_android.png" alt="" />
              </div>
              <div class="ios"><img src="./image/app_ios.png" alt="" /></div>
            </div>
          </div>
          <div class="right">
            <div class="right-top">
              <p class="right-top-title">注意：</p>
              <p class="right-top-content">
                此页面提供下载APP能力，可用于扫码下载，用户通过活动接受邀请后下载。此页面需要将配图更换并将下载的链接填写。
              </p>
            </div>
            <div class="right-center">
              <!-- 上传图片 -->
              <div class="info-item">
                <div class="info-item-left">上传图片</div>
                <div class="info-item-right">
                  <el-upload
                    class="cover-uploader"
                    :action="`${ENV}/platform/upload-app-img`"
                    :show-file-list="false"
                    :beforeUpload="beforeAvatarUpload"
                    :on-success="uploadCoverImageSuccess"
                  >
                    <div v-if="real_src" class="uploader-main">
                      <img :src="real_src" class="coverImg" />
                      <div class="edit-uploader">更换图片…</div>
                    </div>
                    <div v-else class="uploader-main__1">
                      <div class="uploader-icon"></div>
                    </div>
                  </el-upload>
                </div>
                <div class="uploader-detail">* 建议尺寸392*432px</div>
                <div class="uploader-tips">
                  （只能上传jpg/png格式文件，文件不能超过1M）
                </div>
              </div>
            </div>
            <div class="right-bottom">
              <div class="right-bottom-item">
                <div class="info-item-left">安卓下载地址</div>
                <div class="info-item-right">
                  <div class="item-right-title">
                    安卓地址需要在应用宝、百度、华为市场上架后生成再填写。
                  </div>
                  <el-input
                    v-model="android_url"
                    class="apk_url"
                    placeholder="请输入安卓下载地址"
                  />
                </div>
              </div>
              <div class="right-bottom-item">
                <div class="info-item-left">IOS下载地址</div>
                <div class="info-item-right">
                  <div class="item-right-title">
                    IOS下载地址，使用App Store中的下载地址。
                  </div>
                  <el-input
                    v-model="ios_url"
                    class="apk_url"
                    placeholder="请输入IOS下载地址"
                  />
                </div>
              </div>
              <div class="right-bottom-item">
                <div class="btn_succ sub-btn" @click="saveChange">提交</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "",
  components: {},
  data() {
    return {
      id: this.$route.query.id || 0,
      month: this.$route.query.month || "",
      detail: {
        out_trade_id: "--",
        real_amount: "0",
      },
      pile: {},
      station: {},
      user: {},
      listLoading: false,
      img_src: "",
      real_src: "",
      ENV: process.env.NODE_ENV == "development" ? "/api" : "",
      android_url: "",
      ios_url: "",
    };
  },
  created() {
    this.getDetail();
  },
  methods: {
    getDetail() {
      this.listLoading = true;
      var that = this;
      this.$api.getPcConfig({}).then((res) => {
        this.listLoading = false;
        if (res.code == 1) {
          that.img_src = res.data.app_download_img;
          that.real_src = `${this.ENV}` + res.data.app_download_img;
          that.android_url = res.data.app_android_url;
          that.ios_url = res.data.app_ios_url;
        }
      });
    },
    //上传图片成功回调
    uploadCoverImageSuccess(res, file) {
      if (res.code == 1) {
        this.img_src = res.url;
        this.real_src = `${this.ENV}` + res.url;
      }
    },
    //保存修改的配置消息
    saveChange() {
      this.$api
        .saveDownloadConfig({
          img_url: this.img_src,
          android_url: this.android_url,
          ios_url: this.ios_url,
        })
        .then((res) => {
          if (res.code == 1) {
            this.$sfNotify({
              message: "成功",
            });
            this.getDetail();
          } else {
            this.$sfNotify({
              duration: 0,
              type: "error",
              message: "配置失败",
            });
          }
        });
    },
    beforeAvatarUpload(file) {
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extension = testmsg === "jpg";
      const extension2 = testmsg === "png";
      const isLt2M = file.size / 1024 / 1024 < 1;
      if (!extension && !extension2) {
        this.$sfNotify({
          duration: 0,
          type: "error",
          message: "上传文件只能是 jpg、png格式!",
        });
      }
      if (!isLt2M) {
        this.$sfNotify({
          duration: 0,
          type: "error",
          message: "上传文件大小不能超过 1MB!",
        });
      }
      return extension || (extension2 && isLt2M);
    },
  },
};
</script>
<style lang="scss" scoped>
.section-list {
  padding: 0 24px 24px;
  background: rgba(255, 255, 255, 1);
  border-radius: 2px;
  border: 1px solid rgba(231, 232, 233, 1);

  .header-main {
    display: flex;
    margin-top: 24px;

    .left {
      float: left;
    }

    .left {
      width: 375px;
      height: 691px;
      border: 1px solid #e0e0e0;

      .left-top {
        height: 88px;
      }

      .left-bottom {
        background: url("./image/download-background.png") no-repeat;

        .download-img {
          height: 216px;
          width: 196px;
          margin-top: 80px;
          margin-left: 90px;
          margin-bottom: 54px;
        }

        .android,
        .ios {
          width: 230px;
          height: 71px;
          margin-left: 73px;
        }

        .ios {
          margin-top: 10px;
        }
      }
    }

    .right {
      float: left;
      flex: 1;
      margin-left: 56px;

      .right-top {
        background: rgba(255, 183, 60, 0.15);
        border-radius: 3px;
        font-weight: bold;
        color: #666666;
        line-height: 20px;
        font-size: 12px;
        padding: 16px;
        margin-bottom: 24px;

        .right-top-title {
          font-weight: bold;
        }
      }

      .info-item {
        padding-bottom: 24px;

        .info-item-left {
          position: relative;
          float: left;
          max-width: 86px;
          font-size: 12px;
          color: #333;
          line-height: 36px;

          i {
            position: absolute;
            top: 0;
            left: 0;
            height: 36px;
            line-height: 36px;
            display: block;
            padding-right: 4px;
            color: #ff6632;
          }
        }

        .uploader-detail,
        .uploader-tips {
          margin-left: 81px;
          width: 280px;
        }
        .uploader-detail {
          margin-top: 4px;
        }
        .info-item-right {
          margin-left: 96px;
          .cover-uploader {
            border: 1px dashed #e0e0e0;
            background-color: #f5f5f5;
            width: 196px;
            height: 216px;
          }
          .edit-uploader {
            position: absolute;
            top: 82px;
            left: 224px;
            width: 82px;
            height: 36px;
            line-height: 34px;
            text-align: center;
            background: rgba(255, 255, 255, 1);
            font-size: 12px;
            border-radius: 3px;
            color: #333;
            border: 1px solid rgba(224, 224, 224, 1);

            &:hover {
              color: $a-hover;
              border-color: $a-hover;
            }
          }
        }
      }
      .right-bottom-item {
        margin-bottom: 32px;
        .info-item-left {
          position: relative;
          float: left;
          width: 72px;
          height: 20px;
          font-size: 12px;
          color: #333333;
          line-height: 20px;
        }
        .info-item-right {
          margin-left: 96px;
          .apk_url {
            width: 400px;
          }
          .item-right-title {
            width: 324px;
            height: 20px;
            font-size: 12px;
            color: #666666;
            line-height: 20px;
            margin-bottom: 8px;
          }
        }
        .sub-btn {
          width: 144px;
          height: 36px;
          border-radius: 3px;
          text-align: center;
          line-height: 36px;
          color: #ffffff;
          margin-left: 96px;
          cursor: pointer;
        }
        
      }
    }
  }
}
</style>
