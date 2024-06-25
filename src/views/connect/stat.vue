<template>
  <section>
    <div class="section-title">运营商统计</div>
    <div class="section-header">
      <div class="section-item-header clearfix">
        <span>筛选查询</span>
      </div>
      <div class="header-content clearfix">
        <div class="content-item">
          <div class="header-left">第三方运营商名称</div>
          <div class="header-right">
            <el-input
              class="search-input"
              v-model="modelObj.title"
              placeholder="关键字搜索"
            />
          </div>
        </div>
        <div class="content-item">
          <div class="header-left">关联关系</div>
          <div class="header-right">
            <el-select v-model="modelObj.access_type">
              <el-option label="全部" value="all" />
              <el-option label="互联互通" value="1" />
              <el-option label="接入" value="2" />
            </el-select>
          </div>
        </div>
        <div class="content-item">
          <div class="header-left">标记等级</div>
          <div class="header-right color-select-input">
            <div
              :class="[
                'color-header-logo color-select',
                {
                  'purple-select': modelObj.color == '3',
                  'red-select': modelObj.color == '1',
                  'yellow-select': modelObj.color == '2',
                  'bule-select': modelObj.color == '4',
                },
              ]"
            ></div>
            <el-select
              v-model="modelObj.color"
              popper-class="color-select-header"
            >
              <el-option label="全部" value="all" />
              <div
                class="color-select-list"
                v-for="(list, index) in select_List"
                :key="index"
              >
                <el-option :label="list.label" :value="list.value">
                  <div
                    :class="[
                      'color-select',
                      {
                        'purple-select': list.value == '3',
                        'red-select': list.value == '1',
                        'yellow-select': list.value == '2',
                        'bule-select': list.value == '4',
                      },
                    ]"
                  ></div>
                  <div class="label-word">{{ list.label }}</div>
                </el-option>
              </div>
            </el-select>
          </div>
        </div>
        <div class="content-item">
          <div class="header-left">排序方式</div>
          <div class="header-right">
            <el-select v-model="modelObj.order">
              <el-option label="接入最早" value="1" />
              <el-option label="营收最高" value="2" />
              <el-option label="接入设备最多" value="3" />
            </el-select>
          </div>
        </div>
        <div class="content-item">
          <div
            class="btn_succ"
            @click="search()"
          >查询</div>
          <div
            class="btn_cancel"
            @click="reset()"
          >重置</div>
        </div>
      </div>
    </div>
    <div class="section-container" v-loading="loading">
      <div class="section-main">
        <div class="header-content all-elec clearfix">
          <div class="checkbox-item checkbox-all">
            运营商列表
            <span
              >(
              *只展示已启用的接入运营商和互联互通运营商，且互联互通运营商只统计接入设备，数据统计截止到十分钟前
              )
            </span>
          </div>
        </div>
        <div>
          <!-- 分页 -->
          <sf-statpage
            v-show="tableData && tableData.length"
            :currentPage="currentPage"
            :page-count="page_count"
            :total-count="total_count"
            @limit-change="handleLimit"
            @current-change="handleCurrentChange"
          />
        </div>
        <div class="elec-same">
          <div
            v-for="(charging,index) in tableData"
            :key="charging.id"
            :class="[
              'section-list',
            ]"
            @click="jumpThrid(charging)"
          >
            <div
              class="ele-list-top"
              :class="[
                'title-background',
                {
                  'purple-background': charging.color == '3',
                  'red-background': charging.color == '1',
                  'yellow-background': charging.color == '2',
                  'bule-background': charging.color == '4',
                },
              ]"
            >
              <div class="elec-top-left">
                <span class="elec-top-right elec-top-right-pile">{{
                  charging.title
                }}</span>
              </div>
              <div class="elec-top-right">
                <div
                  :class="[
                    'color-select-logo color-select',
                    {
                      'purple-select': charging.color == '3',
                      'red-select': charging.color == '1',
                      'yellow-select': charging.color == '2',
                      'bule-select': charging.color == '4',
                    },
                  ]"
                ></div>
                <el-select
                  v-model="charging.color"
                  :popper-append-to-body="false"
                  class="color-select-box"
                  @change="changeCardColor(charging.id , charging.color)"
                >
                  <div
                    class="color-select-list"
                    v-for="(list, index) in select_List"
                    :key="index"
                  >
                    <el-option :label="list.label" :value="list.value">
                      <div
                        :class="[
                          'color-select',
                          {
                            'purple-select': list.value == '3',
                            'red-select': list.value == '1',
                            'yellow-select': list.value == '2',
                            'bule-select': list.value == '4',
                          },
                        ]"
                      ></div>
                      <div class="label-word">{{ list.label }}</div>
                    </el-option>
                  </div>
                </el-select>
              </div>
            </div>
            <div class="elec-list-center">
              <div class="elec-center-left">
                <div>
                  <span class="elec-center-word">关联关系：</span
                  ><span class="elec-center-content"
                    >{{
                      charging.access_type == '1' ? '互联互通' : '接入'
                    }}</span
                  >
                </div>
                <div>
                  <span class="elec-center-word">营收总额：</span
                  ><span class="elec-center-content"
                    >{{
                      charging.real_total ||  "--"
                    }} 元</span
                  >
                </div>
                <div>
                  <span class="elec-center-word">接入充电站：</span
                  ><span class="elec-center-content">{{
                    charging.station_num ||  "--"
                  }} 个</span>
                </div>
                <div>
                  <span class="elec-center-word">接入充电桩：</span
                  ><span class="elec-center-content">{{
                    charging.pile_number ||  "--"
                  }} 个</span>
                </div>
                <div>
                  <span class="elec-center-word">授权时间：</span
                  ><span
                    class="elec-center-content"
                    >{{
                      charging.create_time || '--'
                    }}</span
                  >
                </div>
                <div>
                  <span class="elec-center-word">联系人：</span
                  ><span class="elec-center-content">{{
                    charging.operator_people || "--"
                  }}</span>
                </div>
                <div>
                  <span class="elec-center-word">联系方式：</span
                  ><span class="elec-center-content">{{
                    charging.operator_tel || '--'}}</span>
                </div>
              </div>
              <div class="elec-center-right">
                <div
                    is="chargeStatusPie"
                    :refindex="index"
                    :statlist="charging.pile_data"
                    label="operator_stat_status"
                ></div>
              </div>
            </div>
          </div>
          <!-- 解决最后一行space-between的问题 -->
          <div
            class="section-list temp"
            v-for="(i, index) in 5"
            :key="i + index + '156'"
          ></div>
        </div>
        <div
          v-if="!tableData || tableData.length === 0"
          class="table-tr unData mintordetail-unData"
        >
          <img :src="require('assets/img/unData.png')" />
          <span>暂无数据</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import chargeStatusPie from './components/chargeStatusPie'
