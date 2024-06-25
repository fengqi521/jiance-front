<template>
  <section>
    <div class="section-title">
      <span
        class="section-title section-title-act"
        @click="handleBackAc()"
      >活动管理</span>
      <span class="section-title">></span>
      <span class="section-title" v-if="isShowWriteWord == 0 ? true : false">添加活动</span>
      <span class="section-title" v-if="isShowWriteWord == 0 ? false : true">编辑活动</span>
    </div>
    <!-- 添加编辑页面  活动 -->
    <div class="section-container activity-box">
      <div class="section-item-header clearfix">
        <span class="manager-span">
          <div class="section-header">
            <div class="section-item-header">
              <span>活动信息</span>
            </div>
          </div>
        </span>
      </div>
      <div class="box-outer activity-box" :title="currentItem.id == 0 ? '添加活动' : '编辑活动'">
        <el-form :model="activitInfo" ref="activitInfo" :rules="dataRules">
          <div class="section-list">
            <div class="section-left">活动名称</div>
            <div class="section-right">
              <el-form-item prop="title">
                <el-input
                  :disabled="currentItem.id == 0 ? false : true"
                  type="textarea"
                  maxlength="50"
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
                <el-input maxlength="50" type="textarea" v-model="activitInfo.url" placeholder="请输入活动链接" />
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
            <div class="section-left">活动图片</div>
            <div class="section-right">
              <!-- 替换图片 -->
              <template v-if="activitInfo.img_url">
                <div class="cover-outer">
                  <img :src="real_img_url" class="coverImg" style="width:234px;height:96px;" />
                  <el-upload
                    class="edit-uploader"
                    :action="`${ENV}/activity/upload`"
                    :show-file-list="false"
                    :on-success="changeImgUrl"
                    :beforeUpload="beforeAvatarUpload"
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
                  :beforeUpload="beforeAvatarUpload"
                >
                  <div class="uploader-main__1">
                    <div class="uploader-icon"></div>
                  </div>
                </el-upload>
              </template>
              <div class="uploader-tips">* 推荐上传像素：710*292px</div>
              <div class="uploader-tips uploader-size">（只能上传jpg/png格式文件，文件不能超过2M）</div>
            </div>
          </div>
        </el-form>
      </div>
      <div class="section-item-header"></div>
      <div
        class="box-bottom clearfix"
        style="display: flex;justify-content: center;margin-top:20px;"
      >
        <div class="btn_succ" @click="saveActivitySure(currentItem.id)">提交</div>
      </div>
    </div>
  </section>
</template>

