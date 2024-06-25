<template>
  <section>
    <div class="section-title">短信管理</div>
    <div class="section-container">
      <div class="section-item-header">
        <span>短信配置管理</span>
      </div>
      <div class="section-main">
        <div class="table">
          <div class="table-th clearfix">
            <div class="table-td table-column__1">模板名称</div>
            <div class="table-td table-column__2">模板ID</div>
            <div class="table-td table-column__2">模板签名</div>
            <div class="table-td table-column__3">模板内容</div>
            <div class="table-td table-column__2">状态</div>
          </div>
          <div class="table-body" v-loading="listLoading">
            <div
              class="table-tr"
              v-show="tableData && tableData.length"
              v-for="(item, index) in tableData"
              :key="index"
            >
              <div class="table-td table-column__1">
                <div class="td-item">{{ item.template_name }}</div>
              </div>
              <div class="table-td table-column__2">
                <div class="td-item">{{ item.template_id }}</div>
              </div>
              <div class="table-td table-column__2">
                <div class="td-item">{{ item.sign }}</div>
              </div>
              <div class="table-td table-column__3">
                <div class="td-item">{{ item.template_content }}</div>
              </div>
              <div class="table-td table-column__2">
                <el-tooltip
                  v-if="item.status == 1 && !item.is_close"
                  content="不可停用"
                  placement="top"
                >
                  <div
                    :class="['knob', 'knob-forbid']"
                    @click="updateStatus(item)"
                  ></div>
                </el-tooltip>
                <div
                  v-else
                  :class="['knob', item.status == 1 ? 'started' : '']"
                  @click="updateStatus(item)"
                ></div>
                <div class="knob-text">
                  {{ item.status == 1 ? "开启" : "关闭" }}
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="!tableData || tableData.length == 0"
            class="table-tr unData"
          >
            <img :src="require('assets/img/unData.png')" />
            <span>暂无数据</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data () {

    return {
      showStop: false,
      user_id: this.$route.params.id,
      password: "text",


      title: '',

      content: '',

      stopChargeParam: {
        out_trade_id: '',
      },
      currentPage: 1,
      page_count: 1,
      listLoading: false,
      tableData: [],

    };
  },
  created () {
    this.getTableDataList();
  },
  methods: {

    getTableDataList () {
      this.listLoading = true;
      this.$api.getSmsList().then(data => {
        this.listLoading = false;
        if (data.code == 1) {
          this.tableData = data.data;
        }
      });
    },
    //修改启用停用状态
    updateStatus (item) {
      if (item.status == 1 && !item.is_close) return;
      const id = item.id;

      let status = item.status;
      if (status == 1) {
        status = 0;
      } else {
        status = 1;
      }

      this.$api
        .updateSmsStatus({ 'id': id, 'status': status })
        .then((res) => {
          if (res.code === 1) {
            this.$sfNotify({
              message: "成功",
            });
            this.getTableDataList();
          } else {
            this.$sfNotify({
              duration: 0,
              type: "error",
              message: res.message,
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },


  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/auth/smsList.scss";
</style>
