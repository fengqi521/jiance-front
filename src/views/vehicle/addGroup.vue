<template>
  <section class="group-box">
    <div class="section-title">
      <span
        class="section-title section-title-act"
        @click="handleBackAc()"
      >群组管理</span>
      <span class="section-title">></span>
      <span class="section-title" v-if="isShowWriteWord == 0 ? true : false">添加群组</span>
      <span class="section-title" v-if="isShowWriteWord == 0 ? false : true">修改群组</span>
    </div>
    <!-- 添加编辑页面  活动 -->
    <div class="section-container activity-box">
      <div class="section-item-header clearfix">
        <span class="manager-span">
          <div class="section-header">
            <div class="section-item-header">
              <span class="section-title" v-if="isShowWriteWord == 0 ? true : false">添加群组</span>
              <span class="section-title" v-if="isShowWriteWord == 0 ? false : true">修改群组</span>
            </div>
          </div>
        </span>
      </div>
      <div class="box-outer group-box" :title="currentItem.id == 0 ? '添加群组' : '编辑群组'">
        <el-form :model="groupInfo" ref="groupInfo" :rules="dataRules">
          <div class="section-list">
            <div class="section-left group-left">群组名称</div>
            <div class="section-right">
              <el-form-item prop="name">
                  <!-- :disabled="currentItem.id == 0 ? false : true" -->
                <el-input
                  type="text"
                  maxlength="30"
                  v-model="groupInfo.title"
                  placeholder="请输入群组名称"
                />
              </el-form-item>
            </div>
          </div>
          <div class="section-list">
            <div class="section-left">群组成员</div>
            <div class="section-right">
              <!-- 充电桩充电功能控制 -->
                <div class="info-item">
                  <!-- <div class="info-item-left show-app">充电桩充电功能控制</div> -->
                  <div class="info-item-right">
                    <div class="open-listUser">
                      <div class="listUser-main">
                        <el-form-item prop="_users">
                          <el-input type="hidden" v-model="modelInfo._users"></el-input>
                          <div class="listUser-content scrollBar clearfix">
                            <div
                              class="listUser-item"
                              v-for="(item, index) in modelInfo.users"
                              :key="index"
                            >
                              <span>{{item.license_plate}}</span>
                              <span>{{ getUsersById(item, 'license_plate') }}</span>
                              <i class="clear-icon" @click="deleteUserById(item)"></i>
                            </div>
                          </div>
                        </el-form-item>
                        <span
                          class="btn_succ operate-btn listUser-btn"
                          @click="showAddUser = true"
                        >选择</span>
                      </div>
                      
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </el-form>
      </div>
      <div class="section-item-header section-item-header-acsubmit"></div>
      <div
        class="box-bottom clearfix"
        style="display: flex;justify-content: center;margin-top:20px;"
      >
        <div class="btn_succ" @click="saveActivitySure(currentItem.id)">提交</div>
      </div>
    </div>
    <!-- 选择个人用户 -->
    <div
      is="addGroupModel"
      :users="userArr"
      :searchUser.sync="searchUser"
      :choosedUser.sync="modelInfo.users"
      :showModel.sync="showAddUser"
      :userCurrentPage.sync="userPage"
      :userPageCount.sync="userPageCount"
    ></div>
  </section>
</template>

