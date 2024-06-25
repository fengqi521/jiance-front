<template>
  <div class="main-right-list upload-file-com">
    <div class="list-left long-desc"><i>*</i>{{ title }}</div>
    <div class="list-right">
      <el-upload
        class="upload-demo"
        ref="upload"
        action=""
        :show-file-list="false"
        :http-request="uploadRequest"
      >
        <slot></slot>
        <slot name="prompt" slot="tip"></slot>
        <div
          class="upload-progress"
          slot="tip"
          v-if="curFile && curFile.length"
        >
          <div
            class="upload-list"
            v-for="(list, index) in curFile"
            @mouseenter="enter"
            @mouseleave="level"
            :key="index"
          >
            <div class="upload-list-left">
              <img
                class="list-icon"
                :src="require('assets/img/ota-upload-file.png')"
              />
              <span
                class="list-name"
                :class="
                  uploadStatus === fileUploadStatus['upload_error'] &&
                  'list-name-error'
                "
                >{{ list.name }}</span
              >
            </div>
            <img
              v-if="uploadStatus === fileUploadStatus['upload_error']"
              class="list-icon list-right-icon"
              :src="require('assets/img/ota-upload-update.png')"
              @click="uploadRequest({ file: list })"
            />
            <img
              v-show="
                (uploadStatus !== fileUploadStatus['upload_success'] &&
                  uploadStatus !== fileUploadStatus['upload_wait']) ||
                (seen &&
                  uploadStatus !== fileUploadStatus['upload_error'] &&
                  !showProgress)
              "
              class="list-icon list-right-icon"
              @click="handleRemove"
              :src="require('assets/img/ota-upload-fail.png')"
            />
            <img
              v-if="
                uploadStatus === fileUploadStatus['upload_success'] &&
                showProgress
              "
              class="list-icon list-right-icon"
              :src="require('assets/img/ota-upload-succ.png')"
            />
          </div>
          <el-progress
            v-if="showProgress"
            :percentage="percent"
            :show-text="false"
            :stroke-width="2"
            :color="
              (uploadStatus === fileUploadStatus['upload_error'] &&
                '#FF6632') ||
              customColor
            "
          ></el-progress>
        </div>
      </el-upload>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    fileList: {
      type: Array,
      default: []
    },
  },

  data () {
    this.fileUploadStatus = {
      upload_error: 0, //上传失败
      upload_success: 1, //上传成功
      upload_wait: 2,  //待上传
    };
    return {
      ENV: process.env.NODE_ENV == "development" ? "" : "",
      customColor: this.$store.state.app.customColor,
      percent: 0,
      uploadStatus: 2,
      showProgress: false,
      seen: false,
      curFile: [],
    }
  },

  watch: {
    fileList (file) {
      this.curFile = file
    },
    uploadStatus (val) {
      if (val && val === this.fileUploadStatus["upload_success"]) {
        setTimeout(() => {
          this.showProgress = false;
        }, 3000);
      }
    },
  },
  methods: {
    enter: function () {
      this.seen = true;
    },

    level: function () {
      this.seen = false;
    },
    //上传文件准备
    uploadRequest: function ({ file }) {
      this.percent = 0;
      this.uploadStatus = this.fileUploadStatus['upload-wait'];
      this.showProgress = true;
      // setTimeout(() => {
      this.uploadLoading(file)
      // }, 1000)
    },

    //上传中
    uploadLoading: function (file) {
      let self = this;
      if (this.cancel) this.cancel()
      const params = this.intoFormData(file);
      if (!this.instance) {
        this.instance = axios.create({
          withCredentials: true,
        });
      }
      let CancelToken = axios.CancelToken;
      this.instance.post(`${this.ENV}/auth/upload-cert`, params, {
        cancelToken: new CancelToken(function executor (c) {
          self.cancel = c;
        }),
        onUploadProgress: (progressEvent) => {
          this.percent = (progressEvent.loaded / progressEvent.total * 100);
        }
      }).then(res => {
        const response = res.data;
        if (response.code == 1) {
          this.$emit('update:changeValue', [{ name: response.data.file_name, url: response.data.save_path }]);
          this.uploadStatus = this.fileUploadStatus['upload_success'];
        } else {
          this.$emit('update:changeValue', [])
          this.uploadStatus = this.fileUploadStatus['upload_error'];
          this.$nextTick(() => {
            this.curFile = [file];
          })
          this.$sfNotify({
            duration: 0,
            type: "error",
            message: response.message
          });
          return false;
        }

      }).catch(err => {
      })

    },

    //将文件转化成formData
    intoFormData: function (file) {
      let formData = new FormData();
      formData.append("file", file);
      return formData;
    },

    //删除
    handleRemove: function () {
      if (this.cancel) this.cancel()
      this.$emit('update:changeValue', [])
    }
  }
}
</script>
<style lang='scss' scoped>
.upload-file-com {
  float: left;
  margin-left: 48px;
  padding-bottom: 24px;

  .list-left {
    float: left;
    font-size: 12px;
    color: rgba(102, 102, 102, 1);
    line-height: 36px;
    max-width: 82px;
    padding-left: 10px;
    position: relative;

    i {
      position: absolute;
      top: -8px;
      left: 0;
      height: 36px;
      line-height: 36px;
      display: block;
      padding-right: 4px;
      color: #ff6632;
    }

    &.long-desc {
      line-height: 20px;
    }
  }

  .list-right {
    float: none;
    margin-left: 98px;
    /deep/ .upload-demo {
      width: 240px;

      .el-upload {
        text-align: left;
      }
      .el-button--primary {
        background: transparent;
        border-color: #e0e0e0;

        span {
          font-size: 12px;
          color: #333333;
          line-height: 20px;
        }
      }
      .el-upload__tip {
        font-size: 12px;
        color: #999999;
        line-height: 20px;
        white-space: nowrap;
      }
      .el-button:hover {
        background: transparent;
        border-color: $origin-company-button;

        span {
          font-size: 12px;
          color: $origin-company-button;
          line-height: 20px;
        }
      }
      // }

      .el-icon-document {
        content: "";
      }

      .el-upload-list__item {
        position: relative;
      }

      .el-upload-list__item-name {
        margin-left: 10px;
        font-size: 12px;
        color: #333333;
        line-height: 20px;

        &:hover {
          font-size: 12px;
          color: #333333;
          line-height: 20px;
        }
      }

      .el-icon-upload-success::before {
        content: "";
      }
    }
  }
}

.upload-progress {
  .upload-list {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 8px 0 4px;
    height: 24px;
    line-height: 24px;

    .list-icon {
      display: inline-block;
      width: 16px;
      height: 16px;
      vertical-align: middle;
    }

    .list-right-icon {
      margin-left: 8px;
    }

    .list-name {
      display: inline-block;
      margin-left: 4px;
      width: 190px;
      font-size: 12px;
      color: #333;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      word-break: break-all;
    }

    .list-name-error {
      width: 170px;
      color: #ff6632;
    }

    .close-file:hover {
      display: block;
    }

    &:hover {
      cursor: pointer;
      background: rgba(0, 0, 0, 0.06);
    }
  }

  .upload-list-left {
    display: flex;
    align-items: center;
  }
}
</style>