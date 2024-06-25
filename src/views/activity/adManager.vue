<template>
  <section>
    <div class="section-title">活动广告管理</div>
    <div class="section-container">
      <div class="section-item-router">
        <router-link to="/activity/news" style="cursor: pointer"
          >活动管理</router-link
        >
        <router-link
          to="/activity/news/admanager"
          style="cursor: pointer"
          class="section-act"
          >轮播广告管理</router-link
        >
        <router-link
          to="/activity/news/popupmanager"
          style="cursor: pointer"
          >弹窗广告管理</router-link
        >
      </div>
      <div class="section-main">
        <div class="ad_manager">
          <div>广告位最大限制是“6”个，最多可以添加6个广告位</div>
          <div class="btn_succ add-coupon btn_admanager" @click="handleAdd(0)">
            <i class="add-station"></i>添加轮播广告
          </div>
        </div>
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td table-column__3">广告位</div>
            <div class="table-td table-column__1" style="min-width: 330px">
              banner图
            </div>
            <div class="table-td table-column__3" style="min-width: 100px">
              是否关联活动
            </div>
            <div class="table-td table-column__1">关联活动名称</div>
            <div class="table-td table-column__2">活动状态</div>
            <div class="table-td" style="min-width: 98px">广告状态</div>
            <div class="table-td">操作</div>
          </div>
          <div class="table-body" v-loading="listLoading">
            <div
              class="table-tr"
              v-show="tableData && tableData.length > 0"
              v-for="(advert, index) in tableData"
              :key="index"
            >
              <div class="table-td table-column__3">
                <div class="td-item">{{ advert.sequence }}</div>
              </div>
              <div class="table-td table-img table-column__1">
                <img
                  style="width: 299px; height: 96px"
                  class="news-img"
                  :src="`${ENV}${advert.img_url}`"
                />
              </div>
              <div class="table-td table-link table-column__3">
                <div class="td-item" style="min-width: 100px">
                  <div
                    class="td-item"
                    :style="advert.has_activity == 1 ? '' : 'color:#FF6632'"
                  >
                    {{ advert.has_activity == 1 ? "是" : "否" }}
                  </div>
                </div>
              </div>
              <div class="table-td table-column__1">
                <div class="td-item td-time" v-if="advert.has_activity == 1">
                  {{ advert.title }}
                </div>
                <div class="td-item td-time" v-else>--</div>
              </div>
              <div class="table-td table-status table-column__2">
                <div
                  class="td-item"
                  v-if="advert.has_activity == 1 && advert.publish == 1"
                >
                  未发布
                </div>
                <div
                  class="td-item"
                  v-else-if="advert.has_activity == 1 && advert.publish == 2"
                >
                  已发布
                </div>
                <div class="td-item" v-else>--</div>
              </div>
              <div class="table-td" style="min-width: 98px">
                <div
                  :class="['knob', advert.status == 1 ? 'started' : '']"
                  @click="changeActStatus(advert, index)"
                ></div>
                <div class="knob-text">
                  {{ advert.status == 1 ? "上线" : "下线" }}
                </div>
              </div>
              <div class="table-td table-operate">
                <el-tooltip content="编辑" placement="top">
                  <div
                    class="td-item edit-icon"
                    @click="handleEdit(advert)"
                  ></div>
                </el-tooltip>
                <el-tooltip content="删除" placement="top">
                  <div
                    class="td-item delete-icon"
                    @click="delActivity(advert)"
                  ></div>
                </el-tooltip>
              </div>
            </div>
            <div
              v-if="!tableData || tableData.length === 0"
              class="table-tr unData"
            >
              <img :src="require('assets/img/unData.png')" />
              <span>暂无数据</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 添加/编辑 活动 -->
    <sf-modelBox
      class="activity-box ad-box"
      :showModel.sync="showActivity"
      :title="currentItem.id == 0 ? '添加广告' : '编辑广告'"
      @change="saveActivitySure(currentItem.id)"
    >
      <el-form :model="advertInfo" ref="activitInfo">
        <div class="section-list">
          <div class="section-left">广告图片</div>
          <div class="section-right">
            <!-- 替换图片 -->
            <template v-if="advertInfo.img_url">
              <div class="cover-outer">
                <img :src="real_img_url" class="coverImg" />
                <el-upload
                  class="edit-uploader"
                  :action="`${ENV}/advert/upload`"
                  :show-file-list="false"
                  :on-success="changeImgUrl"
                  :beforeUpload="beforeAvatarUpload"
                  >更换图片…</el-upload
                >
              </div>
            </template>
            <!--添加图片 -->
            <template v-else>
              <el-upload
                class="add-uploader"
                :action="`${ENV}/advert/upload`"
                :show-file-list="false"
                :on-success="changeImgUrl"
                :beforeUpload="beforeAvatarUpload"
              >
                <div class="uploader-main__1">
                  <div class="uploader-icon"></div>
                </div>
              </el-upload>
            </template>
            <div class="uploader-tips">* 推荐上传像素：710*228px</div>
            <div class="uploader-tips uploader-size">
              （只能上传jpg/png格式文件，文件不能超过2M）
            </div>
          </div>
        </div>
        <div class="section-list">
          <div class="section-left">广告状态</div>
          <div class="section-right">
            <div class="table-td">
              <div
                class="knob"
                :class="{ started: advertInfo.status }"
                style="display: inline-block; margin-top: 8px"
                @click="changeStatus(advertInfo.status)"
              ></div>
              <div
                class="knob-text"
                style="display: inline-block; position: relative; top: -6px"
                v-if="advertInfo.status"
              >
                上线
              </div>
              <div
                class="knob-text"
                style="display: inline-block; position: relative; top: -6px"
                v-else
              >
                下线
              </div>
            </div>
          </div>
        </div>
        <div class="section-list">
          <div class="section-left">是否关联活动</div>
          <div class="section-right">
            <el-form-item class="radio-outer" prop="status">
              <el-radio v-model="advertInfo.has_activity" label="1"
                >是</el-radio
              >
              <el-radio v-model="advertInfo.has_activity" label="0"
                >否</el-radio
              >
            </el-form-item>
          </div>
        </div>
        <div
          class="section-list"
          v-if="advertInfo.has_activity == 1 ? true : false"
        >
          <div class="section-left">选择活动</div>
          <div class="section-right">
            <el-select
              v-model="advertInfo.activity_id"
              placeholder="请选择关联活动名称"
            >
              <el-option
                v-for="(item, index) in activity_list"
                :key="index"
                :label="item.title"
                :value="item.id"
              />
            </el-select>
            <div class="uploader-tips">
              *仅展示已发布的活动，如想关联的活动未发布，请前往活动管理将活动发布。
            </div>
          </div>
        </div>
      </el-form>
    </sf-modelBox>
    <!-- 删除 -->
    <sf-modelBox
      :showModel.sync="showDelete"
      title="删除确认"
      type="delete"
      @change="saveDeleteSure"
    >
      <p>是否确定删除广告位“{{ delete_sequence }}”？</p>
    </sf-modelBox>
  </section>
