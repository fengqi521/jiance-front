<template>
  <section>
    <div class="section-title">启动页管理</div>
    <!--<div class="section-tips">-->
      <!--<div class="warning-icon"></div>-->
      <!--<span>注意：启动页最多可上线6个，推荐上传图片的像素为750*1334px。</span>-->
    <!--</div>-->
    <div class="section-container">
      <div class="section-item-header clearfix">
        <span>启动页列表</span>
        <span class="note-tips">注意：启动页最多可上线6个。</span>
        <div
          class="btn_succ add-coupon"
          @click="handleAdd(0)"
        >
          <i class="add-station"></i>添加启动页
        </div>
      </div>
      <div class="section-main">
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td table-column__1">标题</div>
            <div class="table-td table-column__2">启动页图片</div>
            <div class="table-td table-column__3">活动链接</div>
            <div class="table-td table-column__4">开始时间&结束时间</div>
            <div class="table-td">上线/下线</div>
            <div class="table-td table-column__4">操作</div>
          </div>
          <div
            class="table-body"
            v-loading="listLoading"
          >
            <div
              class="table-tr"
              v-show="tableData && tableData.length > 0"
              v-for="(start, index) in tableData"
              :key="index"
            >
              <div class="table-td table-column__1">
                <el-tooltip :content="start.title" placement="top">
                  <div class="td-item" style="max-width:140px;">{{start.title | stationsellipsis}}</div>
                </el-tooltip>
              </div>
              <div class="table-td table-img table-column__2">
                <img
                  class="td-item news-img"
                  :src="`${ENV}${start.img_url}`"
                />
              </div>
              <div class="table-td table-link table-column__3">
                <div class="td-item">
                  <el-tooltip :content="start.url" placement="top">
                    <span style="max-width:140px;" class="item-text scrollBar">{{start.url | stationsellipsis}}</span>
                  </el-tooltip>
                </div>
              </div>
              <div class="table-td table-column__4">
                <div class="td-item td-time">
                  {{start.start_time}}<br />{{start.end_time}}
                </div>
              </div>
              <div class="table-td">
                <div
                  :class="['knob',start.is_use == 1 ?'started':'']"
                  @click="changeActStatus(start, index)"
                ></div>
                <div class="knob-text">{{start.is_use == 1 ?'上线':'下线'}}</div>
              </div>
              <div class="table-td  table-column__4 table-operate">
                <el-tooltip
                  content="编辑"
                  placement="top"
                >
                  <div
                    class="td-item edit-icon"
                    @click="handleAdd(start.id)"
                  ></div>
                </el-tooltip>
                <el-tooltip
                  content="删除"
                  placement="top"
                >
                  <div
                    class="td-item delete-icon"
                    @click="delActivity(start.id)"
                  ></div>
                </el-tooltip>
                <el-tooltip
                  content="置顶"
                  placement="top"
                >
                  <div
                    class="td-item topping-icon"
                    @click="rankStarter(start.id)"
                  ></div>
                </el-tooltip>
              </div>
            </div>
            <div
              v-if="!tableData || tableData.length === 0"
              class="table-tr unData"
            >
              <img :src="require('assets/img/unData.png')">
              <span>暂无数据</span>
            </div>
          </div>
          <!-- 分页 -->
          <sf-pagination
            v-if="tableData && tableData.length > 0"
            :currentPage="currentPage"
            :page-count="page_count"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
    <!-- 添加/编辑 启动页 -->
    <sf-modelBox
      class="activity-box"
      :showModel.sync="showActivity"
      :title="currentItem.id == 0 ? '添加启动页' : '修改启动页'"
      @change="saveActivitySure(currentItem.id)"
    >
      <el-form
        :model="activitInfo"
        ref="activitInfo"
        :rules="dataRules"
      >
        <div class="section-list">
          <div class="section-left">启动页标题</div>
          <div class="section-right">
            <el-form-item prop="title">
              <el-input
                class="scrollBar"
                :disabled="currentItem.id == 0 ? false : true"
                type="textarea"
                v-model="activitInfo.title"
                placeholder="请输入启动页标题"
              />
            </el-form-item>
          </div>
        </div>
        <div class="section-list">
          <div class="section-left">启动页链接</div>
          <div class="section-right">
            <el-form-item prop="url">
              <el-input
                class="scrollBar"
                type="textarea"
                v-model="activitInfo.url"
                placeholder="请输入启动页链接"
              />
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
              >
              </el-date-picker>
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
              >
              </el-date-picker>
            </el-form-item>
          </div>
        </div>
        <div class="section-list">
          <div class="section-left">上线/下线</div>
          <div class="section-right">
            <el-form-item
              class="radio-outer"
              prop="is_use"
            >
              <el-radio
                v-model="activitInfo.is_use"
                label="1"
              >上线</el-radio>
              <el-radio
                v-model="activitInfo.is_use"
                label="2"
              >下线</el-radio>
            </el-form-item>
          </div>
        </div>
        <div class="section-list">
          <div class="section-left">上传图片</div>
          <div class="section-right">
            <!-- 替换图片 -->
            <template v-if="activitInfo.img_url">
              <div class="cover-outer">
                <img
                  :src="real_img_url"
                  class="coverImg"
                >
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
            <div class="uploader-tips">* 推荐上传像素：750*1334px</div>
            <div class="uploader-tips uploader-size">（只能上传jpg/png格式文件，文件不能超过2M）</div>
          </div>
        </div>
      </el-form>
    </sf-modelBox>
    <!-- 置顶 -->
    <sf-modelBox
      :showModel.sync="showTopping"
      title="置顶确认"
      @change="saveTopSure"
    >
      <p>是否确定置顶此启动页？</p>
    </sf-modelBox>
    <!-- 删除 -->
    <sf-modelBox
      :showModel.sync="showDelete"
      title="删除确认"
      type="delete"
      @change="saveDeleteSure"
    >
      <p>是否确定删除此启动页？</p>
    </sf-modelBox>
  </section>
