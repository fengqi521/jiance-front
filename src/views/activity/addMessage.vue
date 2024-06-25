<template>
  <section>
    <div class="section-title">
      <router-link to="/activity/news" class="section-title">活动广告管理</router-link>
      <span class="section-title">></span>
      <span class="section-title">添加活动</span>
    </div>
    <div class="section-container">
      <div class="section-item-header clearfix">
        <span class="manager-span">
          <div class="section-header">
            <div class="section-item-header">
              <span>活动信息</span>
            </div>
          </div>
        </span>
      </div>
      <!-- 添加/编辑 活动 -->
      <el-form :model="activitInfo" ref="activitInfo" :rules="dataRules">
          <div class="section-list admessage-box">
            <div class="section-left">活动名称</div>
            <div class="section-right">
              <el-form-item prop="title">
                <el-input
                  :disabled="currentItem.id == 0 ? false : true"
                  type="textarea"
                  v-model="activitInfo.title"
                  placeholder="请输入活动名称"
                />
              </el-form-item>
            </div>
          </div>
          <div class="section-list">
            <div class="section-left">活动链接</div>
            <div class="section-right">
              <el-form-item prop="url">
                <el-input type="textarea" v-model="activitInfo.url" placeholder="请输入活动链接" />
              </el-form-item>
            </div>
          </div>
          <div class="section-list">
            <div class="section-left">活动时间</div>
            <div class="section-right time-outer">
              <el-form-item prop="start_time">
                <el-date-picker
                  v-model="activitInfo.start_time"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm"
                  format="yyyy-MM-dd HH:mm"
                  placeholder="选择开始日期"
                ></el-date-picker>
              </el-form-item>
              <span class="time-text">至</span>
              <el-form-item prop="end_time">
                <el-date-picker
                  class="end-time"
                  v-model="activitInfo.end_time"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm"
                  format="yyyy-MM-dd HH:mm"
                  placeholder="选择结束日期"
                ></el-date-picker>
              </el-form-item>
            </div>
          </div>
          <div class="section-list">
            <div class="section-left">上线/下线</div>
            <div class="section-right">
              <el-form-item class="radio-outer" prop="status">
                <el-radio v-model="activitInfo.status" label="1">上线</el-radio>
                <el-radio v-model="activitInfo.status" label="2">下线</el-radio>
              </el-form-item>
            </div>
          </div>
          <div class="section-list">
            <div class="section-left">上传图片</div>
            <div class="section-right">
              <!-- 替换图片 -->
              <template v-if="activitInfo.img_url">
                <div class="cover-outer">
                  <img :src="real_img_url" class="coverImg" />
                  <el-upload
                    class="edit-uploader"
                    :action="`${ENV}/activity/upload`"
                    :show-file-list="false"
                    :on-success="changeImgUrl"
                  >更换图片…</el-upload>
                </div>
              </template>
              <!--添加图片 -->
              <template v-else>
                <el-upload
                  class="add-uploader"
                  :action="`${ENV}/activity/upload`"
                  :show-file-list="false"
                  :on-success="changeImgUrl"
                >
                  <div class="uploader-main__1">
                    <div class="uploader-icon"></div>
                  </div>
                </el-upload>
              </template>
              <div class="uploader-tips">* 只能上传jpg/png格式文件，文件不能超过500kb</div>
            </div>
          </div>
        </el-form>
    </div>
  </section>
</template>
<script>
export default {
  data() {
    return {
      managerAc : {
        keyword : '',
        status : ''
      },
      changeCurrent: 1,
      ENV: process.env.NODE_ENV == "development" ? "/api" : "",
      currentPage: 1,
      page_count: 1,
      listLoading: false,
      currentItem: {
        id: 0,
      },
      showDelete: false,
      showActivity: false,
      activitInfo: {
        title: "",
        url: "",
        start_time: "",
        end_time: "",
        status: "1",
        img_url: "",
      },
      real_img_url: "",
      delete_id: "",
      dataRules: {
        title: [
          { required: true, message: "* 请输入活动名称", trigger: "blur" },
        ],
        url: [{ required: true, message: "* 请输入活动链接", trigger: "blur" }],
        start_time: [
          {
            required: true,
            message: "请选择日期",
            trigger: "change",
          },
        ],
        end_time: [
          {
            required: true,
            message: "请选择时间",
            trigger: "change",
          },
        ],
        img_url: [
          { required: true, message: "* 请上传活动图片", trigger: "change" },
        ],
      },
    };
  },
  methods: {
    changeImgUrl(file) {
      var _url = file.url ? file.url : file.response.url;
      this.activitInfo.img_url = _url;
      this.real_img_url = `${this.ENV}${_url}`;
    },
    saveActivitySure(id) {
      if (id == 0) {
        // 添加
        this.$refs["activitInfo"].validate((valid) => {
          if (valid) {
            this.$api.activityCreate(this.activitInfo).then((data) => {
              if (data.code == 1) {
                this.showActivity = false;
                this.$sfNotify({
                  message: "成功",
                });
                setTimeout(this.getTableDataList, 2000);
              } else {
                this.$sfNotify({
                  duration: 0,
                  type: "error",
                  message: data.message,
                });
              }
            });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      } else {
        this.$refs["activitInfo"].validate((valid) => {
          if (valid) {
            this.activitInfo.id = id;
            this.$api.activityEdit(this.activitInfo).then((data) => {
              if (data.code == 1) {
                this.showActivity = false;
                this.$sfNotify({
                  message: "成功",
                });
                setTimeout(this.getTableDataList, 2000);
              } else {
                this.$sfNotify({
                  duration: 0,
                  type: "error",
                  message: data.message,
                });
              }
            });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../assets/css/activity/news.scss";
</style>