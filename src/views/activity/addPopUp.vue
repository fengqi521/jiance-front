<template>
  <section>
    <div class="section-title">
      <span
      class="section-title section-title-act"
      @click="handleBackAc()"
      >弹窗广告管理</span>
      <span class="section-title">></span>
      <span class="section-title" v-if="pop_id">编辑弹窗广告</span>
      <span class="section-title" v-else>添加弹窗广告</span>
    </div>
    <!-- 添加编辑页面  活动 -->
    <div class="section-container activity-box pop-add">
      <div class="section-item-header clearfix">
        <span class="manager-span">
          <div class="section-header">
            <div class="section-item-header">
              <span>广告信息</span>
            </div>
          </div>
        </span>
      </div>
      <div class="box-outer activity-box" :title="currentItem.id == 0 ? '添加活动' : '编辑活动'">
        <el-form :model="activitInfo" ref="activitInfo" :rules="dataRules">
          <div class="section-list">
            <div class="section-left">弹窗广告图</div>
            <div class="section-right">
              <!-- 替换图片 -->
              <template v-if="img_url">
                <div class="cover-outer">
                  <img :src="real_img_url" class="coverImg" style="width:144px;height:192px;" />
                  <el-upload
                  class="edit-uploader"
                  :action="`${ENV}/pop/upload`"
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
                style="width:146px;height:192px;"
                :action="`${ENV}/pop/upload`"
                :show-file-list="false"
                :on-success="changeImgUrl"
                :beforeUpload="beforeAvatarUpload"
                >
                  <div class="uploader-main__1">
                    <div class="uploader-icon"></div>
                  </div>
                </el-upload>
              </template>
              <div class="uploader-tips">* 推荐上传像素：594*792px</div>
              <div class="uploader-tips uploader-size">（只能上传jpg/png格式文件，文件不能超过2M）</div>
            </div>
          </div>
          <div class="section-list pop-add-con">
            <div class="section-left">关联活动</div>
            <div class="section-right">
              <el-select v-model="popInfo.pop_id" placeholder="请选择关联活动名称">
                <el-option
                v-for="(item, index) in activity_list"
                :key="index"
                :label="item.title"
                :value="item.id"
                />
              </el-select>
              <div class='uploader-tips'>*仅展示已发布的活动，如想关联的活动未发布，请前往活动管理将活动发布。</div>
            </div>
          </div>
          <div class="section-list pop-add-pile">
            <div class="section-left">关联充电站</div>
            <div class="section-right">
              <el-form-item prop="title">
                <div class="listUser-content scrollBar clearfix">
                  <div
                  class="listUser-item"
                  v-for="(item, index) in modelInfo.rules"
                  :key="index"
                  >
                    <span>{{getUsersById(item)}}</span>
                    <i
                    class="clear-icon"
                    @click="deleteUserById(item)"
                    ></i>
                  </div>
                </div>
              </el-form-item>
              <div class="btn_succ pop-chosee-pile" @click="choosePiles()">选择充电站</div>
            </div>
          </div>
        </el-form>
      </div>
      <div class="section-item-header"></div>
      <div
      class="box-bottom clearfix"
      style="display: flex;justify-content: center;margin-top:20px;"
      >
        <div class="btn_succ" @click="savePop">提交</div>
      </div>
    </div>
    <!-- 控制显示隐藏的isChoosePiles；把接口请求到的数据stationData传过去；剩下的时候传过来的数据 -->
    <sf-pileStation class="pop-box" :isChoosePiles="isChoosePiles" @updateuserarr="userArr11" @updatemodelinfo="modelInfo11" :stationData="stationData"></sf-pileStation>
  </section>
</template>

