<template>
  <section>
    <div class="section-title">等级管理</div>
    <div class="section-container">
       <div class="section-item-router">
            <router-link
            to="/user/grade/class"
            >等级配置管理</router-link>
            <router-link to="/user/grade/score" class="section-act">积分配置管理</router-link>
            <router-link to="/user/grade/change">积分兑换管理</router-link>
            <router-link to="/user/grade/equity">权益配置管理</router-link>
       </div>
       <div class="section-item-header section-item-btn clearfix">
        <div class="btn_succ add-coupon" @click="addButton">
          <i class="add-station"></i>添加积分规则 
        </div>
        <div class="btn_delete instruction-btn" @click="checkInstruction">
          积分说明
        </div>
      </div>
      <div class="section-main">
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td">规则类型</div>
            <div class="table-td">赠送积分</div>
            <div class="table-td">选用站点</div>
            <div class="table-td">生效规则</div>
            <div class="table-td">操作</div>
          </div>
          <div
            class="table-body"
            v-loading="listLoading"
          >
            <div
              class="table-tr"
              v-show="tableData &&tableData.length > 0"
              v-for="(score, index) in tableData"
              :key="index"
            >
              <div class="table-td">
                 <div class="td-item">{{score_type_array[score.type]}}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{score.amount}}</div>
              </div>
              <div class="table-td">
                <div class="td-item" v-if="score.type == 1">
                  <el-tooltip :content="score.stations_str" placement="top">
                    <span style="max-width:140px;" class="item-text scrollBar">{{score.stations_str | ellipsis}}</span>
                  </el-tooltip>
                </div>
                <div class="td-item" v-else>
                  --
                </div>
              </div>
              <div class="table-td">
                <div class="td-item" v-if="score.type == 1">账单支付完成</div>
                <div class="td-item" v-else>每日首次登录</div>
              </div>
              <div class="table-td table-operate">
                <el-tooltip
                  content="编辑"
                  placement="top"
                >
                  <div class="td-item edit-icon" @click="editButton(score)"></div>
                </el-tooltip>
                <el-tooltip
                  content="删除"
                  placement="top"
                >
                  <div class="td-item delete-icon" @click="delScore(score.id)"></div>
                </el-tooltip>
              </div>
            </div>
            <div
              v-if="!tableData || tableData.length == 0"
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
    <!-- 添加/修改积分规则 -->
    <sf-modelBox
      class="score-box"
      :showModel.sync="showGradeScoreInfo"
      :title="currentItem.id== 0 ? '添加积分规则' : '修改积分规则'"
      @change="saveAlarmInfo(currentItem.id)"
    >
      <el-form
        :model="gradeScoreInfo"
        ref="gradeScoreInfo"
        :rules="dataRules"
      >
      <div class="box-list">
          <div class="box-left">规则类型</div>
          <div class="box-right score-radio-btn">
            <el-form-item class="radio-outer">
              <el-radio v-model="gradeScoreInfo.type" label="1"
                >站点充电</el-radio
              >
              <el-radio v-model="gradeScoreInfo.type" label="2"
                >登录触发</el-radio
              >
            </el-form-item>
            <span class="score-only-one" v-if="gradeScoreInfo.type ==1">
              * 每个充电站只能有一条积分规则
            </span>
            <span class="score-only-one" v-else>
              * 登录触发只可以设置一次
            </span>
          </div>
        </div>
        <div class="box-list">
          <div class="box-left">赠送积分</div>
          <div class="box-right">
            <el-form-item prop="amount">
              <el-input
                class="el-input-falut"
                v-model="gradeScoreInfo.amount"
                placeholder="请输入赠送积分数"
              />
              <span class="score-give">分</span>
            </el-form-item>
          </div>
        </div>
        <div class="box-list">
          <div class="box-left">生效规则</div>
          <div class="box-right">
            <el-form-item >
              <el-input
                class="el-input-falut"
                value="账单支付完成"
                :disabled="true"
                v-if="gradeScoreInfo.type ==1"
              />
              <el-input
                      class="el-input-falut"
                      value="每日首次登录"
                      :disabled="true"
                      v-else
              />
            </el-form-item>
          </div>
        </div>
        <div class="box-list" v-if="gradeScoreInfo.type != '2'">
          <div class="box-left">适用站点</div>
          <div class="box-right">
            <div class="checkbox-item checkbox-all">
              <span class="checkbox-icon" :class="{'checkbox-act-icon' : checkbox_all}" @click="handleCheckedAll"></span>全选
            </div>
            <!-- 权限列表 -->
            <div class="auth-outer scrollBar" v-if="station_arr && station_arr.length != 0">
              <div class="checkbox-item"
                 v-for="(station, index) in station_arr"
                 :key="index"
              >
                <span class="checkbox-icon"
                  :class="{'checkbox-act-icon': gradeScoreInfo.stations.indexOf(station.station_id) != -1}"
                  @click="handleChecked(station.station_id)"
                ></span>{{station.station_name}}
              </div>
            </div>
            <div
              v-if="!station_arr || station_arr.length === 0"
              class="table-tr unData auth-outer team-add-no-station"
            >
              <img :src="require('assets/img/unData.png')" />
              <span>暂无数据</span>
            </div>
          </div>
        </div>
      </el-form>
    </sf-modelBox>
    <!-- 删除确认 -->
    <sf-modelBox
      :showModel.sync="showDelete"
      title="删除确认"
      type="delete"
      @change="saveDeleteSure"
    >
      <p>确定要删除此规则吗？</p>
    </sf-modelBox>
  </section>