<script>
import addGroupModel from "./components/addGroupModel";
export default {
  components: {
    addGroupModel,
  },
  data() {
    return {
      userPage:'1',
      userPageCount:'',

      SaveInfoModelUsers:[],//是否从提交过来的

      modelInfo:{
        users:[],
        user_flag:'2',
        //表单验证冗余字段
        _users:'',
      },
      userArr: [],
      showAddUser: false,
      searchUser: "",

      isShowWriteWord: false, //显示‘编辑活动’或者‘添加活动’
      currentPage: 1,
      page_count: 1,
      listLoading: false,
      currentItem: {
        id: 0,
      },
      groupInfo: {
        title: "",
        type: "",
        data_set:''
      },
      defaultUserId :'',
      defaultUserName:'',

      delete_id: "",
      dataRules: {
      },
      geruserOld:[]
    };
  },
  mounted() {
 
  },
  watch:{
    "userPage":{
      handler: function (newItem) {
          this.getPileUsers();
        //便点击，边向输入框填数据
        // this.getUsersById()
      },
      deep: true,
    },
    "showAddUser":{
      handler: function (newItem) {
        if(newItem == false){
          this.searchUser = '';
          this.getPileUsers();
          //拓展运算符，为了防止指针指向同一个地址，双向绑定
           //防止边点击，输入框边填进去数据
          this.SaveInfoModelUsers = [...this.modelInfo.users]
        }
      },
      deep: true,
    },
    "modelInfo.users":{
      handler: function (newItem,oldItem) {
        if(oldItem.length == 0) return ;
        //防止边点击，输入框边填进去数据
        //只要弹窗打开，左边填框里面的数据，都等于上次确认的数据
        if(this.showAddUser){
          this.modelInfo.users = this.SaveInfoModelUsers
        }
      },
      deep: true,
    }
  },
  created() {
    this.getPileUsers();
    //通过id,判断是从编辑页面过来才能填数据，保证刷新页面数据不丢失
    if (this.$route.query.id) {
      this.groupInfo.id = this.$route.query.id;
      this.$api.editGroupList({ id : JSON.parse(this.$route.query.id)}).then((data) => {
        if(data.code == 1 && data.data.length != 0){
          this.groupInfo.title = data.data.title;
          if(this.modelInfo.user_flag != '1'){
            this.modelInfo.users = data.data.exist_data.map((value) => {
              return value;
            })
            this.defaultUserName = data.data.exist_data
            this.defaultUserId = data.data.exist_data.map((value) => {
              return value.id;
            })
          }
        }
        //编辑页面图片能够显示
      });
      this.isShowWriteWord = true;
      this.currentItem.id = JSON.parse(this.$route.query.id);
    }
  },
  methods: {
    deleteUserById(id) {
      var index = this.modelInfo.users.indexOf(id);
      if (index > -1) {
        this.modelInfo.users.splice(index, 1);
      }
    },
    //加载到此页面  获取列表
     getPileUsers() {
      var _this = this;
      var params = {
        search: _this.searchUser,
        page : _this.userPage
      };
      //个人用户
      this.$api.getGroupUserName(params).then((res) => {
        if (res.code == 1) {
          //为了能在数据中找到这个值，翻页 的时候也能进行反显
          res.data.list.map((val) => {
              var _ind = this.geruserOld.indexOf(val);
              _ind != -1
                ? this.geruserOld.splice(val, 1)
                : this.geruserOld.push(val);
          })
          
          this.userArr = res.data.list;
          this.userPage = res.data.current_page;
          this.userPageCount = res.data.page_total;
        }
      });
    },
    //获取用户
    getUsersById(id, key) {
      if (this.userArr.length == 0) return "";
          var user = this.$utils.getArrayItem(this.geruserOld, "id", id);
          return user && user[key] ? user[key] : '';
    },
    //-----------------------------------------------------------------/
    handleBackAc(num) {
      this.$router.push({ path: "/vehicle/groupmanager" });
    },
    saveActivitySure(id) {
        // 验证是否上传了群组名称
      if(!this.groupInfo.title){
          this.$sfNotify({
              duration: 0,
              type: "error",
              message: '请上传群组名称',
          });
          return false;
      }
      this.groupInfo.type = this.modelInfo.user_flag
      if (id == 0) {
        // 添加
        this.$refs["groupInfo"].validate((valid) => {
          if (valid) {
            if(this.groupInfo.type != '1'){
              this.groupInfo.data_set = this.modelInfo.users
            }
            this.$api.addGroupList(this.groupInfo).then((data) => {
              if (data.code == 1) {
                this.$sfNotify({
                  message: "成功",
                });
                this.$router.push({ path: "/vehicle/groupmanager" });
              } else {
                this.$sfNotify({
                  duration: 0,
                  type: "error",
                  message: data.message,
                });
              }
            });
          } else {
            console.log("error add submit!!");
            return false;
          }
        });
      } else {
        this.$refs["groupInfo"].validate((valid) => {
          if (valid) {
            if(this.groupInfo.type != '1'){
              this.groupInfo.data_set = []
              if(this.defaultUserName == this.modelInfo.users){
                this.groupInfo.data_set = this.defaultUserId
              }else{
                this.groupInfo.data_set = this.modelInfo.users
              }
            }
            this.$api.updateGroupList(this.groupInfo).then((data) => {
          
              if (data.code == 1) {
                this.$sfNotify({
                  message: "成功",
                });
                // setTimeout(this.getTableDataList, 2000);
                this.$router.push({ path: "/vehicle/groupmanager" });
              } else {
                this.$sfNotify({
                  duration: 0,
                  type: "error",
                  message: data.message,
                });
              }
            });
          } else {
            console.log("error edit submit!!");
            return false;
          }
        });
      }
    },
  },
  destroyed() {
    document.documentElement.style.minWidth = "1200px";
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/vehicle/addgroup.scss";
</style>