<script>
import logVue from "../device/log.vue";
export default {
  data() {
    return {
      isConnectPiles: true, //关联充电站为空,显示暂无数据
      isShowWriteWord: false, //显示‘编辑活动’或者‘添加活动’
      checkAll: false, //充电站全选
      piles: [],//全部充电站数量
      chargingPilesId: [], //充电站已经被选中的
      isIndeterminate: false, //设置 indeterminate 状态，只负责样式控制
      isContainer: 1, //添加活动显示隐藏
      ENV: process.env.NODE_ENV == "development" ? "/api" : "",
      currentPage: 1,
      page_count: 1,
      listLoading: false,
      tableData: [],
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
        // show_homepage: "1",
        img_url: "",
        // show_homepage_img_url: "",
        // stations: "",
      },
      real_img_url: "",
      real_img_url_t: "",
      delete_id: "",
      dataRules: {},
    };
  },
  mounted() {
    this.$nextTick(() => {
      document.documentElement.style.minWidth = "1300px";
    });
  },
  created() {
    this.getTableDataList();

    //通过id,判断是从编辑页面过来才能填数据，保证刷新页面数据不丢失
    if (this.$route.query.id) {
      this.$api.activityDetail({ id : JSON.parse(this.$route.query.id)}).then((data) => {
        
        this.activitInfo = data.data;
        //编辑页面图片能够显示
        this.real_img_url = `${this.ENV}${this.activitInfo.img_url}`;
        this.real_img_url_t = `${this.ENV}${this.activitInfo.show_homepage_img_url}`;
      });
      this.isShowWriteWord = true;
      this.currentItem.id = JSON.parse(this.$route.query.id);
    }
  },
  methods: {
    handleCheckAllChange(val) {
      //全选按钮
      if (this.checkAll) {
        this.piles.forEach((item) => {
          this.chargingPilesId.push(item.station_id);
        });
      } else {
        this.chargingPilesId = [];
      }
    },
    handlechargingPilesChange(value) {
      //value就是v-model绑定的值，即this.chargingPilesId；值改变判断是否数据已经全选，勾选全选按钮
      if (this.chargingPilesId.length == this.piles.length) {
        this.checkAll = true;
      } else {
        this.checkAll = false;
      }
    },
    handleBackAc(num) {
      this.$router.push({ path: "/activity/news" });
    },
    changeImgUrl(file) {
      var _url = file.url ? file.url : file.response.url;
      this.activitInfo.img_url = _url;
      this.real_img_url = `${this.ENV}${_url}`;
    },
    changeImgUrlTan(file) {
      var _url = file.url ? file.url : file.response.url;
      this.activitInfo.show_homepage_img_url = _url;
      this.real_img_url_t = `${this.ENV}${_url}`;
    },
    getTableDataList() {
      this.listLoading = true;
      this.$api.activityActivities({ page: this.currentPage }).then((data) => {
        this.listLoading = false;
        if (data.code == 1) {
          this.tableData = data.data.list;
          this.currentPage = data.data.current_page;
          this.page_count = data.data.page_total;
        }
      });
    },

    saveActivitySure(id) {
        // 验证是否上传了图片
      if(!this.activitInfo.img_url){
          this.$sfNotify({
              duration: 0,
              type: "error",
              message: '请上传活动图',
          });
          return false;
      }
      
      if(!this.activitInfo.url){
          this.$sfNotify({
              duration: 0,
              type: "error",
              message: '请上传活动链接',
          });
          return false;
      }
      if (id == 0) {
        //接口里面上传  关联充电站  的是stations
        // this.activitInfo.stations = this.chargingPilesId;
        // 添加
        this.$refs["activitInfo"].validate((valid) => {
          if (valid) {
            this.$api.activityCreate(this.activitInfo).then((data) => {
              if (data.code == 1) {
                this.showActivity = false;
                this.$sfNotify({
                  message: "成功",
                });
                this.chargingPilesId = [];
                setTimeout(this.getTableDataList, 2000);
                this.$router.push({ path: "/activity/news" });
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
            this.activitInfo.stations = this.chargingPilesId;
            this.$api.activityEdit(this.activitInfo).then((data) => {
              if (data.code == 1) {
                this.showActivity = false;
                this.$sfNotify({
                  message: "成功",
                });
                this.chargingPilesId = [];
                setTimeout(this.getTableDataList, 2000);
                this.$router.push({ path: "/activity/news" });
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
    },

    beforeAvatarUpload(file) {
        var testmsg=file.name.substring(file.name.lastIndexOf('.')+1)
        const extension = testmsg === 'jpg'
        const extension2 = testmsg === 'png'
        const isLt2M = file.size / 1024 / 1024 < 2
        if(!extension && !extension2) {
            this.$sfNotify({
                duration: 0,
                type: "error",
                message: '上传文件只能是 jpg、png格式!',
            });
        }
        if(!isLt2M) {
            this.$sfNotify({
                duration: 0,
                type: "error",
                message: '上传文件大小不能超过 2MB!',
            });
        }
        return extension || extension2 && isLt2M
    }
  },
  destroyed() {
    document.documentElement.style.minWidth = "1200px";
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/activity/news.scss";
</style>