<script>
    export default {
        data() {
            return {
                //充电桩列表需要传过去的值
                stationData:[],//需要传过去的res.data
                isConnectPiles: true, //关联充电站为空,显示暂无数据
                
                userArr:[],
                popInfo: {
                    pop_id: "",
                },
                isChoosePiles: false,
                rules:[],
                roleTypeRules: [],
                all_rules_ids: [],
                checkbox_all: false,
                modelInfo: {
                    rules: []
                },
                pop_id: this.$route.query.id,
                // 以上是充电站样式列表需要用到的值

                isIndeterminate: false, //设置 indeterminate 状态，只负责样式控制
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
                    // show_homepage: "1",
                    img_url: "",
                    // show_homepage_img_url: "",
                    // stations: "",
                },
                real_img_url_t: "",
                delete_id: "",
                dataRules: {},
                activity_list:[],
                img_url:'',
                real_img_url:'',
            };
        },
        mounted() {
            this.$nextTick(() => {
                document.documentElement.style.minWidth = "1300px";
            });
        },
        created() {

            //获取活动列表
            this.getActivityList();
            //获取充电站的列表
            this.getStationList()
            //获取弹窗广告详情
            if(this.pop_id){
                this.getDetail()
            }
        },
        methods: {
            userArr11(val){
                this.userArr = val;
            },
            modelInfo11(val){
                this.modelInfo = val;
            },
            choosePiles() {
                this.isChoosePiles = !this.isChoosePiles;
            },
             //获取用户
            getUsersById(id) {
                if (this.userArr.length == 0) return "";
                let _item = null;
                _item = this.userArr.filter(item => item.id == id);
                 console.log('this.userArr__after',_item);
                return _item[0].name;
            },
            deleteUserById(id) {
                var index = this.modelInfo.rules.indexOf(id);
                if (index > -1) {
                    this.modelInfo.rules.splice(index, 1);
                }
            },
            //*******一定不要忘，下面返现有个重新获取充电站id的 getStationList  {id ： id}*/
            //以上方法是充电站列表需要的
             getStationList(){
                let that = this;
                this.$api.popGetStationList({ id: this.pop_id }).then(res => {
                    if (res.code == 1) {
                       this.stationData = res.data
                    }
                });
            },
            handleBackAc() {
                this.$router.push({ path: "/activity/news/popupmanager" });
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
                        this.currentPage = data.data.current_page;
                        this.page_count = data.data.page_total;
                    }
                });
            },

            saveActivitySure(id) {
                // 验证是否上传了图片
                if (!this.activitInfo.img_url) {
                    this.$sfNotify({
                        duration: 0,
                        type: "error",
                        message: "请上传活动图",
                    });
                    return false;
                }

                if (!this.activitInfo.url) {
                    this.$sfNotify({
                        duration: 0,
                        type: "error",
                        message: "请上传活动链接",
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

            //获取活动的列表
            getActivityList(){
                this.$api.popGetActivityList({id:this.pop_id}).then((data)=>{
                    if(data.data.length){
                        this.activity_list = data.data
                    }else{
                        this.activity_list = [];
                    }
                })
            },
            // 上传文件验证
            beforeAvatarUpload(file) {
                console.log(file)
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
                console.log(extension,'extension')
                console.log(extension2,'extension2')
                console.log(isLt2M,'isLt2m')
                  return extension || extension2 && isLt2M
            },
            // 上传文件接口
            changeImgUrl(file) {
                var _url = file.url ? file.url : file.response.url;
                this.img_url = _url;
                this.real_img_url = `${this.ENV}${_url}`;
            },
           
           
            savePop(){
                if(!this.modelInfo.rules.length){
                    this.$sfNotify({
                        duration: 0,
                        type: "error",
                        message: '请关联充电站'
                    });
                    return false;
                }
                if(!this.popInfo.pop_id){
                    this.$sfNotify({
                        duration: 0,
                        type: "error",
                        message: '请选择活动'
                    });
                    return false;
                }
                if(!this.img_url){
                    this.$sfNotify({
                        duration: 0,
                        type: "error",
                        message: '请上传图片'
                    });
                    return false;
                }
                if(this.pop_id){
                    this.$api.popEdit({delete_id:this.pop_id,activity_id:this.popInfo.pop_id,img_url:this.img_url,stations:this.modelInfo.rules}).then((data)=>{
                        if(data.code == 1){
                            this.$sfNotify({
                                message: "成功"
                            });
                            this.$router.go(-1);
                        }else{
                            this.$sfNotify({
                                duration: 0,
                                type: "error",
                                message: data.message
                            });
                        }
                    })
                }else{
                    this.$api.popCreate({activity_id:this.popInfo.pop_id,img_url:this.img_url,stations:this.modelInfo.rules}).then((data)=>{
                        if(data.code == 1){
                            this.$sfNotify({
                                message: "成功"
                            });
                            this.$router.go(-1);
                        }else{
                            this.$sfNotify({
                                duration: 0,
                                type: "error",
                                message: data.message
                            });
                        }
                    })
                }
            },
            getDetail(){
                this.$api.getPopDetail({activity_id:this.pop_id}).then((data)=>{
                    this.img_url = data.data.img_url
                    this.real_img_url= `${this.ENV}`+data.data.img_url;
                    this.popInfo.pop_id = data.data.activity_id
                })
            }
        },
        destroyed() {
            document.documentElement.style.minWidth = "1200px";
        },
    };
</script>

<style lang="scss" scoped>
  @import "../../assets/css/activity/addPop.scss";
</style>
