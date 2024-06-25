<template>
  <section>
    <div class="section-title">
      <router-link to="/activity/team">组队活动管理</router-link> > 组队活动详情
    </div>
    <div class="section-header">
      <div class="section-item-header">
        <a style="cursor: default">优惠活动信息</a>
      </div>
      <div class="header-content clearfix">
        <div class="content-top">
          <div class="top-item">
            <div class="top-item-title">创建时间</div>
            <div
              class="top-item-text ellipsis"
              :style="{fontSize:'18px',color:parseFloat(balance)?'#666666':'#666666'}"
            >
              {{ parseFloat(teamTop.create_time) ? teamTop.create_time : '--' }}
            </div>
          </div>
          <div class="top-item">
            <div class="top-item-title">活动名称</div>
            <div
              class="top-item-text ellipsis"
              :style="{fontSize:'18px',color:parseFloat(teamTop.title)?'#666666':'#666666'}"
            >
              {{ teamTop.title ? teamTop.title : '--' }}
            </div>
          </div>
        </div>
        <div class="content-bottom clearfix" v-loading="loading">
          <div class="top-left">
            <div class="bottom-list">
                <div class="bottom-item">
                <div class="bottom-item-left bottom-item-left-weektime">优惠周期：</div>
                <div class="bottom-item-right bottom-item-right-weektime">{{ teamTop.start_time }} 至 {{ teamTop.end_time }}</div>
                </div>
            </div>
            <div class="bottom-list">
                <div class="bottom-item">
                <div class="bottom-item-left">活动优惠：</div>
                <div class="bottom-item-right">赠送团队成员每人 {{ teamTop.number }} 张， {{ teamTop.discount }} 折优惠券，服务费满 {{ teamTop.min_good_amount }} 元可用，有效期 {{ teamTop.bonus_expire }} 天</div>
                </div>
            </div>
            <div class="bottom-list">
                <div class="bottom-item">
                <div class="bottom-item-left bottom-rule">活动规则：</div>
                <div class="bottom-item-right expandingArea">
                    <pre><span>{{teamTop.rule_describe}}</span><br></pre>
                    <textarea class="scrollBar" type="text" v-model="teamTop.rule_describe" placeholder="--" rows="1" readonly="readonly"></textarea>
                </div>
                </div>
            </div>  
          </div>
          <div class="top-right">
              <div class="bottom-list">
                <div class="bottom-item">
                <div class="bottom-item-left">活动条件：</div>
                <div class="bottom-item-right">团队最多 {{ teamTop.people_number }} 人，在 {{ teamTop.expire_day }} 天，支付金额满 {{ teamTop.total_amount }} 元</div>
                </div>
            </div>
            <div class="bottom-list">
                <div class="bottom-item">
                <div class="bottom-item-left bottom-item-canusestation">可用充电站：</div>
                <div class="bottom-item-right" v-if="teamTop.station_status == '1' "><p>全部可用</p></div>
                <div class="bottom-item-right expandingArea" v-else>
                    <pre><span>{{teamTop.station_info}}</span><br></pre>
                    <textarea class="scrollBar" type="text" v-model="teamTop.station_info" placeholder="--" rows="1" readonly="readonly"></textarea>
                </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="section-container">
      <div class="section-item-header">
        <span>组队活动参与信息</span>
      </div>
      <div class="section-main">
        <div class="header-content header-content-bottom clearfix">
          <div class="content-item">
            <div class="header-left">队伍名称</div>
            <div class="header-right">
              <el-input
                class="search-input"
                v-model="modelObj.search"
                placeholder="请输入关键字"
              />
            </div>
          </div>
          <div class="content-item">
            <div class="header-left">队伍状态</div>
            <div class="header-right">
              <el-select v-model="modelObj.status">
                <el-option label="全部" value="all" />
                <el-option label="进行中" value="1" />
                <el-option label="已结束" value="2" />
              </el-select>
            </div>
          </div>
          <div class="content-item">
              <div class="header-left">发券状态</div>
              <div class="header-right">
                <el-select v-model="modelObj.coupon_status">
                  <el-option label="全部" value="all" />
                  <el-option label="已发券" value="2" />
                  <el-option label="未发券" value="1" />
                </el-select>
              </div>
            </div>
          <div class="content-item">
            <div class="btn_succ" @click="searchStation()">查询</div>
            <div class="btn_cancel" @click="resetSearch()">重置</div>
          </div>
        </div>
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td">队伍名称</div>
            <div class="table-td">队伍周期</div>
            <div class="table-td">队伍密码</div>
            <div class="table-td">队伍人数</div>
            <div class="table-td">已支付金额（元）</div>
            <div class="table-td">队伍状态
            </div>
            <div class="table-td">发券状态
                <el-tooltip content="队伍结束后，1小时内系统发券" placement="top">
                    <div slot="content" style="line-height: 18px;width:200px;">
                        队伍结束后，1小时内系统发券
                    </div>
                    <div class="tips-icon"></div>
                </el-tooltip>
            </div>
            <div class="table-td">操作</div>
          </div>
          <div class="table-body" v-loading="listLoading">
            <div
              class="table-tr"
              v-show="teamBottom && teamBottom.length"
              v-for="(list, index) in teamBottom"
              :key="index"
            >
              <div class="table-td">
                <div class="td-item">{{ list.name != 'null' ? list.name : '--' }}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{ list.create_time }} <br> {{ list.expire_time }}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{ list.password ? list.password : '--' }}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{ list.people_number }}</div>
              </div>
              <div class="table-td">
                <div class="td-item">{{ list.max_spend_money }}</div>
              </div>
              <div class="table-td"
                :class="{ 
                    'section-running': list.group_status == 1,
                    'section-end': list.group_status == 2
                }"
              >
                <div class="td-item">{{ progress_array[list.group_status] }}</div>
              </div>
              <div class="table-td"
                :class="{ 
                    'section-running': list.status == 2,
                    'section-end': list.status != 2
                }"
              >
                <div class="td-item" v-if="list.status ==2">已发券</div>
                <div class="td-item" v-else>未发券</div>
              </div>
              <div class="table-td table-operate">
                  <el-tooltip
                    content="查看"
                    placement="top"
                    >
                    <div
                        class="td-item see-icon"
                        @click="checkTeamDetail(list.id)"
                    ></div>
                   </el-tooltip>
              </div>
            </div>
            <div
              class="table-tr unData"
              v-if="!teamBottom || teamBottom.length === 0"
            >
              <img :src="require('assets/img/unData.png')" />
              <span>暂无数据</span>
            </div>
          </div>
          <!-- 分页 -->
          <sf-pagination
            v-if="teamBottom && teamBottom.length > 0"
            :currentPage="currentPage"
            :page-count="page_count"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      progress_array: {
        1: "进行中",
        2: "已结束"
      },
      coupon_array: {
        2: "已发券",
        1: "未发券"
      },
      teamTop:{},
      teamBottom:{},
      //获取优惠活动下车辆的列表
      modelObj: {
        page : '',
        limit : '10',
        id: this.$route.query.id,
        search: '',
        status:'all',
        coupon_status:'all'
      },
      currentPage: 1,
      page_count: 1,
      listLoading: false,
      loading:false,
      balance: "",
    };
  },
  created() {
    this.getTableDataListTop();
    this.getTableDataListBottom();
  },
  methods: {
    getTableDataListTop() {
      this.loading = true;
      this.$api.teamDeatil({id : this.$route.query.id}).then((data) => {
        this.loading = false;
        if (data.code == 1) {
          this.teamTop = data.data
        }
      });
    },
    getTableDataListBottom() {
      this.listLoading = true;
      this.modelObj.page = this.currentPage;
      this.$api.checkteam(this.modelObj).then((data) => {
        this.listLoading = false;
        if (data.code == 1) {
          this.teamBottom = data.data.list
          this.currentPage = data.data.current_page;
          this.page_count = data.data.page_total;
        }
      });
    },
    checkTeamDetail(id) {
      this.$router.push({path:'/activity/team/checkteam/detail',query:{id : id,backId : this.$route.query.id}})
    },
    searchStation() {
      this.currentPage = 1;
      this.teamBottom = [];
      this.getTableDataListBottom();
    },
    resetSearch() {
      this.modelObj = {
        page : '1',
        limit: '10',
        id: this.$route.query.id,
        search: '',
        status:'all',
        coupon_status:'all'
      };
      this.currentPage = 1;
      this.page_count = 1;
      this.teamBottom = [];
      this.getTableDataListBottom();
    },
    // 点击分页触发
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getTableDataListBottom();
    },
  },
  destroyed() {
    document.documentElement.style.minWidth = "1300px";
  },
};
</script>
<style lang="scss">
.el-tooltip__popper.is-dark {
  max-width:180px;
}
</style>
<style lang="scss" scoped>
@import "../../assets/css/activity/teamCheck.scss";
</style>
