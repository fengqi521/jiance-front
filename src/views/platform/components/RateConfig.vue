<template>
  <div class="rate-wrapper">
    <!-- 头部 -->
    <div class="rate-head">
      <!-- <span class="rate-title">银行转账手续费</span> -->
      <div class="btn_succ add-btn" @click="handleAdd">添加手续费</div>
    </div>
    <!-- table表格 -->
    <div class="table-body scrollBar">
      <div class="table-tr" v-for="(list, index) in value" :key="index">
        <div class="table-td">
          <div class="td-item">{{ list.start_amount }}元{{ Number(list.end_amount) ? `至${list.end_amount}元(含)` : '以上金额' }}
          </div>
        </div>
        <div class="table-td">
          <div class="td-item">
            {{ list.type === '2' ? `${list.ratio}%/笔 最高` : '' }}收取
            {{ list.type === '2' ? list.each_max_amount : list.each_amount }}元/笔</div>
        </div>
        <div class="table-td table-td-small">
          <el-tooltip content="编辑" placement="top">
            <div class="td-item edit-icon" @click="handleEdit(index)"></div>
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <div class="td-item delete-icon" @click="handleDelete(index)"></div>
          </el-tooltip>
          <!-- @onConfirm="deleteSpu(row)" -->
          <!-- <el-popconfirm title="这是一段内容确定删除吗？">
            <template #reference>
              <el-tooltip effect="light" content="删除" placement="top">
                <div class="td-item delete-icon"></div>
              </el-tooltip>
            </template>
          </el-popconfirm> -->
        </div>
      </div>
      <div v-if="!value || !value.length" class="table-tr unData">
        <img :src="require('assets/img/unData.png')" />
        <span>暂无数据</span>
      </div>
    </div>
    <!-- 添加手续费弹窗 -->
    <sf-modelBox class="addModal" :showModel.sync="show" :title="`${currentId > -1 ? '修改' : '新增'}银行转账手续费配置`"
      @change="handleAddRate">
      <el-form :model="info" ref="info" :rules="dataRules">
        <div class="box-list amount-input-group">
          <el-form-item prop="start_amount">
            <el-input v-model="info.start_amount" placeholder="请输入最小金额"
              oninput="value=value.replace(/^0+(\d)|[^\d]+/g,'')" />
          </el-form-item>
          <span>&lt;转账金额&lt;=</span>
          <el-form-item>
            <el-input v-model="info.end_amount" placeholder="请输入最大金额"
              oninput="value=value.replace(/^0+(\d)|[^\d]+/g,'')" />
          </el-form-item>
        </div>
        <div class="box-list">
          <el-radio v-model="info.type" label="1">按单笔</el-radio>
          <el-radio v-model="info.type" label="2">按比率</el-radio>
        </div>
        <div class="box-list" v-if="info.type !== '2'">
          <div class="box-left">单笔固定</div>
          <div class="box-right">
            <el-form-item prop="each_amount">
              <el-input v-model="info.each_amount" placeholder="请输入单笔固定金额"
                oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{4,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')" />
            </el-form-item>
          </div>
          <span class="box-unit">元</span>
        </div>
        <div class="box-list" v-if="info.type !== '1'">
          <div class="box-left">比率</div>
          <div class="box-right">
            <el-form-item prop="ratio">
              <el-input v-model="info.ratio" placeholder="请输入比率"
                oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{4,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/, '$1$2.$3').replace(/^\./g, '')" />
            </el-form-item>
          </div>
          <span class="box-unit">%</span>
        </div>
        <div class="box-list" v-if="info.type !== '1'">
          <div class="box-left">单笔最高</div>
          <div class="box-right">
            <el-form-item prop="each_max_amount">
              <el-input v-model="info.each_max_amount" placeholder="请输入单笔最高金额"
                oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{4,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')" />
            </el-form-item>
          </div>
          <span class="box-unit">元</span>
        </div>
      </el-form>
    </sf-modelBox>

    <!-- 删除 -->
    <sf-modelBox :showModel.sync="showDelete" title="删除银行转账手续费配置" type="delete" @change="handleDeleteRate">
      <p>确认删除该转账手续费配置?</p>
    </sf-modelBox>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      show: false,
      showDelete: false,
      currentId: -1,
      info: {
        start_amount: "",
        end_amount: "",
        type: "1",
        each_amount: "",
        ratio: "",
        each_max_amount: ""
      },
      dataRules: {
        start_amount: [{ required: true, message: '* 最小金额必填', trigger: 'blur' }],
        end_amount: [{ required: true, message: '* 最大金额必填', trigger: 'blur' }],
        each_amount: [{ required: true, message: '* 单笔固定金额必填', trigger: 'blur' }],
        each_max_amount: [{ required: true, message: '* 单笔最高金额必填', trigger: 'blur' }],
        ratio: [{ required: true, message: '* 比率必填', trigger: 'blur' }],
      }
    }
  },
  watch: {
    'info.type' (val) {
      const el = this.$refs['info']
      if (val === '1') {
        el && el.clearValidate(['ratio', 'each_max_amount'])
        return;
      }
      el && el.clearValidate('each_amount')
    }
  },
  methods: {
    //  添加手续费
    async handleAddRate () {
      const valid = await this.$refs['info'].validate().catch(err => err)
      if (!valid) return;
      const values = [...this.value]
      if (this.currentId > -1) {
        values.splice(this.currentId, 1, this.info)
      } else {
        values.push(this.info)
      }

      this.$emit('input', values)
      this.show = false;
    },

    // 删除手续费
    handleDeleteRate () {
      const values = [...this.value]
      if (this.currentId > -1) values.splice(this.currentId, 1)
      this.$emit('input', values)
      this.showDelete = false;
    },

    // 添加
    handleAdd () {
      this.currentId = -1;
      this.info = {
        start_amount: "",
        end_amount: "",
        type: "1",
        each_amount: "",
        ratio: "",
        each_max_amount: ""
      }

      this.show = true;
    },

    // 编辑
    handleEdit (ind) {
      try {
        this.info = { ...this.value[ind] }
        this.currentId = ind;
        this.show = true;
      } catch (err) {
        console.log(err)
      }
    },

    // 删除
    handleDelete (ind) {
      this.currentId = ind;
      this.showDelete = true;
    }
  }
}
</script>
<style lang="scss" scoped>
.rate-wrapper {
  width: 100%;
  border: 1px solid #E0E0E0;
  padding: 10px 12px 24px;
  border-radius: 3px;
}

.rate-head {
  display: flex;
  justify-content: end;
  margin-bottom: 10px;

  .rate-title {
    font-size: 12px;
    color: #666;
    line-height: 28px;
  }

  .add-btn {
    float: none;
    height: 28px;
    line-height: 28px;
    font-size: 12px;
    width: 110px;
    margin-bottom: 10px;
  }
}

.table-body {
  border: 1px solid #e0e0e0;
  border-radius: 3px;
  max-height: 182px;
  overflow-y: auto;
}

.table-tr {
  height: 36px;
  border-bottom: 1px solid #e0e0e0;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #fff;
  }

  .table-td-small {
    flex: 0.4
  }
}

.table-td:not(:first-child) {
  border-left: 1px solid #e0e0e0;
}

.addModal {
  .amount-input-group {
    display: flex;
    align-items: center;

    .el-form-item {
      width: calc((100% - 75px)/2);
    }
  }

  .box-list {
    display: flex;

    .box-left {
      float: none;
      min-width: 48px;
    }

    .box-right {
      flex: 1;
      margin-inline: 10px;
    }

    .box-unit {
      align-self: center;
    }

    .el-radio {
      margin-right: 24px;
    }
  }

}
</style>