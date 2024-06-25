<template>
  <section>
    <div class="section-title">设备监控</div>
    <div class="section-header">
      <div class="section-item-header clearfix">
        <span>筛选查询</span>
      </div>
      <div class="header-content clearfix">
        <div class="content-item">
          <el-select class="search-type" v-model="modelObj.search_type">
            <el-option label="充电站ID" value="1" />
            <el-option label="充电站名称" value="2" />
            <!-- <el-option label="所属运营商" value="3" /> -->
          </el-select>
          <el-input
                  class="search-input"
                  v-model="modelObj.words"
                  placeholder="关键字搜索"
          />
        </div>
        <div class="content-item">
          <div class="header-left">运营状态</div>
          <div class="header-right">
            <el-select v-model="modelObj.station_status">
              <el-option label="全部" value="" />
              <el-option label="建设中" value="1" />
              <el-option label="关闭下线" value="5" />
              <el-option label="维护中" value="6" />
              <el-option label="正常使用" value="50" />
              <el-option label="未知" value="0" />
            </el-select>
          </div>
        </div>
        <div class="content-item">
          <div class="header-left">充电站类型</div>
          <div class="header-right">
            <el-select v-model="modelObj.station_type">
              <el-option label="全部" value="" />
              <el-option label="公共" value="1" />
              <el-option label="个人" value="50" />
              <el-option label="公交（专用）" value="100" />
              <el-option label="环卫（专用）" value="101" />
              <el-option label="物流（专用）" value="102" />
              <el-option label="出租车（专用）" value="103" />
              <el-option label="其他" value="255" />
            </el-select>
          </div>
        </div>
        <div class="content-item">
          <div class="btn_succ" @click="searchStation(false)">查询</div>
          <div class="btn_cancel" @click="searchStation(true)">重置</div>
        </div>
      </div>
    </div>
    <div class="section-container">
      <div class="section-item-header clearfix">
        <span>充电站列表</span>
      </div>
      <div class="section-main" v-loading="loading">
        <div class="header-content" v-for="m_list in mintorList" :key="m_list.station_id"  @click="handleMonitor(m_list)">
          <div class="header-left">
            <div class="mintor-title">{{m_list.station_name}}（{{m_list.p_name}}）</div>
            <div><span class="mintor-title-left">地址：</span> <span class="mintor-title-right">{{m_list.address}}</span></div>
            <div class="mintor-type"><span class="mintor-title-left">直流充电枪：</span><span class="mintor-title-right">{{m_list.direct}} 个</span> <span class="mintor-title-left">交流充电枪：</span><span class="mintor-title-right">{{m_list.alternating_current}} 个</span></div>
            <div class="mintor-time"><span class="mintor-title-left">开放时间：</span><span :class="['mintor-title-right',m_list.is_open != 1 ? 'mintor-title-right-none' : '']">{{ m_list.is_open == 1 ? m_list.busine_hours : '未开放'}}</span> <span class="mintor-title-left">运营商：</span><span class="mintor-title-right">{{m_list.title}}</span></div>
          </div>
          <div class="header-right">
            <img :src="`${ENV}${m_list.nav_url}`" alt="">
          </div>
        </div>
        <div v-if="!mintorList || mintorList.length === 0" class="table-tr unData mintor-unData">
          <img :src="require('assets/img/unData.png')" />
          <span>暂无数据</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    data() {
      return {
        mintorList : [],
        modelObj: {
          search_type: "2",
          words: "",
          station_status: "",
          station_type: "",
        },
        ENV: process.env.NODE_ENV == "development" ? "/api" : "",
        listLoading: false,
        monitorInfo: {
          img_url: ""
        },
        real_img_url: "",
        loading: false,
      };
    },
    created() {
      this.getElecList();
    },
    // filters: {
    //   stationsellipsis(value){
    //     if (!value) return '--'
    //     if (value.length > 38) {
    //       return value.slice(0,49) + '...'
    //     }
    //     return value
    //   }
    // },
    methods: {
      searchStation(reset) {
        if (reset) {
          this.modelObj = {
            search_type: "1",
            words: "",
            station_status: "",
            station_type: "",
          };
        }
        this.mintorList = [];
        this.getElecList();
      },
      getElecList() {
        this.loading = true;
        this.$api.getElecList(this.modelObj).then(data => {
          if(data.code == 1) {
            this.loading = false;
            this.mintorList = data.data;
            // this.real_img_url = `${this.ENV}${this.activitInfo.img_url}`;
          }
        });
      },
      handleMonitor(val ){
        this.$router.push({path:'/run/monitor/detail',query :{
            id : val.station_id,
            station_name : val.station_name
          }})
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../assets/css/run/monitor.scss";
</style>