import sfStatpage from './components/statPage'

export default {
  components: {
    chargeStatusPie,
    sfStatpage,
  },
  data() {
    return {
      currentPage: 1,
      page_count: 1,
      total_count: 0,
      limit: '12',
      card_color: '',
      modelObj: {
        title: '',
        access_type: 'all',
        color: 'all',
        order: "1",
      },
      tableData: [],
      select_List: [
        { value: 3, label: "紫色", color: "#aa3cb4" },
        { value: 1, label: "红色", color: "#ff6632" },
        { value: 2, label: "黄色", color: "#fad346" },
        { value: 4, label: "蓝色", color: "#80adff" },
      ],
      loading: false,
    };
  },
  filters: {
    ellipsis(value) {
      if (!value) return "--";
      if (value.length > 22) {
        return value.slice(0, 22) + "...";
      }
      return value;
    },
  },
  created() {
    this.getTableDataList();
  },
  mounted () {
    // setTimeout(()=>{
    //     this.getRealtimeStatusData()
    // },1000)
  
  },
  methods: {
    jumpThrid(charging) {
      let routeData = this.$router.resolve({ path: "/stat/data/operation" , query: {
        title: charging.title,
        operator_id: charging.operator_id,
      }});
      window.open(routeData.href, '_blank');
    },
    handleLimit(limit) {
      this.limit = limit;
      this.currentPage = 1;
      this.getTableDataList();
    },
    // 点击分页触发
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getTableDataList();
    },
    // 获取充电枪的状态
    getTableDataList() {
      this.loading = true;
      this.modelObj.page = this.currentPage;
      this.modelObj.limit = this.limit;
      this.$api.getStatList(this.modelObj).then((data) => {
        this.loading = false;
        if (data.code == 1) {
          this.tableData = data.data.list;
          this.currentPage = data.data.current_page;
          this.page_count = data.data.page_total;
          this.total_count = data.data.total_count;
          // if (this.tableData && this.tableData.length) {
          //   this.station_arr = a;
          //   // this.tableData.forEach((e) => {
          //   //   this.station_ids.push({
          //   //     pile_sn: e.pile_sn,
          //   //     gun_sn: e.gun_sn,
          //   //     operator_id: e.operator_id,
          //   //   });
          //   // });
          //   // 模拟饼状图的循环
          //   this.tableData.forEach((e) => {
          //     e.data.push(
          //           {
          //               s_book_pile_total: "0",
          //               s_charging_pile_total: "0",
          //               s_idle_pile_total: "5",
          //               s_offline_pile_total: "109",
          //               s_pile_total: "114",
          //               s_ready_pile_total: "0",
          //           }
          //       );
          //   });
          // }
        }
      });
    },
    // 更改卡片颜色
    changeCardColor(id ,color) {
      this.$api.changeStatColor({id ,color}).then((data) => {
        this.loading = false;
        if (data.code == 1) {
          this.getTableDataList();
        }
      });
    },
    search() {
      this.currentPage = 1;
      this.tableData = [];
      this.getTableDataList();
    },
    reset() {
      this.modelObj = {
        title: '',
        access_type: 'all',
        color: 'all',
        order: "1",
        limit: '12',
      }
      this.currentPage = 1;
      this.page_count = 1;
      this.tableData = [];
      this.getTableDataList();
    },

  },
};
</script>
<style lang="scss">
.color-select-header {
  input {
    border-radius: 3px;
    background: transparent !important;
  }

  .el-select-dropdown .el-select-dropdown__item {
    height: 32px;
  }

  .color-select-list .el-select-dropdown__item {
    display: flex;
    align-items: center;
    padding-left: 6px;
    height: 32px;

    &:hover {
      background: #eeeeee;
    }

    .label-word {
      margin-left: 12px;
    }
  }
}
</style>
<style lang="scss" scoped>
@import "../../assets/css/connect/stat.scss";
</style>