</template>

<script>
export default {
  data() {
    return {
      //列表数据
      currentPage: 1,
      page_count: 10,
      tableData: [],
      listLoading: false,
      score_type_array: {
        "1": "站点充电",
        "2": "登录触发"
      },
      showGradeScoreInfo: false,
      showDelete: false,
      currentItem: {
        id: 0
      },
      gradeScoreInfo: {
        amount: "",
        type: "1",
        stations: []
      },
      dataRules: {
        amount: [
          { required: true, message: "* 请输入赠送积分", trigger: "blur" }
        ]
      },
      del_score_id: "",
      
      station_arr: [],
      station_ids: [],
      checkbox_all : false,
    };
  },
  filters: {
    ellipsis(value) {
      if (!value) return "--";
      if (value.length > 41) {
        return value.slice(0, 41) + "...";
      }
      return value;
    }
  },
  created() {
    this.getTableDataList();
  },
  // watch:{
  //   'checkbox_all': function(val,olitm){
  //     console.log('vall',val,olitm);
  //   }
  // },
  methods: {
    checkInstruction(){
      this.$router.push({path : '/user/grade/score/instructe'})
    },
    //添加按钮操作
    addButton(){
      this.checkbox_all = false;
      this.showGradeScoreInfo = true;
      this.currentItem.id = 0;
      this.gradeScoreInfo.type='1'
      this.gradeScoreInfo.amount = ''
      this.gradeScoreInfo.stations = [];
      this.getAvailableStations(0)
    },
    //修改按钮操作
    editButton(row){
      this.currentItem.id = row.id;
      this.gradeScoreInfo.type= row.type
      this.gradeScoreInfo.amount = row.amount
      this.showGradeScoreInfo = true;
      this.gradeScoreInfo.stations = [];
      if(row.type == 1){
        this.getAvailableStations(row.id)
      }else{
        this.getAvailableStations(0)
      }
    },
    //获取列表的数据
    getTableDataList() {
      this.listLoading = true;
      this.$api.gradeList({ page: this.currentPage }).then(data => {
        this.listLoading = false;
        if (data.code == 1) {
          this.tableData = data.data.list;
          this.currentPage = data.data.current_page;
          this.page_count = data.data.page_total;
        }
      });
    },
    // 点击分页触发
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getTableDataList();
    },
    //获取可选充电站
    getAvailableStations(id) {
      let that = this;
      this.$api.gradeStationList({id:id}).then(data => {
        if (data.code == 1) {
          //判断是否是路由过来的：路由过来的需要判断是否全选；非路由过来的全选默认false
          if(id != 0){
            this.station_arr = data.data;
            let _station = data.data;
            if(_station && _station.length > 0){
              _station.forEach((e) => {
                if(e.use ==  1){
                  this.gradeScoreInfo.stations.push(e.station_id)
                }
                this.station_ids.push(e.station_id);
              })
            }
            this.checkbox_all = this.gradeScoreInfo.stations.length == _station.length ? true : false;
          }else{
            this.station_arr = data.data;
            let list = data.data;
            list.forEach(function (e) {
              that.station_ids.push(e.station_id);
            })
          }
        }
      });
    },
    //选择全部
    handleCheckedAll(){
      this.gradeScoreInfo.stations = this.checkbox_all ? []: JSON.parse(JSON.stringify(this.station_ids));
      this.checkbox_all = !this.checkbox_all;
    },
    //单个选中
    handleChecked(id){
      let arr = this.gradeScoreInfo.stations;
      if(arr.indexOf(id) != -1){
        arr.splice(arr.indexOf(id),1);
      }else{
        arr.push(id);
      }
      this.checkbox_all = arr.length == this.station_arr.length ? true:false;
    },
    //添加保存or修改保存
    saveAlarmInfo(id) {
      //验证规则
      if(this.gradeScoreInfo.type == 1 && !this.gradeScoreInfo.stations){
        this.$sfNotify({
          duration: 0,
          type: "error",
          message: "适用站点不能为空"
        });
        return false;
      }
      if(!this.gradeScoreInfo.amount){
        this.$sfNotify({
          duration: 0,
          type: "error",
          message: "赠送积分不能为空"
        });
        return false;
      }
      //添加
      if(id == 0){
        this.$api.createGrade(this.gradeScoreInfo).then(data=>{
          if(data.code == 1){
            this.showGradeScoreInfo = false;
            this.$sfNotify({
              message: "成功"
            });
            this.getTableDataList()
          }else{
            this.$sfNotify({
              duration: 0,
              type: "error",
              message: data.message
            });
          }
        })
      }
      //编辑
      if(id != 0){
        this.gradeScoreInfo.id = this.currentItem.id
        this.$api.updateGrade(this.gradeScoreInfo).then(data=>{
          if(data.code == 1){
            this.showGradeScoreInfo = false;
            this.$sfNotify({
              message: "成功"
            });
            this.getTableDataList()
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
    //删除操作
    delScore(id) {
      this.del_score_id = id;
      this.showDelete = true;
    },
    //执行删除操作
    saveDeleteSure() {
      this.$api.deleteGrade({id: this.del_score_id}).then(data => {
        this.showDelete = false;
        if (data.code == 1) {
          this.$sfNotify({
            message: "成功"
          });
          this.getTableDataList();
        } else {
          this.$sfNotify({
            duration: 0,
            type: "error",
            message: "失败"
          });
        }
      });
    },
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/user/gradeScore.scss";
</style>
