<template>
  <section>
    <div class="section-title">运营商授权</div>
    <div class="section-tips">
      <i class="warning-icon"></i>
      <div class="section-tips-content">
        <p class="tips-text">
          注意：互联互通的关联关系包括互联互通、接入、授权三种
        </p>
        <p class="tips-text">
          【互联互通】与第三方运营商互相打通权限，双方可以使用彼此的桩
        </p>
        <p class="tips-text">
          【接入】单向接入第三方运营商的桩的使用权限，对方无法使用我方的桩
        </p>
        <p class="tips-text">
          【授权】单向授权第三方运营商使用我方桩的权限，我方无法使用对方的桩
        </p>
      </div>
    </div>

    <div class="section-header">
      <div class="section-item-router">
        <router-link to="/connect/operator" class="section-act">中电联、联行配置</router-link>
        <router-link to="/connect/operator/caocao">曹操出行配置</router-link>
      </div>
      <div class="header-content clearfix">
        <div class="content-item">
          <div class="header-left">组织机构代码</div>
          <div class="header-right">
            <el-input class="search-input" v-model="modelObj.operator_id" placeholder="输入组织机构代码" />
          </div>
        </div>
        <div class="content-item">
          <div class="header-left">第三方运营商名称</div>
          <div class="header-right">
            <el-input class="search-input" v-model="modelObj.title" placeholder="输入第三方运营商名称" />
          </div>
        </div>
        <div class="content-item">
          <div class="header-left">关联关系</div>
          <div class="header-right">
            <el-select v-model="modelObj.type">
              <el-option label="全部" value="all" />
              <el-option label="互联互通" value="1" />
              <el-option label="接入" value="2" />
              <el-option label="授权" value="3" />
            </el-select>
          </div>
        </div>
        <div class="content-item">
          <div class="btn_succ" @click="getContentList">查询</div>
          <div class="btn_cancel" @click="resetBtn">重置</div>
        </div>
      </div>
    </div>
    <div class="section-container">
      <div class="section-item-header clearfix">
        <span>运营商列表</span>
        <div class="btn_succ add-coupon" @click="handleAdd(0)">
          <i class="add-station"></i>添加运营商
        </div>
      </div>
      <div class="section-main">
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td">组织机构代码</div>
            <div class="table-td">第三方运营商名称</div>
            <div class="table-td">联系人</div>
            <div class="table-td">联系电话</div>
            <div class="table-td">关联关系</div>
            <div class="table-td">启用/停用</div>
            <div class="table-td">操作</div>
          </div>
          <div class="table-body" v-loading="loadingFlag">
            <div class="table-tr" v-show="tableData && tableData.length > 0" v-for="(item, index) in tableData"
              :key="index">
              <div class="table-td">
                <div class="td-item">{{ item.operator_id }}</div>
              </div>
              <div class="table-td">
                <div class="td-item">
                  {{ item.title ? item.title : "暂无" }}
                </div>
              </div>
              <div class="table-td">
                <div class="td-item">
                  {{ item.operator_people ? item.operator_people : "暂无" }}
                </div>
              </div>
              <div class="table-td">
                <div class="td-item">{{ item.operator_tel }}</div>
              </div>
              <div class="table-td">
                <div class="td-item" v-if="parseInt(item.access_type) == 1">
                  互联互通
                </div>
                <div class="td-item" v-else-if="parseInt(item.access_type) == 2">
                  接入
                </div>
                <div class="td-item" v-else-if="parseInt(item.access_type) == 3">
                  授权
                </div>
                <div class="td-item" v-else>其他</div>
              </div>
              <div class="table-td">
                <div class="table-td table-column__2">
                  <div :class="[
                    'knob',
                    item.operator_status == 1 ? 'started' : '',
                  ]" @click="changeStatus(item)"></div>
                  <div class="knob-text">
                    {{ item.operator_status == 1 ? "启用" : "停用" }}
                  </div>
                </div>
              </div>
              <div class="table-td table-operate">
                <el-tooltip content="查看" placement="top">
                  <div class="td-item see-icon" @click="handleDetail(item.id)"></div>
                </el-tooltip>
                <el-tooltip content="编辑" placement="top">
                  <div class="td-item edit-icon" @click="handleAdd(item.id)"></div>
                </el-tooltip>
                <el-tooltip v-if="item.access_type != '2'" content="关联" placement="top">
                  <router-link class="td-item connect-icon" :to="`/connect/operator/accept/${item.id}`"></router-link>
                </el-tooltip>
              </div>
            </div>
            <div v-if="!tableData || tableData.length == 0" class="table-tr unData">
              <img :src="require('assets/img/unData.png')" />
              <span>暂无数据</span>
            </div>
          </div>
          <!-- 分页 -->
          <sf-pagination v-if="tableData && tableData.length > 0" :currentPage="currentPage" :page-count="page_count"
            @current-change="handleCurrentChange" />
        </div>
      </div>
    </div>
    <!-- 启用确认 -->
    <sf-modelBox :showModel.sync="showStartSure" title="启用确认" @change="saveOperatorStatus">
      <p>是否启用和“{{ operator_name }}”的互联互通功能？</p>
    </sf-modelBox>
    <!-- 停用确认 -->
    <sf-modelBox type="delete" :showModel.sync="showStopSure" title="停用确认" @change="saveOperatorStatus">
      <p>
        是否确认停用“{{
          operator_name
        }}”的互联互通功能，停用后，将解除与该运营商的所有关联关系
      </p>
    </sf-modelBox>
  </section>