</template>

<script>
export default {
  data() {
    return {
      ENV: process.env.NODE_ENV == "development" ? "/api" : "",
      currentPage: 1,
      page_count: 10,
      tableData: [{}],
      listLoading: false,
      currentItem: {
        id: 0
      },
      showTopping: false,
      showDelete: false,
      showActivity: false,
      activitInfo: {
        title: "",
        url: "",
        start_time: "",
        end_time: "",
        is_use: "1",
        img_url: ""
      },
      real_img_url: "",
      delete_id: "",
      rank_id: "",
      dataRules: {
        title: [
          { required: true, message: "* 请输入启动页标题", trigger: "change" }
        ],
        url: [
          { required: true, message: "* 请输入启动页链接", trigger: "change" }
        ],
        start_time: [
          {
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        end_time: [
          {
            required: true,
            message: "请选择时间",
            trigger: "change"
          }
        ],
        img_url: [
          { required: true, message: "* 请上传活动图片", trigger: "change" }
        ]
      }
    };
  },
  created() {
    this.getTableDataList();
  },
  filters: {
    stationsellipsis(value){
      if (!value) return '--'
      if (value.length > 38) {
        return value.slice(0,49) + '...'
      }
      return value
    }
  },
  methods: {
    changeImgUrl(file){
      var _url = file.url ? file.url : file.response.url;
      this.activitInfo.img_url = _url;
      this.real_img_url = `${this.ENV}${_url}`;
    },
    getTableDataList() {
      this.listLoading = true;
      this.$api.starterStarters({ page: this.currentPage }).then(data => {
        this.listLoading = false;
        if (data.code == 1) {
          this.tableData = data.data.list;
          this.currentPage = data.data.current_page;
          this.page_count = data.data.page_total;
        }
      });
    },
    changeActStatus(item, index) {
      let status = item.is_use == 1 ? 2 : 1;
      this.$api.starterStatus({ id: item.id, is_use: status }).then(data => {
        if (data.code == 1) {
          this.$sfNotify({
            message: data.message || "成功"
          });
          this.tableData[index].is_use = status;
        } else {
          this.$sfNotify({
            duration: 0,
            type: "error",
            message: data.message || "失败"
          });
        }
      });
    },
    // 点击分页触发
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getTableDataList();
    },
    handleAdd(id) {
      this.currentItem.id = id;
      if (id != 0) {
        // 编辑
        this.$api.starterDetail({id: id}).then(data => {
          if (data.code == 1) {
            this.activitInfo.title= data.data.title;
            this.activitInfo.img_url = data.data.img_url;
            this.real_img_url = `${this.ENV}` + data.data.img_url;
            this.activitInfo.url = data.data.url;
            this.activitInfo.start_time = data.data.start_time;
            this.activitInfo.end_time = data.data.end_time;
            this.activitInfo.is_use = data.data.is_use;
            this.showActivity = true;
          }
        });
      } else {
        this.real_img_url = "";
        this.activitInfo.title= "";
        this.activitInfo.img_url = "";
        this.activitInfo.url = "";
        this.activitInfo.start_time = "";
        this.activitInfo.end_time = "";
        this.activitInfo.is_use = "1";
        this.showActivity = true;
      }
    },
    handleTop() {
      this.showTopping = true;
    },
    // 确认置顶
    saveTopSure() {
      this.$api.starterRank({ id: this.rank_id }).then(data => {
        this.showTopping = false;
        if (data.code == 1) {
          this.$sfNotify({
            message: "成功"
          });
          setTimeout(this.getTableDataList, 1500);
        } else {
          this.$sfNotify({
            duration: 0,
            type: "error",
            message: data.message
          });
        }
      });
    },
    handleDelete() {
      this.showDelete = true;
    },
    // 确认删除
    saveDeleteSure() {
      this.$api.starterDelete({ id: this.delete_id }).then(data => {
        this.showDelete = false;
        if (data.code == 1) {
          this.$sfNotify({
            message: "成功"
          });
          setTimeout(this.getTableDataList, 1500);
        } else {
          this.$sfNotify({
            duration: 0,
            type: "error",
            message: data.message
          });
        }
      });
    },
    saveActivitySure(id) {
      if (id == 0) {
        // 添加
        this.$refs["activitInfo"].validate(valid => {
          if (valid) {
            this.$api.starterCreate(this.activitInfo).then(data => {
              if (data.code == 1) {
                this.showActivity = false;
                this.$sfNotify({
                  message: "成功"
                });
                setTimeout(this.getTableDataList, 2000);
              } else {
                this.$sfNotify({
                  duration: 0,
                  type: "error",
                  message: data.message
                });
              }
            });
          } else {
            return false;
          }
        });
      } else {
        this.$refs["activitInfo"].validate(valid => {
          if (valid) {
            this.activitInfo.id = id;
            this.$api.starterEdit(this.activitInfo).then(data => {
              if (data.code == 1) {
                this.showActivity = false;
                this.$sfNotify({
                  message: "成功"
                });
                setTimeout(this.getTableDataList, 2000);
              } else {
                this.$sfNotify({
                  duration: 0,
                  type: "error",
                  message: data.message
                });
              }
            });
          } else {
            return false;
          }
        });
      }
    },
    delActivity(id) {
      this.showDelete = true;
      this.delete_id = id;
    },
    rankStarter(id) {
      this.rank_id = id;
      this.showTopping = true;
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
          }  return extension || extension2 && isLt2M
      }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/activity/start.scss";
</style>