</template>

<script>
// import logVue from "../device/log.vue";
export default {
  data() {
    return {
      //活动管理编辑数据
      dataAc: [],
      chooseAd: true,
      isIndeterminate: false, //设置 indeterminate 状态，只负责样式控制
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
      advertInfo: {
        img_url: "",
        status: "1",
        has_activity: "1",
        activity_id: "",
      },
      activity_list: [],
      activity_id: "",
      real_img_url: "",
      delete_id: "",
      delete_sequence: "",
    };
  },
  mounted() {
    this.$nextTick(() => {
      document.documentElement.style.minWidth = "1300px";
    });
  },
  created() {
    this.getTableDataList();
  },
  methods: {
    changeImgUrl(file) {
      var _url = file.url ? file.url : file.response.url;
      this.advertInfo.img_url = _url;
      this.real_img_url = `${this.ENV}${_url}`;
    },
    getTableDataList() {
      this.listLoading = true;
      this.$api.adLists({}).then((data) => {
        this.listLoading = false;
        if (data.code == 1) {
          this.tableData = data.data;
        }
      });
    },
    changeStatus(val) {
      let status = val == 1 ? 0 : 1;
      this.advertInfo.status = status;
    },
    handleAdd(id) {
      this.currentItem.id = id;
      this.real_img_url = "";
      this.advertInfo = {
        img_url: "",
        status: "1",
        has_activity: "1",
        activity_id: "",
      };
      this.showActivity = true;
      // 获取活动列表
      this.$api.advertActivity({ id: id }).then((data) => {
        this.activity_list = data.data;
      });
    },
    handleEdit(row) {
      this.currentItem.id = row.id;
      this.real_img_url = `${this.ENV}${row.img_url}`;
      this.advertInfo = {
        img_url: row.img_url,
        status: parseInt(row.status),
        has_activity: row.has_activity,
        activity_id: "",
      };
      if (parseInt(row.has_activity)) {
        this.advertInfo.activity_id = row.activity_id;
      }
      this.showActivity = true;
      // 获取活动列表
      this.$api.advertActivity({ id: row.id }).then((data) => {
        this.activity_list = data.data;
      });
    },
    // 确认删除
    saveDeleteSure() {
      this.$api.deleteAdvert({ id: this.delete_id }).then((data) => {
        this.delete_id = "";
        this.showDelete = false;
        if (data.code == 1) {
          this.$sfNotify({
            message: "成功",
          });
          setTimeout(this.getTableDataList, 1500);
        } else {
          this.$sfNotify({
            duration: 0,
            type: "error",
            message: "失败",
          });
        }
      });
    },
    saveActivitySure(id) {
      // 验证是否上传了图片
      if (!this.advertInfo.img_url) {
        this.$sfNotify({
          duration: 0,
          type: "error",
          message: "请上传图片",
        });
        return false;
      }
      if (parseInt(this.advertInfo.has_activity)) {
        if (!this.advertInfo.activity_id) {
          this.$sfNotify({
            duration: 0,
            type: "error",
            message: "请关联活动",
          });
          return false;
        }
      }
      if (id == 0) {
        // 添加
        this.$api.addAdvert(this.advertInfo).then((data) => {
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
        this.$refs["activitInfo"].validate((valid) => {
          if (valid) {
            this.advertInfo.id = id;
            this.$api.editAdvert(this.advertInfo).then((data) => {
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
    },

    changeActStatus(item, index) {
      let status = item.status == 1 ? 0 : 1;
      this.$api
        .changeAdvertStatus({ id: item.id, status: status })
        .then((data) => {
          if (data.code == 1) {
            this.$sfNotify({
              message: "成功",
            });
            this.tableData[index].status = status;
          } else {
            this.$sfNotify({
              duration: 0,
              type: "error",
              message: "失败",
            });
          }
        });
    },
    delActivity(advert) {
      this.showDelete = true;
      this.delete_id = advert.id;
      this.delete_sequence = advert.sequence;
    },
    beforeAvatarUpload(file) {
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extension = testmsg === "jpg";
      const extension2 = testmsg === "png";
      const isLt2M = file.size / 1024 / 1024 < 2;
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
          message: "上传文件大小不能超过 2MB!",
        });
      }
      return extension || (extension2 && isLt2M);
    },
  },
  destroyed() {
    document.documentElement.style.minWidth = "1200px";
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/activity/advert.scss";
</style>