</template>

<script>
export default {
  data () {
    return {
      modelObj: {
        operator_id: "",
        title: "",
        type: "all",
      },
      pay_type: 2,
      currentPage: 1,
      page_count: 1,
      tableData: [{}],
      loadingFlag: false,
      showStartSure: false,
      showStopSure: false,
      //修改运营商的状态
      operator_id: "",
      operator_status: "",
      operator_name: "",
    };
  },
  created () {
    this.getContentList();
  },
  methods: {
    // 点击分页触发
    handleCurrentChange (page) {
      this.currentPage = page;
      this.getContentList();
    },
    resetBtn () {
      this.modelObj = {
        operator_id: "",
        title: "",
        type: "all",
      };
      this.currentPage = 1;
      this.getContentList();
    },
    handleDetail (id) {
      this.$router.push(`/connect/operator/detail/${id}`);
    },
    handleAdd (id) {
      this.$router.push(`/connect/operator/add/${id}`);
    },
    getContentList () {
      var that = this;
      that.loadingFlag = true;
      this.modelObj.page = this.currentPage;
      this.$api.getConnectList(this.modelObj).then((res) => {
        if (res.code == 1) {
          that.page_count = Math.ceil(res.data.total_count / 10);
          that.currentPage = res.data.current_page;
          that.tableData = res.data.list;
        }
        that.loadingFlag = false;
      });
    },
    changeStatus (item) {
      let is_run_now = item.operator_status;
      this.operator_name = item.title;
      this.operator_id = item.id;
      if (is_run_now == 1) {
        this.operator_status = 2;
        this.showStopSure = true;
      }
      if (is_run_now == 2) {
        this.operator_status = 1;
        this.showStartSure = true;
      }
    },
    //开启停用接口
    saveOperatorStatus () {
      this.showStartSure = false;
      this.showStopSure = false;
      this.$api
        .operatorStatus({
          operator_id: this.operator_id,
          operator_status: this.operator_status,
        })
        .then((data) => {
          console.log(data);
          if (data.code == 1) {
            this.$sfNotify({
              message: "成功",
            });
            this.getContentList();
          } else {
            this.$sfNotify({
              duration: 0,
              type: "error",
              message: data.message,
            });
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/connect/index.scss";
</style>